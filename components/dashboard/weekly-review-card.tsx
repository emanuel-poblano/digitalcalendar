"use client";

import { CalendarDays, DollarSign, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WeeklyReviewCard() {
  return (
    <Card className="rounded-3xl border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:border-violet-500/20 dark:from-violet-500/10 dark:to-fuchsia-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
          <CalendarDays className="h-4 w-4" />
          Weekly review
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white/70 p-3 dark:bg-zinc-900/60">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">Wins</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">4 completed</p>
        </div>
        <div className="rounded-2xl bg-white/70 p-3 dark:bg-zinc-900/60">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Budget</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">On track</p>
        </div>
        <div className="rounded-2xl bg-white/70 p-3 dark:bg-zinc-900/60">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
            <CalendarDays className="h-4 w-4" />
            <span className="text-sm font-medium">Focus</span>
          </div>
          <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">2 deep blocks</p>
        </div>
      </CardContent>
    </Card>
  );
}
