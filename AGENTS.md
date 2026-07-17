# Agent Workflow

This file defines the default behavior for agents working in this repository and
for templates generated from it.

## Core Rules

- Work in small, traceable blocks.
- Read the repository documentation before proposing or changing structure.
- Do not modify code or documentation before understanding the current project
  state.
- Do not revert user changes unless explicitly requested.
- Keep public metadata neutral: do not use agent names, AI tool names, provider
  names, or generated-by signatures in branches, commits, pull requests, tags,
  changelogs, templates, or public documentation.
- Keep documentation updated whenever decisions affect architecture, workflow,
  versioning, snapshots, roadmap, technical debt, security, or product scope.
- Prefer reusable structure over one-off project-specific rules.

## Initial Project Behavior

When a user starts a new project from a template and asks the agent to analyze
the repository, the agent must treat these prompts as equivalent:

```text
Analiza el repo.
Analyze this repository.
Review the project structure.
Inspect the repo and tell me where we are.
What is the current state of this project?
Audit the repository setup.
Read the docs and summarize the current state.
```

The agent must:

1. Read `README.md`, `AGENTS.md`, and the files under `docs/`.
2. Inspect the project structure and current git state.
3. Identify whether this is a new project or an existing project adopting the
   template.
4. Check `.agents.env` when present. This file is reserved for non-secret local
   experiment flags.
5. If `AGENTS_CONTEXT_MODE=baseline`, run the baseline analysis path and skip
   optional `lean-context` accelerators unless the user explicitly asks.
6. If `AGENTS_CONTEXT_MODE=lean-context` or the file is missing, use the normal
   template workflow.
7. Check optional AI tooling guidance in `docs/AI_CLIENTS.md`,
   `docs/AI_TOOL_SETUP.md`, and related AI docs when present.
8. Run `pragmatik doctor` when the Pragmatik CLI is installed; otherwise run
   `bash scripts/ai-tools.sh check` when present.
9. Detect the active AI client when possible and report whether Context7,
   Tokscale, Repomix CLI, MCP configuration, Tokscale login, global Tokscale
   command access, and selected client syncs appear available.
10. Offer `pragmatik setup` when tooling, dashboard, or client setup is missing.
   Fall back to `bash scripts/ai-tools.sh setup-machine` when the CLI is not
   available.
11. Ask before writing secrets, creating local config, enabling MCP servers, or
   changing machine-wide integrations.
12. Summarize the current state.
13. Ask a project-start question such as:

```text
¿Que vamos a construir hoy?
What are we building today?
What should we work on next?
```

If the repository already contains an application, the agent should also propose
how to adopt the template rules without disrupting existing conventions.

## AI Tool Bootstrap

When optional AI tool files exist, the agent should offer a minimal setup path
for the user's current client.

Skip this bootstrap when `.agents.env` sets:

```text
AGENTS_CONTEXT_MODE=baseline
```

In baseline mode, only report that optional tooling is available but disabled
for measurement.

Default checks:

1. Confirm whether `.env.example`, `repomix.config.json`, and MCP config
   examples exist.
2. Detect likely client files such as `.codex/`, `.cursor/`, `.mcp.json`,
   `.gemini/`, `.agent/`, or client-specific global config when visible.
3. Prefer Context7 for current library documentation.
4. Prefer Repomix CLI for immediate context reduction.
5. Use Tokscale for measurement and dashboard submission according to
   `AGENTS_TOKSCALE_SUBMIT=on|dry-run|off`.
6. Check Cursor, Antigravity, and Warp sync state when those clients are
   selected.
7. Keep MCP setup opt-in and read-only by default.

If tools are not configured, continue the repository analysis and ask whether
the user wants the recommended setup applied.

## AI Tool Automation

When `scripts/ai-tools.sh` exists:

- Prefer `pragmatik doctor`, `pragmatik setup`, `pragmatik run`, and
  `pragmatik dashboard` when the Pragmatik CLI is installed.
- Run `bash scripts/ai-tools.sh check` during repository analysis when AI tooling is
  relevant.
- Run `bash scripts/ai-tools.sh setup-machine` when the user wants guided global
  Tokscale and client setup.
- Run `bash scripts/ai-tools.sh dashboard` when the user wants local dashboard
  commands or report locations.
- Run `bash scripts/ai-tools.sh run` at the end of an iteration when `.agents.env`
  marks one or more tools as `on`.
- Run `bash scripts/ai-tools.sh measure-pair` when a matched baseline and
  `lean-context` comparison should be appended to `docs/AI_USAGE_REPORT.md`
  without hand-editing.
- When `.githooks/pre-commit` exists and the user wants automatic iteration
  closure, run `bash scripts/ai-tools.sh install-hooks` once and set
  `AGENTS_AUTO_RUN_ON_COMMIT=on` in `.agents.env`.
- With commit automation enabled, the pre-commit hook must run
  `bash scripts/ai-tools.sh run-and-stage` so active tools execute before the
  iteration commit and the aggregate usage report is staged automatically.
- Keep raw outputs under `.ai-runs/`; they are local and ignored.
- Commit only aggregate, non-sensitive summaries such as
  `docs/AI_USAGE_REPORT.md` and `docs/AI_OPTIMIZATION_REPORT.md`.
- Tokscale submission must be controlled by
  `AGENTS_TOKSCALE_SUBMIT=on|dry-run|off`. Templates default to `dry-run`; use `on` only after user confirmation or `off` for local-only runs.
