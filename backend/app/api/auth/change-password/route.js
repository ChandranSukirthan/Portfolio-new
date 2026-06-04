import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req) {
  try {
    const userFromToken = await protect(req);
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Please provide both current and new passwords." },
        { status: 400 }
      );
    }

    const user = await User.findById(userFromToken._id);
    if (!user) {
      return NextResponse.json(
        { message: "Admin user not found." },
        { status: 404 }
      );
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect current password." },
        { status: 400 }
      );
    }

    // Assigning new password will trigger pre('save') hook to hash it
    user.password = newPassword;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Password changed successfully!"
      },
      { status: 200 }
    );
  } catch (error) {
    const status = error.message.startsWith("Not authorized") ? 401 : 500;
    return NextResponse.json(
      { message: error.message },
      { status }
    );
  }
}
