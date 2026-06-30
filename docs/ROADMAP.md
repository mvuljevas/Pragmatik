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
- Available templates include optional MCP, Tokscale, and token-reduction
  guidance in `docs/AI_TOOLS.md`.
- This repository has local Context7 MCP configuration and reusable setup
  examples without committed secrets.
- Analysis prompts now trigger a multi-client AI tool setup check.
- Available templates include Codex, Cursor, generic MCP, Context7, Tokscale,
  and Repomix setup examples.
- Available templates include baseline vs `lean-context` measurement flags, log
  examples, optional Tokscale submission with dry-run defaults and opt-in external submit.
- AGENTS has an initial local `lean-context` usage report.
- Active AI tools can be automated through `scripts/ai-tools.sh`.
- Iteration commits can run active tools automatically through the optional
  `.githooks/pre-commit` flow.
- Root, preset, and templates include the AI tool automation script.
- Root, preset, and templates include local optimization reports and guided
  Tokscale machine setup.
- AGENTS now ships an npm package with the `agents` CLI for doctor, setup,
  dashboard, run, suggest, and MCP scaffold flows.

## Next Milestones

1. Publish or locally pack `@mvuljevas/agents` and test installation in a clean
   external project.
2. Measure whether `lean-context` reduces token usage in real sessions.
3. Validate the recommendation flow with real new-project prompts.
4. Refine the first template based on real adoption feedback.
5. Expand `agents --mcp-create` into a full read-only MCP server runtime.
6. Add template usage examples or copy/adoption instructions.
7. Review third-party MCP, tracking, and compression recommendations for
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
- Initial AGENTS `lean-context` usage measurement.
- Automated local AI tool execution for active tools.
- Default-on Tokscale coverage, guided setup, local dashboard commands, and
  optimization reports for root, preset, and templates.
- Initial AGENTS CLI package with lowercase flags, local dashboard, setup
  preview, template suggestion, and MCP scaffold command.
