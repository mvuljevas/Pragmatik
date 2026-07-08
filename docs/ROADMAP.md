# Roadmap

This roadmap is the primary source for next-step suggestions in this repository.

## Current State

- AGENTS has root workflow documentation.
- `lean-context` is available and applied to this repository.
- Initial templates are available:
  - `docs-only`
  - `react-vite-spa`
  - `laravel-react`
  - `chrome-extension-vanilla`
- GitHub Project, labels, project fields, and initial issue automation are in
  place.
- Available templates are lightweight AGENTS shells. Optional MCP, Tokscale, and
  token-reduction guidance lives in root/preset documentation and CLI setup
  flows.
- This repository has local Context7 MCP configuration and reusable setup
  examples without committed secrets.
- Analysis prompts now trigger a multi-client AI tool setup check.
- Available templates include Codex, Cursor, generic MCP, Context7, Tokscale,
  and Repomix setup examples.
- Available templates include baseline vs `lean-context` measurement flags, log
  examples, optional Tokscale submission with dry-run defaults and opt-in external submit.
- AGENTS has an initial local `lean-context` usage report.
- Active AI tools can be automated through `scripts/ai-tools.sh`.
- Baseline-vs-`lean-context` paired measurements can be automated through
  `bash scripts/ai-tools.sh measure-pair` or `npm run agents:measure`.
- Iteration commits can run active tools automatically through the optional
  `.githooks/pre-commit` flow.
- Root, preset, and templates include the AI tool automation script.
- Root, preset, and templates include local optimization reports and guided
  Tokscale machine setup.
- AGENTS now ships an npm package with the `agents` CLI for professional
  subcommands: help, doctor, setup, dashboard, run, suggest, and MCP scaffold
  flows.
- Templates are lightweight AGENTS shells. They no longer include generated
  application files, stack package manifests, or runtime scaffolding.

## Next Milestones

1. ~~Resolve the final public package and binary name for Pragmatik.~~ (resolved: `@mvuljevas/pragmatik` / `pragmatik`)
2. Design and implement a real local Pragmatik dashboard or remove the command
   until it exists.
3. Publish `@mvuljevas/pragmatik` to npm and test installation in a clean
   external project.
4. Run real paired measurements and decide whether `lean-context` reduces token
   usage, shifts setup cost, or mainly improves consistency.
5. Validate the recommendation flow with real new-project prompts.
6. Refine the first template based on real adoption feedback.
7. Expand `agents mcp-create` into a full read-only MCP server runtime.
8. Add template usage examples or copy/adoption instructions.
9. Review third-party MCP, tracking, and compression recommendations for
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
- Initial AGENTS `lean-context` usage measurement.
- Automated local AI tool execution for active tools.
- Default-on Tokscale coverage, guided setup, local dashboard commands, and
  optimization reports for root, preset, and templates.
- Initial AGENTS CLI package with local dashboard, setup preview, template
  suggestion, and MCP scaffold command.
- Professionalized AGENTS CLI interaction with clearer help, stack-aware
  diagnostics, safe non-interactive setup behavior, and useful base-file
  previews for projects with or without Node.
- Simplified CLI usage around subcommands and lightweight template shells.
