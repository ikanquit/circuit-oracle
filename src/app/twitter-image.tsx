// Twitter card image — identical visual to the OG card. We delegate to the
// OG composition so there's only one source of truth, but declare the route
// metadata inline (Next.js doesn't pick up re-exported `runtime`/`size`/etc.).
import { SITE } from "@/lib/seo";
import OpengraphImage from "./opengraph-image";

export const runtime = "edge";
export const alt = SITE.ogImage.alt;
export const size = { width: SITE.ogImage.width, height: SITE.ogImage.height };
export const contentType = "image/png";

export default function TwitterImage() {
  return OpengraphImage();
}
