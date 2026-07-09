import { NextResponse } from "next/server";

import { createEvent, deleteEvent, getEvents } from "@/lib/events-store";

export async function GET() {
  const events = await getEvents();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const createdEvent = await createEvent(payload);
  return NextResponse.json(createdEvent, { status: 201 });
}

export async function DELETE(request: Request) {
  const payload = await request.json();
  await deleteEvent(payload.id);
  return NextResponse.json({ success: true });
}
