import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { HabitModel } from "@/lib/db/models";

export async function GET(req: NextRequest) {
  await dbConnect();
  const userId = req.headers.get("x-user-id") || "demo-user";
  const habits = await HabitModel.find({ userId }).sort({ order: 1 });
  return NextResponse.json(habits);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const userId = req.headers.get("x-user-id") || "demo-user";
  const body = await req.json();
  const habit = await HabitModel.create({ ...body, userId });
  return NextResponse.json(habit, { status: 201 });
}
