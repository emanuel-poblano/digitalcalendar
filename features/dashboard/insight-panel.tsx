"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, CalendarDays, CheckCircle2, Sparkles, Target, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type InsightSummary = {
  completedTasks: number;
  pendingTasks: number;
  completedHabits: number;
  scheduledEvents: number;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  streaks: number;
  recommendation: string;
};

export function InsightPanel() {
  const [summary, setSummary] = useState<InsightSummary | null>(null);

  useEffect(() => {
    const loadSummary = async () => {
      const response = await fetch("/api/insights");
      const data = (await response.json()) as InsightSummary;
      setSummary(data);
    };

    loadSummary();
  }, []);

  if (!summary) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-zinc-100 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <BrainCircuit className="h-4 w-4" />
            <span className="text-sm font-medium">Weekly pulse</span>
          </div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{summary.recommendation}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-900/80">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <CalendarDays className="h-4 w-4" />
              <span className="text-sm">Scheduled blocks</span>
            </div>
            <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">{summary.scheduledEvents}</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-3 dark:bg-zinc-900/80">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Net balance</span>
            </div>
            <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">${summary.netBalance.toFixed(2)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm">You completed {summary.completedTasks} tasks, {summary.completedHabits} habits, and built {summary.streaks} total habit streak days.</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Completed tasks</span>
            </div>
            <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">{summary.completedTasks}</p>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3 dark:border-indigo-500/20 dark:bg-indigo-500/10">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Pending tasks</span>
            </div>
            <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">{summary.pendingTasks}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
