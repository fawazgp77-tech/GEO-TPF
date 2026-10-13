# PresenceAI UI redesign implementation plan

Created: 2026-10-12. Updated: 2026-10-13. Status: **PHASES 1–4, PROMPT WORKSPACE CORE, AND ANALYTICS 6A–6B IMPLEMENTED; SHARED CROSS-SECTION POLLING AND PHASE 7 HISTORY STILL PLANNED.**

## 1. How to use this document

Read `AGENTS.md`, `handoff.md`, and `README.md` before implementing. Then read this plan and inspect the current code and Git status. This plan records the requested redesign, implementation decisions, and verified completion checkpoints. Only checked tasks and the delivery table describe completed work.

Implement one phase at a time. After each phase, update its checklist and completion record below, and update both README and handoff. Record actual checks, remaining gaps, migrations, and deviations. Do not mark a phase complete based on screenshots alone when it includes data operations.

The user's explicit request for a complete redesign supersedes the earlier instruction to preserve the existing frontend's appearance. Preserve functional behavior, ownership boundaries, saved evidence, and credentials handling. Do not discard existing uncommitted work. Do not push or deploy merely because a phase is complete.

## 2. Product brief and reference material

### User requirements

- Authentication: translucent rounded panel over a video background, using reference 1.
- First onboarding: add a business through a wizard that asks one question at a time.
- Wizard background: a regular grid of small dots reacting locally to pointer proximity. Dark theme uses dark-gray background and off-white dots that glow; light theme uses white background and light-gray dots that darken.
- Dashboard sidebar, in this order: **Business profile, Prompts, Analytics, Fix queue, Scan history**.
- Business profile: business identity, basic information, and a compact summary of earlier scans.
- Prompts: show current questions; support generation and individual editing.
- Analytics: useful widgets, separate metric scores, competitor comparisons, and a short overall analysis summary.
- Scan history: dates and titles; opening an entry opens that scan's analysis board.
- Fix queue: upcoming feature only. Do not implement queue behavior.
- User's Phase 4 follow-up: expand translucent widgets, with a minimal dot treatment confined to the business profile header; never a dot layer across the dashboard.
- User's follow-up: retain the login panel's translucent appearance. `GlassPanel` is shared by auth and the wizard; carry this surface treatment into future profile, prompt, and analytics layouts rather than reverting to solid cards.
- The 2026-10-13 visual refinement adds a macOS-inspired frosted shell, softer elevated cards, rounded fact/metric cells, inset controls, consistent select chevrons, segmented prompt tabs, and full-height mobile drawer. This is a CSS-only pass over the existing working screens; future phases should retain the same visual language.
- Follow-up on 2026-10-13: closed-field CSS could not theme the opened native Windows select popup. Active workspace selectors now use a shared custom combobox/listbox, including the mobile dialog, while keeping the same controlled values and callbacks.

### Visual references

1. Auth reference: `C:/Users/fawaz/AppData/Local/Temp/codex-clipboard-a625ff99-1eb1-4acb-ac4c-56f0faf93e8d.png`.
   - Glass panel, rounded edges, segmented sign-in/sign-up control, roomy fields, high-contrast main button, abstract luminous background.
2. Dashboard reference: `C:/Users/fawaz/AppData/Local/Temp/codex-clipboard-796fded3-9b9d-44b1-8197-4bdad51faed7.png`.
   - Light-gray sidebar, white canvas, rounded bordered widgets, clear black typography, orange accent, generous alignment and compact report table.
3. Original Stitch URL: `https://stitch.withgoogle.com/projects/6897219458663111161`. The prior inspection reached Google sign-in, so its screens have not been reviewed. The two attached images are the actionable references.

Reference images are visual guidance. Revenue, orders, generic traffic sources, social login buttons, and phone fields in them are not automatic feature requirements. Keep PresenceAI branding. Avoid copying the decorative orange frame outside the dashboard into the working app; use the available viewport for content.

Durable reference copies live in `docs/design-references/authentication.png` and `docs/design-references/dashboard.png`. The supplied `C:/GEO/Login-page.mp4` (8,309,092 bytes) is now imported by `AuthBackground` and emitted as a hashed production asset. Browser playback confirmed a 10-second, 1600×1200 video. A code-authored SVG poster is used during loading, failure, explicit pause, and reduced motion; it is a visual fallback, not an extracted video frame.

