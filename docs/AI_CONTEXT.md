# AI Context

This file is the compact project summary for agents working in this repository.

## Project

- Name: AGENTS.
- Purpose: reusable documentation, workflow, preset, and template library for
  AI-assisted software projects.
- Current version: 0.7.0.
- Primary audience: Mauricio Vuljevas projects and future reusable project
  foundations.

## Stack

- Runtime: documentation-only repository.
- Frameworks: none.
- Package manager: none.
- Version source: `VERSION`.
- Release tags: `vX.Y.Z`.

## Repository Shape

```text
.
├── AGENTS.md
├── README.md
├── VERSION
├── docs/
│   ├── AI_CONTEXT.md
│   ├── AI_SEARCH.md
│   ├── AI_TOKEN_BUDGET.md
│   ├── CATALOG.md
│   ├── CONVENTIONS.md
│   ├── NAMING.md
│   ├── SNAPSHOTS.md
│   └── WORKFLOWS.md
├── presets/
│   └── lean-context/
└── templates/
    ├── chrome-extension-vanilla/
    ├── docs-only/
    ├── laravel-react/
    └── react-vite-spa/
```

## Key Commands

```bash
# inspect state
git status --short --branch

# search
rg "pattern"
rg --files

# validate JSON preset files
python3 -m json.tool presets/lean-context/files/repomix.config.json >/dev/null
python3 -m json.tool presets/lean-context/files/github/labels.json >/dev/null

# validate whitespace
git diff --check
```

## Important Files

- `README.md`: repository purpose, shared standards, and preset catalog.
- `AGENTS.md`: active agent workflow rules for this repository.
- `VERSION`: authoritative version source for this repository.
- `docs/CATALOG.md`: source of truth for available and planned templates and
  presets.
- `docs/SNAPSHOTS.md`: chronological project memory.
- `docs/CONVENTIONS.md`: template and preset conventions.
- `docs/WORKFLOWS.md`: shared workflow rules.
- `presets/lean-context/`: reusable preset for lean context loading.
- `templates/`: available project templates.
- `presets/lean-context/docs/RECOMMENDATION_FLOW.md`: guide for recommending a
  template and preset combination before adoption.

## Current Decisions

- Root documentation is written in concise English.
- Spanish phrases appear only as prompt examples that agents should recognize.
- Project templates will live under `templates/<project-type>/`.
- Reusable workflow layers live under `presets/<preset-name>/`.
- `lean-context` is both stored as a preset and applied to this repository.
- Agents should recommend templates and presets before copying or applying them.
- Agents must check `docs/CATALOG.md` before claiming a template can be copied.
- At iteration close, agents must suggest the next step from roadmap first,
  technical debt second, and user preference third.
- Pushes remain explicit; local commits and tags may be created during closed
  versioned iterations.

## Current Risks

- First concrete templates are available.
- `project-context-mcp` is documented as a design guide but not implemented.
- Third-party MCP, tracking, and compression tools can change quickly and should
  be rechecked before automation is added.

## Search Notes

- Use `docs/AI_SEARCH.md` before opening broad directories.
- Prefer slices over full files.
- Do not inspect ignored or generated paths unless directly needed.
