import os
import json
import jinja2

base_dir = r'd:\PythonTest\fapolu'
data_path = os.path.join(base_dir, 'data', 'fapolu_complete_data.json')
with open(data_path, 'r', encoding='utf-8') as f:
    site_data = json.load(f)

def mock_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', '')
        v = values.get('v')
        if v:
            return f'/static/{filename}?v={v}'
        return f'/static/{filename}'
    return '/'

env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.join(base_dir, 'templates')),
    autoescape=jinja2.select_autoescape(['html', 'xml'])
)
env.globals['url_for'] = mock_url_for

template = env.get_template('index.html')
rendered_html = template.render(
    data=site_data,
    active_page='hero',
    all_pages_meta={}
)

# Insert classic link to footer in rendered html
target_str = '<li style="margin-top: 8px;"><a href="/admin"'
old_link = '<li><a href="/old/" target="_blank" style="color: #b8332a; font-weight: 600;">🏛️ 前往經典舊版官網</a></li>\n                        '
if target_str in rendered_html:
    rendered_html = rendered_html.replace(target_str, old_link + target_str)

output_path = os.path.join(base_dir, 'dist', 'index.html')
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(rendered_html)

print('SUCCESS_RECOMPILED_DIST_INDEX_HTML, Size:', len(rendered_html))
