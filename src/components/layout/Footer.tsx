import Link from "next/link";
import { Logo } from "./Logo";
import { legalNav, mainNav } from "@/lib/nav";
import { site } from "@/lib/site";

const whatsappUrl = `https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}`;
const telegramHandle = site.contact.telegram.replace(/^@/, "");
const telegramUrl = `https://t.me/${telegramHandle}`;
const instagramUrl = `https://www.instagram.com/${site.contact.instagram}`;

function Chip({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-8 w-8 flex-none items-center justify-center rounded-full text-white shadow-sm transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      {children}
    </span>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.992c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.24 3.64 11.95c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.95" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-creme text-nuit/80">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dore/50 to-transparent"
      />

      <div className="container-prose grid gap-12 py-16 text-center md:grid-cols-4 md:text-left">
        <div className="md:col-span-2">
          <div className="flex justify-center md:justify-start">
            <Logo />
          </div>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-nuit/65 md:mx-0">
            Institut francophone d&apos;apprentissage de la langue arabe selon
            la méthode égyptienne. Cours en ligne via Zoom, à partir de 10 ans.
          </p>
        </div>

        <div>
          <h3 className="font-display text-xs uppercase tracking-[0.3em] text-dore-700">
            Navigation
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-nuit/75 transition-colors hover:text-dore-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xs uppercase tracking-[0.3em] text-dore-700">
            Contact
          </h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 text-nuit/75 transition-colors hover:text-dore-700"
              >
                <Chip className="bg-[#25D366]">
                  <WhatsAppIcon />
                </Chip>
                <span>{site.contact.whatsappDisplay}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="group inline-flex items-center gap-3 text-nuit/75 transition-colors hover:text-dore-700"
              >
                <Chip className="bg-nuit">
                  <MailIcon />
                </Chip>
                <span className="break-all">{site.contact.email}</span>
              </a>
            </li>
            <li>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 text-nuit/75 transition-colors hover:text-dore-700"
              >
                <Chip className="bg-[#229ED9]">
                  <TelegramIcon />
                </Chip>
                <span>Telegram</span>
              </a>
            </li>
            <li>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 text-nuit/75 transition-colors hover:text-dore-700"
              >
                <Chip className="bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]">
                  <InstagramIcon />
                </Chip>
                <span>@{site.contact.instagram}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-dore/20">
        <div className="container-prose flex flex-col items-center justify-between gap-3 py-6 text-xs text-nuit/55 sm:flex-row">
          <p>
            © {year} {site.name} — Site réalisé par{" "}
            <a
              href="https://www.mon-agenceweb.fr"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-nuit/75 transition-colors hover:text-dore-700"
            >
              Farouk Web Design
            </a>
          </p>
          <ul className="flex gap-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-dore-700">
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
