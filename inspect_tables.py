import json
import re

with open('data/crawled_site.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

for p in pages:
    if '現貨規格表' in p['title'] or '模具規格表' in p['title']:
        print(f"=== {p['title']} ===")
        # inspect some text
        lines = [line for line in p['text'].split('\n') if line.strip()]
        print(f"Total lines: {len(lines)}")
        print("\n".join(lines[:30]))
        print("...\n")

