# Roadmap

This roadmap is the primary source for next-step suggestions in this repository.

## Vision: Four Pillars

Pragmatik is built on four pillars:

1. **Templates** — Lightweight project shells that accelerate new-project creation
   with governance, documentation, and workflow rules already in place.

2. **CLI Companion** — `pragmatik` orchestrates setup, tool selection, template
   recommendation, and AI tooling without requiring third-party accounts.
3. **Dashboard** — A real local dashboard for usage history, cost comparison,
   and time-savings metrics. Currently a stub; planned for v0.5.0.
4. **Comparative Analytics** — Session-level measurement of tokens, cost,
   time spent, and how that compares to equivalent human effort at a configured
   hourly rate. Planned for v0.4.0.

## Autonomy Principle

Pragmatik must not depend on any third-party service for its core measurement
and reporting functions.

- Token estimation uses local AI client transcripts (no API key required).
- Cost estimation uses a built-in model pricing table (no external service).
- Human-vs-AI comparison is computed locally from session data.
- External tools such as Tokscale, Repomix, and Context7 remain supported as
  optional plugins, not required dependencies.
- Submit is opt-in and sends only non-personal aggregate data.

## Current State

- Pragmatik has root workflow documentation.
- `lean-context` is available and applied to this repository.
- Initial templates are available:
  - `docs-only`
  - `react-vite-spa`
  - `laravel-react`
  - `chrome-extension-vanilla`
- GitHub Project, labels, project fields, and initial issue automation are in
  place.
- Available templates are lightweight Pragmatik shells. Optional MCP, Tokscale, and
  token-reduction guidance lives in root/preset documentation and CLI setup
  flows.
- This repository has local Context7 MCP configuration and reusable setup
  examples without committed secrets.
- Analysis prompts now trigger a multi-client AI tool setup check.
- Available templates include Codex, Cursor, generic MCP, Context7, Tokscale,
  and Repomix setup examples.
- Available templates include baseline vs `lean-context` measurement flags, log
  examples, optional Tokscale submission with dry-run defaults and opt-in external submit.
- Pragmatik has an initial local `lean-context` usage report.
- Active AI tools can be automated through `scripts/ai-tools.sh`.
- Baseline-vs-`lean-context` paired measurements can be automated through
  `bash scripts/ai-tools.sh measure-pair`.
- Iteration commits can run active tools automatically through the optional
  `.githooks/pre-commit` flow.
- Root, preset, and templates include the AI tool automation script.
- Root, preset, and templates include local optimization reports and guided
  Tokscale machine setup.
- Pragmatik ships an npm package with the `pragmatik` CLI for professional
  subcommands: help, doctor, setup, dashboard, run, suggest, and MCP scaffold
  flows.
- Templates are lightweight Pragmatik shells. They no longer include generated
  application files, stack package manifests, or runtime scaffolding.
- `pragmatik run` uses the backend bundled in the installed npm package when no
  project-local `scripts/ai-tools.sh` override is present.
- Pragmatik's autonomy architecture is defined: v0.4.0 will introduce an
  autonomous measurement layer that reads local AI client transcripts and
  requires no third-party tools or accounts.
- `scripts/ai-tools.sh` is frozen at v0.3.x and will be deprecated in v1.0.0.

## Next Milestones

1. ~~Resolve the final public package and binary name for Pragmatik.~~ (resolved: `@mvuljevas/pragmatik` / `pragmatik`)
2. **v0.4.0** — Build the autonomous measurement layer:
   - `pragmatik measure`: parse local AI client transcripts (Antigravity, Claude Code).
   - `session.json`: structured local record with tokens, cost, duration, human estimate.
   - Built-in model pricing table (no external dependency).
   - `pragmatik report`: terminal output of the comparative analysis.
   - `PRAGMATIK_HOURLY_RATE` and `PRAGMATIK_MODEL_PRICE_*` in `.agents.env`.
3. **v0.5.0** — Design and implement the real local Pragmatik dashboard:
   - HTTP server (already exists as stub) upgraded to serve session history.
   - Visual comparison: AI cost vs human cost, tokens, time saved.
4. **v0.6.0** — Optional submit:
   - `pragmatik submit` with dry-run default.
   - Only non-personal aggregate metrics. Never content, paths, or identifiers.

5. Publish `@mvuljevas/pragmatik` to npm and test installation in a clean
   external project.
6. Run real paired measurements and decide whether `lean-context` reduces token
   usage, shifts setup cost, or mainly improves consistency.
7. Validate the recommendation flow with real new-project prompts.
8. Refine the first template based on real adoption feedback.
9. Expand `pragmatik mcp-create` into a full read-only MCP server runtime.
10. Add template usage examples or copy/adoption instructions.
11. Review third-party MCP, tracking, and compression recommendations for
    freshness before adding automation.

## Completed Milestones

- Base repository workflow.
- `lean-context` preset.
- GitHub Project setup.
- Initial available template catalog.
- Next-step fallback rule.
- Root roadmap and technical debt docs.
- Template-level MCP, tracking, and token-reduction guidance.
- Local and reusable AI tool setup examples.
- Multi-client AI setup guidance for Codex, Cursor, Claude, Gemini,
  Antigravity, OpenCode, and local-model workflows.
- Baseline vs `lean-context` measurement workflow.
- Repeatable baseline vs `lean-context` paired-measurement automation.
- Initial Pragmatik `lean-context` usage measurement.
- Automated local AI tool execution for active tools.
- Default-on Tokscale coverage, guided setup, local dashboard commands, and
  optimization reports for root, preset, and templates.
- Initial Pragmatik CLI package with local dashboard, setup preview, template
  suggestion, and MCP scaffold command.
- Professionalized Pragmatik CLI interaction with clearer help, stack-aware
  diagnostics, safe non-interactive setup behavior, and useful base-file
  previews for projects with or without Node.
- Simplified CLI usage around subcommands and lightweight template shells.
- Gitflow merge automation via `scripts/gitflow.js` with `npm run gf:*` shortcuts.
