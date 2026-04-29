import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Programme — 15 niveaux",
  description:
    "Programme complet en 15 niveaux progressifs : alphabet, grammaire, conjugaison, lecture coranique.",
};

export default function Page() {
  return <PageStub title="Programme" kicker="15 niveaux progressifs" />;
}
