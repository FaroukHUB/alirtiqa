import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";

const heights: Record<Size, number> = { sm: 56, md: 72, lg: 180 };
const ratio = 740 / 844;

export function Logo({
  className,
  size = "md",
  href = "/",
}: {
  className?: string;
  size?: Size;
  tone?: "light" | "dark";
  href?: string | null;
}) {
  const h = heights[size];
  const w = Math.round(h * ratio);

  const img = (
    <Image
      src="/images/logoirtiqa.webp"
      alt="Institut Al-Irtiqā'"
      width={w}
      height={h}
      priority={size !== "sm"}
      className="block select-none"
      style={{ height: h, width: w, maxWidth: "none" }}
      draggable={false}
    />
  );

  const wrapperCls = cn("inline-flex shrink-0 items-center", className);

  if (!href) return <span className={wrapperCls}>{img}</span>;
  return (
    <Link href={href} className={wrapperCls}>
      {img}
    </Link>
  );
}
