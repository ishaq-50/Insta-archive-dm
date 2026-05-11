# Setup Instructions

## Ultra-Quick Start (3 Steps)

### Step 1: Prepare Your Data
Download your Instagram export and put the `messages/` folder in this directory.

### Step 2: Install & Run
**Windows:**
```bash
python -m venv .venv
.venv\Scripts\activate
pip install Flask==3.1.1
python app.py
```

**Mac/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install Flask==3.1.1
python app.py
```

### Step 3: Open in Browser
Go to: **http://127.0.0.1:5000**

---

## Detailed Instructions

### Windows

1. **Install Python 3.10+** (if not already)
   - Download from [python.org](https://www.python.org)
   - Check the "Add Python to PATH" checkbox during install
   - Verify: Open Command Prompt and type: `python --version`

2. **Download Your Instagram Data**
   - Go to: Instagram → Settings → Security → Download your info
   - Wait for email confirmation
   - Download the zip file
   - Extract it (right-click → Extract All)
   - Copy the `messages` folder into this project directory

3. **Open Command Prompt**
   - Press `Win + R`, type `cmd`, press Enter
   - Navigate to this project: `cd C:\path\to\project`

4. **Create Virtual Environment**
   ```
   python -m venv .venv
   .venv\Scripts\activate
   ```
   You should see `(.venv)` at the start of each line now

5. **Install Dependencies**
   ```
   pip install Flask==3.1.1
   ```

6. **Run the App**
   ```
   python app.py
   ```

7. **Open in Browser**
   - Type in address bar: `http://127.0.0.1:5000`
   - Press Enter

Done! Chat away!

---

### Mac & Linux

1. **Install Python 3.10+** (if not already)
   ```bash
   # macOS with Homebrew
   brew install python@3.10
   
   # Ubuntu/Debian
   sudo apt-get install python3.10 python3.10-venv
   ```

2. **Download Your Instagram Data**
   - Go to: Instagram → Settings → Security → Download your info
   - Wait for email confirmation
   - Download the zip file
   - Extract: `unzip file.zip`
   - Move: `cp -r messages ./project/`

3. **Open Terminal**
   - `cd /path/to/project`

4. **Create Virtual Environment**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
   You should see `(.venv)` at the start of each line now

5. **Install Dependencies**
   ```bash
   pip install Flask==3.1.1
   ```

6. **Run the App**
   ```bash
   python app.py
   ```

7. **Open in Browser**
   - Type in address bar: `http://127.0.0.1:5000`
   - Press Enter

Done!

---

## Verify It's Working

You should see in the terminal:
```
Instagram DM Archive Viewer
Open: http://127.0.0.1:5000
 * Running on http://127.0.0.1:5000
Loaded 85497 messages from 4 files
```

And in the browser:
- Dark Instagram-like interface
- Your contact's name in header
- Message count
- Messages loading from newest to oldest
- Search and Gallery buttons

---

## Stop the App

Press `Ctrl + C` in the terminal.

---

## Run It Again Later

Next time you want to use it:

**Windows:**
```
.venv\Scripts\activate
python app.py
```

**Mac/Linux:**
```
source .venv/bin/activate
python app.py
```

---

## Troubleshooting

### "Command not found: python"
You need to install Python 3.10+. Download from [python.org](https://www.python.org)

### "No module named 'flask'"
Did you activate the virtual environment? Look for `(.venv)` at the start of your terminal line.

### "messages/ folder not found"
You need to download your Instagram data and copy the `messages/` folder into this directory.

### Port already in use
Another app is using port 5000. Edit the last line of `app.py`:
```python
app.run(debug=True, host="127.0.0.1", port=5001)  # Change 5000 to 5001
```

### Messages won't load
Check that `message_*.json` files are in the `messages/` folder, and that `photos/`, `videos/`, `audio/`, `gifs/` folders exist there.

---

## Need Help?

1. Check the [README.md](README.md) for detailed documentation
2. Make sure you have the latest Python 3.10+ installed
3. Verify your Instagram export folder structure matches the diagram
4. Check your browser console (F12) for JavaScript errors

---

Happy chatting! 💬✨
