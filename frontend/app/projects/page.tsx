"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/context/AuthContext";
import { api, errorMessage } from "@/lib/api";
import type { Paged, Project } from "@/types/api";

function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [delay, value]);

  return debounced;
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const debouncedSearch = useDebounced(search);
  const canCreate = user?.role === "admin";

  const query = useMemo(() => new URLSearchParams({ limit: "20", search: debouncedSearch }).toString(), [debouncedSearch]);

  const loadProjects = useCallback(async () => {
    if (!user) return;

    const { data } = await api.get<Paged<Project>>(`/projects?${query}`);
    setProjects(data.data);
  }, [query, user]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      await api.post("/projects", {
        name: String(form.get("name")),
        description: String(form.get("description"))
      });
      formElement.reset();
      await loadProjects();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Browse projects you own or belong to.</p>
        </div>
        <label className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects"
            className="focus-ring w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm"
          />
        </label>
      </div>
      {canCreate && (
        <form onSubmit={createProject} className="mb-5 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_2fr_auto]">
          <input name="name" required placeholder="Project name" className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm" />
          <input name="description" placeholder="Description" className="focus-ring rounded-md border border-slate-200 px-3 py-2 text-sm" />
          <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-pine px-4 py-2 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" />
            Create
          </button>
          {error && <p className="text-sm text-red-700 md:col-span-3">{error}</p>}
        </form>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-pine">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-ink">{project.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{project.description || "No description yet."}</p>
              </div>
              <span className="rounded bg-mist px-2 py-1 text-xs font-medium text-pine">{project.members?.length ?? 0} members</span>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
