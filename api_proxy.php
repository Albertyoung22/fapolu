<?php
// PHP Proxy for /api/ requests to Render
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

// Preserve original query parameters (like text=...&voice=... for GET requests)
$query_params = $_GET;
unset($query_params['route']);
$query_string = http_build_query($query_params);

$target_url = 'https://fapolu-io9w.onrender.com/api/' . ltrim($api_path, '/');
if (!empty($query_string)) {
    $target_url .= '?' . $query_string;
}

function call_render_api($url, $is_post, $raw_input, $custom_headers = array(), $timeout = 60) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    if ($is_post) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $raw_input);
        if (!empty($custom_headers)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $custom_headers);
        }
    }

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    return array('code' => $http_code, 'body' => $response, 'error' => $error);
}

$is_post = ($_SERVER['REQUEST_METHOD'] === 'POST');
$content_type = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
$raw_input = null;
$custom_headers = array('User-Agent: Mozilla/5.0 (Fapo-Proxy)');

if ($is_post) {
    if (strpos($content_type, 'multipart/form-data') !== false || !empty($_FILES)) {
        // Multipart/form-data with fields & files
        $fields = $_POST;
        if (!empty($_FILES)) {
            foreach ($_FILES as $k => $f) {
                if (isset($f['tmp_name']) && is_uploaded_file($f['tmp_name'])) {
                    $fields[$k] = new CURLFile($f['tmp_name'], $f['type'], $f['name']);
                }
            }
        }
        $raw_input = $fields;
        // cURL automatically sets the correct multipart boundary header with CURLFile
    } else {
        $raw_input = file_get_contents('php://input');
        $custom_headers[] = 'Content-Type: ' . ($content_type ?: 'application/json');
    }
}

$result = call_render_api($target_url, $is_post, $raw_input, $custom_headers, 45);

if ($result['code'] === 0 || $result['code'] >= 500) {
    @file_get_contents('https://fapolu-io9w.onrender.com/healthz');
    sleep(2);
    $result = call_render_api($target_url, $is_post, $raw_input, $custom_headers, 30);
}

if ($result['body'] === false || empty($result['body'])) {
    http_response_code(503);
    echo json_encode(array(
        'success' => false,
        'reply' => '⚠️ 雲端運算伺服器正在自適應喚醒中，請於 10~15 秒後再次點擊，系統即可恢復即時語音！',
        'error' => $result['error']
    ));
} else {
    // If returning a static audio URL, ensure it points to Render or local audio
    $body = $result['body'];
    $data = json_decode($body, true);
    if (is_array($data) && isset($data['url']) && strpos($data['url'], '/static/audio/cache/') === 0) {
        // Point audio url directly to Render so it can be streamed immediately
        $data['url'] = 'https://fapolu-io9w.onrender.com' . $data['url'];
        $body = json_encode($data);
    }
    http_response_code($result['code']);
    echo $body;
}
