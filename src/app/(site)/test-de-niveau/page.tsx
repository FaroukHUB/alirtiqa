import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Test de niveau",
  description:
    "Évaluez votre niveau d'arabe avec notre test adaptatif de 15 niveaux. Résultat immédiat.",
};

export default function Page() {
  return <PageStub title="Test de niveau" kicker="Évaluation adaptative" />;
}
