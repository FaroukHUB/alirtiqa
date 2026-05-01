import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import type { Inscription } from "@/lib/db";
import { InscriptionDetail } from "./InscriptionDetail";

const FORMULE_LABEL: Record<Inscription["formule"], string> = {
  particulier: "Cours particulier",
  duo: "Cours en duo",
  groupe: "Cours en groupe",
};

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

async function getInscription(id: string): Promise<Inscription | null> {
  const rows = (await sql`
    SELECT id, prenom, nom, email, telephone, age, formule, niveau,
           disponibilite, message, statut, note_admin, ip, user_agent,
           created_at, updated_at
    FROM inscriptions
    WHERE id = ${id}
    LIMIT 1
  `) as Inscription[];
  return rows[0] ?? null;
}

export default async function InscriptionPage({
  params,
}: {
  params: { id: string };
}) {
  const i = await getInscription(params.id);
  if (!i) notFound();

  const waNumber = i.telephone?.replace(/\D/g, "");
  const waUrl = waNumber ? `https://wa.me/${waNumber}` : null;

  return (
    <div className="px-8 py-10 sm:px-12 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/inscriptions"
          className="inline-flex items-center gap-1.5 text-xs text-nuit/55 transition-colors hover:text-dore-700"
        >
          ← Retour aux inscriptions
        </Link>

        <header className="mt-4">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-dore-700">
            Demande d&apos;inscription
          </p>
          <h1 className="mt-2 font-display text-3xl text-nuit">
            {i.prenom} {i.nom}
          </h1>
          <p className="mt-2 text-xs text-nuit/55">
            Reçue le {fmtDateTime(i.created_at)}
            {i.updated_at !== i.created_at && (
              <> · Mise à jour le {fmtDateTime(i.updated_at)}</>
            )}
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Section title="Coordonnées">
              <dl className="grid gap-3 sm:grid-cols-2">
                <Item label="Email">
                  <a
                    href={`mailto:${i.email}`}
                    className="text-nuit hover:text-dore-700"
                  >
                    {i.email}
                  </a>
                </Item>
                <Item label="Téléphone">
                  {i.telephone ? (
                    waUrl ? (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-nuit hover:text-dore-700"
                      >
                        {i.telephone} · WhatsApp ↗
                      </a>
                    ) : (
                      i.telephone
                    )
                  ) : (
                    <span className="text-nuit/45">—</span>
                  )}
                </Item>
                <Item label="Âge">
                  {i.age ?? <span className="text-nuit/45">—</span>}
                </Item>
              </dl>
            </Section>

            <Section title="Demande">
              <dl className="grid gap-3 sm:grid-cols-2">
                <Item label="Formule souhaitée">
                  {FORMULE_LABEL[i.formule]}
                </Item>
                <Item label="Niveau estimé">
                  {i.niveau ?? <span className="text-nuit/45">—</span>}
                </Item>
                <Item label="Disponibilités" wide>
                  {i.disponibilite ?? <span className="text-nuit/45">—</span>}
                </Item>
              </dl>
            </Section>

            {i.message && (
              <Section title="Message">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-nuit/85">
                  {i.message}
                </p>
              </Section>
            )}
          </div>

          <aside className="space-y-6">
            <InscriptionDetail inscription={i} />
          </aside>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-nuit/10 bg-white p-6">
      <h2 className="font-display text-xs uppercase tracking-[0.2em] text-nuit/55">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Item({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-[11px] uppercase tracking-[0.15em] text-nuit/50">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-nuit/85">{children}</dd>
    </div>
  );
}
