export type Priority = "Low" | "Medium" | "High" | "Urgent";

export interface DashboardMetric {
  title: string;
  value: string;
  detail: string;
  tone: "indigo" | "emerald" | "amber" | "violet";
}

export interface DashboardTask {
  title: string;
  due: string;
  priority: Priority;
}

export interface DashboardInsight {
  title: string;
  description: string;
  impact: string;
}

export interface DashboardEvent {
  title: string;
  time: string;
  category: string;
}
