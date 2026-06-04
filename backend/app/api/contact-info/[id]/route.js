import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import ContactInfo from "@/models/ContactInfo";

// PUT /api/contact-info/:id
export async function PUT(req, { params }) {
  try {
    await protect(req);
    const { id } = params;
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is a required field" },
        { status: 400 }
      );
    }

    const contactInfo = await ContactInfo.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!contactInfo) {
      return NextResponse.json(
        { success: false, message: "Contact Info not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact Info updated successfully",
        data: contactInfo
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
