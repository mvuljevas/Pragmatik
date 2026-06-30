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

## 2026-06-29 - Block 016: Context Mode Measurement Switch

Branch:

- `main`

Current state:

- Root, preset, and templates include `.agents.env.example` for non-secret
  baseline vs `lean-context` experiment flags.
- Root, preset, and templates include `.ai-usage-log.example.md` and
  `docs/AI_MEASUREMENT.md`.
- Analysis prompts now check `.agents.env` when present before deciding whether
  to run baseline or `lean-context` behavior.
- Repository version has been updated to `0.13.0`.
- Template versions have been updated to `0.5.0`.

Decisions:

- `.agents.env` is ignored and reserved for non-secret experiment flags.
- `.env` remains reserved for secrets such as API keys.
- `AGENTS_CONTEXT_MODE=baseline` disables optional AI tooling bootstrap for
  measurement unless the user explicitly asks.
- `AGENTS_CONTEXT_MODE=lean-context` keeps the normal template workflow active.

Risks:

- Agents cannot enforce perfect experimental parity across different clients,
  so logs must record client, model, prompt, and tool state.
- Baseline mode still runs inside a template repository, so results should be
  interpreted as practical workflow comparison rather than a laboratory control.

Next suggested step:

- Follow `docs/ROADMAP.md`: run the first baseline vs `lean-context`
  measurement pair.

## 2026-06-29 - Block 017: Local Usage Measurement Enabled

Branch:

- `main`

Current state:

- The AGENTS repository has local ignored measurement files active:
  `.agents.env`, `.ai-usage-log.md`, `.env`, and `.codex/config.toml`.
- `AGENTS_CONTEXT_MODE=lean-context` is active locally.
- Context7 CLI validation succeeded using local ignored configuration.
- Tokscale local reporting is available and grouped one AGENTS task at
  approximately 1.9M tokens and $30.28.
- Repomix generated a broad bounded repository pack of 48,012 tokens across 106
  files with no suspicious files detected.
- `docs/AI_USAGE_REPORT.md` now records aggregate, non-sensitive usage
  observations.
- Repository version has been updated to `0.14.0`.

Decisions:

- Keep raw usage logs and credentials local and ignored.
- Commit only aggregate, non-sensitive usage observations.
- Treat Tokscale task grouping as approximate until a baseline comparison is
  run.

Risks:

- Tokscale local reports can include other repositories and clients if filters
  are too broad.
- The current measurement does not prove token savings until compared with a
  matching baseline run.

Next suggested step:

- Follow `docs/ROADMAP.md`: run a baseline clone with
  `AGENTS_CONTEXT_MODE=baseline` and compare against this `lean-context` run.

## 2026-06-29 - Block 018: AI Tool Automation

Branch:

- `main`

Current state:

- Root, preset, and templates include `scripts/ai-tools.sh`.
- The script reads `.agents.env`, runs tools marked `on`, writes raw local
  outputs to `.ai-runs/`, and appends aggregate summaries to
  `docs/AI_USAGE_REPORT.md` when `AGENTS_USAGE_REPORT=on`.
- `.ai-runs/` is ignored in git, AI context, and local search ignores.
- Root `.agents.env` has local automation enabled for Context7, Repomix, and
  Tokscale.
- Repository version has been updated to `0.15.0`.
- Template versions have been updated to `0.6.0`.

Decisions:

- Automate only local, user-configured tools.
- Treat `ask` as available but not executed by automation.
- Keep raw logs and generated packs ignored under `.ai-runs/`.
- Commit only aggregate, non-sensitive usage summaries.

Risks:

- Tokscale task grouping is approximate and still needs baseline comparison.
- Automation can append frequent report sections if run after every iteration;
  periodic cleanup may be needed later.

Next suggested step:

- Follow `docs/ROADMAP.md`: run a baseline clone with
  `AGENTS_CONTEXT_MODE=baseline` and compare against automated
  `lean-context` runs.

## 2026-06-29 - Block 019: Iteration Hook Automation

Branch:

- `main`

Current state:

