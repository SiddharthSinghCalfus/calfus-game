import { setScore } from "../../../../../../backend/store";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { teamId, score } = body ?? {};
  if (typeof teamId !== "string" || typeof score !== "number") {
    return NextResponse.json(
      { error: "teamId and score required" },
      { status: 400 }
    );
  }
  const state = setScore(teamId, Math.max(0, score));
  return NextResponse.json(state);
}
