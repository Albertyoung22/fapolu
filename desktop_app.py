import os
import sys
import time
import socket
import threading
import logging
import argparse

# Ensure standard output supports UTF-8 on Windows command prompts
if sys.platform.startswith('win'):
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        if hasattr(sys.stderr, 'reconfigure'):
            sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

from waitress import serve
from app import app
import webview
import tunnel

# Silence verbose waitress logs in desktop mode
logging.getLogger('waitress').setLevel(logging.ERROR)

HOST = '127.0.0.1'
PORT = 5000

def wait_for_server(host, port, timeout=10.0):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            with socket.create_connection((host, port), timeout=0.5):
                return True
        except (OSError, ConnectionRefusedError):
            time.sleep(0.1)
    return False

def start_server():
    try:
        serve(app, host=HOST, port=PORT, threads=6)
    except Exception as e:
        print(f"Server error: {e}")

def main():
    parser = argparse.ArgumentParser(description="法寶實業 - 沉浸式桌面應用程式")
    parser.add_argument("--tunnel", action="store_true", help="同時建立 Cloudflare Tunnel 外網網址")
    args = parser.parse_args()

    print("=" * 65)
    print("  🖥️  法寶實業有限公司 - 沉浸式桌面應用程式 (Desktop App)")
    print(f"  ⚡ 引擎核心: Windows WebView2 (Chromium) + Waitress + Flask")
    print(f"  ⚡ 語音引擎: Microsoft Edge-TTS 台灣神經網路語音")
    if args.tunnel:
        print(f"  🌐 外網穿透: 已啟用 Cloudflare Tunnel")
    print("=" * 65)
    
    # 1. Start Waitress WSGI Server in background daemon thread if not already running
    if not wait_for_server(HOST, PORT, timeout=0.5):
        print("  正在啟動本機伺服器服務...")
        server_thread = threading.Thread(target=start_server, daemon=True)
        server_thread.start()
        
        if not wait_for_server(HOST, PORT, timeout=10.0):
            print("  [錯誤] 本機伺服器啟動超時！")
            sys.exit(1)
        print("  ✓ 本機伺服器連線就緒！")
    else:
        print("  ✓ 偵測到本機伺服器已在運行中，直接連線！")

    if args.tunnel:
        threading.Thread(target=lambda: tunnel.start_tunnel(port=PORT, wait_for_url=True), daemon=True).start()

    # 2. Window Settings
    window_title = "法寶實業有限公司 | FAPO ENTERPRISE - 全方位鋁合金材料供應鏈與精密加工 (沉浸式互動系統)"
    url = f"http://{HOST}:{PORT}"
    
    # Check if there is an icon
    icon_path = None
    possible_icons = [
        os.path.join(os.path.dirname(__file__), 'static', 'img_crawled', 'fapo_logo.png')
    ]
    for p in possible_icons:
        if os.path.exists(p):
            icon_path = p
            break

    # 3. Create Native Desktop Window with Edge WebView2
    window = webview.create_window(
        title=window_title,
        url=url,
        width=1440,
        height=920,
        min_size=(1024, 680),
        text_select=True,
        confirm_close=False,
        background_color='#f6f1e6'
    )

    print("  🚀 正在開啟桌面視窗...")
    # gui='edgechromium' uses Microsoft Edge Chromium runtime on Windows
    webview.start(gui='edgechromium', debug=False)
    print("  桌面視窗已關閉，感謝使用！")

if __name__ == '__main__':
    import multiprocessing
    multiprocessing.freeze_support()
    try:
        main()
    except Exception as e:
        import traceback
        with open("crash_log.txt", "w", encoding="utf-8") as f:
            f.write(traceback.format_exc())
        raise

