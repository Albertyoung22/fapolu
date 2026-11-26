"""
法寶金屬有限公司 - Facebook 粉絲專頁自動發文機器人
支援 Meta Graph API (v21.0)
功能：
1. 讀取「法寶FB專頁素材/貼文庫」中的圖文
2. 透過 Meta Graph API 自動發布照片貼文至 Facebook 粉絲專頁
3. 支援乾跑測試模式 (Dry Run) 與排程自動推播
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.parse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
POSTS_DIR = os.path.join(BASE_DIR, '法寶FB專頁素材', '貼文庫')
CONFIG_FILE = os.path.join(BASE_DIR, 'fb_config.json')


def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"[警告] 設定檔讀取失敗: {e}")
    return {}


def get_available_posts():
    if not os.path.exists(POSTS_DIR):
        return []
    
    posts = []
    # Find all .txt files
    files = sorted([f for f in os.listdir(POSTS_DIR) if f.endswith('.txt')])
    for idx, f in enumerate(files, 1):
        txt_path = os.path.join(POSTS_DIR, f)
        with open(txt_path, 'r', encoding='utf-8') as tf:
            content = tf.read().strip()
        
        # Look for matching image
        base_prefix = f[:4] # e.g. "貼文01"
        img_match = None
        for img in os.listdir(POSTS_DIR):
            if (img.endswith('.jpg') or img.endswith('.png')) and base_prefix in img:
                img_match = os.path.join(POSTS_DIR, img)
                break
        
        first_line = content.split('\n')[0] if content else f
        posts.append({
            'id': idx,
            'title': first_line,
            'file': f,
            'txt_path': txt_path,
            'image_path': img_match,
            'content': content
        })
    return posts


def post_to_facebook(page_id, access_token, message, image_path=None):
    """Publish photo + message to Facebook Page via Graph API"""
    if not image_path or not os.path.exists(image_path):
        # Post text only
        url = f"https://graph.facebook.com/v21.0/{page_id}/feed"
        data = urllib.parse.urlencode({
            'message': message,
            'access_token': access_token
        }).encode('utf-8')
        req = urllib.request.Request(url, data=data)
    else:
        # Post photo with caption
        url = f"https://graph.facebook.com/v21.0/{page_id}/photos"
        boundary = '----WebKitFormBoundaryFapoMetalAutoPost7MA4YWxkTrZu0gW'
        
        body = []
        body.append(f'--{boundary}'.encode())
        body.append(f'Content-Disposition: form-data; name="caption"'.encode())
        body.append(b'')
        body.append(message.encode('utf-8'))
        
        body.append(f'--{boundary}'.encode())
        body.append(f'Content-Disposition: form-data; name="access_token"'.encode())
        body.append(b'')
        body.append(access_token.encode('utf-8'))
        
        # File field
        filename = os.path.basename(image_path)
        body.append(f'--{boundary}'.encode())
        body.append(f'Content-Disposition: form-data; name="source"; filename="{filename}"'.encode())
        body.append(b'Content-Type: image/jpeg')
        body.append(b'')
        with open(image_path, 'rb') as img_f:
            body.append(img_f.read())
            
        body.append(f'--{boundary}--'.encode())
        body.append(b'')
        
        payload = b'\r\n'.join(body)
        req = urllib.request.Request(url, data=payload)
        req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
    
    try:
        with urllib.request.urlopen(req) as resp:
            res_data = json.loads(resp.read().decode('utf-8'))
            return True, res_data
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8')
        return False, err_msg
    except Exception as e:
        return False, str(e)


def main():
    parser = argparse.ArgumentParser(description="法寶金屬 Facebook 自動發文機器人")
    parser.add_argument('--list', action='store_true', help="列出貼文庫中所有待發貼文")
    parser.add_argument('--post', type=int, help="發布指定編號的貼文 (例如: --post 1)")
    parser.add_argument('--dry-run', action='store_true', help="模擬測試發文 (不實際呼叫 FB API)")
    args = parser.parse_args()

    posts = get_available_posts()
    config = load_config()

    page_id = config.get('page_id', '').strip()
    token = config.get('page_access_token', '').strip()

    if args.list or len(sys.argv) == 1:
        print("\n========================================================")
        print(" 🏭 法寶金屬 Facebook 官方粉絲專頁 · 貼文素材庫")
        print("========================================================")
        if not posts:
            print("目前貼文庫中暫無貼文，請在「法寶FB專頁素材/貼文庫」新增 .txt 檔案。")
            return
        
        for p in posts:
            img_desc = os.path.basename(p['image_path']) if p['image_path'] else '無配圖'
            print(f"[{p['id']}] {p['title']}")
            print(f"    📷 配圖: {img_desc}")
            print(f"    📄 檔案: {p['file']}\n")
        
        print("--------------------------------------------------------")
        print("💡 使用方式：")
        print("  python auto_post_fb.py --post 1      # 發布指定貼文")
        print("  python auto_post_fb.py --dry-run --post 1  # 模擬預覽貼文")
        print("========================================================\n")
        return

    if args.post:
        target = next((p for p in posts if p['id'] == args.post), None)
        if not target:
            print(f"[錯誤] 找不到編號為 {args.post} 的貼文！")
            return
        
        print(f"\n🚀 準備發布貼文 [{target['id']}]: {target['title']}")
        if target['image_path']:
            print(f"📷 附加圖片: {target['image_path']}")
        
        # Check token
        is_dummy_token = '請在此填入' in token or not token
        if args.dry_run or is_dummy_token:
            print("\n--------------------------------------------------------")
            print("🔍 【模擬預覽模式 (Dry Run)】貼文完整內容如下：")
            print("--------------------------------------------------------")
            print(target['content'])
            print("--------------------------------------------------------")
            if is_dummy_token:
                print("💡 提示：目前尚未在 `fb_config.json` 填入實際的 Page ID 與 Access Token。")
                print("   只要填入權杖後，執行 `python auto_post_fb.py --post 1` 就會直接發上 Facebook！")
            else:
                print("✅ 模擬測試完成，格式正確！")
            return
        
        print("📡 正在連線至 Meta Graph API 發布貼文...")
        success, res = post_to_facebook(page_id, token, target['content'], target['image_path'])
        if success:
            post_id = res.get('id') or res.get('post_id')
            print(f"🎉 發布成功！Facebook 貼文 ID: {post_id}")
        else:
            print(f"❌ 發布失敗: {res}")


if __name__ == '__main__':
    main()
