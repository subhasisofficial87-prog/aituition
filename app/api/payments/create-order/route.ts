import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { execute } from '@/lib/db';
import { getRazorpay, calculatePrice } from '@/lib/razorpay';
import type { BillingPeriod, PlanType } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const { planType, billingPeriod, classLevel, board } = await req.json();

    if (!planType || !billingPeriod || !classLevel || !board) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { amountPaise, amountInr } = calculatePrice(
      planType as PlanType,
      classLevel,
      board,
      billingPeriod as BillingPeriod
    );

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount:   amountPaise,
      currency: 'INR',
      receipt:  `ait_${session.userId}_${Date.now()}`,
      notes: {
        userId:        String(session.userId),
        planType,
        billingPeriod,
        classLevel,
        board,
      },
    });

    // Save order to DB
    await execute(
      `INSERT INTO payments
        (user_id, razorpay_order_id, amount_paise, plan_type, billing_period, class_tier, board)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        session.userId,
        order.id,
        amountPaise,
        planType,
        billingPeriod,
        classLevel,
        board,
      ]
    );

    return NextResponse.json({
      orderId:  order.id,
      amount:   amountPaise,
      currency: 'INR',
      keyId:    process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    if (err?.status === 401) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('[create-order]', err);
    return NextResponse.json({ error: 'common.error' }, { status: 500 });
  }
}
