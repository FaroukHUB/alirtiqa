import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { ContactAction } from "./ContactAction";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contacter l'Institut Al-Irtiqā' par WhatsApp, email ou Telegram. Réponse rapide.",
};

const whatsappNumber = site.contact.whatsapp.replace(/\D/g, "");
const whatsappUrl = `https://wa.me/${whatsappNumber}`;
const telegramHandle = site.contact.telegram.replace(/^@/, "");
const telegramUrl = `https://t.me/${telegramHandle}`;

type Channel = {
  label: string;
  description: string;
  value: string;
  cta: string;
  action:
    | { kind: "external"; href: string }
    | { kind: "copy"; copyValue: string };
  icon: React.ReactNode;
};

const channels: Channel[] = [
  {
    label: "WhatsApp",
    description: "Le canal le plus rapide pour échanger avec nous.",
    value: site.contact.whatsappDisplay,
    action: { kind: "external", href: whatsappUrl },
    cta: "Ouvrir WhatsApp",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden
      >
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
  },
  {
    label: "Email",
    description: "Pour les demandes plus longues ou les pièces jointes.",
    value: site.contact.email,
    action: { kind: "copy", copyValue: site.contact.email },
    cta: "Copier l'adresse",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "Telegram",
    description: "Suivez nos publications et posez vos questions au canal.",
    value: site.contact.telegram,
    action: { kind: "external", href: telegramUrl },
    cta: "Ouvrir Telegram",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden
      >
        <path d="M21.5 4.5L2.5 12.5l6 2 2 6 4-4 5 5 2-17z" />
      </svg>
    ),
  },
] as const;

export default function ContactPage() {
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
            Contact
          </p>
          <h1 className="mt-3 max-w-2xl text-balance font-display text-4xl leading-tight sm:text-5xl">
            Une question ? On vous répond
          </h1>
        </div>
      </section>

      <section className="bg-creme py-14 sm:py-20">
        <div className="container-prose">
          <ul className="grid gap-5 md:grid-cols-3">
            {channels.map((c) => (
              <li
                key={c.label}
                className="group flex flex-col rounded-2xl border border-nuit/10 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-dore/40 hover:shadow-[0_8px_28px_rgba(10,26,63,0.08)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-dore/10 text-dore-700">
                  {c.icon}
                </div>
                <h2 className="mt-4 font-display text-lg text-nuit">
                  {c.label}
                </h2>
                <p className="mt-1.5 text-sm text-nuit/65">{c.description}</p>
                <p className="mt-3 break-words font-mono text-sm text-nuit/85">
                  {c.value}
                </p>
                {c.action.kind === "external" ? (
                  <ContactAction
                    kind="external"
                    href={c.action.href}
                    label={c.cta}
                  />
                ) : (
                  <ContactAction
                    kind="copy"
                    value={c.action.copyValue}
                    label={c.cta}
                    labelDone="Adresse copiée !"
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <InfoCard
              kicker="Disponibilité"
              title="Réponse sous 48h ouvrées"
              description="Notre équipe traite chaque demande personnellement. Les soirs et week-ends peuvent connaître un léger délai."
            />
            <InfoCard
              kicker="Format"
              title="Cours 100% en ligne via Zoom"
              description="Aucun déplacement. Vous suivez vos cours depuis chez vous, où que vous soyez en France, en Europe ou au Maghreb."
            />
          </div>
        </div>
      </section>

      <section className="relative bg-nuit text-creme">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/60 to-transparent"
        />
        <div className="container-prose py-14 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-dore">
              Plutôt prêt à vous lancer ?
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">
              Demandez votre inscription en quelques clics
            </h2>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/inscription"
                className="inline-flex items-center justify-center rounded-full bg-dore px-6 py-3 text-sm font-medium text-nuit transition-colors hover:bg-dore-300"
              >
                S&apos;inscrire →
              </Link>
              <Link
                href="/test-de-niveau"
                className="inline-flex items-center justify-center rounded-full border border-creme/30 px-6 py-3 text-sm font-medium text-creme transition-colors hover:border-dore/60 hover:bg-creme/5"
              >
                Faire le test de niveau
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-nuit/10 bg-white p-6">
      <p className="font-display text-[10px] uppercase tracking-[0.3em] text-dore-700">
        {kicker}
      </p>
      <h3 className="mt-2 font-display text-lg text-nuit">{title}</h3>
      <p className="mt-2 text-sm text-nuit/70 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
