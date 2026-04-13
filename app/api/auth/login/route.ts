import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { queryOne } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';
import type { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    const user = await queryOne<User>(
      'SELECT id, name, email, password_hash, subscription_tier FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!user) {
      return NextResponse.json({ error: 'auth.error.invalid' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'auth.error.invalid' }, { status: 401 });
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      tier: user.subscription_tier,
    });

    const res = NextResponse.json({ ok: true });
    setAuthCookie(res, token);
    return res;
  } catch (err) {
    console.error('[login]', err);
    return NextResponse.json({ error: 'common.error' }, { status: 500 });
  }
}
