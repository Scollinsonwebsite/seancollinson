# Deploying to Bluehost (cPanel)

1. **Database.** cPanel > MySQL Databases: create a database and a user, add the user to the database with all privileges.
2. **Schema.** cPanel > phpMyAdmin > select the database > Import `db/schema.sql`.
3. **Config.** Copy `public/api/inc/config.sample.php` to `config.php` in the same folder and fill in the DSN, user and password. Adjust `match_threshold` if you want.
4. **Upload.** Upload the contents of `public/` to a folder such as `public_html/truecolor/` (File Manager or FTP). Keep `api/inc/.htaccess`, which blocks web access to config and scoring code.
5. **HTTPS.** Make sure the site is served over HTTPS (AutoSSL is on by default).
6. **Cleanup cron.** cPanel > Cron Jobs, daily: `php /home/USER/public_html/truecolor/api/inc/cleanup.php`. It deletes sessions older than `retention_days` (default 30).
7. **Test.** Open `https://yourdomain/truecolor/`, complete stage 1, and check the invite link opens in a private window.

Do not touch the root `.htaccess` of the main site. The app needs no rewrite rules.

## Local development
```bash
cd TrueColor
TC_DSN="sqlite:/tmp/tc.db" php -S 127.0.0.1:8080 -t public
```
The SQLite file is created from `db/schema.sql` automatically.

## Tests
```bash
php tests/scoring.test.php
node tests/api.e2e.mjs
PLAYWRIGHT_MODULE=/path/to/playwright node tests/ui.e2e.mjs
```
