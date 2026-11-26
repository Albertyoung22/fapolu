"""
法寶金屬有限公司 - 定時自動發文排程器 (Auto Post Scheduler)
支援：
1. 依序輪播「貼文庫」內的所有專業圖文
2. 記錄已發送貼文 (posted_history.json)，避免重複
3. 當所有貼文輪播完畢時，自動循環重播或提示新增
4. 可由 Windows 工作排程器 (Task Scheduler) 或伺服器 Cron Job 定時自動觸發
"""

import os
import sys
import json
import datetime
import urllib.request
import urllib.parse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
POSTS_DIR = os.path.join(BASE_DIR, '法寶FB專頁素材', '貼文庫')
CONFIG_FILE = os.path.join(BASE_DIR, 'fb_config.json')
HISTORY_FILE = os.path.join(BASE_DIR, 'posted_history.json')
LOG_FILE = os.path.join(BASE_DIR, 'auto_post.log')


def log_message(msg):
    ts = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    line = f"[{ts}] {msg}"
    print(line)
    try:
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(line + '\n')
    except Exception:
        pass


def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {'posted_files': [], 'last_post_time': None}


def save_history(history):
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=2, ensure_ascii=False)


def run_scheduler_once():
    log_message("=== 啟動定時自動發文任務 ===")
    
    # 1. Load config
    if not os.path.exists(CONFIG_FILE):
        log_message("[錯誤] 找不到 fb_config.json 設定檔！")
        return False
    
    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        cfg = json.load(f)
    
    page_id = cfg.get('page_id')
    token = cfg.get('page_access_token')
    if not page_id or not token:
        log_message("[錯誤] fb_config.json 中未設定 page_id 或 page_access_token！")
        return False

    # 2. Get all posts
    if not os.path.exists(POSTS_DIR):
        log_message(f"[錯誤] 找不到貼文庫目錄: {POSTS_DIR}")
        return False

    all_txts = sorted([f for f in os.listdir(POSTS_DIR) if f.endswith('.txt')])
    if not all_txts:
        log_message("[警告] 貼文庫中沒有任何 .txt 貼文！")
        return False

    history = load_history()
    posted_files = history.get('posted_files', [])

    # Find next unposted file
    candidate = None
    for f in all_txts:
        if f not in posted_files:
            candidate = f
            break

    # If all posted, reset cycle
    if not candidate:
        log_message("所有貼文庫存均已輪播完畢，自動重置發文隊列開始新一輪循環！")
        posted_files = []
        candidate = all_txts[0]

    # 3. Read candidate content and matching image
    txt_path = os.path.join(POSTS_DIR, candidate)
    with open(txt_path, 'r', encoding='utf-8') as f:
        content = f.read().strip()

    base_prefix = candidate[:4]
    img_match = None
    for img in os.listdir(POSTS_DIR):
        if (img.endswith('.jpg') or img.endswith('.png')) and base_prefix in img:
            img_match = os.path.join(POSTS_DIR, img)
            break

    log_message(f"選取待發貼文: {candidate}")
    if img_match:
        log_message(f"附加相片: {os.path.basename(img_match)}")

    # 4. Publish via Graph API
    url = f"https://graph.facebook.com/v21.0/{page_id}/photos"
    boundary = '----WebKitFormBoundaryAutoScheduler7MA4YWxkTrZu0gW'
    
    body = []
    body.append(f'--{boundary}'.encode())
    body.append(f'Content-Disposition: form-data; name="caption"'.encode())
    body.append(b'')
    body.append(content.encode('utf-8'))
    
    body.append(f'--{boundary}'.encode())
    body.append(f'Content-Disposition: form-data; name="access_token"'.encode())
    body.append(b'')
    body.append(token.encode('utf-8'))
    
    if img_match and os.path.exists(img_match):
        filename = os.path.basename(img_match)
        body.append(f'--{boundary}'.encode())
        body.append(f'Content-Disposition: form-data; name="source"; filename="{filename}"'.encode())
        body.append(b'Content-Type: image/jpeg')
        body.append(b'')
        with open(img_match, 'rb') as img_f:
            body.append(img_f.read())

    body.append(f'--{boundary}--'.encode())
    body.append(b'')

    payload = b'\r\n'.join(body)
    req = urllib.request.Request(url, data=payload)
    req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')

    try:
        with urllib.request.urlopen(req) as resp:
            res_data = json.loads(resp.read().decode('utf-8'))
            post_id = res_data.get('id') or res_data.get('post_id')
            log_message(f"🎉 自動發布成功！Facebook 貼文 ID: {post_id}")
            
            # Update history
            posted_files.append(candidate)
            history['posted_files'] = posted_files
            history['last_post_time'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            history['last_post_id'] = post_id
            save_history(history)
            return True
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8')
        log_message(f"❌ 自動發布失敗 (HTTP Error): {err_msg}")
        return False
    except Exception as e:
        log_message(f"❌ 自動發布失敗: {e}")
        return False


if __name__ == '__main__':
    run_scheduler_once()
