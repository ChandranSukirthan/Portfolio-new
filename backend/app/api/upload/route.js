import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import path from "path";
import fs from "fs";

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

    // Convert file to arrayBuffer and buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (cloudName && uploadPreset) {
      // Convert to base64 data URI for Cloudinary
      const base64 = buffer.toString("base64");
      const mimeType = file.type;
      const dataUri = `data:${mimeType};base64,${base64}`;

      // Upload to Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

      const formPayload = new URLSearchParams();
      formPayload.append("file", dataUri);
      formPayload.append("upload_preset", uploadPreset);

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
          message: "File uploaded successfully to Cloudinary!",
          url: cloudData.secure_url
        },
        { status: 200 }
      );
    } else {
      // Local fallback upload to backend/public/uploads
      const uploadsDir = path.join(process.cwd(), "public", "uploads");

      // Ensure directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique file name
      const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const finalPath = path.join(uploadsDir, uniqueFilename);

      // Save to disk
      await fs.promises.writeFile(finalPath, buffer);

      return NextResponse.json(
        {
          success: true,
          message: "File uploaded locally successfully!",
          url: `/uploads/${uniqueFilename}`
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Upload Route Error:", error.message);
    const status = error.message.startsWith("Not authorized") ? 401 : 500;
    return NextResponse.json(
      { message: error.message },
      { status }
    );
  }
}
