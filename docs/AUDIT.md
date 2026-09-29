# PresenceAI repository audit and implementation plan

## Supabase integration update

Project `nougnhpinewhbgixjwgc` now provides hosted Auth and PostgreSQL for the Phase 1 website. `src/lib/supabase.js` configures the browser client with a publishable key; `src/lib/supabaseApi.js` maps the existing UI operations to Supabase Auth and owner-scoped tables. The tracked SQL migration creates `public.businesses` and append-only `public.business_truth` with explicit grants and Row Level Security. The initial Node/SQLite implementation remains available only as a legacy local fallback when Supabase environment variables are absent. Its user credentials cannot be carried into Supabase Auth automatically.

The plan below describes the repository baseline and the original foundation work. Later scan tables should use `auth.users` ownership and similarly restrictive RLS policies.

## Baseline

React 19 / React DOM, Vite 8, Tailwind CSS 4, lucide-react and oxlint. JavaScript/JSX; no existing TypeScript configuration. npm lockfile included. Node 24.12.0 used for verification. `npm ci`, `npm run build` and `npm run lint` pass (Vite requires permission to spawn processes on this Windows host).

## Architecture and inventory

- `src/main.jsx` mounts App in StrictMode; `App.jsx` selects landing/dashboard/onboarding using state and URL query parameters, not a router.
- Landing: Navbar, Hero, ForensicExtraction, FrameworkArchitecture, InstitutionalResearch, TechnicalFaq and Footer. AuditModal, BriefingModal and LoginModal are overlays.
- Dashboard: sidebar/header, four active tabs (AiVisibilityTab, CompetitivePositionTab, AiAccuracyTrustTab, SourcesAuthorityTab), AccountSettingsModal.
- Onboarding: two-step marketing questionnaire (role, goals, offering, problems, audience), not verified factual business onboarding.
- State: component useState/useEffect; fake user session and questionnaire in localStorage. No shared data layer.
- No API calls, server, database, authentication service, migrations, worker, provider integration, environment configuration or tests in baseline.
- `create_pdf.py` is a separate Playwright/reportlab screenshot booklet script, not the dashboard export implementation. Python dependencies are not declared.
- Unreferenced alternate dashboard components: AiMentionsTab, CompetitiveAnalysisTab, DataAccuracyTab, OverallRankingTab, SeoScoreTab. IntelligenceArchive/DispatchModal are disconnected from App. App.css and starter React/Vite assets appear unused. Preserve these pending product decisions.

## Works versus simulated

Working: responsive presentation, modal/tab/accordion interactions, form inputs, local UI state, questionnaire selections and local persistence. Frontend can be reused cleanly, especially its shell, colors, typography and cards.

Simulated: credentials accepted by timers, social identities fabricated, password-reset success without email, account updates only local, dashboard metrics/history/prompts/competitors/sources/trends static. Audit progress is timer-driven. Export only shows a toast. Briefing/newsletter submissions do not send or save data. Research downloads and source outreach use alerts. Footer legal links are placeholders.

## Problems and missing pieces

Unauthenticated query parameters expose dashboard views; localStorage can fabricate identity. Existing onboarding does not establish business truth. No tenant boundary, validated server inputs, durable business data, provider keys, prompt management, raw responses, scan queue, analysis, metrics, issues or comparisons. Static metrics and paid-plan labels imply nonexistent activity. Existing mock components must not be presented as measurements. No large refactor is needed.

## First implementation milestone

Real signup/login/logout/session restoration → authenticated existing dashboard shell → create an owned business → complete and persist explicitly owner-verified Brand Truth → revisit after reload. Use Node 24's HTTP, crypto and SQLite modules with no new runtime dependencies. SQLite suits a single-host foundation; use PostgreSQL before a multi-instance deployment. Keep JSX rather than introduce an unrelated TypeScript migration. Server contracts and validation remain centralized.

## File/module boundaries

Implemented foundation: `server/db.js`, `server/auth.js`, `server/app.js`, `server/index.js`, `shared/business.js`, `src/lib/api.js`, `src/components/dashboard/BusinessWorkspace.jsx`, `server/foundation.test.js`.

Next: `server/providers/{interface,openai}.js`, `server/prompts/service.js`, `server/scans/{service,worker}.js`, `server/analysis/{extract,verify}.js`, `server/metrics/calculate.js`, `server/issues/generate.js`. A persistent scan queue, leased worker jobs and retry policy must precede browser scan controls. Provider calls only server-side. Discovery measurements must not disclose target business truth to the answering model; truth is for generation and subsequent verification. Semantic extraction is separate from deterministic metrics. Unknown factual comparisons remain unknown.

## Database schema

Foundation: users(id,email unique,name,password_hash,created_at); sessions(token_hash,user_id,expires_at); businesses(id,user_id,name,website,category,country,city,branch,created_at); business_truth(id,business_id,version,data_json,verified_by,verified_at), unique(business_id,version). Truth revisions are append-only and explicitly user-confirmed, never written from model output. Foreign keys enforce relationships; queries enforce ownership.

Planned scan migration: competitors(id,business_id,name,domain); prompts(id,business_id,category,text,active,revision); scans(id,business_id,truth_version,status,provider,model,measurement_version,created_at,completed_at); prompt_runs(id,scan_id,prompt_id,exact_prompt,status,error,attempt); raw_responses(id,prompt_run_id unique,response_text,citations_json,metadata_json,received_at); analysis(id,raw_response_id,analysis_version,data_json); mentions, competitor_mentions, citations and claims keyed to analysis; issues(id,scan_id,type,evidence_json); scan_metrics(scan_id unique,sample_size,metrics_json). Snapshot prompts, competitors and truth per scan. Store raw responses before analysis. Never overwrite historical metrics or raw responses.

## Implementation order

1. Foundation above, with ownership/session/validation/persistence tests.
2. Stable ~20 generated prompts plus CRUD, one provider abstraction, durable scan jobs and raw response storage; individual failures do not stop the scan.
3. Separate extraction/verification pipeline, deterministic metrics, evidence-linked issues; always return sample size and null for undefined denominators.
4. Connect existing metric views to results and then add history/comparison, accounting for changed prompt sets/model/truth versions.

Not in this milestone: AI calls, scans, metrics, OAuth, password recovery/email verification, billing or production deployment. Production needs HTTPS same-origin routing, durable backed-up database storage, deployment-wide rate limits when scaling, and operational monitoring.
