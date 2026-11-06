import json

with open('data/specs_raw.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print("--- PLATES ---")
for t in d['plate']['tables']:
    print(f"Table {t['index']}: {len(t['rows'])} rows")
    if t['rows']:
        print(" Header:", t['rows'][0])
        if len(t['rows']) > 1:
            print(" Sample row 1:", t['rows'][1])

print("\n--- EXTRUSIONS ---")
for t in d['extrusion']['tables']:
    print(f"Table {t['index']}: {len(t['rows'])} rows")
    if t['rows']:
        print(" Header:", t['rows'][0])
        if len(t['rows']) > 1:
            print(" Sample row 1:", t['rows'][1])

