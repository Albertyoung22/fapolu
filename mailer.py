import os
import sys
import json
import html
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr

BASE_DIR = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(BASE_DIR, 'data', 'admin_config.json')


def load_local_config():
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_local_config(data):
    os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
    current = load_local_config()
    current.update(data)
    with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
        json.dump(current, f, ensure_ascii=False, indent=2)
    return current


def get_admin_password():
    env_pwd = os.environ.get('ADMIN_PASSWORD', '').strip()
    if env_pwd:
        return env_pwd
    local_cfg = load_local_config()
    return local_cfg.get('admin_password', '').strip() or 'fapolu8888'


def get_smtp_config():
    local_cfg = load_local_config()
    host = os.environ.get('SMTP_HOST', '').strip() or local_cfg.get('smtp_host', 'smtp.gmail.com').strip()
    port_raw = os.environ.get('SMTP_PORT', '').strip() or str(local_cfg.get('smtp_port', 587)).strip()
    try:
        port = int(port_raw)
    except ValueError:
        port = 587

    user = os.environ.get('SMTP_USER', '').strip() or local_cfg.get('smtp_user', '').strip()
    password = os.environ.get('SMTP_PASS', '').strip() or local_cfg.get('smtp_pass', '').strip()
    notify_email = os.environ.get('NOTIFY_EMAIL', '').strip() or local_cfg.get('notify_email', '').strip() or user

    enabled = bool(host and user and password and notify_email)
    from_env = bool(os.environ.get('SMTP_USER') and os.environ.get('SMTP_PASS'))

    return {
        'smtp_host': host,
        'smtp_port': port,
        'smtp_user': user,
        'smtp_pass': password,
        'notify_email': notify_email,
        'enabled': enabled,
        'from_env': from_env
    }


def _send_mail_message(cfg, subject, html_body, text_body, reply_to=None):
    if not cfg.get('enabled'):
        raise ValueError("尚未完成 SMTP 寄件帳號與應用程式密碼設定")

    recipients = [addr.strip() for addr in cfg['notify_email'].replace(';', ',').split(',') if addr.strip()]
    if not recipients:
        raise ValueError("未設定有效的收件通知信箱 (NOTIFY_EMAIL)")

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = formataddr(('法寶實業詢價系統', cfg['smtp_user']))
    msg['To'] = ', '.join(recipients)
    if reply_to:
        msg['Reply-To'] = reply_to

    msg.attach(MIMEText(text_body, 'plain', 'utf-8'))
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    host = cfg['smtp_host']
    port = cfg['smtp_port']

    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=20) as server:
            server.login(cfg['smtp_user'], cfg['smtp_pass'])
            server.sendmail(cfg['smtp_user'], recipients, msg.as_string())
    else:
        with smtplib.SMTP(host, port, timeout=20) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(cfg['smtp_user'], cfg['smtp_pass'])
            server.sendmail(cfg['smtp_user'], recipients, msg.as_string())


