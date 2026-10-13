# UI migration action inventory

Inspected and updated 2026-10-12 through Analytics Phase 6B. The Phase 6B additive migration is applied; no new live scored scan was launched during its implementation.

| Action | Contract / storage | Current behavior |
| --- | --- | --- |
| Sign up | POST `/auth/signup` | New glass form; honors confirmation-required versus immediate-session response |
| Sign in | POST `/auth/login` | New form; returned user ID required; dashboard/onboarding require real session |
| Restore session | GET `/auth/me` | Real account only; fabricated demo identity removed |
| Verify / resend email code | POST `/auth/verify-otp`, `/auth/resend-otp` | Styled six-digit code screen, autofill/paste, cooldown, and failure/retry states |
| Sign out | POST `/auth/logout` | Sidebar and account dialog use existing handler; failed logout remains visible |
| List / switch business | GET `/businesses` | Shared owner-scoped list; selected ID stored in URL; no synthetic records |
| Create business | POST `/businesses`, optional UUID `creationId` | Wizard saves only after final verification; matching owned request recovers its record; mismatched/other-owner requests fail |
| Load / verify truth | GET / POST `/businesses/:id/truth` | Wizard resumes incomplete setup; glass grouped editor uses explicit owner confirmation, optimistic revisions and matching lost-reply recovery |
| Remove business | DELETE `/businesses/:id` | Explicit confirmation; selection cleared after removal |
| List questions | GET `/businesses/:id/prompts` | Saved list, counts, search/category/active/result filters; new businesses preview 20 starter questions without saving |
| Generate / fill / replace | POST `/businesses/:id/prompts/generate` | Add 20/fill to 20 or replace with confirmation; historical scans remain snapshots |
| Add question | POST `/businesses/:id/prompts` | Custom question or an individually selected generic suggestion |
| Edit / include question | PATCH `/businesses/:id/prompts/:id` | Inline edit/cancel and active toggle; unsaved draft blocks scan launch |
| Delete question | DELETE `/businesses/:id/prompts/:id` | Existing behavior retained |
| Run scan | POST `/businesses/:id/scans` | Profile, prompt workspace, and Analytics use the existing worker contract; Analytics checks verified facts, known prompts/scans, 1–40 active saved prompts, and a launch lock |
| Review tracking names | GET / PUT `/businesses/:id/measurement-config` | Owner-scoped target aliases and competitor names; Brand Truth competitors are suggestions requiring review; edits apply to future snapshots only |
| Retry failed extraction | POST `/scans/:id/measurement/retry` | Server checks ownership and queues only failed/partial scoring; saved customer answers are reused |
| Read history | GET `/businesses/:id/scans` | Existing history shown under Scan history |
| Read exact evidence | GET `/scans/:id` | Analytics validates business scope, loads raw answers, combined report, and versioned measurement when present; evidence links open the matching saved run; legacy scans remain unscored |
| Poll running scan | Existing GET scan/list calls | Mounted profile polls active scan status every five seconds after each completed fetch; cleanup prevents late loads/timers after navigation; legacy views keep existing polling |
| Analytics latest / historical board | Existing GET scan/list calls | One board for current or `scan=<id>`; derives transparent legacy counts and reads new persisted scores, quote evidence and comparable changes; retains raw answers on summary failure |
| Theme preference | `localStorage.presence-theme` | Light/dark preference, system fallback, pre-paint bootstrap |
| Preferred display name | `localStorage` scoped to account ID/email | Explicit browser-only preference; does not change auth identity |
| Account email / identity editing | Old modal changed local state only | Identity now read-only; no simulated server save or fabricated defaults |
| Account role / timezone / company | Old modal incomplete/local-only controls | Removed from account dialog pending real product/storage support |
| Marketing / dashboard navigation | Query parameters and browser history | Central parser/update module; pushState plus popstate support |
| Fix queue | None | Disabled Coming soon item, no API or queue |
| Legacy analytical tabs | Static sample components | Removed from production navigation; source retained |
| Report export | Not implemented | Removed disabled shell action; remains future scope |

## Navigation contract

`view=dashboard`, `business=<id>`, `section=profile|prompts|analytics|history`, optional `scan=<id>`, and optional `mode=create|truth`. An analytics URL with a scan ID shows that exact archived response set. Unknown sections default to profile; invalid IDs or inaccessible businesses/scans produce safe states. Switching business clears scan and edit mode. Existing authentication query parameters are preserved; legacy `tab` and `demo` are cleared on new navigation.

## Verification record

- Lint and production build pass; build retains a nonblocking large-chunk warning.
- Ten Node tests pass, including two new routing regressions.
- Authenticated browser smoke checks: owner business list/switching, current 20-prompt list, saved 20-answer overview, a separate one-answer historical report, historical reload, browser Back to history, light/dark palette, mobile drawer/account Escape focus restoration.
- Checked 390px, 768px, and 1440px viewports without page-level horizontal overflow on the exercised screens.
- No new live scan, prompt mutation, business creation/deletion, or truth revision was performed in these smoke checks. Those operations reuse existing contracts; full redesigned-flow integration remains phase 8.

## Migration notes

`BusinessWorkspace` is controlled by route and shared business-list props. History links carry selected scan IDs. The wizard and versioned scoring/competitor comparison are implemented; final history layout and shared polling remain planned.

