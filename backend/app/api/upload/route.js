import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import path from "path";

export async function POST(req) {
  try {
    await protect(req);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "No file was uploaded!" },
        { status: 400 }
      );
    }

    const originalName = file.name || "upload";
    const ext = path.extname(originalName).toLowerCase();

    // Check file extension
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".pdf"];
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        {
          message:
            "Only images (.png, .jpg, .jpeg, .webp) and PDF documents (.pdf) are allowed!"
        },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type;
    const dataUri = `data:${mimeType};base64,${base64}`;

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`;

    const formPayload = new URLSearchParams();
    formPayload.append("file", dataUri);
    formPayload.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

    const cloudRes = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formPayload
    });

    const cloudData = await cloudRes.json();

    if (!cloudRes.ok || cloudData.error) {
      console.error("Cloudinary error:", cloudData.error);
      return NextResponse.json(
        { message: cloudData.error?.message || "Cloudinary upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully!",
        url: cloudData.secure_url
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload Route Error:", error.message);
    const status = error.message.startsWith("Not authorized") ? 401 : 500;
    return NextResponse.json(
      { message: error.message },
      { status }
    );
  }
}
