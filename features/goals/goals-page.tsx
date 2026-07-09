import { GoalHabitBoard } from "@/features/goals/goal-habit-board";

export function GoalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Goals</p>
        <h1 className="text-3xl font-semibold tracking-tight">Give your ambition structure.</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Goals connect tasks, habits, milestones, and financial choices into one visible path forward.
        </p>
      </div>

      <GoalHabitBoard />
    </div>
  );
}
