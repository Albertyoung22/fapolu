import os
import json
import logging
import urllib.request
import urllib.error

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

def send_line_push_notification(text: str, user_id: str = None) -> bool:
    cfg = load_line_config()
    if not cfg.get('enabled', True):
        logger.info("LINE notifications disabled in config.")
        return False

    token = cfg.get('channel_access_token')
    if not token:
        logger.warning("LINE token missing, cannot send push.")
        return False

    # 1. Broadcast to all followers (全員廣播) if user_id is not specifically pinned or broadcast is enabled
    is_broadcast = cfg.get('broadcast', True) and (user_id is None)
    if is_broadcast:
        b_url = 'https://api.line.me/v2/bot/message/broadcast'
        b_payload = {
            'messages': [
                {
                    'type': 'text',
                    'text': text
                }
            ]
        }
        try:
            req = urllib.request.Request(
                b_url,
                data=json.dumps(b_payload).encode('utf-8'),
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
        'messages': [
            {
                'type': 'text',
                'text': text
            }
        ]
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
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

def notify_new_inquiry(inquiry_data: dict) -> bool:
    """Formats and sends LINE notification for new metal quotation inquiry."""
    ticket_id = inquiry_data.get('id', 'N/A')
    company = inquiry_data.get('companyName') or '未填寫/個人'
    person = inquiry_data.get('contactPerson') or '未填寫'
    phone = inquiry_data.get('contactPhone') or '未填寫'
    email = inquiry_data.get('contactEmail') or '未填寫'
    material = inquiry_data.get('inquiryMaterial') or '未指定'
    branch = inquiry_data.get('branch') or '中部營運總部'
    county = inquiry_data.get('deliveryCounty') or '未填'
    message = inquiry_data.get('inquiryMessage') or '無補充需求'
    drawing_url = inquiry_data.get('drawingUrl') or ''

    text = (
        f"⚡【法寶實業】官網新客戶詢價單！({ticket_id})\n"
        f"━━━━━━━━━━━━━━━\n"
        f"🏢 公司名稱：{company}\n"
        f"👤 聯絡窗口：{person}\n"
        f"📞 聯絡電話：{phone}\n"
        f"✉️ 電子信箱：{email}\n"
        f"📦 詢價規格：{material}\n"
        f"📍 送貨區域：{county}（{branch}）\n"
        f"💬 需求備註：{message}\n"
    )

    if drawing_url:
        text += f"📎 附隨圖面：{drawing_url}\n"

    text += (
        f"━━━━━━━━━━━━━━━\n"
        f"🔗 線上管理後台：https://www.fapolu.com.tw/admin.html"
    )

    return send_line_push_notification(text)
