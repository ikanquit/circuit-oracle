import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { validateImageFile, fileToBase64, toSupportedMediaType } from "@/lib/validation";
import { orchestrate } from "@/lib/agents/orchestrator";

export const runtime = "nodejs";
export const maxDuration = 60;

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIP = req.headers.get("x-real-ip");
  if (realIP) return realIP;
  return "unknown";
}

/**
 * Build a user-safe error message. Never echoes raw SDK errors which can
 * include API keys, internal hostnames, model names, or stack frames.
 */
function safeErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  const lower = raw.toLowerCase();

  if (lower.includes("rate") && lower.includes("limit")) {
    return "Upstream rate limit reached. Try again shortly.";
  }
  if (lower.includes("timeout") || lower.includes("etimedout")) {
    return "Analysis timed out. Try again or use a smaller image.";
  }
  if (lower.includes("overloaded") || lower.includes("503")) {
    return "AI service is overloaded right now. Try again in a moment.";
  }
  if (lower.includes("invalid_api_key") || lower.includes("authentication")) {
    return "Server misconfiguration. The team has been notified.";
  }
  if (lower.includes("image") && (lower.includes("decode") || lower.includes("format"))) {
    return "Could not decode the image. Try re-exporting as PNG or JPG.";
  }
  return "Analysis failed. Try again — if it keeps failing, try a different image.";
}

export async function POST(req: NextRequest): Promise<Response> {
  // Rate limiting
  const ip = getClientIP(req);
  const rateLimitResult = rateLimit(ip);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests", code: "RATE_LIMITED" },
      {
        status: 429,
        headers: {
          ...SECURITY_HEADERS,
          "Retry-After": String(rateLimitResult.retryAfter ?? 60),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // Parse multipart form data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data", code: "INVALID_REQUEST" },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }

  const imageFile = formData.get("image");
  const question = formData.get("question");

  if (!imageFile || !(imageFile instanceof File)) {
    return NextResponse.json(
      { error: "No image file provided", code: "MISSING_IMAGE" },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }

  // Validate image
  const validation = validateImageFile(imageFile);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error, code: "INVALID_IMAGE" },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }

  const questionStr = typeof question === "string" ? question.slice(0, 500) : undefined;

  // Convert image to base64 (never log this)
  const base64 = await fileToBase64(imageFile);
  const mediaType = toSupportedMediaType(imageFile.type);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          // Controller may already be closed
        }
      };

      try {
        const analysis = await orchestrate(
          { base64, mediaType },
          send,
          questionStr
        );

        send("done", { full: analysis });
      } catch (err) {
        // Log full error server-side, send sanitized message to client.
        // Never let raw SDK errors (which may contain auth/model/host
        // details) propagate to the browser.
        console.error("[CircuitOracle] orchestrate failed:", err);
        send("error", { error: safeErrorMessage(err) });
      } finally {
        try {
          controller.close();
        } catch {
          // Already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...SECURITY_HEADERS,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-RateLimit-Remaining": String(rateLimitResult.remaining),
    },
  });
}
