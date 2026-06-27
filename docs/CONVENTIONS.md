# Conventions

This document defines repository-wide conventions for AGENTS templates.

## Repository Purpose

This repository stores reusable documentation, workflow, and project-governance
templates for AI-assisted development.

Templates should be easy to copy into a new or existing project and should give
agents enough context to work consistently without relying on hidden memory.

## Template Principles

- Templates must be explicit, portable, and stack-aware.
- Shared behavior should be documented once and reused across project types.
- Stack-specific behavior belongs in the matching project template.
- Documentation should favor short rules that can be followed during real work.
- A new project should be understandable after reading `README.md`,
  `AGENTS.md`, and `docs/`.

## Required Documents

Every complete project template should provide:

- `README.md`: project purpose, setup, usage, and documentation map.
- `AGENTS.md`: agent behavior and project-specific workflow rules.
- `.gitignore`: stack-appropriate ignored files.
- Authoritative version source, such as `package.json` or `VERSION`.
- `docs/ROADMAP.md`: product or project direction.
- `docs/SNAPSHOTS.md`: chronological project memory.
- `docs/TECHDEBT.md`: accepted risks, shortcuts, and cleanup items.

Optional documents:

- `docs/ARCHITECTURE.md`: system structure and technical decisions.
- `docs/SECURITY.md`: security model and sensitive workflows.
- `docs/adr/`: formal architecture decision records.

## Language

English is the default language for this repository, its shared rules, and its
template documentation.

Spanish phrases may appear only as prompt examples or project-specific
user-facing examples that agents should recognize.

Avoid mixing languages inside the same document unless the project explicitly
requires bilingual output.

## Documentation Updates

Agents should update documentation proactively when work changes:

- How to run or install the project.
- Product scope or roadmap.
- Workflow rules.
- Architecture decisions.
- Security or privacy assumptions.
- Known risks or technical debt.
- Release or version state.

Documentation changes should be part of the same work block as the related
implementation whenever practical.

## Public Metadata

Do not include AI agent names, AI tool names, model names, provider names, or
generated-by signatures in public project metadata.

This applies to:

- Branch names.
- Commit messages.
- Pull request titles and descriptions.
- Tags and releases.
- Changelogs.
- README files.
- Template files.
- Product-visible text.

## Reuse Model

Future templates should live under:

```text
templates/<project-type>/
```

Examples:

```text
templates/laravel-react/
templates/react-vite-spa/
templates/docs-only/
```

Shared source material may live under:

```text
templates/_shared/
```

Each project-type template should still be usable as a self-contained starting
point.
