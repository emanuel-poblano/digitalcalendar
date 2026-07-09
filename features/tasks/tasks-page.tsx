import { CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskList } from "@/features/tasks/task-list";

const tasks = [
  { title: "Study Java", priority: "High", due: "Today" },
  { title: "Meal prep", priority: "Medium", due: "Today" },
  { title: "Oil change", priority: "Low", due: "This week" },
];

export function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Tasks</p>
        <h1 className="text-3xl font-semibold tracking-tight">Turn intentions into action.</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Capture priorities, estimate effort, and keep your day focused without losing sight of the bigger picture.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today’s priorities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => (
            <div key={task.title} className="flex items-center justify-between rounded-2xl border border-zinc-100 p-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{task.title}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Due {task.due}</p>
                </div>
              </div>
              <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {task.priority}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <TaskList />
    </div>
  );
}
