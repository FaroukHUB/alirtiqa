import Link from "next/link";
import { Logo } from "./Logo";
import { legalNav, mainNav } from "@/lib/nav";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}`;

  return (
    <footer className="relative bg-nuit text-creme/80">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/50 to-transparent"
      />

      <div className="container-prose grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-creme/70">
            Institut francophone d&apos;apprentissage de la langue arabe selon
            la méthode égyptienne. Cours en ligne via Zoom, à partir de 10 ans.
          </p>
        </div>

        <div>
          <h3 className="font-display text-xs uppercase tracking-[0.3em] text-dore">
            Navigation
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-dore">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xs uppercase tracking-[0.3em] text-dore">
            Contact
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-dore"
              >
                WhatsApp · {site.contact.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="hover:text-dore">
                {site.contact.email}
              </a>
            </li>
            <li>
              <a
                href={`https://t.me/${site.contact.telegram.replace(/^@/, "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-dore"
              >
                Telegram · {site.contact.telegram}
              </a>
            </li>
            <li className="text-creme/60">Cours en ligne via Zoom</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-dore/15">
        <div className="container-prose flex flex-col items-start justify-between gap-3 py-6 text-xs text-creme/50 sm:flex-row sm:items-center">
          <p>© {year} {site.name}. Tous droits réservés.</p>
          <ul className="flex gap-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-dore">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