## 3. Baseline before the redesign and preserved boundaries

Inspected baseline: React 19, JavaScript/JSX, Vite, Tailwind 4, lucide-react. No router or chart library is currently listed in package.json.

Working areas to preserve:

- Signup/login/logout, six-digit email verification and resend flow, session restoration.
- Owned businesses and explicitly verified, versioned Brand Truth.
- Twenty template-generated discovery prompts, custom prompts, editing, activation, deletion, and replacement.
- Server-side Gemini scan execution, exact question snapshots, raw answers, retries, partial failures, combined analysis, and stored history.
- Business-level counts of answers, unprompted literal name matches, citations, and categories.

Known limits relevant to implementation:

- `App.jsx` and dashboard use component state and query parameters for navigation; business/scan selection is not a complete URL-backed route model.
- The four legacy analytical sections use sample figures. Their removal from normal navigation is part of the redesign.
- `Onboarding.jsx` collects answers separately from persisted business creation. The new wizard must connect them.
- Dashboard demo access and fabricated identity fallbacks exist; real workspace navigation must use the actual session. Any retained demo must be clearly isolated and labeled.
- Account editing currently contains local-state behavior. Audit what persists before presenting a successful save.
- Current name matching uses the current business name and an inferred location-free alias. Stable historical metrics require a captured identity and metric version.
- Recommendation extraction, factual verification, competitor metrics, persisted score versions, and comparable historical trends are additional backend work, not CSS changes.
- Prompt generation currently uses templates, not a Gemini generation call. Preserve this behavior unless a later request changes it.

Core invariants: provider secrets stay server-side; owner verification remains explicit; discovery answers never receive Brand Truth or the target/competitor identities as hidden context; raw answers are saved before analysis; historical evidence is immutable; access remains owner-scoped.

## 4. Target information architecture

Use query-backed navigation initially to preserve the current Vite hosting setup and existing links. Centralize parsing, validation, and updates in a small navigation module instead of scattering URL reads across components. Suggested canonical addresses:

- `?view=dashboard&business=<id>&section=profile`
- `?view=dashboard&business=<id>&section=prompts`
- `?view=dashboard&business=<id>&section=analytics&scan=<id>`
- `?view=dashboard&business=<id>&section=history`
- `?view=onboarding` for adding a business.

The exact parameter names can change once during phase 1, then document them. Preserve existing auth/signup entry points and confirmation URLs. Handle `popstate`, unknown sections, deleted businesses, inaccessible scans, and expired sessions. Validate selected IDs through owner-scoped data access. Never reuse the previous business's visible results while loading another business.

Business switcher belongs above the sidebar navigation. Account/theme controls belong in the app shell. Fix queue is a visibly disabled navigation item with a Coming soon label and no destination, APIs, or database work.

Selected scan is the common input to the Analytics board. History opens that same board with a specific scan ID. Business profile summarizes the latest completed scan and separately surfaces any currently running scan. A new pending scan must not erase the previous completed results.

## 5. Phase 1 — Foundation, design system, navigation

### Work

- [x] Record Git state and identify existing changes before editing. Preserve the uncommitted discovery-prompt work and evaluation report.
- [x] Inventory all user actions and map each to its current API or local-only behavior. See `docs/UI_ACTION_INVENTORY.md`.
- [x] Define semantic theme tokens in `src/index.css`: canvas, sidebar, surface, raised surface, border, text, muted text, accent, focus, success, warning, error.
- [x] Use a single readable sans-serif family, initially Inter with system fallbacks. Use tabular numerals for shared metrics. Legacy screen typography is bridged pending its later phase.
- [x] Use an 8px spacing rhythm, restrained shadows, approximately 16–24px card radii, and consistent 40–44px controls. Use dark text on orange actions and theme-specific accent text.
- [x] Implement light and dark themes with a stored preference and system preference fallback. Prevent a wrong-theme flash on initial load. Scope styles so legacy pages remain usable while migrating.
- [x] Build reusable Button, Input, Textarea, Select, Card, Badge, MetricCard, EmptyState, Skeleton, ErrorNotice, Dialog, and Table components as needed.
- [x] Build the sidebar, business switcher, content header, account dialog, mobile navigation drawer, and theme toggle.
- [x] Centralize navigation and preserve browser Back/Forward and refresh behavior.
- [x] Move shared business-list access into `useBusinesses`; preserve one mounted legacy polling owner per screen without adding a state library.

