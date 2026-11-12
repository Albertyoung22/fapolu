import re, os

text = open('dist/index.html', encoding='utf-8').read()
# match all /static/img...
pattern = re.compile(r'/static/img[a-zA-Z0-9_\-/]+\.(?:jpg|png|jpeg|webp)')
matches = set(pattern.findall(text))

missing = []
for m in sorted(matches):
    rel = m.lstrip('/')
    disk = os.path.join('dist', rel)
    if not os.path.exists(disk):
        missing.append((m, disk))

print(f'Total static images matched: {len(matches)}')
print(f'Missing: {len(missing)}')
if missing:
    for m, d in missing:
        print(f'MISSING: {m} -> {d}')
else:
    print('ALL IMAGES EXIST PERFECTLY!')
