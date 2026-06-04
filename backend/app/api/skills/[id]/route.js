import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import Skill from "@/models/Skill";

// PUT /api/skills/:id
export async function PUT(req, { params }) {
  try {
    await protect(req);
    const { id } = params;
    const body = await req.json();
    const { skillName, category } = body;

    if (!skillName || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "skillName and category are required fields"
        },
        { status: 400 }
      );
    }

    const skill = await Skill.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!skill) {
      return NextResponse.json(
        { success: false, message: "Skill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Skill updated successfully",
        data: skill
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

// DELETE /api/skills/:id
export async function DELETE(req, { params }) {
  try {
    await protect(req);
    const { id } = params;

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return NextResponse.json(
        { success: false, message: "Skill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Skill deleted successfully"
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
