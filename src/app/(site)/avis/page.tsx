import type { Metadata } from "next";
import { sql } from "@/lib/db";
import { AvisCard, type PublicAvis } from "@/components/avis/AvisCard";
import { SubmitForm } from "./SubmitForm";

export const metadata: Metadata = {
  title: "Avis",
  description:
    "Avis et témoignages des élèves de l'Institut Al-Irtiqā'. Nos élèves prennent la parole.",
};

async function getApprovedAvis(): Promise<PublicAvis[]> {
  try {
    const rows = (await sql`
      SELECT id, nom, note, texte
      FROM avis
      WHERE statut = 'approved'
      ORDER BY moderated_at DESC NULLS LAST, created_at DESC
    `) as PublicAvis[];
    return rows;
  } catch (err) {
    console.error("getApprovedAvis failed", err);
    return [];
  }
}

export default async function AvisPage() {
  const avis = await getApprovedAvis();

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-nuit text-creme">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-zellige bg-[length:160px] opacity-[0.06]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
        />
        <div className="container-prose relative py-20 sm:py-24">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-dore">
            Avis
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            Nos élèves prennent la parole
          </h1>
          <p className="mt-4 max-w-xl text-creme/75">
            {avis.length > 0
              ? `${avis.length} témoignage${avis.length > 1 ? "s" : ""} d'élèves qui ont rejoint l'institut.`
              : "Soyez le premier à laisser votre avis."}
          </p>
        </div>
      </section>

      {avis.length > 0 && (
        <section className="bg-creme py-16 sm:py-20">
          <div className="container-prose">
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {avis.map((a) => (
                <AvisCard key={a.id} avis={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-creme pb-20 pt-4 sm:pb-24">
        <div className="container-prose">
          <div className="mx-auto max-w-2xl">
            <SubmitForm />
          </div>
        </div>
      </section>
    </main>
  );
}
