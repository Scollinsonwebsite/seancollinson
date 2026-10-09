# Upload the new seancollinson.com (File Manager or FTP), version 2

**Files you need**
- `bluehost-upload.zip`: the complete website (43 files, about 870 KB). It no longer contains an `.htaccess` file, so extracting it can never overwrite WordPress's rules.
- `htaccess-static-site-block.txt`: a short block of settings you paste at the top of your existing `.htaccess` (Step 4).

**Where it goes:** `public_html` (full path `/home2/morningj/public_html/`).
**Time:** about 15 minutes.

## What went wrong before, and what is different now

My first install replaced your server's `.htaccess` file. That file contains the rules that let WordPress answer special addresses, including the ones the WordPress connector uses to sign in. With those rules gone, the connector could not register ("Couldn't register with … sign-in service").

This version never replaces `.htaccess`. WordPress's rules stay exactly as they were. The new site's settings are a small block added **above** them, and every line in it applies only to seancollinson.com and the new site's own pages.

| This install adds or replaces | It does not touch |
| --- | --- |
| `index.html`, the folders `about`, `mediation`, `consultation`, `videos`, `masterclass`, `contact`, `privacy-policy`, `terms-of-use`, `accessibility`, `disclaimer`, `assets`, `forms`, and the files `404.html`, `sitemap.xml`, `site.webmanifest` | WordPress (`wp-admin`, `wp-includes`, `wp-content`, `wp-config.php`) |
| **Replaces** two files: `robots.txt` and `favicon.ico` | Your other websites' folders; the old `css`, `js`, `images` folders; WordPress's `.htaccess` rules |

---

## Step 0: Turn on hidden files

1. In Bluehost, open **Advanced → File Manager** and go into `public_html`.
2. Click **Settings** (top right), tick **Show Hidden Files (dotfiles)**, and click **Save**.

## Step 1: Put WordPress's original `.htaccess` back (this fixes the connector)

Before my first install I saved a copy of your original `.htaccess` on the server, outside the public website. This puts it back.

1. In File Manager, click the **Home Directory** link on the left (the folder above `public_html`). Open `site-backups`, then `seancollinson-2026-10-09`. You should see a file named `.htaccess` there, among others.
2. Go back to `public_html`. Right-click the `.htaccess` that is there now and choose **Rename**. Rename it to `.htaccess-new-site-v1` (this keeps it, just in case).
3. Go back to `site-backups/seancollinson-2026-10-09`. Right-click `.htaccess` and choose **Copy**. In the box, set the destination to `/public_html/.htaccess` and click **Copy File(s)**.
4. In `public_html`, check there is a file named `.htaccess` again (its size should be about 6 KB).
5. Open `https://seancollinson.com/wp-json/` in a private/incognito window. You should see a block of text starting with `{"name":`. If so, WordPress is working again.
6. Go to **https://claude.ai/customize/connectors**, reconnect the WordPress connector, and start a new session. Once it is connected, the new session can finish the rest for you, or you can continue below.

Your site stays up throughout. Until Step 4 you will lack some extras (security headers, the old-page redirects), but the new pages work.

## Step 2: Back up

Run a full Bluehost backup (**Advanced → Backups**), and download the restored `.htaccess` to your computer (right-click → Download).

## Step 3: Upload the new site

### Option A: File Manager (easiest)
1. In File Manager, open `public_html`.
2. Click **Upload** and drag in `bluehost-upload.zip`. Wait until it reaches 100%, then click **Go Back to …/public_html**.
3. Click the zip once, then click **Extract** in the toolbar.
4. Leave the folder as `/public_html` (nothing after it) and click **Extract File(s)**. Say **Yes** if asked to overwrite (only `robots.txt` and `favicon.ico` already exist). Click **Close**.
5. Check that `index.html` and the folders `about`, `assets`, `contact` and so on are directly inside `public_html`, **not** inside a folder named `bluehost-upload`.
6. Right-click `bluehost-upload.zip` and delete it. The extracted files stay.

