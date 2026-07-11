"use client";

import { CalendarClock, CheckCircle2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type TodayFocusItem = {
  id?: string;
  title: string;
  subtitle: string;
  kind: "task" | "event" | "planner";
};

export function TodayFocusCard({ items, onActionComplete }: { items: TodayFocusItem[]; onActionComplete?: () => void }) {
  const router = useRouter();

  const handleAction = async (item: TodayFocusItem) => {
    if (item.kind === "task" && item.id) {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status: "done" }),
      });

      if (!response.ok) {
        return;
      }

      onActionComplete?.();
      return;
    }

    if (item.kind === "event") {
      router.push("/calendar");
      onActionComplete?.();
    }
  };
  return (
    <Card className="rounded-3xl border-emerald-200 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:border-emerald-500/20 dark:from-emerald-500/10 dark:to-cyan-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
          <Sparkles className="h-4 w-4" />
          Today’s focus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={`${item.kind}-${item.title}`} className="flex items-start justify-between gap-3 rounded-2xl bg-white/70 px-3 py-2 dark:bg-zinc-900/60">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                {item.kind === "event" ? <CalendarClock className="h-4 w-4 text-indigo-600" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{item.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.subtitle}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleAction(item)}>
              {item.kind === "event" ? "Open" : "Done"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
