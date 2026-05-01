"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { DashboardStats } from "@/types/api";

export function DashboardChart({ stats }: { stats: DashboardStats }) {
  const data = [
    { name: "Completed", value: stats.completedTasks, color: "#0f766e" },
    { name: "Remaining", value: Math.max(stats.totalTasks - stats.completedTasks, 0), color: "#e76f51" }
  ];

  return (
    <div className="h-72 rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-ink">Completion Mix</h2>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
            {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
