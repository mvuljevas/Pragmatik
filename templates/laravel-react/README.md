# Laravel React

This template is for Laravel applications with a React-capable frontend, such as
Inertia, Vite-powered React islands, or Laravel applications that plan to add
React surfaces.

It is a workflow and documentation foundation, not a full Laravel application
distribution. Apply it to a new Laravel project after running the Laravel
installer, or adopt it incrementally in an existing Laravel repository.

## Recommended Start

```bash
composer create-project laravel/laravel app-name
cd app-name
```

Then copy this template's documentation and workflow files into the project.

## Verification Commands

```bash
composer test
npm run build
```

## Version

Use the existing project version source when one exists. Otherwise use `VERSION`.

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