- Root, preset, and templates include `.githooks/pre-commit`.
- `scripts/ai-tools.sh` now supports `run-and-stage` and `install-hooks`.
- `.agents.env.example` includes `AGENTS_AUTO_RUN_ON_COMMIT=off`.
- This repository can enable commit-time tool execution with
  `bash scripts/ai-tools.sh install-hooks` and local
  `AGENTS_AUTO_RUN_ON_COMMIT=on`.
- Repository version has been updated to `0.16.0`.
- Template versions have been updated to `0.7.0`.

Decisions:

- Commit-time automation is opt-in through local `.agents.env`.
- The hook runs only local active tools and stages only the aggregate usage
  report target when enabled.
- Raw outputs remain ignored under `.ai-runs/`.
- Pushes, remote submissions, and MCP mutation remain approval-only.

Risks:

- Commit-time automation can slow commits when network-backed tools are active.
- Frequent report sections may require later pruning or rollup.

Next suggested step:

- Follow `docs/ROADMAP.md`: implement the first `project-context-mcp` prototype
  so context can be exposed through bounded read-only resources.

## 2026-06-30 - Block 024: Blind Agent Coverage Probe

Branch:

- `main`

Current state:

- A non-Codex local agent was invoked with a minimal marker prompt.
- The AI tool workflow was run with `AGENTS_TOKSCALE_SUBMIT=off` to avoid
  publishing probe data.
- Tokscale recorded a new synthetic zero-cost session in the selected client
  report, but did not attribute usage to unsupported local Ollama execution.
- Cursor Agent is installed but not logged in.
- Tokscale Cursor integration is not authenticated.
- Antigravity sync runs but still detects no sessions.
- Repository version has been updated to `0.18.2`.

Decisions:

- Treat this as a coverage limitation, not a script failure.
- Keep unsupported local runtimes documented as outside direct Tokscale client
  coverage unless another supported agent writes measurable session data.

Risks:

- Blind agent probes can produce synthetic zero-cost records that prove session
  discovery but not token/cost attribution.
- Cursor and Antigravity remain incomplete until their own authentication or
  runtime cache requirements are satisfied.

Next suggested step:

- Authenticate Cursor Agent and Tokscale Cursor integration, then rerun the
  same coverage probe with `cursor` included in `AGENTS_TOKSCALE_CLIENTS`.

## 2026-06-30 - Block 025: Tokscale Global Coverage Defaults

Branch:

- `main`

Current state:

- `scripts/ai-tools.sh` now uses a portable Tokscale wrapper based on
  `npx -y tokscale@latest`.
- The automation supports `check`, `setup-machine`, `run`, `run-and-stage`,
  `install-hooks`, and `dashboard`.
- Tokscale coverage now includes guided setup and sync checks for Codex, Cursor,
  Antigravity, Claude, Gemini, and Warp.
- `.agents.env.example` defaults to Context7, Repomix, Tokscale, usage reports,
  optimization reports, multi-client tracking, client syncs, and Tokscale
  submit enabled.
- Users can opt down with `AGENTS_TOKSCALE_SUBMIT=dry-run` or
  `AGENTS_TOKSCALE_SUBMIT=off`.
- `docs/AI_OPTIMIZATION_REPORT.md` records measured usage, bounded context
  size, client coverage, and savings notes without claiming savings until
  matched baseline and optimized runs exist.
- Root, preset, and templates contain synchronized AI tool scripts, environment
  samples, setup docs, client docs, and optimization report placeholders.
- Repository version has been updated to `0.19.0`.
- Template versions have been updated to `0.10.0`.

Decisions:

- Prefer Tokscale's built-in TUI and graph export as the first local dashboard.
- Keep scripts portable through `npx`; document global install only as a
  convenience for Warp and regular shells.
- Treat Ollama as outside direct Tokscale coverage until Tokscale exposes an
  Ollama client or a separate telemetry layer is selected.

Risks:

- Tokscale client integrations can change and should be rechecked against the
  upstream CLI before extending client-specific sync logic.
