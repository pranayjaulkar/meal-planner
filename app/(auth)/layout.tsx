import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session.isAuthenticated) {
    redirect("/meals");
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        {children}
      </div>
    </main>
  );
}