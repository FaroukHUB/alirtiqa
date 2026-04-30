import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const env = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
  };

  let dbOk = false;
  let dbError: string | null = null;
  if (env.DATABASE_URL) {
    try {
      const { sql } = await import("@/lib/db");
      const rows = (await sql`SELECT 1 AS ok`) as { ok: number }[];
      dbOk = rows[0]?.ok === 1;
    } catch (err) {
      dbError = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json({
    env,
    db: { ok: dbOk, error: dbError },
    region: process.env.VERCEL_REGION ?? null,
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
  });
}
