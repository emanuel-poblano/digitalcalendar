import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export interface TaskRecord {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string | null;
  estimatedMinutes?: number;
  actualMinutes?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string | null;
  estimatedMinutes?: number;
  actualMinutes?: number;
  tags?: string[];
}

const DATA_FILE = path.join(process.cwd(), "data", "tasks.json");

async function ensureStoreFile() {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readTasks(): Promise<TaskRecord[]> {
  await ensureStoreFile();
  const content = await readFile(DATA_FILE, "utf8");
  return JSON.parse(content) as TaskRecord[];
}

async function writeTasks(tasks: TaskRecord[]) {
  await ensureStoreFile();
  await writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

export async function getTasks() {
  return readTasks();
}

export async function createTask(input: TaskInput) {
  const tasks = await readTasks();
  const task: TaskRecord = {
    id: `task-${Date.now()}`,
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    priority: input.priority ?? "Medium",
    status: input.status ?? "todo",
    dueDate: input.dueDate ?? null,
    estimatedMinutes: input.estimatedMinutes ?? 0,
    actualMinutes: input.actualMinutes ?? 0,
    tags: input.tags ?? [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.unshift(task);
  await writeTasks(tasks);
  return task;
}

export async function updateTask(id: string, updates: Partial<TaskInput> & { status?: string }) {
  const tasks = await readTasks();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new Error("Task not found");
  }

  tasks[index] = {
    ...tasks[index],
    ...updates,
    title: updates.title?.trim() ?? tasks[index].title,
    description: updates.description?.trim() ?? tasks[index].description,
    updatedAt: new Date().toISOString(),
  };

  await writeTasks(tasks);
  return tasks[index];
}

export async function deleteTask(id: string) {
  const tasks = await readTasks();
  const nextTasks = tasks.filter((task) => task.id !== id);
  await writeTasks(nextTasks);
  return nextTasks;
}
