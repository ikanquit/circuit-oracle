import { NextResponse } from "next/server";

const version = process.env.npm_package_version ?? "0.1.0";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      status: "ok",
      version,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    }
  );
}
