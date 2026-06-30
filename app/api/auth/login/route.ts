import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, verifyPassword, createToken } from "@/lib/db/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Thiếu email hoặc mật khẩu" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Email không tồn tại" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Mật khẩu sai" }, { status: 401 });
    }

    const token = await createToken(user._id.toString(), email);

    return NextResponse.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
