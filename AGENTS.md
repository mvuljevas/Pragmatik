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
4. Summarize the current state.
5. Ask a project-start question such as:

```text
¿Que vamos a construir hoy?
What are we building today?
What should we work on next?
```

If the repository already contains an application, the agent should also propose
how to adopt the template rules without disrupting existing conventions.

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
9. Matching git tag creation for the new version when the iteration is closed.
10. Suggested next logical step.

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
