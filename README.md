# PresenceAI

Existing React/Vite/Tailwind frontend with Supabase Auth and PostgreSQL for Phase 1 business onboarding.

## Run locally

Requires Node >=24.12.0. Run `npm ci`, then copy `.env.example` to `.env.local` and set the project's **publishable** Supabase API key. The URL is already set to project `nougnhpinewhbgixjwgc`. Run `npm run dev` and open http://localhost:5173. No backend process is required for the Supabase path.

The current Supabase project has the Phase 1 schema applied from `supabase/migrations/20260928153921_presenceai_phase1.sql`. Its Auth Site URL is `http://localhost:5173/`, with `http://localhost:5173/?view=dashboard` allowed for confirmation redirects. For another deployment, set its own site URL and exact redirect URL in Supabase Auth settings. Hosted Supabase normally requires email confirmation before the first sign-in; the UI explains this after signup.

Never put a Supabase secret or service-role key in `VITE_` variables. The publishable key is intentionally browser-visible. PostgreSQL grants and Row Level Security restrict businesses and verified Brand Truth to their owner. No AI-generated content writes to Brand Truth.

## Scope and local data

Implemented: signup/login/logout, protected dashboard, owned business creation, versioned and explicitly verified Brand Truth. Existing mock metric components remain disconnected until scans are implemented.

The earlier Node/SQLite Phase 1 prototype is still available when the Supabase variables are absent. Its ignored database at `data/presence.sqlite` is preserved. SQLite accounts and passwords are **not** Supabase accounts. To use the connected site, create a Supabase account and verify its email; old local business records are not automatically transferred between identities. The legacy API can be started with `npm run dev:server` only when using the SQLite fallback.

Run `npm run lint` and `npm run build` for the frontend. `npm test` covers the legacy local API's authentication, ownership, truth revisions and persistence. See [the repository audit and implementation order](docs/AUDIT.md).

## Deployment

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` during the build and add the deployed site's HTTPS URL to Supabase Auth's redirect allowlist. The current default Site URL is for local development. Phase 2 AI provider calls will require a server-side worker and server-only provider credentials.
