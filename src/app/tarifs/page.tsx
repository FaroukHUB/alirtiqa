import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Tarifs des cours d'arabe : particulier, duo, groupe. À partir de 50 € / mois pour 8h de cours.",
};

export default function Page() {
  return <PageStub title="Tarifs" kicker="Cours en ligne" />;
}
