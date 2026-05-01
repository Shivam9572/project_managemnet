"use client";

import dynamic from "next/dynamic";
import { CheckCircle2, Clock, FolderCheck, FolderKanban, ListTodo } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { DashboardStats } from "@/types/api";

const DashboardChart = dynamic(() => import("@/components/DashboardChart").then((mod) => mod.DashboardChart), {
  ssr: false,
  loading: () => <div className="h-72 rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">Loading chart...</div>
});

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const loadDashboard = useCallback(async () => {
    if (loading || !user) return;

    try {
      const { data } = await api.get<{ stats: DashboardStats }>("/dashboard");
      setStats(data.stats);
    } catch {
      setStats(null);
    }
  }, [loading, user]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (loading || !user) return;

    const interval = window.setInterval(loadDashboard, 10000);

    window.addEventListener("focus", loadDashboard);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", loadDashboard);
    };
  }, [loadDashboard, loading, user]);

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">A quick read on project health and delivery progress.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Projects" value={stats?.totalProjects ?? "..."} icon={FolderKanban} />
        <StatCard label="Completed Projects" value={stats?.completedProjects ?? "..."} icon={FolderCheck} />
        <StatCard label="Total Tasks" value={stats?.totalTasks ?? "..."} icon={ListTodo} />
        <StatCard label="Completed Tasks" value={stats?.completedTasks ?? "..."} icon={CheckCircle2} />
        <StatCard label="Overdue Tasks" value={stats?.overdueTasks ?? "..."} icon={Clock} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        {stats && <DashboardChart stats={stats} />}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">Completion Rate</h2>
          <div className="mt-8 flex items-end gap-3">
            <span className="text-5xl font-semibold tracking-tight text-pine">{stats?.completionRate ?? 0}%</span>
            <span className="pb-2 text-sm text-slate-500">done</span>
          </div>
          <div className="mt-6 h-3 rounded-full bg-slate-100">
            <div className="h-3 rounded-full bg-pine" style={{ width: `${stats?.completionRate ?? 0}%` }} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
