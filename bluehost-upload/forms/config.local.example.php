<?php
/**
 * Copy this file to config.local.php ON THE SERVER (Bluehost File Manager,
 * public_html/forms/) and fill it in. Do not put the real file in the website
 * zip or in GitHub. It overrides forms/config.php and survives site updates.
 */
return [
    'enabled' => true,
    'recipient' => 'inbox-that-receives-requests@example.com',
    'from' => 'no-reply@seancollinson.com',
    'salt' => 'paste-a-long-random-string-here',
    'mailerlite' => [
        'api_key' => 'paste-your-MailerLite-API-token-here',
    ],
];
