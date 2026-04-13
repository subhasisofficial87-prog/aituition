import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'));
  clearAuthCookie(res);
  return res;
}

export async function GET() {
  const res = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'));
  clearAuthCookie(res);
  return res;
}
