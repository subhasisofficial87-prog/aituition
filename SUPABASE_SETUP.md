# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to https://supabase.com
2. Sign up/login
3. Create a new project:
   - Name: `aituition`
   - Password: Create a strong one
   - Region: Select closest to India (Singapore recommended)
4. Wait for provisioning (~2 minutes)

## 2. Get Your Credentials

After project is created, go to Settings → API Keys and copy:
- **Project URL** (e.g., `https://xxxx.supabase.co`)
- **anon/public API key**
- **service_role/secret key** (for backend)

## 3. Create Database Schema

1. In Supabase, go to SQL Editor
2. Copy and paste the entire content from `supabase-schema.sql`
3. Click "Run"
4. Verify all tables are created (should see 8 tables)

## 4. Update Environment Variables

Add these to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

JWT_SECRET=your_jwt_secret_here
ANTHROPIC_API_KEY=your_anthropic_key_here
RAZORPAY_KEY_ID=your_razorpay_key_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_public_razorpay_key_here
NEXT_PUBLIC_BASE_URL=https://aituition.in
NODE_ENV=production
```

## 5. Install Dependencies

```bash
npm install
```

## 6. Test Locally

```bash
npm run build
npm run dev
```

Visit http://localhost:3000/register and test registration.

## 7. Deploy

```bash
npm run build
python deploy.py
```

## Troubleshooting

### "Missing Supabase credentials"
- Make sure `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_KEY`

### "Email already exists" error
- Delete the user from Supabase dashboard (Database → users table) and try again

### "Connection refused"
- Check your Supabase project is online (Dashboard → Project Settings → Status)
