import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protect } from "@/lib/auth";
import Achievement from "@/models/Achievement";

// GET /api/achievements
export async function GET() {
  try {
    await connectDB();
    const achievements = await Achievement.find().sort({ createdAt: -1 });
    return NextResponse.json(achievements, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/achievements
export async function POST(req) {
  try {
    await protect(req);
    const body = await req.json();
    const { title, issuer, issuedDate } = body;

    if (!title || !issuer || !issuedDate) {
      return NextResponse.json(
        {
          success: false,
          message: "title, issuer, and issuedDate are required fields"
        },
        { status: 400 }
      );
    }

    const achievement = await Achievement.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Achievement created successfully",
        data: achievement
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
