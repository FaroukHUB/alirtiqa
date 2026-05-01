import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import { z } from "zod";

const patchSchema = z.object({
  statut: z
    .enum(["nouveau", "contacte", "essai", "inscrit", "refus", "sans_suite"])
    .optional(),
  note_admin: z.string().max(5000).nullable().optional(),
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
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { statut, note_admin } = parsed.data;
  if (statut === undefined && note_admin === undefined) {
    return NextResponse.json({ error: "Rien à modifier" }, { status: 400 });
  }

  const noteValue =
    note_admin === undefined
      ? undefined
      : note_admin === null || note_admin.trim() === ""
        ? null
        : note_admin;

  let rows: { id: string }[];
  if (statut !== undefined && noteValue !== undefined) {
    rows = (await sql`
      UPDATE inscriptions
      SET statut = ${statut}, note_admin = ${noteValue}, updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING id
    `) as { id: string }[];
  } else if (statut !== undefined) {
    rows = (await sql`
      UPDATE inscriptions
      SET statut = ${statut}, updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING id
    `) as { id: string }[];
  } else {
    rows = (await sql`
      UPDATE inscriptions
      SET note_admin = ${noteValue}, updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING id
    `) as { id: string }[];
  }

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Inscription non trouvée" },
      { status: 404 },
    );
  }

  revalidatePath("/admin/inscriptions");
  revalidatePath(`/admin/inscriptions/${params.id}`);
  revalidatePath("/admin");

  return NextResponse.json({ ok: true });
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
    DELETE FROM inscriptions WHERE id = ${params.id} RETURNING id
  `) as { id: string }[];

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Inscription non trouvée" },
      { status: 404 },
    );
  }

  revalidatePath("/admin/inscriptions");
  revalidatePath("/admin");

  return NextResponse.json({ ok: true });
}
