# 🚀 Quick Reference

## File Structure
```
project/
├── app.py                    ← Backend (Flask) - DO NOT EDIT
├── requirements.txt          ← Dependencies - DO NOT EDIT
├── start.py                  ← Easy startup script
├── README.md                 ← Full documentation
├── SETUP.md                  ← Setup instructions
├── QUICK_REFERENCE.md        ← This file
│
├── messages/                 ← YOUR DATA GOES HERE
│   ├── message_*.json        ← Message files from Instagram
│   ├── photos/               
│   ├── videos/
│   ├── audio/
│   └── gifs/
│
├── templates/
│   └── chat.html             ← Main interface - MAY CUSTOMIZE
│
└── static/
    ├── style.css             ← Styling - MAY CUSTOMIZE
    └── script.js             ← JavaScript - MAY CUSTOMIZE
```

---

## Configuration (CUSTOMIZE THESE)

### Chat Display Names
Edit **`app.py`** line ~20:

```python
DISPLAY_NAMES = {
    "Instagram User": "Your Contact",  # Your contact's name
    "محمد إسحاق": "Me",                # Your name (appears on right)
}
```

### Colors
Edit **`static/style.css`** line ~10:

```css
:root {
    --bubble-me: linear-gradient(135deg, #5b51d8, #833ab4, #c13584);  /* Your messages color */
    --accent: #0095f6;                                                  /* Blue accent */
    --bg-primary: #000000;                                              /* Black background */
}
```

### Page Size (messages per page)
Edit **`app.py`** line ~27:

```python
PAGE_SIZE = 80  # Load 80 messages at a time
```

### Header Name
Edit **`templates/chat.html`** line ~35:

```html
<div class="header-name">Your Contact's Name</div>
```

---

## Features

| Feature | Hot Key | How It Works |
|---------|---------|-------------|
| **Search** | 🔍 Icon | Type to search messages in real-time |
| **Gallery** | 📷 Icon | View all photos/videos in grid |
| **Open Photo** | Click | Click any photo to view fullscreen |
| **Play Audio** | Click ▶ | Custom audio player for voice messages |
| **Play Video** | Click | Native HTML5 video player |
| **Scroll to Bottom** | ↓ Icon | Jump to latest messages |
| **Scroll to Top** | Scroll Up | Load older messages automatically |
| **Timestamps** | Hover | Hover over messages to see exact time |
| **Date Separator** | Auto | Messages grouped by day |

---

## API Endpoints

If you want to extend the app, here are the backend APIs:

```
GET /                           → Serve main page
GET /api/messages?page=0        → Get 80 messages from page 0
GET /api/messages?search=hello  → Search for "hello"
GET /api/gallery                → Get all media for gallery
GET /api/stats                  → Chat statistics
GET /media/<path>               → Serve media files
```

Example JavaScript call:
```javascript
fetch('/api/messages?page=0&search=hello')
  .then(r => r.json())
  .then(data => console.log(data.messages));
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Escape` | Close photo modal |
| `Ctrl + F` | Browser search (different from chat search) |

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| **App won't start** | Install Flask: `pip install Flask==3.1.1` |
| **Messages not showing** | Check `messages/` folder has `message_*.json` files |
| **Photos/videos broken** | Make sure `photos/`, `videos/`, `audio/` folders exist |
| **Port 5000 in use** | Change port in `app.py` line ~340: `port=5001` |
| **Unicode text broken** | Already handled! The app fixes Instagram's mojibake |
| **Search too slow** | It's normal for 80k+ messages. Uses in-memory filtering |

---

## Performance Tips

- **First load**: May take 5-10 seconds to scan all JSON files
- **Pagination**: Messages load 80 at a time to stay fast
- **Search**: Type slowly, results update in real-time
- **Gallery**: Photos load on-demand with lazy loading
- **Audio**: Click to preview, no autoplay

---

## Privacy & Security

✅ **100% Local** — All data stays on your computer  
✅ **No Network** — Works completely offline  
✅ **No Database** — Everything in memory & files  
✅ **No Tracking** — No telemetry or analytics  
✅ **Open Source** — You can audit the code

---

## Backup Your Data

The app reads from `messages/` but doesn't modify it. Your original data is safe!

But keep backups:
```bash
# Windows
copy messages messages_backup

# Mac/Linux
cp -r messages messages_backup
```

---

## Extend & Customize

The code is well-commented. You can:

1. **Add new message types** → Edit `buildXxxBubble()` in `script.js`
2. **Change colors** → Edit CSS variables in `style.css`
3. **Add new API routes** → Add to `app.py`
4. **Modify UI layout** → Edit `templates/chat.html`

---

## Export for Others

To share your viewer with others:

1. Keep the same folder structure
2. Skip the `.venv/` folder (let them create it)
3. Include `messages/` folder with all data
4. Share the whole project directory
5. They can run `python start.py` to set up

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iPhone/Android)

---

## Version Info

- **Python**: 3.10+
- **Flask**: 3.1.1
- **Browser**: Modern ES6+ JavaScript
- **Tested with**: 85,000+ message conversations

---

## One-Liner Commands

```bash
# Full setup from scratch
python -m venv .venv && source .venv/bin/activate && pip install Flask==3.1.1 && python app.py

# Just run (if already setup)
.venv/Scripts/activate && python app.py  # Windows
source .venv/bin/activate && python app.py  # Mac/Linux

# Check Python version
python --version

# Deactivate virtual environment
deactivate
```

---

## Get Help

1. **Setup issues?** → Read [SETUP.md](SETUP.md)
2. **How to use?** → Read [README.md](README.md)
3. **Technical details?** → Read code comments in `app.py`, `style.css`, `script.js`

---

## Fun Facts

🎯 The app loaded **85,497 messages** from this example  
⏱️ Handles **Unicode**, **Tamil**, **Arabic**, **Emoji** perfectly  
🖼️ Supports **photos**, **videos**, **GIFs**, **voice messages**, **reactions**  
🚀 **Zero external dependencies** beyond Flask  
💬 Complete **Instagram chat experience** in a single folder  

---

Enjoy reconnecting with memories! ✨
