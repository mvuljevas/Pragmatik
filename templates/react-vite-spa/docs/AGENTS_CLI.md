# AGENTS CLI

`agents` is the project-governance command for AGENTS-based repositories.

The CLI is distributed as `@mvuljevas/agents` and can run as a project
dependency or through `npx`.

## Purpose

Use `agents` to inspect a repository, initialize AGENTS workflow files, adopt
AGENTS in an existing project, choose templates, start the local dashboard, and
scaffold optional AI tooling.

The CLI is designed to work in any project type. Node projects can install it
as a dev dependency. Laravel, PHP, documentation-only, Chrome extension, or
other projects can run it through `npx` without adding Node project artifacts.

## Commands

```bash
agents --help                         Show commands, common flows, safety rules, and detected state.
agents --doctor                       Inspect the current repository and print readiness checks.
agents --init [--dry-run] [--yes]     Prepare a new project with AGENTS workflow files.
agents --setup [--dry-run] [--yes]    Adopt AGENTS in an existing project without overwriting conventions.
agents --run -- <command>             Run a command with the AGENTS dashboard lifecycle.
agents --dashboard [--no-open]        Start the local dashboard.
agents --suggest --idea "..."         Recommend a template and preset from a project idea.
agents --mcp-create [--dry-run]       Scaffold a read-only project MCP.
```

## Safe Defaults

- Tools are optional.
- Existing repositories are changed only after preview and confirmation.
- Non-interactive setup prints a preview and requires `--yes` before writing.
- `npm run dev` is not replaced by default.
- `agents:dev` is the safe wrapper for dashboard plus the original dev command.
- Dashboard data is local unless a selected external tool is configured to
  submit data.
- Missing base files are created only when absent: `AGENTS.md`, `README.md`,
  `docs/AI_CONTEXT.md`, `docs/ROADMAP.md`, `docs/SNAPSHOTS.md`, and
  `docs/TECHDEBT.md`.

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

Projects without `package.json` should use:

```bash
npx -y @mvuljevas/agents --doctor
npx -y @mvuljevas/agents --setup
```

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

## Recommended Start

For a new project:

```bash
agents --init
```

For an existing project:

```bash
agents --doctor
agents --setup --dry-run
agents --setup
```

For template selection:

```bash
agents --suggest --idea "Laravel CRM with React"
```

## Error Handling

Errors should explain what failed and how to recover. Unsupported options point
back to `agents --help`. Setup does not write files from non-interactive shells
unless `--yes` is provided.
