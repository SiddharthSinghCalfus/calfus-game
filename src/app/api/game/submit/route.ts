import { addSubmission } from "../../../../../backend/store";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { teamId, teamName, questionNum, answerSnippet } = body ?? {};
  if (
    typeof teamId !== "string" ||
    typeof teamName !== "string" ||
    typeof questionNum !== "number" ||
    typeof answerSnippet !== "string"
  ) {
    return NextResponse.json(
      { error: "teamId, teamName, questionNum, answerSnippet required" },
      { status: 400 }
    );
  }
  const state = addSubmission(
    teamId,
    teamName,
    questionNum,
    answerSnippet.trim() || "(No text)",
    false
  );
  return NextResponse.json(state);
}
