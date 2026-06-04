import jwt from "jsonwebtoken";
import User from "../models/User";
import { connectDB } from "./mongodb";

export async function protect(req) {
  await connectDB();
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Not authorized, no token provided");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_jwt_secret_key_12345"
    );

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new Error("Not authorized, user not found");
    }

    return user;
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    throw new Error("Not authorized, token failed");
  }
}
