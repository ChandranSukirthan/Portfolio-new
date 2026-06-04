import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protect } from "@/lib/auth";
import Skill from "@/models/Skill";

// GET /api/skills
export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find().sort({ category: 1, skillName: 1 });
    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/skills
export async function POST(req) {
  try {
    await protect(req);
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

    const skill = await Skill.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Skill created successfully",
        data: skill
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
