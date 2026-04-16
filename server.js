/**
 * server.js — Passenger/LiteSpeed entry point for aituition.in
 * Now using Supabase instead of local MySQL
 */

const fs   = require('fs');
const path = require('path');

// ─── Self-Heal .env.local ─────────────────────────────────────────────────────
const ENV_PATH    = path.join(__dirname, '.env.local');
// Placeholder: secrets should be provided via deploy.py or environment
// This self-heal is a fallback only - actual secrets come from FTP deployment
const ENV_CONTENT = [
  'NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here',
  'SUPABASE_SERVICE_KEY=your_service_role_key_here',
  'JWT_SECRET=aituition2024SecureJwtKey32CharMin!!HKL',
  'ANTHROPIC_API_KEY=your_anthropic_key_here',
  'RAZORPAY_KEY_ID=your_razorpay_key_here',
  'RAZORPAY_KEY_SECRET=your_razorpay_secret_here',
  'NEXT_PUBLIC_RAZORPAY_KEY_ID=your_public_razorpay_key_here',
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
