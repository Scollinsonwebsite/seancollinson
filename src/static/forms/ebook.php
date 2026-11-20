<?php
/**
 * E-book opt-in handler (/think-like-a-hostage-negotiator/).
 * Adds the visitor to the MailerLite group named in config.php ['ebook']['group']
 * (created if missing), mapping First name to the subscriber "name" field.
 * The e-book is delivered by email: the MailerLite account uses double opt-in,
 * and an automation on the group sends the download link once the visitor
 * confirms. The PDF link is never returned to the browser.
 * The MailerLite API key ('ebook' => api_key, else 'mailerlite' => api_key) is read
 * from config.local.php on the server and never sent to the browser.
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
$ebook = is_array($config) ? ($config['ebook'] ?? []) : [];
// The e-book list can live in its own MailerLite account: ['ebook']['api_key'] (config.local.php) wins.
$key = (string)($ebook['api_key'] ?? '');
if ($key === '' && is_array($config)) { $key = (string)($config['mailerlite']['api_key'] ?? ''); }
$groupName = (string)($ebook['group'] ?? '');
if ($key === '' || $groupName === '' || !function_exists('curl_init')) {
    respond(503, ['ok' => false, 'message' => 'The e-book download is not available yet. Please check back soon.']);
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
    respond(200, ['ok' => true]); // bots: pretend success, store nothing
}

$started = (int)($_POST['_t'] ?? 0);
if ($started <= 0 || (time() - $started) < 2) {
    respond(400, ['ok' => false, 'message' => 'Please take a moment to review the form, then send it again.']);
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/sc_ebook_' . hash('sha256', $ip . ($config['salt'] ?? 'sc'));
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $hits = array_filter(array_map('intval', explode(',', (string)file_get_contents($rateFile))), fn($t) => $t > $now - 3600);
}
if (count($hits) >= 8) {
    respond(429, ['ok' => false, 'message' => 'Too many requests from this connection. Please try again later.']);
}

$clean = fn($v): string => trim((string)preg_replace('/\p{C}/u', '', is_string($v) ? $v : ''));
$first = $clean($_POST['first_name'] ?? '');
$email = $clean($_POST['email'] ?? '');
$errors = [];
if ($first === '') { $errors['first_name'] = 'First name is required.'; }
elseif (mb_strlen($first) > 80) { $errors['first_name'] = 'First name must be 80 characters or fewer.'; }
if ($email === '') { $errors['email'] = 'Email address is required.'; }
elseif (mb_strlen($email) > 160 || !filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors['email'] = 'Enter a valid email address.'; }
if ($errors) {
    respond(422, ['ok' => false, 'message' => 'Please correct the highlighted fields and try again.', 'errors' => $errors]);
}

$call = function (string $method, string $path, ?array $body = null) use ($key): array {
    $ch = curl_init('https://connect.mailerlite.com/api' . $path);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key, 'Accept: application/json', 'Content-Type: application/json'],
    ]);
    if ($body !== null) { curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_UNICODE)); }
    $out = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    return [$code, is_string($out) ? (json_decode($out, true) ?: []) : []];
};

// Find the group by exact name (cached for a day); create it if it does not exist.
$cache = sys_get_temp_dir() . '/sc_ml_ebook_group_' . hash('sha256', $key . $groupName);
$groupId = is_file($cache) && filemtime($cache) > time() - 86400 ? trim((string)file_get_contents($cache)) : '';
if ($groupId === '') {
    [$code, $res] = $call('GET', '/groups?limit=100&filter[name]=' . rawurlencode($groupName));
    foreach (($res['data'] ?? []) as $g) {
        if (isset($g['id'], $g['name']) && strcasecmp(trim((string)$g['name']), $groupName) === 0) { $groupId = (string)$g['id']; break; }
    }
    if ($groupId === '') {
        [$code, $res] = $call('POST', '/groups', ['name' => $groupName]);
        $groupId = (string)($res['data']['id'] ?? '');
    }
    if ($groupId !== '') { @file_put_contents($cache, $groupId, LOCK_EX); }
}

[$code] = $groupId !== ''
    ? $call('POST', '/subscribers', ['email' => $email, 'fields' => ['name' => $first], 'groups' => [$groupId]])
    : [0];
$hits[] = $now;
@file_put_contents($rateFile, implode(',', $hits), LOCK_EX);
if ($code < 200 || $code >= 300) {
    // The e-book only arrives by email, so tell the visitor rather than pretend.
    @file_put_contents(sys_get_temp_dir() . '/sc_ebook_errors.log', gmdate('c') . " mailerlite http $code\n", FILE_APPEND | LOCK_EX);
    respond(502, ['ok' => false, 'message' => 'We could not sign you up just now. Please try again in a few minutes.']);
}
respond(200, ['ok' => true]);
