import Razorpay from 'razorpay';
import crypto from 'crypto';

// ─── Razorpay client (server-side only) ──────────────────────────────────────
let _client: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!_client) {
    _client = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return _client;
}

// ─── Pricing matrix ───────────────────────────────────────────────────────────
// Monthly base prices in INR
export const PRICING = {
  basic: {
    'lkg-ukg': 149,
    '1-5':     199,
    '6-8':     249,
    '9-12':    299,
    '9-12-icse': 349,
  },
  pro: {
    'lkg-ukg': 249,
    '1-5':     349,
    '6-8':     449,
    '9-12':    549,
    '9-12-icse': 649,
  },
} as const;

export const BILLING_MULTIPLIERS = {
  monthly:   { months: 1,  discount: 0   },
  quarterly: { months: 3,  discount: 0.1 },
  yearly:    { months: 12, discount: 0.17 },
} as const;

export type PlanType    = 'basic' | 'pro';
export type BillingPeriod = 'monthly' | 'quarterly' | 'yearly';
export type ClassTierKey = keyof typeof PRICING.basic;

// ─── Class → tier mapping ─────────────────────────────────────────────────────
export function getClassTier(classLevel: string, board?: string): ClassTierKey {
  if (['LKG', 'UKG'].includes(classLevel)) return 'lkg-ukg';
  const n = Number(classLevel);
  if (n >= 1 && n <= 5) return '1-5';
  if (n >= 6 && n <= 8) return '6-8';
  if (n >= 9 && n <= 12) {
    return board === 'ICSE' ? '9-12-icse' : '9-12';
  }
  return '6-8';
}

// ─── Price calculator ─────────────────────────────────────────────────────────
export function calculatePrice(
  planType: PlanType,
  classLevel: string,
  board: string,
  billingPeriod: BillingPeriod
): { amountPaise: number; amountInr: number; perMonthInr: number } {
  const tier      = getClassTier(classLevel, board);
  const baseMonthly = PRICING[planType][tier];
  const { months, discount } = BILLING_MULTIPLIERS[billingPeriod];
  const total     = Math.round(baseMonthly * months * (1 - discount));
  const perMonth  = Math.round(total / months);

  return {
    amountPaise: total * 100,
    amountInr:   total,
    perMonthInr: perMonth,
  };
}

// ─── HMAC verification ────────────────────────────────────────────────────────
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body   = `${orderId}|${paymentId}`;
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expected === signature;
}
