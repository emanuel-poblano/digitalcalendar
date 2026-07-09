"use client";

import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OnboardingCard() {
  return (
    <Card className="rounded-3xl border-indigo-200 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-cyan-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
          <Sparkles className="h-4 w-4" />
          Quick start
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
        <p>1. Add one task you want to finish today.</p>
        <p>2. Block a focus window on the calendar.</p>
        <p>3. Record one transaction to see your cash flow.</p>
        <p>4. Check off a habit to build momentum.</p>
      </CardContent>
    </Card>
  );
}
