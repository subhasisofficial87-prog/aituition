import mysql from 'mysql2/promise';

// ─── Connection Pool ──────────────────────────────────────────────────────────
// CRITICAL: host must be 127.0.0.1 (NOT localhost) on Hostinger — localhost resolves to ::1 (IPv6)
// CRITICAL: DB name is u803669722_u803669722_qzn (double prefix)
// CRITICAL: password with # must be quoted in .env.local: MYSQL_PASSWORD="Sub:6AAU:#Ug467551"

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host:              process.env.MYSQL_HOST     ?? '127.0.0.1',
      port:              Number(process.env.MYSQL_PORT ?? 3306),
      user:              process.env.MYSQL_USER,
      password:          process.env.MYSQL_PASSWORD,
      database:          process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit:   10,
      queueLimit:        0,
      enableKeepAlive:   true,
      keepAliveInitialDelay: 10_000,
      charset:           'utf8mb4',
    });
  }
  return pool;
}

// ─── Retry Wrapper ────────────────────────────────────────────────────────────
// Handles: transient DB errors + Anthropic 529 Overloaded
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 1000,
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const e = err as { code?: string; status?: number; message?: string };
      const retryableCodes = ['ECONNRESET', 'PROTOCOL_CONNECTION_LOST', 'ER_CON_COUNT_ERROR', 'ETIMEDOUT'];
      const isDbRetry   = retryableCodes.includes(e.code ?? '');
      const isAiRetry   = e.status === 529 || (e.message ?? '').toLowerCase().includes('overload');
      const shouldRetry = (isDbRetry || isAiRetry) && attempt < maxAttempts;
      if (!shouldRetry) throw err;
      await new Promise(r => setTimeout(r, baseDelayMs * 2 ** (attempt - 1)));
    }
  }
  throw new Error('withRetry: max attempts exhausted');
}

// ─── Query Helpers ────────────────────────────────────────────────────────────
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: any[],
): Promise<T[]> {
  return withRetry(async () => {
    const [rows] = await getPool().execute(sql, params);
    return rows as T[];
  });
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params?: any[],
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(sql: string, params?: any[]): Promise<mysql.ResultSetHeader> {
  return withRetry(async () => {
    const [result] = await getPool().execute(sql, params);
    return result as mysql.ResultSetHeader;
  });
}
