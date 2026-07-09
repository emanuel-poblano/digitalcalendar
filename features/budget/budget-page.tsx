import { TransactionBoard } from "@/features/budget/transaction-board";

export function BudgetPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Budget</p>
        <h1 className="text-3xl font-semibold tracking-tight">Make money feel intentional.</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Connect spending habits to your energy, schedule, and goals so your financial choices support your life.
        </p>
      </div>

      <TransactionBoard />
    </div>
  );
}
