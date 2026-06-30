import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { TaskModel } from "@/lib/db/models";

export async function GET(req: NextRequest) {
  await dbConnect();
  const userId = req.headers.get("x-user-id") || "demo-user";
  const tasks = await TaskModel.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const userId = req.headers.get("x-user-id") || "demo-user";
  const body = await req.json();
  const task = await TaskModel.create({ ...body, userId });
  return NextResponse.json(task, { status: 201 });
}
