import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import Profile from "@/models/Profile";

// PUT /api/profile/:id
export async function PUT(req, { params }) {
  try {
    await protect(req);
    const { id } = params;
    const body = await req.json();
    const { name, title, description, email } = body;

    if (!name || !title || !description || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Required fields name, title, description, and email are missing"
        },
        { status: 400 }
      );
    }

    const profile = await Profile.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: profile
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Profile Error:", error.message);
    const status = error.message.startsWith("Not authorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}
