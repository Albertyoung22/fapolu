<?php
// Force Asia/Taipei Timezone (UTC+8) across all system operations
date_default_timezone_set('Asia/Taipei');

// Website AI Smart Sales Engineer API for FAPO Enterprise
// Real-time domain knowledge consultation, 3,071 Inventory Specs Search, Multi-turn NLP & Instant LINE Push to internal team
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$raw_input = file_get_contents('php://input');
$input = json_decode($raw_input, true) ?: array();

$message = isset($input['message']) ? trim($input['message']) : '';
$history = isset($input['history']) && is_array($input['history']) ? $input['history'] : array();
$session_id = isset($input['session_id']) ? trim($input['session_id']) : '';

if (empty($message)) {
    echo json_encode(array(
        'success' => false, 
        'reply' => '您好！我是法寶線上業務工程師，請問今天有什麼鋁合金規格、現貨尺寸或裁切需求我可以為您服務？',
        'specs' => array(),
        'chips' => array('詢問 7075 航太超硬板', '詢問 6061 精密鋁材', '查詢台中廠電話', '直接留下電話報價')
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

// ==========================================
// 1. CONSOLIDATE MULTI-TURN CONVERSATION TEXT
// ==========================================
$user_messages = array();
if (!empty($history) && is_array($history)) {
    foreach ($history as $h) {
        if (isset($h['role']) && $h['role'] === 'user' && !empty($h['content'])) {
            $user_messages[] = trim($h['content']);
        }
    }
}
if (!empty($message) && (empty($user_messages) || end($user_messages) !== $message)) {
    $user_messages[] = $message;
}
$all_user_text = implode("\n", $user_messages);

// ==========================================
// 2. INTELLIGENT NLP: PHONE, NAME & SPECS
// ==========================================
$detected_phone = '';
if (preg_match('/(09\d{2}[- ]?\d{3}[- ]?\d{3}|0\d{1,2}[- ]?\d{7,8})/', $all_user_text, $m_phone)) {
    $detected_phone = $m_phone[1];
}

$clean_user_text = preg_replace('/(09\d{2}[- ]?\d{3}[- ]?\d{3}|0\d{1,2}[- ]?\d{7,8})/', '', $all_user_text);

// 2.1 Company Extraction
$detected_company = '';
if (preg_match('/(?:公司[：:\s]?|寶號[：:\s]?|工廠[：:\s]?)\s*([\p{Han}A-Za-z0-9_\s]{2,16})/u', $clean_user_text, $m_comp)) {
    $detected_company = trim($m_comp[1]);
} elseif (preg_match('/([\p{Han}A-Za-z0-9]{2,12}(?:科技|實業|精密|五金|工程|機械|企業|工業|模具|有限公司|行))/u', $clean_user_text, $m_comp)) {
    $detected_company = trim($m_comp[1]);
}

// 2.2 Name & Title Extraction
$detected_name = '';
if (preg_match('/([\p{Han}]{1,3}(?:先生|小姐|經理|老闆|總|廠長|副理|工程師|特助|採購|課長))/u', $clean_user_text, $m_name)) {
    $name_cand = trim($m_name[1]);
    $name_cand = preg_replace('/^(?:我是|我叫|叫我|敝人|在下)/u', '', $name_cand);
    if (mb_strlen($name_cand, 'UTF-8') >= 2) {
        $detected_name = $name_cand;
    }
}
if (empty($detected_name)) {
    if (preg_match('/(?:我姓|敝姓|在下姓|小弟姓)\s*([\p{Han}]{1,2})/u', $clean_user_text, $m_sur)) {
        $detected_name = trim($m_sur[1]) . '先生/小姐';
    } elseif (preg_match('/(?:我是|我叫|叫我|稱呼我|姓名[：:\s]?|聯絡人[：:\s]?)\s*([\p{Han}]{2,4})/u', $clean_user_text, $m_full)) {
        $detected_name = trim($m_full[1]);
    }
}

// Construct clean Display Name
$display_name = $detected_name;
if (!empty($detected_company)) {
    $display_name = !empty($detected_name) ? "{$detected_name} ({$detected_company})" : "{$detected_company} 訪客";
}
if (empty($display_name)) {
    $display_name = !empty($detected_phone) ? '官網訪客 (未留姓名)' : '線上諮詢訪客';
}

// 2.3 Aluminum Alloy, Shape & Dimension Extraction (across full context)
$alloys = array();
if (preg_match_all('/(7075(?:-T651|-T6)?|6061(?:-T651|-T6)?|5083(?:-H112|-H321)?|5052(?:-H114|-H32)?|2024(?:-T351)?|6063(?:-T5)?|MIC-?6|7050|1050)/i', $all_user_text, $m_al)) {
    $alloys = array_unique(array_map('strtoupper', $m_al[1]));
}

$forms = array();
if (preg_match_all('/(厚板|薄板|鋁板|圓棒|扁條|四方條|六角條|無縫管|方管|扁管|花紋板|防滑板|踏板|角鋁|免開模擠型|擠型|模具)/u', $all_user_text, $m_fm)) {
    $forms = array_unique($m_fm[1]);
}

$dims = array();
if (preg_match_all('/(\d+(?:\.\d+)?\s*(?:mm|公厘|米|尺|Ø|直徑)|\d+\s*[*xX×]\s*\d+(?:\s*[*xX×]\s*\d+)?|\d+\s*(?:片|支|個|件|組))/iu', $all_user_text, $m_dm)) {
    $dims = array_unique($m_dm[1]);
}

$spec_parts = array();
if (!empty($alloys)) $spec_parts[] = implode('/', $alloys);
if (!empty($forms)) $spec_parts[] = implode('/', $forms);
if (!empty($dims)) $spec_parts[] = implode(' ', array_slice($dims, 0, 4));

if (!empty($spec_parts)) {
    $mat_summary = implode(' ', $spec_parts);
    if (strpos($all_user_text, '翹曲') !== false || strpos($all_user_text, '變形') !== false) {
        $mat_summary .= ' / 銑削防翹曲需求';
    } elseif (strpos($all_user_text, '現貨') !== false) {
        $mat_summary .= ' / 現貨與牌價詢價';
    } elseif (strpos($all_user_text, '切') !== false || strpos($all_user_text, '下料') !== false) {
        $mat_summary .= ' / 定寸裁切需求';
    }
} else {
    $clean_q = $clean_user_text;
    $clean_q = preg_replace('/(?:在嗎|請撥電話|電話|麻煩|謝謝|你好|您好|聯絡人|我想|詢問|請問|有現貨嗎)/u', '', $clean_q);
    $clean_q = trim(preg_replace('/[，,：:?？\s]+/u', ' ', $clean_q));
    $mat_summary = (mb_strlen($clean_q, 'UTF-8') > 1) ? mb_substr($clean_q, 0, 45, 'UTF-8') : '官網線上材料與加工諮詢';
}

// 2.4 Multi-Turn Conversation Transcript for LINE Flex Card
$transcript_blocks = array();
if (!empty($history) && is_array($history)) {
    foreach ($history as $h) {
        $role = isset($h['role']) ? $h['role'] : 'user';
        $cnt = isset($h['content']) ? trim($h['content']) : '';
        if (empty($cnt)) continue;
        
        $short_cnt = mb_strlen($cnt, 'UTF-8') > 65 ? mb_substr($cnt, 0, 62, 'UTF-8') . '...' : $cnt;
        if ($role === 'user') {
            $transcript_blocks[] = array(
                'type' => 'box', 'layout' => 'horizontal', 'spacing' => 'xs', 'margin' => 'xs',
                'contents' => array(
                    array('type' => 'text', 'text' => '👤', 'size' => 'xxs', 'flex' => 0),
                    array('type' => 'text', 'text' => "客戶：{$short_cnt}", 'size' => 'xs', 'color' => '#0f172a', 'weight' => 'bold', 'wrap' => true, 'flex' => 1)
                )
            );
        } else {
            $transcript_blocks[] = array(
                'type' => 'box', 'layout' => 'horizontal', 'spacing' => 'xs', 'margin' => 'xs',
                'contents' => array(
                    array('type' => 'text', 'text' => '🤖', 'size' => 'xxs', 'flex' => 0),
                    array('type' => 'text', 'text' => "特助：{$short_cnt}", 'size' => 'xs', 'color' => '#64748b', 'wrap' => true, 'flex' => 1)
                )
            );
        }
    }
}
// Append current message if not yet present
if (!empty($message)) {
    $short_m = mb_strlen($message, 'UTF-8') > 65 ? mb_substr($message, 0, 62, 'UTF-8') . '...' : $message;
    $transcript_blocks[] = array(
        'type' => 'box', 'layout' => 'horizontal', 'spacing' => 'xs', 'margin' => 'xs',
        'contents' => array(
            array('type' => 'text', 'text' => '👤', 'size' => 'xxs', 'flex' => 0),
            array('type' => 'text', 'text' => "客戶：{$short_m}", 'size' => 'xs', 'color' => '#b91c1c', 'weight' => 'bold', 'wrap' => true, 'flex' => 1)
        )
    );
}
if (count($transcript_blocks) > 6) {
    $transcript_blocks = array_slice($transcript_blocks, -6);
}

// ==========================================
// 3. LINE MULTICAST NOTIFIER (INTERNAL ALERT)
// ==========================================
function notify_internal_staff_via_line($ticket_id, $contact_phone, $customer_name, $mat_query, $transcript_blocks, $is_update = false, $is_handover = false) {
    $cfg_file = __DIR__ . '/line_config.json';
    if (!file_exists($cfg_file)) $cfg_file = __DIR__ . '/data/line_config.json';
    if (!file_exists($cfg_file)) return false;

    $cfg = json_decode(file_get_contents($cfg_file), true);
    $token = !empty($cfg['channel_access_token']) ? $cfg['channel_access_token'] : 'OYxWmTRvLTCInR9X22g/muRg5xuEeb3UHLfgv9O9NSxFZXqF3MxbgdDCCXJG0ZeCpZyMTuA4SV+2zoBNmVqCvXpofkbV6MGm66v4hDBfCYTYoSuAq+QPnmn/5lZ3ss5FN1tBzoQ5OjGtqNqe/qUYzwdB04t89/1O/w1cDnyilFU=';
    $admin_ids = !empty($cfg['admin_user_ids']) && is_array($cfg['admin_user_ids']) ? $cfg['admin_user_ids'] : array('U61e3e6e073b76a54d63b7dcb30744c63');
    if (empty($token)) return false;

    $is_test = (
        mb_strpos($customer_name, '測試') !== false ||
        mb_strpos($mat_query, '測試') !== false ||
        stripos($mat_query, 'test') !== false ||
        stripos($customer_name, 'test') !== false
    );

    $clean_phone = preg_replace('/[^\d\+]/', '', $contact_phone);
    $has_valid_phone = (!empty($clean_phone) && strlen($clean_phone) >= 8);

    if ($is_test) {
        $header_bg = '#7c2d12';
        $header_kicker = '⚠️【系統工程測試·請同仁勿驚慌】';
        $header_kicker_color = '#fef08a';
        $badge_text = '工程測試';
        $badge_color = '#fbbf24';
        $header_title = '⚠️ 系統測試 · 官網通報驗證';
        $alt_text = "⚠️【系統測試·非真實客戶】官網訪客通報 ({$ticket_id})";
    } elseif ($is_handover) {
        $header_bg = '#991b1b';
        $header_kicker = '🚨 官網訪客即時呼叫真人業務！';
        $header_kicker_color = '#fecaca';
        $badge_text = '真人轉接';
        $badge_color = '#f87171';
        $header_title = '訪客請求專人接管對話';
        $alt_text = "🚨【官網訪客呼叫真人業務】{$customer_name}：" . mb_substr($mat_query, 0, 30, 'UTF-8');
    } elseif ($is_update) {
        $header_bg = '#1e3a8a';
        $header_kicker = '⚡ 官網 AI 客戶補充稱呼與需求！';
        $header_kicker_color = '#bfdbfe';
        $badge_text = '補充更新';
        $badge_color = '#60a5fa';
        $header_title = "客戶補充：{$customer_name}";
        $alt_text = "🔔【法寶官網 需求補充】{$customer_name} ({$contact_phone})";
    } else {
        $header_bg = '#0f172a';
        $header_kicker = '⚡ 官網 AI 業務客服即時接單';
        $header_kicker_color = '#a7f3d0';
        $badge_text = '即時接單';
        $badge_color = '#34d399';
        $header_title = "新客戶留下詢價電話！";
        $alt_text = "🔔【法寶官網 AI 新單】{$customer_name} ({$contact_phone})";
    }

    $body_contents = array();

    if ($is_test) {
        $body_contents[] = array(
            'type' => 'box', 'layout' => 'vertical',
            'backgroundColor' => '#fef3c7', 'paddingAll' => '10px', 'cornerRadius' => '6px',
            'contents' => array(
                array(
                    'type' => 'text',
                    'text' => '📢【提醒同仁】此為工程師系統連線測試，非真實客戶訂單，請勿撥打電話或進行報價！',
                    'size' => 'xs', 'color' => '#b45309', 'weight' => 'bold', 'wrap' => true
                )
            )
        );
    } elseif ($is_handover) {
        $body_contents[] = array(
            'type' => 'box', 'layout' => 'vertical',
            'backgroundColor' => '#fee2e2', 'paddingAll' => '10px', 'cornerRadius' => '6px',
            'contents' => array(
                array(
                    'type' => 'text',
                    'text' => '📢【同仁注意】訪客正在官網請求真人服務，請值班業務同仁立即開啟「LINE 官方帳號 App」接手對話！',
                    'size' => 'xs', 'color' => '#991b1b', 'weight' => 'bold', 'wrap' => true
                )
            )
        );
    }

    $body_contents[] = array(
        'type' => 'box', 'layout' => 'horizontal',
        'contents' => array(
            array('type' => 'text', 'text' => '👤 詢價訪客', 'size' => 'xs', 'color' => '#64748b', 'flex' => 2),
            array('type' => 'text', 'text' => $customer_name, 'size' => 'sm', 'color' => '#0f172a', 'weight' => 'bold', 'flex' => 5, 'wrap' => true)
        )
    );
    $body_contents[] = array(
        'type' => 'box', 'layout' => 'horizontal',
        'contents' => array(
            array('type' => 'text', 'text' => '📞 聯絡電話', 'size' => 'xs', 'color' => '#64748b', 'flex' => 2),
            array('type' => 'text', 'text' => $contact_phone, 'size' => 'md', 'color' => '#dc2626', 'weight' => 'bold', 'flex' => 5)
        )
    );
    $body_contents[] = array(
        'type' => 'box', 'layout' => 'horizontal',
        'contents' => array(
            array('type' => 'text', 'text' => '📦 詢問項目', 'size' => 'xs', 'color' => '#64748b', 'flex' => 2),
            array('type' => 'text', 'text' => $mat_query, 'size' => 'sm', 'color' => '#0f172a', 'weight' => 'bold', 'flex' => 5, 'wrap' => true)
        )
    );
    $body_contents[] = array('type' => 'separator', 'margin' => 'md', 'color' => '#e2e8f0');
    $body_contents[] = array(
        'type' => 'box', 'layout' => 'vertical', 'margin' => 'sm', 'spacing' => 'xs',
        'contents' => array_merge(
            array(array('type' => 'text', 'text' => '💬 客戶對話完整歷程：', 'size' => 'xs', 'color' => '#475569', 'weight' => 'bold')),
            $transcript_blocks
        )
    );

    $footer_buttons = array();
    if ($has_valid_phone) {
        $footer_buttons[] = array(
            'type' => 'button',
            'action' => array('type' => 'uri', 'label' => '📞 一鍵直撥客戶電話', 'uri' => 'tel:' . $clean_phone),
            'style' => 'primary', 'color' => '#059669', 'height' => 'sm'
        );
    }
    $footer_buttons[] = array(
        'type' => 'button',
        'action' => array('type' => 'uri', 'label' => '💬 打開 LINE 官方帳號對話', 'uri' => 'https://chat.line.biz'),
        'style' => $has_valid_phone ? 'secondary' : 'primary',
        'color' => $has_valid_phone ? '#0f172a' : '#06c755',
        'height' => 'sm'
    );
    $footer_buttons[] = array(
        'type' => 'button',
        'action' => array('type' => 'uri', 'label' => '📋 前往官網後台管理', 'uri' => 'https://www.fapolu.com.tw/admin.html'),
        'style' => 'secondary', 'height' => 'sm'
    );

    $flex_msg = array(
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
                        'type' => 'box', 'layout' => 'horizontal',
                        'contents' => array(
                            array('type' => 'text', 'text' => $header_kicker, 'weight' => 'bold', 'color' => $header_kicker_color, 'size' => 'xs', 'flex' => 1),
                            array('type' => 'text', 'text' => $badge_text, 'weight' => 'bold', 'color' => $badge_color, 'size' => 'xxs', 'align' => 'end')
                        )
                    ),
                    array('type' => 'text', 'text' => $header_title, 'weight' => 'bold', 'color' => '#ffffff', 'size' => 'lg', 'margin' => 'sm'),
                    array('type' => 'text', 'text' => '案件編號：' . $ticket_id . ' · ' . date('m/d H:i:s'), 'color' => '#fee2e2', 'size' => 'xs', 'margin' => 'xs')
                )
            ),
            'body' => array(
                'type' => 'box',
                'layout' => 'vertical',
                'spacing' => 'md',
                'contents' => $body_contents
            ),
            'footer' => array(
                'type' => 'box', 'layout' => 'vertical', 'spacing' => 'sm',
                'contents' => $footer_buttons
            )
        )
    );

    // 1. Try Broadcast to all colleagues first (so all staff receive alert)
    $bch = curl_init('https://api.line.me/v2/bot/message/broadcast');
    curl_setopt($bch, CURLOPT_POST, true);
    curl_setopt($bch, CURLOPT_POSTFIELDS, json_encode(array(
        'messages' => array($flex_msg)
    ), JSON_UNESCAPED_UNICODE));
    curl_setopt($bch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Authorization: Bearer ' . $token
    ));
    curl_setopt($bch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($bch, CURLOPT_TIMEOUT, 6);
    curl_setopt($bch, CURLOPT_SSL_VERIFYPEER, false);
    $bres = curl_exec($bch);
    $bcode = curl_getinfo($bch, CURLINFO_HTTP_CODE);
    curl_close($bch);

    if ($bcode === 200) return true;

    // 2. Fallback to multicast/push
    $url = count($admin_ids) === 1 ? 'https://api.line.me/v2/bot/message/push' : 'https://api.line.me/v2/bot/message/multicast';
    $payload = array(
        'to' => count($admin_ids) === 1 ? $admin_ids[0] : $admin_ids,
        'messages' => array($flex_msg)
    );

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Authorization: Bearer ' . $token));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    @curl_exec($ch);
    curl_close($ch);
    return true;
}

