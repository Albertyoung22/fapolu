import os
import json
import requests
from urllib.parse import urlparse

with open('data/crawled_site.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

os.makedirs('static/img_crawled', exist_ok=True)

all_images = set()
for p in pages:
    for img in p.get('images', []):
        src = img.get('src')
        if src and ('fapolu.com.tw' in src or src.startswith('http')):
            # filter out tracking / tiny icons
            if not any(x in src.lower() for x in ['.svg', 'avatar', 'emoji', 'pixel']):
                all_images.add(src)

print(f"Total unique images found: {len(all_images)}")

downloaded = {}
headers = {'User-Agent': 'Mozilla/5.0'}

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

for url in list(all_images)[:50]:
    filename = os.path.basename(urlparse(url).path)
    if not filename:
        continue
    local_path = os.path.join('static/img_crawled', filename)
    try:
        resp = requests.get(url, headers=headers, timeout=5, verify=False)
        if resp.status_code == 200 and len(resp.content) > 1000:
            with open(local_path, 'wb') as f:
                f.write(resp.content)
            downloaded[url] = f"/static/img_crawled/{filename}"
            print(f"Downloaded: {filename} ({len(resp.content)} bytes)")
    except Exception as e:
        print(f"Failed {url}: {e}")

with open('data/image_map.json', 'w', encoding='utf-8') as f:
    json.dump(downloaded, f, ensure_ascii=False, indent=2)

print(f"Total downloaded valid images: {len(downloaded)}")

