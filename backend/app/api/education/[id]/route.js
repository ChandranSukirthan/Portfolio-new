import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import Education from "@/models/Education";

// PUT /api/education/:id
export async function PUT(req, { params }) {
  try {
    await protect(req);
    const { id } = params;
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

    const item = await Education.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Education item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Education item updated successfully",
        data: item
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

// DELETE /api/education/:id
export async function DELETE(req, { params }) {
  try {
    await protect(req);
    const { id } = params;

    const item = await Education.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Education item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Education item deleted successfully"
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
