import { NextResponse } from "next/server";

/**
 * GET /api/download?url=<encoded_url>&name=<filename>
 *
 * Server-side proxy that fetches a remote file (e.g. from Cloudinary)
 * and streams it back to the browser with Content-Disposition: attachment.
 * This sidesteps CORS restrictions that block client-side fetch() on
 * third-party URLs, which would otherwise cause "about:blank#blocked".
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");
  const fileName = searchParams.get("name") || "download";

  if (!fileUrl) {
    return NextResponse.json({ message: "Missing 'url' parameter" }, { status: 400 });
  }

  // Only allow http/https URLs to prevent SSRF against local resources
  if (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://")) {
    return NextResponse.json({ message: "Invalid URL scheme" }, { status: 400 });
  }

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return NextResponse.json(
        { message: `Failed to fetch file: ${response.status}` },
        { status: 502 }
      );
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": buffer.byteLength.toString(),
        // Allow the frontend origin to access this response
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Download proxy error:", err);
    return NextResponse.json({ message: "Download proxy failed" }, { status: 500 });
  }
}
