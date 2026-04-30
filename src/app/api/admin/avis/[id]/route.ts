import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import { z } from "zod";

const patchSchema = z.object({
  statut: z.enum(["pending", "approved", "rejected"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Statut invalide" },
      { status: 400 },
    );
  }

  const { statut } = parsed.data;
  const moderatedAt = statut === "pending" ? null : new Date();

  const rows = (await sql`
    UPDATE avis
    SET statut = ${statut}, moderated_at = ${moderatedAt}
    WHERE id = ${params.id}
    RETURNING id, statut, moderated_at
  `) as { id: string; statut: string; moderated_at: string | null }[];

  if (rows.length === 0) {
    return NextResponse.json({ error: "Avis non trouvé" }, { status: 404 });
  }

  return NextResponse.json({ avis: rows[0] });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = (await sql`
    DELETE FROM avis WHERE id = ${params.id} RETURNING id
  `) as { id: string }[];

  if (rows.length === 0) {
    return NextResponse.json({ error: "Avis non trouvé" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
