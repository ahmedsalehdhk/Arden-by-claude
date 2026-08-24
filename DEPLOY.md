# cPanel Deploy Guide

Everything runs as a single Next.js Node app on cPanel via **Setup Node.js App** (Passenger). The Postgres database lives on the same server.

## One-time setup

### 1. Create the app in cPanel

**Setup Node.js App → Create Application**
- Node.js version: **20.x** (18+ minimum)
- Application mode: **Production**
- Application root: `apps/arden` (or wherever you want the code)
- Application URL: `ardenholdingsltd.com`
- Startup file: `server.js`

Note the "Enter to the virtual environment" command cPanel gives you — you'll need it in SSH:
```
source /home/ardenhol/nodevenv/apps/arden/20/bin/activate && cd /home/ardenhol/apps/arden
```

### 2. Environment variables

In the same Node.js App page, scroll to **Environment Variables** and add:

| Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `postgresql://ardenhol_USER:PASSWORD@localhost:5432/ardenhol_ardenholdings` |
| `SESSION_SECRET` | 40+ random chars — run `openssl rand -base64 48` on the server, paste result |
| `UPLOAD_DIR` | `/home/ardenhol/arden-uploads` |
| `UPLOAD_URL_PREFIX` | `/uploads` |
| `SEED_ADMIN_EMAIL` | your admin email (only used on first seed) |
| `SEED_ADMIN_PASSWORD` | strong password (only used on first seed) |

### 3. Uploads directory (outside the app dir)

SSH in, then:
```bash
mkdir -p ~/arden-uploads
cd ~/apps/arden
ln -s ~/arden-uploads public/uploads
```
Now any file the admin uploads to `~/arden-uploads/…` is served at `https://ardenholdingsltd.com/uploads/…` and survives every redeploy.

### 4. First code upload

From your Mac:
```bash
git push origin backend-cpanel
```

On cPanel via SSH:
```bash
source ~/nodevenv/apps/arden/20/bin/activate && cd ~/apps/arden
git clone https://github.com/ahmedsalehdhk/Arden-by-claude.git .
git checkout backend-cpanel
npm ci
npm run build
npm run db:migrate
npm run db:seed   # only the first time — creates admin user + seeds initial projects/team
```

### 5. Start the app

Back in cPanel **Setup Node.js App** → click **Restart**.

Visit `https://ardenholdingsltd.com` — should be live.
Admin at `https://ardenholdingsltd.com/admin/login/`.

---

## Every subsequent deploy

From your Mac:
```bash
git push origin backend-cpanel
```

On cPanel via SSH:
```bash
source ~/nodevenv/apps/arden/20/bin/activate && cd ~/apps/arden
git pull
npm ci
npm run build
npm run db:migrate   # only if there are new migrations
```

Then in cPanel **Setup Node.js App** → **Restart**.

Uploads are untouched because they live outside the app dir.

---

## Troubleshooting

**Site shows "Application Error" / Passenger error page**
Check the app log at `~/apps/arden/stderr.log` (or the log path cPanel shows on the Node.js App page).

**Images not loading (broken image / SVG placeholder)**
Confirm `images.unoptimized: true` is in `next.config.mjs`. Without it Next tries to run its image optimizer under Passenger and returns an SVG on failure.

**Admin login: "Unauthorized" loop**
`SESSION_SECRET` env var must be set on the server (not just in local `.env.local`). Restart the app after adding it.

**Uploads land somewhere unexpected**
`UPLOAD_DIR` should be an absolute path. Check with `readlink ~/apps/arden/public/uploads` — should print the absolute path of your uploads folder.

**DB connection refused**
Check the Postgres user has been added to the database in cPanel → **PostgreSQL Databases → Add User to Database**.
