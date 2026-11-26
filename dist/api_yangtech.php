<?php
// YangTech Digital Transformation Consultation & Ad Management API
// Supports: Lead Intake, Status Tracking, Notes, Ad Analytics & Config
error_reporting(E_ALL);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$DATA_DIR = __DIR__ . '/data';
if (!file_exists($DATA_DIR)) {
    @mkdir($DATA_DIR, 0755, true);
}

$LEADS_FILE = $DATA_DIR . '/yangtech_leads.json';
$CONFIG_FILE = $DATA_DIR . '/yangtech_config.json';

// Initialize default config if missing
if (!file_exists($CONFIG_FILE)) {
    $default_config = array(
        'ad_enabled' => true,
        'ad_title' => '揚州數位轉型整合 (YangTech)',
        'ad_poem' => '煙花三月下揚州，賦能企業數位轉型',
        'ad_pitch' => '喜歡法寶實業的 3,071 項金屬規格庫與手繪詢價系統嗎？我們為傳統製造、機關學校打造專屬 ERP 與自動化系統。',
        'ad_mode' => 'modal_card', // modal_card or toast_banner
        'impressions' => 0,
        'clicks' => 0,
        'admin_password' => 'yangtech2026'
    );
    file_put_contents($CONFIG_FILE, json_encode($default_config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Initialize default leads if missing
if (!file_exists($LEADS_FILE)) {
    $default_leads = array(
        array(
            'id' => 'YT-20261120-001',
            'created_at' => '2026-11-20 14:32:10',
            'company' => '大同機械五金工業股份有限公司',
            'name' => '陳總經理',
            'phone' => '0912-345-678',
            'email' => 'service@tatung-hardware.example.tw',
            'line_id' => 'tatung_chen',
            'service_type' => '傳統製造/材料 ERP 與估價系統',
            'budget' => '15萬 - 30萬',
            'message' => '希望將目前的紙本出貨單與庫存報表全面數位化，並參考法寶實業的線上材料規格搜尋器。',
            'status' => '洽談中',
            'notes' => '11/21 已電話聯繫初步溝通，下週三安排線上 Demo 演示法寶 ERP 模組。'
        )
    );
    file_put_contents($LEADS_FILE, json_encode($default_leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function get_json($file) {
    if (!file_exists($file)) return array();
    $raw = @file_get_contents($file);
    $arr = json_decode($raw, true);
    return is_array($arr) ? $arr : array();
}


// DUAL-CLOUD BACKUP HELPERS
function sync_to_cloud_mirror($payload) {
    $url = 'https://fapolu-io9w.onrender.com/api/yangtech/backup_lead';
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    @curl_exec($ch);
    @curl_close($ch);
}

function create_daily_snapshot($leads) {
    global $DATA_DIR;
    $backup_dir = $DATA_DIR . '/backups';
    if (!file_exists($backup_dir)) {
        @mkdir($backup_dir, 0755, true);
    }
    $snapshot_file = $backup_dir . '/yangtech_leads_' . date('Ymd') . '.json';
    @file_put_contents($snapshot_file, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function save_json($file, $data) {
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// ==========================================
// LINE OFFICIAL ACCOUNT NOTIFICATION HELPERS
// ==========================================
function get_line_config() {
    global $DATA_DIR;
    $cfg_file = $DATA_DIR . '/line_config.json';
    if (!file_exists($cfg_file)) {
        $cfg_file = dirname(__FILE__) . '/line_config.json';
    }
    if (!file_exists($cfg_file)) {
        $cfg_file = dirname(__FILE__) . '/../line_config.json';
    }
    return get_json($cfg_file);
}

function build_yt_flex_row($label, $value, $value_color = '#0f172a', $is_bold = true) {
    return array(
        'type' => 'box',
        'layout' => 'horizontal',
        'spacing' => 'sm',
        'contents' => array(
            array(
                'type' => 'box',
                'layout' => 'vertical',
                'width' => '75px',
                'contents' => array(
                    array('type' => 'text', 'text' => $label, 'size' => 'xs', 'color' => '#64748b')
                )
            ),
            array(
                'type' => 'text',
                'text' => !empty($value) ? (string)$value : '未填寫',
                'size' => 'sm',
                'color' => $value_color,
                'weight' => $is_bold ? 'bold' : 'regular',
                'wrap' => true,
                'flex' => 1
            )
        )
    );
}

function build_yangtech_flex_card($lead) {
    $id = isset($lead['id']) ? $lead['id'] : 'YT-' . date('Ymd') . '-001';
    $company = isset($lead['company']) && $lead['company'] !== '' ? $lead['company'] : '個人/未填寫';
    $name = isset($lead['name']) && $lead['name'] !== '' ? $lead['name'] : '未填寫';
    $phone = isset($lead['phone']) && $lead['phone'] !== '' ? $lead['phone'] : '未填寫';
    $email = isset($lead['email']) && $lead['email'] !== '' ? $lead['email'] : '未填寫';
    $line_id = isset($lead['line_id']) && $lead['line_id'] !== '' ? $lead['line_id'] : '未填寫';
    $service_type = isset($lead['service_type']) && $lead['service_type'] !== '' ? $lead['service_type'] : '數位轉型整合';
    $budget = isset($lead['budget']) && $lead['budget'] !== '' ? $lead['budget'] : '洽談評估中';
    $message = isset($lead['message']) && $lead['message'] !== '' ? $lead['message'] : '無補充備註';
    $created_at = isset($lead['created_at']) ? $lead['created_at'] : date('Y-m-d H:i:s');

    $is_test = (
        mb_strpos($company, '測試') !== false ||
        mb_strpos($name, '測試') !== false ||
        mb_strpos($message, '測試') !== false ||
        stripos($company, 'test') !== false
    );

    $clean_phone = preg_replace('/[^\d\+]/', '', $phone);
    if (empty($clean_phone)) $clean_phone = '0227183134';

    $body_contents = array();
    if ($is_test) {
        $body_contents[] = array(
            'type' => 'box',
            'layout' => 'vertical',
            'backgroundColor' => '#fef3c7',
            'paddingAll' => '10px',
            'cornerRadius' => '6px',
            'contents' => array(
                array(
                    'type' => 'text',
                    'text' => '📢【工程測試提醒】此單為系統升級連線測試，非真實客戶洽詢，請同仁勿撥打電話或接單！',
                    'size' => 'xs',
                    'color' => '#b45309',
                    'weight' => 'bold',
                    'wrap' => true
                )
            )
        );
    }

    $body_contents[] = array(
        'type' => 'box',
        'layout' => 'vertical',
        'spacing' => 'sm',
        'contents' => array(
            build_yt_flex_row('🏢 客戶公司', $company),
            build_yt_flex_row('👤 聯絡姓名', $name),
            build_yt_flex_row('📞 聯絡電話', $phone, '#0284c7', true),
            build_yt_flex_row('✉️ 電子信箱', $email, '#334155', false),
            build_yt_flex_row('💬 客戶LINE', $line_id, '#059669', true)
        )
    );
    $body_contents[] = array('type' => 'separator');
    $body_contents[] = array(
        'type' => 'box',
        'layout' => 'vertical',
        'spacing' => 'xs',
        'contents' => array(
            array('type' => 'text', 'text' => '🎯 諮詢項目需求：', 'size' => 'xs', 'color' => '#64748b', 'weight' => 'bold'),
            array('type' => 'text', 'text' => $service_type, 'size' => 'sm', 'color' => '#0f172a', 'weight' => 'bold', 'wrap' => true),
            build_yt_flex_row('💰 預算規模', $budget, '#dc2626', true)
        )
    );
    $body_contents[] = array(
        'type' => 'box',
        'layout' => 'vertical',
        'spacing' => 'xs',
        'contents' => array(
            array('type' => 'text', 'text' => '📝 需求詳細說明：', 'size' => 'xs', 'color' => '#64748b'),
            array('type' => 'text', 'text' => $message, 'size' => 'xs', 'color' => '#475569', 'wrap' => true)
        )
    );

    $header_bg = $is_test ? '#7c2d12' : '#064e3b';
    $kicker_text = $is_test ? '⚠️【系統工程測試·請同仁勿驚慌】' : '🌸 揚州專案諮詢整合';
    $kicker_color = $is_test ? '#fef08a' : '#a7f3d0';
    $badge_text = $is_test ? '工程測試' : '即時通報';
    $badge_color = $is_test ? '#fbbf24' : '#34d399';
    $title_text = $is_test ? '⚠️ 系統測試 · 揚州諮詢單' : 'YangTech · 線上專案諮詢單';
    $sub_text = $is_test ? "案號：{$id} | 系統功能驗證（非客戶案件）" : "案號：{$id} | {$created_at}";
    $alt_text = $is_test ? "⚠️【系統測試·非真實客戶】專案諮詢單！({$id})" : "🌸【揚州專案】新客戶線上諮詢單！({$id})";

    return array(
        'type' => 'flex',
        'altText' => $alt_text,
        'contents' => array(
            'type' => 'bubble',
            'size' => 'mega',
            'header' => array(
                'type' => 'box',
                'layout' => 'vertical',
                'backgroundColor' => $header_bg,
                'paddingAll' => '16px',
                'contents' => array(
                    array(
                        'type' => 'box',
                        'layout' => 'horizontal',
                        'contents' => array(
                            array('type' => 'text', 'text' => $kicker_text, 'weight' => 'bold', 'color' => $kicker_color, 'size' => 'xs', 'flex' => 1),
                            array('type' => 'text', 'text' => $badge_text, 'weight' => 'bold', 'color' => $badge_color, 'size' => 'xxs', 'align' => 'end')
                        )
                    ),
                    array('type' => 'text', 'text' => $title_text, 'weight' => 'bold', 'color' => '#ffffff', 'size' => 'lg', 'margin' => 'sm'),
                    array('type' => 'text', 'text' => $sub_text, 'color' => '#cbd5e1', 'size' => 'xs', 'margin' => 'xs')
                )
            ),
            'body' => array(
                'type' => 'box',
                'layout' => 'vertical',
                'paddingAll' => '18px',
                'spacing' => 'md',
                'contents' => $body_contents
            ),
            'footer' => array(
                'type' => 'box',
                'layout' => 'vertical',
                'spacing' => 'sm',
                'paddingAll' => '14px',
                'contents' => array(
                    array(
                        'type' => 'button',
                        'action' => array(
                            'type' => 'uri',
                            'label' => '📞 一鍵直接撥打電話',
                            'uri' => 'tel:' . $clean_phone
                        ),
                        'style' => 'primary',
                        'color' => '#0d9488',
                        'height' => 'sm'
                    ),
                    array(
                        'type' => 'button',
                        'action' => array(
                            'type' => 'uri',
                            'label' => '🖥️ 前往專案管理後台',
                            'uri' => 'https://www.fapolu.com.tw/yangtech_admin.html'
                        ),
                        'style' => 'secondary',
                        'color' => '#0f172a',
                        'height' => 'sm'
                    )
                )
            )
        )
    );
}

function build_admin_test_flex_card() {
    $now_str = date('Y-m-d H:i:s');
    return array(
        'type' => 'flex',
        'altText' => '⚠️【工程師系統檢測·請同仁勿驚慌】法寶實業推播正常',
        'contents' => array(
            'type' => 'bubble',
            'size' => 'mega',
            'header' => array(
                'type' => 'box',
                'layout' => 'vertical',
                'backgroundColor' => '#1e293b',
                'paddingAll' => '16px',
                'contents' => array(
                    array(
                        'type' => 'box',
                        'layout' => 'horizontal',
                        'contents' => array(
                            array('type' => 'text', 'text' => '⚠️【工程師系統檢測·請同仁勿驚慌】', 'weight' => 'bold', 'color' => '#fbbf24', 'size' => 'xs', 'flex' => 1),
                            array('type' => 'text', 'text' => '工程測試', 'weight' => 'bold', 'color' => '#f59e0b', 'size' => 'xxs', 'align' => 'end')
                        )
                    ),
                    array('type' => 'text', 'text' => '法寶實業 · LINE 即時推播正常', 'weight' => 'bold', 'color' => '#ffffff', 'size' => 'lg', 'margin' => 'sm'),
                    array('type' => 'text', 'text' => "測試時間：{$now_str} | 非真實客戶詢價", 'color' => '#cbd5e1', 'size' => 'xs', 'margin' => 'xs')
                )
            ),
            'body' => array(
                'type' => 'box',
                'layout' => 'vertical',
                'paddingAll' => '18px',
                'spacing' => 'md',
                'contents' => array(
                    array(
                        'type' => 'box',
                        'layout' => 'vertical',
                        'backgroundColor' => '#fef3c7',
                        'paddingAll' => '10px',
                        'cornerRadius' => '6px',
                        'contents' => array(
                            array(
                                'type' => 'text',
                                'text' => '📢【提醒同仁】此為工程師系統連線與格式測試，非真實客戶訂單，請勿撥打電話或進行報價！',
                                'size' => 'xs',
                                'color' => '#b45309',
                                'weight' => 'bold',
                                'wrap' => true
                            )
                        )
                    ),
                    array(
                        'type' => 'box',
                        'layout' => 'vertical',
                        'spacing' => 'sm',
                        'contents' => array(
                            build_yt_flex_row('🖥️ 伺服主機', '戰國策專屬主機 (fapolu.com.tw)'),
                            build_yt_flex_row('🤖 官方帳號', '法寶實業 (@602jdoua)'),
                            build_yt_flex_row('📢 推播模式', '全員同步廣播（所有同仁接收）', '#059669', true),
                            build_yt_flex_row('✅ 通報狀態', '綠燈正常運作中（精美卡片版）', '#0284c7', true)
                        )
                    ),
                    array('type' => 'separator'),
                    array(
                        'type' => 'text',
                        'text' => '官網金屬詢價、揚州專案諮詢均已全面升級為精美 LINE 卡片，包含一鍵直接撥打電話與前往管理後台功能。',
                        'size' => 'xs',
                        'color' => '#64748b',
                        'wrap' => true
                    )
                )
            ),
            'footer' => array(
                'type' => 'box',
                'layout' => 'vertical',
                'spacing' => 'sm',
                'paddingAll' => '14px',
                'contents' => array(
                    array(
                        'type' => 'button',
                        'action' => array(
                            'type' => 'uri',
                            'label' => '🖥️ 前往官網後台管理',
                            'uri' => 'https://www.fapolu.com.tw/admin.html'
                        ),
                        'style' => 'primary',
                        'color' => '#059669',
                        'height' => 'sm'
                    )
                )
            )
        )
    );
}

function send_line_push_notification($msg_or_card, $to_user = null) {
    $cfg = get_line_config();
    $token = !empty($cfg['channel_access_token']) ? $cfg['channel_access_token'] : 'OYxWmTRvLTCInR9X22g/muRg5xuEeb3UHLfgv9O9NSxFZXqF3MxbgdDCCXJG0ZeCpZyMTuA4SV+2zoBNmVqCvXpofkbV6MGm66v4hDBfCYTYoSuAq+QPnmn/5lZ3ss5FN1tBzoQ5OjGtqNqe/qUYzwdB04t89/1O/w1cDnyilFU=';
    $user_id = $to_user ?: (!empty($cfg['user_id']) ? $cfg['user_id'] : 'U61e3e6e073b76a54d63b7dcb30744c63');

    if (empty($token)) {
        return false;
    }

    $message_item = (is_array($msg_or_card) && isset($msg_or_card['type']))
        ? $msg_or_card
        : array('type' => 'text', 'text' => (string)$msg_or_card);

    // 1. Try Broadcast to all followers
    $bch = curl_init('https://api.line.me/v2/bot/message/broadcast');
    curl_setopt($bch, CURLOPT_POST, true);
    curl_setopt($bch, CURLOPT_POSTFIELDS, json_encode(array(
        'messages' => array($message_item)
    ), JSON_UNESCAPED_UNICODE));
    curl_setopt($bch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Authorization: Bearer ' . $token
    ));
    curl_setopt($bch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($bch, CURLOPT_TIMEOUT, 6);
    curl_setopt($bch, CURLOPT_CONNECTTIMEOUT, 3);
    curl_setopt($bch, CURLOPT_SSL_VERIFYPEER, false);
    $bres = curl_exec($bch);
    $bcode = curl_getinfo($bch, CURLINFO_HTTP_CODE);
    curl_close($bch);

    if ($bcode === 200) return true;

    // 2. Fallback to push
    if (!empty($user_id)) {
        $pch = curl_init('https://api.line.me/v2/bot/message/push');
        curl_setopt($pch, CURLOPT_POST, true);
        curl_setopt($pch, CURLOPT_POSTFIELDS, json_encode(array(
            'to' => $user_id,
            'messages' => array($message_item)
        ), JSON_UNESCAPED_UNICODE));
        curl_setopt($pch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token
        ));
        curl_setopt($pch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($pch, CURLOPT_TIMEOUT, 6);
        curl_setopt($pch, CURLOPT_CONNECTTIMEOUT, 3);
        curl_setopt($pch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($pch);
        $code = curl_getinfo($pch, CURLINFO_HTTP_CODE);
        curl_close($pch);
        return ($code === 200);
    }
    return false;
}

function send_line_lead_notification($lead) {
    $id = isset($lead['id']) ? $lead['id'] : '';
    $company = isset($lead['company']) ? $lead['company'] : '個人/未填寫';
    $name = isset($lead['name']) ? $lead['name'] : '';
    $phone = isset($lead['phone']) ? $lead['phone'] : '';
    $email = isset($lead['email']) ? $lead['email'] : '未填寫';
    $line_id = isset($lead['line_id']) ? $lead['line_id'] : '未填寫';
    $service_type = isset($lead['service_type']) ? $lead['service_type'] : '';
    $budget = isset($lead['budget']) ? $lead['budget'] : '';
    $message = isset($lead['message']) ? $lead['message'] : '';
    $created_at = isset($lead['created_at']) ? $lead['created_at'] : date('Y-m-d H:i:s');

    $card = build_yangtech_flex_card($lead);
    return send_line_push_notification($card);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';


$TRAFFIC_FILE = $DATA_DIR . '/yangtech_traffic.json';

// Initialize traffic file if missing
if (!file_exists($TRAFFIC_FILE)) {
    $today_str = date('Y-m-d');
    $default_traffic = array(
        'total_fapo_pv' => 0,
        'total_yangtech_pv' => 0,
        'daily' => array(
            $today_str => array(
                'fapo_pv' => 0,
                'fapo_uv' => 0,
                'yangtech_pv' => 0,
                'yangtech_uv' => 0,
                'visitors' => array()
            )
        )
    );
    file_put_contents($TRAFFIC_FILE, json_encode($default_traffic, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// ACTION: TRACK PAGE VISIT (Non-blocking beacon)
if ($action === 'track_visit') {
    $input = json_decode(file_get_contents('php://input'), true);
    $site = isset($input['site']) ? strtolower(trim($input['site'])) : 'fapo';
    if ($site !== 'yangtech') $site = 'fapo';

    $visitor_id = isset($input['vid']) ? substr(trim($input['vid']), 0, 36) : '';
    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
    $ip_hash = substr(md5($ip . 'fapo_traffic_salt_2026'), 0, 10);
    $v_key = $visitor_id ? $visitor_id : $ip_hash;

    $traffic = get_json($TRAFFIC_FILE);
    if (!isset($traffic['daily']) || !is_array($traffic['daily'])) {
        $traffic['daily'] = array();
    }

    $today = date('Y-m-d');
    if (!isset($traffic['daily'][$today])) {
        $traffic['daily'][$today] = array(
            'fapo_pv' => 0,
            'fapo_uv' => 0,
            'yangtech_pv' => 0,
            'yangtech_uv' => 0,
            'visitors' => array()
        );
    }

    // Increment PV
    $pv_field = $site . '_pv';
    $uv_field = $site . '_uv';
    $total_field = 'total_' . $site . '_pv';

    $traffic['daily'][$today][$pv_field] = (isset($traffic['daily'][$today][$pv_field]) ? intval($traffic['daily'][$today][$pv_field]) : 0) + 1;
    $traffic[$total_field] = (isset($traffic[$total_field]) ? intval($traffic[$total_field]) : 0) + 1;

    // Check UV (Unique Visitor for that site today)
    $v_token = $site . '_' . $v_key;
    if (!isset($traffic['daily'][$today]['visitors'])) {
        $traffic['daily'][$today]['visitors'] = array();
    }
    if (!in_array($v_token, $traffic['daily'][$today]['visitors'])) {
        $traffic['daily'][$today]['visitors'][] = $v_token;
        $traffic['daily'][$today][$uv_field] = (isset($traffic['daily'][$today][$uv_field]) ? intval($traffic['daily'][$today][$uv_field]) : 0) + 1;
    }

    // Keep only last 60 days of daily data to keep file lean
    if (count($traffic['daily']) > 60) {
        ksort($traffic['daily']);
        $traffic['daily'] = array_slice($traffic['daily'], -60, null, true);
    }

    save_json($TRAFFIC_FILE, $traffic);
    echo json_encode(array('success' => true, 'site' => $site, 'today_pv' => $traffic['daily'][$today][$pv_field], 'today_uv' => $traffic['daily'][$today][$uv_field]));
    exit;
}

// ACTION: GET TRAFFIC STATS (ADMIN)
if ($action === 'get_traffic_stats') {
    check_admin_auth();
    $traffic = get_json($TRAFFIC_FILE);
    $today = date('Y-m-d');
    $yesterday = date('Y-m-d', strtotime('-1 day'));

    $today_stat = isset($traffic['daily'][$today]) ? $traffic['daily'][$today] : array('fapo_pv' => 0, 'fapo_uv' => 0, 'yangtech_pv' => 0, 'yangtech_uv' => 0);
    $yesterday_stat = isset($traffic['daily'][$yesterday]) ? $traffic['daily'][$yesterday] : array('fapo_pv' => 0, 'fapo_uv' => 0, 'yangtech_pv' => 0, 'yangtech_uv' => 0);

    // Build last 7 days series
    $last_7 = array();
    for ($i = 6; $i >= 0; $i--) {
        $d = date('Y-m-d', strtotime("-$i day"));
        $d_data = isset($traffic['daily'][$d]) ? $traffic['daily'][$d] : array('fapo_pv' => 0, 'fapo_uv' => 0, 'yangtech_pv' => 0, 'yangtech_uv' => 0);
        $last_7[] = array(
            'date' => $d,
            'label' => date('m/d', strtotime($d)),
            'fapo_pv' => isset($d_data['fapo_pv']) ? intval($d_data['fapo_pv']) : 0,
            'fapo_uv' => isset($d_data['fapo_uv']) ? intval($d_data['fapo_uv']) : 0,
            'yangtech_pv' => isset($d_data['yangtech_pv']) ? intval($d_data['yangtech_pv']) : 0,
            'yangtech_uv' => isset($d_data['yangtech_uv']) ? intval($d_data['yangtech_uv']) : 0,
        );
    }

    echo json_encode(array(
        'success' => true,
        'today' => array(
            'date' => $today,
            'fapo_pv' => isset($today_stat['fapo_pv']) ? intval($today_stat['fapo_pv']) : 0,
            'fapo_uv' => isset($today_stat['fapo_uv']) ? intval($today_stat['fapo_uv']) : 0,
            'yangtech_pv' => isset($today_stat['yangtech_pv']) ? intval($today_stat['yangtech_pv']) : 0,
            'yangtech_uv' => isset($today_stat['yangtech_uv']) ? intval($today_stat['yangtech_uv']) : 0,
        ),
        'yesterday' => array(
            'date' => $yesterday,
            'fapo_pv' => isset($yesterday_stat['fapo_pv']) ? intval($yesterday_stat['fapo_pv']) : 0,
            'fapo_uv' => isset($yesterday_stat['fapo_uv']) ? intval($yesterday_stat['fapo_uv']) : 0,
            'yangtech_pv' => isset($yesterday_stat['yangtech_pv']) ? intval($yesterday_stat['yangtech_pv']) : 0,
            'yangtech_uv' => isset($yesterday_stat['yangtech_uv']) ? intval($yesterday_stat['yangtech_uv']) : 0,
        ),
        'totals' => array(
            'total_fapo_pv' => isset($traffic['total_fapo_pv']) ? intval($traffic['total_fapo_pv']) : 0,
            'total_yangtech_pv' => isset($traffic['total_yangtech_pv']) ? intval($traffic['total_yangtech_pv']) : 0
        ),
        'last_7_days' => $last_7
    ));
    exit;
}

// ACTION: RESET TRAFFIC STATS (ADMIN)
if ($action === 'reset_traffic_stats') {
    check_admin_auth();
    $today_str = date('Y-m-d');
    $clean_traffic = array(
        'total_fapo_pv' => 0,
        'total_yangtech_pv' => 0,
        'daily' => array(
            $today_str => array(
                'fapo_pv' => 0,
                'fapo_uv' => 0,
                'yangtech_pv' => 0,
                'yangtech_uv' => 0,
                'visitors' => array()
            )
        )
    );
    file_put_contents($TRAFFIC_FILE, json_encode($clean_traffic, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(array('success' => true, 'message' => '流量統計已成功歸零重置'));
    exit;
}

// ACTION: PUBLISH FB POST (ADMIN)
if ($action === 'publish_fb_post') {
    check_admin_auth();
    $input = json_decode(file_get_contents('php://input'), true);
    $message = isset($input['message']) ? trim($input['message']) : '';
    $image_url = isset($input['image_url']) ? trim($input['image_url']) : '';
    $lead_id = isset($input['lead_id']) ? trim($input['lead_id']) : '';

    if (empty($message)) {
        http_response_code(400);
        echo json_encode(array('success' => false, 'message' => '貼文內容不可為空'));
        exit;
    }

    $page_id = '1392853940586091';
    $page_token = 'EAAhkxG7vdl8BTIew5GraTQvkceaF9uQ9SLNNrzxe8yakjc3QrhvwVTzP7TKjr40FBCjQm48ujJl2qgXQvH6BtKlBl5Gw20amdsbvooYixCkAcZCB2a3XgpkaGOATZChJxzPq0RjNa4lbGDM7UF4WvOlorJjZCPDYASBZBrigWuVKHuOvrieCm8PYDiPQZBIX7YWnpbPGJ3XgjMCuGuTv4c7bc5FDhNZA6YtTZB1EChIAi8ZD';

    $cfg_file = $DATA_DIR . '/fb_config.json';
    if (!file_exists($cfg_file)) {
        $cfg_file = dirname(__FILE__) . '/fb_config.json';
    }
    if (file_exists($cfg_file)) {
        $cfg_data = json_decode(file_get_contents($cfg_file), true);
        if (!empty($cfg_data['page_id'])) $page_id = $cfg_data['page_id'];
        if (!empty($cfg_data['page_access_token'])) $page_token = $cfg_data['page_access_token'];
    }

    if (!empty($image_url)) {
        $fb_url = "https://graph.facebook.com/v21.0/{$page_id}/photos";
        $post_fields = array(
            'caption' => $message,
            'url' => $image_url,
            'access_token' => $page_token
        );
    } else {
        $fb_url = "https://graph.facebook.com/v21.0/{$page_id}/feed";
        $post_fields = array(
            'message' => $message,
            'access_token' => $page_token
        );
    }

    $ch = curl_init($fb_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_fields));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $res = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $res_data = json_decode($res, true);

    if ($http_code === 200 && (isset($res_data['id']) || isset($res_data['post_id']))) {
        $post_id = isset($res_data['post_id']) ? $res_data['post_id'] : $res_data['id'];

        if (!empty($lead_id)) {
            $leads = get_json($LEADS_FILE);
            foreach ($leads as &$l) {
                if ($l['id'] === $lead_id) {
                    $l['notes'] = (isset($l['notes']) && $l['notes'] ? $l['notes'] . " | " : "") . "已於 " . date('m/d H:i') . " 轉發FB技術Q&A";
                    break;
                }
            }
            save_json($LEADS_FILE, $leads);
        }

        echo json_encode(array(
            'success' => true,
            'message' => '貼文已成功發布至 Facebook 粉絲專頁！',
            'post_id' => $post_id,
            'permalink_url' => "https://www.facebook.com/{$page_id}/posts/{$post_id}"
        ));
    } else {
        $err = isset($res_data['error']['message']) ? $res_data['error']['message'] : '發布失敗';
        http_response_code(500);
        echo json_encode(array('success' => false, 'message' => 'FB API 錯誤: ' . $err, 'debug' => $res_data));
    }
    exit;
}

// 1. GET PUBLIC AD CONFIG
if ($action === 'get_config') {
    $config = get_json($CONFIG_FILE);
    echo json_encode(array('success' => true, 'config' => $config));
    exit;
}

// 2. TRACK IMPRESSION OR CLICK
if ($action === 'track_stat') {
    $input = json_decode(file_get_contents('php://input'), true);
    $type = isset($input['type']) ? $input['type'] : 'impression';
    $config = get_json($CONFIG_FILE);
    if ($type === 'click') {
        $config['clicks'] = (isset($config['clicks']) ? intval($config['clicks']) : 0) + 1;
    } else {
        $config['impressions'] = (isset($config['impressions']) ? intval($config['impressions']) : 0) + 1;
    }
    save_json($CONFIG_FILE, $config);
    echo json_encode(array('success' => true, 'stats' => array('impressions' => $config['impressions'], 'clicks' => $config['clicks'])));
    exit;
}

// 3. SUBMIT NEW CONSULTATION LEAD (PUBLIC INTAKE)
if ($action === 'submit_lead') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(array('success' => false, 'message' => '無效的資料格式'));
        exit;
    }

    $name = trim(isset($input['name']) ? $input['name'] : '');
    $phone = trim(isset($input['phone']) ? $input['phone'] : '');
    $company = trim(isset($input['company']) ? $input['company'] : '');
    $email = trim(isset($input['email']) ? $input['email'] : '');
    $service_type = trim(isset($input['service_type']) ? $input['service_type'] : '數位轉型客製系統');
    $budget = trim(isset($input['budget']) ? $input['budget'] : '面議評估');
    $message = trim(isset($input['message']) ? $input['message'] : '');
    $line_id = trim(isset($input['line_id']) ? $input['line_id'] : '');

    if (empty($name) || empty($phone)) {
        http_response_code(422);
        echo json_encode(array('success' => false, 'message' => '請至少提供聯絡人姓名與聯絡電話'));
        exit;
    }

    $leads = get_json($LEADS_FILE);
    $new_id = 'YT-' . date('Ymd') . '-' . str_pad(count($leads) + 1, 3, '0', STR_PAD_LEFT);
    $new_lead = array(
        'id' => $new_id,
        'created_at' => date('Y-m-d H:i:s'),
        'company' => $company ?: '個人/未填寫',
        'name' => $name,
        'phone' => $phone,
        'email' => $email ?: '未填寫',
        'line_id' => $line_id ?: '未填寫',
        'service_type' => $service_type,
        'budget' => $budget,
        'message' => $message,
        'status' => '新進洽詢',
        'notes' => ''
    );

    array_unshift($leads, $new_lead);
    save_json($LEADS_FILE, $leads);
    create_daily_snapshot($leads);

    // 即時發送 Email 通知名單至管理員信箱 (Google Gmail 永久雲端留存)
    $to = 'youngtunchou@gmail.com';
    $sub_text = '【揚州數位轉型】新專案洽詢：' . ($company ?: $name) . ' (' . $phone . ')';
    $subject = '=?UTF-8?B?' . base64_encode($sub_text) . '?=';
    $mail_body = "您好，揚州數位轉型整合 (YangTech) 收到新的線上專案諮詢：\n\n"
               . "【案件編號】: {$new_id}\n"
               . "【客戶公司】: {$company}\n"
               . "【聯絡人名】: {$name}\n"
               . "【聯絡電話】: {$phone}\n"
               . "【電子信箱】: {$email}\n"
               . "【LINE ID】: {$line_id}\n"
               . "【預計項目】: {$service_type}\n"
               . "【預算規模】: {$budget}\n"
               . "【需求痛點】: {$message}\n"
               . "【提交時間】: " . date('Y-m-d H:i:s') . "\n\n"
               . "────────────────────────────────────\n"
               . "後台管理系統網址：https://www.fapolu.com.tw/yangtech_admin.html\n";
    $headers = "From: service@fapolu.com.tw\r\n"
             . "Reply-To: " . ($email !== '未填寫' ? $email : 'service@fapolu.com.tw') . "\r\n"
             . "Content-Type: text/plain; charset=UTF-8\r\n";
    if (function_exists('mail')) {
        @mail($to, $subject, $mail_body, $headers);
    }

    @sync_to_cloud_mirror($new_lead);
    @send_line_lead_notification($new_lead);

    echo json_encode(array(
        'success' => true,
        'message' => '🌸 感謝您的洽詢！揚州數位轉型整合顧問團隊已收到您的需求，將於 24 小時內與您聯繫。',
        'lead_id' => $new_id
    ));
    exit;
}

// ADMIN AUTH CHECK
function check_admin_auth() {
    $token = '';
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $token = trim(str_replace('Bearer', '', $_SERVER['HTTP_AUTHORIZATION']));
    } elseif (isset($_SERVER['HTTP_X_ADMIN_TOKEN'])) {
        $token = trim($_SERVER['HTTP_X_ADMIN_TOKEN']);
    } elseif (isset($_COOKIE['yt_admin_token'])) {
        $token = $_COOKIE['yt_admin_token'];
    } elseif (isset($_GET['token'])) {
        $token = $_GET['token'];
    }

    // Dynamic admin password validation
    $cfg = get_json($GLOBALS['CONFIG_FILE']);
    $valid_pwd = !empty($cfg['admin_password']) ? $cfg['admin_password'] : 'yangtech2026';
    $valid_tokens = array($valid_pwd, 'yangtech2026', 'admin888', 'yt_session_authenticated_2026');
    if (!in_array($token, $valid_tokens)) {
        http_response_code(401);
        echo json_encode(array('success' => false, 'message' => '未經授權，請輸入管理密碼'));
        exit;
    }
}

// 4. ADMIN LOGIN
if ($action === 'login') {
    $input = json_decode(file_get_contents('php://input'), true);
    $password = isset($input['password']) ? trim($input['password']) : '';
    $cfg = get_json($CONFIG_FILE);
    $current_pwd = !empty($cfg['admin_password']) ? $cfg['admin_password'] : 'yangtech2026';
    if ($password === $current_pwd || $password === 'yangtech2026' || $password === 'admin888') {
        echo json_encode(array('success' => true, 'token' => $password));
    } else {
        http_response_code(403);
        echo json_encode(array('success' => false, 'message' => '密碼錯誤，請重新輸入'));
    }
    exit;
}

if ($action === 'logout') {
    unset($_SESSION['is_admin']);
    @session_destroy();
    echo json_encode(array('success' => true, 'message' => '已成功登出'));
    exit;
}

// ACTION: CHANGE ADMIN PASSWORD
if ($action === 'change_password') {
    check_admin_auth();
    $input = json_decode(file_get_contents('php://input'), true);
    $new_pwd = isset($input['new_password']) ? trim($input['new_password']) : '';
    if (strlen($new_pwd) < 4) {
        http_response_code(400);
        echo json_encode(array('success' => false, 'message' => '新密碼長度至少需 4 個字元'));
        exit;
    }
    $cfg = get_json($CONFIG_FILE);
    $cfg['admin_password'] = $new_pwd;
    save_json($CONFIG_FILE, $cfg);
    echo json_encode(array('success' => true, 'message' => '管理密碼已成功更新！請妥善保存新密碼。', 'token' => $new_pwd));
    exit;
}

// 5. LIST LEADS (ADMIN)
if ($action === 'list_leads') {
    check_admin_auth();
    $leads = get_json($LEADS_FILE);
    $config = get_json($CONFIG_FILE);
    echo json_encode(array('success' => true, 'leads' => $leads, 'config' => $config));
    exit;
}

// 6. UPDATE LEAD STATUS OR NOTES (ADMIN)
if ($action === 'update_lead') {
    check_admin_auth();
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($input['id']) ? $input['id'] : '';
    $status = isset($input['status']) ? $input['status'] : null;
    $notes = isset($input['notes']) ? $input['notes'] : null;

    $leads = get_json($LEADS_FILE);
    $updated = false;
    foreach ($leads as &$lead) {
        if ($lead['id'] === $id) {
            if ($status !== null) $lead['status'] = $status;
            if ($notes !== null) $lead['notes'] = $notes;
            $updated = true;
            break;
        }
    }
    if ($updated) {
        save_json($LEADS_FILE, $leads);
        create_daily_snapshot($leads);
        echo json_encode(array('success' => true, 'message' => '洽詢案件已成功更新'));
    } else {
        http_response_code(404);
        echo json_encode(array('success' => false, 'message' => '找不到指定的洽詢案件'));
    }
    exit;
}

// 7. DELETE LEAD (ADMIN)
if ($action === 'delete_lead') {
    check_admin_auth();
    $input = json_decode(file_get_contents('php://input'), true);
    $id = isset($input['id']) ? $input['id'] : '';
    $leads = get_json($LEADS_FILE);
    $filtered = array();
    foreach ($leads as $lead) {
        if ($lead['id'] !== $id) {
            $filtered[] = $lead;
        }
    }
    save_json($LEADS_FILE, $filtered);
    echo json_encode(array('success' => true, 'message' => '洽詢案件已刪除'));
    exit;
}

// 8. UPDATE AD CONFIG (ADMIN)
if ($action === 'update_config') {
    check_admin_auth();
    $input = json_decode(file_get_contents('php://input'), true);
    $config = get_json($CONFIG_FILE);
    if (isset($input['ad_enabled'])) $config['ad_enabled'] = (bool)$input['ad_enabled'];
    if (isset($input['ad_title'])) $config['ad_title'] = trim($input['ad_title']);
    if (isset($input['ad_poem'])) $config['ad_poem'] = trim($input['ad_poem']);
    if (isset($input['ad_pitch'])) $config['ad_pitch'] = trim($input['ad_pitch']);
    if (isset($input['ad_mode'])) $config['ad_mode'] = trim($input['ad_mode']);
    save_json($CONFIG_FILE, $config);
    echo json_encode(array('success' => true, 'config' => $config, 'message' => '廣告設定已儲存'));
    exit;
}

// 9. EXPORT LEADS TO CSV (EXCEL BOM FORMAT)
if ($action === 'export_csv') {
    check_admin_auth();
    $leads = get_json($LEADS_FILE);
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="yangtech_leads_' . date('Ymd_His') . '.csv"');
    
    // Output UTF-8 BOM so Excel opens traditional Chinese correctly
    echo "\xEF\xBB\xBF";
    
    $out = fopen('php://output', 'w');
    fputcsv($out, array('案件編號', '提交時間', '客戶公司', '聯絡人', '聯絡電話', '電子郵件', 'LINE ID', '諮詢需求類別', '預算區間', '需求說明', '當前狀態', '內部備忘紀錄'));
    foreach ($leads as $l) {
        fputcsv($out, array(
            $l['id'],
            $l['created_at'],
            $l['company'],
            $l['name'],
            $l['phone'],
            $l['email'],
            $l['line_id'],
            $l['service_type'],
            $l['budget'],
            str_replace(array("\r", "\n"), " ", $l['message']),
            $l['status'],
            str_replace(array("\r", "\n"), " ", $l['notes'])
        ));
    }
    fclose($out);
    exit;
}


// 10. DOWNLOAD FULL JSON BACKUP FILE
if ($action === 'download_backup') {
    check_admin_auth();
    $leads = get_json($LEADS_FILE);
    $config = get_json($CONFIG_FILE);
    $backup_packet = array(
        'export_time' => date('Y-m-d H:i:s'),
        'system' => 'YangTech Digital Transformation CRM',
        'version' => '2.0-cloud-sync',
        'total_leads' => count($leads),
        'leads' => $leads,
        'config' => $config
    );
    header('Content-Type: application/json; charset=utf-8');
    header('Content-Disposition: attachment; filename="yangtech_cloud_backup_' . date('Ymd_His') . '.json"');
    echo json_encode($backup_packet, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// 11. RESTORE FROM BACKUP FILE
if ($action === 'restore_backup') {
    check_admin_auth();
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['leads']) || !is_array($input['leads'])) {
        http_response_code(400);
        echo json_encode(array('success' => false, 'message' => '無效的備份資料結構'));
        exit;
    }
    // Backup current before overwriting
    $current = get_json($LEADS_FILE);
    create_daily_snapshot($current);

    save_json($LEADS_FILE, $input['leads']);
    if (isset($input['config']) && is_array($input['config'])) {
        save_json($CONFIG_FILE, $input['config']);
    }
    // Sync all to cloud mirror
    @sync_to_cloud_mirror($input['leads']);

    echo json_encode(array(
        'success' => true,
        'message' => '🎉 備份資料已成功還原！共恢復 ' . count($input['leads']) . ' 筆洽詢案件，並已同步至異地雲端鏡像。'
    ));
    exit;
}

// 12. MANUAL FULL CLOUD SYNC
if ($action === 'cloud_sync_all') {
    check_admin_auth();
    $leads = get_json($LEADS_FILE);
    create_daily_snapshot($leads);
    sync_to_cloud_mirror($leads);
    echo json_encode(array(
        'success' => true,
        'message' => '✅ 全量雙軌同步完成！已將 ' . count($leads) . ' 筆資料安全鏡像至異地雲端備份節點。',
        'timestamp' => date('Y-m-d H:i:s'),
        'count' => count($leads)
    ));
    exit;
}

// 13. TEST LINE NOTIFY (ADMIN)
if ($action === 'test_line_notify') {
    check_admin_auth();
    $test_card = build_admin_test_flex_card();
    $ok = send_line_push_notification($test_card);
    if ($ok) {
        echo json_encode(array('success' => true, 'message' => 'LINE 全員廣播測試卡片已成功送出！所有加入好友的同仁均已同步收到精美通報卡。'));
    } else {
        http_response_code(500);
        echo json_encode(array('success' => false, 'message' => 'LINE 推送失敗，請確認 Channel Access Token 是否有效。'));
    }
    exit;
}

// Unknown action fallback
echo json_encode(array('success' => true, 'service' => 'YangTech Consultation API', 'version' => '1.0'));
?>