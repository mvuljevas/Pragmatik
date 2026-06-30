# Chrome Extension Vanilla

This template is for Chrome extensions built with Manifest V3, vanilla
JavaScript, HTML, and CSS.

It avoids framework and bundler dependencies by default.

## Development

1. Open `chrome://extensions/`.
2. Enable Developer mode.
3. Load this folder as an unpacked extension.
4. Reload the extension after changing `manifest.json`, `background.js`, or
   `content.js`.

## Verification

```bash
python3 -m json.tool manifest.json >/dev/null
node --check background.js
node --check content.js
```

## Version

The authoritative version source is `manifest.json`.

## AGENTS CLI

This template includes `@mvuljevas/agents` as optional project tooling.

```bash
npm run agents:doctor
npm run agents:setup
npm run agents:dashboard
```

Use `agents:dev` only when the template defines an application dev command.

## Documentation

- [Agent rules](AGENTS.md)
- [AGENTS CLI](docs/AGENTS_CLI.md)
- [AI Clients](docs/AI_CLIENTS.md)
- [AI Context](docs/AI_CONTEXT.md)
- [AI Measurement](docs/AI_MEASUREMENT.md)
- [AI Optimization Report](docs/AI_OPTIMIZATION_REPORT.md)
- [AI Search](docs/AI_SEARCH.md)
- [AI Token Budget](docs/AI_TOKEN_BUDGET.md)
- [AI Tool Setup](docs/AI_TOOL_SETUP.md)
- [AI Tool Registry](docs/AI_TOOL_REGISTRY.md)
- [AI Tools](docs/AI_TOOLS.md)
- [Compliance](docs/COMPLIANCE.md)
- [Roadmap](docs/ROADMAP.md)
- [Snapshots](docs/SNAPSHOTS.md)
- [Technical Debt](docs/TECHDEBT.md)
