import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false },
};

export default function Page() {
  return <PageStub title="Politique de confidentialité" kicker="RGPD" />;
}
