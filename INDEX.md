# 📚 Documentation Index

Welcome to the Instagram DM Archive Viewer! Here's where to find what you need:

---

## 🚀 **Getting Started** (Start Here!)

### [SETUP.md](SETUP.md) — *5 min read*
**Best for**: First-time setup  
**Contains**:
- Ultra-quick 3-step start
- Windows installation walkthrough
- Mac/Linux installation walkthrough
- Common troubleshooting

👉 **Read this if you're getting started**

---

## 📖 **Complete Documentation**

### [README.md](README.md) — *20 min read*
**Best for**: Understanding everything about the app  
**Contains**:
- Feature overview
- How it works (technical breakdown)
- Supported message formats with examples
- Search & gallery instructions
- Performance optimization
- Advanced customization
- FAQ section

👉 **Read this for comprehensive understanding**

---

## ⚡ **Quick Reference**

### [QUICK_REFERENCE.md](QUICK_REFERENCE.md) — *5 min read*
**Best for**: Finding things quickly  
**Contains**:
- File structure overview
- Configuration options with code examples
- Feature summary table
- API endpoints for developers
- Keyboard shortcuts
- Common issues & quick fixes
- One-liner commands

👉 **Read this while using the app**

---

## 📋 **Project Overview**

### [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) — *10 min read*
**Best for**: Understanding technical details  
**Contains**:
- Complete feature list with ✓ checkmarks
- Technical stack details
- Performance metrics
- Security & privacy assurances
- Quality checklist
- File structure reference

👉 **Read this if you want technical details**

---

## 🔧 **Configuration**

### Edit These Files to Customize:

1. **`app.py`** (Line ~20)
   - Change display names
   - Adjust page size
   - Modify API behavior

2. **`static/style.css`** (Line ~10)
   - Change colors and theme
   - Modify fonts
   - Adjust spacing

3. **`templates/chat.html`** (Line ~35)
   - Change header text
   - Modify layout
   - Add custom elements

---

## 🎯 **Common Tasks**

### "I just want to see my chats"
→ Follow [SETUP.md](SETUP.md) (3 steps, 3 minutes)

### "How do I use the search?"
→ Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) → *Search* section

### "I want to change the colors"
→ Check [README.md](README.md) → *Customization* section →
→ Edit `static/style.css` CSS variables

### "What message types are supported?"
→ Check [README.md](README.md) → *Message Formats Supported* section

### "How do I run it on my own server?"
→ Check [README.md](README.md) → *Advanced: Batch Processing* section

### "I found a bug!"
→ Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) → *Common Issues & Fixes*

---

## 📁 **File Organization**

```
Project Root
├── DOCUMENTATION (These .md files)
│   ├── SETUP.md ..................... First-time setup
│   ├── README.md .................... Full documentation
│   ├── QUICK_REFERENCE.md ........... Quick lookup
│   ├── PROJECT_SUMMARY.md ........... Technical summary
│   └── INDEX.md (You are here)
│
├── BACKEND
│   ├── app.py ....................... Flask server + APIs
│   └── requirements.txt ............. Dependencies
│
├── FRONTEND
│   ├── templates/chat.html .......... Main interface
│   └── static/
│       ├── style.css ............... Styling
│       └── script.js ............... JavaScript logic
│
├── DATA (You add this)
│   └── messages/ .................... Your Instagram export
│
└── SETUP HELPERS
    └── start.py ..................... Easy startup script
```

---

## 🎓 **Learning Path**

**First Time Users:**
1. Read [SETUP.md](SETUP.md) (3 min)
2. Follow the setup steps (3 min)
3. Run the app and explore (2 min)
4. Bookmark [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for quick lookups

**Users Who Want More:**
1. Read [README.md](README.md) (20 min)
2. Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for customization options
3. Edit `style.css` and `app.py` to customize
4. Explore the code - it's well-commented!

**Advanced Users / Developers:**
1. Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for technical details
2. Review `app.py`, `script.js`, `style.css` with comments
3. Check [README.md](README.md) → *Technical Details* section
4. Extend the APIs for custom features

---

## ❓ **FAQ Quick Links**

| Question | Answer |
|----------|--------|
| How do I get started? | → [SETUP.md](SETUP.md) |
| What features does it have? | → [README.md](README.md) — Features section |
| How do I customize colors? | → [README.md](README.md) → Customization |
| Where do I put my data? | → [SETUP.md](SETUP.md) → Step 1 |
| Can I run it offline? | → [README.md](README.md) → Yes, 100% local! |
| What if messages won't load? | → [QUICK_REFERENCE.md](QUICK_REFERENCE.md) → Issues & Fixes |
| How do I find old messages? | → [QUICK_REFERENCE.md](QUICK_REFERENCE.md) → Scroll Up/Search |
| Can I share this with friends? | → [README.md](README.md) → Advanced section |

---

## 🚀 **Quick Start Command**

If you're impatient:

```bash
cd your-project-folder
python -m venv .venv
source .venv/bin/activate  # Mac/Linux
# .venv\Scripts\activate   # Windows
pip install Flask==3.1.1
python app.py
```

Then open: **http://127.0.0.1:5000**

(Full details in [SETUP.md](SETUP.md))

---

## 📞 **Getting Help**

**Setup Issues?**
→ [SETUP.md](SETUP.md) → *Troubleshooting* section

**Feature Questions?**
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md) → *Features* section

**How to Do Something?**
→ [README.md](README.md) → Use Ctrl+F to search

**Technical Questions?**
→ [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) → *Technical Stack* section

**Code Questions?**
→ Check comments in `app.py`, `style.css`, `script.js`

---

## 🎉 **You're All Set!**

Pick a file from above and get started!

**Recommended reading order:**
1. This file (you're reading it!) ✓
2. [SETUP.md](SETUP.md) — Set it up
3. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) — Bookmark it
4. [README.md](README.md) — For detailed info
5. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) — For tech details

---

**Questions?** Check the relevant .md file or search for your topic!

Happy chatting! 💬✨
