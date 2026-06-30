# AI Tool Setup

This repository supports AI tooling for current documentation lookup, usage
tracking, bounded context packing, local optimization reporting, and a local
AGENTS dashboard.

The preferred interface is the `agents` CLI. Tools remain optional: credentials,
browser login, MCP mutation, package installation, and machine-wide setup still
require explicit user action.

## Trigger During Repository Analysis

When a user starts with an analysis prompt such as `Analiza el repo.`, the agent
should include an AI tooling check after reading the project docs:

1. Check `.agents.env` when present.
2. If `AGENTS_CONTEXT_MODE=baseline`, report that optional AI tooling is
   disabled for measurement and skip setup.
3. Read `docs/AI_TOOLS.md`, `docs/AI_CLIENTS.md`, and this file when present.
4. Detect the active client when possible.
5. Run `agents --doctor` when the CLI is available; otherwise run
   `bash scripts/ai-tools.sh check` when present.
6. Report whether Context7, Tokscale, Repomix CLI, MCP examples, global
   `tokscale`, Tokscale login, and selected client syncs are available.
7. Offer `agents --setup` when setup is missing. Fall back to
   `bash scripts/ai-tools.sh setup-machine` for compatibility.
8. Ask before writing local config, adding secrets, starting MCP servers,
   logging in, or changing machine-wide client integrations.
9. Continue normal project analysis even when optional tooling is missing.

## Measurement Mode

Use `.agents.env` for non-secret experiment flags:

```bash
cp .agents.env.example .agents.env
cp .ai-usage-log.example.md .ai-usage-log.md
```

Supported modes:

- `AGENTS_CONTEXT_MODE=baseline`: skip optional `lean-context` accelerators and
  AI tool bootstrap unless the user explicitly asks.
- `AGENTS_CONTEXT_MODE=lean-context`: use the normal template workflow, run the
  configured checks, and guide setup for missing tools.

See `docs/AI_MEASUREMENT.md` for the full A/B workflow.

## Automation

Use the AGENTS CLI for project setup and automation:

```bash
agents --doctor
agents --setup
agents --run
agents --dashboard
agents --suggest --idea "React PWA"
agents --mcp-create
```

The shell script remains as a compatibility backend:

```bash
bash scripts/ai-tools.sh check
bash scripts/ai-tools.sh setup-machine
bash scripts/ai-tools.sh run
bash scripts/ai-tools.sh dashboard
```

The script reads `.agents.env` and runs tools marked as `on`. The bundled defaults keep external tools optional; the setup wizard can preselect local-safe tools for confirmation.

Execution order:

1. Load `.agents.env`, `.env`, and process-level overrides.
2. Validate Context7 only when enabled.
3. Scan Tokscale client coverage and authentication state.
4. Run client-specific Tokscale sync steps for Cursor, Antigravity, and Warp
   when selected and enabled.
5. Generate Tokscale local reports for the selected clients.
6. Submit Tokscale data when `AGENTS_TOKSCALE_SUBMIT=dry-run`, validate without
   uploading when `dry-run`, or skip when `off`.
7. Export Tokscale graph data for local dashboard and optimization reporting.
8. Generate the bounded Repomix pack after tracking steps complete.
9. Write local run summaries, append the aggregate usage report, and append the
   optimization report.

This order favors measurement integrity: client caches are refreshed before
Tokscale reports, external submission happens only after the local report path
works, and Repomix runs near the end because it is the most repository-context
heavy step.

Supported flags:

```text
AGENTS_CONTEXT7=ask
AGENTS_REPOMIX=ask
AGENTS_TOKSCALE=ask
AGENTS_MCP=ask
AGENTS_TOKLESS=ask
AGENTS_DASHBOARD=on
AGENTS_DASHBOARD_AUTOSTART=on
AGENTS_DASHBOARD_WRAPPER_ONLY=on
AGENTS_TOKSCALE_CLIENTS=codex,cursor,antigravity,claude,gemini,warp
AGENTS_TOKSCALE_CURSOR_SYNC=on
AGENTS_TOKSCALE_ANTIGRAVITY_SYNC=on
AGENTS_TOKSCALE_WARP_SYNC=on
AGENTS_TOKSCALE_SUBMIT=dry-run
AGENTS_AUTO_RUN_ON_COMMIT=off
AGENTS_USAGE_REPORT=on
AGENTS_USAGE_REPORT_TARGET=docs/AI_USAGE_REPORT.md
AGENTS_OPTIMIZATION_REPORT=on
AGENTS_OPTIMIZATION_REPORT_TARGET=docs/AI_OPTIMIZATION_REPORT.md
```

Outputs:

- Raw local logs: `.ai-runs/<timestamp>/`.
- Optional aggregate report: `docs/AI_USAGE_REPORT.md`.
- Optional optimization report: `docs/AI_OPTIMIZATION_REPORT.md`.
- Optional AGENTS local config: `.agents/config.json`.
- Optional rollback notes: `.agents/ROLLBACK.md`.

Agents should run `bash scripts/ai-tools.sh run` at the end of an iteration when
tools are active. Raw logs remain ignored; only aggregate summaries should be
committed.

