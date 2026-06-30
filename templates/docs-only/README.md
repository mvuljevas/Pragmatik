# Documentation Project

This template is for documentation, workflow, planning, and governance
repositories.

It includes the AGENTS workflow, `lean-context`, snapshots, roadmap, technical
debt tracking, and GitHub workflow guidance without application code.

## Start

```text
Analyze this repository.
```

The agent should read `AGENTS.md`, `docs/AI_CONTEXT.md`, and recent snapshots,
then ask what should be built or documented next.

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
- [Roadmap](docs/ROADMAP.md)
- [Snapshots](docs/SNAPSHOTS.md)
- [Technical Debt](docs/TECHDEBT.md)

## Version

The authoritative version source is `VERSION`.
