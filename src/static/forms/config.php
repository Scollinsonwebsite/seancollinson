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
 * After enabling here, also set `forms.enabled = true` in src/config.mjs,
 * rebuild, upload, and send a test submission from each form.
 */
return [
    'enabled' => false,
    'recipient' => '',
    'from' => '',
    'site_name' => 'S. Collinson Mediation',
    'salt' => 'change-this-to-a-random-string',
];
