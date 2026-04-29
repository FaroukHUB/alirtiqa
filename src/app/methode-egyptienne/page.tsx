import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "La méthode égyptienne",
  description:
    "Apprendre l'arabe selon la méthode égyptienne : Ajurrumiyya, Al-Furqan, grammaire et compréhension du Coran.",
};

export default function Page() {
  return <PageStub title="La méthode égyptienne" kicker="Pédagogie" />;
}
