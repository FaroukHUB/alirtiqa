import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const accent = tone === "light" ? "text-dore" : "text-dore-600";
  const main = tone === "light" ? "text-creme" : "text-nuit";
  return (
    <Link href="/" className={cn("group inline-flex items-baseline gap-2", className)}>
      <span aria-hidden className={cn("font-display text-2xl leading-none", accent)}>
        ٱ
      </span>
      <span className={cn("font-display text-lg tracking-[0.18em] uppercase", main)}>
        Al-Irtiqā&apos;
      </span>
    </Link>
  );
}
