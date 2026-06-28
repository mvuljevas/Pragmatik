# Agent Workflow

This Chrome extension project uses AGENTS and `lean-context`.

## Core Rules

- Keep the extension Manifest V3 compatible.
- Use vanilla JavaScript, HTML, and CSS by default.
- Do not add React, Vue, jQuery, Tailwind, or a bundler without explicit user
  approval.
- Do not execute remote JavaScript.
- Use safe DOM APIs and `textContent` for untrusted data.
- Use Shadow DOM for injected UI when host-page isolation matters.
- Read `README.md`, `AGENTS.md`, `docs/AI_CONTEXT.md`, and recent snapshots
  before changing files.
- Do not push commits or tags without explicit user approval.

## Lean Context Loading

- Search before opening files.
- Prefer slices over complete files.
- Avoid generated output, caches, secrets, and lockfiles unless directly needed.

## Versioning

- Use Semantic Versioning.
- Use tags formatted as `vX.Y.Z`.
- Keep `manifest.json.version` synchronized with the matching tag.
- If `package.json.version` exists, keep it synchronized too.

## Next-Step Fallback

At the end of every iteration, suggest the next logical step from
`docs/ROADMAP.md`. If roadmap is missing or not actionable, use
`docs/TECHDEBT.md`. If neither provides a clear next action, ask the user how
they would like to proceed.
