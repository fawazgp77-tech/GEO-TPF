# PresenceAI

Existing React/Vite/Tailwind frontend with Supabase Auth and PostgreSQL for business onboarding and Phase 2 prompt/scan records.

New coding chat? Read [handoff.md](handoff.md) for current project state and next steps. Repository guidance in [AGENTS.md](AGENTS.md) asks agents to read **both this README and the handoff** at the start of a session and update both whenever the project changes.

## Run locally

Requires Node >=24.12.0. Run `npm ci`, then copy `.env.example` to `.env.local` and set the project's **publishable** Supabase API key. The URL is already set to project `nougnhpinewhbgixjwgc`. Run `npm run dev` and open http://localhost:5173. Auth, business onboarding, and prompt management work without a local backend; live scans require the separate worker below.

The current Supabase project has the Phase 1 schema applied from `supabase/migrations/20260928153921_presenceai_phase1.sql`. Its Auth Site URL is `http://localhost:5173/`, with `http://localhost:5173/?view=dashboard` allowed for confirmation redirects. For another deployment, set its own site URL and exact redirect URL in Supabase Auth settings. Hosted Supabase normally requires email confirmation before the first sign-in; the UI explains this after signup.

Never put a Supabase secret or service-role key in `VITE_` variables. The publishable key is intentionally browser-visible. PostgreSQL grants and Row Level Security restrict businesses and verified Brand Truth to their owner. No AI-generated content writes to Brand Truth.

## Phase 2 prompts and scans

After verifying Brand Truth, open **Prompts & scans** from a business card. Generate 20 business-specific suggestions once, then review, edit, disable, delete, or add prompts. The prompt set persists; a scan snapshots the exact active questions so later edits never change historical evidence.

The Phase 2 migrations create `prompts`, `scans`, `prompt_runs`, and `raw_responses`. Owners can manage their prompts and read their own scan evidence through RLS. Only the server-side worker can create or update scans and raw responses.

For live scans, put `SUPABASE_SECRET_KEY`, `OPENAI_API_KEY`, and `OPENAI_MODEL` in ignored `.env.scan`, then run `npm run dev:scans` alongside `npm run dev`. The scan server listens on `127.0.0.1:3002` and Vite proxies `/scan-api` to it. `SUPABASE_SECRET_KEY` is the project's server-only Supabase secret key. **Never put either secret in a `VITE_` variable or commit `.env.scan`.** Without the keys, prompt management still works, but the scan server reports that live scans are unavailable.

The worker processes queued scans outside the browser, retries a failed prompt once, continues after individual failures, stores the full provider payload and exact answer before marking a run successful, and recovers interrupted jobs through leases. OpenAI is the only provider implemented; its model is chosen by `OPENAI_MODEL`. Analysis, calculated metrics, issues, and comparisons remain the next milestone. The scan input does not include verified Brand Truth, which is reserved for later factual verification.

## Scope and local data

Implemented: signup with 6-digit OTP verification page, login/logout (with 6-character minimum password requirement), 4-step workspace onboarding (Step 1: Business Name & Website, Step 2: About The User, Step 3: Business Details, Step 4: Business Address [State, City, Region]), protected dashboard, owned business creation and deletion, versioned and explicitly verified Brand Truth, persistent prompt CRUD and scan evidence storage. Existing mock metric components remain disconnected until analysis and metrics are implemented.

The earlier Node/SQLite Phase 1 prototype is still available when the Supabase variables are absent. Its ignored database at `data/presence.sqlite` is preserved. SQLite accounts and passwords are **not** Supabase accounts. To use the connected site, create a Supabase account and verify its email; old local business records are not automatically transferred between identities. The legacy API can be started with `npm run dev:server` only when using the SQLite fallback.

Run `npm run lint` and `npm run build` for the frontend. `npm test` covers the legacy local API plus prompt generation, provider normalization, and partial scan failures. See [the repository audit and implementation order](docs/AUDIT.md).

## Deployment

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` during the build and add the deployed site's HTTPS URL to Supabase Auth's redirect allowlist. Deploy the scan server separately with its server-only credentials and background worker process. The current configuration is for local development.
