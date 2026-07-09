import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Flame,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { InsightChart } from "@/components/dashboard/insight-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingCard } from "@/components/onboarding/onboarding-card";
import { InsightPanel } from "@/features/dashboard/insight-panel";
import type { DashboardEvent, DashboardInsight, DashboardMetric, DashboardTask } from "@/types/app";

const metrics: DashboardMetric[] = [
  {
    title: "Today’s schedule",
    value: "3 events",
    detail: "Focus block at 9:00 AM",
    tone: "indigo",
  },
  {
    title: "Today’s budget",
    value: "$128 left",
    detail: "Healthy pace for the week",
    tone: "emerald",
  },
  {
    title: "Tasks due today",
    value: "5 tasks",
    detail: "2 high priority",
    tone: "amber",
  },
  {
    title: "Current streak",
    value: "7 days",
    detail: "Keep the momentum going",
    tone: "violet",
  },
];

const agenda: DashboardEvent[] = [
  { title: "Gym session", time: "6:30 PM", category: "Habit" },
  { title: "Pay electric bill", time: "8:00 PM", category: "Budget" },
  { title: "Side project sprint", time: "9:00 PM", category: "Goal" },
];

const tasks: DashboardTask[] = [
  { title: "Finish Java project outline", due: "Today · 2:00 PM", priority: "High" },
  { title: "Review monthly budget", due: "Today · 6:00 PM", priority: "Medium" },
  { title: "Call parents", due: "Tonight", priority: "Low" },
];

const insights: DashboardInsight[] = [
  {
    title: "You complete more work before noon",
    description: "Your best focus windows are earlier in the day.",
    impact: "Try your hardest task first.",
  },
  {
    title: "Weekend spending spikes",
    description: "Dining and errands are the main drivers.",
    impact: "A preset weekly cap would help.",
  },
  {
    title: "Your streak is healthy",
    description: "You are on pace for another strong week.",
    impact: "One quick habit check-in is enough today.",
  },
];

const toneStyles = {
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
};

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

      <OnboardingCard />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.title.includes("schedule") ? CalendarClock : metric.title.includes("budget") ? CreditCard : metric.title.includes("Tasks") ? CheckCircle2 : Sparkles;
          return (
            <Card key={metric.title} className="rounded-2xl">
              <CardHeader>
                <CardTitle>{metric.title}</CardTitle>
                <div className={`rounded-xl p-2 ${toneStyles[metric.tone]}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-zinc-950 dark:text-white">{metric.value}</div>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{metric.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900/80">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-zinc-950 dark:text-white">Momentum is building</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Your habit and task rhythm is trending upward this week.</p>
              </div>
            </div>

            <InsightChart data={[{ name: "Mon", value: 3 }, { name: "Tue", value: 5 }, { name: "Wed", value: 4 }, { name: "Thu", value: 6 }, { name: "Fri", value: 7 }]} />

            <div className="rounded-2xl border border-dashed border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-white">Focus block recommendation</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">You have 2 free hours today.</p>
                </div>
                <Button variant="outline" size="sm">
                  Suggest plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today at a glance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agenda.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-900/80">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.category}</p>
                </div>
                <span className="text-sm text-zinc-600 dark:text-zinc-300">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <InsightPanel />

        <Card>
          <CardHeader>
            <CardTitle>Tasks due today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((task) => (
              <div key={task.title} className="flex items-start justify-between gap-3 rounded-2xl border border-zinc-100 p-3 dark:border-zinc-800">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">{task.title}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{task.due}</p>
                  </div>
                </div>
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {task.priority}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Smart insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight) => (
              <div key={insight.title} className="rounded-2xl border border-zinc-100 p-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <p className="font-medium text-zinc-900 dark:text-white">{insight.title}</p>
                </div>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{insight.description}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <Target className="h-4 w-4" />
                  <span>{insight.impact}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-500/25 dark:bg-indigo-500/10">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
          <Flame className="h-5 w-5" />
          <span className="font-semibold">Momentum check</span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">You are 2 habits away from your weekly streak goal.</p>
        <Button variant="outline" size="sm" className="ml-auto">
          Continue streak <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
