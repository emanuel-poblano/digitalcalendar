import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { AppShell } from "@/components/layout/app-shell";

export default function Home() {
  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  );
}
