<?php
/**
 * Form handler for the Mediation Office of S. Collinson website.
 * Runs on standard Bluehost shared hosting (PHP 8+). No database required.
 *
 * Protection: POST only, same-origin check, honeypot field, minimum fill
 * time, per-IP rate limit, strict field allow-lists, length limits, header
 * injection prevention, and plain-text email only.
 *
 * Configure forms/config.php before enabling the forms in src/config.mjs.
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

/**
 * Adds the sender to a MailerLite group. Sends only name, email and phone:
 * case details never leave this server. Failures are ignored on purpose so
 * the request email (the primary delivery) is never affected.
 */
function mailerlite_subscribe(array $config, string $type, array $clean): void {
    $ml = $config['mailerlite'] ?? [];
    $key = (string)($ml['api_key'] ?? '');
    $groupName = (string)($ml['groups'][$type] ?? '');
    if ($key === '' || !function_exists('curl_init') || empty($clean['email'])) { return; }

    $call = function (string $method, string $path, ?array $body = null) use ($key): ?array {
        $ch = curl_init('https://connect.mailerlite.com/api' . $path);
        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 3,
            CURLOPT_TIMEOUT => 5,
            CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key, 'Accept: application/json', 'Content-Type: application/json'],
        ]);
        if ($body !== null) { curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_UNICODE)); }
        $out = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
        $data = is_string($out) ? json_decode($out, true) : null;
        return ($code >= 200 && $code < 300 && is_array($data)) ? $data : null;
    };

    // Find the group id by name (case, spacing and a trailing "s" are ignored), cached for a day.
    $norm = fn(string $v): string => preg_replace('/s$/', '', preg_replace('/[^a-z0-9]/', '', strtolower($v)));
    $cache = sys_get_temp_dir() . '/sc_ml_groups_' . hash('sha256', $key);
    $map = [];
    if (is_file($cache) && filemtime($cache) > time() - 86400) {
        $map = json_decode((string)file_get_contents($cache), true) ?: [];
    }
    $want = $norm($groupName);
    $groupId = $want !== '' ? ($map[$want] ?? null) : null;
    if ($want !== '' && $groupId === null) {
        $res = $call('GET', '/groups?limit=100');
        foreach (($res['data'] ?? []) as $g) {
            if (isset($g['id'], $g['name'])) { $map[$norm((string)$g['name'])] = (string)$g['id']; }
        }
        if ($map) { @file_put_contents($cache, json_encode($map), LOCK_EX); }
        $groupId = $map[$want] ?? null;
    }

    $first = $clean['first_name'] ?? '';
    $last = '';
    if ($first === '' && !empty($clean['name'])) {
        $parts = preg_split('/\s+/', trim($clean['name']), 2);
        $first = $parts[0] ?? '';
        $last = $parts[1] ?? '';
    }
    $fields = array_filter(['name' => $first, 'last_name' => $last, 'phone' => $clean['phone'] ?? ''], fn($v) => $v !== '');
    $payload = ['email' => $clean['email']];
    if ($fields) { $payload['fields'] = $fields; }
    if ($groupId !== null) { $payload['groups'] = [$groupId]; }
    $call('POST', '/subscribers', $payload);
}

$config = @include __DIR__ . '/config.php';
if (!is_array($config) || empty($config['enabled']) || empty($config['recipient'])
    || !filter_var($config['recipient'], FILTER_VALIDATE_EMAIL)) {
    respond(503, ['ok' => false, 'message' => 'Online forms are not accepting submissions yet. Please check back soon.']);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'message' => 'Method not allowed.']);
}

// Same-origin check (browsers send Origin on POST fetch requests).
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    if (!$originHost || strcasecmp($originHost, preg_replace('/:\d+$/', '', $host)) !== 0) {
        respond(403, ['ok' => false, 'message' => 'This request could not be accepted.']);
    }
}

// Honeypot: real visitors never see or fill this field.
if (!empty($_POST['company_website'])) {
    respond(200, ['ok' => true]); // pretend success to bots, send nothing
}

// Minimum time between page load and submission.
$started = (int)($_POST['_t'] ?? 0);
if ($started <= 0 || (time() - $started) < 3) {
    respond(400, ['ok' => false, 'message' => 'Please take a moment to review the form, then send it again.']);
}

// Rate limit: 5 submissions per IP per hour.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/sc_forms_' . hash('sha256', $ip . ($config['salt'] ?? 'sc'));
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $hits = array_filter(array_map('intval', explode(',', (string)file_get_contents($rateFile))), fn($t) => $t > $now - 3600);
}
if (count($hits) >= 5) {
    respond(429, ['ok' => false, 'message' => 'Too many messages have been sent from this connection. Please try again later.']);
}

