import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protect } from "@/lib/auth";
import Certificate from "@/models/Certificate";

// GET /api/certificates
export async function GET() {
  try {
    await connectDB();
    const certificates = await Certificate.find().sort({ issueDate: -1 });
    return NextResponse.json(certificates, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/certificates
export async function POST(req) {
  try {
    await protect(req);
    const body = await req.json();

    const item = await Certificate.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Certificate created successfully",
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
