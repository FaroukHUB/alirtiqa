import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Props = {
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  kicker,
  title,
  description,
  align = "center",
  tone = "dark",
  className,
}: Props) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  const titleColor = tone === "light" ? "text-creme" : "text-nuit";
  const descColor = tone === "light" ? "text-creme/75" : "text-nuit/70";
  const kickerColor = tone === "light" ? "text-dore" : "text-dore-600";

  return (
    <div className={cn("mx-auto flex max-w-3xl flex-col gap-4", alignment, className)}>
      {kicker && (
        <p className={cn("font-display text-xs uppercase tracking-[0.4em]", kickerColor)}>
          {kicker}
        </p>
      )}
      <h2 className={cn("text-balance font-display text-3xl leading-tight sm:text-4xl md:text-5xl", titleColor)}>
        {title}
      </h2>
      {description && (
        <p className={cn("text-balance text-base sm:text-lg", descColor)}>{description}</p>
      )}
    </div>
  );
}
