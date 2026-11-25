<?php
// PHP Proxy for /api/ requests to Render & Direct LINE Instant Notification
@set_time_limit(90);
@ini_set('max_execution_time', '90');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$api_path = isset($_GET['route']) ? $_GET['route'] : '';

// Preserve original query parameters
$query_params = $_GET;
unset($query_params['route']);
$query_string = http_build_query($query_params);

$target_url = 'https://fapolu-io9w.onrender.com/api/' . ltrim($api_path, '/');
if (!empty($query_string)) {
    $target_url .= '?' . $query_string;
}

$is_post = ($_SERVER['REQUEST_METHOD'] === 'POST');

// Handle both JSON raw body and FormData ($_POST / multipart)
$contact_data = array();
$raw_input = file_get_contents('php://input');

if (!empty($_POST)) {
    $contact_data = $_POST;
} elseif (!empty($raw_input)) {
    $decoded = json_decode($raw_input, true);
    if (is_array($decoded)) {
        $contact_data = $decoded;
    }
}

// Convert contact_data to JSON body for Render forward
$forward_payload = !empty($contact_data) ? json_encode($contact_data, JSON_UNESCAPED_UNICODE) : $raw_input;

$ticket_id = '';
$c_drawing = '';

// ============================================================
// 1. DUAL NOTIFICATION: LINE INSTANT PUSH FOR METAL INQUIRIES
// ============================================================
if ($is_post && (strpos($api_path, 'contact') !== false || $api_path === 'contact')) {
    if (!empty($contact_data)) {
        $c_company = !empty($contact_data['companyName']) ? trim($contact_data['companyName']) : '未填寫/個人';
        $c_person = !empty($contact_data['contactPerson']) ? trim($contact_data['contactPerson']) : '未填寫';
        $c_phone = !empty($contact_data['contactPhone']) ? trim($contact_data['contactPhone']) : '未填寫';
        $c_email = !empty($contact_data['contactEmail']) ? trim($contact_data['contactEmail']) : '未填寫';
        $c_mat = !empty($contact_data['inquiryMaterial']) ? trim($contact_data['inquiryMaterial']) : '未指定';
        $c_county = !empty($contact_data['deliveryCounty']) ? trim($contact_data['deliveryCounty']) : '未指定';
        $c_msg = !empty($contact_data['inquiryMessage']) ? trim($contact_data['inquiryMessage']) : '無補充需求';
        $c_drawing = !empty($contact_data['drawingUrl']) ? trim($contact_data['drawingUrl']) : '';
        
        if (isset($_FILES['drawing_file']) && !empty($_FILES['drawing_file']['name'])) {
            $c_drawing = ($c_drawing ? $c_drawing . ' | ' : '') . '附件圖檔: ' . $_FILES['drawing_file']['name'];
        }
        $c_time = date('Y-m-d H:i:s');

        // PUSH LINE NOTIFICATION IMMEDIATELY
        $cfg_file = __DIR__ . '/line_config.json';
        if (!file_exists($cfg_file)) $cfg_file = __DIR__ . '/data/line_config.json';
        if (file_exists($cfg_file)) {
            $cfg = json_decode(file_get_contents($cfg_file), true);
            $token = !empty($cfg['channel_access_token']) ? $cfg['channel_access_token'] : 'OYxWmTRvLTCInR9X22g/muRg5xuEeb3UHLfgv9O9NSxFZXqF3MxbgdDCCXJG0ZeCpZyMTuA4SV+2zoBNmVqCvXpofkbV6MGm66v4hDBfCYTYoSuAq+QPnmn/5lZ3ss5FN1tBzoQ5OjGtqNqe/qUYzwdB04t89/1O/w1cDnyilFU=';
            $user_id = !empty($cfg['user_id']) ? $cfg['user_id'] : 'U61e3e6e073b76a54d63b7dcb30744c63';

            $line_msg = "⚡【法寶實業】官網新客戶詢價單！\n"
                      . "━━━━━━━━━━━━━━━\n"
                      . "🏢 公司名稱：{$c_company}\n"
                      . "👤 聯絡窗口：{$c_person}\n"
                      . "📞 聯絡電話：{$c_phone}\n"
                      . "✉️ 電子信箱：{$c_email}\n"
                      . "📦 詢價規格：{$c_mat}\n"
                      . "📍 送貨地區：{$c_county}\n"
                      . "💬 需求說明：{$c_msg}\n";
            if (!empty($c_drawing)) {
                $line_msg .= "📎 附加圖面：{$c_drawing}\n";
            }
            $line_msg .= "⏰ 提交時間：{$c_time}\n"
                      . "━━━━━━━━━━━━━━━\n"
                      . "🔗 管理後台：https://www.fapolu.com.tw/admin.html";

            // 全員廣播發送 (Broadcast to all followers/friends)
            $bch = curl_init('https://api.line.me/v2/bot/message/broadcast');
            curl_setopt($bch, CURLOPT_POST, true);
            curl_setopt($bch, CURLOPT_POSTFIELDS, json_encode(array(
                'messages' => array(array('type' => 'text', 'text' => $line_msg))
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

            // Fallback to push if broadcast fails
            if ($bcode !== 200 && !empty($user_id)) {
                $lch = curl_init('https://api.line.me/v2/bot/message/push');
                curl_setopt($lch, CURLOPT_POST, true);
                curl_setopt($lch, CURLOPT_POSTFIELDS, json_encode(array(
                    'to' => $user_id,
                    'messages' => array(array('type' => 'text', 'text' => $line_msg))
                ), JSON_UNESCAPED_UNICODE));
                curl_setopt($lch, CURLOPT_HTTPHEADER, array(
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $token
                ));
                curl_setopt($lch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($lch, CURLOPT_TIMEOUT, 6);
                curl_setopt($lch, CURLOPT_CONNECTTIMEOUT, 3);
                curl_setopt($lch, CURLOPT_SSL_VERIFYPEER, false);
                @curl_exec($lch);
                @curl_close($lch);
            }
        }

        // Local redundant archive on Zhan Guo Ce host
        $local_dir = __DIR__ . '/data';
        if (!file_exists($local_dir)) @mkdir($local_dir, 0755, true);
        $local_inquiries_file = $local_dir . '/metal_inquiries.json';
        $saved_inquiries = array();
        if (file_exists($local_inquiries_file)) {
            $saved_inquiries = json_decode(@file_get_contents($local_inquiries_file), true);
            if (!is_array($saved_inquiries)) $saved_inquiries = array();
        }
        $ticket_id = 'REQ-' . (1000 + count($saved_inquiries) + 1);
        $new_record = array(
            'id' => $ticket_id,
            'companyName' => $c_company,
            'contactPerson' => $c_person,
            'contactPhone' => $c_phone,
            'contactEmail' => $c_email,
            'inquiryMaterial' => $c_mat,
            'deliveryCounty' => $c_county,
            'inquiryMessage' => $c_msg,
            'drawingUrl' => $c_drawing,
            'timestamp' => $c_time,
            'status' => 'pending'
        );
        array_unshift($saved_inquiries, $new_record);
        @file_put_contents($local_inquiries_file, json_encode($saved_inquiries, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}

// Forward to Render Cloud
function call_render_api($url, $is_post, $payload, $timeout = 40) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    if ($is_post) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'User-Agent: Mozilla/5.0 (Fapo-Proxy)'
        ));
    }

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    return array('code' => $http_code, 'body' => $response, 'error' => $error);
}

$result = call_render_api($target_url, $is_post, $forward_payload, 30);

// If Render is in sleep mode or error, but we already saved locally and pushed to LINE:
if ($result['code'] === 0 || $result['code'] >= 500) {
    if (!empty($ticket_id)) {
        http_response_code(200);
        echo json_encode(array(
            'success' => true,
            'message' => '感謝您的諮詢！我們的業務工程師將於 24 小時內與您聯繫。',
            'ticket_id' => $ticket_id,
            'drawing_url' => $c_drawing
        ));
        exit;
    }
}

if ($result['body'] === false || empty($result['body'])) {
    if (!empty($ticket_id)) {
        http_response_code(200);
        echo json_encode(array(
            'success' => true,
            'message' => '感謝您的諮詢！我們的業務工程師將於 24 小時內與您聯繫。',
            'ticket_id' => $ticket_id,
            'drawing_url' => $c_drawing
        ));
        exit;
    }
    http_response_code(503);
    echo json_encode(array(
        'success' => false,
        'reply' => '⚠️ 伺服器處理中，請稍候重試。',
        'error' => $result['error']
    ));
} else {
    $body = $result['body'];
    $data = json_decode($body, true);
    if (is_array($data) && isset($data['url']) && strpos($data['url'], '/static/audio/cache/') === 0) {
        $data['url'] = 'https://fapolu-io9w.onrender.com' . $data['url'];
        $body = json_encode($data);
    }
    http_response_code($result['code']);
    echo $body;
}
