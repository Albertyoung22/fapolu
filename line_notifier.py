import os
import json
import logging
import re
import urllib.request
import urllib.error
from datetime import datetime

logger = logging.getLogger(__name__)

CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'line_config.json')

def load_line_config():
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error reading line_config.json: {e}")
    return {}

def send_line_push_notification(msg_or_card, user_id: str = None) -> bool:
    cfg = load_line_config()
    if not cfg.get('enabled', True):
        logger.info("LINE notifications disabled in config.")
        return False

    token = cfg.get('channel_access_token')
    if not token:
        logger.warning("LINE token missing, cannot send push.")
        return False

    message_item = msg_or_card if (isinstance(msg_or_card, dict) and 'type' in msg_or_card) else {
        'type': 'text',
        'text': str(msg_or_card)
    }

    # 1. Broadcast to all followers (全員廣播) if user_id is not specifically pinned or broadcast is enabled
    is_broadcast = cfg.get('broadcast', True) and (user_id is None)
    if is_broadcast:
        b_url = 'https://api.line.me/v2/bot/message/broadcast'
        b_payload = {
            'messages': [message_item]
        }
        try:
            req = urllib.request.Request(
                b_url,
                data=json.dumps(b_payload, ensure_ascii=False).encode('utf-8'),
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {token}'
                }
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status == 200:
                    logger.info("LINE broadcast message successfully sent to all followers.")
                    return True
        except Exception as be:
            logger.warning(f"LINE broadcast failed, attempting single user push fallback: {be}")

    # 2. Targeted Push Fallback (or targeted user push)
    target_user = user_id or cfg.get('user_id')
    if not target_user:
        logger.warning("LINE target_user missing for push fallback.")
        return False

    url = 'https://api.line.me/v2/bot/message/push'
    payload = {
        'to': target_user,
        'messages': [message_item]
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'
            }
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status == 200
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8', errors='ignore')
        logger.error(f"LINE push failed [{e.code}]: {err_msg}")
        return False
    except Exception as e:
        logger.error(f"LINE push unexpected error: {e}")
        return False


def _build_flex_row(label: str, value: str, value_color: str = "#0f172a", is_bold: bool = True) -> dict:
    return {
        "type": "box",
        "layout": "horizontal",
        "spacing": "sm",
        "contents": [
            {
                "type": "box",
                "layout": "vertical",
                "width": "75px",
                "contents": [
                    {"type": "text", "text": label, "size": "xs", "color": "#64748b"}
                ]
            },
            {
                "type": "text",
                "text": str(value) if value else "未填寫",
                "size": "sm",
                "color": value_color,
                "weight": "bold" if is_bold else "regular",
                "wrap": True,
                "flex": 1
            }
        ]
    }


def build_inquiry_flex_card(inquiry_data: dict) -> dict:
    ticket_id = inquiry_data.get('id', 'REQ-1000')
    company = inquiry_data.get('companyName') or '未填寫/個人'
    person = inquiry_data.get('contactPerson') or '未填寫'
    phone = inquiry_data.get('contactPhone') or '未填寫'
    email = inquiry_data.get('contactEmail') or '未填寫'
    material = inquiry_data.get('inquiryMaterial') or '未指定規格'
    branch = inquiry_data.get('branch') or '全台營運中心'
    county = inquiry_data.get('deliveryCounty') or '未指定區域'
    message = inquiry_data.get('inquiryMessage') or '無補充備註'
    drawing_url = inquiry_data.get('drawingUrl') or ''
    timestamp = inquiry_data.get('timestamp') or datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    is_test = ('測試' in company or '測試' in person or '測試' in material or inquiry_data.get('is_test'))

    clean_phone = re.sub(r'[^\d\+]', '', phone)
    if not clean_phone:
        clean_phone = '0227183134'

    badge_text = "工程測試" if is_test else "即時通報"
    badge_color = "#f59e0b" if is_test else "#10b981"
    sub_title_kicker = "⚠️ 系統連線與格式測試單" if is_test else "⚡ 官網新進詢價清單"

    body_contents = [
        {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
                _build_flex_row("🏢 客戶公司", company),
                _build_flex_row("👤 聯絡窗口", person),
                _build_flex_row("📞 聯絡電話", phone, value_color="#0284c7", is_bold=True),
                _build_flex_row("✉️ 電子信箱", email, value_color="#334155", is_bold=False),
                _build_flex_row("📍 送貨區域", f"{county}（{branch}）", value_color="#dc2626", is_bold=True)
            ]
        },
        {"type": "separator"},
        {
            "type": "box",
            "layout": "vertical",
            "spacing": "xs",
            "contents": [
                {"type": "text", "text": "📦 詢價規格項目：", "size": "xs", "color": "#64748b", "weight": "bold"},
                {"type": "text", "text": material, "size": "sm", "color": "#0f172a", "weight": "bold", "wrap": True}
            ]
        },
        {
            "type": "box",
            "layout": "vertical",
            "spacing": "xs",
            "contents": [
                {"type": "text", "text": "💬 需求備註：", "size": "xs", "color": "#64748b"},
                {"type": "text", "text": message, "size": "xs", "color": "#475569", "wrap": True}
            ]
        }
    ]

    if drawing_url:
        body_contents.append({
            "type": "box",
            "layout": "vertical",
            "spacing": "xs",
            "contents": [
                {"type": "text", "text": "📎 附隨圖面：", "size": "xs", "color": "#64748b", "weight": "bold"},
                {"type": "text", "text": drawing_url, "size": "xs", "color": "#2563eb", "wrap": True}
            ]
        })

    return {
        "type": "flex",
        "altText": f"⚡【法寶實業】線上客戶詢價單！({ticket_id})",
        "contents": {
            "type": "bubble",
            "size": "mega",
            "header": {
                "type": "box",
                "layout": "vertical",
                "backgroundColor": "#1e293b" if is_test else "#0f172a",
                "paddingAll": "16px",
                "contents": [
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {"type": "text", "text": sub_title_kicker, "weight": "bold", "color": "#fbbf24", "size": "xs", "flex": 1},
                            {"type": "text", "text": badge_text, "weight": "bold", "color": badge_color, "size": "xxs", "align": "end"}
                        ]
                    },
                    {"type": "text", "text": "法寶實業 · 線上客戶詢價單", "weight": "bold", "color": "#ffffff", "size": "lg", "margin": "sm"},
                    {"type": "text", "text": f"案號：{ticket_id} | {timestamp}", "color": "#94a3b8", "size": "xs", "margin": "xs"}
                ]
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "paddingAll": "18px",
                "spacing": "md",
                "contents": body_contents
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "spacing": "sm",
                "paddingAll": "14px",
                "contents": [
                    {
                        "type": "button",
                        "action": {
                            "type": "uri",
                            "label": "📞 一鍵直接撥打電話",
                            "uri": f"tel:{clean_phone}"
                        },
                        "style": "primary",
                        "color": "#059669",
                        "height": "sm"
                    },
                    {
                        "type": "button",
                        "action": {
                            "type": "uri",
                            "label": "🖥️ 前往官網後台管理",
                            "uri": "https://www.fapolu.com.tw/admin.html"
                        },
                        "style": "secondary",
                        "color": "#0f172a",
                        "height": "sm"
                    }
                ]
            }
        }
    }


def notify_new_inquiry(inquiry_data: dict) -> bool:
    """Formats and sends LINE rich Flex Card for new metal quotation inquiry."""
    card = build_inquiry_flex_card(inquiry_data)
    return send_line_push_notification(card)
