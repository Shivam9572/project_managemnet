"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { errorMessage } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      await login({
        email: String(form.get("email")),
        password: String(form.get("password"))
      });
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Login</h1>
        <p className="mt-1 text-sm text-slate-500">Open your project workspace.</p>
        {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <label className="mt-5 block text-sm font-medium text-slate-700">
          Email
          <input name="email" type="email" required className="focus-ring mt-2 w-full rounded-md border border-slate-200 px-3 py-2" />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Password
          <input name="password" type="password" required className="focus-ring mt-2 w-full rounded-md border border-slate-200 px-3 py-2" />
        </label>
        <button className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-pine px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
          <LogIn className="h-4 w-4" />
          Login
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
          Need an account? <Link className="font-medium text-pine" href="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}
