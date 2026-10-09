<?php
/**
 * Form delivery settings. Edit on the server (or before uploading).
 * This file only returns settings; visiting it in a browser shows nothing.
 *
 *  recipient: the verified inbox that should receive form submissions.
 *  from:      an address on your own domain (e.g. no-reply@seancollinson.com),
 *             created in Bluehost Email so messages are not marked as spam.
 *  enabled:   set to true after recipient and from are filled in.
 *  salt:      any random string; used to anonymise rate-limit records.
 *
 * PRIVATE SETTINGS (recommended): put your real recipient, from, enabled and
 * the MailerLite api_key in forms/config.local.php on the server. That file is
 * never part of the website zip, so uploading a new version of the site can
 * never overwrite it or expose the key. See forms/config.local.example.php.
 *
 * After enabling here, also set `forms.enabled = true` in src/config.mjs,
 * rebuild, upload, and send a test submission from each form.
 */
$config = [
    'enabled' => false,
    'recipient' => '',
    'from' => '',
    'site_name' => 'S. Collinson Mediation',
    'salt' => 'change-this-to-a-random-string',
    // MailerLite: adds each sender (name, email, phone only) to a group.
    // api_key lives in config.local.php. Groups are found by name.
    'mailerlite' => [
        'api_key' => '',
        'groups' => [
            'quick' => 'Consultation request',
            'consultation' => 'Consultation request',
            'contact' => 'Contact messages',
            'masterclass' => 'Master class inquiries',
        ],
    ],
];

// Private overrides, never shipped in the zip.
if (is_file(__DIR__ . '/config.local.php')) {
    $local = include __DIR__ . '/config.local.php';
    if (is_array($local)) {
        $config = array_replace_recursive($config, $local);
    }
}
return $config;
