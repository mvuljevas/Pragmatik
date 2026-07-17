# Template and Preset Recommendation Flow

This document defines how an agent should recommend templates and presets before
the user downloads, copies, or applies them.

The goal is to choose the smallest useful starting point from the user's stated
application idea, not to install everything by default.

## When To Use

Use this flow when the user says they want to build a new project, start an app,
adopt Pragmatik workflow rules, or asks which template or preset fits their idea.

Examples:

```text
I want to build a Laravel app with React.
Quiero crear una extensión de Chrome.
I have an existing Vite app and want to add Pragmatik.
Which template should I use for this product?
```

## Inputs To Collect

The agent should extract or ask for:

- Product type.
- Existing or new project.
- Frontend stack.
- Backend stack.
- Runtime or platform.
- Database.
- Deployment target.
- GitHub usage.
- Need for AI quota optimization.
- Need for MCP, compression, or usage tracking.

Ask only for missing information that materially changes the recommendation.

## Recommendation Output

The agent should respond with:

1. Recommended template.
2. Recommended presets.
3. Why this combination fits.
4. What will be copied or created.
5. What remains optional.
6. Questions that must be answered before applying anything.

## Current Template Candidates

Check the repository catalog before recommending a template:

```text
docs/CATALOG.md
```

The catalog is the source of truth for whether a template is available,
planned, draft, or deprecated.

These are current catalog targets.

| User intent | Recommended template |
| --- | --- |
| Laravel app with React or React-capable frontend | `templates/laravel-react/` |
| React SPA, Vite, or PWA | `templates/react-vite-spa/` |
| Chrome extension with HTML, CSS, and JavaScript | `templates/chrome-extension-vanilla/` |
| Documentation and workflow repository | `templates/docs-only/` |

## Current Preset Candidates

| Need | Recommended preset |
| --- | --- |
| Reduce context waste and maximize AI quota | `presets/lean-context/` |
| Search-first agent workflow | `presets/lean-context/` |
| Optional MCP guidance | `presets/lean-context/` |
| GitHub labels, Projects, signed commits, and debt automation | `presets/lean-context/` |

## Recommendation Rules

- Recommend one primary template.
- Check `docs/CATALOG.md` before claiming a template can be copied.
- If the best-fit template is planned but not available, say so clearly.
- Recommend `lean-context` by default unless the user explicitly wants a minimal
  documentation-only setup.
- Do not recommend a framework-specific template unless the user's stack matches
  it.
- Do not recommend MCP installation by default; recommend MCP guidance as an
  optional capability.
- For existing projects, recommend adoption steps instead of copying a full
  template over the project.
- If no available template fits, recommend `docs-only` plus `lean-context`.
- Document catalog gaps as future template candidates.

## New Project Response Template

```text
Recommended starting point:
- Template: `templates/<name>/`
- Presets: `presets/lean-context/`

Why:
- ...

Before applying:
- Confirm project name.
- Confirm stack.
- Confirm whether to initialize GitHub labels and Project fields.
```

## Existing Project Response Template

```text
Recommended adoption path:
- Keep existing project structure.
- Add selected Pragmatik workflow docs.
- Add `lean-context` docs and ignores.
- Map existing roadmap, logs, or technical debt into the standard docs.

Do not overwrite:
- Existing README.
- Existing build or test configuration.
- Existing version source.
```

## GitHub Project Question

When GitHub workflow is relevant, ask:

```text
Does this repository already have a GitHub Project? Should I create or link one?
```

Only prepare labels, fields, and issues after the user approves.
