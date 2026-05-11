# Instagram DM Archive Viewer

A beautiful, modern web application to browse your exported Instagram chat backups locally in your browser. Recreates the feeling of reopening a real Instagram conversation with a clean, responsive interface.

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Flask](https://img.shields.io/badge/Flask-3.1+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

✨ **Beautiful Dark Mode UI** — Instagram-inspired design with modern glassmorphism
📱 **Fully Responsive** — Works on desktop, tablet, and mobile
💬 **Complete Message Support** — Text, photos, videos, GIFs, audio/voice messages
🔍 **Full-Text Search** — Search across all messages instantly
📷 **Media Gallery** — View all photos and videos in a beautiful grid
📅 **Automatic Date Separators** — Day separators like Instagram chats
⏰ **Chronological Sorting** — Messages strictly sorted by timestamp
🌍 **Unicode Support** — Properly handles Arabic, Tamil, Emoji, and all scripts
🎵 **Audio Player** — Custom audio player for voice messages
🎬 **Video Player** — Responsive video playback
🖼️ **Photo Modal** — Click any photo to view fullscreen
💾 **No Database** — Everything works completely offline
⚡ **Zero Dependencies on Internet** — Pure local application

---

## Quick Start

### 1. Download the App
Clone or download this project to your computer.

### 2. Install Python (if needed)
- Python 3.10 or newer required
- Download from [python.org](https://www.python.org/downloads/)

### 3. Create Virtual Environment
```bash
cd path/to/project
python -m venv .venv
```

**On Windows:**
```bash
.\.venv\Scripts\activate
```

**On macOS/Linux:**
```bash
source .venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Add Your Instagram Export
Download your Instagram data:
1. Go to Instagram Settings → Security → Download Data
2. Request your data export
3. Download the zip file once ready
4. Extract `messages/` folder into the project root

The structure should look like:
```
project/
├── messages/
│   ├── message_1.json
│   ├── message_2.json
│   ├── message_3.json
│   ├── ... (more message files)
│   ├── audio/
│   ├── photos/
│   ├── videos/
│   ├── gifs/
│   └── files/
├── app.py
├── requirements.txt
├── templates/
│   └── chat.html
├── static/
│   ├── style.css
│   └── script.js
└── README.md
```

### 6. Run the App
```bash
python app.py
```

Then open your browser to: **http://127.0.0.1:5000**

---

## Configuration

### Customize Display Names

Edit the `DISPLAY_NAMES` dictionary in `app.py`:

```python
DISPLAY_NAMES = {
    "Instagram User": "Rayyan",      # Your contact's name
    "محمد إسحاق": "Me",              # Your name
}
```

- Messages from "Me" always appear on the right (blue gradient)
- Messages from others appear on the left (dark gray)
- The app intelligently merges duplicate usernames across exports

### Chat Settings

```python
PAGE_SIZE = 80  # Messages to load per page (for pagination)
```

---

## How It Works

### Backend (Python Flask)

**`app.py`** — The backend server handles:

- **Message Loading**: Scans `messages/` for all `message_*.json` files
- **Message Merging**: Combines messages from multiple exports into one timeline
- **Timestamp Sorting**: Sorts all messages chronologically (oldest first)
- **Media Resolution**: Locates photos, videos, audio, GIFs in local folders
- **Unicode Fixing**: Handles Instagram's mojibake (broken UTF-8) encoding
- **Pagination API**: Serves messages in pages for infinite scroll
- **Search API**: Full-text message search
- **Gallery API**: Collects all media for gallery view
- **Media Serving**: Streams local media files safely

**Key Routes:**
- `GET /` — Serve main chat interface
- `GET /api/messages?page=0&search=""` — Load messages with pagination and search
- `GET /api/gallery` — Get all photos/videos for gallery
- `GET /api/stats` — Conversation statistics
- `GET /media/<filepath>` — Serve media files

### Frontend (JavaScript)

**`script.js`** — The interactive UI handles:

- **Infinite Scroll**: Load older messages as you scroll up
- **Message Rendering**: Display text, photos, videos, audio, GIFs, reactions
- **Search**: Real-time full-text search with result count
- **Image Modal**: Click any photo to view fullscreen
- **Audio Player**: Custom waveform player for voice messages
- **Gallery View**: Thumbnail grid of all photos/videos
- **Timestamps**: Show message time on hover
- **Date Separators**: Automatic daily dividers
- **Smooth Scrolling**: Auto-scroll to latest messages on load

**Key Functions:**
- `loadMessages(page)` — Load a page of messages
- `toggleSearch()` — Show/hide search bar
- `switchTab(view)` — Switch between chat and gallery
- `openModal(src)` — Open photo fullscreen
- `toggleAudio(uid)` — Play/pause voice message

### Frontend (CSS)

**`style.css`** — Beautiful dark-mode design:

- Instagram gradient avatars
- Glassmorphism header and bars
- Animated message bubbles
- Custom scrollbar
- Responsive grid for media
- Smooth transitions and animations
- Accessibility-compliant (reduced-motion support)

---

## Message Formats Supported

The app correctly renders all message types from Instagram exports:

### Text Messages
Simple text conversations with proper Unicode.

### Photos
Photos are displayed with hover effects. Click to view fullscreen in modal.

```json
{
  "photos": [{"uri": "photos/filename.jpg"}],
  "content": "Caption text (optional)"
}
```

### Videos
Videos play inline with native HTML5 controls.

```json
{
  "videos": [{"uri": "videos/filename.mp4"}],
  "content": "Caption text (optional)"
}
```

### GIFs
Animated GIFs display like photos.

```json
{
  "gifs": [{"uri": "gifs/filename.gif"}]
}
```

### Voice/Audio Messages
Custom audio player with waveform and duration.

```json
{
  "audio_files": [{"uri": "audio/filename.m4a"}]
}
```

### Reactions
Emoji reactions below messages.

```json
{
  "reactions": [
    {"reaction": "❤️", "actor": "Instagram User"}
  ]
}
```

### Shared Posts/Reels
Clickable links to Instagram content.

```json
{
  "share": {
    "link": "https://instagram.com/...",
    "share_text": "Post title",
    "original_content_owner": "username"
  }
}
```

### Call Events
Duration or "No answer" label for voice/video calls.

```json
{
  "call_duration": 120
}
```

---

## Handling Instagram Export Issues

The app handles several common Instagram export quirks:

### Unicode/Mojibake Issues
Instagram exports UTF-8 content as Latin-1, breaking non-ASCII characters. The app automatically fixes this:

```python
def fix_instagram_encoding(text):
    try:
        return text.encode("latin-1").decode("utf-8")
    except:
        return text  # Fallback if not mojibake
```

This correctly decodes: Tamil (தமிழ்), Arabic (عربى), Chinese (中文), Emoji (😊), etc.

### Name Variations
If your contact's name changed across exports, the app merges them:

```python
DISPLAY_NAMES = {
    "OldName": "NewName",
    "Another Alias": "NewName",  # Merged to same person
}
```

### Malformed JSON Files
The app safely skips corrupted files and logs warnings:

```python
except (json.JSONDecodeError, IOError) as e:
    print(f"[WARN] Skipping malformed file: {filepath} ({e})")
```

### Missing Media Files
If media is referenced but not found, the app shows a placeholder and continues.

---

## Search

The search bar (🔍 icon top right) allows full-text message search:

- Type your query (minimum 2 characters)
- Results update in real-time
- Shows count of matching messages
- Click close (X) to clear search

---

## Media Gallery

The gallery view (📷 icon top right) shows:

- All photos in a 3-column responsive grid
- All videos with a play icon overlay
- Click any item to view fullscreen
- Videos pause/play on click in gallery

---

## Performance Tips

### Large Chat Histories (10,000+ messages)
- The app uses infinite scroll pagination, so all messages don't load at once
- Older messages load on-demand as you scroll up
- Adjust `PAGE_SIZE` in `app.py` if needed (default: 80 messages per page)

### Slow Drives
- First load may take a moment while scanning JSON files
- Messages are cached in memory after first load
- Restart the app to clear cache if needed

---

## Troubleshooting

### App Won't Start
```
Error: No module named 'flask'
```
**Solution:** Install Flask:
```bash
pip install Flask==3.1.1
```

### Messages Not Showing
1. Check the `messages/` folder exists
2. Verify `message_*.json` files are in the folder
3. Check the Flask terminal shows "Loaded X messages"

### Photos/Videos Not Displaying
1. Extract the entire `messages/` folder from Instagram export (including `photos/`, `videos/`, etc.)
2. Check file paths in JSON match the folder structure
3. Verify media files exist in their folders

### Unicode Text Broken
The app automatically fixes mojibake, but if text still looks wrong:
- Try re-downloading your data from Instagram
- Some older exports may have additional encoding issues

### Search Not Working
- Search requires minimum 2 characters
- Uses exact substring matching (case-insensitive)
- Only searches message content, not sender names

### App Crashes on Scroll
- This shouldn't happen, but if it does:
  1. Check your browser console (F12) for errors
  2. Restart the app: `python app.py`
  3. File an issue with the error details

---

## Technical Details

### Dependencies
- **Flask 3.1.1** — Web framework

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern mobile browsers

### File Size Limits
- No practical limit (works offline)
- Tested with 85,000+ message conversations

### Privacy
- **100% Local** — Nothing is sent anywhere
- **No Tracking** — No telemetry or analytics
- **No Database** — Pure file-based with in-memory caching

---

## Advanced: Batch Processing

To process multiple chat exports into separate viewers:

1. Create a folder for each conversation:
   ```
   chats/
   ├── chat_with_alice/
   │   ├── messages/
   │   ├── app.py
   │   └── ...
   ├── chat_with_bob/
   │   ├── messages/
   │   ├── app.py
   │   └── ...
   ```

2. Run each from a different port:
   ```bash
   # Terminal 1
   cd chats/chat_with_alice
   python app.py  # Runs on port 5000

   # Terminal 2
   cd chats/chat_with_bob
   python app.py --port=5001  # Need to modify app.py to accept --port arg
   ```

---

## File Structure Reference

```
project/
│
├── app.py                    # Flask backend (routes, message loading, API)
├── requirements.txt          # Python dependencies
├── README.md                 # This file
│
├── messages/                 # Your Instagram export goes here
│   ├── message_1.json
│   ├── message_2.json
│   ├── ... (more JSON files)
│   ├── audio/               # Voice message audio files
│   ├── photos/              # Picture messages
│   ├── videos/              # Video messages
│   ├── gifs/                # Animated GIFs
│   └── files/               # Other shared files
│
├── templates/
│   └── chat.html            # Main HTML page (Jinja2 template)
│
└── static/
    ├── style.css            # Dark-mode Instagram-style CSS
    └── script.js            # Frontend logic (search, scroll, media, etc.)
```

---

## Customization Ideas

### Change Colors
Edit CSS variables in `static/style.css`:
```css
:root {
    --bubble-me: #your-color-here;
    --accent: #your-accent;
    --bg-primary: #your-bg;
}
```

### Add Custom Avatar
Replace the gradient in `style.css`:
```css
.header-avatar {
    background: url('avatar.jpg') center/cover;
}
```

### Modify Header Name
In `templates/chat.html`, change:
```html
<div class="header-name">Rayyan</div>
```

### Add a Footer
Add to bottom of `templates/chat.html`:
```html
<footer class="footer">
    <p>Exported from Instagram on {{ date }}</p>
</footer>
```

---

## License

This project is provided as-is for personal use. Feel free to modify and distribute.

---

## Contributing & Support

Found a bug or have a feature idea? 

- Check existing issues in your fork
- Test with a clean Instagram export
- Document the exact error

---

## FAQ

**Q: Is my data sent to anyone?**
A: No! Everything runs locally on your computer. No internet required.

**Q: Can I share my chats publicly using this?**
A: You can share the app folder, but it will include your actual messages and media. Keep in mind privacy when sharing.

**Q: Why is the Unicode text weird?**
A: Instagram exports have a mojibake issue. The app automatically fixes this, but very old exports might have additional issues.

**Q: Can I use this for other messaging apps?**
A: The app is specifically designed for Instagram's JSON format. Porting to WhatsApp, Telegram, etc. would require format changes.

**Q: Will this work offline?**
A: Yes! Once you run `python app.py`, you can access it locally without internet.

**Q: Can I hide certain messages?**
A: Not currently, but you can manually edit the JSON files or modify the backend to filter messages.

---

Enjoy reconnecting with your memories! 💬✨
