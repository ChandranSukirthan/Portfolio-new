import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protect } from "@/lib/auth";
import ContactMessage from "@/models/ContactMessage";

// GET /api/contact-messages
export async function GET(req) {
  try {
    await protect(req);
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    const status = error.message.startsWith("Not authorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}

// POST /api/contact-messages
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { fullName, phoneOrEmail, message } = body;

    if (!fullName || !phoneOrEmail || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "fullName, phoneOrEmail, and message are required fields"
        },
        { status: 400 }
      );
    }

    const newMessage = await ContactMessage.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
        data: newMessage
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
