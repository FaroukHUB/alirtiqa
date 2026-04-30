import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Chatbot } from "@/components/chatbot/Chatbot";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <Chatbot />
    </>
  );
}
