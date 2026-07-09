import { AppShell } from "@/components/layout/app-shell";
import { TasksPage } from "@/features/tasks/tasks-page";

export default function TasksRoute() {
  return (
    <AppShell>
      <TasksPage />
    </AppShell>
  );
}
