import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query, queryOne } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';
import type { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'auth.error.weak' }, { status: 400 });
    }

    // Check duplicate
    const existing = await queryOne<User>(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    if (existing) {
      return NextResponse.json({ error: 'auth.error.exists' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name.trim(), email.toLowerCase(), hash]
    );

    const userId: number = (result as any).insertId;

    // Create user_progress row
    await query('INSERT INTO user_progress (user_id) VALUES (?)', [userId]);

    const token = await signToken({ userId, email: email.toLowerCase(), name: name.trim(), tier: 'free' });
    const res = NextResponse.json({ ok: true }, { status: 201 });
    setAuthCookie(res, token);
    return res;
  } catch (err) {
    console.error('[register]', err);
    return NextResponse.json({ error: 'common.error' }, { status: 500 });
  }
}
