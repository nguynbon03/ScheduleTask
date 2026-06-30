import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, createToken } from "@/lib/db/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email đã được sử dụng" }, { status: 409 });
    }

    const user = await createUser(email, password, name);
    const token = await createToken(user._id.toString(), email);

    return NextResponse.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
