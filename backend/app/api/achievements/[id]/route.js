import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import Achievement from "@/models/Achievement";

// PUT /api/achievements/:id
export async function PUT(req, { params }) {
  try {
    await protect(req);
    const { id } = params;
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

    const achievement = await Achievement.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!achievement) {
      return NextResponse.json(
        { success: false, message: "Achievement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Achievement updated successfully",
        data: achievement
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

// DELETE /api/achievements/:id
export async function DELETE(req, { params }) {
  try {
    await protect(req);
    const { id } = params;

    const achievement = await Achievement.findByIdAndDelete(id);

    if (!achievement) {
      return NextResponse.json(
        { success: false, message: "Achievement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Achievement deleted successfully"
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
