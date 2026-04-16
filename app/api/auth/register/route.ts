import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'auth.error.weak' }, { status: 400 });
    }

    // Check if email exists
    const { data: existing, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is expected
      console.error('[register] Check error:', checkError);
      return NextResponse.json({ error: 'common.error', message: checkError.message }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({ error: 'auth.error.exists' }, { status: 409 });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    // Insert user
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert([{
        name: name.trim(),
        email: email.toLowerCase(),
        password_hash: hash,
      }])
      .select()
      .single();

    if (insertError || !user) {
      console.error('[register] Insert error:', insertError);
      return NextResponse.json({ error: 'common.error', message: insertError?.message }, { status: 500 });
    }

    // Create user_progress row
    const { error: progressError } = await supabase
      .from('user_progress')
      .insert([{ user_id: user.id }]);

    if (progressError) {
      console.error('[register] Progress error:', progressError);
      return NextResponse.json({ error: 'common.error', message: progressError.message }, { status: 500 });
    }

    // Sign JWT token
    const token = await signToken({
      userId: user.id,
      email: email.toLowerCase(),
      name: name.trim(),
      tier: 'free',
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscription_tier: user.subscription_tier,
        created_at: user.created_at,
      },
    }, { status: 201 });
    setAuthCookie(res, token);
    return res;
  } catch (err: any) {
    console.error('[register] Error:', err);
    return NextResponse.json({
      error: 'common.error',
      message: err?.message,
    }, { status: 500 });
  }
}
