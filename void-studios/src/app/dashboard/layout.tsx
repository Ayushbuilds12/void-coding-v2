import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { ensureUser, getSubscription } from "@/lib/db";
import { getPlan } from "@/lib/types";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  await ensureUser(user);
  const subscription = await getSubscription(user.uid);
  const plan = getPlan(subscription?.plan || "free");

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar planName={plan?.name || "Free"} />
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <DashboardTopbar
          name={user.name}
          email={user.email}
          photoURL={user.picture}
          planName={plan?.name || "Free"}
        />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
