import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("Portfolio CMS backend is running successfully...", {
    status: 200,
    headers: { "Content-Type": "text/plain" }
  });
}
