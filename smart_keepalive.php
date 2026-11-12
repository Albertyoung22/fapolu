<?php
// ==============================================================================
//  法寶實業 (FAPO ENTERPRISE) - 智慧上班時間自動防休眠打卡模組 (Smart Keep-Alive)
// ==============================================================================
date_default_timezone_set('Asia/Taipei');

$hour = (int)date('G'); // 0 ~ 23
$day_of_week = (int)date('w'); // 0 (Sun) ~ 6 (Sat)

// 週一至週五 08:00 ~ 20:00 (上班黃金 12 小時) 保持活躍
$is_work_hours = ($day_of_week >= 1 && $day_of_week <= 5 && $hour >= 8 && $hour <= 20);

$target_url = 'https://fapolu-io9w.onrender.com/healthz';
$log_msg = date('Y-m-d H:i:s') . " - ";

if ($is_work_hours || isset($_GET['force'])) {
    $ch = curl_init($target_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Fapo-Smart-KeepAlive)');

    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code === 200) {
        $log_msg .= "PING SUCCESS (HTTP 200): " . trim($res);
    } else {
        $log_msg .= "PING COMPLETED (HTTP " . $code . ")";
    }
} else {
    $log_msg .= "SKIPPED (Energy Saving / Safe Free Tier Window: Off-work hour)";
}

header('Content-Type: text/plain; charset=utf-8');
echo $log_msg . "\n";
