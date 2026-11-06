import os
import io
import csv
import sys
import hmac
import json
import hashlib
import asyncio
import datetime
import threading
from functools import wraps
from flask import Flask, Response, render_template, request, jsonify, session
import edge_tts
import mailer

# Support PyInstaller bundled environment
BASE_DIR = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'templates'),
    static_folder=os.path.join(BASE_DIR, 'static')
)

# Deterministic secret key across multi-worker Gunicorn instances unless overridden
_raw_secret = os.environ.get('SECRET_KEY') or f"fapolu-rfq-admin-{mailer.get_admin_password()}"
app.secret_key = hashlib.sha256(_raw_secret.encode('utf-8')).hexdigest()

INQUIRIES_LOCK = threading.Lock()
INQUIRIES_FILE = os.path.join(BASE_DIR, 'data', 'inquiries.json')

# Ensure required directories exist in working directory
os.makedirs(os.path.join(BASE_DIR, 'static', 'audio', 'cache'), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, 'data'), exist_ok=True)

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

@app.after_request
def add_header(response):
    if response.mimetype == 'text/html':
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    return response

PAGE_META = {
    'hero': {
        'path': '/',
        'label': '首頁總覽',
        'title': '法寶實業有限公司 | FAPO ENTERPRISE - 全方位鋁合金材料供應鏈與精密加工整合首選',
        'desc': '法寶實業有限公司創立於1986年，深耕台灣近40年。專營日本UACJ 5052貼膜鋁板、7075航太鋁、6061、5083船用鋁板、3,071項現貨與模具規格及CNC精密加工一站式服務。'
    },
    'about': {
        'path': '/about',
        'label': '關於我們 · 成立概要與願景',
        'title': '關於我們 · 成立概要、經營理念與九大營業項目 | 法寶實業有限公司',
        'desc': '法寶實業創立於1986年，秉持誠信立基、整合共榮，橫跨鋁材、不鏽鋼、鎂合金、銅材與精密加工九大營業範疇，服務半導體與航太十一大產業。'
    },
    'network': {
        'path': '/network',
        'label': '全台北中南服務網絡',
        'title': '全台服務據點 · 台北總公司、台中廠、台南雙廠區 | 法寶實業有限公司',
        'desc': '法寶實業於台北松山總公司、台中西屯物流裁切中心、台南佳里一廠與麻豆二廠建立緊密物流網絡，常備千噸鋁材迅速調撥配送。'
    },
    'products': {
        'path': '/products',
        'label': '精選旗艦材料與壓花板圖鑑',
        'title': '精選旗艦鋁材、日本UACJ 5052貼膜鋁板與壓花板圖鑑 | 法寶實業有限公司',
        'desc': '供應日本UACJ 5052低應力貼膜鋁板、7075航太超硬鋁、6061結構板、5083船用鋁板、鏡面鋁與五爪鑽石壓花鋁板，附原廠材質證明。'
    },
    'specs': {
        'path': '/specs',
        'label': '現貨規格與現有模具檢索',
        'title': '現貨規格表與鋁擠型現有模具檢索 (3,071筆) | 法寶實業有限公司',
        'desc': '即時查詢法寶實業514項常備鋁板、圓棒、扁條現貨規格，以及2,557種免開模鋁圓管、扁條、方管、六角條現有模具尺寸資料庫。'
    },
    'machining': {
        'path': '/machining',
        'label': '高階精密加工與實品圖鑑',
        'title': '高階CNC精密加工、五軸聯動、龍門銑削與實品展示 | 法寶實業有限公司',
        'desc': '整合CNC高速銑床、精密車床、航太五軸同動、大型龍門銑削、微細孔加工與表面陽極處理，提供毛胚鋸切至成品出貨一站式製造服務。'
    },
    'cases': {
        'path': '/cases',
        'label': '半導體與航太代表實績',
        'title': '代表實績案例 · 半導體真空腔體、航太與光電設備 | 法寶實業有限公司',
        'desc': '法寶實業協助半導體設備大廠、航太結構件與自動化機械客戶克服內應力變形與輕量化挑戰之成功實績解析。'
    },
    'tech': {
        'path': '/tech',
        'label': '國際硬度換算與熱處理辭典',
        'title': '金屬硬度即時換算器 (HB/HRC/HRB/HV) 與鋁合金調質辭典 | 法寶實業有限公司',
        'desc': '線上即時換算布氏HB、洛氏HRC/HRB、維氏HV、肖氏HS硬度與抗拉強度，並提供鋁合金F/O/H/W/T6/T651熱處理代號技術定義。'
    },
    'contact': {
        'path': '/contact',
        'label': '即時諮詢與線上圖面估價',
        'title': '即時諮詢與線上規格圖面估價單 | 法寶實業有限公司',
        'desc': '歡迎線上提交鋁合金材料規格或CNC加工圖面需求，法寶實業台北、台中、台南專業業務工程師將於24小時內提供報價與技術建議。'
    }
}


