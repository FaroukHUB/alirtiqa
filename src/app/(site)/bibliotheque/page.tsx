import type { Metadata } from "next";
import { sql } from "@/lib/db";
import type { PdfCategorie } from "@/lib/db";
import { BibliothequeClient } from "./BibliothequeClient";

export const metadata: Metadata = {
  title: "Bibliothèque",
  description:
    "Documents PDF gratuits pour apprendre l'arabe : cahiers d'exercices, supports de cours, références. Méthode Al-Furqan.",
};

type PublicPdf = {
  id: string;
  titre: string;
  description: string | null;
  niveau: number | null;
  categorie: PdfCategorie;
  file_size: number | null;
  auteur: string | null;
  created_at: string;
};

async function getPdfs(): Promise<PublicPdf[]> {
  return (await sql`
    SELECT id, titre, description, niveau, categorie, file_size, auteur, created_at
    FROM pdfs
    WHERE statut = 'published'
    ORDER BY created_at DESC
  `) as PublicPdf[];
}

export default async function BibliothequePublicPage() {
  const pdfs = await getPdfs();

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-nuit text-creme">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-arabesque bg-[length:520px] opacity-[0.05]"
        />
        <div className="container-prose relative py-16 sm:py-20">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-dore">
            Bibliothèque
          </p>
          <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl leading-tight sm:text-5xl">
            Ressources pour apprendre l&apos;arabe
          </h1>
          <p className="mt-5 max-w-xl text-creme/75">
            Cahiers d&apos;exercices, supports de cours et documents de
            référence selon la méthode Al-Furqan. Téléchargement libre, après
            saisie de votre email.
          </p>
        </div>
      </section>

      <section className="bg-creme py-12 sm:py-16">
        <div className="container-prose">
          {pdfs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-nuit/15 bg-white p-12 text-center">
              <p className="font-display text-lg text-nuit/70">
                Aucun document disponible pour l&apos;instant.
              </p>
              <p className="mt-2 text-sm text-nuit/55">
                Revenez bientôt — la bibliothèque s&apos;enrichit
                régulièrement.
              </p>
            </div>
          ) : (
            <BibliothequeClient pdfs={pdfs} />
          )}
        </div>
      </section>
    </main>
  );
}
