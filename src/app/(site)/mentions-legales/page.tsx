import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales de l'Institut Al-Irtiqā' : éditeur, hébergeur, propriété intellectuelle.",
  robots: { index: true, follow: false },
};

export default function MentionsLegalesPage() {
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
        <div className="container-prose relative py-16 sm:py-20">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-dore">
            Légal
          </p>
          <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl leading-tight sm:text-5xl">
            Mentions légales
          </h1>
        </div>
      </section>

      <section className="bg-creme py-14 sm:py-20">
        <div className="container-prose">
          <article className="mx-auto max-w-2xl space-y-10 text-nuit/85">
            <Section title="Éditeur du site">
              <Field label="Dénomination">{site.name}</Field>
              <Field label="Forme juridique">[À COMPLÉTER]</Field>
              <Field label="Numéro SIRET">[À COMPLÉTER]</Field>
              <Field label="Siège social">[À COMPLÉTER — adresse postale]</Field>
              <Field label="Directeur de la publication">[À COMPLÉTER — nom prénom]</Field>
              <Field label="Email">{site.contact.email}</Field>
              <Field label="Téléphone / WhatsApp">
                {site.contact.whatsappDisplay}
              </Field>
            </Section>

            <Section title="Hébergement">
              <p>
                Le site <strong>{site.url.replace(/^https?:\/\//, "")}</strong>{" "}
                est hébergé par :
              </p>
              <Field label="Société">Vercel Inc.</Field>
              <Field label="Adresse">
                440 N Barranca Ave #4133, Covina, CA 91723, USA
              </Field>
              <Field label="Site">https://vercel.com</Field>
              <p className="mt-3 text-sm text-nuit/65">
                Le nom de domaine est enregistré chez Hostinger International
                Ltd, 61 Lordou Vironos Street, 6023 Larnaca, Chypre.
              </p>
            </Section>

            <Section title="Propriété intellectuelle">
              <p>
                L&apos;ensemble des contenus présents sur ce site (textes,
                images, logos, identité visuelle, supports pédagogiques) est
                la propriété exclusive de {site.name}, sauf mention contraire,
                et est protégé par le droit d&apos;auteur français et
                international.
              </p>
              <p className="mt-3">
                Toute reproduction, représentation, modification, publication,
                adaptation totale ou partielle, par quelque moyen ou procédé
                que ce soit, est interdite sans l&apos;autorisation écrite
                préalable de l&apos;éditeur.
              </p>
            </Section>

            <Section title="Liens hypertextes">
              <p>
                Le site peut contenir des liens vers d&apos;autres sites.
                {" "}
                {site.name} n&apos;exerce aucun contrôle sur ces sites tiers
                et décline toute responsabilité quant à leur contenu.
              </p>
            </Section>

            <Section title="Données personnelles">
              <p>
                Le traitement des données personnelles collectées sur ce site
                est détaillé dans notre{" "}
                <a
                  href="/confidentialite"
                  className="text-dore-700 underline hover:no-underline"
                >
                  politique de confidentialité
                </a>
                .
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Pour toute question relative à ces mentions légales,
                contactez-nous à l&apos;adresse{" "}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-dore-700 underline hover:no-underline"
                >
                  {site.contact.email}
                </a>
                .
              </p>
            </Section>

            <p className="border-t border-nuit/10 pt-6 text-xs text-nuit/45">
              Dernière mise à jour : [À COMPLÉTER — date]
            </p>
          </article>
        </div>
      </section>
    </main>
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
    <section>
      <h2 className="font-display text-xl text-nuit sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-2 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <p className="flex flex-wrap gap-x-2">
      <span className="text-nuit/60">{label} :</span>
      <span className="text-nuit">{children}</span>
    </p>
  );
}
