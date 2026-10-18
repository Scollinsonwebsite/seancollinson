<?php
declare(strict_types=1);

require __DIR__ . '/inc/lib.php';
require __DIR__ . '/inc/scoring.php';

header('X-Frame-Options: DENY');

$action = $_GET['a'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    match (true) {
        $action === 'questions' && $method === 'GET' => action_questions(),
        $action === 'invite' && $method === 'GET' => action_invite(),
        $action === 'state' && $method === 'GET' => action_state(),
        $action === 'create' && $method === 'POST' => action_create(),
        $action === 'join' && $method === 'POST' => action_join(),
        $action === 'submit' && $method === 'POST' => action_submit(),
        default => fail('Not found.', 404),
    };
} catch (PDOException $e) {
    error_log('truecolor db error: ' . $e->getMessage());
    fail('Something went wrong on our side. Please try again.', 500);
}

function action_questions(): never
{
    $q = questions();
    $stage = $_GET['stage'] ?? '';
    $strip = fn (array $list) => array_map(
        fn ($item) => ['q' => $item['q'], 'o' => array_map(fn ($o) => ['c' => $o['c'], 't' => $o['t']], $item['o'])],
        $list
    );
    match ($stage) {
        'quiz1' => respond(['questions' => $strip($q['quiz1'])]),
        'quiz2' => respond(['questions' => $strip($q['quiz2'])]),
        'portal' => respond(['questions' => array_map(fn ($i) => ['t' => $i['t']], $q['portal']), 'count' => count($q['portal'])]),
        default => fail('Unknown stage.'),
    };
}

function find_participant(string $secret): array
{
    if (!is_token($secret)) {
        fail('Link not recognised.', 404);
    }
    $st = db()->prepare('SELECT * FROM participants WHERE secret_hash = ?');
    $st->execute([hash_secret($secret)]);
    $p = $st->fetch();
    if (!$p) {
        fail('Link not recognised.', 404);
    }
    return $p;
}

function get_session_row(string $id): array
{
    $st = db()->prepare('SELECT * FROM sessions WHERE id = ?');
    $st->execute([$id]);
    return $st->fetch();
}

function partner_of(array $p): ?array
{
    $st = db()->prepare('SELECT * FROM participants WHERE session_id = ? AND role <> ?');
    $st->execute([$p['session_id'], $p['role']]);
    return $st->fetch() ?: null;
}

function action_invite(): never
{
    $token = $_GET['token'] ?? '';
    if (!is_token($token)) {
        fail('Invitation not found.', 404);
    }
    $st = db()->prepare('SELECT * FROM sessions WHERE invite_token = ?');
    $st->execute([$token]);
    $s = $st->fetch();
    if (!$s) {
        fail('Invitation not found.', 404);
    }
    $a = db()->prepare('SELECT * FROM participants WHERE session_id = ? AND role = ?');
    $a->execute([$s['id'], 'A']);
    $a = $a->fetch();
    $b = db()->prepare('SELECT COUNT(*) AS n FROM participants WHERE session_id = ? AND role = ?');
    $b->execute([$s['id'], 'B']);
    respond([
        'inviter' => $a['name'] !== '' ? $a['name'] : 'Someone',
        'ready' => $a['quiz_answers'] !== null,
        'taken' => (int) $b->fetch()['n'] > 0,
    ]);
}

function action_create(): never
{
    $body = json_body();
    rate_limit();
    $pdo = db();
    $sid = new_token();
    $invite = new_token();
    $secret = new_token();
    $now = time();
    $pdo->beginTransaction();
    $pdo->prepare('INSERT INTO sessions (id, invite_token, created_at) VALUES (?, ?, ?)')->execute([$sid, $invite, $now]);
    $pdo->prepare('INSERT INTO participants (id, session_id, role, secret_hash, name, created_at) VALUES (?, ?, ?, ?, ?, ?)')
        ->execute([new_token(), $sid, 'A', hash_secret($secret), clean_name($body['name'] ?? ''), $now]);
    $pdo->commit();
    respond(['secret' => $secret]);
}

function action_join(): never
{
    $body = json_body();
    $token = $body['invite'] ?? '';
    if (!is_token($token)) {
        fail('Invitation not found.', 404);
    }
    rate_limit();
    $pdo = db();
    $st = $pdo->prepare('SELECT * FROM sessions WHERE invite_token = ?');
    $st->execute([$token]);
    $s = $st->fetch();
    if (!$s) {
        fail('Invitation not found.', 404);
    }
    $a = $pdo->prepare('SELECT quiz_answers FROM participants WHERE session_id = ? AND role = ?');
    $a->execute([$s['id'], 'A']);
    if ($a->fetch()['quiz_answers'] === null) {
        fail('This invitation is not ready yet. Ask the sender to finish their first quiz.', 409);
    }
    $secret = new_token();
    try {
        $pdo->prepare('INSERT INTO participants (id, session_id, role, secret_hash, name, created_at) VALUES (?, ?, ?, ?, ?, ?)')
            ->execute([new_token(), $s['id'], 'B', hash_secret($secret), clean_name($body['name'] ?? ''), time()]);
    } catch (PDOException $e) {
        // UNIQUE (session_id, role): someone already accepted this invitation.
        fail('This invitation has already been used.', 409);
    }
    respond(['secret' => $secret]);
}

