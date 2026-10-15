"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { expandOccurrences, startOfWeek, type RecurringSource } from "@/lib/recurrence";

type WeekEvent = RecurringSource & { title: string; category: string };

export function WeekView({ events }: { events: WeekEvent[] }) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const occurrences = expandOccurrences(events, weekStart, weekEnd);
  const today = new Date().toDateString();

  const shift = (weeks: number) =>
    setWeekStart((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + 7 * weeks);
      return next;
    });

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>
          Week of {weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" aria-label="Previous week" onClick={() => shift(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setWeekStart(startOfWeek(new Date()))}>
            Today
          </Button>
          <Button variant="ghost" size="sm" aria-label="Next week" onClick={() => shift(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {days.map((day) => {
            const items = occurrences.filter((o) => o.occurrenceStart.toDateString() === day.toDateString());
            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 rounded-2xl border p-2 ${
                  day.toDateString() === today
                    ? "border-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10"
                    : "border-zinc-100 dark:border-zinc-800"
                }`}
              >
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {day.toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}
                </p>
                <div className="mt-2 space-y-1">
                  {items.map((o) => (
                    <div
                      key={`${o.id}-${o.occurrenceStart.toISOString()}`}
                      className="rounded-xl bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800"
                    >
                      <span className="font-medium">
                        {o.occurrenceStart.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </span>{" "}
                      {o.title}
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
