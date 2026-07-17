# Catalog

This catalog is the source of truth for Pragmatik templates and presets.

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
| `react-vite-spa` | `templates/react-vite-spa/` | available | New React, Vite, SPA, or PWA projects that should start from an Pragmatik shell before app files are generated. |
| `laravel-react` | `templates/laravel-react/` | available | New Laravel applications with a React-capable frontend or Inertia-style UI that should start from an Pragmatik shell before framework files are generated. |
| `chrome-extension-vanilla` | `templates/chrome-extension-vanilla/` | available | New Chrome extensions that should start from an Pragmatik shell before manifest and runtime files are generated. |

Available templates are intentionally lightweight shells. They include
`AGENTS.md`, `README.md`, `VERSION`, `.gitignore`, `.gitattributes`,
`.agents.env`, `docs/AI_CONTEXT.md`, `docs/ROADMAP.md`,
`docs/SNAPSHOTS.md`, `docs/TECHDEBT.md`, and CLI guidance. They do not include
framework runtime files, generated app files, or stack package manifests.

Agents should populate real application files only after the user describes the
project goal and approves the selected template/preset workflow.

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
