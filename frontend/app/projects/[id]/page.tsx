"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CompleteTaskButton } from "@/components/CompleteTaskButton";
import { StatusBadge } from "@/components/StatusBadge";
import { TaskStatusSelect } from "@/components/TaskStatusSelect";
import { useAuth } from "@/context/AuthContext";
import { api, errorMessage } from "@/lib/api";
import type { Priority, Project, Task } from "@/types/api";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");

  const canAdmin = user?.role === "admin" || project?.ownerId === user?.id;

  const load = useCallback(async () => {
    if (!user) return;

    const [projectResponse, taskResponse] = await Promise.all([
      api.get<{ project: Project }>(`/projects/${params.id}`),
      api.get<{ data: Task[] }>(`/tasks?projectId=${params.id}&limit=50`)
    ]);
    setProject(projectResponse.data.project);
    setTasks(taskResponse.data.data);
  }, [params.id, user]);

  useEffect(() => {
    load();
  }, [load]);

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      await api.post(`/projects/${params.id}/members`, {
        email: String(form.get("email")),
        role: form.get("role")
      });
      formElement.reset();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      await api.post("/tasks", {
        projectId: Number(params.id),
        title: String(form.get("title")),
        description: String(form.get("description")),
        assignedTo: Number(form.get("assignedTo")) || null,
        priority: form.get("priority") as Priority,
        dueDate: String(form.get("dueDate")) || null
      });
      formElement.reset();
      await load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function deleteTask(id: number) {
    await api.delete(`/tasks/${id}`);
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function updateTaskInList(updatedTask: Task) {
    setTasks((current) => current.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  }

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{project?.name ?? "Project"}</h1>
        <p className="mt-1 text-sm text-slate-500">{project?.description || "No description yet."}</p>
      </div>
      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          {canAdmin && (
            <form onSubmit={createTask} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2">
              <input name="title" required placeholder="Task title" className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm" />
              <select name="assignedTo" className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm">
                <option value="">Unassigned</option>
                {project?.members?.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
              </select>
              <textarea name="description" placeholder="Description" className="focus-ring min-h-20 rounded-md border border-slate-200 px-3 py-2 text-sm md:col-span-2" />
              <select name="priority" defaultValue="medium" className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <input name="dueDate" type="date" className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm" />
              <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-pine px-4 py-2 text-sm font-semibold text-white md:col-span-2">
                <Plus className="h-4 w-4" />
                Create Task
              </button>
            </form>
          )}
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            {tasks.map((task) => (
              <div key={task.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
                <div>
                  <Link href={`/tasks/${task.id}`} className="font-medium text-ink hover:text-pine">{task.title}</Link>
                  <p className="mt-1 text-sm text-slate-500">{task.assignee?.name || "Unassigned"} - {task.priority}</p>
                </div>
                {canAdmin ? <StatusBadge status={task.status} /> : <TaskStatusSelect task={task} />}
                {canAdmin && <CompleteTaskButton task={task} onCompleted={updateTaskInList} />}
                {canAdmin && (
                  <button onClick={() => deleteTask(task.id)} className="focus-ring rounded-md border border-slate-200 p-2 text-slate-500 hover:text-red-600" title="Delete task">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-ink">Members</h2>
            <div className="mt-3 space-y-2">
              {project?.members?.map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2">
                  <span className="text-sm font-medium">{member.name}</span>
                  <span className="text-xs uppercase text-slate-500">{member.projectmembers?.role || member.role}</span>
                </div>
              ))}
            </div>
          </div>
          {canAdmin && (
            <form onSubmit={addMember} className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-ink">Add Member</h2>
              <input name="email" type="email" required placeholder="member@example.com" className="focus-ring mt-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
              <select name="role" className="focus-ring mt-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                <option value="member">Member</option>
                <option value="admin">Project Admin</option>
              </select>
              <button className="focus-ring mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-pine px-4 py-2 text-sm font-semibold text-white">
                <UserPlus className="h-4 w-4" />
                Add
              </button>
            </form>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