def _render_portal_page(page_key):
    meta = PAGE_META.get(page_key, PAGE_META['hero'])
    return render_template(
        'index.html',
        data=SITE_DATA,
        inventory_count=len(INVENTORY_DATA),
        active_page=page_key,
        page_meta=meta,
        all_pages_meta=PAGE_META
    )


@app.route('/')
def index():
    return _render_portal_page('hero')


@app.route('/about', strict_slashes=False)
def page_about():
    return _render_portal_page('about')


@app.route('/network', strict_slashes=False)
def page_network():
    return _render_portal_page('network')


@app.route('/products', strict_slashes=False)
def page_products():
    return _render_portal_page('products')


@app.route('/specs', strict_slashes=False)
def page_specs():
    return _render_portal_page('specs')


@app.route('/machining', strict_slashes=False)
def page_machining():
    return _render_portal_page('machining')


@app.route('/cases', strict_slashes=False)
def page_cases():
    return _render_portal_page('cases')


@app.route('/tech', strict_slashes=False)
def page_tech():
    return _render_portal_page('tech')


@app.route('/contact', strict_slashes=False)
def page_contact():
    return _render_portal_page('contact')

@app.route('/api/site-data')
def api_site_data():
    return jsonify(SITE_DATA)

@app.route('/api/specs')
def api_specs():
    query = request.args.get('q', '').strip().lower()
    category = request.args.get('category', '').strip()
    group = request.args.get('group', '').strip()
    
    results = INVENTORY_DATA
    if group in ('stock', 'mold'):
        results = [item for item in results if item.get('group') == group]
        
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
            or query == str(item.get('no', '')).lower()
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
    voice_key = request.args.get('voice', 'zen-male').strip()
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
        
    # Limit length for safety
    if len(text) > 800:
        text = text[:800]

    # Map Zen / Buddhist Dharma prosody presets
    if voice_key in ('zen-male', 'zh-TW-YunJheNeural'):
        actual_voice = 'zh-TW-YunJheNeural'
        rate = '-18%'
        pitch = '-10Hz'
        speak_text = text.replace('。', '。…… ').replace('；', '；… ')
    elif voice_key == 'zen-female':
        actual_voice = 'zh-TW-HsiaoChenNeural'
        rate = '-15%'
        pitch = '-4Hz'
        speak_text = text.replace('。', '。…… ').replace('；', '；… ')
    else:
        actual_voice = 'zh-TW-HsiaoChenNeural'
        rate = '+0%'
        pitch = '+0Hz'
        speak_text = text
        
    # Generate unique cache hash including prosody parameters
    text_hash = hashlib.md5(f"{actual_voice}_{rate}_{pitch}_{speak_text}".encode('utf-8')).hexdigest()
    cache_filename = f"tts_{text_hash}.mp3"
    cache_path = os.path.join(BASE_DIR, 'static', 'audio', 'cache', cache_filename)
    audio_url = f"/static/audio/cache/{cache_filename}"
    
    if os.path.exists(cache_path) and os.path.getsize(cache_path) > 500:
        return jsonify({"url": audio_url, "cached": True})
        
    try:
        async def do_tts():
            tts = edge_tts.Communicate(speak_text, actual_voice, rate=rate, pitch=pitch)
            await tts.save(cache_path)
            
        asyncio.run(do_tts())
        return jsonify({"url": audio_url, "cached": False})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def _normalize_inquiry(item):
    item.setdefault('status', 'pending')      # pending | quoting | closed | archived
    item.setdefault('branch', '未指派')        # 未指派 | 台北總公司 | 台中廠 | 台南雙廠區
    item.setdefault('adminNote', '')
    item.setdefault('updatedAt', item.get('timestamp', ''))
    item.setdefault('emailSent', False)
    return item


