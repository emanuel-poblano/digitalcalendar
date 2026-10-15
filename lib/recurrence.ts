export type Recurrence = "none" | "daily" | "weekly" | "monthly";

export interface RecurringSource {
  id: string;
  start: string;
  end?: string | null;
  recurrence?: Recurrence;
}

export type Occurrence<T extends RecurringSource> = T & {
  occurrenceStart: string;
  occurrenceEnd: string | null;
};

function shift(date: Date, recurrence: Recurrence, n: number) {
  const d = new Date(date);
  if (recurrence === "daily") d.setDate(d.getDate() + n);
  else if (recurrence === "weekly") d.setDate(d.getDate() + 7 * n);
  else if (recurrence === "monthly") {
    const day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + n);
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, last));
  }
  return d;
}

/** Expand events (including recurring ones) into occurrences within [from, to). */
export function expandOccurrences<T extends RecurringSource>(events: T[], from: Date, to: Date): Occurrence<T>[] {
  const result: Occurrence<T>[] = [];
  for (const event of events) {
    const start = new Date(event.start);
    if (Number.isNaN(start.getTime())) continue;
    const duration = event.end ? new Date(event.end).getTime() - start.getTime() : null;
    const recurrence = event.recurrence ?? "none";
    for (let n = 0; n < 5000; n++) {
      const occ = recurrence === "none" ? start : shift(start, recurrence, n);
      if (occ >= to) break;
      if (occ >= from) {
        result.push({
          ...event,
          occurrenceStart: occ.toISOString(),
          occurrenceEnd: duration === null ? null : new Date(occ.getTime() + duration).toISOString(),
        });
      }
      if (recurrence === "none") break;
    }
  }
  return result.sort((a, b) => a.occurrenceStart.localeCompare(b.occurrenceStart));
}

export function startOfWeek(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d;
}
