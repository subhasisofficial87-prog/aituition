#!/usr/bin/env python3
"""
deploy.py — Deploy AITuition to Hostinger via FTP
==================================================
Usage:
    python deploy.py

What it does:
1. Verifies npm build exists (.next/standalone)
2. FTP-uploads .next/standalone/ → nodejs/
3. FTP-uploads .next/static/ → nodejs/.next/static/
4. FTP-uploads public/ → nodejs/public/
5. FTP-writes server.js + .env.local → nodejs/
6. FTP-creates nodejs/tmp/restart.txt (triggers Passenger restart)
7. Waits 25s then GETs https://aituition.in to verify 200

Requirements:
    pip install ftplib requests  (both are stdlib, no install needed)

NEVER kill the lsnode.js process — always use restart.txt.
"""

import ftplib
import os
import sys
import time
import requests
from pathlib import Path

# Fix Windows console encoding for emoji
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# ─── Config ───────────────────────────────────────────────────────────────────
FTP_HOST     = 'ftp.aituition.in'   # or use the IP from Hostinger panel
FTP_USER     = 'u803669722.aituition.in'
FTP_PASS     = 'Sub@i2rXFSze!HxR[E0467551'
FTP_ROOT     = '/home/u803669722/domains/aituition.in/nodejs'
SITE_URL     = 'https://aituition.in'

LOCAL_ROOT   = Path(__file__).parent
STANDALONE   = LOCAL_ROOT / '.next' / 'standalone'
STATIC_DIR   = LOCAL_ROOT / '.next' / 'static'
PUBLIC_DIR   = LOCAL_ROOT / 'public'
SERVER_JS    = LOCAL_ROOT / 'server.js'

# Load environment variables from .env.local
from dotenv import load_dotenv
load_dotenv(LOCAL_ROOT / '.env.local')

# Build ENV_CONTENT from environment variables for deployment
ENV_CONTENT = f"""\
NEXT_PUBLIC_SUPABASE_URL={os.getenv('NEXT_PUBLIC_SUPABASE_URL', 'https://your-project.supabase.co')}
NEXT_PUBLIC_SUPABASE_ANON_KEY={os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'your_anon_key_here')}
SUPABASE_SERVICE_KEY={os.getenv('SUPABASE_SERVICE_KEY', 'your_service_role_key_here')}
JWT_SECRET={os.getenv('JWT_SECRET', 'your_jwt_secret_here')}
ANTHROPIC_API_KEY={os.getenv('ANTHROPIC_API_KEY', 'your_anthropic_key_here')}
RAZORPAY_KEY_ID={os.getenv('RAZORPAY_KEY_ID', 'your_razorpay_key_here')}
RAZORPAY_KEY_SECRET={os.getenv('RAZORPAY_KEY_SECRET', 'your_razorpay_secret_here')}
NEXT_PUBLIC_RAZORPAY_KEY_ID={os.getenv('NEXT_PUBLIC_RAZORPAY_KEY_ID', 'your_public_razorpay_key_here')}
NEXT_PUBLIC_BASE_URL={os.getenv('NEXT_PUBLIC_BASE_URL', 'https://aituition.in')}
NODE_ENV=production
"""

# ─── Helpers ──────────────────────────────────────────────────────────────────
SKIP_DIRS  = {'.git', 'node_modules', '__pycache__'}
SKIP_EXTS  = {'.pyc', '.DS_Store'}

uploaded = 0

def ensure_dir(ftp: ftplib.FTP, remote_path: str):
    """Recursively create remote directory if it doesn't exist."""
    parts = remote_path.strip('/').split('/')
    current = ''
    for part in parts:
        current += '/' + part
        try:
            ftp.mkd(current)
        except ftplib.error_perm:
            pass  # Already exists

def upload_file(ftp: ftplib.FTP, local_path: Path, remote_path: str):
    global uploaded
    ensure_dir(ftp, os.path.dirname(remote_path))
    with open(local_path, 'rb') as f:
        ftp.storbinary(f'STOR {remote_path}', f)
    uploaded += 1
    print(f'  ✓ {remote_path}')

def upload_dir(ftp: ftplib.FTP, local_dir: Path, remote_dir: str):
    """Recursively upload a local directory to a remote directory."""
    if not local_dir.exists():
        print(f'  ⚠ Skipping (not found): {local_dir}')
        return
    for item in local_dir.rglob('*'):
        if item.is_dir():
            continue
        # Skip unwanted
        if any(skip in item.parts for skip in SKIP_DIRS):
            continue
        if item.suffix in SKIP_EXTS:
            continue
        rel = item.relative_to(local_dir)
        remote_path = f'{remote_dir}/{rel}'.replace('\\', '/')
        upload_file(ftp, item, remote_path)

def write_string(ftp: ftplib.FTP, remote_path: str, content: str):
    """Write a string directly to an FTP path."""
    import io
    data = content.encode('utf-8')
    ensure_dir(ftp, os.path.dirname(remote_path))
    ftp.storbinary(f'STOR {remote_path}', io.BytesIO(data))
    print(f'  ✓ {remote_path} (written)')

# ─── Main ─────────────────────────────────────────────────────────────────────
def main():
    # 1. Verify build exists
    if not STANDALONE.exists():
        print('❌ .next/standalone not found. Run: npm run build')
        sys.exit(1)

    print(f'\n🚀 Deploying AITuition to {FTP_HOST}...\n')

    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, 21, timeout=60)
    ftp.login(FTP_USER, FTP_PASS)
    ftp.set_pasv(True)
    print(f'✅ FTP connected: {FTP_HOST}\n')

    try:
        # 2. Upload standalone build
        print('📦 Uploading .next/standalone/ ...')
        upload_dir(ftp, STANDALONE, FTP_ROOT)

        # 3. Upload static assets
        print('\n🎨 Uploading .next/static/ ...')
        upload_dir(ftp, STATIC_DIR, f'{FTP_ROOT}/.next/static')

        # 4. Upload public/
        print('\n🖼  Uploading public/ ...')
        upload_dir(ftp, PUBLIC_DIR, f'{FTP_ROOT}/public')

        # 5. Write server.js
        print('\n⚙️  Writing server.js ...')
        upload_file(ftp, SERVER_JS, f'{FTP_ROOT}/server.js')

        # 6. Write .env.local
        print('\n🔐 Writing .env.local ...')
        write_string(ftp, f'{FTP_ROOT}/.env.local', ENV_CONTENT)

        # 7. Touch restart.txt (trigger Passenger restart)
        print('\n🔄 Triggering Passenger restart ...')
        ensure_dir(ftp, f'{FTP_ROOT}/tmp')
        write_string(ftp, f'{FTP_ROOT}/tmp/restart.txt', str(time.time()))

    finally:
        ftp.quit()

    print(f'\n✅ Uploaded {uploaded} files.')
    print(f'\n⏳ Waiting 25s for Passenger to restart...')
    time.sleep(25)

    # 8. Verify site is up
    print(f'\n🌐 Verifying {SITE_URL} ...')
    try:
        resp = requests.get(SITE_URL, timeout=20)
        if resp.status_code == 200:
            print(f'✅ Site is UP! Status: {resp.status_code}')
        else:
            print(f'⚠️  Unexpected status: {resp.status_code}')
    except Exception as e:
        print(f'❌ Could not reach site: {e}')

    print('\n🎉 Deploy complete!\n')

if __name__ == '__main__':
    main()