// 4. SEARCH 3,071 REAL INVENTORY SPECS
// ==========================================
// Extract search tokens ONLY from the current turn's message
$curr_alloys = array();
if (preg_match_all('/(7075(?:-T651|-T6)?|6061(?:-T651|-T6)?|5083(?:-H112|-H321)?|5052(?:-H114|-H32)?|2024(?:-T351)?|6063(?:-T5)?|MIC-?6|7050|1050)/i', $message, $m_cal)) {
    $curr_alloys = array_unique(array_map('strtoupper', $m_cal[1]));
}
$curr_forms = array();
if (preg_match_all('/(厚板|薄板|鋁板|圓棒|扁條|四方條|六角條|無縫管|方管|扁管|花紋板|防滑板|踏板|角鋁|免開模擠型|擠型|模具)/u', $message, $m_cfm)) {
    $curr_forms = array_unique($m_cfm[1]);
}
$curr_dims = array();
if (preg_match_all('/(\d+(?:\.\d+)?)\s*(?:mm|公厘|厚|直徑|Ø)/iu', $message, $m_cdm)) {
    $curr_dims = array_unique($m_cdm[1]);
}

$matched_specs = array();
// Only query specs table if user is actually inquiring about materials/dimensions
if (!empty($curr_alloys) || !empty($curr_forms) || !empty($curr_dims)) {
    $specs_candidates = array(
        __DIR__ . '/static/data/inventory_specs.json',
        __DIR__ . '/../static/data/inventory_specs.json',
        __DIR__ . '/data/inventory_specs.json'
    );
    $specs_file = '';
    foreach ($specs_candidates as $sp) {
        if (file_exists($sp)) { $specs_file = $sp; break; }
    }

    if ($specs_file) {
        $specs_raw = @file_get_contents($specs_file);
        $specs_all = json_decode($specs_raw, true);
        if (is_array($specs_all)) {
            $tokens = array_merge($curr_alloys, $curr_forms, $curr_dims);
            $cnt = 0;
            foreach ($specs_all as $item) {
                $target_str = ($item['material'] ?? '') . ' ' . ($item['category'] ?? '') . ' ' . ($item['dimension'] ?? '') . ' ' . ($item['size'] ?? '');
                $match = true;
                foreach ($tokens as $tk) {
                    if (empty($tk)) continue;
                    if (stripos($target_str, $tk) === false) {
                        $match = false;
                        break;
                    }
                }
                if ($match) {
                    $matched_specs[] = array(
                        'no' => $item['no'] ?? '',
                        'material' => $item['material'] ?? '',
                        'category' => $item['category'] ?? '',
                        'dimension' => $item['dimension'] ?? '',
                        'size' => $item['size'] ?? '',
                        'note' => $item['note'] ?? '常備庫存'
                    );
                    $cnt++;
                    if ($cnt >= 4) break;
                }
            }
        }
    }
}

