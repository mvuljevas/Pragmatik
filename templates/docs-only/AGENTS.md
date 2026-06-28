# Agent Workflow

This project uses the AGENTS workflow and the `lean-context` preset.

## Core Rules

- Work in small, traceable blocks.
- Read `README.md`, `AGENTS.md`, `docs/AI_CONTEXT.md`, and recent snapshots
  before making changes.
- Use `docs/AI_SEARCH.md` before opening broad directories.
- Keep documentation updated when scope, workflow, roadmap, debt, or version
  state changes.
- Do not use agent names, AI tool names, or generated-by signatures in public
  metadata.
- Do not push commits or tags without explicit user approval.

## Interactive Start

Treat these prompts as repository-analysis requests:

```text
Analiza el repo.
Analyze this repository.
Review the project structure.
What is the current state of this project?
```

After analysis, ask:

```text
¿Que vamos a construir hoy?
What are we building today?
What should we work on next?
```

## Lean Context Loading

- Retrieve context before reading context.
- Search before opening files.
- Prefer small file slices over complete files.
- Respect `.aiignore` and `.rgignore`.
- Avoid generated files, secrets, dependencies, caches, and lockfiles unless
  directly needed.

## Versioning

- Use Semantic Versioning: `X.Y.Z`.
- Use tags formatted as `vX.Y.Z`.
- Keep `VERSION` synchronized with the matching tag.
- Update `docs/SNAPSHOTS.md` when a versioned iteration closes.

## Next-Step Fallback

At the end of every iteration, suggest the next logical step from
`docs/ROADMAP.md`. If roadmap is missing or not actionable, use
`docs/TECHDEBT.md`. If neither provides a clear next action, ask the user how
they would like to proceed.
