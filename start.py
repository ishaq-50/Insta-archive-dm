#!/usr/bin/env python
"""
QUICK START GUIDE FOR INSTAGRAM DM ARCHIVE VIEWER
==================================================

This script helps you get up and running in under 2 minutes!
"""

import os
import platform
import subprocess
import sys
import json
from pathlib import Path

def print_header(text):
    """Print a fancy header."""
    print(f"\n{'='*60}")
    print(f" {text}")
    print(f"{'='*60}\n")

def check_python():
    """Check if Python 3.10+ is installed."""
    if sys.version_info < (3, 10):
        print("❌ Python 3.10+ required!")
        print(f"   You have: {sys.version}")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def setup_venv():
    """Create and activate virtual environment."""
    venv_path = Path(".venv")
    
    if not venv_path.exists():
        print("📦 Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", ".venv"], check=True)
    else:
        print("✅ Virtual environment already exists")

def install_dependencies():
    """Install required packages."""
    print("📚 Installing dependencies (Flask)...")
    
    # Get pip from venv
    if platform.system() == "Windows":
        pip_cmd = ".venv\\Scripts\\pip.exe"
    else:
        pip_cmd = ".venv/bin/pip"
    
    subprocess.run([pip_cmd, "install", "-r", "requirements.txt"], check=True)
    print("✅ Dependencies installed")

def check_messages_folder():
    """Check if messages folder has data."""
    msg_dir = Path("messages")
    
    if not msg_dir.exists():
        print("\n⚠️  No messages/ folder found!")
        print("\nTo add your Instagram data:")
        print("1. Go to Instagram Settings → Account → Download your info")
        print("2. Download and extract the zip file")
        print("3. Copy the 'messages' folder into this project directory")
        print("\nFolder structure should look like:")
        print("""
  project/
  ├── messages/
  │   ├── message_1.json
  │   ├── message_2.json
  │   ├── photos/
  │   ├── videos/
  │   └── audio/
  ├── app.py
  └── ...
        """)
        return False
    
    json_files = list(msg_dir.glob("message_*.json"))
    if json_files:
        print(f"✅ Found {len(json_files)} message files in messages/")
        return True
    else:
        print("⚠️  No message_*.json files found in messages/")
        return False

def run_app():
    """Start the Flask development server."""
    print("\n🚀 Starting Instagram DM Archive Viewer...\n")
    
    if platform.system() == "Windows":
        python_cmd = ".venv\\Scripts\\python.exe"
    else:
        python_cmd = ".venv/bin/python"
    
    print("=" * 60)
    print("Instagram DM Archive Viewer is running!")
    print("=" * 60)
    print("\n📱 Open your browser at: http://127.0.0.1:5000\n")
    print("Press Ctrl+C to stop the server\n")
    
    subprocess.run([python_cmd, "app.py"])

def main():
    """Run the setup and start the app."""
    print_header("Instagram DM Archive Viewer")
    
    check_python()
    setup_venv()
    install_dependencies()
    
    has_messages = check_messages_folder()
    
    if has_messages:
        run_app()
    else:
        print("\n💡 Add your Instagram export before starting the app!")
        print("\nOnce you add the messages folder, run this script again:")
        if platform.system() == "Windows":
            print("  python start.py")
        else:
            print("  python start.py")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n✅ Goodbye!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)
