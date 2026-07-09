"use client";

import { useState } from "react";
import { ArrowRight, Lock, Mail, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

export function AuthCard() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("demo@lifeos.app");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "sign-in") {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md rounded-3xl border-white/70 bg-white/80 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <CardHeader>
        <CardTitle className="text-xl">Welcome to LifeOS</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Use the demo account or create a personal account to unlock your command center.
        </p>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {mode === "sign-up" && (
            <label className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/80">
              <UserRound className="h-4 w-4 text-zinc-500" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
          )}

          <label className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/80">
            <Mail className="h-4 w-4 text-zinc-500" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/80">
            <Lock className="h-4 w-4 text-zinc-500" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <p className="text-sm text-rose-500">{error}</p> : null}

          <Button className="w-full" disabled={loading}>
            {loading ? "Working..." : mode === "sign-in" ? "Sign in" : "Create account"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <button
          type="button"
          className="mt-4 text-sm text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
          onClick={() => {
            setMode(mode === "sign-in" ? "sign-up" : "sign-in");
            setError(null);
          }}
        >
          {mode === "sign-in" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
      </CardContent>
    </Card>
  );
}