function action_submit(): never
{
    $body = json_body();
    $p = find_participant((string) ($body['secret'] ?? ''));
    $stage = $body['stage'] ?? '';
    $answers = $body['answers'] ?? null;
    if (!is_array($answers)) {
        fail('Missing answers.');
    }
    $q = questions();
    $pdo = db();
    $session = get_session_row($p['session_id']);

    if ($stage === 'quiz') {
        if ($p['quiz_answers'] !== null) {
            fail('Already submitted.', 409);
        }
        $bank = $p['role'] === 'A' ? $q['quiz1'] : $q['quiz2'];
        if (!valid_quiz_answers($answers, count($bank))) {
            fail('Please answer every question.');
        }
        $profile = color_profile($answers);
        $pdo->prepare('UPDATE participants SET quiz_answers = ?, profile = ? WHERE id = ?')
            ->execute([json_encode($answers), json_encode($profile), $p['id']]);
        if ($p['role'] === 'B') {
            $a = partner_of($p);
            $score = pair_match(json_decode($a['profile'], true), $profile);
            $pass = $score >= (int) cfg()['match_threshold'] ? 1 : 0;
            $pdo->prepare('UPDATE sessions SET match_score = ?, passed = ? WHERE id = ? AND passed IS NULL')
                ->execute([$score, $pass, $session['id']]);
        }
    } elseif ($stage === 'portal') {
        if ($p['quiz_answers'] === null || (int) $session['passed'] !== 1) {
            fail('The portal is not open for you yet.', 403);
        }
        if ($p['portal_answers'] !== null) {
            fail('Already submitted.', 409);
        }
        if (!valid_portal_answers($answers, count($q['portal']))) {
            fail('Please answer every statement.');
        }
        $pdo->prepare('UPDATE participants SET portal_answers = ? WHERE id = ?')->execute([json_encode($answers), $p['id']]);
        finalize_if_ready($p['session_id']);
    } else {
        fail('Unknown stage.');
    }
    respond(build_state($p['id']));
}

function finalize_if_ready(string $sessionId): void
{
    $pdo = db();
    $st = $pdo->prepare('SELECT * FROM participants WHERE session_id = ?');
    $st->execute([$sessionId]);
    $rows = [];
    foreach ($st->fetchAll() as $r) {
        $rows[$r['role']] = $r;
    }
    if (!isset($rows['A'], $rows['B']) || $rows['A']['portal_answers'] === null || $rows['B']['portal_answers'] === null) {
        return;
    }
    $q = questions();
    $s = get_session_row($sessionId);
    $result = portal_result(
        json_decode($rows['A']['portal_answers'], true),
        json_decode($rows['B']['portal_answers'], true),
        $q['portal'],
        $q['scales'],
        (int) $s['match_score'],
        (float) cfg()['portal_weight']
    );
    $result['band'] = band($result['final']);
    $pdo->prepare('UPDATE sessions SET final_score = ?, final_json = ? WHERE id = ? AND final_score IS NULL')
        ->execute([$result['final'], json_encode($result), $sessionId]);
}

function action_state(): never
{
    $p = find_participant((string) ($_GET['secret'] ?? ''));
    respond(build_state($p['id']));
}

function build_state(string $participantId): array
{
    $st = db()->prepare('SELECT * FROM participants WHERE id = ?');
    $st->execute([$participantId]);
    $p = $st->fetch();
    $s = get_session_row($p['session_id']);
    $partner = partner_of($p);
    $mine = $p['role'] === 'A';

    $stage = match (true) {
        $p['quiz_answers'] === null => 'quiz',
        $mine && ($partner === null || $partner['quiz_answers'] === null) => 'waiting_partner',
        $s['passed'] !== null && (int) $s['passed'] === 0 => 'not_matched',
        $p['portal_answers'] === null => 'portal',
        $s['final_score'] === null => 'portal_waiting',
        default => 'complete',
    };

    $state = [
        'role' => $p['role'],
        'name' => $p['name'],
        'partner_name' => $partner['name'] ?? null,
        'stage' => $stage,
        'profile' => $p['profile'] !== null ? json_decode($p['profile'], true) : null,
        'primary' => $p['profile'] !== null ? primary_colors(json_decode($p['profile'], true)) : null,
        'match' => $s['match_score'] !== null
            ? ['score' => (int) $s['match_score'], 'passed' => (int) $s['passed'] === 1, 'threshold' => (int) cfg()['match_threshold']]
            : null,
        'final' => $s['final_json'] !== null ? json_decode($s['final_json'], true) : null,
    ];
    if ($mine) {
        $state['invite'] = $s['invite_token'];
    }
    return $state;
}
