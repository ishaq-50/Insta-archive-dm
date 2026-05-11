"""
Instagram DM Archive Viewer — Flask Backend
=============================================
Loads all message_*.json files from /messages, merges them into
one chronological timeline, fixes Instagram's broken Unicode encoding,
and serves everything through a clean API.
"""

import json
import glob
import os
from datetime import datetime, timezone, timedelta
from flask import Flask, render_template, send_from_directory, jsonify, request

# ─── Configuration ──────────────────────────────────────────────────────────────

# Map raw export names → display names.
# "Me" always renders on the right side of the chat.
DISPLAY_NAMES = {
    "Instagram User": "Rayyan",
    "محمد إسحاق": "Me",
}

# Which display name is "me" (rendered on right side)?
ME_LABEL = "Me"

# How many messages to send per page (infinite-scroll pagination)
PAGE_SIZE = 80

# ─── App Setup ──────────────────────────────────────────────────────────────────

app = Flask(__name__)
MESSAGES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "messages")

# ─── Unicode Fixer ──────────────────────────────────────────────────────────────

def fix_instagram_encoding(text):
    """
    Instagram exports UTF-8 text but writes the JSON with each UTF-8 byte
    stored as a Latin-1 codepoint (mojibake). This reverses that process.
    Example: "\\u00d9\\u0085" → bytes 0xD9 0x85 → 'م'
    """
    if not text:
        return text
    try:
        return text.encode("latin-1").decode("utf-8")
    except (UnicodeDecodeError, UnicodeEncodeError):
        return text

# ─── Name Normalisation ─────────────────────────────────────────────────────────

# Cache of raw_name → display_name mappings discovered at load time
_name_map = {}

def resolve_display_name(raw_name):
    """Convert a raw sender_name from the JSON into a display name."""
    if raw_name in _name_map:
        return _name_map[raw_name]

    decoded = fix_instagram_encoding(raw_name)

    # Direct match on raw or decoded name
    for key, display in DISPLAY_NAMES.items():
        if raw_name == key or decoded == key:
            _name_map[raw_name] = display
            return display

    # Fallback: use decoded name
    _name_map[raw_name] = decoded
    return decoded

# ─── Media URI Resolver ─────────────────────────────────────────────────────────

def resolve_media_uri(uri):
    """
    Instagram export URIs look like:
      your_instagram_activity/messages/message_requests/.../photos/filename.jpg
    We need to extract just the subfolder + filename and serve from /messages/.
    """
    if not uri:
        return None
    # Get the last two path components: e.g. "photos/filename.jpg"
    parts = uri.replace("\\", "/").split("/")
    # Find the media subfolder (photos, videos, audio, gifs, files)
    media_folders = {"photos", "videos", "audio", "gifs", "files"}
    for i, part in enumerate(parts):
        if part in media_folders and i + 1 < len(parts):
            local_rel = "/".join(parts[i:])
            local_path = os.path.join(MESSAGES_DIR, *parts[i:])
            if os.path.exists(local_path):
                return f"/media/{local_rel}"
    # Fallback: just use filename in each known folder
    filename = parts[-1]
    for folder in media_folders:
        candidate = os.path.join(MESSAGES_DIR, folder, filename)
        if os.path.exists(candidate):
            return f"/media/{folder}/{filename}"
    return None

# ─── Message Loader ─────────────────────────────────────────────────────────────

_all_messages = []       # Sorted chronologically (oldest first)
_media_items = []        # All photos/videos for gallery
_participants = []       # Display names of participants
_loaded = False

def _detect_media_type(filename):
    """Detect media type from filename extension."""
    ext = os.path.splitext(filename)[1].lower()
    if ext in ('.jpg', '.jpeg', '.png', '.webp', '.bmp'):
        return 'photo'
    if ext in ('.gif',):
        return 'gif'
    if ext in ('.mp4', '.mov', '.avi', '.webm', '.mkv'):
        return 'video'
    if ext in ('.mp3', '.wav', '.ogg', '.aac', '.m4a'):
        return 'audio'
    # No extension — check parent folder
    return None

