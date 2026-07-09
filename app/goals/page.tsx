import { AppShell } from "@/components/layout/app-shell";
import { GoalsPage } from "@/features/goals/goals-page";

export default function GoalsRoute() {
  return (
    <AppShell>
      <GoalsPage />
    </AppShell>
  );
}
