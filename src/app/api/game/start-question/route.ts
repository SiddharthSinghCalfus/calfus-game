import { startQuestion } from "../../../../../backend/store";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const question = body?.question;
  if (question !== 1 && question !== 2) {
    return NextResponse.json(
      { error: "question must be 1 or 2" },
      { status: 400 }
    );
  }
  const state = startQuestion(question);
  return NextResponse.json(state);
}
