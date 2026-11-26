# -*- coding: utf-8 -*-
import os

# 1. Update main.js in dist and static
for path in ['dist/static/js/main.js', 'static/js/main.js']:
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace PORTAL_PAGES tech definition
    content = content.replace(
        "{ id: 'tech', path: '/tech', short: '技術硬度', label: '國際硬度換算與熱處理辭典' },",
        "{ id: 'tech', path: '/tech', short: '技術知識庫', label: '鋁材工程知識庫 · 特性選用與合金物性表' },"
    )
    # Replace dict tech definitions
    content = content.replace(
        "'tech': { short: '技術硬度', label: '國際硬度換算與熱處理辭典' },",
        "'tech': { short: '技術知識庫', label: '鋁材工程知識庫 · 特性選用與合金物性表' },"
    )
    content = content.replace(
        "'tech': { short: 'Tech Hub', label: 'Hardness Conversion & Temper Dict' },",
        "'tech': { short: 'Tech Hub', label: 'Engineering Knowledge Hub · Metallurgy & Specs' },"
    )
    content = content.replace(
        "'tech': { short: '技術硬度', label: '国際硬度換算と調質記号辞書' },",
        "'tech': { short: '技術知識庫', label: 'アルミ工学知識ベース · 特性選定と合金物性表' },"
    )
    content = content.replace(
        "'tech': { short: '기술지식', label: '국제 경도 환산 및 조질 기호 사전' },",
        "'tech': { short: '기술지식고', label: '알루미늄 공학 지식 베이스 · 특성 및 합금 물성표' },"
    )
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {path}')

# 2. Update style.css in dist and static
desktop_css = '''
@media (min-width: 992px) {
  .subpage-pill-strip {
    display: none !important;
  }
  .subpage-topbar {
    padding-top: 84px;
    padding-bottom: 10px;
  }
  .subpage-crumb-row {
    margin-bottom: 0;
  }
}
'''
for path in ['dist/static/css/style.css', 'static/css/style.css']:
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    target = '.subpage-pill.active {\n  background: linear-gradient(135deg, #a62c22, #851e16);\n  border-color: #a62c22;\n  color: #fffaf2;\n  box-shadow: 0 3px 10px rgba(166, 44, 34, 0.24);\n}'
    if target in content and '@media (min-width: 992px)' not in content:
        content = content.replace(target, target + '\n' + desktop_css)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {path} with desktop media query')
    else:
        print(f'CSS Target handled in {path}')

# 3. Update dist/index.html
with open('dist/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace "技術硬度" with "技術知識庫"
html = html.replace('>技術硬度</a>', '>技術知識庫</a>')
# Update cache busters
html = html.replace('style.css?v=37.0', 'style.css?v=38.0')
html = html.replace('main.js?v=48.0', 'main.js?v=49.0')

with open('dist/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Updated dist/index.html')
