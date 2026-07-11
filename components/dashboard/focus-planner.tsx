"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, PencilLine, PlusCircle, Sparkles } from "lucide-react";

import type { PlannerSuggestion } from "@/lib/planner-suggestions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plannerToEvent = (block: PlannerBlock) => ({
  title: block.title,
  start: new Date().toISOString(),
  end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  category: "Focus",
  note: `Planned at ${block.time}`,
});

type PlannerBlock = {
  title: string;
  time: string;
  completed: boolean;
};

const defaultBlocks: PlannerBlock[] = [
  { title: "Deep work", time: "09:00", completed: false },
  { title: "Admin reset", time: "11:00", completed: false },
  { title: "Habit check-in", time: "19:00", completed: false },
];

function getStorageKey() {
  const today = new Date().toISOString().slice(0, 10);
  return `focus-planner:${today}`;
}

function readStoredBlocks() {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(getStorageKey());
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as PlannerBlock[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStoredBlocks(blocks: PlannerBlock[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getStorageKey(), JSON.stringify(blocks));
}

export function FocusPlanner() {
  const [blocks, setBlocks] = useState<PlannerBlock[]>(defaultBlocks);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftTime, setDraftTime] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<PlannerSuggestion[]>([]);

  useEffect(() => {
    const storedBlocks = readStoredBlocks();
    if (storedBlocks) {
      setBlocks(storedBlocks);
    }
  }, []);

  useEffect(() => {
    writeStoredBlocks(blocks);
  }, [blocks]);

  useEffect(() => {
    const loadSuggestions = async () => {
      const response = await fetch("/api/planner-suggestions");
      const data = (await response.json()) as PlannerSuggestion[];
      setSuggestions(data);
    };

    loadSuggestions();
  }, []);

  const completedCount = useMemo(() => blocks.filter((block) => block.completed).length, [blocks]);

  const toggleBlock = (index: number) => {
    setBlocks((current) => current.map((block, blockIndex) => (blockIndex === index ? { ...block, completed: !block.completed } : block)));
  };

  const addBlock = () => {
    const title = draftTitle.trim();
    const time = draftTime.trim();
    if (!title) return;

    if (editingIndex !== null) {
      setBlocks((current) => current.map((block, index) => (index === editingIndex ? { ...block, title, time: time || block.time } : block)));
      setEditingIndex(null);
    } else {
      setBlocks((current) => [...current, { title, time: time || "--:--", completed: false }]);
    }

    setDraftTitle("");
    setDraftTime("");
  };

  const startEditing = (index: number) => {
    const block = blocks[index];
    setEditingIndex(index);
    setDraftTitle(block.title);
    setDraftTime(block.time);
  };

  const scheduleBlock = async (block: PlannerBlock) => {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plannerToEvent(block)),
    });
  };

  return (
    <Card className="rounded-3xl border-indigo-200 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-cyan-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
          <Clock3 className="h-4 w-4" />
          Focus planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl bg-white/70 p-3 dark:bg-zinc-900/60">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-white">Today’s plan</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{completedCount} of {blocks.length} blocks complete</p>
          </div>
          <div className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400">
            {Math.round((completedCount / blocks.length) * 100)}%
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-zinc-200 p-3 dark:border-zinc-800">
          <p className="text-sm font-medium text-zinc-900 dark:text-white">Suggested next moves</p>
          <div className="mt-2 space-y-2">
            {suggestions.map((suggestion) => (
              <div key={suggestion.title} className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900/70">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{suggestion.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{suggestion.reason}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setDraftTitle(suggestion.title)}>
                  Use
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {blocks.map((block, index) => (
            <div key={`${block.title}-${index}`} className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{block.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{block.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => startEditing(index)} aria-label="Edit block">
                  <PencilLine className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => scheduleBlock(block)}>
                  Schedule
                </Button>
                <Button variant={block.completed ? "default" : "outline"} size="sm" onClick={() => toggleBlock(index)}>
                  {block.completed ? "Done" : "Mark"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-dashed border-zinc-200 p-3 dark:border-zinc-800">
          <div className="grid gap-2 md:grid-cols-[1.2fr_0.6fr]">
            <input
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
              placeholder="Block title"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
            />
            <input
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
              placeholder="Time"
              value={draftTime}
              onChange={(event) => setDraftTime(event.target.value)}
            />
          </div>
          <Button className="mt-3" onClick={addBlock}>
            <PlusCircle className="mr-1 h-4 w-4" />
            {editingIndex !== null ? "Save block" : "Add block"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
