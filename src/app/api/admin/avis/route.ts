import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import type { Avis } from "@/lib/db";

const ALLOWED_STATUTS = ["pending", "approved", "rejected"] as const;
type Statut = (typeof ALLOWED_STATUTS)[number];

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const statut = req.nextUrl.searchParams.get("statut");
  const validStatut =
    statut && ALLOWED_STATUTS.includes(statut as Statut)
      ? (statut as Statut)
      : null;

  const rows = (validStatut
    ? await sql`
        SELECT id, nom, email, note, texte, statut, created_at, moderated_at
        FROM avis
        WHERE statut = ${validStatut}
        ORDER BY created_at DESC
      `
    : await sql`
        SELECT id, nom, email, note, texte, statut, created_at, moderated_at
        FROM avis
        ORDER BY
          CASE statut WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
          created_at DESC
      `) as Avis[];

  return NextResponse.json({ avis: rows });
}
