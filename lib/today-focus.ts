import { getEvents } from "@/lib/events-store";
import { getTasks } from "@/lib/tasks-store";

export async function getTodayFocus() {
  const [tasks, events] = await Promise.all([getTasks(), getEvents()]);

  const focusItems = [
    ...tasks
      .filter((task) => task.status !== "done")
      .slice(0, 2)
      .map((task) => ({
        id: task.id,
        title: task.title,
        subtitle: task.priority === "High" ? "High priority task" : "Open task",
        kind: "task" as const,
      })),
    ...events.slice(0, 2).map((event) => ({
      title: event.title,
      subtitle: event.category,
      kind: "event" as const,
    })),
  ].slice(0, 4);

  return focusItems;
}
