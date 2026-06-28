# Catalog

This catalog is the source of truth for available and planned AGENTS templates
and presets.

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
| `docs-only` | `templates/docs-only/` | planned | Documentation, workflow, governance, or planning repositories. |
| `react-vite-spa` | `templates/react-vite-spa/` | planned | React SPA, Vite, or PWA applications. |
| `laravel-react` | `templates/laravel-react/` | planned | Laravel applications with a React-capable frontend or Inertia-style UI. |
| `chrome-extension-vanilla` | `templates/chrome-extension-vanilla/` | planned | Chrome extensions built with vanilla HTML, CSS, and JavaScript. |

## Presets

| Name | Path | Status | Use When |
| --- | --- | --- | --- |
| `lean-context` | `presets/lean-context/` | available | Projects that should maximize useful AI quota through context discipline, optional MCPs, compression, tracking, and GitHub workflow guidance. |

## Recommendation Rules

- Recommend only one primary template.
- If the best-fit template is `planned`, say it is planned but not available.
- If no available template fits, recommend a temporary `docs-only` plus
  `lean-context` adoption path.
- If `docs-only` itself is still planned, say that no concrete template is
  available yet and recommend applying `lean-context` directly.
- Recommend `lean-context` by default for AI-assisted projects unless the user
  explicitly wants no AI workflow layer.
- Do not claim that a planned template can be copied until its directory exists.

## Current Practical Fallback

Until concrete templates are created, the practical fallback for new projects is:

```text
Apply `lean-context` directly and create a minimal documentation foundation.
```

For existing projects:

```text
Keep the existing structure, apply `lean-context` incrementally, and map current
roadmap, logs, or debt into the standard docs only after user approval.
```
