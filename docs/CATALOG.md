# Catalog

This catalog is the source of truth for AGENTS templates and presets.

Agents must check this file before recommending a template or preset.

## Status Values

- `available`: files exist and can be copied or applied.
- `planned`: recommended by workflow, but the concrete directory does not exist
  yet.
- `draft`: exists, but should be reviewed before broad reuse.
- `deprecated`: kept for compatibility only.

## Templates

| Name | Path | Status | Use When |
| --- | --- | --- | --- |
| `docs-only` | `templates/docs-only/` | available | Documentation, workflow, governance, or planning repositories. |
| `react-vite-spa` | `templates/react-vite-spa/` | available | React SPA, Vite, or PWA applications. |
| `laravel-react` | `templates/laravel-react/` | available | Laravel applications with a React-capable frontend or Inertia-style UI. |
| `chrome-extension-vanilla` | `templates/chrome-extension-vanilla/` | available | Chrome extensions built with vanilla HTML, CSS, and JavaScript. |

All available templates include `docs/AI_TOOLS.md` with optional project-specific
MCP recommendations, Tokscale usage-tracking guidance, and token-reduction
guidance. They also include `.env.example`, `.codex/config.example.toml`, and
`repomix.config.json`, `.cursor/mcp.example.json`, and `.mcp.example.json` so
users can opt in without writing setup files from scratch.
They also include `.agents.env.example`, `.ai-usage-log.example.md`, and
`docs/AI_MEASUREMENT.md` for baseline vs `lean-context` comparisons.
They include AGENTS CLI guidance, `package.json` project tooling where useful,
`scripts/ai-tools.sh`, and `.githooks/pre-commit` to automate every active local
tool declared in `.agents.env` before iteration commits when the hook is
installed. Tokscale dashboard submission defaults to `dry-run` through `AGENTS_TOKSCALE_SUBMIT`; users can opt into `on` or choose `off`.
Agents must read `docs/AI_CLIENTS.md` during analysis to adapt setup for Codex,
Cursor, Claude, Gemini, Antigravity, Warp, OpenCode, DeepSeek, Ollama, or
another client.

## Presets

| Name | Path | Status | Use When |
| --- | --- | --- | --- |
| `lean-context` | `presets/lean-context/` | available | Projects that should maximize useful AI quota through context discipline, optional MCPs, compression, tracking, and GitHub workflow guidance. |

## Recommendation Rules

- Recommend only one primary template.
- If the best-fit template is `planned`, say it is planned but not available.
- If no available template fits, recommend `docs-only` plus `lean-context` and
  document the gap as a future template candidate.
- Recommend `lean-context` by default for AI-assisted projects unless the user
  explicitly wants no AI workflow layer.
- Do not claim that a planned template can be copied until its directory exists.

## Existing Project Fallback

For existing projects without a direct template match:

```text
Keep the existing structure, apply `lean-context` incrementally, and map current
roadmap, logs, or debt into the standard docs only after user approval.
```
