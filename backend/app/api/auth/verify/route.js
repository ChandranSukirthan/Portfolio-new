import { NextResponse } from "next/server";
import { protect } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await protect(req);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          email: user.email
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 401 }
    );
  }
}
