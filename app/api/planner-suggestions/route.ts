import { NextResponse } from "next/server";

import { getPlannerSuggestions } from "@/lib/planner-suggestions";

export async function GET() {
  const suggestions = await getPlannerSuggestions();
  return NextResponse.json(suggestions);
}
