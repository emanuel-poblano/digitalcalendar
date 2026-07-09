import { NextResponse } from "next/server";

import { createTask, deleteTask, getTasks, updateTask } from "@/lib/tasks-store";

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const createdTask = await createTask(payload);
  return NextResponse.json(createdTask, { status: 201 });
}

export async function PATCH(request: Request) {
  const payload = await request.json();
  const updatedTask = await updateTask(payload.id, payload);
  return NextResponse.json(updatedTask);
}

export async function DELETE(request: Request) {
  const payload = await request.json();
  await deleteTask(payload.id);
  return NextResponse.json({ success: true });
}
