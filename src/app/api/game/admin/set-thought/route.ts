import { setAetherionThought } from "../../../../../../backend/store";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const thought = body?.thought ?? "";
  const state = setAetherionThought(thought.trim() || "Idle — awaiting task.");
  return NextResponse.json(state);
}
