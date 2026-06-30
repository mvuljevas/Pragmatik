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

## Interactive Start

When the user asks to analyze the repository, read `docs/AI_TOOLS.md`,
`docs/AI_CLIENTS.md`, and `docs/AI_TOOL_SETUP.md` when present. Run
`agents --doctor` when available; otherwise run `bash scripts/ai-tools.sh check` when the script exists. Report whether Context7,
Tokscale, Repomix CLI, MCP config examples, global Tokscale access, Tokscale
login, and selected client syncs are available. Offer
`bash scripts/ai-tools.sh setup-machine` when machine-wide Tokscale or client setup
is missing. Ask before writing secrets, changing machine-wide integrations, or
enabling MCP servers.

## Lean Context Loading

- Search before opening files.
- Prefer slices over complete files.
- Avoid `vendor`, `node_modules`, build output, caches, secrets, and lockfiles
  unless directly relevant.
- Treat `docs/AI_TOOLS.md` as optional setup guidance for MCPs, tracking, and
  compression. Ask the user before enabling any external tool.

## AI Tool Automation

- Run `agents --doctor` when available; otherwise run `bash scripts/ai-tools.sh check` during repository analysis when AI tooling is
  relevant.
- Run `agents --setup` when available; otherwise run `bash scripts/ai-tools.sh setup-machine` when the user wants guided global
  Tokscale and client setup.
- Run `agents --dashboard` when available; otherwise run `bash scripts/ai-tools.sh dashboard` when the user wants local dashboard
  commands or report locations.
- Run `agents --run` when available; otherwise run `bash scripts/ai-tools.sh run` at the end of an iteration when `.agents.env`
  marks one or more tools as `on`.
- When `.githooks/pre-commit` exists and the user wants automatic iteration
  closure, run `bash scripts/ai-tools.sh install-hooks` once and set
  `AGENTS_AUTO_RUN_ON_COMMIT=on` in `.agents.env`.
- With commit automation enabled, the pre-commit hook runs
  `bash scripts/ai-tools.sh run-and-stage` before the iteration commit.
- Keep raw outputs under `.ai-runs/`; commit only aggregate, non-sensitive
  summaries such as `docs/AI_USAGE_REPORT.md` and
  `docs/AI_OPTIMIZATION_REPORT.md`.
- Tokscale submit is controlled by `AGENTS_TOKSCALE_SUBMIT=on|dry-run|off`.
  Templates default to `dry-run`; use `on` only after user confirmation or `off` for local-only runs.

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
