"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Task, TaskStatus } from "@/types/api";

export function TaskStatusSelect({ task, onUpdated }: { task: Task; onUpdated?: (task: Task) => void }) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(task.status);
  }, [task.status]);

  async function update(next: TaskStatus) {
    setStatus(next);
    setSaving(true);
    const { data } = await api.patch<{ task: Task }>(`/tasks/${task.id}/status`, { status: next });
    onUpdated?.(data.task);
    setSaving(false);
  }

  return (
    <select
      value={status}
      onChange={(event) => update(event.target.value as TaskStatus)}
      disabled={saving}
      className="focus-ring rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
    >
      <option value="todo">Todo</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Done</option>
    </select>
  );
}