// Field allow-lists per form: name => [label, required, max length, type]
$schemas = [
    'consultation' => [
        'name' => ['Full name', true, 120, 'text'],
        'email' => ['Email', true, 160, 'email'],
        'phone' => ['Phone', false, 40, 'tel'],
        'contact_method' => ['Preferred contact method', true, 20, 'choice:Email|Phone'],
        'dispute_type' => ['Type of dispute', true, 80, 'text'],
        'other_party' => ['Other party’s name', true, 160, 'text'],
        'case_number' => ['Court case number', false, 60, 'text'],
        'session_format' => ['Preferred session format', true, 60, 'text'],
        'availability' => ['General availability', false, 200, 'text'],
        'summary' => ['Brief summary', true, 1500, 'textarea'],
        'consent' => ['Consent', true, 3, 'choice:yes'],
    ],
    'quick' => [
        'first_name' => ['First name', true, 80, 'text'],
        'phone' => ['Phone', true, 40, 'tel'],
        'email' => ['Email', true, 160, 'email'],
    ],
    'contact' => [
        'name' => ['Name', true, 120, 'text'],
        'email' => ['Email', true, 160, 'email'],
        'phone' => ['Phone', false, 40, 'tel'],
        'reason' => ['Reason for contacting', true, 80, 'text'],
        'contact_method' => ['Preferred contact method', true, 20, 'choice:Email|Phone'],
        'message' => ['Message', true, 1500, 'textarea'],
        'consent' => ['Consent', true, 3, 'choice:yes'],
    ],
    'masterclass' => [
        'name' => ['Full name', true, 120, 'text'],
        'email' => ['Email', true, 160, 'email'],
        'organization' => ['Organization', false, 160, 'text'],
        'phone' => ['Phone', false, 40, 'tel'],
        'format' => ['Format of interest', true, 60, 'text'],
        'group_size' => ['Approximate group size', false, 40, 'text'],
        'message' => ['Training needs', true, 1500, 'textarea'],
        'consent' => ['Consent', true, 3, 'choice:yes'],
    ],
];

$type = (string)($_POST['form_type'] ?? '');
if (!isset($schemas[$type])) {
    respond(400, ['ok' => false, 'message' => 'Unknown form.']);
}

$clean = [];
$errors = [];
foreach ($schemas[$type] as $field => [$label, $required, $max, $kind]) {
    $raw = $_POST[$field] ?? '';
    if (!is_string($raw)) { $raw = ''; }
    // Normalise: strip control characters (keep newlines only in textareas).
    $value = $kind === 'textarea'
        ? preg_replace('/[^\P{C}\n]/u', '', str_replace("\r\n", "\n", $raw))
        : preg_replace('/\p{C}/u', '', $raw);
    $value = trim((string)$value);

    if ($required && $value === '') { $errors[$field] = "$label is required."; continue; }
    if ($value === '') { $clean[$field] = ''; continue; }
    if (mb_strlen($value) > $max) { $errors[$field] = "$label must be $max characters or fewer."; continue; }
    if ($kind === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) { $errors[$field] = 'Enter a valid email address.'; continue; }
    if ($kind === 'tel' && !preg_match('/^[0-9+().\-\s]{7,40}$/', $value)) { $errors[$field] = 'Enter a valid phone number.'; continue; }
    if (str_starts_with($kind, 'choice:') && !in_array($value, explode('|', substr($kind, 7)), true)) { $errors[$field] = "Choose a valid option for $label."; continue; }
    $clean[$field] = $value;
}

if ($errors) {
    respond(422, ['ok' => false, 'message' => 'Please correct the highlighted fields and try again.', 'errors' => $errors]);
}

// Build a plain-text email. Visitor input never goes into headers except a
// validated Reply-To address.
$subjects = [
    'consultation' => 'Consultation request',
    'quick' => 'Quick consultation request',
    'contact' => 'Website message',
    'masterclass' => 'Masterclass inquiry',
];
$subject = '[' . ($config['site_name'] ?? 'Website') . '] ' . $subjects[$type];
$lines = [];
foreach ($schemas[$type] as $field => [$label]) {
    if ($field === 'consent') { $lines[] = "$label: confirmed"; continue; }
    $lines[] = $label . ":\n" . ($clean[$field] !== '' ? $clean[$field] : '(not provided)') . "\n";
}
$lines[] = 'Submitted: ' . gmdate('Y-m-d H:i') . ' UTC';
$body = implode("\n", $lines);

$from = $config['from'] ?? $config['recipient'];
$headers = [
    'From: ' . str_replace(["\r", "\n"], '', $from),
    'Reply-To: ' . str_replace(["\r", "\n"], '', $clean['email']),
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: SC-Forms',
];

$sent = @mail($config['recipient'], '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));
if (!$sent) {
    respond(502, ['ok' => false, 'message' => 'Your message could not be delivered right now. Please try again later.']);
}

mailerlite_subscribe($config, $type, $clean);

$hits[] = $now;
@file_put_contents($rateFile, implode(',', $hits), LOCK_EX);
respond(200, ['ok' => true]);
