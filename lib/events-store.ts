import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export interface CalendarEventRecord {
  id: string;
  title: string;
  start: string;
  end?: string | null;
  allDay?: boolean;
  category: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEventInput {
  title: string;
  start: string;
  end?: string | null;
  allDay?: boolean;
  category?: string;
  note?: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "events.json");

async function ensureStoreFile() {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readEvents(): Promise<CalendarEventRecord[]> {
  await ensureStoreFile();
  const content = await readFile(DATA_FILE, "utf8");
  return JSON.parse(content) as CalendarEventRecord[];
}

async function writeEvents(events: CalendarEventRecord[]) {
  await ensureStoreFile();
  await writeFile(DATA_FILE, JSON.stringify(events, null, 2), "utf8");
}

export async function getEvents() {
  return readEvents();
}

export async function createEvent(input: CalendarEventInput) {
  const events = await readEvents();
  const event: CalendarEventRecord = {
    id: `event-${Date.now()}`,
    title: input.title.trim(),
    start: input.start,
    end: input.end ?? null,
    allDay: input.allDay ?? false,
    category: input.category ?? "Focus",
    note: input.note?.trim() ?? "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  events.unshift(event);
  await writeEvents(events);
  return event;
}

export async function deleteEvent(id: string) {
  const events = await readEvents();
  const nextEvents = events.filter((event) => event.id !== id);
  await writeEvents(nextEvents);
  return nextEvents;
}
