import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import ContactMessage from "@/models/ContactMessage";

// DELETE /api/contact-messages/:id
export async function DELETE(req, { params }) {
  try {
    await protect(req);
    const { id } = params;

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message deleted successfully"
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
