"use client";

import { CheckCircle2, Sparkles, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DailyReviewCard() {
  return (
    <Card className="rounded-3xl border-emerald-200 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:border-emerald-500/20 dark:from-emerald-500/10 dark:to-cyan-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
          <Sparkles className="h-4 w-4" />
          Daily review
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
          <p>3 wins already captured today: one completed task, one checked-off habit, and one focused block.</p>
        </div>
        <div className="flex items-start gap-2">
          <Target className="mt-0.5 h-4 w-4 text-indigo-600" />
          <p>Next step: finish one high-priority task before dinner to keep the momentum strong.</p>
        </div>
      </CardContent>
    </Card>
  );
}
