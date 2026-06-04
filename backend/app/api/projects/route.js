import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protect } from "@/lib/auth";
import Project from "@/models/Project";

// GET /api/projects
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects
export async function POST(req) {
  try {
    await protect(req);
    const body = await req.json();
    const { projectTitle, description } = body;

    if (!projectTitle || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "projectTitle and description are required fields"
        },
        { status: 400 }
      );
    }

    const project = await Project.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: project
      },
      { status: 201 }
    );
  } catch (error) {
    const status = error.message.startsWith("Not authorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}
