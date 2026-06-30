# AGENTS CLI

`agents` is the project-governance command for AGENTS-based repositories.

The CLI is distributed as `@mvuljevas/agents` and can run as a project
dependency or through `npx`.

## Commands

```bash
agents --help
agents --init
agents --setup
agents --doctor
agents --run -- <command>
agents --dashboard
agents --suggest
agents --mcp-create
```

Flags are lowercase only. Uppercase variants are invalid.

## Safe Defaults

- Tools are optional.
- Existing repositories are changed only after preview and confirmation.
- `npm run dev` is not replaced by default.
- `agents:dev` is the safe wrapper for dashboard plus the original dev command.
- Dashboard data is local unless a selected external tool is configured to
  submit data.

## Recommended Scripts

When a project has `package.json`, `agents --setup` can add these scripts:

```json
{
  "scripts": {
    "agents": "agents --help",
    "agents:init": "agents --init",
    "agents:setup": "agents --setup",
    "agents:doctor": "agents --doctor",
    "agents:dashboard": "agents --dashboard",
    "agents:dev": "agents --run -- npm run dev"
  }
}
```

The wrapper keeps normal project scripts intact unless the user explicitly
approves a deeper integration.

## Dashboard

The dashboard starts with AGENTS-managed flows:

```bash
agents --dashboard
agents --run -- npm run dev
npm run agents:dev
```

It shows detected agents, tool status, usage reports, optimization reports,
estimated spend, optimized context size, baseline availability, and setup gaps.
Savings are only reported when comparable baseline and optimized runs exist.
