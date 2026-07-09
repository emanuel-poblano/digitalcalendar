"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state/empty-state";

export type CalendarEventItem = {
  id: string;
  title: string;
  start: string;
  end?: string | null;
  allDay?: boolean;
  category: string;
  note?: string;
};

export function EventBoard() {
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ title: "", start: "", end: "", category: "Focus", note: "" });

  const loadEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = (await response.json()) as CalendarEventItem[];
      setEvents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreate = async () => {
    if (!draft.title.trim() || !draft.start) return;

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    setDraft({ title: "", start: "", end: "", category: "Focus", note: "" });
    await loadEvents();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadEvents();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          <CardTitle>Schedule a block</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-2xl border border-dashed border-zinc-200 p-3 dark:border-zinc-800">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                placeholder="Event title"
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              />
              <select
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                value={draft.category}
                onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
              >
                <option value="Focus">Focus</option>
                <option value="Habit">Habit</option>
                <option value="Budget">Budget</option>
                <option value="Personal">Personal</option>
              </select>
              <input
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                type="datetime-local"
                value={draft.start}
                onChange={(event) => setDraft((current) => ({ ...current, start: event.target.value }))}
              />
              <input
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                type="datetime-local"
                value={draft.end}
                onChange={(event) => setDraft((current) => ({ ...current, end: event.target.value }))}
              />
              <textarea
                className="md:col-span-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                placeholder="Add context or notes"
                value={draft.note}
                onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
              />
            </div>
            <Button className="mt-3" onClick={handleCreate}>
              <PlusCircle className="mr-1 h-4 w-4" />
              Save block
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading calendar…</p>
          ) : events.length === 0 ? (
            <EmptyState title="No blocks yet" description="Add your first focus session or personal event." />
          ) : (
            events.map((event) => (
              <div key={event.id} className="rounded-2xl border border-zinc-100 p-3 dark:border-zinc-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">{event.title}</p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{event.note}</p>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {event.category}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                  <span>{new Date(event.start).toLocaleString()}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="mr-1 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Smart suggestion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900/80">
            <div className="rounded-2xl bg-amber-100 p-2 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-white">You have 2 free hours.</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Would you like to work on your side project?</p>
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span className="text-sm">Your calendar will soon learn from your habits and suggest recurring time blocks automatically.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
