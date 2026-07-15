"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Flag,
  ListTodo,
  Pencil,
  PlusCircle,
  Trash2,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CalendarEventItem = {
  id: string;
  title: string;
  start: string;
  end?: string | null;
  category: string;
  note?: string;
};

type TaskItem = {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string | null;
};

type BudgetTransactionItem = {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  createdAt: string;
  occurredAt?: string;
};

type GoalItem = {
  id: string;
  title: string;
  target: number;
  current: number;
  kind: string;
};

type PlannerType = "event" | "task" | "spending";

type PlannerEntry = {
  id: string;
  kind: PlannerType;
  title: string;
  detail: string;
};

type DayRange = {
  start: string;
  end: string;
};

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDateKey(rawValue?: string | null) {
  if (!rawValue) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) return rawValue;

  const parsedDate = new Date(rawValue);
  if (Number.isNaN(parsedDate.getTime())) return null;
  return toLocalDateKey(parsedDate);
}

function getRangeBounds(first: string, second: string): DayRange {
  return first <= second
    ? { start: first, end: second }
    : { start: second, end: first };
}

function isDateWithinRange(dateKey: string, range: DayRange) {
  return dateKey >= range.start && dateKey <= range.end;
}

function listDateKeysBetween(startKey: string, endKey: string) {
  const result: string[] = [];
  const startDate = new Date(`${startKey}T00:00:00`);
  const endDate = new Date(`${endKey}T00:00:00`);
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    result.push(toLocalDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

function getMonthMatrix(monthDate: Date) {
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const offset = (monthStart.getDay() + 6) % 7;
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(gridStart);
    current.setDate(gridStart.getDate() + index);
    return current;
  });
}

