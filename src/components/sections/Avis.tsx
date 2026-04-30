import Link from "next/link";
import { sql } from "@/lib/db";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AvisInner } from "./AvisInner";
import type { PublicAvis } from "@/components/avis/AvisCard";

async function getLatestApproved(limit: number): Promise<PublicAvis[]> {
  try {
    const rows = (await sql`
      SELECT id, nom, note, texte
      FROM avis
      WHERE statut = 'approved'
      ORDER BY moderated_at DESC NULLS LAST, created_at DESC
      LIMIT ${limit}
    `) as PublicAvis[];
    return rows;
  } catch (err) {
    console.error("getLatestApproved failed", err);
    return [];
  }
}

export async function Avis() {
  const avis = await getLatestApproved(4);

  if (avis.length === 0) return null;

  return (
    <section id="avis" className="relative overflow-hidden bg-creme py-14 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/35 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-dore/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-nuit/5 blur-3xl"
      />

      <div className="container-prose relative">
        <SectionHeading
          title="Avis"
          description="Nos élèves prennent la parole"
        />
      </div>

      <AvisInner avis={avis} />

      <div className="container-prose relative mt-10 flex justify-center">
        <Link
          href="/avis"
          className="group inline-flex items-center gap-2 text-sm font-medium text-dore-700 transition-colors hover:text-dore-600"
        >
          Voir tous nos avis
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-1"
            aria-hidden
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