### Likely files

`src/App.jsx`, `src/index.css`, `src/components/dashboard/Dashboard.jsx`; new `src/components/ui/`, `src/components/layout/`, `src/hooks/`, and `src/lib/navigation.js` as justified. Keep existing API clients and worker boundaries.

### Acceptance

- Sidebar order matches the brief; Fix queue is disabled.
- Theme persists and both themes cover dialogs, forms, tables, and backgrounds.
- Layout works at approximately 390px, 768px, and 1440px without page-level horizontal overflow.
- Keyboard focus is visible; drawer/dialog focus is managed and restored.
- Refresh and Back return to the correct business and section; inaccessible IDs show a safe empty/error state.

## 6. Phase 2 — Authentication over video

### Work

- [x] Refactor `LoginModal.jsx` into an accessible full-screen native dialog with reusable `AuthForm`; preserve auth API routes and callbacks.
- [x] Build the centered glass panel with a Sign up / Sign in segmented switch and mobile spacing.
- [x] Keep required name/email/password fields, correct autocomplete attributes, and password visibility control.
- [x] Omit unimplemented phone authentication and Google/Apple buttons. Successful completion requires a returned user ID; no fabricated fallback identity.
- [x] Integrate the supplied video with mute/loop/playsInline, poster, overlay, and load/error/rejected-playback fallbacks.
- [x] Decorative media is outside the accessibility tree. The later auth refinement keeps muted video autoplaying and looping while the page is open, with a poster if playback fails; there is no manual pause or hidden-tab pause logic.
- [x] Style verification, OTP autofill/paste helpers, resend cooldown, errors, and submitting states. Support immediate-session signup as well as confirmation-required signup.
- [x] Keep confirmation redirects and add a real-session check for users who used the email link. Auth is URL-driven. The later refinement removes in-page dismissal and keeps browser Back available.

### Acceptance

Existing authentication works through the new UI, including session refresh and logout. Errors remain visible and actionable. Password managers and paste into OTP fields work. Video failure does not block the form. Validate the supplied `Login-page.mp4` and explicitly record any remaining playback/fallback gaps.

## 7. Phase 3 — Persistent one-question onboarding wizard

### Work

- [x] Replace the questionnaire with a wizard connected to existing business/truth APIs. Signup, Add business, legacy create links, and incomplete-business setup reach it.
- [x] Use `shared/business.js` for required fields and validation; all six basic and thirteen truth fields are represented.
- [x] Ask one question at a time: six business basics, then official name/website confirmations and required truth facts, then optional facts. Friendly headings retain schema-backed input labels.
- [x] Prefill official name, website, and served city; optional questions can be skipped; review groups have Edit links. Saved business basics are immutable through this setup flow.
- [x] Back/Continue, progress, inline validation, autofocus, multiline behavior, and Ctrl/Command+Enter implemented. Review/success headings receive focus.
- [x] Owner-verification checkbox is required and starts unchecked, including after reload, edits, or save failure.
- [x] Stable UUID creation request and immutable submission snapshot prevent duplicate businesses on retry. Owner-filtered recovery uses the existing primary key, without upsert or schema change. Lost truth-save responses are reconciled against the intended next revision; conflicting facts are not overwritten.
- [x] Drafts are scoped to account/business in sessionStorage. The `draft` query parameter retains a creation ID if storage is unavailable. Draft answers are not durable across tabs/devices; this is explained. Drafts clear after success/logout/session expiry; stale callbacks cannot rewrite them after logout.
- [x] Single-canvas dot grid with capped density/device pixel ratio; no React state update per pointer frame.
- [x] Cursor proximity affects a 140px radius; off-white glow on dark gray and darker dots on white. Glass panel/background preserve input events and readability.
- [x] Rendering is event-driven, paused when hidden, static for coarse pointers/reduced motion, and cleans up frames/listeners/observer.

### Acceptance

