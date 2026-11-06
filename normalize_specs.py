import json

with open('data/specs_raw.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

inventory = []

def parse_double_col_table(rows, cat_name):
    if not rows or len(rows) < 2:
        return []
    items = []
    # inspect header length
    header = rows[0]
    is_split_5 = len(header) >= 10
    for r in rows[1:]:
        # Left half
        if len(r) >= 5 and r[1].strip():
            items.append({
                "category": cat_name,
                "material": r[1].strip(),
                "dimension": r[2].strip() if len(r) > 2 else "",
                "size": r[3].strip() if len(r) > 3 else "",
                "note": r[4].strip() if len(r) > 4 else ""
            })
        # Right half
        if is_split_5 and len(r) >= 10 and r[6].strip():
            items.append({
                "category": cat_name,
                "material": r[6].strip(),
                "dimension": r[7].strip() if len(r) > 7 else "",
                "size": r[8].strip() if len(r) > 8 else "",
                "note": r[9].strip() if len(r) > 9 else ""
            })
    return items

# Plates
cat_names = [
    "1050 / 5052 鋁板",
    "5083 鋁合金板",
    "6061 鋁合金板",
    "7075 鋁合金板",
    "日本進口 5052 貼膜鋁板"
]

for i, table in enumerate(d['plate']['tables']):
    name = cat_names[i] if i < len(cat_names) else f"鋁板規格表 {i+1}"
    rows = table['rows']
    if i == 4: # 4 columns
        for r in rows[1:]:
            if len(r) >= 3 and r[0].strip():
                inventory.append({
                    "category": name,
                    "material": r[0].strip(),
                    "dimension": r[1].strip() if len(r) > 1 else "",
                    "size": r[2].strip() if len(r) > 2 else "",
                    "note": r[3].strip() if len(r) > 3 else ""
                })
    else:
        parsed = parse_double_col_table(rows, name)
        inventory.extend(parsed)

# Extrusions
# Table 0: 圓棒
ext_t0 = d['extrusion']['tables'][0]['rows']
for r in ext_t0[1:]:
    if len(r) >= 5 and (r[1].strip() or r[2].strip()):
        inventory.append({
            "category": "鋁擠型圓棒",
            "material": r[1].strip() or "6061",
            "dimension": f"Dia. {r[2].strip()} mm",
            "size": f"長度 {r[3].strip()} mm" if r[3].strip() else "",
            "note": r[4].strip()
        })
    if len(r) >= 10 and (r[6].strip() or r[7].strip()):
        inventory.append({
            "category": "鋁擠型圓棒",
            "material": r[6].strip() or "6061",
            "dimension": f"Dia. {r[7].strip()} mm",
            "size": f"長度 {r[8].strip()} mm" if r[8].strip() else "",
            "note": r[9].strip()
        })

# Table 1: 扁條
ext_t1 = d['extrusion']['tables'][1]['rows']
for r in ext_t1[1:]:
    if len(r) >= 5 and r[1].strip():
        inventory.append({
            "category": "鋁擠型扁條",
            "material": "6061-T6",
            "dimension": f"寬 {r[1].strip()} x 厚 {r[2].strip()} mm",
            "size": f"長度 {r[3].strip()} mm",
            "note": f"單重 {r[4].strip()} kg" if r[4].strip() else ""
        })
    if len(r) >= 10 and r[6].strip():
        inventory.append({
            "category": "鋁擠型扁條",
            "material": "6061-T6",
            "dimension": f"寬 {r[6].strip()} x 厚 {r[7].strip()} mm",
            "size": f"長度 {r[8].strip()} mm",
            "note": f"單重 {r[9].strip()} kg" if r[9].strip() else ""
        })

with open('data/inventory_specs.json', 'w', encoding='utf-8') as f:
    json.dump(inventory, f, ensure_ascii=False, indent=2)

print(f"Total normalized inventory items: {len(inventory)}")

