import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import type { Inscription } from "@/lib/db";

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const HEADERS = [
  "id",
  "prenom",
  "nom",
  "email",
  "telephone",
  "age",
  "formule",
  "niveau",
  "disponibilite",
  "message",
  "statut",
  "note_admin",
  "created_at",
  "updated_at",
] as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = (await sql`
    SELECT id, prenom, nom, email, telephone, age, formule, niveau,
           disponibilite, message, statut, note_admin, created_at, updated_at
    FROM inscriptions
    ORDER BY created_at DESC
  `) as Inscription[];

  const lines = [
    HEADERS.join(","),
    ...rows.map((r) =>
      HEADERS.map((h) => csvEscape(r[h as keyof Inscription])).join(","),
    ),
  ];
  const csv = "﻿" + lines.join("\r\n");

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscriptions-${date}.csv"`,
    },
  });
}