A new user can complete the wizard and reach the persisted business profile. Back/Edit retain values. Network failure and retry do not duplicate businesses. Required fields match server validation. Existing verified profiles remain available. The dot effect works in both themes without slowing typing or scrolling.

## 8. Phase 4 — Business profile

### Work

- [x] Refactor `BusinessWorkspace.jsx` into business selection/creation and a focused profile page.
- [x] Header: business name, category, location, website, verification status, and a restrained primary action based on readiness.
- [x] Present business details and Brand Truth in readable grouped cards. Keep explicit revision information and owner confirmation when saving a new truth version.
- [x] Add a compact latest-completed-scan strip: date, model, mentions with denominator, answer coverage, and a short summary excerpt.
- [x] Show up to three recent scans with links to their boards. Display running-scan progress separately.
- [x] Provide Manage prompts, View analytics, and Run scan actions where prerequisites are met. Explain missing verification or prompts beside a disabled action.
- [x] Keep business deletion in a secondary/danger area with existing confirmation and clear consequences. Do not add inline business editing unless an update API exists or is deliberately implemented.
- [x] Provide first-business, incomplete-profile, no-scan, loading, and failed-request states.

### Acceptance

Profile information and summary reflect the selected business's persisted data. Editing truth creates a revision. New scans do not replace the prior completed summary with zeros. Switching businesses cannot display stale results from another business.

## 9. Phase 5 — Prompt workspace and scan launch

### Work

- [x] Split prompt editing from scan-history/result rendering currently combined in `PromptWorkspace.jsx`.
- [x] Desktop table/list columns: include toggle, prompt, category, actions. Mobile uses stacked rows with the same actions.
- [x] Preserve generate-20, fill-to-20, confirmed replacement, add-custom, edit, cancel, delete, and active/inactive behavior.
- [ ] Use a readable inline editor or side panel with character limits, category selection, unsaved-change handling, and errors beside the edited question.
- [x] Add search plus category and active-state filters. Filters affect the visible list only; they must not silently change which prompts run.
- [x] Display total and active counts and clearly state that a scan uses all active saved prompts.
- [x] Warn when a question includes a tracked brand name; explain exclusion from the unprompted denominator without prohibiting legitimate custom questions.
- [x] Keep generated questions generic and local where appropriate; never insert Brand Truth into the answering request.
- [x] Provide a scan launch control with business, model, and saved active count. Block duplicate launch while a scan is pending/running and block launch with no active prompts.
- [x] Show a persistent but compact progress region with completed, pending, and failed counts and an Open results action. Continue safe polling across section changes through a shared owner of that polling lifecycle.

### Acceptance

All existing prompt actions persist after reload. Cancel never saves. Replacement preserves old scan evidence. Unsaved edits are not silently scanned. Search/filter does not change scan scope. Failed launch preserves prompts and gives a retryable error.

Requested extension implemented: tabs for saved prompts and generic suggestions; 20 starter questions visible even before first save, individually addable questions, and total/active/paused/tested cards. Scan-result filtering uses the selected saved scan and stable prompt ID for business-website citations, unbranded positive/negative visibility, other citations, failed answers, untested prompts, and branded questions. These labels describe saved model output, not factual accuracy or sentiment. The dashboard now owns one scan-status poller across sections and shows a compact progress strip; a live active-scan transition has not been rerun since this change. A full Phase 5 acceptance pass still needs hosted persistence/launch verification; earlier prompt interactions used an isolated mock.

## 10. Phase 6A — Analytics from existing saved evidence

Deliver this before deeper scoring. Reuse a single `AnalyticsBoard` for the latest completed scan and any historical scan.

### Layout and work

- [x] Header: business, scan date/status/model, scan selector, and Run scan action.
- [x] Top row, at most four primary cards: unprompted mention rate; answers saved versus attempted; answers with returned citations; failed/unanswered count. Keep active prompts on the Prompts page.
- [x] Main section: short combined summary and expandable findings. Make prompt-number evidence links open the corresponding saved answer.
- [x] Supporting section: mention rate and answer coverage by prompt category. Use simple accessible bars with counts; no decorative chart without useful information.
- [x] Answer explorer: exact question, category, status, full answer, literal name-match indicator, returned citations, and error when applicable. Search and filter by mention/status.
- [x] Clearly label combined analysis as a summary of model outputs. Preserve raw text; do not render model-generated HTML unsafely. Validate citation URL schemes.
- [x] Treat analysis status separately from answer collection. A failed summary must not hide saved answers.
- [x] Resolve evidence by stable run identity; verify the worker's numbering before wiring links so failed prompts cannot shift references to the wrong answer.

