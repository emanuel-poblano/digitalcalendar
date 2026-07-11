import { getEvents } from "@/lib/events-store";
import { getTasks } from "@/lib/tasks-store";

export interface PlannerSuggestion {
  title: string;
  reason: string;
}

export async function getPlannerSuggestions(): Promise<PlannerSuggestion[]> {
  const [tasks, events] = await Promise.all([getTasks(), getEvents()]);

  const pendingTasks = tasks.filter((task) => task.status !== "done").slice(0, 3);
  const upcomingEvents = events.slice(0, 2);

  const suggestions: PlannerSuggestion[] = pendingTasks.map((task) => ({
    title: task.title,
    reason: task.priority === "High" ? "High-priority task" : "Open task",
  }));

  upcomingEvents.forEach((event) => {
    suggestions.push({
      title: event.title,
      reason: event.category,
    });
  });

  return suggestions.slice(0, 4);
}
