/**
 * server.js — Passenger/LiteSpeed entry point for aituition.in
 *
 * KEY BEHAVIOURS:
 * 1. Self-heals .env.local before Next.js starts (file can vanish on Hostinger)
 * 2. Loads env via dotenv BEFORE requiring Next.js modules
 * 3. Starts Next.js standalone HTTP server on process.env.PORT (Passenger sets this)
 *
 * NEVER kill the lsnode.js process — restart via: touch tmp/restart.txt
 */

const fs   = require('fs');
const path = require('path');

// ─── Self-Heal .env.local ─────────────────────────────────────────────────────
const ENV_PATH    = path.join(__dirname, '.env.local');
const ENV_CONTENT = [
  'MYSQL_HOST=127.0.0.1',
  'MYSQL_PORT=3306',
  'MYSQL_USER=YOUR_DB_USER',
  'MYSQL_PASSWORD="YOUR_DB_PASSWORD"',
  'MYSQL_DATABASE=YOUR_DB_NAME',
  'JWT_SECRET=YOUR_JWT_SECRET_MIN_32_CHARS',
  'ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY',
  'RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET',
  'NEXT_PUBLIC_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID',
  'NEXT_PUBLIC_BASE_URL=https://aituition.in',
  'NODE_ENV=production',
].join('\n') + '\n';

if (!fs.existsSync(ENV_PATH) || fs.statSync(ENV_PATH).size < 50) {
  fs.writeFileSync(ENV_PATH, ENV_CONTENT, 'utf8');
  console.log('[server.js] .env.local restored');
}

// ─── Load Environment ─────────────────────────────────────────────────────────
require('dotenv').config({ path: ENV_PATH });

// ─── Start Next.js ────────────────────────────────────────────────────────────
const { createServer } = require('http');
const { parse }        = require('url');
const next             = require('next');

const dev  = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const app  = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`[server.js] AITuition ready on port ${port}`);
  });
}).catch(err => {
  console.error('[server.js] Failed to start:', err);
  process.exit(1);
});
