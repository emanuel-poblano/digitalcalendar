import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export interface GoalRecord {
  id: string;
  title: string;
  description?: string;
  target: number;
  current: number;
  deadline?: string;
  kind: "money" | "habit" | "learning" | "project";
  createdAt: string;
}

export interface HabitRecord {
  id: string;
  title: string;
  frequency: "daily" | "weekly" | "monthly";
  streak: number;
  completedToday: boolean;
  createdAt: string;
}

export interface GoalInput {
  title: string;
  description?: string;
  target: number;
  current?: number;
  deadline?: string;
  kind?: "money" | "habit" | "learning" | "project";
}

export interface HabitInput {
  title: string;
  frequency?: "daily" | "weekly" | "monthly";
  streak?: number;
  completedToday?: boolean;
}

export interface GoalProgressInput {
  id: string;
  current?: number;
  delta?: number;
}

const GOALS_FILE = path.join(process.cwd(), "data", "goals.json");
const HABITS_FILE = path.join(process.cwd(), "data", "habits.json");

async function ensureFile(filePath: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
  try {
    await readFile(filePath, "utf8");
  } catch {
    await writeFile(filePath, "[]", "utf8");
  }
}

async function readJson<T>(filePath: string): Promise<T> {
  await ensureFile(filePath);
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

async function writeJson(filePath: string, value: unknown) {
  await ensureFile(filePath);
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

export async function getGoals() {
  return readJson<GoalRecord[]>(GOALS_FILE);
}

export async function createGoal(input: GoalInput) {
  const goals = await getGoals();
  const goal: GoalRecord = {
    id: `goal-${Date.now()}`,
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    target: Number(input.target) || 1,
    current: Number(input.current) || 0,
    deadline: input.deadline ?? "",
    kind: input.kind ?? "project",
    createdAt: new Date().toISOString(),
  };

  goals.unshift(goal);
  await writeJson(GOALS_FILE, goals);
  return goal;
}

export async function updateGoalProgress(input: GoalProgressInput) {
  const goals = await getGoals();
  const goal = goals.find((entry) => entry.id === input.id);
  if (!goal) throw new Error("Goal not found");

  if (typeof input.current === "number") {
    goal.current = Math.max(0, Math.min(goal.target, input.current));
  } else if (typeof input.delta === "number") {
    goal.current = Math.max(0, Math.min(goal.target, goal.current + input.delta));
  }

  await writeJson(GOALS_FILE, goals);
  return goal;
}

export async function getHabits() {
  return readJson<HabitRecord[]>(HABITS_FILE);
}

export async function createHabit(input: HabitInput) {
  const habits = await getHabits();
  const habit: HabitRecord = {
    id: `habit-${Date.now()}`,
    title: input.title.trim(),
    frequency: input.frequency ?? "daily",
    streak: input.streak ?? 0,
    completedToday: input.completedToday ?? false,
    createdAt: new Date().toISOString(),
  };

  habits.unshift(habit);
  await writeJson(HABITS_FILE, habits);
  return habit;
}

export async function toggleHabit(id: string) {
  const habits = await getHabits();
  const habit = habits.find((entry) => entry.id === id);
  if (!habit) throw new Error("Habit not found");

  habit.completedToday = !habit.completedToday;
  habit.streak = habit.completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1);
  await writeJson(HABITS_FILE, habits);
  return habit;
}