def load_all_messages():
    """Scan messages/ for all message_*.json files, merge, sort, and process."""
    global _all_messages, _media_items, _participants, _loaded

    if _loaded:
        return

    raw_messages = []
    participant_names = set()
    pattern = os.path.join(MESSAGES_DIR, "message_*.json")

    for filepath in sorted(glob.glob(pattern)):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"[WARN] Skipping malformed file: {filepath} ({e})")
            continue

        # Collect participant names
        for p in data.get("participants", []):
            participant_names.add(p["name"])

        raw_messages.extend(data.get("messages", []))

    # Sort by timestamp (oldest first for chronological display)
    raw_messages.sort(key=lambda m: m.get("timestamp_ms", 0))

    # Resolve participants
    _participants = list({resolve_display_name(n) for n in participant_names})

    # Process each message
    media_gallery = []
    processed = []

    for msg in raw_messages:
        sender_raw = msg.get("sender_name", "")
        sender = resolve_display_name(sender_raw)
        ts_ms = msg.get("timestamp_ms", 0)
        is_me = sender == ME_LABEL

        entry = {
            "sender": sender,
            "is_me": is_me,
            "timestamp_ms": ts_ms,
            "timestamp": "",
            "date": "",
            "type": "text",
        }

        # Format timestamp
        if ts_ms:
            dt = datetime.fromtimestamp(ts_ms / 1000, tz=timezone(timedelta(hours=5, minutes=30)))
            entry["timestamp"] = dt.strftime("%-I:%M %p") if os.name != "nt" else dt.strftime("%#I:%M %p")
            entry["date"] = dt.strftime("%B %d, %Y")

        # Text content
        content = msg.get("content", "")
        entry["content"] = fix_instagram_encoding(content) if content else ""

        # Reactions
        reactions = msg.get("reactions", [])
        if reactions:
            entry["reactions"] = [
                {
                    "emoji": fix_instagram_encoding(r.get("reaction", "")),
                    "actor": resolve_display_name(r.get("actor", ""))
                }
                for r in reactions
            ]

        # ── Photos ───────────────────────────────────────────
        photos = msg.get("photos", [])
        if photos:
            entry["type"] = "photo"
            entry["photos"] = []
            for p in photos:
                url = resolve_media_uri(p.get("uri", ""))
                if url:
                    entry["photos"].append(url)
                    media_gallery.append({"type": "photo", "url": url, "timestamp_ms": ts_ms, "sender": sender})

        # ── Videos ───────────────────────────────────────────
        videos = msg.get("videos", [])
        if videos:
            entry["type"] = "video"
            entry["videos"] = []
            for v in videos:
                url = resolve_media_uri(v.get("uri", ""))
                if url:
                    entry["videos"].append(url)
                    media_gallery.append({"type": "video", "url": url, "timestamp_ms": ts_ms, "sender": sender})

        # ── GIFs ─────────────────────────────────────────────
        gifs = msg.get("gifs", [])
        if gifs:
            entry["type"] = "gif"
            entry["gifs"] = []
            for g in gifs:
                url = resolve_media_uri(g.get("uri", ""))
                if url:
                    entry["gifs"].append(url)

        # ── Audio / Voice Messages ───────────────────────────
        audio_files = msg.get("audio_files", [])
        if audio_files:
            entry["type"] = "audio"
            entry["audio"] = []
            for a in audio_files:
                url = resolve_media_uri(a.get("uri", ""))
                if url:
                    entry["audio"].append(url)

        # ── Shared Links / Reels ─────────────────────────────
        share = msg.get("share", {})
        if share:
            entry["type"] = "share"
            entry["share"] = {
                "link": share.get("link", ""),
                "text": fix_instagram_encoding(share.get("share_text", "")),
                "owner": share.get("original_content_owner", ""),
            }

        # ── Call Events ──────────────────────────────────────
        call_dur = msg.get("call_duration", None)
        if call_dur is not None:
            entry["type"] = "call"
            entry["call_duration"] = call_dur

        processed.append(entry)

    _all_messages = processed
    _media_items = media_gallery
    _loaded = True
    print(f"[OK] Loaded {len(_all_messages)} messages from {len(glob.glob(pattern))} files")

# ─── Routes ─────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Serve the main chat page."""
    load_all_messages()
    return render_template(
        "chat.html",
        participants=_participants,
        total=len(_all_messages),
        me_label=ME_LABEL,
    )

@app.route("/api/messages")
def api_messages():
    """
    Paginated message API.
    Query params:
      - page: page number (0-indexed, page 0 = newest messages)
      - search: optional search query
    Returns JSON with messages in chronological order for that page.
    """
    load_all_messages()
    search = request.args.get("search", "").strip().lower()
    page = int(request.args.get("page", 0))

    if search:
        # Filter messages matching search
        filtered = [
            m for m in _all_messages
            if search in m.get("content", "").lower()
        ]
    else:
        filtered = _all_messages

    total = len(filtered)
    total_pages = max(1, (total + PAGE_SIZE - 1) // PAGE_SIZE)

    # Page 0 = most recent messages (end of the list)
    # We reverse-index: page 0 gets the last PAGE_SIZE messages
    start = max(0, total - (page + 1) * PAGE_SIZE)
    end = total - page * PAGE_SIZE

    page_messages = filtered[start:end]

    return jsonify({
        "messages": page_messages,
        "page": page,
        "total_pages": total_pages,
        "total_messages": total,
        "has_more": start > 0,
    })

@app.route("/api/gallery")
def api_gallery():
    """Return all media items for the gallery view."""
    load_all_messages()
    return jsonify({"media": _media_items})

@app.route("/media/<path:filepath>")
def serve_media(filepath):
    """Serve media files (photos, videos, audio, gifs) from the messages folder."""
    return send_from_directory(MESSAGES_DIR, filepath)

# ─── Main ────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Instagram DM Archive Viewer")
    print("Open: http://127.0.0.1:5000")
    app.run(debug=True, host="127.0.0.1", port=5000)
