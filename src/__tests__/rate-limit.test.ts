import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { rateLimit, __testing } from "@/lib/rate-limit";

describe("rateLimit — per-IP cap", () => {
  beforeEach(() => {
    __testing.reset();
  });

  it("allows requests up to MAX_REQUESTS for a single IP", () => {
    for (let i = 0; i < __testing.MAX_REQUESTS; i++) {
      const result = rateLimit("1.1.1.1");
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(__testing.MAX_REQUESTS - i - 1);
    }
  });

  it("blocks the (MAX_REQUESTS + 1)th request from the same IP", () => {
    for (let i = 0; i < __testing.MAX_REQUESTS; i++) {
      rateLimit("2.2.2.2");
    }
    const blocked = rateLimit("2.2.2.2");
    expect(blocked.success).toBe(false);
    expect(blocked.reason).toBe("per_ip");
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(60);
  });

  it("tracks IPs independently", () => {
    for (let i = 0; i < __testing.MAX_REQUESTS; i++) {
      rateLimit("3.3.3.3");
    }
    // 3.3.3.3 is now capped, but 4.4.4.4 should still succeed.
    const other = rateLimit("4.4.4.4");
    expect(other.success).toBe(true);
  });
});

describe("rateLimit — global daily cap", () => {
  beforeEach(() => {
    __testing.reset();
  });

  it("blocks requests once GLOBAL_DAILY_MAX is reached", () => {
    __testing.setDailyCount(__testing.GLOBAL_DAILY_MAX);
    const blocked = rateLimit("5.5.5.5");
    expect(blocked.success).toBe(false);
    expect(blocked.reason).toBe("global_daily");
    expect(blocked.remaining).toBe(0);
    // Retry-After should point at the next UTC midnight (≤ 24h away).
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(24 * 60 * 60);
  });

  it("global cap fires even for IPs well under their per-minute cap", () => {
    __testing.setDailyCount(__testing.GLOBAL_DAILY_MAX);
    // Fresh IP that has never made a request — should still be blocked.
    const blocked = rateLimit("6.6.6.6");
    expect(blocked.success).toBe(false);
    expect(blocked.reason).toBe("global_daily");
  });

  it("counts successful requests toward the daily total", () => {
    __testing.setDailyCount(__testing.GLOBAL_DAILY_MAX - 1);
    const allowed = rateLimit("7.7.7.7");
    expect(allowed.success).toBe(true);
    expect(__testing.getDailyCount()).toBe(__testing.GLOBAL_DAILY_MAX);

    const blocked = rateLimit("7.7.7.7");
    expect(blocked.success).toBe(false);
    expect(blocked.reason).toBe("global_daily");
  });

  it("does NOT count rejected requests toward the daily total", () => {
    __testing.setDailyCount(__testing.GLOBAL_DAILY_MAX);
    rateLimit("8.8.8.8");
    rateLimit("8.8.8.8");
    rateLimit("8.8.8.8");
    expect(__testing.getDailyCount()).toBe(__testing.GLOBAL_DAILY_MAX);
  });
});

describe("rateLimit — UTC day rollover", () => {
  afterEach(() => {
    vi.useRealTimers();
    __testing.reset();
  });

  it("resets the daily counter when the UTC date changes", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-22T23:59:00Z"));
    __testing.reset();

    __testing.setDailyCount(__testing.GLOBAL_DAILY_MAX);
    const blockedToday = rateLimit("9.9.9.9");
    expect(blockedToday.success).toBe(false);
    expect(blockedToday.reason).toBe("global_daily");

    // Jump to next UTC day.
    vi.setSystemTime(new Date("2026-05-23T00:00:01Z"));
    const allowedTomorrow = rateLimit("9.9.9.9");
    expect(allowedTomorrow.success).toBe(true);
    expect(__testing.getDailyCount()).toBe(1);
  });
});
