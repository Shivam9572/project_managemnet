"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Task } from "@/types/api";

export function CompleteTaskButton({ task, onCompleted }: { task: Task; onCompleted: (task: Task) => void }) {
  const [saving, setSaving] = useState(false);
  const isDone = task.status === "done";

  async function completeTask() {
    if (isDone || saving) return;

    setSaving(true);
    try {
      const { data } = await api.patch<{ task: Task }>(`/tasks/${task.id}/status`, { status: "done" });
      onCompleted(data.task);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={completeTask}
      disabled={isDone || saving}
      className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
      title={isDone ? "Task already completed" : "Mark task completed"}
    >
      <CheckCircle2 className="h-4 w-4" />
      {isDone ? "Completed" : saving ? "Saving" : "Complete"}
    </button>
  );
}