- Do not run remote sharing commands outside Tokscale submit, write secrets, or
  run MCP mutation commands unless the user explicitly approves them.

## Lean Context Loading

This repository uses the `lean-context` preset as an active workflow layer.

- Retrieve context before reading context.
- Do not read the whole repository unless the user explicitly asks for a full
  audit.
- Start with `README.md`, `AGENTS.md`, `docs/AI_CONTEXT.md`, and recent entries
  in `docs/SNAPSHOTS.md`.
- Use `docs/AI_SEARCH.md` to locate the relevant files before opening them.
- Use `rg` before opening files.
- Prefer small file slices over complete files.
- Respect `.aiignore` and `.rgignore` unless the user explicitly asks to
  inspect ignored material.
- Avoid generated output, dependency folders, build artifacts, caches, secrets,
  and lockfiles unless they are directly relevant.
- Update `docs/AI_CONTEXT.md` when architecture, commands, stack, or important
  project boundaries change.

## Optional MCPs

- Treat MCP servers as optional accelerators, not required dependencies.
- Prefer read-only MCP resources before invoking tools.
- Use MCP Roots or equivalent filesystem restrictions when available.
- Do not expose secrets, `.env` files, dependency folders, build output, or
  private credentials through MCP resources.
- Keep MCP outputs bounded and summarize large results.

## Block Workflow

Each work block should include:

1. Scope confirmation or a clear assumption.
2. Focused implementation or documentation changes.
3. Local verification when applicable.
4. Snapshot update when the project state changes.
5. Roadmap update when product direction changes.
6. Technical debt update when debt is created, changed, accepted, or resolved.
7. README update when setup, usage, commands, or project scope changes.
8. Version-file update when the iteration changes the project state.
9. AI tool automation run when configured.
10. Matching git tag creation for the new version when the iteration is closed.
11. Suggested next logical step.

## Next-Step Fallback

At the end of every iteration, the agent must suggest the next logical step.

Use this priority order:

1. Use `docs/ROADMAP.md` when it exists and contains an applicable next
   milestone.
2. If no roadmap exists or it has no applicable next milestone, use
   `docs/TECHDEBT.md` when it exists and contains actionable open debt.
3. If neither source exists or neither contains an actionable next step, ask the
   user how they would like to proceed.

Do not invent roadmap items when neither roadmap nor technical debt provides a
clear next action.

## Versioning

Projects based on these templates use Semantic Versioning for every meaningful
iteration:

```text
MAJOR.MINOR.PATCH
```

- `MAJOR`: incompatible workflow, template, API, or project behavior changes.
- `MINOR`: backward-compatible new templates, workflows, or features.
- `PATCH`: backward-compatible fixes, clarifications, or documentation updates.

The project version and git tag must stay synchronized.

Project version format:

```text
X.Y.Z
```

Git tag format:

```text
vX.Y.Z
```

Examples:

- `v0.1.0`
- `v1.0.0`
- `v1.2.3`

The agent should update the correct version source for the stack whenever a
versioned iteration is completed.

Examples:

- React, Vite, SPA, PWA, or Node projects: update `package.json`.
- npm projects with a lockfile: keep the lockfile version in sync when the
  package manager updates it.
- Chrome extension projects: update `manifest.json`; if `package.json` also has
  a `version` field, keep both versions synchronized.
- PHP or Laravel projects: use the project's declared version file or config
  when one exists; otherwise create or update the template-defined version file.
- Documentation-only projects: use the template-defined version file or
  changelog when present.
- Template-library repositories: use `VERSION` unless a stack-specific template
  defines another authoritative source.

The version in the project file must match the git tag without the `v` prefix.
For example, `package.json` version `0.2.0` must match git tag `v0.2.0`.

Do not push tags unless the user explicitly approves pushing.

## Snapshot Rules

Snapshots preserve project memory between sessions, context compaction, handoff,
and branch transitions.

Update snapshots after:

- New project foundation.
- Architecture decisions.
- Workflow decisions.
- Template structure changes.
- Version or release changes.
- Security or privacy decisions.
- Major documentation changes.
- Accepted or resolved technical debt.

Default snapshot location:

```text
docs/SNAPSHOTS.md
```

## Git Rules

- Use descriptive, neutral branch names.
- Keep branches focused by feature, documentation block, or template block.
- Do not push without explicit user approval.
- Create local version tags when a versioned iteration is closed.
- Do not push tags without explicit user approval.
- Commit messages should describe the product or documentation result.

Recommended branch examples:

- `docs/base-workflow`
- `docs/laravel-template`
- `docs/laravel-react-template`
- `feature/react-vite-template`
- `fix/snapshot-format`

## Quality Rules

- Validate documentation links after structural changes.
- Keep Markdown headings consistent and readable.
- Prefer English for repository documentation and template rules.
- Keep Spanish phrases only when documenting prompts or user-facing examples the
  agent should recognize.
- Prefer concrete rules over vague guidance.
- Avoid duplicating shared rules across templates unless the template needs a
  self-contained copy.

## Current Documentation Lookup

- Use Context7 when a task depends on current library, framework, SDK, API, CLI,
  or cloud-service documentation.
- Resolve the library first, then query the documentation with the user's
  specific question.
- Prefer official or high-reputation library matches.
- Do not use documentation lookup as a substitute for reading local project
  rules, implementation files, tests, snapshots, roadmap, or technical debt.
- Do not expose API keys, `.env` files, or local tool configuration while using
  MCPs or CLIs.
