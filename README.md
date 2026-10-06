# PresenceAI

Existing React/Vite/Tailwind frontend with Supabase Auth and PostgreSQL for business onboarding and Phase 2 prompt/scan records. Signup includes a 6-digit OTP verification screen; onboarding collects business name and website, user context, business details, and address across four steps. Add and verify a business in the authenticated workspace after onboarding.

New coding chat? Read [handoff.md](handoff.md) for current project state and next steps. Repository guidance in [AGENTS.md](AGENTS.md) asks agents to read **both this README and the handoff** at the start of a session and update both whenever the project changes.

## Run locally

Requires Node >=24.12.0. Run `npm ci`, then copy `.env.example` to `.env.local` and set the project's **publishable** Supabase API key. The URL is already set to project `nougnhpinewhbgixjwgc`. Run `npm run dev` and open http://localhost:5173. Auth, business onboarding, and prompt management work without a local backend; live scans require the separate worker below.

The current Supabase project has the Phase 1 schema applied from `supabase/migrations/20260928153921_presenceai_phase1.sql`. Its Auth Site URL is `http://localhost:5173/`, with `http://localhost:5173/?view=dashboard` allowed for confirmation redirects. For another deployment, set its own site URL and exact redirect URL in Supabase Auth settings. Hosted Supabase normally requires email confirmation before the first sign-in; the UI explains this after signup.

Never put a Supabase secret or service-role key in `VITE_` variables. The publishable key is intentionally browser-visible. PostgreSQL grants and Row Level Security restrict businesses and verified Brand Truth to their owner. No AI-generated content writes to Brand Truth.

## Phase 2 prompts and scans

The default **Your Businesses** tab lists owned businesses, lets you delete one, and opens the measured business dashboard after Brand Truth is verified. The four other analytical tabs retain their original layout with a sample-data preview notice; their figures are not connected to scans.

After verifying Brand Truth, open the business dashboard from its card. It shows the latest scan's saved-answer count, exact business-name text matches, cited-answer count, category coverage, recent runs, and Gemini's combined analysis. These counts are calculated from the latest saved scan and use its answered prompts as the denominator; an exact text match does not mean the model recommends the business. Open **Prompts & scans** from there. Step 1 generates up to 20 business-specific suggestions; you can fill an existing short list to 20, edit each question inline, exclude or delete one, and add custom prompts. The prompt set persists; a scan snapshots the exact active questions so later edits never change historical evidence.

The Phase 2 migrations create `prompts`, `scans`, `prompt_runs`, `raw_responses`, and `scan_analyses`. Owners can manage prompts and read their scan evidence and analysis through RLS. Only the server-side worker writes scans, raw responses, and analyses.

For live scans, put `SUPABASE_SECRET_KEY` and `GEMINI_API_KEY` in ignored `.env.scan`, then run `npm run dev:scans` alongside `npm run dev`. Optionally set `GEMINI_MODEL`; it defaults to `gemini-3.5-flash-lite`. `GEMINI_REQUEST_INTERVAL_MS` defaults to 6000 to pace a multi-prompt run; the worker also backs off and retries once after a 429 rate-limit response. Google returned a 404 for `gemini-2.5-flash-lite` on a new key and recommended this newer model. A Gemini API key works across models available to its Google AI Studio project; the model is selected by this worker, not encoded in the key. The scan server listens on `127.0.0.1:3002` and Vite proxies `/scan-api` to it. `SUPABASE_SECRET_KEY` is the project's server-only Supabase secret key. **Never put either secret in a `VITE_` variable or commit `.env.scan`.** Without the keys, prompt management still works, but the scan server reports that live scans are unavailable. An old `OPENAI_API_KEY` or `OPENAI_MODEL` entry is ignored.

The worker processes queued scans outside the browser, retries a failed prompt once, continues after individual failures, stores the full provider payload and exact answer before marking a run successful, and recovers interrupted jobs through leases. After saving individual answers, it asks the same Gemini model for a combined summary and themes with prompt-number evidence, then stores both the report and its raw Gemini payload. Analysis failure is shown separately and does not erase individual answers. This is a synthesis of **model outputs**, not verified factual accuracy or measured visibility. The scan input does not include verified Brand Truth, which is reserved for later factual verification. On 2026-10-05, a full 20-prompt scan of the placeholder `Testname` business completed through the dashboard: 20/20 answers and raw responses saved, zero failed, combined analysis succeeded, and the dashboard's eight exact-name text matches and zero cited answers matched SQL. This is an integration test with fictional placeholders, not a real business visibility assessment. A reviewed real-business prompt set and production deployment remain unverified. Factual accuracy, recommendation scoring, issues, and comparisons remain future work. Google's free-tier Gemini API inputs and outputs may be used to improve its products; check the current [Gemini pricing and data-use terms](https://ai.google.dev/gemini-api/docs/pricing) before scanning sensitive information.

## Scope and local data

Implemented: signup with 6-digit OTP verification, login/logout, four-step onboarding, owned business creation/deletion, versioned and explicitly verified Brand Truth, persistent prompt CRUD, scan evidence storage, a saved combined Gemini summary, and a business overview with transparent scan counts. The four legacy analytical tabs show sample figures and remain disconnected; factual accuracy, recommendation scoring, competitor share, trends, and report export are not calculated yet.

The earlier Node/SQLite Phase 1 prototype is still available when the Supabase variables are absent. Its ignored database at `data/presence.sqlite` is preserved. SQLite accounts and passwords are **not** Supabase accounts. To use the connected site, create a Supabase account and verify its email; old local business records are not automatically transferred between identities. The legacy API can be started with `npm run dev:server` only when using the SQLite fallback.

Run `npm run lint` and `npm run build` for the frontend. `npm test` covers the legacy local API plus prompt generation, provider normalization, and partial scan failures. See [the repository audit and implementation order](docs/AUDIT.md).

## Deployment

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` during the build and add the deployed site's HTTPS URL to Supabase Auth's redirect allowlist. Deploy the scan server separately with its server-only credentials and background worker process. The current configuration is for local development.
