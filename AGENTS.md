# PresenceAI coding-agent instructions

At the start of a new chat or work session in this repository, read [handoff.md](handoff.md) and [README.md](README.md) before changing code. Read [docs/AUDIT.md](docs/AUDIT.md) when you need the original repository audit or roadmap details. Check Git status and the current implementation; the handoff is context, not a substitute for inspecting code.

After any change to behavior, architecture, database schema, setup, deployment, milestone status, or known limitations, update **both** `handoff.md` and `README.md` in the same change. Keep the handoff concise and current; distinguish implemented and verified behavior from planned or untested work. If a change does not affect user-facing setup, add a short relevant note to the README rather than leaving it stale.

Preserve the existing frontend design. Keep provider credentials and Supabase server secrets out of the browser, Git, logs, and documentation. Treat owner-verified Brand Truth as separate from model output; never promote AI claims into it automatically. Use one AI provider for the MVP and keep raw scan responses before analysis.
