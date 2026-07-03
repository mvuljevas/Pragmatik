# AGENTS

AGENTS is a reusable documentation and workflow template library for AI-assisted
software projects.

The goal is to standardize how projects define agent behavior, documentation
rules, snapshots, versioning, naming, and repeatable delivery workflows.

AGENTS also ships a project CLI:

```bash
npx @mvuljevas/agents help
npx @mvuljevas/agents setup
npx @mvuljevas/agents dashboard
```

When installed as a project dependency, use the `agents` command directly.

## Purpose

This repository provides reusable templates for projects such as:

- Laravel + React applications, aligned with the Prisma project workflow.
- React, Vite, SPA, or PWA applications.
- Chrome extensions built with vanilla HTML, CSS, and JavaScript.
- Documentation-only repositories.
- Future project types with their own stack-specific rules.

Every template should help a user clone or copy a project foundation, then start
with an analysis request such as:

```text
Analiza el repo.
Analyze this repository.
Review the project structure.
Inspect the repo and tell me where we are.
What is the current state of this project?
```

The agent should interpret these as equivalent requests to inspect the
repository, read its governance files, understand the current state, and then
ask a project-start question such as:

```text
¿Que vamos a construir hoy?
What are we building today?
What should we work on next?
```

If the repository is already in development, the agent should explain how to
adopt the rules without overwriting existing project decisions.

## Base Structure

```text
README.md
AGENTS.md
LICENSE
VERSION

docs/
  AI_CONTEXT.md
  AI_SEARCH.md
  AI_TOKEN_BUDGET.md
  CATALOG.md
  CONVENTIONS.md
  NAMING.md
  ROADMAP.md
  WORKFLOWS.md
  SNAPSHOTS.md
  TECHDEBT.md
```

Reusable project templates live under `templates/`, grouped by project type.
Templates are AGENTS shells, not complete generated applications. They provide
governance, minimal project docs, ignores, and setup context; real application
files are created after the user describes what should be built.

Reusable workflow modules should live under `presets/`. Presets are not full
projects; they are reusable layers that templates can adopt.

## Shared Standards

All templates in this repository should share:

- Agent workflow rules.
- Snapshot rules.
- Documentation update rules.
- Git workflow and branch naming.
- Semantic Versioning for releases.
- Coherent `X.Y.Z` project versions.
- Matching `vX.Y.Z` git tags for versioned iterations.
- Version-file updates that match the project stack, such as `package.json` for
  React projects.
- Neutral public metadata without AI tool, agent, or provider names.

## Presets

- [lean-context](presets/lean-context/README.md): context-loading, MCP,
  compression, usage tracking, template/preset recommendation, and GitHub
  workflow rules for maximizing useful AI quota.

## Templates

- [docs-only](templates/docs-only/README.md)
- [react-vite-spa](templates/react-vite-spa/README.md)
- [laravel-react](templates/laravel-react/README.md)
- [chrome-extension-vanilla](templates/chrome-extension-vanilla/README.md)

## Documentation Map

- [Agent rules](AGENTS.md)
- [AGENTS CLI](docs/AGENTS_CLI.md)
- [Installation](docs/INSTALLATION.md)
- [AI Context](docs/AI_CONTEXT.md)
- [AI Clients](docs/AI_CLIENTS.md)
- [AI Search](docs/AI_SEARCH.md)
- [AI Measurement](docs/AI_MEASUREMENT.md)
- [AI Token Budget](docs/AI_TOKEN_BUDGET.md)
- [AI Tool Setup](docs/AI_TOOL_SETUP.md)
- [AI Tool Registry](docs/AI_TOOL_REGISTRY.md)
- [AI Usage Report](docs/AI_USAGE_REPORT.md)
- [AI Optimization Report](docs/AI_OPTIMIZATION_REPORT.md)
- [Catalog](docs/CATALOG.md)
- [Conventions](docs/CONVENTIONS.md)
- [Naming](docs/NAMING.md)
- [Roadmap](docs/ROADMAP.md)
- [Workflows](docs/WORKFLOWS.md)
- [Snapshots](docs/SNAPSHOTS.md)
- [Technical Debt](docs/TECHDEBT.md)

Use `agents doctor` during repository analysis, then `agents setup` when
tooling or dashboard setup is missing. Use `agents run` to execute configured
AI tools, append aggregate usage summaries, and append optimization observations
when enabled. Use `agents dashboard` for the local AGENTS dashboard.

`scripts/ai-tools.sh` remains available as a compatibility backend for existing
templates and hooks. Use `bash scripts/ai-tools.sh measure-pair` or
`npm run agents:measure` to run a matched baseline-vs-`lean-context`
measurement and append the comparison to `docs/AI_USAGE_REPORT.md`.

Template defaults keep external tools optional. The AGENTS dashboard and local reports are available by default, while external submission stays in `dry-run` until the user chooses `on`.
Multi-client measurement is available through `AGENTS_TOKSCALE_CLIENTS`, with
ready defaults for Codex, Cursor, Antigravity, Claude, Gemini, and Warp.

## License

This repository is licensed under the MIT License.
