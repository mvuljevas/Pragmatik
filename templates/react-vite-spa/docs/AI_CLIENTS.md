# AI Clients

This project can be used with multiple AI agents and IDEs. Prefer the same
workflow everywhere: analyze first, ask before enabling tools, keep secrets
local, and measure before claiming token savings.

## Client Matrix

| Client | Preferred Setup | Notes |
| --- | --- | --- |
| Codex | `.codex/config.toml` from `.codex/config.example.toml` | Project-scoped MCP config. Restart or reload the session after setup. |
| Cursor | `.cursor/mcp.json` from `.cursor/mcp.example.json` or Context7 CLI setup | Use project MCP config when possible. |
| Claude Code | `.mcp.json` from `.mcp.example.json` or Context7 CLI setup | Keep real keys out of committed files. |
| Gemini CLI | Context7 CLI setup | Prefer CLI setup because config shape may vary by Gemini version. |
| Antigravity | Context7 CLI setup | Context7 can install Antigravity-oriented skills. |
| OpenCode | Context7 CLI setup | Use MCP when supported; otherwise use CLI tools. |
| DeepSeek local | Repomix CLI output | Use bounded `repomix-output.md`; MCP support depends on the wrapper. |
| Ollama local | Repomix CLI output | Use bounded `repomix-output.md`; MCP support depends on the wrapper. |

## Context7 Bootstrap

Context7 supports setup for several AI coding clients:

```bash
npx -y ctx7@latest setup --codex --mcp --project --stdio --api-key "<CONTEXT7_API_KEY>"
npx -y ctx7@latest setup --cursor --mcp --project --stdio --api-key "<CONTEXT7_API_KEY>"
npx -y ctx7@latest setup --claude --mcp --project --stdio --api-key "<CONTEXT7_API_KEY>"
npx -y ctx7@latest setup --gemini --mcp --project --stdio --api-key "<CONTEXT7_API_KEY>"
npx -y ctx7@latest setup --antigravity --mcp --project --stdio --api-key "<CONTEXT7_API_KEY>"
npx -y ctx7@latest setup --opencode --mcp --project --stdio --api-key "<CONTEXT7_API_KEY>"
```

Use only the command for the client's current tool. Do not run all setup
commands unless the user explicitly wants all clients configured.

For clients without MCP support, use Context7 CLI directly:

```bash
CONTEXT7_API_KEY="<CONTEXT7_API_KEY>" \
  npx -y ctx7@latest docs /vitejs/vite "How do I configure the dev server?"
```

## Tokscale Bootstrap

Tokscale can read local usage from supported clients and can help compare
baseline sessions against `lean-context` sessions.

```bash
npx -y tokscale@latest clients
npx -y tokscale@latest --client codex --today models
npx -y tokscale@latest --client codex --today report
```

Change `--client codex` to the active client when Tokscale supports it.
Use `npx -y tokscale@latest clients` to verify local coverage before assuming a
new agent or IDE is being measured. A supported client with `0` readable
messages is not actually covered until its local cache or integration has been
configured.

Do not run upload or social sharing commands unless the user approves:

```bash
npx -y tokscale@latest login
npx -y tokscale@latest submit --client codex --today --dry-run
npx -y tokscale@latest submit --client codex --today
```

Templates use `AGENTS_TOKSCALE_SUBMIT=off` by default. Project owners may set
`dry-run` first, then `on` after confirming what will be uploaded.

Long-running sessions are measured from the client's local usage data at the
time Tokscale runs. The commit hook captures what is visible at commit time; for
ongoing terminals, run `scripts/ai-tools.sh run` manually when a measurement
checkpoint is needed.

## Repomix Bootstrap

Use Repomix CLI for all clients, including local models:

```bash
rg --files README.md AGENTS.md docs src app routes tests package.json composer.json manifest.json \
  | npx -y repomix@latest --stdin --config repomix.config.json
```

Use Repomix MCP only when the client supports MCP and the user approves:

```json
{
  "mcpServers": {
    "repomix": {
      "command": "npx",
      "args": ["-y", "repomix@latest", "--mcp"]
    }
  }
}
```

## Analysis-Time Tool Check

When the user asks the agent to analyze the repository, the agent should:

1. Check `.agents.env` when present.
2. If `AGENTS_CONTEXT_MODE=baseline`, report that optional tool setup is
   disabled for this measurement run.
3. Read `docs/AI_TOOLS.md`, `docs/AI_CLIENTS.md`, and `docs/AI_TOOL_SETUP.md`
   when present.
4. Detect the active client when possible.
5. Check whether local example files exist for MCP and environment setup.
6. Report which tools are available, missing, or require restart/login.
7. Ask before writing secrets, enabling MCP servers, generating packs, or
   submitting usage data.
8. Offer a minimal setup path for the detected client.

The agent should not block project work if optional AI tooling is not configured.