def load_inquiries():
    with INQUIRIES_LOCK:
        if not os.path.exists(INQUIRIES_FILE):
            return []
        try:
            with open(INQUIRIES_FILE, 'r', encoding='utf-8') as f:
                items = json.load(f)
                return [_normalize_inquiry(i) for i in items if isinstance(i, dict)]
        except Exception:
            return []


def save_inquiries(items):
    with INQUIRIES_LOCK:
        os.makedirs(os.path.dirname(INQUIRIES_FILE), exist_ok=True)
        with open(INQUIRIES_FILE, 'w', encoding='utf-8') as f:
            json.dump(items, f, ensure_ascii=False, indent=2)


def _next_ticket_id(items):
    max_num = 1000
    for item in items:
        raw_id = str(item.get('id', ''))
        if raw_id.startswith('REQ-'):
            try:
                max_num = max(max_num, int(raw_id.split('-', 1)[1]))
            except ValueError:
                pass
    return f"REQ-{max_num + 1}"


def _async_notify_inquiry(inquiry_copy):
    cfg = mailer.get_smtp_config()
    if not cfg.get('enabled'):
        return
    try:
        mailer.send_inquiry_email(inquiry_copy, custom_cfg=cfg)
        items = load_inquiries()
        for item in items:
            if item.get('id') == inquiry_copy.get('id'):
                item['emailSent'] = True
                item.pop('emailError', None)
                break
        save_inquiries(items)
    except Exception as e:
        items = load_inquiries()
        for item in items:
            if item.get('id') == inquiry_copy.get('id'):
                item['emailSent'] = False
                item['emailError'] = str(e)
                break
        save_inquiries(items)


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not session.get('is_admin'):
            return jsonify({"success": False, "error": "未授權，請先登入管理後台"}), 401
        return fn(*args, **kwargs)
    return wrapper


@app.route('/api/contact', methods=['POST'])
def api_contact():
    try:
        raw = request.json or request.form.to_dict() or {}
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        inquiries = load_inquiries()

        new_item = {
            "id": _next_ticket_id(inquiries),
            "companyName": str(raw.get('companyName', '')).strip(),
            "contactPerson": str(raw.get('contactPerson', '')).strip(),
            "contactPhone": str(raw.get('contactPhone', '')).strip(),
            "contactEmail": str(raw.get('contactEmail', '')).strip(),
            "inquiryMaterial": str(raw.get('inquiryMaterial', '')).strip(),
            "inquiryMessage": str(raw.get('inquiryMessage', '')).strip(),
            "timestamp": now_str,
            "updatedAt": now_str,
            "status": "pending",
            "branch": "未指派",
            "adminNote": "",
            "emailSent": False
        }
        inquiries.append(new_item)
        save_inquiries(inquiries)

        # Background SMTP notification
        threading.Thread(target=_async_notify_inquiry, args=(dict(new_item),), daemon=True).start()

        return jsonify({
            "success": True,
            "message": "感謝您的諮詢！我們的業務工程師將於 24 小時內與您聯繫。",
            "ticket_id": new_item['id']
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ==========================================================================
#  Admin Backend Routes (/admin & /api/admin/*)
# ==========================================================================

@app.route('/admin')
def admin_dashboard():
    is_logged_in = bool(session.get('is_admin'))
    is_render = bool(os.environ.get('RENDER') or os.environ.get('RENDER_EXTERNAL_URL'))
    return render_template('admin.html', is_logged_in=is_logged_in, is_render=is_render)


@app.route('/api/admin/login', methods=['POST'])
def api_admin_login():
    body = request.json or {}
    password = str(body.get('password', '')).strip()
    expected = mailer.get_admin_password()
    if password and hmac.compare_digest(password.encode('utf-8'), expected.encode('utf-8')):
        session['is_admin'] = True
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "管理密碼錯誤，請重新輸入"}), 401


