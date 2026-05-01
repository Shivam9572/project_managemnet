import type { TaskStatus } from "@/types/api";

const labels: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done"
};

const styles: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-800",
  done: "bg-emerald-100 text-emerald-800"
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <span className={`rounded px-2 py-1 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
}
