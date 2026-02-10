import { getState } from "../../../../../backend/store";
import { QUESTIONS } from "../../../../../backend/constants";
import { NextResponse } from "next/server";

export async function GET() {
  const state = getState();
  return NextResponse.json({ ...state, questions: QUESTIONS });
}
