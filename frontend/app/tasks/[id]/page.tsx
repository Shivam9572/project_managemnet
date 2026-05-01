"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CompleteTaskButton } from "@/components/CompleteTaskButton";
import { StatusBadge } from "@/components/StatusBadge";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Task } from "@/types/api";

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);

  const loadTask = useCallback(async () => {
    if (!user) return;

    const { data } = await api.get<{ task: Task }>(`/tasks/${params.id}`);
    setTask(data.task);
  }, [params.id, user]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  async function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    await api.post(`/tasks/${params.id}/comments`, { comment: String(form.get("comment")) });
    formElement.reset();
    await loadTask();
  }

  const canAdmin = user?.role === "admin" || task?.project?.ownerId === user?.id;

  return (
    <AppShell>
      <div className="mb-6">
        <Link href={task?.project ? `/projects/${task.project.id}` : "/projects"} className="text-sm font-medium text-pine">
          {task?.project?.name || "Back to project"}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{task?.title ?? "Task"}</h1>
      </div>
      {task && (
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={task.status} />
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium uppercase text-slate-600">{task.priority}</span>
              {task.dueDate && <span className="text-sm text-slate-500">Due {task.dueDate}</span>}
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-700">{task.description || "No task description."}</p>
          </section>
          <aside className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-ink">Assignment</h2>
              <p className="mt-2 text-sm text-slate-600">{task.assignee?.name || "Unassigned"}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <TaskStatusSelect task={task} onUpdated={setTask} />
                {canAdmin && <CompleteTaskButton task={task} onCompleted={setTask} />}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <MessageSquare className="h-4 w-4" />
                Comments
              </h2>
              <div className="mt-3 space-y-3">
                {task.comments?.map((comment) => (
                  <div key={comment.id} className="rounded-md bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">{comment.author?.name}</p>
                    <p className="mt-1 text-sm text-slate-700">{comment.comment}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={addComment} className="mt-4">
                <textarea name="comment" required placeholder="Write a comment" className="focus-ring min-h-24 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                <button className="focus-ring mt-2 rounded-md bg-pine px-4 py-2 text-sm font-semibold text-white">Comment</button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </AppShell>
  );
}
