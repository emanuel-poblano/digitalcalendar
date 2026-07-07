import { CalendarClock, CheckCircle2, CreditCard, Sparkles, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const summaryCards = [
  {
    title: "Today’s schedule",
    value: "3 events",
    detail: "Focus block at 9:00 AM",
    icon: CalendarClock,
  },
  {
    title: "Today’s budget",
    value: "$128 left",
    detail: "Healthy pace for the week",
    icon: CreditCard,
  },
  {
    title: "Tasks due today",
    value: "5 tasks",
    detail: "2 high priority",
    icon: CheckCircle2,
  },
  {
    title: "Current streak",
    value: "7 days",
    detail: "Keep the momentum going",
    icon: Sparkles,
  },
];

const upcomingItems = [
  "Gym session at 6:30 PM",
  "Pay electric bill",
  "Review side project sprint",
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Good morning</p>
          <h1 className="text-3xl font-semibold tracking-tight">Your life, in balance.</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            LifeOS helps you connect your calendar, money, goals, and habits in one calm workspace.
          </p>
        </div>
        <Button className="w-full md:w-auto">Plan my day</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="rounded-2xl">
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <Icon className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-zinc-950 dark:text-white">{card.value}</div>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{card.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900/80">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-zinc-950 dark:text-white">$1,240 spent</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">You are 12% under your weekly target.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {upcomingItems.map((item) => (
                <li key={item} className="flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-900/80">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
