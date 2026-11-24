<?php
/**
 * Ask Sean handler (/ask-sean/).
 * 1. Emails the full submission to the office inbox (config 'recipient', set in
 *    config.local.php on the server; never shown on the site).
 * 2. Adds first name and email ONLY to the MailerLite group "Ask Sean" in the
 *    same account as the e-book and newsletter lists. The situation text is
 *    never sent to MailerLite.
 * Protections: same-origin check, hidden honeypot, minimum fill time,
 * per-connection submission limit. No CAPTCHA.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$config = @include __DIR__ . '/config.php';
if (!is_array($config) || empty($config['enabled']) || !filter_var((string)($config['recipient'] ?? ''), FILTER_VALIDATE_EMAIL)) {
    respond(503, ['ok' => false, 'message' => 'This form is not accepting submissions yet. Please check back soon.']);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'message' => 'Method not allowed.']);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    if (!$originHost || strcasecmp($originHost, preg_replace('/:\d+$/', '', $host)) !== 0) {
        respond(403, ['ok' => false, 'message' => 'This request could not be accepted.']);
    }
}

if (!empty($_POST['company_website'])) {
    respond(200, ['ok' => true]); // bots: pretend success, send nothing
}

$started = (int)($_POST['_t'] ?? 0);
if ($started <= 0 || (time() - $started) < 3) {
    respond(400, ['ok' => false, 'message' => 'Please take a moment to review the form, then send it again.']);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/sc_ask_' . hash('sha256', $ip . ($config['salt'] ?? 'sc'));
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $hits = array_filter(array_map('intval', explode(',', (string)file_get_contents($rateFile))), fn($t) => $t > $now - 3600);
}
if (count($hits) >= 5) {
    respond(429, ['ok' => false, 'message' => 'Too many requests from this connection. Please try again later.']);
}

$stages = ['Divorce in progress', 'Custody or co-parenting', 'Child support or money', 'Just separated, figuring it out', 'Other family conflict'];
$clean = fn($v, bool $multiline = false): string => trim((string)preg_replace($multiline ? '/[^\P{C}\n\t]/u' : '/\p{C}/u', '', is_string($v) ? str_replace("\r\n", "\n", $v) : ''));
$first = $clean($_POST['first_name'] ?? '');
$email = $clean($_POST['email'] ?? '');
$stage = $clean($_POST['stage'] ?? '');
$situation = $clean($_POST['situation'] ?? '', true);
$question = $clean($_POST['question'] ?? '');
$consent = ($_POST['consent'] ?? '') === 'yes';

$errors = [];
if ($first === '') { $errors['first_name'] = 'Enter a first name or a nickname.'; }
elseif (mb_strlen($first) > 80) { $errors['first_name'] = 'Keep this to 80 characters or fewer.'; }
if ($email === '') { $errors['email'] = 'Email address is required.'; }
elseif (mb_strlen($email) > 160 || !filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors['email'] = 'Enter a valid email address.'; }
if (!in_array($stage, $stages, true)) { $errors['stage'] = 'Choose where you are in it.'; }
if ($situation === '') { $errors['situation'] = 'Tell Sean the situation in a few lines.'; }
elseif (mb_strlen($situation) > 4000) { $errors['situation'] = 'Please keep this to 4,000 characters or fewer.'; }
if (mb_strlen($question) > 300) { $errors['question'] = 'Please keep this to 300 characters or fewer.'; }
if (!$consent) { $errors['consent'] = 'Please confirm you understand how Ask Sean works.'; }
if ($errors) {
    respond(422, ['ok' => false, 'message' => 'Please correct the highlighted fields and try again.', 'errors' => $errors]);
}

// 1. Email the office. Visitor input never goes into headers except a validated Reply-To.
$subject = '[' . ($config['site_name'] ?? 'Website') . '] Ask Sean: ' . $stage;
$body = implode("\n", [
    'First name or nickname:', $first, '',
    'Email address:', $email, '',
    'Where are you in it?', $stage, '',
    'Your situation:', $situation, '',
    'The one thing they want Sean\'s read on:', $question !== '' ? $question : '(not provided)', '',
    'Consent to blended, general answers on the show, newsletter, or community: confirmed',
    'Submitted: ' . gmdate('Y-m-d H:i') . ' UTC',
]);
$from = (string)($config['from'] ?? $config['recipient']);
$headers = [
    'From: ' . str_replace(["\r", "\n"], '', $from),
    'Reply-To: ' . str_replace(["\r", "\n"], '', $email),
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: SC-Forms',
];
$sent = @mail((string)$config['recipient'], '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));
$hits[] = $now;
@file_put_contents($rateFile, implode(',', $hits), LOCK_EX);
if (!$sent) {
    respond(502, ['ok' => false, 'message' => 'Your situation could not be sent right now. Please try again in a few minutes.']);
}

// 2. MailerLite: first name and email only, group "Ask Sean". Failure here never blocks the visitor.
$key = (string)($config['ebook']['api_key'] ?? '');
$groupName = (string)($config['ask']['group'] ?? 'Ask Sean');
if ($key !== '' && function_exists('curl_init')) {
    $call = function (string $method, string $path, ?array $payload = null) use ($key): array {
        $ch = curl_init('https://connect.mailerlite.com/api' . $path);
        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key, 'Accept: application/json', 'Content-Type: application/json'],
        ]);
        if ($payload !== null) { curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE)); }
        $out = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
        return [$code, is_string($out) ? (json_decode($out, true) ?: []) : []];
    };
    $cache = sys_get_temp_dir() . '/sc_ml_optin_group_' . hash('sha256', $key . $groupName);
    $groupId = is_file($cache) && filemtime($cache) > time() - 86400 ? trim((string)file_get_contents($cache)) : '';
    if ($groupId === '') {
        [, $res] = $call('GET', '/groups?limit=100&filter[name]=' . rawurlencode($groupName));
        foreach (($res['data'] ?? []) as $g) {
            if (isset($g['id'], $g['name']) && strcasecmp(trim((string)$g['name']), $groupName) === 0) { $groupId = (string)$g['id']; break; }
        }
        if ($groupId === '') {
            [, $res] = $call('POST', '/groups', ['name' => $groupName]);
            $groupId = (string)($res['data']['id'] ?? '');
        }
        if ($groupId !== '') { @file_put_contents($cache, $groupId, LOCK_EX); }
    }
    if ($groupId !== '') {
        [$code] = $call('POST', '/subscribers', ['email' => $email, 'fields' => ['name' => $first], 'groups' => [$groupId]]);
        if ($code < 200 || $code >= 300) {
            @file_put_contents(sys_get_temp_dir() . '/sc_ask_errors.log', gmdate('c') . " mailerlite http $code\n", FILE_APPEND | LOCK_EX);
        }
    }
}

respond(200, ['ok' => true]);
