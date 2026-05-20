import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const analyzeRequestSchema = z.object({
  question: z.string().max(500).optional(),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

export function validateImageFile(file: File): { valid: true } | { valid: false; error: string } {
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: `Invalid file type: ${file.type}. Only image files are accepted.` };
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `File too large: ${sizeMB}MB. Maximum size is 10MB.` };
  }

  return { valid: true };
}

export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);
  return bytes.toString("base64");
}

export type SupportedImageMediaType =
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp";

export function toSupportedMediaType(mimeType: string): SupportedImageMediaType {
  const supported: SupportedImageMediaType[] = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (supported.includes(mimeType as SupportedImageMediaType)) {
    return mimeType as SupportedImageMediaType;
  }
  // Default to jpeg for unknown image types
  return "image/jpeg";
}
