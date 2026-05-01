"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FolderKanban, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/projects", label: "Projects", icon: FolderKanban }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f6f8f7]">
        <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-5 py-6 md:block">
          <Link href="/dashboard" className="text-xl font-semibold tracking-tight text-ink">
            ProjectFlow
          </Link>
          <nav className="mt-8 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-mist text-pine" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="md:pl-64">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <Link href="/dashboard" className="font-semibold text-ink md:hidden">ProjectFlow</Link>
              <div className="hidden items-center gap-2 md:flex">
                <span className="text-sm font-medium text-ink">{user?.name}</span>
                <span className="rounded bg-mist px-2 py-1 text-xs font-medium uppercase text-pine">{user?.role}</span>
              </div>
              <button
                onClick={logout}
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </header>
          <main className="px-4 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
