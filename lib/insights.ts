import { getEvents } from "@/lib/events-store";
import { getHabits } from "@/lib/goals-habits-store";
import { getTasks } from "@/lib/tasks-store";
import { getTransactions } from "@/lib/budget-store";

export interface InsightSummary {
  completedTasks: number;
  pendingTasks: number;
  completedHabits: number;
  scheduledEvents: number;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  streaks: number;
  recommendation: string;
}

export async function getInsightSummary(): Promise<InsightSummary> {
  const [tasks, habits, events, transactions] = await Promise.all([
    getTasks(),
    getHabits(),
    getEvents(),
    getTransactions(),
  ]);

  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const pendingTasks = tasks.filter((task) => task.status !== "done").length;
  const completedHabits = habits.filter((habit) => habit.completedToday).length;
  const scheduledEvents = events.length;
  const totalIncome = transactions.filter((transaction) => transaction.type === "income").reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = transactions.filter((transaction) => transaction.type === "expense").reduce((sum, entry) => sum + entry.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const streaks = habits.reduce((sum, habit) => sum + habit.streak, 0);

  let recommendation = "Your systems are steady. Keep the momentum going.";
  if (pendingTasks > completedTasks) {
    recommendation = "You have a few unfinished items. Try one deep-work block before the day gets busy.";
  } else if (completedHabits < habits.length) {
    recommendation = "You are close to a strong consistency streak. One small habit check-in will help.";
  } else if (netBalance < 0) {
    recommendation = "Spending is above income right now. Trim one discretionary category this week.";
  }

  return {
    completedTasks,
    pendingTasks,
    completedHabits,
    scheduledEvents,
    totalIncome,
    totalExpenses,
    netBalance,
    streaks,
    recommendation,
  };
}