### Metric definitions

| Metric | Definition | Empty/partial handling |
| --- | --- | --- |
| Unprompted mention rate | Successful unbranded answers with a target-name match / all successful unbranded answers | Show numerator/denominator; zero denominator is unavailable, not 0% |
| Answer coverage | Successful saved answers / attempted prompt runs | Show failed and pending separately; incomplete scans labeled provisional |
| Citation coverage | Successful answers with one or more returned citations / successful answers | Zero citations means none returned, not proof that no source was used |
| Category mention rate | Same mention rule within each category | Show answered sample size for each category |

Keep literal matching limitations visible in a compact method explanation. Do not label the mention rate as recommendation, market share, or factual accuracy. Avoid a composite overall score in this release.

### Acceptance

Each widget can be reconciled to saved answers. Zero, no data, failure, and in-progress states are distinct. Summary evidence links open the correct response. The board never substitutes sample figures for missing measurements.

Implemented with one AnalyticsBoard for current and selected historical scans. Live read-only Testname scans showed distinct 20/20 and 1/1 boards; a theme's prompt link opened the exact archived answer. Isolated fixture checked partial, failed-summary, empty, missing-prompts, inaccessible-scan, unsafe-citation, answer-filter and responsive states. The board labels historical counts as recomputed from saved answers using the current business name because older scans have no versioned identity metric. No live scan was launched during this redesign.

## 11. Phase 6B — Versioned scores and competitor analysis

This is new backend capability. Implement after the redesigned workflow and 6A are stable. Use the Supabase skills when implementing schema/query work and inspect the actual schema before drafting migrations.

### Data and processing work

- [x] Define a structured analysis contract and deterministic metric formulas before building score widgets.
- [x] Let the owner review tracked competitor names and aliases. Existing free-text competitors can seed suggestions, but are not automatically verified identities.
- [x] Capture business identity/aliases, competitor set, prompt-set fingerprint, truth revision, provider/model, and analysis/metric versions for each new measurement.
- [x] Preserve raw outputs. Run structured extraction after answers are saved, through the existing Gemini provider boundary. Target identity and Brand Truth may be supplied to this analysis stage only.
- [x] Store per-answer entity matches, recommendation classification, exact supporting quotations, prompt-run references, claim comparisons, and unknown/ambiguous states. Validate quotations against the saved answer.
- [x] Calculate aggregates in code from validated records. Never accept an LLM's arbitrary numeric score as the final metric.
- [x] Use additive tables/migrations for analysis versions and metrics where needed; keep the existing combined report available. Make processing idempotent and retryable without rerunning paid answer calls.
- [x] Use owner-readable/server-written access policies and ownership checks for all new records. Partial extraction failure must preserve raw evidence and report analysis coverage.

### Scoring specification

- **Mention score, 0–100:** 100 × unprompted mention rate. Display the percentage and sample size rather than a subjective grade.
- **Recommendation score, 0–100:** explicitly recommended answers / eligible successfully classified unbranded answers × 100. Show excluded/unknown classifications and extraction coverage. A mention alone is not a recommendation; negated recommendations must be handled.
- **Factual agreement, 0–100:** supported checkable claims / (supported + contradicted checkable claims) × 100, compared with that scan's owner-verified truth revision. Show unknown claims and verification coverage separately. Label this agreement with Brand Truth, not independently established world accuracy.
- **Competitor comparison:** for a fair side-by-side table, use the common set of successful questions naming none of the tracked brands. Apply the same matching/classification rules to every brand. Display business, mentions, mention rate, recommendation rate, and evidence links.
- Omit an overall blended score until there is an explicit, justified weighting specification. Do not call a within-sample mention percentage market share.
- Name collisions, ambiguous aliases, and unsupported extraction are unknown/review-needed results, not silent positive matches.

### Historical comparability

