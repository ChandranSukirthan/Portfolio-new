import { NextResponse } from "next/server";

export function middleware(request) {
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    "http://localhost:5173", // Vite local frontend
    "http://localhost:3000", // React/Next local frontend
    process.env.FRONTEND_URL // Production frontend url
  ].filter(Boolean);

  const isAllowed = !origin || allowedOrigins.includes(origin);

  // Handle preflight OPTIONS requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    if (isAllowed && origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    } else {
      response.headers.set("Access-Control-Allow-Origin", allowedOrigins[0] || "*");
    }
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
  }

  // Handle normal requests
  if (origin && !isAllowed) {
    return NextResponse.json(
      {
        success: false,
        message: "CORS error: This frontend URL is not allowed"
      },
      { status: 403 }
    );
  }

  const response = NextResponse.next();
  if (origin && isAllowed) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
