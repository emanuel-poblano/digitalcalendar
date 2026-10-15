export type RecurrenceRule = "none" | "daily" | "weekly" | "monthly";

export interface RecurringSource {
  id: string;
  start: string;
  end?: string | null;
  recurrence?: RecurrenceRule;
}

export type Occurrence<T extends RecurringSource> = T & { occurrenceStart: Date; occurrenceEnd: Date | null };

function addInterval(date: Date, rule: RecurrenceRule, n: number) {
  const d = new Date(date);
  if (rule === "daily") d.setDate(d.getDate() + n);
  else if (rule === "weekly") d.setDate(d.getDate() + 7 * n);
  else if (rule === "monthly") {
    const day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + n);
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, last));
  }
  return d;
}

export function startOfWeek(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d;
}

/** Expand events (including recurring ones) into occurrences starting within [from, to). */
export function expandOccurrences<T extends RecurringSource>(events: T[], from: Date, to: Date): Occurrence<T>[] {
  const result: Occurrence<T>[] = [];
  for (const event of events) {
    const first = new Date(event.start);
    if (Number.isNaN(first.getTime())) continue;
    const duration = event.end ? new Date(event.end).getTime() - first.getTime() : null;
    const rule = event.recurrence ?? "none";
    let startIndex = 0;
    if (rule !== "none" && from > first) {
      const daysFromFirst = Math.floor(
        (Date.UTC(from.getFullYear(), from.getMonth(), from.getDate()) -
          Date.UTC(first.getFullYear(), first.getMonth(), first.getDate())) /
          86400000
      );
      if (rule === "daily") startIndex = daysFromFirst;
      else if (rule === "weekly") startIndex = Math.floor(daysFromFirst / 7);
      else if (rule === "monthly") {
        startIndex = (from.getFullYear() - first.getFullYear()) * 12 + from.getMonth() - first.getMonth();
      }
    }
    for (let i = startIndex; ; i++) {
      const start = rule === "none" ? first : addInterval(first, rule, i);
      if (start >= to) break;
      if (start >= from) {
        result.push({
          ...event,
          occurrenceStart: start,
          occurrenceEnd: duration !== null && duration >= 0 ? new Date(start.getTime() + duration) : null,
        });
      }
      if (rule === "none") break;
    }
  }
  return result.sort((a, b) => a.occurrenceStart.getTime() - b.occurrenceStart.getTime());
}