- Default submit requires users to be intentional about opt-down mode when they
  want local-only measurement.
- Real savings remain unproven until matched baseline and optimized runs are
  captured for the same task.

Next suggested step:

- Follow `docs/ROADMAP.md`: run a baseline clone with
  `AGENTS_CONTEXT_MODE=baseline` and compare against automated
  `lean-context` runs.

## 2026-06-30 - Block 026: AGENTS CLI Foundation

Branch:

- `main`

Current state:

- The repository now includes npm package metadata for `@mvuljevas/agents`.
- `cli/agents.js` provides the `agents` command with lowercase flags for help,
  init, setup, doctor, run, dashboard, suggest, and MCP scaffold flows.
- `agents --dashboard` serves a local dashboard using local reports and tool
  detection.
- `agents --setup` previews additive changes for existing repositories and does
  not replace normal `dev` scripts by default.
- `agents --suggest --issue` prepares a template request issue draft and can
  create it with GitHub CLI only when explicitly confirmed.
- `docs/AGENTS_CLI.md` and `docs/AI_TOOL_REGISTRY.md` document the new CLI and
  optional tool registry.
- Templates now include `package.json` project tooling for AGENTS where useful.
- Repository version has been updated to `0.20.0`.
- Template versions have been updated to `0.11.0`.

Decisions:

- `agents` is the public command and flags are lowercase only.
- Tools remain optional; local-safe options can be preselected by the wizard but
  still require confirmation before installation or config changes.
- Existing repositories receive additive wrappers such as `agents:dev`; normal
  project scripts are not replaced by default.

Risks:

- The MCP scaffold is not yet a complete MCP runtime.
- The dashboard is intentionally minimal and should be refined after testing in
  external projects.
- The npm package should be tested with `npm pack` or a clean install before
  publishing.

Next suggested step:

- Follow `docs/ROADMAP.md`: publish or locally pack `@mvuljevas/agents` and
  test installation in a clean external project.

## 2026-06-30 - Block 023: AI Tool Script Structure Audit

Branch:

- `main`

Current state:

- Root, preset, and templates have synchronized `scripts/ai-tools.sh`,
  `.githooks/pre-commit`, and `.agents.env.example` files.
- The AI tool script no longer depends on `rg` for internal Tokscale client
  selection; shell matching handles selected clients.
- `.agents.env.example` includes ready-to-use sample profiles for local-only
  automation, commit-time automation, multi-client tracking, and dashboard
  publication.
- `docs/AI_TOOL_SETUP.md` documents the execution order:
  configuration loading, Context7 validation, Tokscale coverage/sync/report,
  optional Tokscale submission, Repomix, and aggregate reporting.
- Repository version has been updated to `0.18.1`.
- Template versions have been updated to `0.9.1`.

Decisions:

- Keep one canonical script copied into each template for immediate download
  usability.
- Keep submission disabled in samples by default and expose explicit
  `dry-run`/`on` profiles.
- Run Repomix after usage tracking so token/cost reporting is based on refreshed
  client caches before context packing.

Risks:

- Script copies can drift if future changes are not synchronized across root,
  preset, and templates.
- Tokscale client integration behavior can change, so CLI help should be
  rechecked before adding new client-specific sync steps.

Next suggested step:

- Follow `docs/ROADMAP.md`: implement the first `project-context-mcp` prototype
  so context can be exposed through bounded read-only resources.

## 2026-06-29 - Block 022: Multi-Client Tokscale Automation

Branch:

- `main`

Current state:

- `scripts/ai-tools.sh` supports `AGENTS_TOKSCALE_CLIENTS` for multi-client
  reports and submissions.
- Cursor status and optional `cursor sync` are captured when `cursor` is in the
  client list.
- Antigravity status and optional `antigravity sync` are captured when
  `antigravity` is in the client list.
- Root, preset, and templates include the same multi-client automation.
- This repository is locally configured for
  `codex,cursor,antigravity,claude`.
- Repository version has been updated to `0.18.0`.
- Template versions have been updated to `0.9.0`.

