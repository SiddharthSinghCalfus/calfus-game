import { addSubmission } from "../../../../../backend/store";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { participantName, participantRollNumber, questionNum, answerSnippet } = body ?? {};
  if (
    typeof participantName !== "string" ||
    typeof participantRollNumber !== "string" ||
    typeof questionNum !== "number" ||
    typeof answerSnippet !== "string"
  ) {
    return NextResponse.json(
      { error: "participantName, participantRollNumber, questionNum, answerSnippet required" },
      { status: 400 }
    );
  }
  const state = addSubmission(
    participantName,
    participantRollNumber,
    questionNum,
    answerSnippet.trim() || "(No text)",
    false
  );
  return NextResponse.json(state);
}
