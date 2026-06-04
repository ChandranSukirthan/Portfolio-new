import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "default_jwt_secret_key_12345",
    { expiresIn: "30d" }
  );
};

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Please provide email and password" },
        { status: 400 }
      );
    }

    // Check if any user already exists in the system
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return NextResponse.json(
        { message: "Registration is disabled. Admin already exists." },
        { status: 403 }
      );
    }

    const user = await User.create({ email, password });

    return NextResponse.json(
      {
        success: true,
        message: "Admin registered successfully",
        token: generateToken(user._id),
        user: {
          id: user._id,
          email: user.email
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
