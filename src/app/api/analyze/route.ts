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
        const message = err instanceof Error ? err.message : "Analysis failed";
        send("error", { error: message });
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