Phase 3: `?view=onboarding` with optional owned `business` ID resumes or creates setup. An optional UUID `draft` query parameter identifies the creation request, not an access credential. Legacy `?view=dashboard&mode=create` also opens the wizard. Session drafts store basic/truth answers, step, creation/submission identity, and revision under an account/business key. The verification checkbox is never persisted. Creation retries use a SELECT constrained by both ID and owner, then INSERT with that ID; duplicate-key recovery never uses upsert. Both Supabase and the local fallback validate IDs and original field matches. Saving truth requires the expected next revision; recovery compares all truth fields and never overwrites a concurrent update.

Phase 3 verification: 25 Node tests plus lint/build pass. Browser fixture covered all nineteen questions, optional skips, Back/edit review, reload/resume, unchecked verification, truth-write failure, lost creation reply, and lost truth reply. Each retry case ended with one mock business and one revision. Hosted Supabase ID schema and RLS policies were queried read-only; no hosted business/truth record was created by testing. Live UI checked dark/light glass/dots, focus, and mobile overflow. Coarse-pointer/reduced-motion/hidden-page handling is implemented but was not separately emulated on a physical touch device or OS preference. The single canvas has no per-dot React updates or continuous idle animation. Drafts clear after success/logout or confirmed expiry; transient auth/network errors preserve them. Stale callbacks respect a session epoch. Changed-account requests are denied before business data access in both adapters; completed setup reloads retain the saved success state. Conflicting draft URLs do not replace the existing tab draft.

Phase 2: `LoginModal` hosts `AuthForm` and `AuthBackground` in a native dialog. Video auth and the phase 3 wizard are implemented; deeper analytics remain planned. `?view=login|signup|create-account` and `?modal=login|signup` open auth. Switching mode resets the form without rebuilding the video background, and browser Back uses the URL mode. `/auth/me` is also used by the I've confirmed my email action; an unverified form record is never promoted into a session. Completion callbacks are ignored after leaving a form so slow responses cannot redirect an abandoned screen.

Phase 2 verification originally covered the supplied 10-second MP4, the original playback/theme controls, and mobile/desktop form layout. The isolated `tests/fixtures/auth.html` fixture covered validation, password visibility, confirmation-required signup, immediate signup, invalid OTP, resend, successful OTP, rejected login, missing returned identity, and login with a failed video source. It is not included in the production Vite entry and performs no Supabase calls. Fresh live signup/email delivery/verification were not rerun. Supabase's [signup](https://supabase.com/docs/reference/javascript/auth-signup) and [password auth](https://supabase.com/docs/guides/auth/passwords) documentation informed the response handling; no provider settings or credentials changed.

Auth refinement (2026-10-13): the production auth dialog now stays dark under either workspace preference. Video autoplays and loops without a pause control or hidden-tab pause handler. Theme, cross, and Back to website controls are removed; Escape is blocked while browser Back remains available. The segmented pill and changing form content animate on mode change. Request versions invalidate a slow auth response after changing modes. Live browser checks covered phone/desktop layouts, both mode URLs, video continuity, and blocked Escape; a light-theme fixture showed a dark auth surface, completed a mock signup after video failure, and rejected an abandoned delayed login. Lint, 49 Node tests, and build pass. No live account action or email was sent in this check.

Phase 4: selected profiles now use `BusinessProfile`, with `TruthEditor` for grouped append-only facts. Glass widgets and header-only dots use shared components. Truth/prompts/scans are independently loaded; partial API failure shows an error without suppressing verified facts. Summary detail must match both scan ID and business ID; latest finished selection excludes PENDING/RUNNING/FAILED. Active progress is separate, with nonoverlapping polling and cleanup. Scan launch requires a confirmed truth version, known prompt/scan data, 1–40 active prompts and no current scan; a ref prevents double submission. All new data/mutation calls carry expected owner. Truth saves require fresh explicit verification and recover only an identical next revision after a lost reply. The success screen prevents duplicate resubmission and returns to profile on an explicit action. Existing delete confirmation remains; no inline basic editing added.

Phase 4 verification: 31 Node tests, lint/build pass. Browser fixture covered running/finished separation, partial counts, launch guards and one mock launch, incomplete/no-scan/error states, edit clearing verification, one truth revision, and delayed switching to another business. Live checks read existing saved data (20/20 answers, 0/12 unprompted mentions, 0/20 citations on the placeholder scan), followed its exact analytics URL, refreshed/used Back, checked editor cancellation, both themes and responsive layout. No live AI call, hosted truth write, or deletion. The profile snapshot uses the current list API's twenty-scan window. Non-identifying design references are under `docs/design-references/`; the authenticated profile screenshot stays local because it includes an account email address.

Phase 6A verification: 40 Node tests, lint and production build pass. The shared Analytics board displayed the existing Testname 20/20 scan and a distinct historical 1/1 scan; a numbered finding link opened the matching raw answer. History navigation opens the same exact-scan board. Isolated fixture covered partial answer collection, failed combined analysis, no scans, unavailable prompt list, inaccessible scan, safe citation links, and answer filters. Checked 390px and 1440px without document-width overflow. No hosted scan or prompt write was performed.

Phase 6B verification: new measurement tables applied to Supabase; RLS and grants verified. The new owner config was read live for a no-scan business; the existing 20-answer Testname scan still rendered as unscored legacy evidence. The isolated scored fixture rendered three score cards, competitor table and evidence links, and reviewed-name suggestions/save. Forty-six Node tests passed with child-process isolation disabled in this Windows sandbox; lint and production build passed. The scan server was restarted and health returned ready. One live Gemini extraction on synthetic data returned the expected structure; no full hosted scored scan or real-business tracking-name write occurred. Source truth comparisons are model-assisted and labeled accordingly.
