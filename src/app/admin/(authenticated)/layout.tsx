import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-creme">
      <Sidebar adminEmail={session.user.email} />
      <main className="flex-1 overflow-x-hidden bg-white">{children}</main>
    </div>
  );
}
