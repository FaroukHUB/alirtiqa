import { sql } from "@/lib/db";
import type { Pdf } from "@/lib/db";
import { BibliothequeClient } from "./BibliothequeClient";

type PdfWithStats = Pdf & { nb_downloads: number };

async function getPdfs(): Promise<PdfWithStats[]> {
  return (await sql`
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
  `) as PdfWithStats[];
}

async function getCounts() {
  const rows = (await sql`
    SELECT
      COUNT(*)::int AS total_pdfs,
      SUM(CASE WHEN statut = 'published' THEN 1 ELSE 0 END)::int AS published,
      (SELECT COUNT(*)::int FROM pdf_downloads) AS total_downloads
    FROM pdfs
  `) as { total_pdfs: number; published: number; total_downloads: number }[];
  return rows[0];
}

export default async function BibliothequeAdminPage() {
  const [pdfs, counts] = await Promise.all([getPdfs(), getCounts()]);

  return (
    <div className="px-8 py-10 sm:px-12 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <header>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-dore-700">
            Documents
          </p>
          <h1 className="mt-2 font-display text-3xl text-nuit">Bibliothèque</h1>
          <p className="mt-3 max-w-2xl text-sm text-nuit/65">
            PDFs partagés sur la page publique{" "}
            <code className="rounded bg-nuit/5 px-1.5 py-0.5 text-xs">
              /bibliotheque
            </code>
            . Les visiteurs doivent laisser leur email pour télécharger
            (capture lead automatique).
          </p>
        </header>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <KpiCard label="Documents en ligne" value={counts.published} />
          <KpiCard label="Total documents" value={counts.total_pdfs} />
          <KpiCard label="Téléchargements" value={counts.total_downloads} />
        </div>

        <BibliothequeClient pdfs={pdfs} />
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-nuit/10 bg-white p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-nuit/55">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl text-nuit">{value}</p>
    </div>
  );
}