Legacy scans without identity/competitor/version snapshots remain readable. Do not silently rescore them with today's business profile and present that as their original result. If a retrospective analysis is introduced, label it and retain its separate version/date.

Only show change indicators when prompt sets, model, identity/competitor definitions, and metric versions are comparable. Otherwise display a clear non-comparable state. At least two comparable scans are required for a trend; never manufacture a time series.

### Acceptance

Use reviewed examples covering positive, negative, absent, ambiguous, and failed extraction cases. Reconcile every aggregate to evidence. Editing a competitor or Brand Truth later must not change an earlier saved score. Validate access isolation and analysis retry behavior before exposing the new metrics as complete.

## 12. Phase 7 — Scan history and historical boards

This phase depends on 6A, not 6B; ship useful history before deeper scores if necessary.

- [x] Build a table with title, timestamp, model, status, and successful/total answer counts.
- [x] Derive default titles such as `Discovery scan · 12 Oct 2026, 14:30` from saved timestamps. Use a short ID when needed for uniqueness. Persisted custom titles are optional future work, not required for launch.
- [x] Add date/status filtering and chronological sorting. Use the user's locale/timezone consistently.
- [x] Opening a row navigates to the shared Analytics board for that exact scan ID. Show a historical label and Back to history action.
- [x] Preserve history filters when returning. Support paging/load-more if result sizes require it; avoid fetching every raw answer for the entire history list.
- [x] Show scans with missing/failed analyses and partial answers. No chart or score should fall back to latest-scan data when the selected historical scan lacks it.
- [x] Do not add scan deletion or report export as incidental scope.

### Acceptance

Two different entries show their own questions, answers, and reports. Direct links, reload, Back, filters, and model/status labels work. Older records with missing new metrics remain usable and explicitly indicate unavailable measurements.

## 13. Phase 8 — Integration, accessibility, release readiness

- [ ] Run existing lint, tests, and production build; add targeted regression tests for changed behavior rather than tests that merely repeat component markup.
- [ ] Exercise auth signup/verification/resend/login/logout/session restoration with appropriate test accounts.
- [ ] Exercise wizard creation, interrupted save/retry, explicit truth verification, new revision, and existing-business access.
- [ ] Exercise every prompt action, then run a controlled scan and verify exact questions, saved answers, summary, progress, and history.
- [ ] Exercise partial failures and analysis failures with controlled fixtures; do not deliberately exhaust live provider quota to test errors.
- [ ] Verify owner isolation for new data paths, unavailable worker behavior, expired sessions, and inaccessible route IDs.
- [ ] Review mobile/tablet/desktop in both themes; keyboard-only navigation, screen-reader labels, visible focus, contrast, reduced motion, and long content.
- [ ] Inspect browser errors and check video/dot-grid performance. Pause hidden animation; load heavier analysis views only when needed if bundle size warrants it.
- [ ] Remove old sample tabs from production navigation; retire their components only after references are checked. Preserve unrelated work.
- [ ] Update README and handoff with setup changes, implemented phases, validation evidence, and remaining limitations.

Completion requires working data-backed flows, not only visual similarity. The landing page is outside this specific phased brief except for shared-theme compatibility and working auth links; plan a separate marketing redesign if requested.

## 14. Delivery order and progress tracking

Recommended order: **1 → 2 → 3 → 4 → 5 → 6A → 7 → 6B → 8**. Run focused checks throughout; phase 8 is the integrated pass, not the first validation.

| Phase | Status | Completion evidence |
| --- | --- | --- |
| 1 Foundation and shell | Implemented | Lint/build pass; 10 tests pass; authenticated browser smoke checks at 390/768/1440px; see inventory |
| 2 Authentication | Implemented | Video playback/pause and failed-media fallback checked; isolated signup/login/OTP/error/resend checks; lint/build and 13 tests pass. Fresh live email confirmation not rerun |
| 3 Onboarding wizard | Implemented | 25 tests, lint/build pass; full fixture flow/review/reload/retries; live visual checks; Supabase UUID/policies verified read-only |
| 4 Business profile | Implemented | 31 tests, lint/build pass; isolated launch/revision/error/partial/running/switch tests; live read-only saved evidence, links/reload, themes and responsive checks |
| 5 Prompts and launch | Core implemented | Shared cross-section polling implemented; live active transition and hosted launch still need verification |
| 6A Existing-evidence analytics | Implemented | Live read-only legacy scans, fixture states, lint/build/tests |
| 7 History | Implemented; live >12 pagination pending | Paged metadata query, filters, exact historical boards, live four-scan check, 15-scan fixture |
| 6B Scores and competitors | Implemented; live scored scan pending | Additive migration applied; RLS checked; 46 tests, lint/build, fixture and legacy read-only checks |
| 8 Integrated verification | Not started | — |

