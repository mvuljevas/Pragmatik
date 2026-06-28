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

## Optional MCPs

- Treat MCP servers as optional accelerators, not required dependencies.
- Prefer read-only MCP resources before invoking tools.
- Use MCP Roots or equivalent filesystem restrictions when available.
- Do not expose secrets, `.env` files, dependency folders, build output, or
  private credentials through MCP resources.
- Keep MCP outputs bounded and summarize large results.
