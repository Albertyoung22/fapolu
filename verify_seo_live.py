import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

tests = [
    ('Robots.txt', 'https://www.fapolu.com.tw/robots.txt'),
    ('Sitemap.xml', 'https://www.fapolu.com.tw/sitemap.xml?flush=1'),
    ('Spec Item #1001', 'https://www.fapolu.com.tw/specs/item/1001'),
    ('Spec Item #1', 'https://www.fapolu.com.tw/specs/item/1'),
    ('Alloy Hub 6061', 'https://www.fapolu.com.tw/specs/alloy/6061'),
]

for name, url in tests:
    req = urllib.request.Request(url, headers={'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)'})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as res:
            content = res.read().decode('utf-8', errors='ignore')
            print(f'[{name}] HTTP {res.status}, Length: {len(content)}')
            if 'Robots' in name:
                print('--- Robots.txt ---\n' + content.strip())
            elif 'Sitemap' in name:
                url_count = content.count('<url>')
                print(f'Total URLs in Sitemap: {url_count}')
                print('First 250 chars:\n' + content[:250])
            elif 'Item' in name:
                print('Has schema.org:', 'schema.org' in content)
                print('Has Product:', 'Product' in content)
                print('Has FAQPage:', 'FAQPage' in content)
                m = re.search(r'<title>(.*?)</title>', content)
                if m:
                    print('Title:', m.group(1))
            elif 'Alloy' in name:
                m = re.search(r'<title>(.*?)</title>', content)
                if m:
                    print('Title:', m.group(1))

    except Exception as e:
        print(f'[{name}] ERROR: {e}')

print("\n--- Testing CTA Links on Item #1001 ---")
req = urllib.request.Request('https://www.fapolu.com.tw/specs/item/1001')
with urllib.request.urlopen(req, context=ctx) as res:
    html = res.read().decode('utf-8')
    for m in re.finditer(r'href=["\']([^"\']+)["\']', html):
        h = m.group(1)
        if '#contact' in h or 'line.me' in h:
            print('Found CTA URL:', h)

