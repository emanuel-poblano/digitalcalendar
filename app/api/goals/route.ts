import { NextResponse } from "next/server";

import { createGoal, getGoals } from "@/lib/goals-habits-store";

export async function GET() {
  const goals = await getGoals();
  return NextResponse.json(goals);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const goal = await createGoal(payload);
  return NextResponse.json(goal, { status: 201 });
}
