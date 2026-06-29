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

## 2026-06-27 - Block 004: Chrome Extension Template Naming

Branch:

- `main`

Current state:

- The template catalog now includes `chrome-extension-vanilla` for Chrome
  extensions built with native HTML, CSS, and JavaScript.
- Manifest compatibility is treated as an internal template rule instead of
  being encoded in the folder name.
- Chrome extension projects now use `manifest.json` as the default
  authoritative version source.
- Repository version has been updated to `0.2.0`.

Decisions:

- Use `chrome-extension-vanilla` as the Chrome extension template name.
- Keep Manifest V3 requirements inside the template documentation because older
  manifest versions are deprecated and do not need to shape the folder name.
- If a Chrome extension also has `package.json.version`, it must match
  `manifest.json.version`.

Risks:

- The actual `templates/chrome-extension-vanilla/` directory has not been
  created yet.
- The template still needs internal compliance docs for Chrome Web Store
  permissions, packaged assets, remote-code restrictions, and extension smoke
  testing.

Next suggested step:

- Create `templates/chrome-extension-vanilla/` using EnvatoXperience as the
  reference structure.

## 2026-06-28 - Block 005: Lean Context Preset

Branch:

- `main`

Current state:

- The repository now includes `presets/lean-context/` as a reusable preset for
  maximizing useful AI quota.
- The preset covers no-MCP context discipline, optional MCP integrations,
  compression, usage tracking, interactive project starts, GitHub workflows,
  labels, project fields, and a custom MCP design guide.
- Root documentation now distinguishes complete project templates from reusable
  workflow presets.
- Repository version has been updated to `0.3.0`.

Decisions:

- Use `lean-context` as the final preset name.
- Keep all reusable preset documentation in professional English.
- Treat MCPs, compression tools, usage trackers, and GitHub automation as
  optional capabilities chosen by the user.
- Require generated templates to remain self-contained after adopting preset
  files.

Risks:

- `project-context-mcp` is documented as a design guide but not implemented as a
  server yet.
- Third-party token tracking and compression tools may change quickly and should
  be rechecked before hard automation is added.

Next suggested step:

- Create the first concrete template and integrate `lean-context` into it.

## 2026-06-28 - Block 006: Apply Lean Context To Repository

Branch:

- `main`

Current state:

- The repository now consumes its own `lean-context` preset.
- Active root agent rules include lean context loading and optional MCP
  guardrails.
- Root AI context, search, and token budget documents have been added under
  `docs/`.
- Root `.aiignore` and `.rgignore` have been added.
- Repository version has been updated to `0.4.0`.

Decisions:

- Keep the preset source under `presets/lean-context/`.
- Keep the repository self-contained by copying the active lean context files to
  root-level docs and ignore files.
- Use `VERSION` as the authoritative version source.

Risks:

- Root AI docs must stay synchronized with major repository structure changes.
- No concrete template consumes `lean-context` yet.

Next suggested step:

- Push `v0.3.0` and `v0.4.0` when remote publication is approved, then create
  the first concrete template.

## 2026-06-28 - Block 007: Template Recommendation Flow

Branch:

- `main`

Current state:

- `lean-context` now includes a pre-download recommendation flow for selecting
  templates and presets from the user's application idea.
- The flow distinguishes new projects from existing projects and recommends
  adoption paths instead of overwriting existing repositories.
- Root AI context and search docs now point agents to the recommendation flow.
- Repository version has been updated to `0.5.0`.

Decisions:

- Agents should recommend one primary template and a small preset set before
  copying or applying files.
- MCPs, compression, tracking, labels, and GitHub Projects remain optional
  capabilities selected by the user.
- If no template fits, agents should recommend `docs-only` plus `lean-context`
  and record the gap as a future template candidate.

Risks:

- Concrete template directories are still planned but not created.
- Recommendation quality depends on the template catalog staying current.

Next suggested step:

- Push pending local versions when approved, then create the first concrete
  template using the recommendation flow.

## 2026-06-28 - Block 008: Catalog Source Of Truth

Branch:

- `main`

Current state:

- The repository now has `docs/CATALOG.md` as the source of truth for available
  and planned templates and presets.
- The recommendation flow now requires agents to check the catalog before
  claiming a template can be copied.
- Planned templates are clearly distinguished from available presets.
- Repository version has been updated to `0.6.0`.

Decisions:

- `lean-context` is currently available.
- `docs-only`, `react-vite-spa`, `laravel-react`, and
  `chrome-extension-vanilla` are planned templates until their directories
  exist.
- If the best-fit template is planned but unavailable, agents must say so and
  recommend a temporary fallback.

Risks:

- The catalog must be kept in sync whenever templates or presets are added,
  renamed, deprecated, or removed.

Next suggested step:

- Create `templates/react-vite-spa/` or `templates/docs-only/` so recommendation
  output can point to an available concrete template.

## 2026-06-28 - Block 009: Available Template Set

Branch:

- `main`

Current state:

- The four initial templates now exist and are marked `available` in
  `docs/CATALOG.md`.
- Available templates are `docs-only`, `react-vite-spa`, `laravel-react`, and
  `chrome-extension-vanilla`.
- Each template includes active AGENTS rules, lean-context docs, ignore files,
  snapshots, roadmap, and technical debt tracking.
- `react-vite-spa` and `chrome-extension-vanilla` include minimal runnable
  starter files.
