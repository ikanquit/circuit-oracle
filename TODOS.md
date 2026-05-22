# TODOS

## Rate limiting / cost control

### P2 — Upgrade daily cap to Vercel KV for truly global counter
**Priority:** P2
**Surfaced by:** /cso 2026-05-22, Finding #1 (LLM cost amplification)

**What:** Replace the in-memory `dailyCounter` in `src/lib/rate-limit.ts` with a Vercel KV–backed atomic INCR.

**Why:** The current daily cap is per-warm-instance. On Vercel, multiple concurrent serverless instances each have their own 500/day counter, so under attack the effective cap scales with instance count. Vercel KV provides a true global counter via `INCR`.

**Context:** Current implementation is the floor. The Anthropic console monthly cap is the hard ceiling. Upgrade when traffic justifies it (probably never for this project, but worth capturing).

**Sketch:**
- `npm i @vercel/kv`
- Replace `dailyCounter.count++` with `await kv.incr(\`day:\${today}\`)` and `await kv.expire(\`day:\${today}\`, 60*60*48)`
- Make `rateLimit` async; update the route's call site.

**Depends on:** Vercel KV provisioning (free tier OK at this scale).

---

### P3 — Add Cloudflare / Vercel Edge rate limit in front of the API
**Priority:** P3
**Surfaced by:** /cso 2026-05-22, Finding #1 step 4 (defense in depth)

**What:** Put an edge-level rate limit (Cloudflare WAF rate-limit rule, Vercel Firewall, or Upstash Ratelimit at the edge) in front of `/api/analyze`.

**Why:** App-level rate limit fires AFTER the request hits Node. Edge limits drop the request before it reaches the function — saves cold-start cost and is harder to bypass.

**Context:** Currently shipped on Vercel (inferred). Vercel Firewall has IP rate limits available on Pro. Free alternative: Cloudflare in front of Vercel with a WAF rule.

**Depends on:** Decision on whether project stays free-tier on Vercel.

---

### Manual — Set Anthropic console monthly spend cap
**Priority:** P0 (manual)
**Surfaced by:** /cso 2026-05-22, Finding #1 step 1

**What:** Log into the Anthropic console → Billing/Limits → set a monthly spend cap.

**Why:** This is the only hard ceiling. The app-level daily cap is the floor; the Anthropic-side cap is what actually stops the bill from running away.

**Context:** Cannot be done from code — must be done manually in the Anthropic console.

## Completed

- ~~Fix LLM cost amplification: global daily cap + bump per-IP LRU max~~ — done 2026-05-22, commit pending. (`src/lib/rate-limit.ts`, `src/__tests__/rate-limit.test.ts`)
