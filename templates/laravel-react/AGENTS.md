# Agent Workflow

This Laravel React project uses the AGENTS workflow and `lean-context`.

## Core Rules

- Follow existing Laravel, Blade, React, Vite, Eloquent, and test conventions.
- Read `README.md`, `AGENTS.md`, `docs/AI_CONTEXT.md`, and recent snapshots
  before changing files.
- Use `docs/AI_SEARCH.md` before opening broad directories.
- Keep domain logic out of views when it affects pricing, permissions, security,
  or persistence.
- Add or update tests for business behavior, auth, permissions, PDFs, emails,
  migrations, and important frontend workflows.
- Do not push commits or tags without explicit user approval.

## Lean Context Loading

- Search before opening files.
- Prefer slices over complete files.
- Avoid `vendor`, `node_modules`, build output, caches, secrets, and lockfiles
  unless directly relevant.

## Versioning

- Use Semantic Versioning.
- Use tags formatted as `vX.Y.Z`.
- Use the existing project version source when one exists; otherwise use
  `VERSION`.

## Next-Step Fallback

At the end of every iteration, suggest the next logical step from
`docs/ROADMAP.md`. If roadmap is missing or not actionable, use
`docs/TECHDEBT.md`. If neither provides a clear next action, ask the user how
they would like to proceed.
