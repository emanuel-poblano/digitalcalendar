import { NextResponse } from "next/server";

import { getInsightSummary } from "@/lib/insights";

export async function GET() {
  const summary = await getInsightSummary();
  return NextResponse.json(summary);
}
