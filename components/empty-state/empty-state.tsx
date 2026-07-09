"use client";

import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="rounded-2xl border-dashed border-zinc-200 dark:border-zinc-800">
      <CardContent className="flex flex-col items-start gap-2 p-4">
        <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400">
          <Sparkles className="h-4 w-4" />
        </div>
        <p className="font-medium text-zinc-900 dark:text-white">{title}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      </CardContent>
    </Card>
  );
}
