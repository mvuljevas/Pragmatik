# Snapshots

Snapshots preserve project memory across sessions, handoffs, branch changes, and
context compaction.

## Format

Use this structure:

```text
## YYYY-MM-DD - Block NNN: Short Title

Branch:

- `branch-name`

Current state:

- What is true now.

Decisions:

- Decisions made in this block.

Risks:

- Risks, unknowns, or open questions.

Next suggested step:

- The next logical action.
```

## Rules

- Add snapshots after meaningful project changes.
- Keep snapshots factual and concise.
- Do not use snapshots as a replacement for roadmap or technical debt.
- Link or reference decisions when a fuller document exists.
- Keep chronological order from oldest to newest.

## 2026-06-27 - Block 001: Base Repository Structure

Branch:

- `main`

Current state:

- Repository purpose has been defined as a reusable template library for
  AI-assisted project workflows.
- Base governance structure has been introduced with root agent rules and shared
  documentation under `docs/`.
- The root `VERSION` file defines the version for this template-library
  repository.
- Templates for specific project types have not been added yet.

Decisions:

- Root documentation defines shared behavior for all future templates.
- Future project templates should live under `templates/<project-type>/`.
- Shared workflows include agent behavior, snapshots, documentation updates,
  Git rules, Semantic Versioning, and `vX.Y.Z` release tags.
- Agents should recognize a set of repository-analysis prompts, not only one
  exact phrase.
- Agents should ask `¿Que vamos a construir hoy?` or an equivalent
  project-start question after analyzing a newly cloned project template.

Risks:

- Template-specific files still need to be created for Laravel + React,
  React/Vite, documentation-only, and other project types.
- Version tagging is documented but not implemented as scripts or CI yet.

Next suggested step:

- Add the first reusable project template, starting with the Laravel + React
  structure aligned with Prisma.

## 2026-06-27 - Block 002: Prompt and Template Naming Alignment

Branch:

- `main`

Current state:

- Shared documentation now defines analysis prompts as a set of equivalent
  requests instead of relying on the exact phrase `Analiza el repo.`.
- The project-start question now uses `¿Que vamos a construir hoy?` and English
  equivalents.
- Template examples now include `laravel-react`, aligned with Prisma's Laravel
  workflow and expected React-capable project variants.
- The desktop-specific starter has been removed from the initial template
  examples.
- English is the default language for repository documentation and template
  rules.

Decisions:

- Keep Spanish prompt examples only when documenting user phrases the agent
  should recognize.
- Use `laravel-react` as the initial Laravel-family template name instead of a
  generic `laravel` template.

Risks:

- The actual `templates/laravel-react/` directory has not been created yet.
- Iteration tagging is still documented as workflow behavior but not implemented
  through scripts or CI.

Next suggested step:

- Create the `templates/laravel-react/` base files using Prisma's current
  workflow as the reference.

## 2026-06-27 - Block 003: Iteration Versioning Rules

Branch:

- `main`

Current state:

- Versioning rules now allow agents to update versions and create matching local
  tags at the end of each meaningful iteration.
- Documentation now requires the authoritative project version file to match the
  git tag.
- React and Node-style projects explicitly use `package.json` as the default
  version source.
- This repository now uses `VERSION` as its authoritative version source.

Decisions:

- A project version uses `X.Y.Z`; the matching git tag uses `vX.Y.Z`.
- Agents should update the stack-specific version file during a completed
  versioned iteration.
- Template-library repositories use `VERSION` by default.
- Agents may create local tags for closed iterations, but must not push tags
  without explicit user approval.

Risks:

- Template-specific version-file choices still need to be defined for
  `laravel-react`, React/Vite, and documentation-only templates.
- No automation script exists yet to enforce version-file and tag consistency.

Next suggested step:

- Define version-file conventions inside the first project template.
