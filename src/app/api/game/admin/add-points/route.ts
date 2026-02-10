import { addPoints } from "../../../../../../backend/store";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { teamId, points } = body ?? {};
  if (typeof teamId !== "string" || typeof points !== "number") {
    return NextResponse.json(
      { error: "teamId and points required" },
      { status: 400 }
    );
  }
  const state = addPoints(teamId, points);
  return NextResponse.json(state);
}