### Option B: FTP program (FileZilla or similar)
FTP programs upload files and folders, not zips.
1. **Unzip** `bluehost-upload.zip` on your computer.
2. **Get your FTP login:** in Bluehost open **Advanced → FTP Accounts**, click **Configure FTP Client** next to your account, and note the host name, username and port it shows. (If you don't know the password, use **Change Password** there.)
3. In FileZilla: **File → Site Manager → New site**. Enter the host, username, password and port. Choose **Use explicit FTP over TLS if available**. Click **Connect** and accept the certificate.
4. Choose **Server → Force showing hidden files**.
5. On the right ("Remote site") open `/public_html`. On the left ("Local site") open the unzipped folder.
6. Select **everything inside** the unzipped folder (Ctrl+A or Cmd+A) and drag it onto `/public_html` on the right. Do not drag the folder itself.
7. If asked about existing files, choose **Overwrite** (only `robots.txt` and `favicon.ico` exist already).
8. Wait for the queue to empty, and make sure **Failed transfers** is empty.

## Step 4: Add the new site's settings block (recommended)

This adds the security headers, the redirect from the old `/contact-us/` address, and the HTTPS redirect for the new site. The site works without it, so you can skip this and do it later.

1. Open `htaccess-static-site-block.txt` on your computer and copy **all of it**.
2. In File Manager, open `public_html`, right-click `.htaccess` and choose **Edit**. If a window asks about encoding, click **Edit**.
3. Click at the very start of the text, or press Ctrl+Home (Cmd+Up on a Mac), so the cursor is on line 1.
4. Paste. The first line of the file should now be `# BEGIN Static website (seancollinson.com)`, and below the pasted block should be `# BEGIN WordPress` and the rest of the old file, unchanged.
5. Click **Save Changes** (top right), then **Close**.
6. Immediately re-check `https://seancollinson.com/wp-json/` (it should still show `{"name":`). If it doesn't, delete the pasted block, save, and tell me.

## Step 5: Check that it works

Use a private/incognito window.

| Address | You should see |
| --- | --- |
| `https://seancollinson.com/` | The new home page with Sean's photo |
| `/about/`, `/mediation/`, `/consultation/`, `/videos/`, `/masterclass/`, `/contact/` | Each new page |
| `/consultation/` | The section reads "What mediation can do"; there is no "Mediation cannot" box |
| `https://seancollinson.com/wp-json/` | Text starting `{"name":` |
| `https://seancollinson.com/wp-admin/` | The WordPress login page |
| `https://seancollinson.com/contact-us/` (needs Step 4) | Jumps to `/contact/` |
| `http://seancollinson.com/` (needs Step 4) | Jumps to `https://seancollinson.com/` |
| Two or three of your other sites | They load exactly as before |

A mistyped address (for example `/nothing-here/`) now shows WordPress's own "page not found" page, not the new site's. That is intentional: it keeps every WordPress feature working.

## Undo

- **Undo only Step 4:** delete everything from `# BEGIN Static website` down to `# END Static website (seancollinson.com)` in `.htaccess`, and save.
- **Undo everything:** delete `index.html` from `public_html` (and, if you added it, the Step 4 block). WordPress returns immediately.

## Common problems

| What you see | What to do |
| --- | --- |
| Still seeing the old site | Hard refresh (Ctrl+Shift+R, or Cmd+Shift+R), or use a private window. In WordPress admin, clear the Bluehost cache from the Bluehost menu. |
| "500 Internal Server Error" after Step 4 | A line was pasted incorrectly. Delete the whole block (Undo, above), save, and tell me what happened. |
| The site shows at `…/bluehost-upload/` | The files went into a subfolder. Move the contents of that folder up into `public_html`. |
| Can't see `.htaccess` | Turn on hidden files (Step 0, or FileZilla's Force showing hidden files). |
| Pages look unstyled | The `assets` folder didn't upload fully. Upload it again, with its contents. |
| The connector still shows the sign-in error after Step 1 | Tell me exactly what `https://seancollinson.com/wp-json/` and `https://seancollinson.com/.well-known/oauth-authorization-server` show (a block of text, or a "page not found" page). |

## Things to know
- The forms show "not accepting submissions yet" until an inbox is set in `forms/config.php` (see `README.md`).
- Don't re-save WordPress **Settings → Permalinks** unless you must; if you do, check `/wp-json/` and the home page afterwards.
- Never delete `wp-config.php`, `wp-content`, or any other site's folder.
