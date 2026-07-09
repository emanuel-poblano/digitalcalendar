"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Goal, Home, ListTodo, PiggyBank, Sparkles, UserRound } from "lucide-react";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const navigation = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/budget", label: "Budget", icon: PiggyBank },
  { href: "/goals", label: "Goals", icon: Goal },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAuthenticated, loading, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_26%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-zinc-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.2),_transparent_24%),linear-gradient(135deg,_#050816_0%,_#111827_100%)] dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-4 flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">LifeOS</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Balance time and money</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {loading ? (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</span>
            ) : isAuthenticated && user ? (
              <>
                <span className="hidden text-sm text-zinc-600 dark:text-zinc-300 sm:block">{user.name}</span>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            )}
            <Button size="sm">Try demo</Button>
          </div>
        </header>

        <div className="flex flex-1 gap-4">
          <aside className="hidden w-64 shrink-0 rounded-2xl border border-white/70 bg-white/70 p-3 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 lg:block">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900",
                      (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href))
                        ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-white"
                        : "text-zinc-600 dark:text-zinc-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/10">
              <p className="text-sm font-semibold">Daily focus</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                You have 2 free hours today. Want to work on your side project?
              </p>
            </div>
          </aside>

          <main className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 sm:p-6"
            >
              {!isAuthenticated && !loading ? (
                <div className="space-y-4">
                  <div className="max-w-2xl">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Welcome back</p>
                    <h1 className="text-3xl font-semibold tracking-tight">Sign in to unlock your LifeOS workspace.</h1>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      The experience is now gated behind a simple authentication layer so real users can be introduced into the product flow.
                    </p>
                  </div>
                  <AuthCard />
                </div>
              ) : (
                children
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
