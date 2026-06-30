import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { ProjectModel } from "@/lib/db/models";

export async function GET(req: NextRequest) {
  await dbConnect();
  const userId = req.headers.get("x-user-id") || "demo-user";
  const projects = await ProjectModel.find({ userId }).sort({ order: 1 });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const userId = req.headers.get("x-user-id") || "demo-user";
  const body = await req.json();
  const project = await ProjectModel.create({ ...body, userId });
  return NextResponse.json(project, { status: 201 });
}
