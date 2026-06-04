import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import Experience from "@/models/Experience";

// PUT /api/experience/:id
export async function PUT(req, { params }) {
  try {
    await protect(req);
    const { id } = params;
    const body = await req.json();

    const item = await Experience.findByIdAndUpdate(id, body, {
      new: true
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Experience item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Experience item updated successfully",
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

// DELETE /api/experience/:id
export async function DELETE(req, { params }) {
  try {
    await protect(req);
    const { id } = params;

    const item = await Experience.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Experience item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Experience item deleted successfully"
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
