import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    // Check authorization
    await protect(req);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "No file was uploaded!" },
        { status: 400 }
      );
    }

    // Get buffer and original name/extension
    const buffer = Buffer.from(await file.arrayBuffer());
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

    // Ensure public/uploads folder exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique name: file-timestamp-random.extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `file-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to disk
    await fs.promises.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully!",
        url: fileUrl
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
