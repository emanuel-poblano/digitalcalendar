import { NextResponse } from "next/server";

import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "@/lib/budget-store";

export async function GET() {
  const transactions = await getTransactions();
  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const transaction = await createTransaction(payload);
  return NextResponse.json(transaction, { status: 201 });
}

export async function PATCH(request: Request) {
  const payload = await request.json();
  const transaction = await updateTransaction(payload.id, payload);
  return NextResponse.json(transaction);
}

export async function DELETE(request: Request) {
  const payload = await request.json();
  await deleteTransaction(payload.id);
  return NextResponse.json({ success: true });
}
