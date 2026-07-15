import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export interface BudgetTransactionRecord {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  recurring?: boolean;
  occurredAt?: string;
  createdAt: string;
}

export interface BudgetTransactionInput {
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  recurring?: boolean;
  occurredAt?: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "budget.json");

async function ensureStoreFile() {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function readTransactions(): Promise<BudgetTransactionRecord[]> {
  await ensureStoreFile();
  const content = await readFile(DATA_FILE, "utf8");
  return JSON.parse(content) as BudgetTransactionRecord[];
}

async function writeTransactions(transactions: BudgetTransactionRecord[]) {
  await ensureStoreFile();
  await writeFile(DATA_FILE, JSON.stringify(transactions, null, 2), "utf8");
}

export async function getTransactions() {
  return readTransactions();
}

export async function createTransaction(input: BudgetTransactionInput) {
  const transactions = await readTransactions();
  const transaction: BudgetTransactionRecord = {
    id: `txn-${Date.now()}`,
    description: input.description.trim(),
    amount: Number(input.amount),
    category: input.category.trim(),
    type: input.type,
    recurring: input.recurring ?? false,
    occurredAt: input.occurredAt,
    createdAt: new Date().toISOString(),
  };

  transactions.unshift(transaction);
  await writeTransactions(transactions);
  return transaction;
}

export async function updateTransaction(
  id: string,
  updates: Partial<BudgetTransactionInput>
) {
  const transactions = await readTransactions();
  const index = transactions.findIndex((transaction) => transaction.id === id);
  if (index === -1) {
    throw new Error("Transaction not found");
  }

  transactions[index] = {
    ...transactions[index],
    ...updates,
    description: updates.description?.trim() ?? transactions[index].description,
    category: updates.category?.trim() ?? transactions[index].category,
    amount:
      typeof updates.amount === "number"
        ? Number(updates.amount)
        : transactions[index].amount,
  };

  await writeTransactions(transactions);
  return transactions[index];
}

export async function deleteTransaction(id: string) {
  const transactions = await readTransactions();
  const nextTransactions = transactions.filter((transaction) => transaction.id !== id);
  await writeTransactions(nextTransactions);
  return nextTransactions;
}
