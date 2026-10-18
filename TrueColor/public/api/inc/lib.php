<?php
declare(strict_types=1);

function cfg(): array
{
    static $c = null;
    if ($c !== null) {
        return $c;
    }
    $file = __DIR__ . '/config.php';
    $c = is_file($file) ? require $file : require __DIR__ . '/config.sample.php';
    // Environment overrides for local development and tests.
    if (getenv('TC_DSN')) {
        $c['dsn'] = getenv('TC_DSN');
        $c['user'] = getenv('TC_USER') ?: null;
        $c['pass'] = getenv('TC_PASS') ?: null;
    }
    return $c;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }
    $c = cfg();
    $pdo = new PDO($c['dsn'], $c['user'] ?? null, $c['pass'] ?? null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    if (str_starts_with($c['dsn'], 'sqlite:')) {
        $schema = __DIR__ . '/../../../db/schema.sql';
        if (is_file($schema)) {
            $pdo->exec((string) file_get_contents($schema));
        }
    }
    return $pdo;
}

function questions(): array
{
    static $q = null;
    if ($q === null) {
        $q = json_decode((string) file_get_contents(__DIR__ . '/questions.json'), true, 512, JSON_THROW_ON_ERROR);
    }
    return $q;
}

function respond(array $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(string $message, int $status = 400): never
{
    respond(['error' => $message], $status);
}

function json_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw === false ? '' : $raw, true);
    if (!is_array($data)) {
        fail('Invalid request body.');
    }
    return $data;
}

function new_token(): string
{
    return bin2hex(random_bytes(16));
}

function hash_secret(string $secret): string
{
    return hash('sha256', $secret);
}

function clean_name(mixed $name): string
{
    $name = is_string($name) ? trim(strip_tags($name)) : '';
    $name = preg_replace('/\s+/u', ' ', $name) ?? '';
    return mb_substr($name, 0, 40);
}

function is_token(mixed $v): bool
{
    return is_string($v) && preg_match('/^[a-f0-9]{32}$/', $v) === 1;
}

function rate_limit(): void
{
    $ip = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . '|truecolor');
    $now = time();
    $pdo = db();
    $pdo->prepare('DELETE FROM rate_limits WHERE created_at < ?')->execute([$now - 3600]);
    $st = $pdo->prepare('SELECT COUNT(*) AS n FROM rate_limits WHERE ip_hash = ?');
    $st->execute([$ip]);
    if ((int) $st->fetch()['n'] >= (int) cfg()['rate_limit_per_hour']) {
        fail('Too many requests. Please try again later.', 429);
    }
    $pdo->prepare('INSERT INTO rate_limits (ip_hash, created_at) VALUES (?, ?)')->execute([$ip, $now]);
}
