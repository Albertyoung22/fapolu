import json
import re

with open('data/crawled_site.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

# Let's inspect specific key pages
key_pages = {}
for p in pages:
    url = p['url']
    for key in ['about', 'vision', 'service', 'sales-industry', 'case', 'contact', 'process', 'project', 'news', '規格表']:
        if key in url:
            if key not in key_pages:
                key_pages[key] = []
            key_pages[key].append(p)

print("Key pages count by category:")
for k, v in key_pages.items():
    print(f"{k}: {len(v)}")

# Print about & contact text
for p in pages:
    if '/about/' in p['url']:
        print("\n--- ABOUT ---")
        print(p['text'][:800])
    if '/contact/' in p['url']:
        print("\n--- CONTACT ---")
        print(p['text'][:800])
    if '/vision/' in p['url']:
        print("\n--- VISION ---")
        print(p['text'][:800])
    if '/service/' in p['url']:
        print("\n--- SERVICE ---")
        print(p['text'][:800])
    if '/sales-industry/' in p['url']:
        print("\n--- SALES INDUSTRY ---")
        print(p['text'][:800])
    if '/case/' in p['url']:
        print("\n--- CASE ---")
        print(p['text'][:800])