At each checkpoint record: changed files, actual behavior, checks run/results, screenshots when relevant, data migrations if any, outstanding issues, and the next concrete task. Preserve this status table when context is handed to a new chat.

Phase 1 checkpoint (2026-10-12): new tokens/UI primitives, real-session dashboard guard, query navigation, shared owned-business loading, shell, themed existing screens, account dialog with explicitly local display preference, and archived-scan links implemented. Existing account role/timezone/company controls were local or inert and are no longer shown as persisted settings. No API contracts or schema changed. Full profile/prompts/analytics/history layouts remain their later phases. Reference images copied; login video located. No new live scan or database mutation during smoke checks. Build has a nonblocking chunk-size warning.

Phase 2 checkpoint (2026-10-12): glass auth panel in both themes, video/poster background, native dialog focus, theme and pause controls, URL-driven auth entry/tab navigation, and styled verification implemented. Signup with immediate session now proceeds directly; confirmation-required signup waits for verification. A returned user ID is required for completion. `tests/fixtures/auth.html` exercises the real form with an injected local client and never contacts Supabase. Browser checks covered required-field validation, password visibility, OTP distribution, invalid code, resend, successful OTP, immediate signup, rejected login, missing identity, and login after video failure. Live video playback and pause were verified; reduced-motion/hidden-tab behavior is implemented and inspected, but OS preference and autoplay rejection were not separately emulated. Existing signed-in session remained available. No real signup, email send, OTP verification, or account deletion was performed. No schema/config changes. Production build includes the 8.3 MB MP4 and retains its nonblocking JS chunk warning.

Phase 3 checkpoint (2026-10-12): `Onboarding` now hosts `BusinessWizard` over `DotGridBackground`, with the shared `GlassPanel` used by auth. Existing business/truth field contracts remain; create additionally accepts an optional validated `creationId` in Supabase and the SQLite fallback. No schema migration or new dependency. Business creation occurs only on final confirmed save; before then, answers are an account-scoped draft in this tab. Recovering an incomplete business loads the owner's saved basics and latest truth revision. Unit/local integration tests cover owner isolation, schema validation, immutable creation requests, duplicate-key recovery, lost create/truth responses, concurrent truth edits, and confirmed revisions. Browser fixtures covered all nineteen questions, optional skips, review editing, mouse/keyboard verification, reload, and failures followed by one business/one revision. Live UI checked glass/dots, light/dark themes, focus, and 390px layout without saving hosted business data. Supabase ID types and owner read/insert policies were checked read-only. A full hosted create/truth roundtrip and touch/OS reduced-motion behavior were not separately exercised. Temporary AuthRetryableFetchError/server/throttle failures deny API access without emitting session-expired, preserving drafts; true invalid-session failures still expire them. Preserve this distinction. Wizard requests carry the expected owner; Supabase and the local fallback reject a changed account before business access. Conflicting draft URLs do not replace an existing tab draft. Completed creation links reload the success state without another truth write.

Next implementation task when authorized: phase 4 business profile, carrying the translucent panel treatment into profile details and previous-scan summaries.

