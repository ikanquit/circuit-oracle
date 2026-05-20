# CircuitOracle

**Drop in a schematic. Get an engineer's review.**

CircuitOracle is a multi-agent pipeline that reads circuit schematics the way a
senior analog engineer would. Three Claude agents run in parallel — one
catalogs every component, one traces the topology, one classifies what the
circuit is *for* — then a fourth agent synthesizes a full engineering review
and streams it back to your browser, token by token.

![CircuitOracle screenshot — multi-agent pipeline with streamed synthesis output](docs/screenshot.png)

<sub>_Screenshot placeholder — drop a PNG at `docs/screenshot.png` before
launch._</sub>

---

## Why this exists

LLMs are good at hand-waving about a schematic. They're worse at being
specific. Ask one prompt to do *everything* — list parts, identify the
topology, classify the domain, write the engineering review — and you get a
five-paragraph summary that confuses a feedback resistor with a bypass cap.

CircuitOracle splits the job. Three smaller, specialized prompts each get
100% of a Claude call. Their structured JSON outputs feed a fourth agent
whose only job is to argue with the previous three and write the verdict.

The synthesis pass streams its tokens as it composes, so you watch the
analysis assemble itself instead of staring at a spinner.

---

## How it works

```
   schematic.png
        │
        ▼
   ┌────────────────────────────────────────────┐
   │   Promise.allSettled([                     │
   │     componentAgent,   // counts the parts  │
   │     topologyAgent,    // traces the nets   │
   │     domainAgent,      // names the purpose │
   │   ])                                       │
   └────────────────────────────────────────────┘
        │ JSON × 3
        ▼
   synthesisAgent(image + 3 JSON blobs)
        │
        │   token, token, token, token…
        ▼
   browser  ←  SSE  ←  Next.js Node runtime
```

Failures are isolated. If the topology agent times out, the synthesizer still
gets the component catalog and the domain classification. Partial results
beat a 500.

Full architecture writeup: [`/how-it-works`](https://circuitoracle.app/how-it-works)
(or the route at `src/app/how-it-works/page.tsx` if you're reading the repo).

---

## What it tells you

For each schematic you upload, CircuitOracle produces:

- **Component catalog** — every R, C, U, Q, D on the page, with designators,
  values (when printed), and functional role.
- **Topology** — named topology, stages, feedback paths, key nodes, power
  supply structure.
- **Domain** — primary application area, target frequency range, likely
  impedance envelope, industry context.
- **Synthesis** — a senior-engineer review: operating principle step by step,
  derived parameters (gain, bandwidth, etc.), why the designer made the
  choices they did, failure modes, and what you'd change for better
  performance.

---

## Quick start

```bash
git clone https://github.com/circuit-oracle/circuit-oracle
cd circuit-oracle
npm install
cp .env.example .env.local      # then add your ANTHROPIC_API_KEY
npm run dev
```

Open <http://localhost:3000>, drop in a PNG/JPG of a schematic, and watch
the pipeline run.

### Requirements

- Node.js 20+
- An Anthropic API key with vision-capable model access
  ([console.anthropic.com](https://console.anthropic.com))

### Scripts

```bash
npm run dev          # dev server on :3000
npm run build        # production build
npm run start        # serve the built app
npm run lint         # eslint
npm run type-check   # tsc --noEmit
```

---

## Stack

- **Next.js 15** (App Router, React 19)
- **Claude** (`claude-sonnet-4-6`) via `@anthropic-ai/sdk`
- **Tailwind v4** + custom design tokens (`src/styles/tokens.css`)
- **SSE** for streamed synthesis (POST → `ReadableStream` reader, not
  `EventSource`, so we can send image bodies)
- **`Promise.allSettled`** for fault-tolerant agent dispatch
- **LRU rate limiter** — 10 req / 60s / IP

No databases. No queues. No background workers. The whole thing is a single
Next.js route streaming back from three or four concurrent SDK calls.

---

## Privacy

- Images are base64-encoded server-side and forwarded to Anthropic.
- We do not log image data. Ever. Search the repo for `console.log` and check.
- Images are not persisted anywhere — they live in request memory only.

---

## Limits

- 10 MB per image, `image/*` MIME only
- 10 requests per IP per 60 seconds
- `maxDuration = 60s` on the analyze route — synthesis can take 30–45s on
  busy circuits, so don't tighten this without testing

---

## Contributing

PRs welcome. Small and frequent commits, please — see `CLAUDE.md` for the
commit style we use ourselves.

Areas where help is most useful:

- More example schematics in `src/components/v2/SampleAnalysisStrip.tsx`
- Better failure-mode rendering when one of the three parallel agents errors
- A "compare two schematics" mode (open issue)

---

## License

MIT.

---

<sub>CircuitOracle is not a substitute for an electrical engineer. It's the
second opinion you didn't have a colleague around to give you at 1am.</sub>
