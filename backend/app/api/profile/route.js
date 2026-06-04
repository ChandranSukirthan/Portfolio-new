import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { protect } from "@/lib/auth";
import Profile from "@/models/Profile";

// GET /api/profile
export async function GET() {
  try {
    await connectDB();
    let profile = await Profile.findOne();

    // Auto-seed a default profile if none exists so the frontend never crashes
    if (!profile) {
      profile = await Profile.create({
        name: "Sukirthan Chandrakumar",
        greeting: "Hello, I’m",
        title: "AI & Full Stack Developer",
        description:
          "AI undergraduate specializing in Artificial Intelligence, skilled in MERN stack, machine learning, and full-stack web development. Experienced in building scalable web applications and AI-powered systems. Seeking internship opportunities to contribute to innovative projects.",
        email: "sukirthan@example.com",
        phone: "+94 77 123 4567",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        location: "Colombo, Sri Lanka",
        profileImage: "/uploads/default-avatar.png",
        resumeLink: ""
      });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("GET Profile Error:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Server error fetching profile: " + error.message
      },
      { status: 500 }
    );
  }
}

// POST /api/profile
export async function POST(req) {
  try {
    await protect(req);
    const body = await req.json();
    const { name, title, description, email } = body;

    if (!name || !title || !description || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Required fields name, title, description, and email are missing"
        },
        { status: 400 }
      );
    }

    const profile = await Profile.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Profile created successfully",
        data: profile
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Profile Error:", error.message);
    const status = error.message.startsWith("Not authorized") ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}
