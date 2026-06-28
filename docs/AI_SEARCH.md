# AI Search

Use this file to locate the smallest useful context before opening files.

## General Search Rules

- Prefer `rg` over recursive `grep`.
- Search before opening files.
- Use `rg --files` to discover file paths.
- Use small slices after locating a target.
- Avoid dependency folders, generated files, build outputs, caches, lockfiles,
  and secrets.

## Repository Search

```bash
rg --files
rg "lean-context|templates|presets" README.md AGENTS.md docs presets
rg "available|planned|draft|deprecated" docs/CATALOG.md
rg "recommend|Recommendation|template and preset" README.md AGENTS.md docs presets
rg "Versioning|vX.Y.Z|VERSION" README.md AGENTS.md docs
rg "GitHub|labels|Projects|signed commits" docs presets
rg "MCP|Resources|Roots|Tools" docs presets
rg "Next suggested step|Risks|Decisions" docs/SNAPSHOTS.md
```

## Preset Search

```bash
rg --files presets/lean-context
rg "Level 1|Level 2|Level 3" presets/lean-context
rg "project-context-mcp|project://" presets/lean-context/docs
rg "node_modules|vendor|dist|build|\\.env" presets/lean-context/files
```

## Documentation Checks

```bash
rg -n "\\[[^\\]]+\\]\\(([^)]+)\\)" README.md docs presets
rg -n "deprecated-preset-name" . || true
git diff --check
```

## Version Checks

```bash
cat VERSION
git tag --list "v$(cat VERSION)"
git log --oneline --decorate -n 5
```

## File Slices

Use slices instead of complete files when possible:

```bash
sed -n '1,140p' docs/WORKFLOWS.md
sed -n '140,260p' docs/WORKFLOWS.md
sed -n '1,180p' presets/lean-context/README.md
sed -n '1,200p' presets/lean-context/docs/RECOMMENDATION_FLOW.md
sed -n '1,180p' docs/CATALOG.md
```
