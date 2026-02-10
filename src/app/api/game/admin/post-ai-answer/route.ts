import { postAiAnswer } from "../../../../../../backend/store";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { questionNum, answerSnippet } = body ?? {};
  if (typeof questionNum !== "number" || typeof answerSnippet !== "string") {
    return NextResponse.json(
      { error: "questionNum and answerSnippet required" },
      { status: 400 }
    );
  }
  const state = postAiAnswer(questionNum, answerSnippet.trim() || "(No text)");
  return NextResponse.json(state);
}
