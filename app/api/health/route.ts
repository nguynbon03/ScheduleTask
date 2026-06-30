import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mongoose = await import("@/lib/db/mongoose");
    await mongoose.default();
    return NextResponse.json({ status: "ok", db: "connected" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { status: "error", message },
      { status: 500 }
    );
  }
}
