# CircuitOracle

AI-powered circuit schematic analysis. Upload a schematic image → 3 Claude agents analyze it in parallel → synthesis agent produces engineering-depth explanation, streamed via SSE.

## Commands

```bash
npm run dev          # start dev server on :3000
npm run build        # production build
npm run lint         # eslint
npm run type-check   # tsc --noEmit
```

Requires `ANTHROPIC_API_KEY` in `.env.local` (copy `.env.example`).

## Architecture

```
POST /api/analyze
  └─ validate image (type, size)
  └─ rate limit (10 req/min/IP via LRU cache)
  └─ orchestrate() → ReadableStream (SSE)
       ├─ Promise.allSettled([componentAgent, topologyAgent, domainAgent])  ← parallel
       └─ synthesisAgent(image + all 3 results)  ← streaming via anthropic.messages.stream()
```

Each agent is a separate Claude API call with a specialized system prompt. Failures are isolated — one agent erroring doesn't abort the others.

**Key files:**
- `src/lib/agents/orchestrator.ts` — parallel dispatch + synthesis streaming
- `src/lib/agents/prompts.ts` — all system prompts + user prompt builders
- `src/lib/agents/types.ts` — TypeScript interfaces for all agent outputs
- `src/app/api/analyze/route.ts` — SSE stream, rate limiting, security headers
- `src/app/page.tsx` — client SSE consumer, state management
- `src/components/AgentPipeline.tsx` — real-time agent status UI

## SSE Event Protocol

```
stage          { stage: "parallel", agents: [...] }
agent_done     { agent: "component"|"topology"|"domain"|"synthesis", result: {}, durationMs: number }
stage          { stage: "synthesis" }
synthesis_chunk { text: string }   ← token-by-token from Claude stream
done           { full: AnalysisResult }
error          { error: string }
```

Client reads via `ReadableStream` reader, not `EventSource` (allows POST bodies).

## Model

`claude-sonnet-4-6` — set in `src/lib/anthropic.ts`. Change `MODEL` there to upgrade.

## Security

- Rate limit: sliding window, 10 req/60s/IP, `Retry-After` header on 429
- Image validation: `image/*` MIME only, ≤10MB
- Never log image data
- Security headers on all responses: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`

## Constraints

- `runtime = "nodejs"` and `maxDuration = 60` on the analyze route — synthesis can take 30–45s
- Synthesis agent expects JSON output. `parseJSONFromResponse()` strips markdown code fences before parsing
- `Promise.allSettled` not `Promise.all` — always get partial results even if 1 or 2 agents fail
- Image is base64-encoded server-side before being sent to Claude, never passes through client unmodified

## Adding a New Agent

1. Add types to `agents/types.ts`
2. Add system prompt + user prompt builder to `agents/prompts.ts`
3. Add `runXAgent()` function in `orchestrator.ts` following the same pattern
4. Add to `Promise.allSettled([...])` in `orchestrate()`
5. Pass result to `runSynthesisAgent()`
6. Add card to `AgentPipeline.tsx`

## Commit style

Small and frequent. Casual messages are fine.

**Commit after each logical unit, not at the end of a session.** Examples of "one thing":
- adding/renaming one agent
- one prompt tweak
- one UI/UX adjustment
- one bugfix
- one type/interface change

**Don't bundle unrelated changes.** If you touched the SSE protocol *and* fixed a CSS bug, that's two commits.

**Before committing:** run `npm run lint` and `npm run type-check`. If either fails, fix or stash — don't commit broken state, don't use `--no-verify`.

**Don't wait for "the right moment".** Five commits in a session is normal and good. One commit at the end is a smell.

## gstack (recommended)

This project uses [gstack](https://github.com/garrytan/gstack) for AI-assisted workflows.
Install it for the best experience:

```bash
git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup --team
```

Skills like /qa, /ship, /review, /investigate, and /browse become available after install.
Use /browse for all web browsing. Use ~/.claude/skills/gstack/... for gstack file paths.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