def send_inquiry_email(inquiry, custom_cfg=None):
    """寄送客戶新詢價單 HTML 通知信"""
    cfg = custom_cfg or get_smtp_config()
    ticket_id = inquiry.get('id', 'REQ-NEW')
    company = inquiry.get('companyName', '未填寫')
    person = inquiry.get('contactPerson', '未填寫')
    phone = inquiry.get('contactPhone', '未填寫')
    email = inquiry.get('contactEmail', '未填寫')
    material = inquiry.get('inquiryMaterial') or '（未指定型號）'
    message = inquiry.get('inquiryMessage') or '（無額外備註說明）'
    drawing_url = inquiry.get('drawingUrl', '').strip()
    timestamp = inquiry.get('timestamp', '')

    subject = f"【法寶實業新詢價單】{ticket_id}｜{company} - {material[:35]}"

    drawing_text = f"\n圖面連結/說明：{drawing_url}" if drawing_url else ""
    text_body = (
        f"法寶實業有限公司 - 線上即時詢價通知\n"
        f"========================================\n"
        f"詢價單號：{ticket_id}\n"
        f"送出時間：{timestamp}\n"
        f"公司寶號：{company}\n"
        f"聯絡人員：{person}\n"
        f"聯絡電話：{phone}\n"
        f"電子郵件：{email}\n"
        f"材料規格：{material}\n"
        f"{drawing_text}"
        f"需求說明：\n{message}\n"
        f"========================================\n"
        f"可直接回覆此郵件與客戶聯繫，或登入 /admin 後台更新報價進度。"
    )

    esc_ticket = html.escape(str(ticket_id))
    esc_time = html.escape(str(timestamp))
    esc_company = html.escape(str(company))
    esc_person = html.escape(str(person))
    esc_phone = html.escape(str(phone))
    esc_email = html.escape(str(email))
    esc_material = html.escape(str(material))
    esc_drawing = html.escape(str(drawing_url))
    esc_message = html.escape(str(message))

    drawing_row = ""
    if drawing_url:
        if drawing_url.startswith('http://') or drawing_url.startswith('https://'):
            drawing_val_html = f'<a href="{esc_drawing}" target="_blank" style="color:#38bdf8;font-weight:bold;text-decoration:underline;">🔗 點擊開啟圖面連結</a>'
        else:
            drawing_val_html = f'<span style="color:#cbd5e1;">{esc_drawing}</span>'
        drawing_row = f"""
                <tr>
                    <td style="padding:10px 0;color:#94a3b8;border-bottom:1px solid #1e293b;">CAD/圖面說明</td>
                    <td style="padding:10px 0;border-bottom:1px solid #1e293b;">{drawing_val_html}</td>
                </tr>
        """

    html_body = f"""
    <div style="font-family:'Microsoft JhengHei',Arial,sans-serif;max-width:640px;margin:0 auto;background:#0b1324;color:#f8fafc;border-radius:14px;overflow:hidden;border:1px solid #1e293b;">
        <div style="background:linear-gradient(135deg,#0d1b36,#132c52);padding:22px 28px;border-bottom:2px solid #00f0ff;">
            <div style="font-size:12px;color:#00f0ff;letter-spacing:1.5px;font-weight:bold;">FAPO ENTERPRISE · RFQ NOTIFICATION</div>
            <h2 style="margin:6px 0 0;font-size:20px;color:#ffffff;">法寶實業 新進客戶詢價單通知</h2>
        </div>
        <div style="padding:24px 28px;">
            <div style="background:#131e36;padding:12px 16px;border-radius:8px;margin-bottom:18px;display:flex;justify-content:space-between;">
                <span style="color:#00f0ff;font-weight:bold;font-size:15px;">單號：{esc_ticket}</span>
                <span style="color:#94a3b8;font-size:13px;margin-left:16px;">時間：{esc_time}</span>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr>
                    <td style="padding:10px 0;color:#94a3b8;width:110px;border-bottom:1px solid #1e293b;">公司寶號</td>
                    <td style="padding:10px 0;color:#f8fafc;font-weight:bold;border-bottom:1px solid #1e293b;">{esc_company}</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;color:#94a3b8;border-bottom:1px solid #1e293b;">聯絡人姓名</td>
                    <td style="padding:10px 0;color:#f8fafc;border-bottom:1px solid #1e293b;">{esc_person}</td>
                </tr>
                <tr>
                    <td style="padding:10px 0;color:#94a3b8;border-bottom:1px solid #1e293b;">聯絡電話</td>
                    <td style="padding:10px 0;color:#38bdf8;border-bottom:1px solid #1e293b;"><a href="tel:{esc_phone}" style="color:#38bdf8;text-decoration:none;">{esc_phone}</a></td>
                </tr>
                <tr>
                    <td style="padding:10px 0;color:#94a3b8;border-bottom:1px solid #1e293b;">電子郵件</td>
                    <td style="padding:10px 0;color:#38bdf8;border-bottom:1px solid #1e293b;"><a href="mailto:{esc_email}" style="color:#38bdf8;text-decoration:none;">{esc_email}</a></td>
                </tr>
                <tr>
                    <td style="padding:10px 0;color:#94a3b8;border-bottom:1px solid #1e293b;">材料型號規格</td>
                    <td style="padding:10px 0;color:#fbbf24;font-weight:bold;border-bottom:1px solid #1e293b;">{esc_material}</td>
                </tr>
                {drawing_row}
            </table>
            <div style="margin-top:18px;">
                <div style="color:#94a3b8;font-size:13px;margin-bottom:8px;">需求數量、加工說明與備註：</div>
                <div style="background:#131e36;padding:14px 16px;border-radius:8px;color:#e2e8f0;line-height:1.6;white-space:pre-wrap;border-left:3px solid #00f0ff;">{esc_message}</div>
            </div>
            <div style="margin-top:22px;padding-top:16px;border-top:1px solid #1e293b;font-size:12px;color:#94a3b8;">
                💡 提示：直接點擊信箱的「回覆 (Reply)」即可回信給客戶 ({esc_email})，或前往系統 <b>/admin</b> 詢價管理後台標記處理狀態。
            </div>
        </div>
    </div>
    """

    reply_addr = email if '@' in email else None
    _send_mail_message(cfg, subject, html_body, text_body, reply_to=reply_addr)


def send_test_email(custom_cfg=None):
    """發送 SMTP 連線測試信"""
    cfg = custom_cfg or get_smtp_config()
    import datetime
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    subject = "✅【法寶實業詢價後台】SMTP 即時通知信連線測試成功"
    text_body = f"恭喜！法寶實業詢價系統的 Email (SMTP) 通知功能已成功啟用。\n測試時間：{now_str}\n收件信箱：{cfg['notify_email']}"
    html_body = f"""
    <div style="font-family:'Microsoft JhengHei',Arial,sans-serif;max-width:560px;margin:0 auto;background:#0b1324;color:#f8fafc;padding:28px;border-radius:14px;border:1px solid #00f0ff;">
        <h2 style="margin:0 0 12px;color:#00f0ff;">✅ SMTP 通知連線測試成功</h2>
        <p style="color:#cbd5e1;line-height:1.7;">法寶實業有限公司線上詢價系統已成功連接您的郵件伺服器。當客戶於前台送出詢價需求單時，系統將第一時間發送詳盡通知信至此信箱。</p>
        <div style="background:#131e36;padding:12px 16px;border-radius:8px;margin-top:16px;font-size:13px;color:#94a3b8;">
            <div>測試時間：{now_str}</div>
            <div>SMTP 主機：{cfg['smtp_host']}:{cfg['smtp_port']}</div>
            <div>收件信箱：{cfg['notify_email']}</div>
        </div>
    </div>
    """
    _send_mail_message(cfg, subject, html_body, text_body)
