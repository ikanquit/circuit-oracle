import { LRUCache } from "lru-cache";

interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfter?: number;
}

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

const cache = new LRUCache<string, number[]>({
  max: 5000,
  ttl: WINDOW_MS,
});

export function rateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const timestamps = (cache.get(ip) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    const oldest = timestamps[0];
    const retryAfter = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return { success: false, remaining: 0, retryAfter };
  }

  timestamps.push(now);
  cache.set(ip, timestamps);

  return { success: true, remaining: MAX_REQUESTS - timestamps.length };
}
