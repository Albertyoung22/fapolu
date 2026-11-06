import os
import sys
import json
import hashlib
import asyncio
from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
import edge_tts

# Support PyInstaller bundled environment
BASE_DIR = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'templates'),
    static_folder=os.path.join(BASE_DIR, 'static')
)

# Ensure required directories exist in working directory
os.makedirs(os.path.join(BASE_DIR, 'static', 'audio', 'cache'), exist_ok=True)
os.makedirs('data', exist_ok=True)

# Load data
DATA_PATH = os.path.join(BASE_DIR, 'data', 'fapolu_complete_data.json')
SPECS_PATH = os.path.join(BASE_DIR, 'data', 'inventory_specs.json')

with open(DATA_PATH, 'r', encoding='utf-8') as f:
    SITE_DATA = json.load(f)

try:
    with open(SPECS_PATH, 'r', encoding='utf-8') as f:
        INVENTORY_DATA = json.load(f)
except Exception:
    INVENTORY_DATA = []

# Tunnel helper
import tunnel

@app.route('/api/tunnel-status')
def api_tunnel_status():
    render_url = os.environ.get('RENDER_EXTERNAL_URL')
    if render_url or os.environ.get('RENDER'):
        return jsonify({
            "running": True,
            "url": render_url or request.host_url.rstrip('/')
        })
    url = tunnel.get_public_url()
    is_running = tunnel.tunnel_process is not None and tunnel.tunnel_process.poll() is None
    return jsonify({
        "running": is_running,
        "url": url if is_running else None
    })

@app.route('/api/tunnel/start', methods=['POST'])
def api_tunnel_start():
    render_url = os.environ.get('RENDER_EXTERNAL_URL')
    if render_url or os.environ.get('RENDER'):
        return jsonify({
            "success": True,
            "url": render_url or request.host_url.rstrip('/'),
            "message": "目前已運行於 Render 雲端公開伺服器"
        })
    port = request.json.get('port', 5000) if request.json else 5000
    if tunnel.tunnel_process and tunnel.tunnel_process.poll() is None:
        return jsonify({"success": True, "url": tunnel.get_public_url(), "message": "Tunnel 已經在運行中"})
    try:
        url = tunnel.start_tunnel(port=port, wait_for_url=True, timeout=25)
        return jsonify({"success": True, "url": url, "message": "Tunnel 已成功建立！"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/tunnel/stop', methods=['POST'])
def api_tunnel_stop():
    tunnel.stop_tunnel()
    return jsonify({"success": True, "message": "Tunnel 已停止"})

@app.route('/')
def index():
    return render_template('index.html', data=SITE_DATA, inventory_count=len(INVENTORY_DATA))

@app.route('/api/site-data')
def api_site_data():
    return jsonify(SITE_DATA)

@app.route('/api/specs')
def api_specs():
    query = request.args.get('q', '').strip().lower()
    category = request.args.get('category', '').strip()
    
    results = INVENTORY_DATA
    if category and category != '全部':
        results = [item for item in results if item.get('category') == category]
        
    if query:
        results = [
            item for item in results
            if query in item.get('material', '').lower()
            or query in item.get('dimension', '').lower()
            or query in item.get('size', '').lower()
            or query in item.get('note', '').lower()
            or query in item.get('category', '').lower()
        ]
        
    # Categories list for filter dropdown
    categories = sorted(list(set(item['category'] for item in INVENTORY_DATA)))
    
    # Pagination
    try:
        page = max(1, int(request.args.get('page', 1)))
        per_page = max(10, min(100, int(request.args.get('per_page', 25))))
    except ValueError:
        page = 1
        per_page = 25
        
    total = len(results)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = results[start:end]
    
    return jsonify({
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
        "categories": categories,
        "items": paginated
    })

@app.route('/api/tts')
def api_tts():
    text = request.args.get('text', '').strip()
    voice = request.args.get('voice', 'zh-TW-HsiaoChenNeural').strip()
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
        
    # Limit length for safety
    if len(text) > 800:
        text = text[:800]
        
    # Generate unique cache hash
    text_hash = hashlib.md5(f"{voice}_{text}".encode('utf-8')).hexdigest()
    cache_filename = f"tts_{text_hash}.mp3"
    cache_path = os.path.join(BASE_DIR, 'static', 'audio', 'cache', cache_filename)
    audio_url = f"/static/audio/cache/{cache_filename}"
    
    if os.path.exists(cache_path) and os.path.getsize(cache_path) > 500:
        return jsonify({"url": audio_url, "cached": True})
        
    try:
        async def do_tts():
            tts = edge_tts.Communicate(text, voice)
            await tts.save(cache_path)
            
        asyncio.run(do_tts())
        return jsonify({"url": audio_url, "cached": False})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/contact', methods=['POST'])
def api_contact():
    try:
        data = request.json or request.form.to_dict()
        inquiries_file = os.path.join(BASE_DIR, 'data', 'inquiries.json')
        inquiries = []
        if os.path.exists(inquiries_file):
            try:
                with open(inquiries_file, 'r', encoding='utf-8') as f:
                    inquiries = json.load(f)
            except:
                inquiries = []
                
        import datetime
        data['timestamp'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data['id'] = f"REQ-{len(inquiries) + 1001}"
        inquiries.append(data)
        
        with open(inquiries_file, 'w', encoding='utf-8') as f:
            json.dump(inquiries, f, ensure_ascii=False, indent=2)
            
        return jsonify({
            "success": True,
            "message": "感謝您的諮詢！我們的業務工程師將於 24 小時內與您聯繫。",
            "ticket_id": data['id']
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