- Repository version has been updated to `0.7.0`.

Decisions:

- `docs-only` is the fallback template when no more specific available template
  fits.
- `laravel-react` is a workflow foundation intended to be applied after creating
  or identifying a Laravel app.
- `react-vite-spa` uses `package.json` as its authoritative version source.
- `chrome-extension-vanilla` uses `manifest.json` as its authoritative version
  source.

Risks:

- Template quality should be validated through real project adoption.
- `laravel-react` intentionally does not include a full Laravel application
  tree.

Next suggested step:

- Test the recommendation flow again with a new app idea and verify that it
  recommends an available template.

## 2026-06-28 - Block 010: Next-Step Fallback Rule

Branch:

- `main`

Current state:

- The root workflow, `lean-context`, and all available templates now define a
  next-step fallback rule.
- Agents must suggest the next logical step from roadmap first, technical debt
  second, and user preference third.
- Repository version has been updated to `0.8.0`.

Decisions:

- `docs/ROADMAP.md` is the primary source for next-step suggestions.
- `docs/TECHDEBT.md` is the fallback source when roadmap is missing or not
  actionable.
- If neither source provides a clear next step, the agent must ask the user how
  they would like to proceed.

Risks:

- Existing projects without roadmap or technical debt docs will require one
  user decision before the agent can suggest the next direction.

Next suggested step:

- Use the roadmap-driven fallback to choose between project-context MCP work,
  technical debt automation, or further template refinement.

## 2026-06-28 - Block 011: Root Roadmap And Technical Debt

Branch:

- `main`

Current state:

- The repository now has root `docs/ROADMAP.md` and `docs/TECHDEBT.md`.
- The next-step fallback rule now applies to this repository with real roadmap
  and technical debt sources.
- Open technical debt entries are linked to GitHub issues.
- Repository version has been updated to `0.9.0`.

Decisions:

- `docs/ROADMAP.md` is the primary source for AGENTS next-step suggestions.
- `docs/TECHDEBT.md` is the fallback source and durable local debt index.
- GitHub issues remain the operational board items for actionable debt.

Risks:

- Roadmap and technical debt must be kept aligned with GitHub Project state.

Next suggested step:

- Follow `docs/ROADMAP.md`: validate the recommendation flow with real
  new-project prompts.

## 2026-06-28 - Block 012: Token Impact Debt Review

Branch:

- `main`

Current state:

- Technical debt review found that `lean-context` appears behaviorally useful
  but does not yet prove token savings with real measurements.
- `docs/TECHDEBT.md` now tracks this as high-priority AI context debt.
- `docs/ROADMAP.md` now prioritizes measuring token impact before further
  refinement.
- Repository version has been updated to `0.9.1`.

Decisions:

- Treat unmeasured token savings as product debt because quota maximization is
  the core value of `lean-context`.
- Measure baseline vs `lean-context` sessions before adding more optimization
  machinery.

Risks:

- Without measurement, added docs may improve consistency while increasing
  initial context cost.

Next suggested step:

- Follow `docs/ROADMAP.md`: measure whether `lean-context` reduces token usage
  in real sessions.

## 2026-06-29 - Block 014: Local AI Tool Setup

Branch:

- `main`

Current state:

- Context7 MCP has been configured locally for this repository through ignored
  project configuration.
- `docs/AI_TOOL_SETUP.md` documents Context7, Tokscale, Repomix, and MCP
  overhead tooling.
- Root and template `.env.example`, `.codex/config.example.toml`, ignore rules,
  and Repomix configs are now available for reuse.
- The generated Context7 skill is present for this repository.
- Repository version has been updated to `0.11.0`.
- Template versions have been updated to `0.3.0`.

Decisions:

- Real API keys remain local and ignored.
- Template and preset files use placeholders only.
- Tokscale submission remains opt-in; local reports are allowed for
  measurement.
- Repomix is the default bundled reduction path for template downloads.

Risks:

- The Context7 key used during setup was pasted into chat and should be rotated
  if the account treats chat transcripts as non-secret storage.
- Context7, Tokscale, and Repomix command behavior can change and should be
  rechecked before automating setup.

Next suggested step:

- Follow `docs/ROADMAP.md`: measure whether `lean-context` reduces token usage
  in real sessions.

## 2026-06-29 - Block 013: Template AI Tool Guidance

Branch:

- `main`

Current state:

- Each available template now includes `docs/AI_TOOLS.md`.
- Template README and AGENTS rules now point agents to optional AI tool setup
  guidance.
- The preset now distinguishes token usage tracking from token reduction:
  Tokscale is observability, while Repomix compression and MCP optimization
  layers are optional reduction tools.
- The root repository version has been updated to `0.10.0`.
- Template versions have been updated to `0.2.0` because reusable template
  behavior changed.

Decisions:

- MCP, Tokscale, Repomix, and MCP optimization layers remain opt-in.
- Agents must ask before enabling or changing external tool configuration.
- Template-specific MCP recommendations should guide users without requiring any
  third-party service.

Risks:

- Third-party MCP and token tooling can change quickly, so install commands and
  capabilities must be rechecked before automation.
- Tokscale can prove usage patterns but does not reduce tokens by itself.

Next suggested step:

- Follow `docs/ROADMAP.md`: measure whether `lean-context` reduces token usage
  in real sessions.
