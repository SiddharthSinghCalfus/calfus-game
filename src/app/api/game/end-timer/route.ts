import { endTimer } from "../../../../../backend/store";
import { NextResponse } from "next/server";

export async function POST() {
  const state = endTimer();
  return NextResponse.json(state);
}
