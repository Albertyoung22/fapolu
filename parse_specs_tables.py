import json
import os
from bs4 import BeautifulSoup
import requests
import urllib3
urllib3.disable_warnings()

headers = {'User-Agent': 'Mozilla/5.0'}

def extract_tables_from_url(url):
    print(f"Fetching {url}...")
    resp = requests.get(url, headers=headers, verify=False, timeout=15)
    soup = BeautifulSoup(resp.text, 'html.parser')
    
    tables_data = []
    # Divi tables can be in table tags or tab sections
    for i, table in enumerate(soup.find_all('table')):
        rows = []
        for tr in table.find_all('tr'):
            cells = [td.get_text().strip() for td in tr.find_all(['th', 'td'])]
            if any(cells):
                rows.append(cells)
        if rows:
            tables_data.append({"index": i, "rows": rows})
            
    # Also check if Divi uses tab modules or text blocks
    text_blocks = []
    for tab in soup.find_all(class_='et_pb_tab'):
        title = tab.find(class_='et_pb_tab_title')
        title_text = title.get_text().strip() if title else f"Tab {len(text_blocks)+1}"
        text_blocks.append({"tab": title_text, "text": tab.get_text().strip()[:200]})
        
    return {"tables": tables_data, "tabs": text_blocks}

if __name__ == '__main__':
    plate_data = extract_tables_from_url("https://fapolu.com.tw/%e9%8b%81%e5%90%88%e9%87%91%e6%9d%bf%e7%8f%be%e8%b2%a8%e8%a6%8f%e6%a0%bc%e8%a1%a8/")
    extrusion_data = extract_tables_from_url("https://fapolu.com.tw/%e7%8f%be%e8%b2%a8%e8%a6%8f%e6%a0%bc%e8%a1%a8/")
    
    with open('data/specs_raw.json', 'w', encoding='utf-8') as f:
        json.dump({"plate": plate_data, "extrusion": extrusion_data}, f, ensure_ascii=False, indent=2)
    print(f"Extracted tables! Plates: {len(plate_data['tables'])} tables, Extrusions: {len(extrusion_data['tables'])} tables")

