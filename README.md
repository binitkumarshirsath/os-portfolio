# Binit OS

The portfolio of Binitkumar Shirsath, Frontend Engineer, built as a small desktop
OS in red and black. Recruiters can read everything that matters (who he is, his
strongest work, how to reach him, the resume) without touching the chat. The AI
agent is the layer on top: it answers questions about his work, opens windows to
show things, matches job descriptions, and traces its own work in an Activity
Monitor.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
Motion · Zustand · Zod · Vercel AI SDK 6 (Groq, Gemini) · Upstash Redis

## How it fits together

```
 Browser                                       Server (Next.js route handlers)
 ───────────────────────────────────────────   ────────────────────────────────────────
 Desktop shell (≥1024px) ─┐                    POST /api/chat
 Mobile shell  (<1024px) ─┤ one window          1. Zod: body shape, ≤500-char question,
                          │ registry + store       keep the last 6 messages
 Window contents ─────────┘                     2. Upstash: 20/visitor/hour (hashed IP)
   │                                               + 250/day site-wide
   ├─ Quick-action chips ── no network,         3. streamText ── model with fallback
   │    answer from content + run a UiAction         Groq gpt-oss-120b ─(429/5xx)─► Gemini Flash
   │                                               tools: openWindow, showProject,
   ├─ Chat (AI SDK useChat) ───────────────────►     openResume, showContact
   │    ◄── streamed text + tool calls ────────  4. trace (spans, tokens, model) sent
   │        tool call → same UiAction runner          as metadata on the "finish" event
   │
   ├─ Job Match (PDF/DOCX/TXT/paste) ──────────► POST /api/jd-match
   │    ◄── structured fit report                  extract text (unpdf / mammoth) → 3/hour
   │                                               → one structured-output call
   └─ Activity Monitor ◄── latest trace
```

**Content is the single source of truth.** Everything about Binit lives in
`src/shared/content/`. The windows, the quick-action answers, the agent's system
prompt and the JD matcher all read from it, so editing content updates all of
them.

## Folder map