@app.route('/api/admin/logout', methods=['POST'])
def api_admin_logout():
    session.pop('is_admin', None)
    return jsonify({"success": True})


@app.route('/api/admin/inquiries', methods=['GET'])
@admin_required
def api_admin_inquiries():
    items = load_inquiries()
    items_sorted = list(reversed(items))
    stats = {
        "total": len(items),
        "pending": sum(1 for i in items if i.get('status') == 'pending'),
        "quoting": sum(1 for i in items if i.get('status') == 'quoting'),
        "closed": sum(1 for i in items if i.get('status') == 'closed'),
        "archived": sum(1 for i in items if i.get('status') == 'archived'),
    }
    smtp_cfg = mailer.get_smtp_config()
    return jsonify({
        "success": True,
        "items": items_sorted,
        "stats": stats,
        "smtpEnabled": smtp_cfg['enabled'],
        "notifyEmail": smtp_cfg['notify_email'],
        "isRender": bool(os.environ.get('RENDER') or os.environ.get('RENDER_EXTERNAL_URL'))
    })


@app.route('/api/admin/inquiries/<ticket_id>', methods=['PATCH'])
@admin_required
def api_admin_update_inquiry(ticket_id):
    body = request.json or {}
    items = load_inquiries()
    updated = None
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    for item in items:
        if item.get('id') == ticket_id:
            if 'status' in body and body['status'] in ('pending', 'quoting', 'closed', 'archived'):
                item['status'] = body['status']
            if 'branch' in body:
                item['branch'] = str(body['branch']).strip() or '未指派'
            if 'adminNote' in body:
                item['adminNote'] = str(body['adminNote']).strip()
            item['updatedAt'] = now_str
            updated = item
            break

    if not updated:
        return jsonify({"success": False, "error": "找不到該筆詢價單"}), 404

    save_inquiries(items)
    return jsonify({"success": True, "item": updated})


@app.route('/api/admin/inquiries/<ticket_id>', methods=['DELETE'])
@admin_required
def api_admin_delete_inquiry(ticket_id):
    items = load_inquiries()
    new_items = [i for i in items if i.get('id') != ticket_id]
    if len(new_items) == len(items):
        return jsonify({"success": False, "error": "找不到該筆詢價單"}), 404
    save_inquiries(new_items)
    return jsonify({"success": True})


@app.route('/api/admin/inquiries/<ticket_id>/resend-email', methods=['POST'])
@admin_required
def api_admin_resend_email(ticket_id):
    items = load_inquiries()
    target = next((i for i in items if i.get('id') == ticket_id), None)
    if not target:
        return jsonify({"success": False, "error": "找不到該筆詢價單"}), 404
    try:
        mailer.send_inquiry_email(target)
        target['emailSent'] = True
        target.pop('emailError', None)
        save_inquiries(items)
        return jsonify({"success": True, "message": "已成功補寄通知信！"})
    except Exception as e:
        target['emailSent'] = False
        target['emailError'] = str(e)
        save_inquiries(items)
        return jsonify({"success": False, "error": str(e)}), 400


