import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protect } from "@/lib/auth";
import Experience from "@/models/Experience";

// GET /api/experience
export async function GET() {
  try {
    await connectDB();
    const experience = await Experience.find().sort({ startDate: -1 });
    return NextResponse.json(experience, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/experience
export async function POST(req) {
  try {
    await protect(req);
    const body = await req.json();

    const item = await Experience.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Experience item created successfully",
        data: item
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
