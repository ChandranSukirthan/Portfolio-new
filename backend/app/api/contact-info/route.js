import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protect } from "@/lib/auth";
import ContactInfo from "@/models/ContactInfo";

// GET /api/contact-info
export async function GET() {
  try {
    await connectDB();
    let contactInfo = await ContactInfo.findOne();

    // Auto-seed a default if none exists so the frontend never crashes
    if (!contactInfo) {
      contactInfo = await ContactInfo.create({
        phone: "+94 77 123 4567",
        email: "sukirsukirthan21@gmail.com",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        location: "Colombo, Sri Lanka"
      });
    }

    return NextResponse.json(contactInfo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/contact-info
export async function POST(req) {
  try {
    await protect(req);
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is a required field" },
        { status: 400 }
      );
    }

    const contactInfo = await ContactInfo.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Contact Info created successfully",
        data: contactInfo
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
