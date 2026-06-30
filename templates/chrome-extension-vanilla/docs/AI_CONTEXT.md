# AI Context

## Project

- Name: Chrome Extension Vanilla.
- Purpose: Manifest V3 Chrome extension starter with AGENTS and lean-context.
- Current version: 0.11.0.
- Version source: `manifest.json`.

## Stack

- Platform: Chrome Extension.
- Manifest: V3.
- Code: vanilla JavaScript, HTML, and CSS.

## Key Commands

```bash
python3 -m json.tool manifest.json >/dev/null
node --check background.js
node --check content.js
```

## Current Decisions

- No framework or bundler by default.
- Use packaged code and assets only.
- Keep compliance notes in `docs/COMPLIANCE.md`.
