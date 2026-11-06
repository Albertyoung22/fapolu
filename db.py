import os
import sys
import json
import sqlite3
import datetime
import threading

BASE_DIR = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'data', 'fapolu.db')
SPECS_JSON_PATH = os.path.join(BASE_DIR, 'data', 'inventory_specs.json')
INQUIRIES_JSON_PATH = os.path.join(BASE_DIR, 'data', 'inquiries.json')
INQUIRIES_EXAMPLE_PATH = os.path.join(BASE_DIR, 'data', 'inquiries.example.json')

DB_LOCK = threading.Lock()

def get_connection():
    conn = sqlite3.connect(DB_PATH, timeout=20.0)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with DB_LOCK:
        with get_connection() as conn:
            # 1. Specs Table
            conn.execute("""
                CREATE TABLE IF NOT EXISTS inventory_specs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    no TEXT,
                    spec_group TEXT,
                    category TEXT,
                    material TEXT,
                    dimension TEXT,
                    size TEXT,
                    note TEXT,
                    created_at TEXT,
                    updated_at TEXT
                )
            """)
            conn.execute("CREATE INDEX IF NOT EXISTS idx_specs_group ON inventory_specs(spec_group)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_specs_category ON inventory_specs(category)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_specs_material ON inventory_specs(material)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_specs_no ON inventory_specs(no)")

            # 2. Inquiries Table
            conn.execute("""
                CREATE TABLE IF NOT EXISTS inquiries (
                    id TEXT PRIMARY KEY,
                    company_name TEXT,
                    contact_person TEXT,
                    contact_phone TEXT,
                    contact_email TEXT,
                    inquiry_material TEXT,
                    inquiry_message TEXT,
                    drawing_url TEXT,
                    timestamp TEXT,
                    updated_at TEXT,
                    status TEXT DEFAULT 'pending',
                    branch TEXT DEFAULT '未指派',
                    admin_note TEXT DEFAULT '',
                    email_sent INTEGER DEFAULT 0,
                    email_error TEXT DEFAULT ''
                )
            """)
            conn.execute("CREATE INDEX IF NOT EXISTS idx_inq_status ON inquiries(status)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_inq_timestamp ON inquiries(timestamp)")

            # Seed Specs from JSON if table is empty
            cur = conn.execute("SELECT COUNT(*) FROM inventory_specs")
            if cur.fetchone()[0] == 0 and os.path.exists(SPECS_JSON_PATH):
                try:
                    with open(SPECS_JSON_PATH, 'r', encoding='utf-8') as f:
                        raw_specs = json.load(f)
                    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    batch = []
                    for s in raw_specs:
                        batch.append((
                            str(s.get('no', '')),
                            s.get('group', 'stock'),
                            s.get('category', ''),
                            s.get('material', ''),
                            s.get('dimension', ''),
                            s.get('size', ''),
                            s.get('note', ''),
                            now_str,
                            now_str
                        ))
                    conn.executemany("""
                        INSERT INTO inventory_specs (no, spec_group, category, material, dimension, size, note, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, batch)
                    print(f"[*] SQLite 自動匯入完成: {len(batch)} 筆現貨規格資料！")
                except Exception as e:
                    print(f"[!] 匯入 specs_json 失敗: {e}")

            # Seed Inquiries from JSON if table is empty
            cur = conn.execute("SELECT COUNT(*) FROM inquiries")
            if cur.fetchone()[0] == 0:
                inq_file = INQUIRIES_JSON_PATH if os.path.exists(INQUIRIES_JSON_PATH) else INQUIRIES_EXAMPLE_PATH
                if os.path.exists(inq_file):
                    try:
                        with open(inq_file, 'r', encoding='utf-8') as f:
                            raw_inqs = json.load(f)
                        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        for item in raw_inqs:
                            if isinstance(item, dict) and item.get('id'):
                                conn.execute("""
                                    INSERT OR IGNORE INTO inquiries (
                                        id, company_name, contact_person, contact_phone, contact_email,
                                        inquiry_material, inquiry_message, drawing_url, timestamp, updated_at,
                                        status, branch, admin_note, email_sent, email_error
                                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                """, (
                                    item.get('id'),
                                    item.get('companyName', ''),
                                    item.get('contactPerson', ''),
                                    item.get('contactPhone', ''),
                                    item.get('contactEmail', ''),
                                    item.get('inquiryMaterial', ''),
                                    item.get('inquiryMessage', ''),
                                    item.get('drawingUrl', ''),
                                    item.get('timestamp', now_str),
                                    item.get('updatedAt', now_str),
                                    item.get('status', 'pending'),
                                    item.get('branch', '未指派'),
                                    item.get('adminNote', ''),
                                    1 if item.get('emailSent') else 0,
                                    item.get('emailError', '')
                                ))
                    except Exception as e:
                        print(f"[!] 匯入 inquiries 失敗: {e}")

# ==========================================================================
#  Specs CRUD Operations
# ==========================================================================

def get_all_specs():
    with DB_LOCK:
        with get_connection() as conn:
            cur = conn.execute("""
                SELECT id, no, spec_group, category, material, dimension, size, note, created_at, updated_at
                FROM inventory_specs
                ORDER BY id ASC
            """)
            rows = cur.fetchall()
            return [
                {
                    'id': r['id'],
                    'no': r['no'],
                    'group': r['spec_group'],
                    'category': r['category'],
                    'material': r['material'],
                    'dimension': r['dimension'],
                    'size': r['size'],
                    'note': r['note'],
                    'createdAt': r['created_at'],
                    'updatedAt': r['updated_at']
                }
                for r in rows
            ]

def get_spec_by_id(spec_id):
    with DB_LOCK:
        with get_connection() as conn:
            cur = conn.execute("SELECT * FROM inventory_specs WHERE id = ?", (spec_id,))
            r = cur.fetchone()
            if not r:
                return None
            return {
                'id': r['id'],
                'no': r['no'],
                'group': r['spec_group'],
                'category': r['category'],
                'material': r['material'],
                'dimension': r['dimension'],
                'size': r['size'],
                'note': r['note'],
                'createdAt': r['created_at'],
                'updatedAt': r['updated_at']
            }

def add_spec(data):
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    no_val = str(data.get('no', '')).strip()
    group_val = str(data.get('group', 'stock')).strip() or 'stock'
    cat_val = str(data.get('category', '')).strip() or '未分類規格'
    mat_val = str(data.get('material', '')).strip()
    dim_val = str(data.get('dimension', '')).strip()
    size_val = str(data.get('size', '')).strip()
    note_val = str(data.get('note', '')).strip() or ('現貨庫存' if group_val == 'stock' else '免開模現有模具')

    with DB_LOCK:
        with get_connection() as conn:
            # If no is not given, auto assign next sequential number in category
            if not no_val:
                cur = conn.execute("SELECT MAX(CAST(no AS INTEGER)) FROM inventory_specs WHERE category = ?", (cat_val,))
                max_no = cur.fetchone()[0] or 0
                no_val = str(max_no + 1)

            cur = conn.execute("""
                INSERT INTO inventory_specs (no, spec_group, category, material, dimension, size, note, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (no_val, group_val, cat_val, mat_val, dim_val, size_val, note_val, now_str, now_str))
            spec_id = cur.lastrowid

    return get_spec_by_id(spec_id)

def update_spec(spec_id, data):
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    fields = []
    params = []

    mapping = {
        'no': 'no',
        'group': 'spec_group',
        'category': 'category',
        'material': 'material',
        'dimension': 'dimension',
        'size': 'size',
        'note': 'note'
    }

    for key, col in mapping.items():
        if key in data:
            fields.append(f"{col} = ?")
            params.append(str(data[key]).strip())

    if not fields:
        return get_spec_by_id(spec_id)

    fields.append("updated_at = ?")
    params.append(now_str)
    params.append(spec_id)

    with DB_LOCK:
        with get_connection() as conn:
            conn.execute(f"UPDATE inventory_specs SET {', '.join(fields)} WHERE id = ?", params)

    return get_spec_by_id(spec_id)

def delete_spec(spec_id):
    with DB_LOCK:
        with get_connection() as conn:
            cur = conn.execute("DELETE FROM inventory_specs WHERE id = ?", (spec_id,))
            return cur.rowcount > 0

# ==========================================================================
#  Inquiries CRUD Operations
# ==========================================================================

def get_all_inquiries():
    with DB_LOCK:
        with get_connection() as conn:
            cur = conn.execute("SELECT * FROM inquiries ORDER BY timestamp ASC")
            rows = cur.fetchall()
            return [
                {
                    'id': r['id'],
                    'companyName': r['company_name'] or '',
                    'contactPerson': r['contact_person'] or '',
                    'contactPhone': r['contact_phone'] or '',
                    'contactEmail': r['contact_email'] or '',
                    'inquiryMaterial': r['inquiry_material'] or '',
                    'inquiryMessage': r['inquiry_message'] or '',
                    'drawingUrl': r['drawing_url'] or '',
                    'timestamp': r['timestamp'] or '',
                    'updatedAt': r['updated_at'] or '',
                    'status': r['status'] or 'pending',
                    'branch': r['branch'] or '未指派',
                    'adminNote': r['admin_note'] or '',
                    'emailSent': bool(r['email_sent']),
                    'emailError': r['email_error'] or ''
                }
                for r in rows
            ]

def get_inquiry_by_id(ticket_id):
    with DB_LOCK:
        with get_connection() as conn:
            cur = conn.execute("SELECT * FROM inquiries WHERE id = ?", (ticket_id,))
            r = cur.fetchone()
            if not r:
                return None
            return {
                'id': r['id'],
                'companyName': r['company_name'] or '',
                'contactPerson': r['contact_person'] or '',
                'contactPhone': r['contact_phone'] or '',
                'contactEmail': r['contact_email'] or '',
                'inquiryMaterial': r['inquiry_material'] or '',
                'inquiryMessage': r['inquiry_message'] or '',
                'drawingUrl': r['drawing_url'] or '',
                'timestamp': r['timestamp'] or '',
                'updatedAt': r['updated_at'] or '',
                'status': r['status'] or 'pending',
                'branch': r['branch'] or '未指派',
                'adminNote': r['admin_note'] or '',
                'emailSent': bool(r['email_sent']),
                'emailError': r['email_error'] or ''
            }

def next_ticket_id():
    with DB_LOCK:
        with get_connection() as conn:
            cur = conn.execute("SELECT id FROM inquiries")
            ids = [r['id'] for r in cur.fetchall()]
    max_num = 1000
    for tid in ids:
        if str(tid).startswith('REQ-'):
            try:
                max_num = max(max_num, int(str(tid).split('-', 1)[1]))
            except ValueError:
                pass
    return f"REQ-{max_num + 1}"

def add_inquiry(item):
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    tid = item.get('id') or next_ticket_id()
    item['id'] = tid
    item.setdefault('timestamp', now_str)
    item.setdefault('updatedAt', now_str)
    item.setdefault('status', 'pending')
    item.setdefault('branch', '未指派')
    item.setdefault('adminNote', '')
    item.setdefault('emailSent', False)
    item.setdefault('drawingUrl', '')

    with DB_LOCK:
        with get_connection() as conn:
            conn.execute("""
                INSERT OR REPLACE INTO inquiries (
                    id, company_name, contact_person, contact_phone, contact_email,
                    inquiry_material, inquiry_message, drawing_url, timestamp, updated_at,
                    status, branch, admin_note, email_sent, email_error
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item['id'],
                item.get('companyName', ''),
                item.get('contactPerson', ''),
                item.get('contactPhone', ''),
                item.get('contactEmail', ''),
                item.get('inquiryMaterial', ''),
                item.get('inquiryMessage', ''),
                item.get('drawingUrl', ''),
                item.get('timestamp', now_str),
                item.get('updatedAt', now_str),
                item.get('status', 'pending'),
                item.get('branch', '未指派'),
                item.get('adminNote', ''),
                1 if item.get('emailSent') else 0,
                item.get('emailError', '')
            ))
    return item

def update_inquiry(ticket_id, updates):
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    fields = []
    params = []

    mapping = {
        'companyName': 'company_name',
        'contactPerson': 'contact_person',
        'contactPhone': 'contact_phone',
        'contactEmail': 'contact_email',
        'inquiryMaterial': 'inquiry_material',
        'inquiryMessage': 'inquiry_message',
        'drawingUrl': 'drawing_url',
        'status': 'status',
        'branch': 'branch',
        'adminNote': 'admin_note',
        'emailSent': 'email_sent',
        'emailError': 'email_error'
    }

    for key, col in mapping.items():
        if key in updates:
            fields.append(f"{col} = ?")
            val = updates[key]
            if key == 'emailSent':
                val = 1 if val else 0
            params.append(val)

    if not fields:
        return get_inquiry_by_id(ticket_id)

    fields.append("updated_at = ?")
    params.append(now_str)
    params.append(ticket_id)

    with DB_LOCK:
        with get_connection() as conn:
            conn.execute(f"UPDATE inquiries SET {', '.join(fields)} WHERE id = ?", params)

    return get_inquiry_by_id(ticket_id)

def delete_inquiry(ticket_id):
    with DB_LOCK:
        with get_connection() as conn:
            cur = conn.execute("DELETE FROM inquiries WHERE id = ?", (ticket_id,))
            return cur.rowcount > 0

# Initialize DB on load
init_db()