// ==========================================
// 5. SESSION TRACKING & LEAD RECORD STORAGE
// ==========================================
$local_dir = __DIR__ . '/data';
if (!file_exists($local_dir)) @mkdir($local_dir, 0755, true);
$local_file = $local_dir . '/metal_inquiries.json';
$inquiries = file_exists($local_file) ? (json_decode(@file_get_contents($local_file), true) ?: array()) : array();

$ticket_id = '';
$is_lead_captured = false;
$is_supplementary_update = false;

// Check if this session or phone matches an existing inquiry
$matched_index = -1;
if (!empty($session_id)) {
    foreach ($inquiries as $idx => $inq) {
        if (!empty($inq['sessionId']) && $inq['sessionId'] === $session_id) {
            $matched_index = $idx;
            break;
        }
    }
}
if ($matched_index === -1 && !empty($detected_phone)) {
    // Check if created in last 2 hours
    $now_time = time();
    foreach ($inquiries as $idx => $inq) {
        if (!empty($inq['contactPhone']) && $inq['contactPhone'] === $detected_phone) {
            $created_time = strtotime($inq['timestamp'] ?? 'now');
            if (($now_time - $created_time) < 7200) {
                $matched_index = $idx;
                break;
            }
        }
    }
}

function sync_to_crm_lead($ticket_id, $company, $name, $phone, $mat_summary, $msg_history) {
    $crm_file = __DIR__ . '/data/yangtech_leads.json';
    $leads = file_exists($crm_file) ? (json_decode(@file_get_contents($crm_file), true) ?: array()) : array();
    $found = false;
    foreach ($leads as &$l) {
        if ($l['id'] === $ticket_id || (!empty($phone) && !empty($l['phone']) && $l['phone'] === $phone)) {
            if (!empty($name) && $name !== '官網訪客 (未留姓名)') $l['name'] = $name;
            if (!empty($company) && $company !== '官網AI洽詢企業') $l['company'] = $company;
            $l['service_type'] = '官網AI業務特助接單 (' . ($mat_summary ?: '材料/加工詢價') . ')';
            $l['message'] = "【{$mat_summary}】\n" . mb_substr($msg_history, 0, 500, 'UTF-8');
            $found = true;
            break;
        }
    }
    if (!$found) {
        $new_lead = array(
            'id' => $ticket_id,
            'created_at' => date('Y-m-d H:i:s'),
            'company' => (!empty($company) && $company !== '官網AI洽詢企業') ? $company : '官網線上訪客',
            'name' => (!empty($name) && $name !== '官網訪客 (未留姓名)') ? $name : '線上訪客',
            'phone' => $phone,
            'email' => '線上即時諮詢',
            'line_id' => '未填寫',
            'service_type' => '官網AI業務特助接單 (' . ($mat_summary ?: '材料/加工詢價') . ')',
            'budget' => '即時估價',
            'message' => "【{$mat_summary}】\n" . mb_substr($msg_history, 0, 500, 'UTF-8'),
            'status' => '新進洽詢',
            'notes' => '來自官網 24H AI 業務特助即時自動轉單'
        );
        array_unshift($leads, $new_lead);
    }
    @file_put_contents($crm_file, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

if ($matched_index !== -1) {
    // Update existing record with newer details
    $ticket_id = $inquiries[$matched_index]['id'];
    if (!empty($detected_phone)) $inquiries[$matched_index]['contactPhone'] = $detected_phone;
    if (!empty($detected_name) && ($inquiries[$matched_index]['contactPerson'] === '線上訪客' || $inquiries[$matched_index]['contactPerson'] === '官網訪客 (未留姓名)')) {
        $inquiries[$matched_index]['contactPerson'] = $detected_name;
    }
    if (!empty($detected_company) && ($inquiries[$matched_index]['companyName'] === '官網AI對談訪客' || empty($inquiries[$matched_index]['companyName']))) {
        $inquiries[$matched_index]['companyName'] = $detected_company;
    }
    if (!empty($mat_summary) && $mat_summary !== '官網線上材料與加工諮詢') {
        $inquiries[$matched_index]['inquiryMaterial'] = $mat_summary;
    }
    $inquiries[$matched_index]['inquiryMessage'] .= "\n[客戶補充 " . date('H:i') . "] {$message}";
    $inquiries[$matched_index]['updatedAt'] = date('Y-m-d H:i:s');
    @file_put_contents($local_file, json_encode($inquiries, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    // Also sync to CRM leads list for sales follow up
    sync_to_crm_lead($ticket_id, $inquiries[$matched_index]['companyName'], $inquiries[$matched_index]['contactPerson'], $inquiries[$matched_index]['contactPhone'], $mat_summary, $inquiries[$matched_index]['inquiryMessage']);

    // If customer supplemented name or spec, notify staff via LINE
    if (!empty($detected_name) || !empty($alloys) || !empty($dims)) {
        notify_internal_staff_via_line($ticket_id, $inquiries[$matched_index]['contactPhone'], $display_name, $mat_summary, $transcript_blocks, true);
        $is_supplementary_update = true;
    }
    $is_lead_captured = true;
} elseif (!empty($detected_phone)) {
    // New inquiry
    $ticket_id = 'REQ-' . (1000 + count($inquiries) + 1);
    $new_record = array(
        'id' => $ticket_id,
        'sessionId' => $session_id,
        'companyName' => $detected_company ?: '官網AI洽詢企業',
        'contactPerson' => $detected_name ?: '官網訪客 (未留姓名)',
        'contactPhone' => $detected_phone,
        'contactEmail' => '官網即時對談',
        'inquiryMaterial' => $mat_summary,
        'branch' => '未指派',
        'deliveryCounty' => '未指定',
        'inquiryMessage' => "客戶在官網AI對話留下電話：{$detected_phone}。\n對話歷程：\n{$all_user_text}",
        'drawingUrl' => '',
        'timestamp' => date('Y-m-d H:i:s'),
        'updatedAt' => date('Y-m-d H:i:s'),
        'status' => 'pending'
    );
    array_unshift($inquiries, $new_record);
    @file_put_contents($local_file, json_encode($inquiries, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    // Also sync to CRM leads list for sales follow up
    sync_to_crm_lead($ticket_id, $new_record['companyName'], $new_record['contactPerson'], $detected_phone, $mat_summary, $all_user_text);

    // Instant LINE Push to internal team
    notify_internal_staff_via_line($ticket_id, $detected_phone, $display_name, $mat_summary, $transcript_blocks, false);
    $is_lead_captured = true;
}

// ==========================================
// 6. BUILD EXPERT CONVERSATIONAL RESPONSE
// ==========================================
$reply = "";
$chips = array();

// Separate current query intent from background memory
$q = mb_strtolower($message, 'UTF-8');
$ctx = mb_strtolower($all_user_text, 'UTF-8');

// Detect if a specific material was discussed in previous context
$context_alloy_note = "";
if (strpos($ctx, '7075') !== false) {
    $context_alloy_note = "【7075 航太超硬板/棒材】";
} elseif (strpos($ctx, '6061') !== false) {
    $context_alloy_note = "【6061-T6 精密結構鋁材】";
} elseif (strpos($ctx, '5083') !== false) {
    $context_alloy_note = "【5083 耐海水防鏽鋁板】";
} elseif (strpos($ctx, '花紋') !== false || strpos($ctx, '防滑') !== false || strpos($ctx, '車斗') !== false) {
    $context_alloy_note = "【卡車車斗防滑花紋板】";
} elseif (strpos($ctx, 'mic-6') !== false || strpos($ctx, 'mic6') !== false) {
    $context_alloy_note = "【MIC-6 超精密鑄鋁研磨板】";
}

// -------------------------------------------------------------
// Priority 1: Lead capture / Phone provided
// -------------------------------------------------------------
if ($is_supplementary_update) {
    $reply = "🤝 {$display_name} 您好！\n\n"
           . "已成功為您將「{$mat_summary}」的最新需求補充登錄至案件（工單編號：{$ticket_id}）！\n\n"
           . "法寶值班業務手機端已同步收到 LINE 更新推播，稍後致電給您時將直接為您核對規格公差並提供最精準的含運牌價！";
    $chips = array('查詢台中廠電話', '查詢全台廠區據點', '我想看 2,557 項免開模斷面', '返回規格搜尋');
} elseif ($is_lead_captured && preg_match('/(09\d{2}[- ]?\d{3}[- ]?\d{3}|0\d{1,2}[- ]?\d{7,8})/', $message)) {
    // Phone was JUST entered in this turn!
    if (empty($detected_name) || $display_name === '官網訪客 (未留姓名)') {
        $reply = "🤝 太棒了！已為您成功登錄工程洽詢單（案件編號：{$ticket_id}）。\n\n"
               . "已為您記錄聯絡電話（{$detected_phone}），法寶值班業務專員已在手機 LINE 收到即時接單提醒！\n\n"
               . "💡 請問老闆/先進如何稱呼您？手邊有想評估的鋁合金規格（如 7075、6061、花紋板）、厚度尺寸或送貨地點嗎？\n\n"
               . "您可以直接在此回覆我，我立刻幫您整理並補充給專員，方便專員稍後致電為您秒速報價！";
        $chips = array('我是陳先生/小姐', '我有 CAD 圖面想上傳', '詢問 7075 超平厚板', '詢問 6061 圓棒');
    } else {
        $reply = "🤝 {$display_name} 您好！已為您成功登錄工程洽詢單（案件編號：{$ticket_id}）！\n\n"
               . "我們的業務專員已在手機端收到 LINE 即時通報，將於 5~10 分鐘內親自致電給您（{$detected_phone}），為您核對規格公差並提供最優惠的含運牌價！\n\n"
               . "若您手邊有 CAD 圖面或尺寸草圖，也歡迎直接點擊詢價單拍照上傳，我們工程師可同步為您評估加工細節喔！";
        $chips = array('查詢台中廠電話', '查詢全台廠區專線', '我想看 2,557 項免開模斷面', '返回規格搜尋');
    }
}
// -------------------------------------------------------------
// -------------------------------------------------------------
// Priority 1.5: Visitor Explicitly Requests Human Agent / Live Sales / Phone Handover
// -------------------------------------------------------------
elseif (preg_match('/(真人|找業務|專人|業務|客服|找人|人工|聯絡人|接真人|轉接|轉真人|打給我|想找業務|跟人聊|我要真人|真人客服|在不在|找老闆|請人聯絡|找誰)/u', $q)) {
    $note = !empty($context_alloy_note) ? "關於您剛才詢問的 {$context_alloy_note}，" : "";
    
    // Trigger Instant LINE Push to ALL staff
    $handover_phone = !empty($detected_phone) ? $detected_phone : '訪客未留電話(等待LINE對談)';
    notify_internal_staff_via_line($ticket_id, $handover_phone, $display_name, $mat_summary . '【訪客要求轉接真人業務】', $transcript_blocks, false, true);

    $reply = "老闆/先進您好！{$note}已為您啟動【真人業務工程師即時連線】通道！🤝\n\n"
           . "📢 我們的全體值班業務同仁手機已同步收到您的即時呼叫與詢問摘要！\n\n"
           . "👉 **最推薦方式**：請直接點擊下方綠色按鈕 **【🟢 開啟 LINE 官方帳號一對一對談】**，我們的值班同仁將立即在 LINE 上與您親切對接、為您速算報價！\n\n"
           . "👉 **電話回電方式**：或在下方直接輸入您的 **聯絡電話**，業務專員將於 5 分鐘內親自致電為您解答！";
    
    $chips = array('🟢 開啟 LINE 官方帳號對談', '📞 留下電話由專員報價', '查詢台中廠電話', '返回材料規格搜尋');
    $line_transfer = true;
}
// Priority 2: Specific Branch Phone & Address Queries (Direct intent matching on current query)
// -------------------------------------------------------------
elseif (preg_match('/(估價|報價|詢價|價格|多少錢|上傳圖面|傳圖|圖面|怎麼買|contact|快速估價|即時諮詢|線上估價|填單)/u', $q)) {
    $note = !empty($context_alloy_note) ? "針對您剛才詢問的 {$context_alloy_note}，" : "";
    $reply = "老闆/先進您好！{$note}誠摯推薦您使用法寶實業【即時諮詢與快速估價系統】：\n\n"
           . "📋 **[即時諮詢與快速估價系統](https://www.fapolu.com.tw/#contact)**\n\n"
           . "✨ **系統三大專屬優勢**：\n"
           . "• **免模具/規格快速帶入**：可直接輸入多項板料厚度、圓棒直徑、長度與需求件數。\n"
           . "• **支援圖檔直傳 (CAD / 2D / 3D / PDF)**：複雜異型件或雙面銑平圖面直接上傳，工程團隊進行母材排版優化。\n"
           . "• **5~10 分鐘極速回覆**：北中南各廠值班業務工程師親自試算，即刻出具正式含稅報價單與原廠材質證明選項！\n\n"
           . "👉 請點擊上方連結，或點擊下方紅色快捷按鈕即可直接開啟估價單！";
    $chips = array('📋 前往即時諮詢與快速估價', '查詢台中廠電話', '查詢 6061 現貨庫存', '留下電話由專員報價');
}
elseif (preg_match('/(台中|中港|西屯|沙鹿|台灣大道)/u', $q) && preg_match('/(電話|據點|廠|地址|聯絡|現貨|位置|在哪|看料|倉)/u', $q)) {
    $note = !empty($context_alloy_note) ? "，廠內常備大量 {$context_alloy_note} 現貨，並備有大型重切削裁板機與數控圓棒鋸床支援現場快速裁切" : "";
    $reply = "老闆/先進您好！【法寶實業 台中物流中心 (台中廠)】專線資訊如下：\n\n"
           . "📍 **台中物流中心 (台中廠 · 龐大現貨發貨中心)**\n"
           . "📞 **電話專線**：(04) 2258-4931\n"
           . "📠 **傳真專線**：(04) 2258-8743\n"
           . "🏢 **廠區地址**：台中市西屯區台灣大道四段五巷167號 (國道1號台中沙鹿交流道旁)\n\n"
           . "✨ **服務亮點**：\n"
           . "• 佔地逾千坪{$note}！\n"
           . "• 支援 1000~7000 系列鋁板、圓棒、方條、六角條現貨調撥。\n"
           . "• 廠內配置 CM3800 大型重切削裁板機，厚板定寸精銑洗平、免模具快速出料。\n\n"
           . "您現在可以直接撥打專線，或留下您的電話，我立刻請台中廠值班專員為您回電報價！";
    $chips = array('查詢台北總公司電話', '查詢台南營運中心電話', '留下電話由台中業務回撥', '我要詢價 7075 鋁板');
}
elseif (preg_match('/(台北|總公司|民權東路|松山)/u', $q) && preg_match('/(電話|據點|地址|聯絡|位置|在哪)/u', $q)) {
    $reply = "先進您好！【法寶實業 台北總公司】資訊如下：\n\n"
           . "📍 **台北總公司 (進出口與國貿行政中心)**\n"
           . "📞 **電話專線**：(02) 2718-3134\n"
           . "📠 **傳真專線**：(02) 2718-9443\n"
           . "🏢 **地址**：台北市民權東路三段136號3樓之5 (松山機場旁)\n\n"
           . "✨ 統籌全台進出口貿易調度、大宗專案合約與北部客戶即時商務洽談。\n"
           . "歡迎直接致電，或留下您的聯絡電話，由台北業務主管直接與您接洽！";
    $chips = array('查詢台中廠電話', '查詢台南營運中心電話', '留下電話由主管回撥', '返回規格搜尋');
}
elseif (preg_match('/(台南|佳里|麻豆|南部|麻柚路)/u', $q) && preg_match('/(電話|據點|廠|地址|聯絡|位置|在哪|新廠)/u', $q)) {
    $reply = "先進您好！【法寶實業 台南營運中心】編制有雙廠區為南部客戶即時服務：\n\n"
           . "📍 **台南營運中心 (台南雙廠區編制)**\n"
           . "📞 **服務專線**：(06) 726-3666\n"
           . "📠 **傳真專線**：(06) 726-3888\n"
           . "🏢 **佳里一廠 (佳里倉)**：台南市佳里區子良里子龍廟40-23號 (南區核心發貨倉庫)\n"
           . "🏢 **麻豆二廠 (麻豆新廠)**：台南市麻豆區麻柚路446號 (最新擴充據點，具備挑高無塵儲運月台與新式自動鋸切中心)\n\n"
           . "深耕南部近 40 年，萬坪木榫板與進口貼膜板在庫充足，支援南部各大科技園區專車直達！";
    $chips = array('查詢台中廠電話', '查詢台北總公司電話', '留下電話由專員報價', '返回規格搜尋');
}
elseif (preg_match('/(電話|廠區|地址|據點|哪裡|分公司|聯絡)/u', $q)) {
    $reply = "先進您好！法寶實業全台北中南三大服務樞紐專線如下：\n\n"
           . "📍 **台北總公司**：(02) 2718-3134\n"
           . "地址：台北市民權東路三段136號3樓之5 (松山機場旁)\n\n"
           . "📍 **台中物流中心 (台中廠)**：(04) 2258-4931\n"
           . "地址：台中市西屯區台灣大道四段五巷167號 (國1沙鹿交流道旁 · CM3800大裁板中心)\n\n"
           . "📍 **台南營運中心 (佳里倉/麻豆新廠)**：(06) 726-3666\n"
           . "地址：台南市麻豆區麻柚路446號\n\n"
           . "您可直接撥打最近廠區，或在此留下您的【電話】，由值班主管立即主動回撥為您報價！";
    $chips = array('查詢台中廠電話', '查詢台北總公司電話', '查詢台南營運中心電話', '直接留下電話報價');
}
// -------------------------------------------------------------
// Priority 3: Purchasing, Orders, Logistics & Business Terms
// -------------------------------------------------------------
elseif (preg_match('/(散切|零散|零售|最少|起訂|moq|買一支|買一片|散買|少買|可以切嗎|少量)/u', $q)) {
    $reply = "老闆/先進您好！**法寶實業全力支援「散切零售」！**\n\n"
           . "💡 **彈性下料優勢**：\n"
           . "• 即使您只需要「1 片厚板」或「1 支圓棒」，我們廠內的數控鋸床與 CM3800 大型裁切機均可為您**依圖精確定寸鋸切**！\n"
           . "• 完全不強制買整支（長度 3000~6000mm）或整大板（4x8 尺、5x10 尺），大幅省下您的資金積壓與庫存廢料！\n"
           . "• 切割公差可嚴密控制在 ±0.2mm 以內，端面平整不毛邊。\n\n"
           . "請問您手邊需要的【材質】與【長寬厚度尺寸】是多少呢？留下規格我馬上為您試算！";
    $chips = array('需要 6061 定寸散切', '需要 7075 厚板裁切', '母材裁切最佳化計算', '直接留下電話報價');
}
elseif (preg_match('/(材質證明|mill sheet|出廠證明|sgs|質保|原廠證明|物性表|檢驗)/u', $q)) {
    $reply = "您好！法寶實業所有進口正規材料，均可提供**原廠進口材質證明書 (Mill Sheet)**！\n\n"
           . "📋 **檢驗證明書內容包含**：\n"
           . "1️⃣ **原廠生產批號與爐號** (Heat No. / Lot No.)\n"
           . "2️⃣ **化學成分分析報告** (Si, Fe, Cu, Mn, Mg, Cr, Zn, Ti, Al 等各元素精確百分比)\n"
           . "3️⃣ **機械物理性能測試** (抗拉強度 Tensile、屈服強度 Yield、延伸率 Elongation、硬度 HB)\n\n"
           . "出貨時均可隨貨隨附原廠證明，亦全力配合客戶執行第三方公證檢驗 (SGS)。請問您詢價的是哪個牌號呢？";
    $chips = array('需要 7075 原廠證明', '需要 6061 原廠證明', '需要 5083 原廠證明', '留下電話由專員報價');
}
elseif (preg_match('/(送貨|運費|運送|運到|外縣市|配送|車隊|送到|含運)/u', $q)) {
    $reply = "老闆您好！**法寶實業擁有北中南自營物流車隊，全台灣各縣市專車配送！**\n\n"
           . "🚛 **配送優勢**：\n"
           . "• 涵蓋基隆、大台北、桃園、新竹科學園區、台中精密機械園區、台南科學園區至高雄屏東天天排車趟。\n"
           . "• 庫存常備料件下單確認後最快當日或次日即可裝車配送！\n"
           . "• 達基本訂購門檻即享專車免運直達廠區。\n\n"
           . "請問您送貨的縣市在哪裡呢？手邊有需要報價的尺寸嗎？留下電話立刻為您安排車趟！";
    $chips = array('送貨到台中/彰化', '送貨到台北/新北', '送貨到台南/高雄', '留下電話由專員報價');
}
elseif (preg_match('/(營業時間|上班|幾點|休息|週末|星期六|星期天|假日|有開|營業)/u', $q)) {
    $reply = "先進您好！法寶實業全台營運處服務時間如下：\n\n"
           . "⏰ **廠區與業務服務時間**：\n"
           . "• **週一 至 週五：08:30 ～ 17:30**\n"
           . "• 週休二日及國定假日廠區發貨休息\n\n"
           . "🌐 **官網 AI 與線上接單系統：24 小時全年無休！**\n"
           . "您在此對話框或詢價單留下的尺寸與電話，值班業務手機將在第一時間收到推播，於上班後秒速為您優先回電報價！";
    $chips = array('直接留下電話排單', '查詢台中廠電話', '返回材料規格諮詢');
}
elseif (preg_match('/(發票|統編|三聯|含稅|未稅|付款|月結|匯款)/u', $q)) {
    $reply = "您好！法寶實業一律開立**正規三聯式統一發票**（可列印統一編號以供進項扣抵）：\n\n"
           . "💳 **交易與付款方式**：\n"
           . "• 新客戶初次配合支援銀行匯款、ATM 轉帳、貨到代收或現場自取點交。\n"
           . "• 長期配合之企業客戶可依交易量申請審核月結（30天/60天期票）。\n\n"
           . "請問您手邊有需要報價的規格或統編資料嗎？留下電話我立刻請業務連繫！";
    $chips = array('我要詢價 6061', '我要詢價 7075', '留下電話由專員報價');
}
elseif (preg_match('/(紅銅|黃銅|青銅|銅棒|銅板|銅材|不鏽鋼|白鐵|304|410|420|430|鎂合金)/u', $q)) {
    $reply = "老闆您好！法寶實業創立於 1986 年，除 3,071 項鋁合金外，廠內長年常備供應：\n\n"
           . "✨ **銅材系列**：\n"
           . "• 純紅銅 (C1100)、黃銅 (C2680/C2801)、高力黃銅、磷青銅\n"
           . "• 提供高導電導熱平片、厚板、圓棒與匯流銅排 (Busbar)\n\n"
           . "✨ **不鏽鋼系列**：\n"
           . "• 常備 AISI 304、410、420、430 工業機械結構板材、捲片與精密研磨圓棒\n\n"
           . "請問您需要的規格尺寸是多少呢？留下電話我立刻為您查庫存報價！";
    $chips = array('詢問紅銅現貨', '詢問 304 不鏽鋼', '留下電話由專員報價');
}
// -------------------------------------------------------------
// Priority 4: Metallurgy, Machining & Surface Properties
// -------------------------------------------------------------
elseif (preg_match('/(翹曲|變形|真平度|平坦度|平整度|應力|預拉伸)/u', $q)) {
    $reply = "老闆/先進您好！針對 CNC 高速切削加工「最怕翹曲變形」的痛點，法寶是全台公認第一首選：\n\n"
           . "✨ **抗變形王牌主力推薦**：\n"
           . "1️⃣ **7075-T651 航太級超硬預拉伸厚板**：內部做過嚴格拉伸消除應力處理，大面積掏空精銑「絕不翹曲變形」，真平度極佳！\n"
           . "2️⃣ **韓國 4N 超平高純鋁板**：超平無應力，半導體晶圓腔體與精密治具專用。\n"
           . "3️⃣ **MIC-6 超精密鑄鋁研磨板**：雙面研磨，真平度公差達 ±0.1mm 以內，完全無內部殘留應力。\n\n"
           . "請問您目前加工的厚度大概是幾 mm？長寬是多少呢？留下電話立刻為您試算！";
    $chips = array('詢問 7075 厚度 20mm', '詢問 7075 厚度 30mm', '查詢 MIC-6 治具板', '直接留下電話報價');
}
elseif (preg_match('/(陽極|硬陽|消光黑|黑陽|染色|表面處理|噴砂|毛絲|拉絲)/u', $q)) {
    $reply = "先進您好！在鋁合金表面處理與陽極氧化方面：\n\n"
           . "✨ **陽極首選材種推薦**：\n"
           . "1️⃣ **6061-T6 / T651**：全台陽極成色最均勻的王牌主力材！金相組織細緻，無論是硬質陽極（Hard Anodizing）、消光黑、霧面本色或彩色陽極，色澤均勻細緻、附著力極佳！\n"
           . "2️⃣ **5052-H32**：耐蝕性極佳，陽極氧化呈優雅霧面銀灰。\n\n"
           . "法寶提供「材料供應 ＋ CNC 精密加工 ＋ 噴砂陽極」一站式代料統包交付，免去材料在不同加工廠搬運碰撞風險！歡迎留下尺寸需求！";
    $chips = array('需要 6061 陽極鋁板', '需要 6061 圓棒', '我想做硬陽處理', '留下電話由專員報價');
}
elseif (preg_match('/(加工|銑床|五軸|龍門|代料|車床|公差)/u', $q)) {
    $reply = "您好！法寶實業不只供應材料，更具備強大的【廠內高階精密加工】能量：\n\n"
           . "🏭 **設備陣容**：\n"
           . "• 航太級五軸同動加工中心機（一次裝夾攻克 3D 複雜曲面與斜孔）\n"
           . "• 大型龍門銑床（超大行程平面精銑與大件銑槽）\n"
           . "• CNC 高速立式銑床與精密數控車床\n"
           . "• 表面處理：硬質陽極、噴砂、精密拋光拉絲\n\n"
           . "我們提供「代料精密加工」一貫化服務，省去材料跨廠搬運的碰撞風險與工時！歡迎留下您的需求細節或圖面！";
    $chips = array('我有圖面想上傳估價', '龍門銑床加工能力', '留下電話由專員報價');
}
elseif (preg_match('/(切|下料|母材|排料|鋸)/u', $q)) {
    $reply = "老闆/先進您好！法寶廠內備有 CM3800 大型重切削裁板機與數控定寸圓棒鋸床：\n\n"
           . "✨ **智慧定寸下料服務**：\n"
           . "• 您可以點擊上方的【🧮 母材裁切最佳化】標籤，直接輸入長度與支數，系統將為您計算「損耗最小、利用率最高」的排切方案！\n"
           . "• 切割公差精密控制在 ±0.2mm 以內，端面平整不毛邊。\n\n"
           . "請問您這次需要裁切的母材規格是什麼？長度與支數多少呢？直接輸入或留下電話，專員立即為您排算！";
    $chips = array('切換到裁切最佳化計算', '詢問 6061 定寸裁切', '留下電話由專員報價');
}
elseif (preg_match('/(擠型|開模|模具|斷面|免開模)/u', $q)) {
    $reply = "您好！在鋁擠型方面，法寶為客戶建置了【全台最大擠型資料庫】：\n\n"
           . "💡 **2,557 項現成模具（免開模費）**：\n"
           . "涵蓋圓管、正方管、長方管、扁條、四方條、六角條、角鋁等標準斷面，直接調料出貨，替您省下數萬元模具費與數週試模時間！\n\n"
           . "🛠️ **特殊斷面客製開模**：\n"
           . "我們工程團隊提供 2D/3D 圖面拆解、開模擠型、切斷、沖孔、陽極表面處理一貫化交付。\n\n"
           . "您可以直接告訴我您需要的斷面尺寸，我立刻幫您在系統中比對免開模規格！";
    $chips = array('檢索免開模鋁管規格', '檢索免開模鋁扁條規格', '我有圖面想評估開模', '留電話由專人接洽');
}
// -------------------------------------------------------------
// Priority 5: Specific Alloy Grades (evaluated on current query $q)
// -------------------------------------------------------------
elseif (strpos($q, '7075') !== false || strpos($q, '超硬') !== false || strpos($q, '航太') !== false) {
    $reply = "老闆/先進您好！【7075 航太級超硬鋁合金】是法寶的王牌主力：\n\n"
           . "✨ **技術特點**：\n"
           . "• 常備 7075-T6 / T651 預拉伸板與厚棒，內部做過消除應力處理，大面積 CNC 高速掏空精銑「絕不翹曲變形」，真平度極佳！\n"
           . "• 抗拉強度高達 540~600 MPa，硬度 150 HB 以上，極耐磨損。\n"
           . "• 庫存尺寸：板料厚度 5mm 至 250mm 均備有現貨，支援微米級雙面銑平與裁切。\n\n"
           . "💡 **貼心引導**：手邊有加工尺寸或 CAD 圖面嗎？歡迎點擊 [即時諮詢與快速估價](https://www.fapolu.com.tw/#contact) 提交，工程師 10 分鐘內為您試算母材排版與正式報價！\n\n"
           . "請問您需要的【厚度】大概是幾 mm？長寬尺寸與數量是多少呢？留下您的電話與大名，我馬上請業務為您排單試算！";
    $chips = array('📋 前往即時諮詢與快速估價', '詢問 7075 厚度 20mm', '查詢台中廠電話', '直接留下電話報價');
}
elseif (strpos($q, '6061') !== false || strpos($q, '結構鋁') !== false) {
    $reply = "先進您好！【6061-T6 / T651 結構鋁合金】是全台流通量最大的主力材：\n\n"
           . "✨ **專業特點**：\n"
           . "• 耐蝕性極佳，切削排屑流暢，陽極氧化著色（硬陽、本色、消光黑）成色非常均勻細緻。\n"
           . "• 廠內備有 CM3800 大型重切削裁板機與數控圓棒鋸床，現貨在庫最齊全。\n"
           . "• 支援板材精密洗平、倒角與 CNC 銑床連工帶料一條龍服務。\n\n"
           . "💡 **貼心引導**：您可以直接點擊 [即時諮詢與快速估價](https://www.fapolu.com.tw/#contact) 帶入規格清單，專責工程師極速出具正式報價單！\n\n"
           . "請問您需要的是【鋁板】還是【圓棒/扁條】？送貨地點在哪個縣市呢？留下電話我立刻請業務連繫！";
    $chips = array('📋 前往即時諮詢與快速估價', '需要 6061 鋁板', '需要 6061 圓棒', '留下電話由專員報價');
}
elseif (strpos($q, '5083') !== false || strpos($q, '耐海水') !== false || strpos($q, '船用') !== false || strpos($q, '耐蝕') !== false) {
    $reply = "您好！【5083-H112 / H321 防鏽耐蝕鋁板】：\n\n"
           . "✨ **核心優勢**：\n"
           . "• 非熱處理合金中強度最高，極具耐海水腐蝕與耐化學藥液特性，且焊道強度保留率業界第一！\n"
           . "• 常備用於半導體設備洗滌塔、造船甲板、真空腔體與低溫壓力容器。\n"
           . "• 出貨均可隨附原廠進口材質證明書 (Mill Sheet)。\n\n"
           . "💡 歡迎點擊 [即時諮詢與快速估價](https://www.fapolu.com.tw/#contact) 上傳規格，業務工程師迅速回報！\n\n"
           . "請問您需要的長寬尺寸是多少？需要我們協助鋸切嗎？留下電話我立刻為您查庫存！";
    $chips = array('📋 前往即時諮詢與快速估價', '5083 庫存規格有哪些', '需要原廠材質證明', '留下電話由專員報價');
}
elseif (strpos($q, '花紋') !== false || strpos($q, '防滑') !== false || strpos($q, '車斗') !== false || strpos($q, '卡車') !== false || strpos($q, '踏板') !== false) {
    $reply = "老闆您好！【卡車車斗／防滑踏板專用鋁花紋板】法寶常備現貨最齊全：\n\n"
           . "✨ **規格重點**：\n"
           . "• 牌號：5052-H114 / 3003 高韌性五條筋 (Five Bar) 花紋防滑板。\n"
           . "• 優勢：高防滑係數、耐磨耗、抗路鹽水腐蝕、可耐折彎 90 度不龜裂，比傳統黑鐵花紋板輕 65%！\n"
           . "• 常備厚度：2.0mm、3.0mm、4.5mm、6.0mm (規格 4x8 尺、4x10 尺、5x10 尺現貨供應)。\n\n"
           . "💡 歡迎點擊 [即時諮詢與快速估價](https://www.fapolu.com.tw/#contact) 提交裁切片數，我們專車直配！\n\n"
           . "請問車斗大概需要幾片？長寬是多少呢？留下電話我立刻為您查庫存與報最殺優惠價！";
    $chips = array('📋 前往即時諮詢與快速估價', '花紋板 3.0mm 現貨', '直接留下電話報價', '查詢台中廠電話');
}
elseif (strpos($q, 'mic-6') !== false || strpos($q, 'mic6') !== false || strpos($q, '治具') !== false || strpos($q, '鑄鋁') !== false) {
    $reply = "先進您好！【MIC-6 超精密鑄造研磨鋁板】：\n\n"
           . "✨ **治具專用特性**：\n"
           . "• 雙面高精度研磨，真平度公差達 ±0.1mm 以內，完全無內部殘留應力，高速銑削絕不翹曲！\n"
           . "• 表面粗糙度達 Ra 0.4µm (16µ in)，半導體測試治具、電子檢測治具首選。\n\n"
           . "💡 歡迎點擊 [即時諮詢與快速估價](https://www.fapolu.com.tw/#contact) 提交尺寸圖面！\n\n"
           . "請問需要的厚度與長寬是多少呢？留下電話立刻為您試算！";
    $chips = array('📋 前往即時諮詢與快速估價', 'MIC-6 厚度 15mm', '直接留下電話報價');
}
// -------------------------------------------------------------
// Priority 6: Fallback Default (smart domain introduction & LINE handover)
// -------------------------------------------------------------
else {
    $reply = "老闆/先進您好！歡迎洽詢法寶實業。🤝\n\n"
           . "我是您的線上業務工程特助。此需求若較為特殊、需開模或專案評估，法寶業務工程師團隊隨時為您服務！\n\n"
           . "1️⃣ **6061、7075、5083、2024 現貨板棒精密裁切**\n"
           . "2️⃣ **2,557 項免開模鋁擠型斷面現貨在庫**\n"
           . "3️⃣ **CNC 五軸、大型龍門銑床代料加工與陽極處理**\n\n"
           . "👉 **想直接與真人業務工程師討論或傳圖？**\n請點擊下方 **【🟢 開啟 LINE 官方帳號對談】**，我們同仁將在 LINE 上即時為您服務！\n\n"
           . "👉 或直接在下方輸入您的 **聯絡電話**，專員將於 5 分鐘內為您去電說明！";
    $chips = array('🟢 開啟 LINE 官方帳號對談', '📞 留下電話由專員報價', '詢問 7075 超硬鋁板', '詢問 6061 精密鋁材');
    $line_transfer = true;
}

echo json_encode(array(
    'success' => true,
    'reply' => $reply,
    'specs' => $matched_specs,
    'chips' => $chips,
    'ticket_id' => $ticket_id,
    'detected_name' => $display_name,
    'detected_phone' => $detected_phone,
    'is_lead_captured' => $is_lead_captured,
    'line_transfer' => !empty($line_transfer),
    'line_oa_url' => 'https://line.me/R/ti/p/@602jdoua'
), JSON_UNESCAPED_UNICODE);
