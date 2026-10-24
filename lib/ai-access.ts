export const EXHIBITION_REQUEST_LIMIT = 300;
export const FIT_ORIGINS = new Set([
  "https://lauyanshen.github.io",
  "https://fit-plus-health.eddielau.chatgpt.site",
]);

export interface UsageDB {
  prepare(sql: string): {
    bind(...values: (string | number)[]): {
      first<T>(): Promise<T | null>;
      run(): Promise<unknown>;
    };
  };
}

export async function aiStatus(db: UsageDB) {
  const enabled = await db.prepare("SELECT value FROM ai_settings WHERE key = ?")
    .bind("enabled").first<{ value: string }>();
  const usage = await db.prepare("SELECT count FROM ai_usage WHERE key = ?")
    .bind("exhibition-total").first<{ count: number }>();
  return { enabled: enabled?.value !== "false", used: usage?.count || 0, limit: EXHIBITION_REQUEST_LIMIT };
}

async function incrementBelow(db: UsageDB, key: string, limit: number) {
  // One atomic statement: simultaneous requests cannot exceed this ceiling.
  return db.prepare(`INSERT INTO ai_usage (key, count) VALUES (?, 1)
    ON CONFLICT(key) DO UPDATE SET count = count + 1 WHERE count < ?
    RETURNING count`).bind(key, limit).first<{ count: number }>();
}

export async function reserveAiRequest(db: UsageDB, clientHash: string, now = Date.now()) {
  const status = await aiStatus(db);
  if (!status.enabled) return { status: 503, error: "Fit+ AI is paused by the owner." };
  if (!await incrementBelow(db, `minute:${Math.floor(now / 60000)}:${clientHash}`, 12))
    return { status: 429, error: "Too many requests. Please wait a minute and try again." };
  if (!await incrementBelow(db, `hour:${Math.floor(now / 3600000)}:${clientHash}`, 120))
    return { status: 429, error: "The hourly AI allowance has been reached. Please try again later." };
  if (!await incrementBelow(db, "exhibition-total", EXHIBITION_REQUEST_LIMIT))
    return { status: 429, error: "The exhibition AI allowance has been reached. Please ask the booth owner." };
  return null;
}

export async function hashClient(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, "0")).join("");
}
