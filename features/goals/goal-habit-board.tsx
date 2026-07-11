"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Sparkles, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state/empty-state";
import { calculateGoalProgress } from "@/lib/progress-utils";

export type GoalItem = {
  id: string;
  title: string;
  description?: string;
  target: number;
  current: number;
  deadline?: string;
  kind: string;
};

export type HabitItem = {
  id: string;
  title: string;
  frequency: string;
  streak: number;
  completedToday: boolean;
};

export function GoalHabitBoard() {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [goalDraft, setGoalDraft] = useState({ title: "", target: "", kind: "project" as GoalItem["kind"] });
  const [habitDraft, setHabitDraft] = useState({ title: "", frequency: "daily" as HabitItem["frequency"] });

  const loadData = async () => {
    try {
      const [goalResponse, habitResponse] = await Promise.all([fetch("/api/goals"), fetch("/api/habits")]);
      const goalsData = (await goalResponse.json()) as GoalItem[];
      const habitsData = (await habitResponse.json()) as HabitItem[];
      setGoals(goalsData);
      setHabits(habitsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateGoal = async () => {
    if (!goalDraft.title.trim() || !goalDraft.target) return;

    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: goalDraft.title, target: Number(goalDraft.target), kind: goalDraft.kind }),
    });

    setGoalDraft({ title: "", target: "", kind: "project" });
    await loadData();
  };

  const handleCreateHabit = async () => {
    if (!habitDraft.title.trim()) return;

    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: habitDraft.title, frequency: habitDraft.frequency }),
    });

    setHabitDraft({ title: "", frequency: "daily" });
    await loadData();
  };

  const handleToggleHabit = async (id: string) => {
    await fetch("/api/habits", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadData();
  };

  const handleUpdateGoal = async (id: string, delta: number) => {
    await fetch("/api/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, delta }),
    });
    await loadData();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          <CardTitle>Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-dashed border-zinc-200 p-3 dark:border-zinc-800">
            <div className="grid gap-3 md:grid-cols-[1.2fr_0.6fr_0.6fr]">
              <input
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                placeholder="Goal title"
                value={goalDraft.title}
                onChange={(event) => setGoalDraft((current) => ({ ...current, title: event.target.value }))}
              />
              <input
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                placeholder="Target"
                type="number"
                value={goalDraft.target}
                onChange={(event) => setGoalDraft((current) => ({ ...current, target: event.target.value }))}
              />
              <select
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                value={goalDraft.kind}
                onChange={(event) => setGoalDraft((current) => ({ ...current, kind: event.target.value as GoalItem["kind"] }))}
              >
                <option value="project">Project</option>
                <option value="learning">Learning</option>
                <option value="money">Money</option>
                <option value="habit">Habit</option>
              </select>
            </div>
            <Button className="mt-3" onClick={handleCreateGoal}>
              <PlusCircle className="mr-1 h-4 w-4" />
              Add goal
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading goals…</p>
          ) : goals.length === 0 ? (
            <EmptyState title="No goals yet" description="Add one big goal to give your progress direction." />
          ) : (
            goals.map((goal) => {
              const progress = calculateGoalProgress(goal.current, goal.target);
              return (
                <div key={goal.id} className="rounded-2xl border border-zinc-100 p-3 dark:border-zinc-800">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{goal.title}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{goal.kind}</p>
                    </div>
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {progress}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                    <span>Current {goal.current}/{goal.target}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleUpdateGoal(goal.id, -1)}>
                        -1
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleUpdateGoal(goal.id, 1)}>
                        +1
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Habits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-dashed border-zinc-200 p-3 dark:border-zinc-800">
            <div className="grid gap-3 md:grid-cols-[1.1fr_0.7fr]">
              <input
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                placeholder="Habit title"
                value={habitDraft.title}
                onChange={(event) => setHabitDraft((current) => ({ ...current, title: event.target.value }))}
              />
              <select
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                value={habitDraft.frequency}
                onChange={(event) => setHabitDraft((current) => ({ ...current, frequency: event.target.value as HabitItem["frequency"] }))}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <Button className="mt-3" onClick={handleCreateHabit}>
              <PlusCircle className="mr-1 h-4 w-4" />
              Add habit
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading habits…</p>
          ) : habits.length === 0 ? (
            <EmptyState title="No habits yet" description="Create a small daily rhythm and keep it visible." />
          ) : (
            habits.map((habit) => (
              <div key={habit.id} className="rounded-2xl border border-zinc-100 p-3 dark:border-zinc-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">{habit.title}</p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{habit.frequency}</p>
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {habit.streak} day streak
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <span>{habit.completedToday ? "Completed today" : "Not completed yet"}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleToggleHabit(habit.id)}>
                    <Target className="mr-1 h-4 w-4" />
                    {habit.completedToday ? "Undo" : "Check off"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
