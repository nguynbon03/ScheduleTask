import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { TaskModel } from "@/lib/db/models";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();
  const task = await TaskModel.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  await TaskModel.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
