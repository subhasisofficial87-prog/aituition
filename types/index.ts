// ─── Shared TypeScript interfaces for AITuition.in ───────────────────────────

export interface User {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  subscription_tier: 'free' | 'basic' | 'pro';
  trial_start_date: string | null;
  trial_used: number;
  created_at: string;
}

export interface TokenPayload {
  userId: number;
  email: string;
  name: string;
  tier: 'free' | 'basic' | 'pro';
  iat?: number;
  exp?: number;
}

export interface SyllabusStructure {
  id: number;
  board: 'CBSE' | 'ICSE' | 'Odia Medium';
  class_level: string;
  subject: string;
  structure_name: string;
  chapters_json: string[] | string;
}

export interface DayEntry {
  day: number;       // 1–220
  date: string;      // YYYY-MM-DD
  chapter: string;
  topic: string;
  type: 'lecture' | 'doubt';
}

export interface StudyPlan {
  id: number;
  user_id: number;
  board: string;
  class_level: string;
  subject: string;
  child_name: string;
  language: string;
  chapters_json: string[] | string;
  plan_data: DayEntry[] | string;
  trial_start_date: string;
  status: 'active' | 'paused' | 'expired';
  created_at: string;
}

export interface DailySession {
  id: number;
  plan_id: number;
  user_id: number;
  day_number: number;
  topic: string;
  lecture_content: string | null;
  quiz_questions: QuizQuestion[] | string | null;
  quiz_answers: string[] | string | null;
  quiz_score: number | null;
  completed: boolean | number;
  completed_at: string | null;
  created_at: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: string;    // 'A' | 'B' | 'C' | 'D'
  explanation: string;
}

export interface Payment {
  id: number;
  user_id: number;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  amount_paise: number;
  plan_type: string;
  billing_period: 'monthly' | 'quarterly' | 'yearly';
  class_tier: string;
  board: string;
  status: 'created' | 'paid' | 'failed';
  created_at: string;
}

export interface UserProgress {
  id: number;
  user_id: number;
  current_streak: number;
  longest_streak: number;
  total_sessions: number;
  avg_quiz_score: number | null;
  weekly_study_mins: number;
  last_study_date: string | null;
}

export interface QuizResult {
  score: number;
  total: number;
  chapter: string;
  taken_at: string;
}

export interface WeakArea {
  chapter: string;
  avg_score: number;
  attempts: number;
}

export interface DashboardData {
  streak: number;
  longestStreak: number;
  totalSessions: number;
  avgQuizScore: number;
  weeklyMins: number;
  completedDays: number;
  totalDays: number;
  todayEntry: DayEntry | null;
  recentQuizzes: QuizResult[];
  weakAreas: WeakArea[];
  plan: { id: number; childName: string; board: string; classLevel: string; subject: string } | null;
  tier: 'free' | 'basic' | 'pro';
  trialStart: string | null;
}
