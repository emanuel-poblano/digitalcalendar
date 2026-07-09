"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, PencilLine, PlusCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state/empty-state";

export type TaskItem = {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string | null;
  estimatedMinutes?: number;
  actualMinutes?: number;
  tags?: string[];
};

export function TaskList() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ title: "", description: "", priority: "Medium", status: "todo" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = (await response.json()) as TaskItem[];
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateOrUpdate = async () => {
    if (!draft.title.trim()) return;

    const payload = {
      title: draft.title,
      description: draft.description,
      priority: draft.priority,
      status: draft.status,
    };

    if (editingId) {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
      setEditingId(null);
    } else {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setDraft({ title: "", description: "", priority: "Medium", status: "todo" });
    await loadTasks();
  };

  const handleEdit = (task: TaskItem) => {
    setEditingId(task.id);
    setDraft({
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      status: task.status,
    });
  };

  const handleComplete = async (task: TaskItem) => {
    await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, status: "done" }),
    });
    await loadTasks();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadTasks();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task board</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-2xl border border-dashed border-zinc-200 p-3 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-zinc-900 dark:text-white">
                {editingId ? "Update task" : "Create a new task"}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Capture priorities before the day gets away from you.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleCreateOrUpdate}>
              <PlusCircle className="h-4 w-4" />
              {editingId ? "Save" : "Add task"}
            </Button>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <input
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
              placeholder="Task title"
              value={draft.title}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            />
            <select
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
              value={draft.priority}
              onChange={(event) => setDraft((current) => ({ ...current, priority: event.target.value }))}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
            <textarea
              className="md:col-span-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
              placeholder="Add context or notes"
              value={draft.description}
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <EmptyState title="No tasks yet" description="Create your first task to get moving." />
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="rounded-2xl border border-zinc-100 p-3 dark:border-zinc-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">{task.title}</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{task.description}</p>
                </div>
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {task.priority}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <span>{task.status}</span>
                {task.estimatedMinutes ? <span>• {task.estimatedMinutes} min planned</span> : null}
                {task.actualMinutes ? <span>• {task.actualMinutes} min logged</span> : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleComplete(task)}>
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Complete
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(task)}>
                  <PencilLine className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(task.id)}>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
