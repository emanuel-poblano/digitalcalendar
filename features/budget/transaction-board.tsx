"use client";

import { useEffect, useState } from "react";
import { PlusCircle, TrendingUp, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state/empty-state";

export type BudgetTransactionItem = {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  recurring?: boolean;
};

export function TransactionBoard() {
  const [transactions, setTransactions] = useState<BudgetTransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ description: "", amount: "", category: "Needs", type: "expense" as "income" | "expense", recurring: false });

  const loadTransactions = async () => {
    try {
      const response = await fetch("/api/budget");
      const data = (await response.json()) as BudgetTransactionItem[];
      setTransactions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleCreate = async () => {
    if (!draft.description.trim() || !draft.amount) return;

    await fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: draft.description,
        amount: Number(draft.amount),
        category: draft.category,
        type: draft.type,
        recurring: draft.recurring,
      }),
    });

    setDraft({ description: "", amount: "", category: "Needs", type: "expense", recurring: false });
    await loadTransactions();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/budget", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadTransactions();
  };

  const totals = transactions.reduce(
    (accumulator, transaction) => {
      if (transaction.type === "income") {
        accumulator.income += transaction.amount;
      } else {
        accumulator.expense += transaction.amount;
      }
      return accumulator;
    },
    { income: 0, expense: 0 }
  );

  const balance = totals.income - totals.expense;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          <CardTitle>Record a transaction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-2xl border border-dashed border-zinc-200 p-3 dark:border-zinc-800">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                placeholder="Description"
                value={draft.description}
                onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
              />
              <input
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                placeholder="Amount"
                type="number"
                value={draft.amount}
                onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value }))}
              />
              <select
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                value={draft.category}
                onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
              >
                <option value="Needs">Needs</option>
                <option value="Wants">Wants</option>
                <option value="Investments">Investments</option>
                <option value="Savings">Savings</option>
              </select>
              <select
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-950"
                value={draft.type}
                onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value as "income" | "expense" }))}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={draft.recurring}
                onChange={(event) => setDraft((current) => ({ ...current, recurring: event.target.checked }))}
              />
              Recurring bill or income
            </label>
            <Button className="mt-3" onClick={handleCreate}>
              <PlusCircle className="mr-1 h-4 w-4" />
              Add transaction
            </Button>
          </div>

          {loading ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading transactions…</p>
          ) : transactions.length === 0 ? (
            <EmptyState title="No transactions yet" description="Add your first income or expense to track your cash flow." />
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="rounded-2xl border border-zinc-100 p-3 dark:border-zinc-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">{transaction.description}</p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{transaction.category}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${transaction.type === "income" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                  <span>{transaction.recurring ? "Recurring" : "One-time"}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(transaction.id)}>
                    <Trash2 className="mr-1 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cash flow snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900/80">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-950 dark:text-white">${balance.toFixed(2)} available</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Income ${totals.income.toFixed(2)} • Expenses ${totals.expense.toFixed(2)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm font-medium text-zinc-900 dark:text-white">Suggested next move</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Automate a small transfer to savings after your next paycheck.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
