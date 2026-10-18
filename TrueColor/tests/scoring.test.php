<?php
declare(strict_types=1);
require __DIR__ . '/../public/api/inc/scoring.php';

$fail = 0;
function check(string $name, bool $ok): void { global $fail; echo ($ok ? "ok   " : "FAIL ") . $name . "\n"; if (!$ok) $fail++; }

$p = color_profile(['gold','gold','blue','green','orange','gold','blue','gold','green','orange']);
check('profile sums to 100', array_sum($p) === 100);
check('profile primary is gold', primary_colors($p) === ['gold']);
check('rounding drift fixed', array_sum(color_profile(array_merge(array_fill(0, 3, 'gold'), array_fill(0, 3, 'blue'), array_fill(0, 3, 'green')))) === 100);

$allGold = ['gold' => 100, 'blue' => 0, 'green' => 0, 'orange' => 0];
$allOrange = ['gold' => 0, 'blue' => 0, 'green' => 0, 'orange' => 100];
$allBlue = ['gold' => 0, 'blue' => 100, 'green' => 0, 'orange' => 0];
check('gold+gold = 85', pair_match($allGold, $allGold) === 85);
check('gold+orange = 45 (lowest)', pair_match($allGold, $allOrange) === 45);
check('match is symmetric', pair_match($allGold, $allBlue) === pair_match($allBlue, $allGold));
check('threshold 65 rejects gold/orange', pair_match($allGold, $allOrange) < 65);

check('valid quiz answers', valid_quiz_answers(array_fill(0, 10, 'gold'), 10));
check('rejects bad color', !valid_quiz_answers(array_fill(0, 10, 'pink'), 10));
check('rejects wrong count', !valid_quiz_answers(['gold'], 10));
check('valid portal', valid_portal_answers(array_fill(0, 50, 3), 50));
check('rejects 6', !valid_portal_answers(array_merge(array_fill(0, 49, 3), [6]), 50));
check('rejects string numbers', !valid_portal_answers(array_fill(0, 50, '3'), 50));

$q = json_decode(file_get_contents(__DIR__ . '/../public/api/inc/questions.json'), true);
check('50 portal items', count($q['portal']) === 50);
check('10 + 10 quiz items', count($q['quiz1']) === 10 && count($q['quiz2']) === 10);
$ok = true; foreach (array_merge($q['quiz1'], $q['quiz2']) as $it) { $ok = $ok && count($it['o']) === 4 && count(array_unique(array_column($it['o'], 'c'))) === 4; }
check('each quiz item has one option per color', $ok);
check('every portal scale is named', count(array_diff(array_unique(array_column($q['portal'], 's')), array_keys($q['scales']))) === 0);

$a = array_fill(0, 50, 5); $same = portal_result($a, $a, $q['portal'], $q['scales'], 80, 0.7);
check('identical answers -> portal 100', $same['portal'] === 100 && $same['final'] === (int) round(0.7 * 100 + 0.3 * 80));
$b = array_fill(0, 50, 1); $opp = portal_result($a, $b, $q['portal'], $q['scales'], 80, 0.7);
check('opposite answers -> portal 0', $opp['portal'] === 0);
check('straight-lining flagged', $same['low_variation'] === true);
$mix = []; for ($i = 0; $i < 50; $i++) $mix[] = ($i % 5) + 1;
check('varied answers not flagged', portal_result($mix, $mix, $q['portal'], $q['scales'], 80, 0.7)['low_variation'] === false);
check('6 scale results', count($same['scales']) === 6);
exit($fail ? 1 : 0);
