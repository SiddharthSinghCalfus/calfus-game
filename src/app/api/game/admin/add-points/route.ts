import { addPoints } from "../../../../../../backend/store";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { participantId, points } = body ?? {};
  if (typeof participantId !== "string" || typeof points !== "number") {
    return NextResponse.json(
      { error: "participantId and points required" },
      { status: 400 }
    );
  }
  const state = addPoints(participantId, points);
  return NextResponse.json(state);
}
