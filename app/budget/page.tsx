import { AppShell } from "@/components/layout/app-shell";
import { BudgetPage } from "@/features/budget/budget-page";

export default function BudgetRoute() {
  return (
    <AppShell>
      <BudgetPage />
    </AppShell>
  );
}
