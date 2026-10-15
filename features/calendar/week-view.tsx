"use client";

import { useMemo, useState } from "react";
import { Bell, ChevronLeft, ChevronRight, Repeat } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { expandOccurrences, startOfWeek } from "@/lib/recurrence";
import type { CalendarEventItem } from "@/features/calendar/event-board";

export function WeekView({ events }: { events: CalendarEventItem[] }) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i)),
    [weekStart],
  );

  const occurrences = useMemo(() => {
    const end = new Date(days[6].getFullYear(), days[6].getMonth(), days[6].getDate() + 1);
    return expandOccurrences(events, days[0], end);
  }, [events, days]);

  const move = (weeks: number) =>
    setWeekStart((c) => new Date(c.getFullYear(), c.getMonth(), c.getDate() + weeks * 7));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Week of {days[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" aria-label="Previous week" onClick={() => move(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setWeekStart(startOfWeek(new Date()))}>
            Today
          </Button>
          <Button variant="ghost" size="sm" aria-label="Next week" onClick={() => move(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {days.map((day) => {
            const items = occurrences.filter((o) => new Date(o.occurrenceStart).toDateString() === day.toDateString());
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 rounded-2xl border p-2 ${isToday ? "border-indigo-400" : "border-zinc-100 dark:border-zinc-800"}`}
              >
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {day.toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}
                </p>
                <div className="mt-2 space-y-1">
                  {items.map((o) => (
                    <div key={`${o.id}-${o.occurrenceStart}`} className="rounded-xl bg-zinc-50 p-2 text-xs dark:bg-zinc-900">
                      <p className="font-medium text-zinc-900 dark:text-white">{o.title}</p>
                      <p className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                        {new Date(o.occurrenceStart).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                        {o.recurrence && o.recurrence !== "none" && <Repeat className="h-3 w-3" />}
                        {o.reminderMinutes != null && <Bell className="h-3 w-3" />}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
