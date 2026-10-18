<?php
// Copy to config.php (same folder) and fill in. config.php is git-ignored.
return [
    // Bluehost cPanel > MySQL Databases: create a database and user, then fill these in.
    'dsn'  => 'mysql:host=localhost;dbname=CPANELUSER_truecolor;charset=utf8mb4',
    'user' => 'CPANELUSER_tcuser',
    'pass' => 'CHANGE_ME',

    // Stage 1 pass mark: pair match score (0-100) needed to unlock the 50-question portal.
    'match_threshold' => 65,

    // Weight of the portal result vs. the color match in the final score.
    'portal_weight' => 0.7,

    // Max joins/creates per IP per hour.
    'rate_limit_per_hour' => 30,

    // Delete sessions older than this many days (cleanup.php).
    'retention_days' => 30,
];
