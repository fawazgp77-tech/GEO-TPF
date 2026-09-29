# PresenceAI handoff

Last updated: 2026-09-29. Start here, then read [README.md](README.md) for setup and [docs/AUDIT.md](docs/AUDIT.md) for the original audit and roadmap. Verify this file against the code and Git state before acting. Update **this file and README.md together** whenever implementation, setup, schema, deployment, or status changes.

## Goal and guardrails

PresenceAI measures how one AI model represents and recommends a business. The MVP flow is sign in → add business → owner-verify Brand Truth → generate and review about 20 customer prompts → run a scan → save every exact prompt and raw answer → analyze claims and recommendations → calculate metrics and issues → compare later scans. Preserve the existing frontend. Brand Truth is owner-supplied, versioned, and never overwritten by AI output. Do not give Brand Truth to the answering model during discovery scans; use it later for verification. The MVP has one provider, with a module boundary for future providers.

## Current implementation

- Repo: `https://github.com/fawazgp77-tech/GEO-TPF`; local checkout: `C:\GEO`; branch: `main`. Last pushed implementation commit when this file was written: `302a14d` (Phase 2).
- Stack: React 19, Vite 8, Tailwind CSS 4, JavaScript/JSX, Node 24+, Supabase Auth/PostgreSQL, `@supabase/supabase-js` 2.117.2. Supabase project ref: `nougnhpinewhbgixjwgc`.
- Phase 1 works: signup, email confirmation, login/logout, protected dashboard, owned businesses, and append-only owner-verified Brand Truth. The owner confirmed they could sign in and add Brand Truth. `src/lib/supabaseApi.js` maps app calls to Supabase; `src/components/dashboard/BusinessWorkspace.jsx` is the active workspace.
- Workspace onboarding (`src/components/Onboarding.jsx`) features a 3-step flow: Step 1 (About The User), Step 2 (About The Business), and Step 3: Business Address (State, City, Region) with quick-select region presets and optional street address for localized AI citation grounding.
- Phase 2 code is pushed and its migrations are applied: stable context-based prompt suggestions and CRUD, scan queue/statuses, prompt snapshots, per-prompt runs, raw responses, a leased Node worker, and one OpenAI Responses provider. Key files: `shared/prompts.js`, `src/components/dashboard/PromptWorkspace.jsx`, `server/scans/{index,service}.js`, `server/providers/openai.js`, `supabase/migrations/20260929161348_phase2_prompts_scans.sql`, and `20260929161745_scan_active_guard.sql`. Browser users can manage owned prompts and read their scan evidence; only the server worker writes scans and raw responses.
- **Live scans are not yet verified or enabled locally.** `.env.scan` does not exist as of this handoff. It must contain server-only `SUPABASE_SECRET_KEY`, `OPENAI_API_KEY`, and `OPENAI_MODEL`; run `npm run dev:scans` beside `npm run dev`. Do not request the user paste secrets into chat. The worker's no-key `/health` response and `503` behavior were verified. The signed-in prompt UI rendered, but no user prompts were generated or live scans run during implementation.
- Analysis, calculated visibility/accuracy metrics, issues, trend comparisons, and report export are **not implemented**. Older dashboard metric components contain mock values and are not wired to scan results. Do not present them as measured data.

## Local setup and verification

Run `npm ci`, configure ignored `.env.local` using `.env.example` with the browser-safe Supabase URL and publishable key, then `npm run dev` at `http://localhost:5173/?view=dashboard`. The Supabase Auth Site URL and confirmation redirect are set for this localhost address; a confirmation link cannot load if the dev server is stopped or is opened on another device. `.env.local` exists in the current workspace but is ignored. The old Node/SQLite Phase 1 API is a fallback only when Supabase variables are absent; its accounts and data are separate from Supabase.

Run `npm run lint`, `npm test`, and `npm run build`. At the Phase 2 push all passed (four tests); build emitted only a non-blocking >500 kB chunk warning. Supabase RLS was verified enabled for `prompts`, `scans`, `prompt_runs`, and `raw_responses`; authenticated clients have prompt write grants but no scan/raw-response insert grants. The Supabase security advisor reported a separate Auth setting warning about leaked-password protection. Recheck migrations and advisors after database changes.

## Next work

1. Once the owner configures server-only credentials and chooses an available `OPENAI_MODEL`, run one small live scan. Confirm authentication, queue progress, raw payload storage, per-prompt failure handling, and readback through the UI. Keep spend controlled. The Codex Supabase MCP login is for development tools; it does not supply the website worker's runtime secret.
2. Build a separate response-analysis pipeline. Use deterministic extraction when reliable and AI only for semantic judgments; mark unverifiable claims unknown. Store analysis separately from raw responses and link claims/errors to evidence and the Brand Truth version.
3. Calculate mention rate, recommendation rate, position, prompt coverage, factual accuracy/errors, competitor visibility/share, citation frequency, and sample sizes with defined denominators. Generate evidence-linked issues without claiming unsupported causation.
4. Replace mock dashboard metrics with persisted scan summaries and compare latest versus previous scans. Preserve historical scans and account for changed prompts, truth versions, and model versions.

When changing any of the above, update both this handoff and README.md, run appropriate checks, and state what was actually verified.
