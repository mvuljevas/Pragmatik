# Snapshots

## 0000-00-00 - Block 001: Workflow Foundation

Branch:

- `main`

Current state:

- Laravel React workflow template applied.

Decisions:

- Use existing Laravel conventions.

Risks:

- Actual application architecture is not defined yet.

Next suggested step:

- Confirm app purpose, frontend pattern, and database target.

## 2026-06-30 - Block 002: Tokscale Coverage Defaults

Branch:

- `main`

Current state:

- The template includes optional Context7, Repomix, Tokscale, Tokless, usage reporting, optimization reporting, and multi-client tracking.
- Tokscale submit defaults to `dry-run`; users can opt into `on` or choose `off`.
- `scripts/ai-tools.sh` supports guided machine setup and local dashboard
  commands.
- Template version has been updated to `0.10.0`.

Decisions:

- Keep raw usage data ignored and commit only aggregate reports.
- Do not claim token savings until matched baseline and optimized runs exist.

Risks:

- Client-specific Tokscale integrations may need user login before coverage is
  complete.

Next suggested step:

- Confirm app purpose, frontend pattern, and database target.

## 2026-06-30 - Block 003: Pragmatik CLI Tooling

Branch:

- `main`

Current state:

- The template includes Pragmatik CLI documentation and optional project tooling.
- `package.json` includes Pragmatik scripts where useful.
- The safe dashboard wrapper is available without replacing normal project scripts.
- Template version has been updated to `0.11.0`.

Decisions:

- Use `pragmatik` as the public setup and dashboard command.
- Keep all external tools optional and user-confirmed.

Risks:

- `@mvuljevas/pragmatik` must be published or linked before package install works from a clean external project.

Next suggested step:

- Run `npm run pragmatik` after creating a project from this template.

## 2026-06-30 - Block 004: CLI Documentation Cleanup

Branch:

- `main`

Current state:

- CLI documentation lists only supported `pragmatik` commands.
- Unsupported flag variants are no longer documented as a user-facing concept.
- Template version has been updated to `0.11.1`.

Decisions:

- Keep generated project documentation focused on valid commands and setup
  paths.

Risks:

- `@mvuljevas/pragmatik` must be published or linked before package install works
  from a clean external project.

Next suggested step:

- Run `npm run pragmatik` after creating a project from this template.

## 2026-07-01 - Block 005: Professional CLI Interaction

Branch:

- `main`

Current state:

- Pragmatik CLI documentation now describes command actions, common flows, safe
  setup behavior, non-Node usage, and error handling.
- Template dev dependency guidance now targets `@mvuljevas/pragmatik` `^0.21.0`.
- Template version has been updated to `0.12.0`.

Decisions:

- Keep `pragmatik` as the single guided entrypoint for doctor, setup, dashboard,
  recommendation, and MCP scaffold flows.

Risks:

- Clean external install validation is still pending.

Next suggested step:

- Run `npm run pragmatik` after creating a project from this template.

## 2026-07-01 - Block 006: CLI Script And GitHub Minimal Completion

Branch:

- `main`

Current state:

- Pragmatik CLI docs now explain GitHub-minimal repository completion and npm
  script flag forwarding.
- Template npm scripts expose `pragmatik` and `pragmatik:help`.
- Template version has been updated to `0.13.0`.

Decisions:

- GitHub-created minimal files are treated as new-project placeholders that can
  be completed after preview.

Risks:

- Clean external install validation is still pending.

Next suggested step:

- Run `npm run pragmatik` after creating a project from this template.

## 2026-07-01 - Block 007: Lightweight Template Shell

Branch:

- `main`

Current state:

- The template is now a lightweight Pragmatik shell.
- Removed package manifests, generated app files, tool scripts, and heavy
  optional AI-tool docs from the template copy.
- Template version has been updated to `0.14.0`.

Decisions:

- Populate real Laravel, React, or Inertia files only after the user describes
  the project goal.

Risks:

- External install validation is still pending.

Next suggested step:

- Run `pragmatik doctor` after creating a project from this template.
