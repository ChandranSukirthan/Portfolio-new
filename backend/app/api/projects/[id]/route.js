import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import Project from "@/models/Project";
import { connectDB } from "@/lib/mongodb";

// GET /api/projects/:id
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/projects/:id
export async function PUT(req, { params }) {
  try {
    await protect(req);
    const { id } = params;
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

    const project = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project updated successfully",
        data: project
      },
      { status: 200 }
    );
  } catch (error) {
    const status = error.message.startsWith("Not authorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}

// DELETE /api/projects/:id
export async function DELETE(req, { params }) {
  try {
    await protect(req);
    const { id } = params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project deleted successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    const status = error.message.startsWith("Not authorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}
