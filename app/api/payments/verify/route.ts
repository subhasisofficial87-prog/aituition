import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { queryOne, execute } from '@/lib/db';
import { verifyPaymentSignature } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
    }

    // Verify HMAC signature
    const valid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Get payment record
    const payment = await queryOne<any>(
      'SELECT * FROM payments WHERE razorpay_order_id = ? AND user_id = ?',
      [razorpay_order_id, session.userId]
    );
    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

    // Determine new tier
    const newTier = payment.plan_type === 'pro' ? 'pro' : 'basic';

    // Update payment record
    await execute(
      'UPDATE payments SET razorpay_payment_id = ?, status = ? WHERE id = ?',
      [razorpay_payment_id, 'paid', payment.id]
    );

    // Upgrade user tier
    await execute(
      'UPDATE users SET subscription_tier = ? WHERE id = ?',
      [newTier, session.userId]
    );

    return NextResponse.json({ ok: true, tier: newTier });
  } catch (err: any) {
    if (err?.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('[verify]', err);
    return NextResponse.json({ error: 'common.error' }, { status: 500 });
  }
}
