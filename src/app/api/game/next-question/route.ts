import { nextQuestion } from "../../../../../backend/store";
import { NextResponse } from "next/server";

export async function POST() {
  const state = nextQuestion();
  return NextResponse.json(state);
}