The code follows [Feature-Sliced Design](https://feature-sliced.design): each
layer may only import from layers below it (`app → widgets → features → entities
→ shared`), and ESLint enforces this.

```
app/                      routes, layout, metadata images; where widgets are composed
  api/chat/route.ts       the chat endpoint (validate → rate limit → agent)
  api/jd-match/route.ts   the job-description matcher
src/
  widgets/                page-level blocks
    desktop, dock, menubar     the ≥1024px "OS"
    mobile-shell               the <1024px tab layout
    windows                    what goes inside each window; where features meet
    boot-screen                the first-visit "> loading binit.os" moment
  features/               things a visitor can do
    window-manager             window registry, Zustand store, draggable frames, UiAction runner
    agent-chat                 the chat, tools, system prompt, trace recording (+ server/)
    quick-actions              the no-LLM chips
    jd-match                   JD upload/paste, report window (+ server/)
    trace-monitor              the Activity Monitor view
  entities/               how domain things look: profile hero, project card/detail,
                          experience item, agent-trace type
  shared/
    content/                   ← edit this to update the portfolio
    config/                    models, limits, window ids, UiAction type
    api/server/                fallback model, rate limiting, IP hashing, API errors
    ui/, lib/                  small primitives and hooks
    assets/fonts/              Latin subsets of the display and body fonts
scripts/                  test-rate-limit.mjs, subset-fonts.mjs
```

## The agent loop

1. A visitor types a question. The browser sends the conversation to
   `POST /api/chat`.
2. The route checks the cheapest things first: Zod validation (free), then the
   rate limits (one Redis call). Anything refused here costs no tokens.
3. `streamText` runs with a system prompt generated from the content, four tools,
   at most 3 steps and 400 output tokens.
4. When the model calls a tool, the server only acknowledges it, so the answer
   continues in the same request (one question = one unit of quota). The browser
   sees the tool call in the stream and runs the matching UI action: on desktop
   the window opens while the answer is still being written; on phones the call
   shows as a chip to tap, so nothing covers the answer.
5. Each tool call appears as a mono chip, e.g. `showProject("devflow")`, a
   visible ReAct-style trace. The full timing breakdown goes to the Activity
   Monitor.

Quick-action chips skip all of this: they append a pre-written answer built from
the content and run the same UI action, with no network call. They're instant and
free, and they keep working when the agent is rate-limited.

### Fallback

The model the agent calls is a wrapper (`shared/api/server/model.ts`): Groq
first; if Groq returns 429, 5xx, a network error, or a config error
(401/403/404), the _same_ call runs on Gemini before anything reaches the
visitor. The server log says which model served each step, and so does the
Activity Monitor. If both fail, the visitor sees a friendly message with **Try
again** and **Contact Binit**, never a raw error.

Both models "think" before answering, and thinking tokens count against the
output cap, so reasoning is kept low on Groq and off on Gemini. Measured: by
default Gemini spent 303 of 327 tokens thinking.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the keys (see below)
npm run dev                  # http://localhost:3000
```

Other scripts:

| Script                            | What it does                                                                                                                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run typecheck`               | TypeScript, strict                                                                                                                                                                   |
| `npm run lint`                    | ESLint, including the FSD layer rules                                                                                                                                                |
| `npm run format` / `format:check` | Prettier                                                                                                                                                                             |
| `npm run test:rate-limit`         | Sends 4 invalid requests (expect 400) and limit+1 valid ones (expect a 429 at the end), as a random fake visitor. `BASE_URL=https://… npm run test:rate-limit` to test a deployment. |
| `node scripts/subset-fonts.mjs`   | Re-downloads the Latin font subsets (only needed for new weights or characters)                                                                                                      |

### Environment variables

All are server-only; nothing sensitive is exposed to the browser.

| Variable                                             | Needed for                                                                                                                                                                                                                  |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GROQ_API_KEY`                                       | the primary model ([console.groq.com/keys](https://console.groq.com/keys))                                                                                                                                                  |
| `GOOGLE_GENERATIVE_AI_API_KEY`                       | the fallback model ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))                                                                                                                                       |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | rate limiting ([console.upstash.com](https://console.upstash.com)). Missing locally: limiting is skipped with one warning. Missing in production: model requests are refused, so a misconfiguration can't spend the budget. |
| `IP_HASH_SALT`                                       | salting the IP hash used as the rate-limit key, so Redis never holds raw IPs (`openssl rand -hex 32`)                                                                                                                       |
| `SITE_URL`                                           | absolute URLs in share previews and the sitemap. Optional on Vercel, which provides the production domain.                                                                                                                  |

## Updating the portfolio

Edit the files in `src/shared/content/`. Nothing else needs to change.

| File                        | Holds                                                                            |
| --------------------------- | -------------------------------------------------------------------------------- |
| `profile.ts`                | name, role, summary, email, links, resume path, time zone                        |
| `projects.ts`               | projects; `featured: true` puts one first and makes it the "best project" answer |
| `experience.ts`             | roles, newest first                                                              |
| `skills.ts`, `education.ts` | skill groups, education                                                          |
| `site.ts`                   | how the site works, in plain sentences (used by the agent and a quick action)    |

Text in square brackets, like `[ADD ROLE]`, marks a missing detail. It shows on
the page, and the agent tells visitors that detail isn't available yet instead of
guessing. Put the resume PDF in `public/` and point `profile.resumeHref` at it.
To swap models, edit `src/shared/config/ai.ts`; to change limits,
`src/shared/config/rate-limits.ts`.

## Abuse protection

- Per visitor: 20 chat questions and 3 JD matches an hour (sliding window), keyed
  by a salted SHA-256 of the IP.
- Site-wide: 250 model requests a day (fixed window), sized to stay inside the
  providers' free tiers.
- Input: questions ≤ 500 characters, only the last 6 messages reach the model,
  previous answers and the whole body are capped, JDs ≤ 12k characters and 2 MB.
  Uploaded files must match their extension by their first bytes.
- Output: ≤ 400 tokens and ≤ 3 steps per chat turn.
- Job descriptions are treated as untrusted data (instructions inside them are
  ignored) and are never stored.
- A Cloudflare Turnstile check is stubbed as a TODO in both routes, for if bots
  ever get past the limits.

## Accessibility and performance

Windows are labelled dialogs that take focus when opened and return it when
closed; Esc closes the focused one. Focus rings are always visible. Streamed
answers are announced once complete, not token by token. Reduced motion turns
off the boot screen and all movement. Lighthouse (mobile): Performance 96–97,
Accessibility, Best Practices and SEO 100.

The display and body fonts are Japanese typefaces that Google splits into
hundreds of files; loading them normally put 616 `@font-face` rules into
render-blocking CSS and preloaded 313 files. The site ships one Latin subset per
weight instead (`scripts/subset-fonts.mjs`).

## Credits

Fonts: Shippori Mincho B1, Zen Kaku Gothic New and JetBrains Mono, all under the
SIL Open Font License. Icons: Lucide. The red-and-black look is original; no
third-party logos or artwork are used.
