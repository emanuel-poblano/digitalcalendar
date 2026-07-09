"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface InsightChartProps {
  data: Array<{ name: string; value: number }>;
}

export function InsightChart({ data }: InsightChartProps) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#71717a" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#71717a" }} />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
