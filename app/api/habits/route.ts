import { NextResponse } from "next/server";

import { createHabit, getHabits, toggleHabit } from "@/lib/goals-habits-store";

export async function GET() {
  const habits = await getHabits();
  return NextResponse.json(habits);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const habit = await createHabit(payload);
  return NextResponse.json(habit, { status: 201 });
}

export async function PATCH(request: Request) {
  const payload = await request.json();
  const habit = await toggleHabit(payload.id);
  return NextResponse.json(habit);
}