Prefer `agents --run` for new projects because it starts the AGENTS dashboard
and delegates to the compatibility backend when available.

## Commit Hook Automation

Use the repository hook when each committed iteration should automatically run
the active tools:

```bash
bash scripts/ai-tools.sh install-hooks
```

Then set this local flag:

```text
AGENTS_AUTO_RUN_ON_COMMIT=on
```

When enabled, `.githooks/pre-commit` runs:

```bash
bash scripts/ai-tools.sh run-and-stage
```

This executes active tools, writes raw outputs to `.ai-runs/`, appends the
aggregate usage report when enabled, and stages the report target. The hook does
not push commits, tags, reports, or raw logs.

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

The automation uses `npx -y tokscale@latest` internally so it works even when
the global `tokscale` command is not on the shell `PATH`. A global install is
still recommended for Warp, zsh, and day-to-day local dashboard access:

```bash
npm install -g tokscale
# or
bun install -g tokscale

command -v tokscale
tokscale --help
```

If Warp cannot find `tokscale`, check the shell path from inside Warp:

```bash
npm prefix -g
npm bin -g
echo "$PATH"
```

Local commands:

```bash
npx -y tokscale@latest clients
npx -y tokscale@latest whoami
npx -y tokscale@latest tui --today
npx -y tokscale@latest graph --client codex --today --output .ai-runs/tokscale-graph.json
npx -y tokscale@latest --client codex --today models
npx -y tokscale@latest --client codex --today report
```

Use `AGENTS_TOKSCALE_CLIENTS` for multi-client measurement:

```text
AGENTS_TOKSCALE_CLIENTS=codex,cursor,antigravity,claude,gemini,warp
```

The legacy `AGENTS_TOKSCALE_CLIENT` flag remains supported for single-client
setups. Prefer `AGENTS_TOKSCALE_CLIENTS` when users switch between agents.

Remote Tokscale login and submission are controlled by `AGENTS_TOKSCALE_SUBMIT`.
Templates default to `dry-run`; users can switch to `on` after confirming external submission:

```bash
npx -y tokscale@latest login
npx -y tokscale@latest submit --client codex --today --dry-run
npx -y tokscale@latest submit --client codex --today
```

Supported submit modes:

- `on`: submit usage data to the authenticated Tokscale account.
- `dry-run`: validate the upload set without submitting it.
- `off`: local reports only; nothing is uploaded.

If `whoami` reports that Tokscale is not logged in, run
`npx -y tokscale@latest login` or set `TOKSCALE_API_TOKEN` in a local ignored
secret store. Do not commit tokens.

Long-running terminal sessions do not need the hook to stay open. Tokscale reads
the supported client's local session data when the script runs, so the important
requirement is that the client writes usage data to a supported local location.
For commit-time automation, the hook captures the usage visible at commit time.
If a terminal session remains open for hours, run `bash scripts/ai-tools.sh run`
manually before comparing results or wait for the next iteration commit.

Coverage depends on the active client. Codex can be read through the `codex`
client. Cursor, Antigravity, Trae, Warp, Claude, Gemini, and other clients
should use the matching Tokscale client only when Tokscale reports support for
that client through:

```bash
npx -y tokscale@latest clients
```

When changing clients, update `AGENTS_TOKSCALE_CLIENTS` in `.agents.env`.
Some clients require their own cache or integration commands before Tokscale can
read complete usage data. Tokscale's local client scan reports whether a client
currently has readable messages.

Client-specific automation:

- Codex: local sessions are read from Codex session storage. Headless capture is
  supported by Tokscale for Codex CLI.
- Cursor: run `cursor agent login`, then
  `npx -y tokscale@latest cursor login` once, then enable
  `AGENTS_TOKSCALE_CURSOR_SYNC=on` to sync the Cursor API cache before reports.
- Warp: run `npx -y tokscale@latest warp login` once, then enable
  `AGENTS_TOKSCALE_WARP_SYNC=on` to sync Warp or Oz usage before reports.
- Antigravity: keep Antigravity running, then enable
  `AGENTS_TOKSCALE_ANTIGRAVITY_SYNC=on` to sync usage from running language
  servers before reports.
- Claude Code: Tokscale reads Claude Code JSONL transcripts when present.
  Claude Desktop chat storage is not equivalent coverage.
- Ollama: Tokscale does not expose an `ollama` client in the current CLI. Track
  Ollama through the calling agent if that agent writes supported local usage
  data, or use a separate observability layer.

## Local Dashboard And Optimization Report

Use Tokscale's built-in local TUI as the first dashboard:

```bash
npx -y tokscale@latest
npx -y tokscale@latest tui --today
bash scripts/ai-tools.sh dashboard
```

The repository automation also writes:

- `.ai-runs/<timestamp>/tokscale-graph.json`: local Tokscale graph export.
- `.ai-runs/<timestamp>/repomix-output.md`: bounded context pack.
- `docs/AI_USAGE_REPORT.md`: aggregate usage observations.
- `docs/AI_OPTIMIZATION_REPORT.md`: measured tokens, bounded context size,
  client coverage, and savings notes.

Do not claim real savings unless a baseline run and optimized run exist for the
same task. Without a matched baseline, the optimization report should say that
savings are not yet available.

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