Decisions:

- Templates default to single-client `codex` and disabled Cursor/Antigravity
  sync.
- Project owners can enable multi-client measurement without changing scripts.
- Ollama is not treated as a Tokscale client because the current Tokscale CLI
  does not expose an `ollama` client.

Risks:

- Cursor coverage requires a separate Tokscale Cursor login before sync works.
- Antigravity coverage requires running language servers or readable cache
  artifacts.
- Claude Desktop is not equivalent to Claude Code transcript coverage.

Next suggested step:

- Follow `docs/ROADMAP.md`: implement the first `project-context-mcp` prototype
  so context can be exposed through bounded read-only resources.

## 2026-06-29 - Block 021: Tokscale Dashboard Submission

Branch:

- `main`

Current state:

- Tokscale login succeeded locally as `mvuljevas`.
- `bash scripts/ai-tools.sh run` successfully submitted Codex usage for
  2026-06-29.
- Submitted scope: `codex`, `today`, 23,830,062 tokens, $23.20.
- `docs/AI_USAGE_REPORT.md` records the successful submission.
- Repository version has been updated to `0.17.1`.

Decisions:

- Keep raw Tokscale submit output ignored under `.ai-runs/`.
- Commit only the aggregate report and project memory update.
- Avoid re-submitting during this documentation commit to prevent duplicate
  external submissions.

Risks:

- Tokscale dashboard timing may lag after successful CLI submission.
- Future client coverage still depends on each client's readable local data or
  Tokscale integration cache.

Next suggested step:

- Follow `docs/ROADMAP.md`: implement the first `project-context-mcp` prototype
  so context can be exposed through bounded read-only resources.

## 2026-06-29 - Block 020: Tokscale Submission Control

Branch:

- `main`

Current state:

- `scripts/ai-tools.sh` supports `AGENTS_TOKSCALE_SUBMIT=off|dry-run|on`.
- Root, preset, and templates include the same submit-aware automation script.
- `.agents.env.example` keeps remote submission `off` by default.
- Documentation now distinguishes local Tokscale reports from remote dashboard
  submission.
- Documentation explains that Tokscale coverage depends on the active client
  and should be checked with `npx -y tokscale@latest clients`.
- Repository version has been updated to `0.17.0`.
- Template versions have been updated to `0.8.0`.

Decisions:

- Templates expose remote submission but do not enable it by default.
- This repository may enable submission locally after explicit user approval.
- Long-running terminal sessions are handled by reading local client session
  data at run/commit time, not by keeping the hook process alive.

Risks:

- Remote dashboard data will remain empty until Tokscale is authenticated with
  `login` or `TOKSCALE_API_TOKEN`.
- Some clients require client-specific Tokscale integrations or caches before
  coverage is complete.

Next suggested step:

- Follow `docs/ROADMAP.md`: implement the first `project-context-mcp` prototype
  so context can be exposed through bounded read-only resources.

## 2026-06-29 - Block 015: Multi-Client Tool Bootstrap

Branch:

- `main`

Current state:

- Analysis prompts now trigger an optional AI tooling check.
- `docs/AI_CLIENTS.md` documents setup paths for Codex, Cursor, Claude, Gemini,
  Antigravity, OpenCode, DeepSeek, Ollama, and local-model workflows.
- Root, preset, and templates include Cursor MCP and generic MCP example files
  in addition to Codex examples.
- Templates include `docs/AI_CLIENTS.md` and updated AGENTS rules so
  `Analiza el repo.` can guide tool setup before implementation work.
- Repository version has been updated to `0.12.0`.
- Template versions have been updated to `0.4.0`.

Decisions:

- Multi-client setup is guided during analysis, but still opt-in.
- Agents must continue project analysis even if optional tooling is not
  configured.
- Context7, Repomix MCP, Tokscale login, and Tokscale submission require user
  approval before activation.

Risks:

- Different clients may change MCP configuration formats, so CLI setup commands
  should be preferred when available.
- Local model workflows may not support MCP natively and may rely on Repomix
  output instead.

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
