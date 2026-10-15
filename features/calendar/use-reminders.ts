"use client";

import { useEffect, useRef } from "react";

import { expandOccurrences, type RecurringSource } from "@/lib/recurrence";

type ReminderEvent = RecurringSource & { title: string; reminderMinutes?: number | null };

/** Fires browser notifications for upcoming occurrences that have a reminder set. */
export function useReminders(events: ReminderEvent[]) {
  const fired = useRef(new Set<string>());

  useEffect(() => {
    if (typeof Notification === "undefined") return;
    if (events.some((e) => e.reminderMinutes != null) && Notification.permission === "default") {
      void Notification.requestPermission();
    }

    const check = () => {
      if (Notification.permission !== "granted") return;
      const now = new Date();
      const horizon = new Date(now.getTime() + 25 * 60 * 60 * 1000);
      for (const o of expandOccurrences(events.filter((e) => e.reminderMinutes != null), now, horizon)) {
        const fireAt = o.occurrenceStart.getTime() - (o.reminderMinutes ?? 0) * 60000;
        const key = `${o.id}-${o.occurrenceStart.toISOString()}`;
        if (fireAt <= now.getTime() && o.occurrenceStart.getTime() > now.getTime() - 60000 && !fired.current.has(key)) {
          fired.current.add(key);
          new Notification(o.title, { body: `Starts at ${o.occurrenceStart.toLocaleTimeString()}` });
        }
      }
    };

    check();
    const timer = setInterval(check, 30000);
    return () => clearInterval(timer);
  }, [events]);
}
