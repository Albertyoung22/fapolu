import json
from collections import defaultdict

with open('data/crawled_site.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

print(f"Total crawled pages: {len(pages)}")

categories = defaultdict(list)
for p in pages:
    url = p['url']
    title = p['title'].replace(" | 法寶實業有限公司", "").replace(" – 法寶實業有限公司", "")
    if '/project/' in url:
        categories['Products / Materials (project)'].append((title, url, len(p['text'])))
    elif '/process/' in url:
        categories['Processes / Capability'].append((title, url, len(p['text'])))
    elif any(k in url for k in ['news', '2026', '2021', 'category', 'author']):
        categories['News & Announcements'].append((title, url, len(p['text'])))
    else:
        categories['Main Pages'].append((title, url, len(p['text'])))

for cat, items in categories.items():
    print(f"\n=== {cat} ({len(items)}) ===")
    for title, url, tlen in items:
        print(f" - {title}: {url} (text len: {tlen})")