@app.route('/api/admin/inquiries/export', methods=['GET'])
@admin_required
def api_admin_export_csv():
    status_filter = request.args.get('status', 'all')
    items = list(reversed(load_inquiries()))
    if status_filter and status_filter != 'all':
        items = [i for i in items if i.get('status') == status_filter]

    status_labels = {
        'pending': '待處理',
        'quoting': '已報價/跟進中',
        'closed': '已成交結案',
        'archived': '已取消/歸檔'
    }

    output = io.StringIO()
    output.write('\ufeff')  # UTF-8 BOM for Microsoft Excel Traditional Chinese compatibility
    writer = csv.writer(output)
    writer.writerow([
        '詢價單號', '處理狀態', '指派廠區', '建立時間', '最後更新',
        '公司寶號', '聯絡人', '聯絡電話', '電子郵件',
        '材料型號與規格需求', '需求數量與加工說明', '內部業務備註', 'Email通知狀態'
    ])
    for i in items:
        writer.writerow([
            i.get('id', ''),
            status_labels.get(i.get('status', 'pending'), i.get('status', '')),
            i.get('branch', '未指派'),
            i.get('timestamp', ''),
            i.get('updatedAt', ''),
            i.get('companyName', ''),
            i.get('contactPerson', ''),
            i.get('contactPhone', ''),
            i.get('contactEmail', ''),
            i.get('inquiryMaterial', ''),
            i.get('inquiryMessage', ''),
            i.get('adminNote', ''),
            '已寄送' if i.get('emailSent') else '未寄送'
        ])

    filename = f"fapolu_inquiries_{datetime.datetime.now().strftime('%Y%m%d_%H%M')}.csv"
    return Response(
        output.getvalue(),
        mimetype='text/csv; charset=utf-8',
        headers={'Content-Disposition': f'attachment; filename="{filename}"'}
    )


@app.route('/api/admin/settings', methods=['GET', 'POST'])
@admin_required
def api_admin_settings():
    if request.method == 'GET':
        cfg = mailer.get_smtp_config()
        return jsonify({
            "success": True,
            "smtp_host": cfg['smtp_host'],
            "smtp_port": cfg['smtp_port'],
            "smtp_user": cfg['smtp_user'],
            "has_smtp_pass": bool(cfg['smtp_pass']),
            "notify_email": cfg['notify_email'],
            "enabled": cfg['enabled'],
            "from_env": cfg['from_env'],
            "has_env_admin_pwd": bool(os.environ.get('ADMIN_PASSWORD'))
        })

    body = request.json or {}
    updates = {}
    if 'smtp_host' in body:
        updates['smtp_host'] = str(body['smtp_host']).strip() or 'smtp.gmail.com'
    if 'smtp_port' in body:
        try:
            updates['smtp_port'] = int(body['smtp_port'])
        except ValueError:
            updates['smtp_port'] = 587
    if 'smtp_user' in body:
        updates['smtp_user'] = str(body['smtp_user']).strip()
    if body.get('smtp_pass'):
        updates['smtp_pass'] = str(body['smtp_pass']).strip()
    if 'notify_email' in body:
        updates['notify_email'] = str(body['notify_email']).strip()
    if body.get('new_admin_password'):
        updates['admin_password'] = str(body['new_admin_password']).strip()

    mailer.save_local_config(updates)
    cfg = mailer.get_smtp_config()
    return jsonify({
        "success": True,
        "enabled": cfg['enabled'],
        "message": "設定已儲存！"
    })


@app.route('/api/admin/test-email', methods=['POST'])
@admin_required
def api_admin_test_email():
    body = request.json or {}
    current_cfg = mailer.get_smtp_config()
    test_cfg = {
        'smtp_host': str(body.get('smtp_host') or current_cfg['smtp_host']).strip(),
        'smtp_port': int(body.get('smtp_port') or current_cfg['smtp_port']),
        'smtp_user': str(body.get('smtp_user') or current_cfg['smtp_user']).strip(),
        'smtp_pass': str(body.get('smtp_pass') or current_cfg['smtp_pass']).strip(),
        'notify_email': str(body.get('notify_email') or current_cfg['notify_email']).strip(),
    }
    test_cfg['enabled'] = bool(test_cfg['smtp_host'] and test_cfg['smtp_user'] and test_cfg['smtp_pass'] and test_cfg['notify_email'])
    try:
        mailer.send_test_email(custom_cfg=test_cfg)
        return jsonify({"success": True, "message": f"測試信已成功寄送至 {test_cfg['notify_email']}！請檢查收件匣。"})
    except Exception as e:
        return jsonify({"success": False, "error": f"寄送失敗：{e}"}), 400


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

