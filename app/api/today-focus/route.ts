import { NextResponse } from "next/server";

import { getTodayFocus } from "@/lib/today-focus";

export async function GET() {
  const items = await getTodayFocus();
  return NextResponse.json(items);
}
