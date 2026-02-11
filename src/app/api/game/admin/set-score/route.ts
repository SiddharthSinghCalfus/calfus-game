import { setScore } from "../../../../../../backend/store";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { participantId, score } = body ?? {};
  if (typeof participantId !== "string" || typeof score !== "number") {
    return NextResponse.json(
      { error: "participantId and score required" },
      { status: 400 }
    );
  }
  const state = setScore(participantId, Math.max(0, score));
  return NextResponse.json(state);
}
