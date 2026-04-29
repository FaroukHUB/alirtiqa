import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

const heights: Record<Size, number> = { sm: 32, md: 44, lg: 64 };
const intrinsic = { w: 1024, h: 1536 };

export function Logo({
  className,
  size = "md",
  withWordmark = false,
  tone = "light",
  href = "/",
}: {
  className?: string;
  size?: Size;
  withWordmark?: boolean;
  tone?: "light" | "dark";
  href?: string | null;
}) {
  const h = heights[size];
  const w = Math.round((h * intrinsic.w) / intrinsic.h);
  const wordmarkColor = tone === "light" ? "text-creme" : "text-nuit";

  const content = (
    <>
      <Image
        src="/images/logoirtiqa.webp"
        alt="Institut Al-Irtiqā'"
        width={w}
        height={h}
        priority={size !== "sm"}
        className="h-auto w-auto"
        style={{ height: h, width: w }}
      />
      {withWordmark && (
        <span
          className={cn(
            "font-display text-base tracking-[0.18em] uppercase sm:text-lg",
            wordmarkColor,
          )}
        >
          Al-Irtiqā&apos;
        </span>
      )}
    </>
  );

  if (!href) {
    return <span className={cn("inline-flex items-center gap-3", className)}>{content}</span>;
  }

  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)}>
      {content}
    </Link>
  );
}
