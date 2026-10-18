<?php
declare(strict_types=1);
// Run daily from cPanel Cron Jobs:  php /home/USER/public_html/truecolor/api/inc/cleanup.php
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}
require __DIR__ . '/lib.php';
$cutoff = time() - 86400 * (int) cfg()['retention_days'];
$pdo = db();
$ids = $pdo->prepare('SELECT id FROM sessions WHERE created_at < ?');
$ids->execute([$cutoff]);
foreach ($ids->fetchAll() as $row) {
    $pdo->prepare('DELETE FROM participants WHERE session_id = ?')->execute([$row['id']]);
    $pdo->prepare('DELETE FROM sessions WHERE id = ?')->execute([$row['id']]);
}
$pdo->prepare('DELETE FROM rate_limits WHERE created_at < ?')->execute([time() - 3600]);
echo "Cleanup done.\n";
