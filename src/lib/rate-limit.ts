import { LRUCache } from "lru-cache";

interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfter?: number;
  reason?: "per_ip" | "global_daily";
}

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

// Global daily cap protects the Gemini API quota. In-memory and
// per-instance — under multi-instance Vercel scale this is per-warm-instance,
// not truly global. For solo-scale traffic that's acceptable; the Google AI
// Studio free-tier quota is the real ceiling. See TODOS.md for the durable-
// counter upgrade path when traffic justifies it.
const GLOBAL_DAILY_MAX = 500;

// Per-IP LRU. Bumped from 5k to 50k so eviction under a many-IP attack can't
// release per-IP caps faster than the 60s window expires them naturally.
const cache = new LRUCache<string, number[]>({
  max: 50_000,
  ttl: WINDOW_MS,
});

// Module-level counter — separate from `cache` because the daily key would be
// evicted every 60s under the LRU's ttl. Resets when the UTC date changes.
let dailyCounter: { date: string; count: number } = {
  date: utcDateString(new Date()),
  count: 0,
};

function utcDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function rateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const today = utcDateString(new Date(now));

  // Roll the counter at UTC midnight.
  if (dailyCounter.date !== today) {
    dailyCounter = { date: today, count: 0 };
  }

  // Global daily cap is the higher-precedence gate. Even if this IP is well
  // under its per-minute cap, the global cap stops the bill.
  if (dailyCounter.count >= GLOBAL_DAILY_MAX) {
    // Retry tomorrow — round up to the next UTC midnight.
    const tomorrow = new Date(now);
    tomorrow.setUTCHours(24, 0, 0, 0);
    const retryAfter = Math.ceil((tomorrow.getTime() - now) / 1000);
    return { success: false, remaining: 0, retryAfter, reason: "global_daily" };
  }

  const windowStart = now - WINDOW_MS;
  const timestamps = (cache.get(ip) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    const oldest = timestamps[0];
    const retryAfter = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return { success: false, remaining: 0, retryAfter, reason: "per_ip" };
  }

  timestamps.push(now);
  cache.set(ip, timestamps);
  dailyCounter.count += 1;

  return { success: true, remaining: MAX_REQUESTS - timestamps.length };
}

// Test-only escape hatch. Re-export the internal counter state so tests can
// reset between cases without exposing module internals to production code.
export const __testing = {
  reset(): void {
    cache.clear();
    dailyCounter = { date: utcDateString(new Date()), count: 0 };
  },
  setDailyCount(count: number): void {
    dailyCounter.count = count;
  },
  getDailyCount(): number {
    return dailyCounter.count;
  },
  GLOBAL_DAILY_MAX,
  MAX_REQUESTS,
};
