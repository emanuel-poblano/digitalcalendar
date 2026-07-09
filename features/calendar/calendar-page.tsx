import { EventBoard } from "@/features/calendar/event-board";

export function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Calendar</p>
        <h1 className="text-3xl font-semibold tracking-tight">Plan your time with intention.</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          The calendar layer helps you block focus time, protect recovery, and spot time-money tradeoffs.
        </p>
      </div>

      <EventBoard />
    </div>
  );
}
