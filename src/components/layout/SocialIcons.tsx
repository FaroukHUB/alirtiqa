import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

const telegramHandle = site.contact.telegram.replace(/^@/, "");
const telegramUrl = `https://t.me/${telegramHandle}`;
const instagramUrl = `https://www.instagram.com/${site.contact.instagram}`;

const baseBtn =
  "inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-sm transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dore";

export function SocialIcons({
  className,
  iconClassName,
  size = 22,
}: {
  className?: string;
  iconClassName?: string;
  size?: number;
}) {
  return (
    <ul className={cn("flex items-center gap-3", className)}>
      <li>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Telegram"
          className={cn(baseBtn, "bg-[#229ED9] hover:bg-[#1d8dc2]", iconClassName)}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.24 3.64 11.95c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
          </svg>
        </a>
      </li>
      <li>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className={cn(
            baseBtn,
            "bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]",
            iconClassName,
          )}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.95" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </li>
    </ul>
  );
}
