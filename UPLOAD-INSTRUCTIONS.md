# Upload the new seancollinson.com (File Manager or FTP)

**Package:** `bluehost-upload.zip` (44 files, about 875 KB). It is the complete website: seven pages, four policy pages, the 404 page, images, fonts, form handler, and the `.htaccess` file.
**Where it goes:** `public_html`, the folder for seancollinson.com (full server path `/home2/morningj/public_html/`).
**Time:** about 10 minutes.

## What this changes, and what it does not

| It adds or replaces | It does not touch |
| --- | --- |
| `index.html` and the folders `about`, `mediation`, `consultation`, `videos`, `masterclass`, `contact`, `privacy-policy`, `terms-of-use`, `accessibility`, `disclaimer`, `assets`, `forms` | WordPress itself (`wp-admin`, `wp-includes`, `wp-content`, `wp-config.php`) |
| `404.html`, `sitemap.xml`, `site.webmanifest` | Your other websites' folders (resetwithsean, themediatorshow, errless, and the rest) |
| **Replaces** these three: `.htaccess`, `robots.txt`, `favicon.ico` | Old folders `css`, `js`, `images` |

Because `index.html` now exists, visitors see the new site. WordPress stays installed but hidden behind it, and `/wp-admin` and the WordPress API still work.

---

## Step 0: Back up first (do not skip)

1. Log in to Bluehost. Open **Websites → your site → Settings**, or **Advanced → Backups**, and run a full backup.
2. Open **Advanced → File Manager**. Go into the `public_html` folder.
3. Click **Settings** (top right of File Manager), tick **Show Hidden Files (dotfiles)**, and click **Save**.
4. Find the file `.htaccess`. Right-click it and choose **Download**. Keep it on your computer. This is your undo button.

## Option A: File Manager (easiest, recommended)

1. In File Manager, make sure you are inside `public_html` (the path at the top should read `/public_html`).
2. Click **Upload** at the top.
3. Drag `bluehost-upload.zip` into the upload box (or click **Select File**). Wait for the bar to reach 100%, then click **Go Back to …/public_html**.
4. Click `bluehost-upload.zip` once to select it, then click **Extract** in the top toolbar.
5. In the box that appears, leave the folder as `/public_html` (nothing after it) and click **Extract File(s)**. Click **Close** when it finishes.
6. If it asks whether to overwrite anything, say **Yes** (only `.htaccess`, `robots.txt` and `favicon.ico` already exist).
7. Check the result in `public_html`. You should see `index.html`, `.htaccess`, and the folders `about`, `assets`, `contact`, and so on, directly inside `public_html`, **not** inside a folder named `bluehost-upload`.
8. Delete `bluehost-upload.zip` from `public_html` (right-click it, **Delete**). The extracted files stay.
9. Go to **Part C: Check that it works**.

## Option B: FTP program (FileZilla or similar)

FTP programs upload files and folders, not zip files, so you unzip on your computer first.

1. **Unzip** `bluehost-upload.zip` on your computer. Open the unzipped folder. You should see `index.html`, `about`, `assets`, and so on. Hidden files may not show, so turn on "show hidden files" in your file browser (Windows: View → Hidden items; Mac: Cmd+Shift+period) and check that `.htaccess` is there.
2. **Find your FTP login:** in Bluehost, open **Advanced → FTP Accounts** and click **Configure FTP Client** next to your account. It shows the **host name**, **username**, and **port**. The password is the one you set for that FTP account (use **Change Password** there if you do not know it). Use the exact values Bluehost shows.
3. **Connect** in FileZilla: **File → Site Manager → New site**. Enter the host, username, password, and port from step 2, choose **Use explicit FTP over TLS if available**, and click **Connect**. If it warns about a certificate, accept it.
4. **Show hidden files:** in FileZilla choose **Server → Force showing hidden files**. This lets you see and overwrite `.htaccess`.
5. **Choose the folders:** on the right ("Remote site") open `/public_html`. On the left ("Local site") open the unzipped `bluehost-upload` folder.
6. **Back up the live `.htaccess` first** (if you skipped Step 0): right-click it on the right and choose **Download**.
7. **Upload the contents, not the folder itself:** on the left, select everything inside the folder (Ctrl+A, or Cmd+A), including `.htaccess`, then drag it onto the right side's `/public_html` (or right-click → **Upload**).
8. When FileZilla asks about files that already exist, choose **Overwrite**, tick **Always use this action**, and click **OK**. Only `.htaccess`, `robots.txt` and `favicon.ico` already exist.
9. Wait until the queue at the bottom is empty and the **Failed transfers** tab shows nothing. Then go to **Part C**.

---

## Part C: Check that it works (do all of these)

Open each address in your browser. Use a private/incognito window so you don't see a cached copy.

| Address | You should see |
| --- | --- |
| `https://seancollinson.com/` | The new home page with Sean's photo |
| `/about/`, `/mediation/`, `/consultation/`, `/videos/`, `/masterclass/`, `/contact/` | Each new page |
| `/consultation/` | The section reads "What mediation can do"; there is no "Mediation cannot" box |
| `https://seancollinson.com/wp-json/` | A block of plain text starting with `{"name":` (this is WordPress's API, and it proves the connector can work again) |
| `https://seancollinson.com/wp-admin/` | The WordPress login page |
| `https://seancollinson.com/nothing-here/` | The new "page not found" page |
| `https://seancollinson.com/contact-us/` | Jumps to `/contact/` |
| `http://www.seancollinson.com/` | Jumps to `https://seancollinson.com/` |
| Two or three of your other sites (for example `resetwithsean.com`, `socialmediacourt.com`) | They load exactly as before |

If everything matches, you are done. Reconnect the WordPress connector at **https://claude.ai/customize/connectors** and start a new session.

## Part D: If something is wrong, undo it

1. In File Manager (or FileZilla), delete `index.html` from `public_html`.
2. Upload the `.htaccess` you downloaded in Step 0 over the one in `public_html`.

The old WordPress site is back immediately. The other new files can stay; they are harmless without `index.html`.

## Part E: Common problems

| What you see | What to do |
| --- | --- |
| Still seeing the old site | Hard refresh (Ctrl+Shift+R, or Cmd+Shift+R on Mac), or open a private window. Bluehost caching can take a few minutes: in WordPress admin use the Bluehost menu and clear the cache. |
| "500 Internal Server Error" on every page | The `.htaccess` is wrong or incomplete. Upload the backup `.htaccess` from Step 0 (Part D), then tell me what happened. |
| The site shows at `seancollinson.com/bluehost-upload/` | The files went into a subfolder. Move the contents of that folder up into `public_html`, or redo the extract/upload as described. |
| Can't see `.htaccess` | Turn on hidden files (File Manager: Settings → Show Hidden Files; FileZilla: Server → Force showing hidden files). |
| Pages load but look unstyled | The `assets` folder did not upload fully. Re-upload the `assets` folder and its contents. |
| `/wp-json/` shows the site's "page not found" | The new `.htaccess` did not replace the old one. Open it in File Manager and check it contains the words `wp-json`; if not, upload it again from the package. |
| An unrelated site stopped working | Restore the Step 0 `.htaccess` (Part D), then tell me which site. |

## Things to know

- **The forms** show "not accepting submissions yet" until an inbox is set in `forms/config.php` (steps are in `README.md`).
- **Don't re-save WordPress Settings → Permalinks.** Saving can rewrite `.htaccess` and partly bring back the old site.
- **Do not delete** `wp-config.php`, `wp-content`, or any folder belonging to another site.
