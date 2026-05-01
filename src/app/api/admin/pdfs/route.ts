import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { put } from "@vercel/blob";
import { authOptions } from "@/lib/auth";
import { sql } from "@/lib/db";
import type { Pdf, PdfCategorie } from "@/lib/db";

const CATEGORIES: PdfCategorie[] = [
  "exercices",
  "cours",
  "reference",
  "coran",
  "lecture",
  "autre",
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = (await sql`
    SELECT p.id, p.titre, p.description, p.niveau, p.categorie,
           p.blob_url, p.blob_pathname, p.file_size, p.auteur, p.statut,
           p.created_at, p.updated_at,
           COALESCE(d.nb_downloads, 0)::int AS nb_downloads
    FROM pdfs p
    LEFT JOIN (
      SELECT pdf_id, COUNT(*)::int AS nb_downloads
      FROM pdf_downloads GROUP BY pdf_id
    ) d ON d.pdf_id = p.id
    ORDER BY p.created_at DESC
  `) as (Pdf & { nb_downloads: number })[];

  return NextResponse.json({ pdfs: rows });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "BLOB_READ_WRITE_TOKEN non configuré. Crée un Blob Store sur Vercel et ajoute la variable d'environnement.",
      },
      { status: 500 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "FormData invalide" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  const titre = (formData.get("titre") as string | null)?.trim() ?? "";
  const description =
    (formData.get("description") as string | null)?.trim() ?? "";
  const auteur = (formData.get("auteur") as string | null)?.trim() ?? "";
  const niveauRaw = formData.get("niveau") as string | null;
  const categorie = formData.get("categorie") as string | null;
  const statut = (formData.get("statut") as string | null) ?? "published";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Seuls les fichiers PDF sont acceptés" },
      { status: 400 },
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `Fichier trop volumineux (max ${MAX_FILE_SIZE / 1024 / 1024} MB)` },
      { status: 400 },
    );
  }
  if (titre.length < 2 || titre.length > 200) {
    return NextResponse.json(
      { error: "Titre requis (2 à 200 caractères)" },
      { status: 400 },
    );
  }
  if (!categorie || !CATEGORIES.includes(categorie as PdfCategorie)) {
    return NextResponse.json(
      { error: "Catégorie invalide" },
      { status: 400 },
    );
  }
  const niveau =
    niveauRaw && /^\d+$/.test(niveauRaw)
      ? Math.min(15, Math.max(1, parseInt(niveauRaw, 10)))
      : null;

  // Sanitize filename: keep only safe chars + add timestamp prefix
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 100);
  const pathname = `bibliotheque/${Date.now()}-${safeName}`;

  let blob: { url: string; pathname: string };
  try {
    blob = await put(pathname, file, { access: "public" });
  } catch (err) {
    console.error("[pdfs] échec upload Blob:", err);
    return NextResponse.json(
      { error: "Échec de l'upload sur Vercel Blob" },
      { status: 502 },
    );
  }

  const rows = (await sql`
    INSERT INTO pdfs
      (titre, description, niveau, categorie, blob_url, blob_pathname, file_size, auteur, statut)
    VALUES
      (${titre},
       ${description.length > 0 ? description : null},
       ${niveau},
       ${categorie},
       ${blob.url},
       ${blob.pathname},
       ${file.size},
       ${auteur.length > 0 ? auteur : null},
       ${statut === "draft" || statut === "archived" ? statut : "published"})
    RETURNING id
  `) as { id: string }[];

  revalidatePath("/admin/bibliotheque");
  revalidatePath("/bibliotheque");

  return NextResponse.json({ ok: true, id: rows[0].id });
}
