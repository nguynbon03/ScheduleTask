import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mongoose = await import("@/lib/db/mongoose");
    await mongoose.default();
    return NextResponse.json({ status: "ok", db: "connected" });
  } catch (err: any) {
    return NextResponse.json(
      { status: "error", message: err.message || String(err) },
      { status: 500 }
    );
  }
}
