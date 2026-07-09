import { AppShell } from "@/components/layout/app-shell";
import { CalendarPage } from "@/features/calendar/calendar-page";

export default function CalendarRoute() {
  return (
    <AppShell>
      <CalendarPage />
    </AppShell>
  );
}