function formatTimeFromIso(rawValue?: string | null, fallback = "09:00") {
  if (!rawValue) return fallback;
  const parsedDate = new Date(rawValue);
  if (Number.isNaN(parsedDate.getTime())) return fallback;

  const hours = String(parsedDate.getHours()).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatDateKeyLabel(dateKey: string) {
  const parsedDate = new Date(`${dateKey}T00:00:00`);
  return parsedDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function DashboardPage() {
  const today = useMemo(() => new Date(), []);
  const initialDay = useMemo(() => toLocalDateKey(today), [today]);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectionRange, setSelectionRange] = useState<DayRange>({
    start: initialDay,
    end: initialDay,
  });
  const [dragStartDay, setDragStartDay] = useState<string | null>(null);
  const [dragHoverDay, setDragHoverDay] = useState<string | null>(null);

  const [activeType, setActiveType] = useState<PlannerType>("event");
  const [editingEntry, setEditingEntry] = useState<{
    kind: PlannerType;
    id: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [transactions, setTransactions] = useState<BudgetTransactionItem[]>([]);
  const [goals, setGoals] = useState<GoalItem[]>([]);

  const [eventDraft, setEventDraft] = useState({
    title: "",
    time: "09:00",
    endTime: "10:00",
    category: "Focus",
    note: "",
  });
  const [taskDraft, setTaskDraft] = useState({
    title: "",
    priority: "Medium",
    description: "",
  });
  const [spendingDraft, setSpendingDraft] = useState({
    description: "",
    amount: "",
    category: "Needs",
    type: "expense" as "income" | "expense",
  });

  const loadData = async () => {
    try {
      const [eventsResponse, tasksResponse, budgetResponse, goalsResponse] =
        await Promise.all([
          fetch("/api/events"),
          fetch("/api/tasks"),
          fetch("/api/budget"),
          fetch("/api/goals"),
        ]);

      const eventsData = (await eventsResponse.json()) as CalendarEventItem[];
      const tasksData = (await tasksResponse.json()) as TaskItem[];
      const budgetData =
        (await budgetResponse.json()) as BudgetTransactionItem[];
      const goalsData = (await goalsResponse.json()) as GoalItem[];

      setEvents(eventsData);
      setTasks(tasksData);
      setTransactions(budgetData);
      setGoals(goalsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const days = useMemo(() => getMonthMatrix(currentMonth), [currentMonth]);
  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [currentMonth]
  );

  const draggingRange = useMemo(() => {
    if (!dragStartDay) return null;
    return getRangeBounds(dragStartDay, dragHoverDay ?? dragStartDay);
  }, [dragStartDay, dragHoverDay]);

  const visibleRange = draggingRange ?? selectionRange;

  const entriesByDay = useMemo(() => {
    const mapped = new Map<string, PlannerEntry[]>();

    for (const event of events) {
      const startKey = normalizeDateKey(event.start);
      if (!startKey) continue;

      const endKey = normalizeDateKey(event.end ?? event.start) ?? startKey;
      const eventRange = getRangeBounds(startKey, endKey);
      const eventDays = listDateKeysBetween(eventRange.start, eventRange.end);

      for (const dateKey of eventDays) {
        const entry: PlannerEntry = {
          id: event.id,
          kind: "event",
          title: event.title,
          detail: event.category,
        };
        mapped.set(dateKey, [...(mapped.get(dateKey) ?? []), entry]);
      }
    }

    for (const task of tasks) {
      const dateKey = normalizeDateKey(task.dueDate);
      if (!dateKey) continue;

      const entry: PlannerEntry = {
        id: task.id,
        kind: "task",
        title: task.title,
        detail: `${task.priority} priority`,
      };
      mapped.set(dateKey, [...(mapped.get(dateKey) ?? []), entry]);
    }

    for (const transaction of transactions) {
      const dateKey = normalizeDateKey(
        transaction.occurredAt ?? transaction.createdAt
      );
      if (!dateKey) continue;

      const amountPrefix = transaction.type === "income" ? "+" : "-";
      const entry: PlannerEntry = {
        id: transaction.id,
        kind: "spending",
        title: transaction.description,
        detail: `${amountPrefix}$${transaction.amount.toFixed(2)}`,
      };
      mapped.set(dateKey, [...(mapped.get(dateKey) ?? []), entry]);
    }

    return mapped;
  }, [events, tasks, transactions]);

  const selectedDayEntries = entriesByDay.get(selectedDay) ?? [];

  const totals = useMemo(
    () =>
      transactions.reduce(
        (aggregate, entry) => {
          if (entry.type === "income") {
            aggregate.income += entry.amount;
          } else {
            aggregate.expense += entry.amount;
          }
          return aggregate;
        },
        { income: 0, expense: 0 }
      ),
    [transactions]
  );

  const budgetLeft = totals.income - totals.expense;
  const incompleteTasks = useMemo(
    () => tasks.filter((task) => task.status !== "done"),
    [tasks]
  );
  const moneyGoals = useMemo(
    () => goals.filter((goal) => goal.kind === "money"),
    [goals]
  );

  const selectedDayLabel = useMemo(() => {
    const [year, month, day] = selectedDay.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, [selectedDay]);

  const rangeLabel = useMemo(() => {
    if (selectionRange.start === selectionRange.end) {
      return formatDateKeyLabel(selectionRange.start);
    }
    return `${formatDateKeyLabel(selectionRange.start)} - ${formatDateKeyLabel(
      selectionRange.end
    )}`;
  }, [selectionRange]);

  const resetEditor = () => {
    setEditingEntry(null);
    setEventDraft({
      title: "",
      time: "09:00",
      endTime: "10:00",
      category: "Focus",
      note: "",
    });
    setTaskDraft({ title: "", priority: "Medium", description: "" });
    setSpendingDraft({
      description: "",
      amount: "",
      category: "Needs",
      type: "expense",
    });
  };

  const beginDrag = (dayKey: string) => {
    setDragStartDay(dayKey);
    setDragHoverDay(dayKey);
  };

  const updateDrag = (dayKey: string) => {
    if (!dragStartDay) return;
    setDragHoverDay(dayKey);
  };

  const finalizeDrag = (dayKey?: string) => {
    if (!dragStartDay) return;

    const finalDay = dayKey ?? dragHoverDay ?? dragStartDay;
    const bounds = getRangeBounds(dragStartDay, finalDay);
    setSelectionRange(bounds);
    setSelectedDay(bounds.start);
    setDragStartDay(null);
    setDragHoverDay(null);
  };

  const startEdit = (entry: PlannerEntry) => {
    if (entry.kind === "event") {
      const event = events.find((item) => item.id === entry.id);
      if (!event) return;

      const startKey = normalizeDateKey(event.start) ?? selectedDay;
      const endKey = normalizeDateKey(event.end ?? event.start) ?? startKey;
      const bounds = getRangeBounds(startKey, endKey);

      setCurrentMonth(new Date(`${startKey}T00:00:00`));
      setSelectedDay(startKey);
      setSelectionRange(bounds);
      setActiveType("event");
      setEditingEntry({ kind: "event", id: event.id });
      setEventDraft({
        title: event.title,
        time: formatTimeFromIso(event.start, "09:00"),
        endTime: formatTimeFromIso(event.end ?? event.start, "10:00"),
        category: event.category,
        note: event.note ?? "",
      });
      return;
    }

    if (entry.kind === "task") {
      const task = tasks.find((item) => item.id === entry.id);
      if (!task) return;

      const dueKey = normalizeDateKey(task.dueDate) ?? selectedDay;
      setCurrentMonth(new Date(`${dueKey}T00:00:00`));
      setSelectedDay(dueKey);
      setSelectionRange({ start: dueKey, end: dueKey });
      setActiveType("task");
      setEditingEntry({ kind: "task", id: task.id });
      setTaskDraft({
        title: task.title,
        priority: task.priority,
        description: task.description ?? "",
      });
      return;
    }

    const transaction = transactions.find((item) => item.id === entry.id);
    if (!transaction) return;

    const dayKey =
      normalizeDateKey(transaction.occurredAt ?? transaction.createdAt) ??
      selectedDay;
    setCurrentMonth(new Date(`${dayKey}T00:00:00`));
    setSelectedDay(dayKey);
    setSelectionRange({ start: dayKey, end: dayKey });
    setActiveType("spending");
    setEditingEntry({ kind: "spending", id: transaction.id });
    setSpendingDraft({
      description: transaction.description,
      amount: String(transaction.amount),
      category: transaction.category,
      type: transaction.type,
    });
  };

  const handleDeleteEntry = async (entry: PlannerEntry) => {
    const endpoint =
      entry.kind === "event"
        ? "/api/events"
        : entry.kind === "task"
          ? "/api/tasks"
          : "/api/budget";

    await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entry.id }),
    });

    if (
      editingEntry &&
      editingEntry.id === entry.id &&
      editingEntry.kind === entry.kind
    ) {
      resetEditor();
    }

    await loadData();
  };

  const handleCreateOrUpdate = async () => {
    setSaving(true);
    try {
      if (activeType === "event") {
        if (!eventDraft.title.trim()) return;

        const eventPayload = {
          title: eventDraft.title,
          start: `${selectionRange.start}T${eventDraft.time}`,
          end: `${selectionRange.end}T${eventDraft.endTime}`,
          category: eventDraft.category,
          note: eventDraft.note,
        };

        if (editingEntry?.kind === "event") {
          await fetch("/api/events", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingEntry.id, ...eventPayload }),
          });
        } else {
          await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventPayload),
          });
        }
      }

      if (activeType === "task") {
        if (!taskDraft.title.trim()) return;

        const taskPayload = {
          title: taskDraft.title,
          description: taskDraft.description,
          priority: taskDraft.priority,
          dueDate: selectedDay,
        };

        if (editingEntry?.kind === "task") {
          await fetch("/api/tasks", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingEntry.id, ...taskPayload }),
          });
        } else {
          await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskPayload),
          });
        }
      }

      if (activeType === "spending") {
        if (!spendingDraft.description.trim() || !spendingDraft.amount) return;

        const spendingPayload = {
          description: spendingDraft.description,
          amount: Number(spendingDraft.amount),
          category: spendingDraft.category,
          type: spendingDraft.type,
          occurredAt: `${selectedDay}T12:00:00`,
        };

        if (editingEntry?.kind === "spending") {
          await fetch("/api/budget", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingEntry.id, ...spendingPayload }),
          });
        } else {
          await fetch("/api/budget", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(spendingPayload),
          });
        }
      }

      resetEditor();
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-600">
            Planner
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Your full life calendar.
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-600">
            Drag across days to create a block, then add an event, task, or
            spending entry. Edit or delete directly from the calendar chips.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.9fr_0.8fr] 2xl:grid-cols-[2.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Month view</CardTitle>
              <p className="mt-1 text-sm text-zinc-500">
                Drag to select a date range, click entries to edit, and use the
                trash icon to remove in place.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentMonth(
                    (value) =>
                      new Date(value.getFullYear(), value.getMonth() - 1, 1)
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <p className="min-w-40 text-center text-sm font-medium text-zinc-800">
                {monthLabel}
              </p>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentMonth(
                    (value) =>
                      new Date(value.getFullYear(), value.getMonth() + 1, 1)
                  )
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3 rounded-xl border border-dashed border-cyan-200 bg-cyan-50/70 px-3 py-2 text-xs font-medium text-cyan-800">
              Active block: {rangeLabel}
            </div>

            <div className="grid grid-cols-7 gap-2" onMouseLeave={() => finalizeDrag()}>
              {dayLabels.map((label) => (
                <p
                  key={label}
                  className="px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500"
                >
                  {label}
                </p>
              ))}

              {days.map((day) => {
                const dayKey = toLocalDateKey(day);
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                const isSelected = dayKey === selectedDay;
                const isInRange = isDateWithinRange(dayKey, visibleRange);
                const dayEntries = entriesByDay.get(dayKey) ?? [];

                return (
                  <div
                    key={dayKey}
                    role="button"
                    tabIndex={0}
                    onMouseDown={() => beginDrag(dayKey)}
                    onMouseEnter={() => updateDrag(dayKey)}
                    onMouseUp={() => finalizeDrag(dayKey)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedDay(dayKey);
                        setSelectionRange({ start: dayKey, end: dayKey });
                      }
                    }}
                    className={`min-h-32 rounded-2xl border p-2 text-left transition ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-50/70"
                        : isInRange
                          ? "border-cyan-300 bg-cyan-50/60"
                          : "border-zinc-200 hover:border-cyan-300 hover:bg-cyan-50/40"
                    } ${
                      isCurrentMonth
                        ? "text-zinc-900"
                        : "text-zinc-400"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">{day.getDate()}</span>
                      <PlusCircle className="h-3.5 w-3.5" />
                    </div>

                    <div className="space-y-1">
                      {dayEntries.slice(0, 2).map((entry) => (
                        <div
                          key={`${entry.kind}-${entry.id}`}
                          className={`flex items-center gap-1 rounded-md px-1.5 py-1 text-xs ${
                            entry.kind === "event"
                              ? "bg-indigo-100/70 text-indigo-800"
                              : entry.kind === "task"
                                ? "bg-amber-100/70 text-amber-800"
                                : "bg-emerald-100/70 text-emerald-800"
                          }`}
                        >
                          <button
                            type="button"
                            className="min-w-0 flex-1 truncate text-left"
                            onClick={(event) => {
                              event.stopPropagation();
                              startEdit(entry);
                            }}
                          >
                            {entry.title}
                          </button>
                          <button
                            type="button"
                            className="rounded p-0.5 hover:bg-black/10"
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleDeleteEntry(entry);
                            }}
                            aria-label={`Delete ${entry.kind}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {dayEntries.length > 2 ? (
                        <p className="text-xs text-zinc-500">
                          +{dayEntries.length - 2} more
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>
                  {editingEntry ? "Edit entry" : `Add to ${selectedDayLabel}`}
                </CardTitle>
                <p className="mt-1 text-sm text-zinc-500">
                  {activeType === "event"
                    ? `Event range: ${rangeLabel}`
                    : `Target day: ${selectedDayLabel}`}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={activeType === "event" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setActiveType("event");
                    if (editingEntry?.kind !== "event") {
                      setEditingEntry(null);
                    }
                  }}
                >
                  <CalendarDays className="h-4 w-4" />
                  Event
                </Button>
                <Button
                  variant={activeType === "task" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setActiveType("task");
                    if (editingEntry?.kind !== "task") {
                      setEditingEntry(null);
                    }
                  }}
                >
                  <ListTodo className="h-4 w-4" />
                  Task
                </Button>
                <Button
                  variant={
                    activeType === "spending" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    setActiveType("spending");
                    if (editingEntry?.kind !== "spending") {
                      setEditingEntry(null);
                    }
                  }}
                >
                  <DollarSign className="h-4 w-4" />
                  Spending
                </Button>
              </div>

              {activeType === "event" ? (
                <div className="space-y-2">
                  <input
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
                    placeholder="Event title"
                    value={eventDraft.title}
                    onChange={(event) =>
                      setEventDraft((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
                      type="time"
                      value={eventDraft.time}
                      onChange={(event) =>
                        setEventDraft((current) => ({
                          ...current,
                          time: event.target.value,
                        }))
                      }
                    />
                    <input
                      className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
                      type="time"
                      value={eventDraft.endTime}
                      onChange={(event) =>
                        setEventDraft((current) => ({
                          ...current,
                          endTime: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <select
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
                    value={eventDraft.category}
                    onChange={(event) =>
                      setEventDraft((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                  >
                    <option value="Focus">Focus</option>
                    <option value="Personal">Personal</option>
                    <option value="Family">Family</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <textarea
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
                    placeholder="Note"
                    value={eventDraft.note}
                    onChange={(event) =>
                      setEventDraft((current) => ({
                        ...current,
                        note: event.target.value,
                      }))
                    }
                  />
                </div>
              ) : null}

              {activeType === "task" ? (
                <div className="space-y-2">
                  <input
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
                    placeholder="Task title"
                    value={taskDraft.title}
                    onChange={(event) =>
                      setTaskDraft((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                  <select
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
                    value={taskDraft.priority}
                    onChange={(event) =>
                      setTaskDraft((current) => ({
                        ...current,
                        priority: event.target.value,
                      }))
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                  <textarea
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
                    placeholder="Description"
                    value={taskDraft.description}
                    onChange={(event) =>
                      setTaskDraft((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                  />
                </div>
              ) : null}

              {activeType === "spending" ? (
                <div className="space-y-2">
                  <input
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
                    placeholder="Description"
                    value={spendingDraft.description}
                    onChange={(event) =>
                      setSpendingDraft((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
                      placeholder="Amount"
                      type="number"
                      min="0"
                      value={spendingDraft.amount}
                      onChange={(event) =>
                        setSpendingDraft((current) => ({
                          ...current,
                          amount: event.target.value,
                        }))
                      }
                    />
                    <select
                      className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
                      value={spendingDraft.category}
                      onChange={(event) =>
                        setSpendingDraft((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                    >
                      <option value="Needs">Needs</option>
                      <option value="Wants">Wants</option>
                      <option value="Savings">Savings</option>
                      <option value="Investments">Investments</option>
                    </select>
                  </div>
                  <select
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none"
                    value={spendingDraft.type}
                    onChange={(event) =>
                      setSpendingDraft((current) => ({
                        ...current,
                        type: event.target.value as "income" | "expense",
                      }))
                    }
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              ) : null}

              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  className="w-full"
                  onClick={() => void handleCreateOrUpdate()}
                  disabled={saving}
                >
                  <PlusCircle className="h-4 w-4" />
                  {saving
                    ? "Saving..."
                    : editingEntry
                      ? "Save changes"
                      : `Add ${activeType}`}
                </Button>
                {editingEntry ? (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={resetEditor}
                  >
                    Cancel edit
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{selectedDayLabel}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                <p className="text-sm text-zinc-500">
                  Loading day details...
                </p>
              ) : selectedDayEntries.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No entries yet. Add one from the panel above.
                </p>
              ) : (
                selectedDayEntries.map((entry) => (
                  <div
                    key={`${entry.kind}-${entry.id}`}
                    className="rounded-xl border border-zinc-100 px-3 py-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-zinc-900">
                          {entry.title}
                        </p>
                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                          {entry.kind} - {entry.detail}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(entry)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => void handleDeleteEntry(entry)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Budget leftover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-zinc-900">
                  ${budgetLeft.toFixed(2)}
                </p>
                <p className="text-sm text-zinc-500">
                  Income ${totals.income.toFixed(2)} - Expenses ${totals.expense.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {moneyGoals.length === 0 ? (
              <p className="text-sm text-zinc-500">
                No money goals yet. Add one in Goals.
              </p>
            ) : (
              moneyGoals.slice(0, 4).map((goal) => {
                const progress =
                  goal.target <= 0 ? 0 : Math.round((goal.current / goal.target) * 100);
                return (
                  <div
                    key={goal.id}
                    className="rounded-xl border border-zinc-100 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-zinc-900">
                        {goal.title}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-zinc-500">
                        <Flag className="h-3.5 w-3.5" />
                        <span>{progress}%</span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      ${goal.current} / ${goal.target}
                    </p>
                    <div className="mt-2 h-2 rounded-full bg-zinc-200">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {incompleteTasks.length === 0 ? (
              <p className="text-sm text-zinc-500">
                All tasks are complete.
              </p>
            ) : (
              incompleteTasks.slice(0, 8).map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-zinc-100 px-3 py-2"
                >
                  <p className="font-medium text-zinc-900">
                    {task.title}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {task.priority} - Due {task.dueDate ?? "No date"}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
