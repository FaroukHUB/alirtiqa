import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

export default function Page() {
  return <PageStub title="Mentions légales" kicker="Informations" />;
}