Phase 4 checkpoint (2026-10-12): `BusinessWorkspace` now delegates selected profile and fact editing to `BusinessProfile` / `TruthEditor`; business selection cards remain functional and use shared glass surfaces. `shared/businessProfile.js` handles independent reads, finished-scan selection and readiness; `shared/truthRevision.js` preserves versioned saves and matching lost-reply recovery. Dots reuse the event-driven canvas in a local ResizeObserver-backed variant, masked to the right of the profile header. The latest finished snapshot stays separate from active progress, uses saved evidence denominators, and links to exact history; three recent entries are shown. Current APIs return the latest twenty scans, so the snapshot searches that existing window. No metrics or competitor scores invented; basic identity remains read-only. 31 tests, lint/build pass; isolated browser fixture covered launch, revision editing/reconfirmation, partial/running/no-scan/error/incomplete states and delayed business switching. Live read-only checks used the existing Testname 20-answer run and Test no-scan profile, exact history/reload/Back, light/dark themes, editor cancellation, and responsive layout. No hosted mutation or new AI call. Deletion confirmation retained but not executed; coarse-pointer/OS motion preferences were not separately emulated. Next: Phase 5 prompts/launch; keep glass and localized dots.

Phase 6B checkpoint (2026-10-12): `shared/measurement.js` defines versioned, deterministic denominators and quote validation. The owner reviews target aliases and up to eight competitors on Analytics; Brand Truth free-text competitors only appear as suggestions. New scans snapshot identity, competitor set, truth data/version, prompt fingerprint, Gemini model and method versions in `scan_measurements`. The worker extracts batches of saved answers after scan completion, persists per-answer evidence and extraction payloads, reports coverage, and retries failed/partial extraction without customer-answer calls. Analytics shows translucent mention/recommendation/truth-agreement cards, common-unbranded-prompt competitor table, evidence links, and only compatible historical changes. Legacy scans are unscored. The additive migration was applied to the connected project and live RLS/grants inspected; the security advisor has only the pre-existing Auth leaked-password-protection warning. CLI `supabase` was not installed, so the migration SQL file was generated locally and applied with the Supabase migration tool. `node --test --test-isolation=none server/*.test.js` passed 46 tests, lint and build passed (nonblocking bundle-size warning). Isolated scored/legacy UI fixture and live read-only Testname/no-scan views rendered; `/scan-api/health` returned `ready:true` after restarting the worker. A live Gemini extraction on synthetic data returned the expected one item, two brands and one claim. No hosted scored scan or real-business tracking-name write was performed. Next: Phase 7 history, shared polling, then one owner-reviewed real-business end-to-end scan.

Phase 7 checkpoint (2026-10-13): `ScanHistory` replaces the old combined history workspace with a translucent table and mobile cards. A bounded, owner-scoped Supabase metadata query returns twelve scans per page with exact count, saved prompt-run statuses, summary status, and measurement status; raw answers load only after opening an exact scan in `AnalyticsBoard`. Status/date/chronological filters and page selection survive return navigation through query parameters; date ranges apply after both dates are entered. Historical boards show a label and Back to scan history; missing summaries and legacy scores remain explicit. `useScanActivity` now owns one dashboard-level status poll across section changes, including pending measurement extraction, and shows a compact saved/failed/pending strip with Open results. No schema change or new credentials. Live read-only checks opened two distinct Testname scans (20 and 1 answers), confirmed the older unscored state, sorting, status filtering, exact links, Back, and reload. A 15-scan isolated fixture exercised page two, date application, partial failure, and both themes at desktop/mobile widths. Lint, build and 49 Node tests pass. Live pagination beyond twelve records and a newly active scan transition were not run; Phase 8 integration remains next.

Auth refinement checkpoint (2026-10-13): The login/signup dialog is dark regardless of workspace theme and has no theme, pause, close, or Back to website controls. Muted video autoplays and loops while mounted, with a poster on failure. The URL mode switch keeps the form component mounted; the selected pill and changing content slide. Request versions invalidate a slow auth response after a mode change. Browser checks covered both modes, phone/desktop widths, continuous playback across switching, no Escape dismissal, a light-theme fixture, failed-video signup, and abandoned delayed login. Lint, 49 Node tests and the production build pass; no live auth submission was made. Phase 8 remains next.

Auth motion correction (2026-10-13): Both form panes now coexist during a mode transition. The outgoing pane slides and fades out as the incoming pane slides and fades in; the selected pill uses the same duration, and the container height animates between their measured sizes. The outgoing pane is inert and `aria-hidden`, so it cannot create a second active form for keyboard or assistive technology. A localhost browser sampled the two panes with opposing transforms and complementary opacity at the same timestamps in both directions. Reduced-motion preference removes the animation and hides the outgoing pane immediately. No auth API, credential, or schema change.
