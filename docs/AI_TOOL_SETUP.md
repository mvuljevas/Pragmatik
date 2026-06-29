# AI Tool Setup

This repository supports optional AI tooling for current documentation lookup,
usage tracking, and bounded context packing.

These tools are opt-in. Do not configure external tools, API keys, telemetry, or
submission workflows without user approval.

## Local Secret Policy

- Store real keys only in ignored local files or the user's tool-specific secret
  store.
- Never commit `.env`, `.codex/config.toml`, personal usage logs, or generated
  token reports.
- Rotate any API key that was pasted into a chat, ticket, commit, or shared log.

## Context7

Use Context7 when the agent needs current framework, package, SDK, API, or CLI
documentation.

Recommended local setup for this repository:

```bash
cp .env.example .env
cp .codex/config.example.toml .codex/config.toml
```

Then edit the local files and set `CONTEXT7_API_KEY`.

Alternative setup through the Context7 CLI:

```bash
npx -y ctx7@latest setup --codex --mcp --project --stdio --api-key "<CONTEXT7_API_KEY>"
```

Validation:

```bash
CONTEXT7_API_KEY="<CONTEXT7_API_KEY>" \
  npx -y ctx7@latest docs /vitejs/vite "How to configure the dev server port?"
```

The Context7 setup may also install `.agents/skills/context7-mcp/SKILL.md`.
Keep the skill versioned when it contains reusable behavior, but never version a
file containing the real API key.

## Tokscale

Tokscale is usage observability. It can show local Codex usage and help compare
baseline sessions against `lean-context` sessions, but it does not reduce token
usage by itself.

Local commands:

```bash
npx -y tokscale@latest clients
npx -y tokscale@latest --client codex --today models
npx -y tokscale@latest --client codex --today report
```

Remote Tokscale login and submission are optional:

```bash
npx -y tokscale@latest login
npx -y tokscale@latest submit
```

Only run submission commands after the user approves sharing usage data.

## Repomix

Repomix is the default token-reduction tool for bounded repository context
packs. Use it after local search identifies relevant paths.

Example:

```bash
rg --files README.md AGENTS.md docs presets templates \
  | npx -y repomix@latest --stdin --config presets/lean-context/files/repomix.config.json
```

Use `--token-count-tree` or the configured token count tree before sharing large
context packs.

## MCP Tool Overhead

If many MCP servers are enabled, MCP tool descriptions can increase the prompt
input before the agent reads project files. Consider `mcp-compressor` or a tool
router only after measuring that MCP overhead is material.
