/**
 * Trial helpers — shared between client and server
 */

export const TRIAL_DAYS = 7;

export function isTrialActive(trialStartDate: string | Date | null): boolean {
  if (!trialStartDate) return false;
  const start = new Date(trialStartDate);
  const now   = new Date();
  const diffMs  = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays <= TRIAL_DAYS;
}

export function daysRemaining(trialStartDate: string | Date | null): number {
  if (!trialStartDate) return 0;
  const start = new Date(trialStartDate);
  const now   = new Date();
  const diffMs  = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, TRIAL_DAYS - diffDays);
}
