import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protect } from "@/lib/auth";
import Education from "@/models/Education";

// GET /api/education
export async function GET() {
  try {
    await connectDB();
    const education = await Education.find().sort({ startYear: -1 });
    return NextResponse.json(education, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/education
export async function POST(req) {
  try {
    await protect(req);
    const body = await req.json();
    const { instituteName, degree, startYear } = body;

    if (!instituteName || !degree || !startYear) {
      return NextResponse.json(
        {
          success: false,
          message: "Required fields missing: instituteName, degree, and startYear are required"
        },
        { status: 400 }
      );
    }

    const item = await Education.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Education item created successfully",
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
