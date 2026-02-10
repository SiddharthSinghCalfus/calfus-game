import { reset } from "../../../../../../backend/store";
import { NextResponse } from "next/server";

export async function POST() {
  const state = reset();
  return NextResponse.json(state);
}
