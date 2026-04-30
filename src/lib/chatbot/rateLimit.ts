import { sql } from "@/lib/db";

const DAILY_LIMIT = parseInt(
  process.env.CHATBOT_RATE_LIMIT_PER_DAY ?? "20",
  10,
);

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; remaining: 0 };

export async function checkAndIncrement(ip: string): Promise<RateLimitResult> {
  const rows = (await sql`
    SELECT COUNT(*)::int AS count
    FROM chatbot_log
    WHERE ip = ${ip}
      AND created_at > NOW() - INTERVAL '24 hours'
  `) as { count: number }[];

  const used = rows[0]?.count ?? 0;

  if (used >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  await sql`INSERT INTO chatbot_log (ip) VALUES (${ip})`;

  return { allowed: true, remaining: DAILY_LIMIT - used - 1 };
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();

  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();

  return "unknown";
}
