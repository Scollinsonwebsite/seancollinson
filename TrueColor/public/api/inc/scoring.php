<?php
declare(strict_types=1);

const COLORS = ['gold', 'blue', 'green', 'orange'];

// Pair compatibility, 0 to 1, symmetric. Same-color pairs read as "easy",
// opposite-temperament pairs (gold/orange) as the most demanding.
const PAIR_MATRIX = [
    'gold'   => ['gold' => 0.85, 'blue' => 0.85, 'green' => 0.65, 'orange' => 0.45],
    'blue'   => ['gold' => 0.85, 'blue' => 0.90, 'green' => 0.55, 'orange' => 0.70],
    'green'  => ['gold' => 0.65, 'blue' => 0.55, 'green' => 0.80, 'orange' => 0.65],
    'orange' => ['gold' => 0.45, 'blue' => 0.70, 'green' => 0.65, 'orange' => 0.75],
];

/** @param string[] $answers one color key per question */
function valid_quiz_answers(array $answers, int $count): bool
{
    if (count($answers) !== $count || !array_is_list($answers)) {
        return false;
    }
    foreach ($answers as $a) {
        if (!is_string($a) || !in_array($a, COLORS, true)) {
            return false;
        }
    }
    return true;
}

/** @return array<string,int> percentages summing to 100 */
function color_profile(array $answers): array
{
    $counts = array_fill_keys(COLORS, 0);
    foreach ($answers as $a) {
        $counts[$a]++;
    }
    $total = max(1, count($answers));
    $pct = [];
    foreach (COLORS as $c) {
        $pct[$c] = (int) round($counts[$c] * 100 / $total);
    }
    // Fix rounding drift on the largest bucket so the total is exactly 100.
    $diff = 100 - array_sum($pct);
    if ($diff !== 0) {
        arsort($counts);
        $pct[array_key_first($counts)] += $diff;
    }
    return $pct;
}

function primary_colors(array $profile): array
{
    $max = max($profile);
    return array_values(array_keys(array_filter($profile, fn ($v) => $v === $max)));
}

/** Pair match score, 0 to 100. */
function pair_match(array $a, array $b): int
{
    $sum = 0.0;
    foreach (COLORS as $i) {
        foreach (COLORS as $j) {
            $sum += ($a[$i] / 100) * ($b[$j] / 100) * PAIR_MATRIX[$i][$j];
        }
    }
    return (int) round($sum * 100);
}

function valid_portal_answers(array $answers, int $count): bool
{
    if (count($answers) !== $count || !array_is_list($answers)) {
        return false;
    }
    foreach ($answers as $a) {
        if (!is_int($a) || $a < 1 || $a > 5) {
            return false;
        }
    }
    return true;
}

/**
 * Final compatibility from two 50-item Likert sets.
 * Per item: similarity = 1 - |a - b| / 4. Per scale: mean similarity.
 * Overall: portal mean blended with the color match score.
 */
function portal_result(array $a, array $b, array $portal, array $scaleNames, int $matchScore, float $portalWeight): array
{
    $bySc = [];
    foreach ($portal as $i => $item) {
        $bySc[$item['s']][] = 1 - abs($a[$i] - $b[$i]) / 4;
    }
    $scales = [];
    $all = [];
    foreach ($scaleNames as $key => $label) {
        $vals = $bySc[$key] ?? [];
        $scales[] = [
            'key' => $key,
            'label' => $label,
            'score' => (int) round(100 * array_sum($vals) / max(1, count($vals))),
        ];
        $all = array_merge($all, $vals);
    }
    $portalScore = 100 * array_sum($all) / max(1, count($all));
    $final = (int) round($portalWeight * $portalScore + (1 - $portalWeight) * $matchScore);
    return [
        'final' => $final,
        'portal' => (int) round($portalScore),
        'match' => $matchScore,
        'scales' => $scales,
        'low_variation' => low_variation($a) || low_variation($b),
    ];
}

/** True when one answer value makes up 90%+ of a set (likely straight-lining). */
function low_variation(array $answers): bool
{
    $counts = array_count_values($answers);
    return max($counts) / max(1, count($answers)) >= 0.9;
}

function band(int $score): string
{
    return match (true) {
        $score >= 85 => 'Exceptional',
        $score >= 75 => 'Strong',
        $score >= 65 => 'Promising',
        $score >= 50 => 'Mixed',
        default => 'Challenging',
    };
}
