import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";

const bodySchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(500),
  action: z.enum(["publish", "draft", "archive", "delete"]),
});

export async function POST(req: NextRequest) {
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

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { ids, action } = parsed.data;

  let count = 0;
  if (action === "delete") {
    const rows = (await sql`
      DELETE FROM questions WHERE id = ANY(${ids}::uuid[]) RETURNING id
    `) as { id: string }[];
    count = rows.length;
  } else {
    const statut =
      action === "publish"
        ? "published"
        : action === "draft"
          ? "draft"
          : "archived";
    const rows = (await sql`
      UPDATE questions
      SET statut = ${statut}, updated_at = NOW()
      WHERE id = ANY(${ids}::uuid[])
      RETURNING id
    `) as { id: string }[];
    count = rows.length;
  }

  revalidatePath("/admin/questions");
  return NextResponse.json({ ok: true, count });
}
