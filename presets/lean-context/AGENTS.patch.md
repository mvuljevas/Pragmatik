# lean-context Agent Rules

Add this section to a project `AGENTS.md` when the project uses the
`lean-context` preset.

## Lean Context Loading

- Retrieve context before reading context.
- Do not read the whole repository unless the user explicitly asks for a full
  audit.
- Start with `README.md`, `AGENTS.md`, `docs/AI_CONTEXT.md`, and recent entries
  in `docs/SNAPSHOTS.md`.
- Use `docs/AI_SEARCH.md` to locate the relevant files before opening them.
- Use `rg` before opening files.
- Prefer small file slices over complete files.
- Respect `.aiignore` and `.rgignore` unless the user explicitly asks to inspect
  ignored material.
- Avoid generated output, dependency folders, build artifacts, caches, secrets,
  and lockfiles unless they are directly relevant.
- Update `docs/AI_CONTEXT.md` when architecture, commands, stack, or important
  project boundaries change.

## Interactive Start

When the user asks for repository analysis using prompts such as:

```text
Analiza el repo.
Analyze this repository.
Review the project structure.
Inspect the repo and tell me where we are.
What is the current state of this project?
```

The agent should inspect the minimum useful context, summarize the current
state, then ask a project-start question such as:

```text
¿Que vamos a construir hoy?
What are we building today?
What should we work on next?
```

If the repository is already in progress, the agent should propose how to adopt
or align the workflow without overwriting existing conventions.

## Template and Preset Recommendation

Before downloading, copying, or applying a template, recommend the smallest
useful template and preset combination from the user's project description.

- Use `docs/RECOMMENDATION_FLOW.md` when available.
- Recommend one primary template.
- Recommend `lean-context` by default when the user wants AI quota efficiency,
  MCP guidance, GitHub workflow help, or search-first agent behavior.
- Treat MCPs, compression, and tracking tools as optional capabilities.
- For existing projects, propose an adoption path instead of overwriting files.

## Next-Step Fallback

At the end of every iteration, suggest the next logical step using this order:

1. `docs/ROADMAP.md`.
2. `docs/TECHDEBT.md`.
3. Ask the user how they would like to proceed.

Do not invent a next step when neither roadmap nor technical debt provides one.

## Optional MCPs

- Treat MCP servers as optional accelerators, not required dependencies.
- Prefer read-only MCP resources before invoking tools.
- Use MCP Roots or equivalent filesystem restrictions when available.
- Do not expose secrets, `.env` files, dependency folders, build output, or
  private credentials through MCP resources.
- Keep MCP outputs bounded and summarize large results.
- During repository analysis, check `docs/AI_TOOLS.md`,
  `docs/AI_CLIENTS.md`, and `docs/AI_TOOL_SETUP.md` when present.
- During repository analysis, run `pragmatik doctor` when available; otherwise
  run `bash scripts/ai-tools.sh check` when present.
- Report whether Context7, Tokscale, Repomix CLI, MCP config examples, global
  Tokscale access, Tokscale login, and selected client syncs are available.
- Offer `pragmatik setup` when Pragmatik CLI setup is available and tooling,
  dashboard, or client setup is missing. Fall back to
  `bash scripts/ai-tools.sh setup-machine` when the CLI is not available.
- Ask before writing secrets, changing machine-wide integrations, or enabling
  MCP servers.
- During repository analysis, check `.agents.env` when present. If
  `AGENTS_CONTEXT_MODE=baseline`, skip optional `lean-context` accelerators for
  measurement unless the user explicitly asks.
- When Pragmatik CLI is available, run `pragmatik run` at the end of an iteration
  when `.agents.env` marks one or more tools as `on`.
- Use `pragmatik dashboard` when the user wants local dashboard commands,
  Tokscale TUI guidance, local graph export guidance, or report locations.
- Fall back to `bash scripts/ai-tools.sh run` and
  `bash scripts/ai-tools.sh dashboard` when the CLI is not available.
- When `.githooks/pre-commit` exists and the user wants automatic iteration
  closure, run `bash scripts/ai-tools.sh install-hooks` once and set
  `AGENTS_AUTO_RUN_ON_COMMIT=on` in `.agents.env`.
- With commit automation enabled, the pre-commit hook runs
  `bash scripts/ai-tools.sh run-and-stage` before the iteration commit.
- Tokscale submit is controlled by `AGENTS_TOKSCALE_SUBMIT=on|dry-run|off`.
  Templates default to `dry-run`; use `on` only after user confirmation or `off` for local-only runs.
