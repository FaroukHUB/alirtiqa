import type { Metadata } from "next";
import { PageStub } from "@/components/layout/PageStub";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter l'Institut Al-Irtiqā' par WhatsApp, email ou Telegram.",
};

export default function Page() {
  return <PageStub title="Contact" kicker="Nous écrire" />;
}
