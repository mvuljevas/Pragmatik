# AI Tools

This template can work without external AI tools. The tools below are optional
and must be enabled only after the user approves them.

## Recommended MCP

Recommended MCP: Context7 for React, Vite, browser API, and package
documentation.

Use Context7 when the agent needs current library documentation instead of
guessing from model memory.

Generic local MCP client shape:

```bash
cp .env.example .env
cp .codex/config.example.toml .codex/config.toml
```

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

Optional second MCP: `project-context-mcp` when available, for compact local
resources such as `project://summary`, `project://repo-map`, and
`project://recent-snapshots`.

Rules:

- Ask before adding or changing MCP configuration.
- Prefer package documentation MCPs before broad web searches.
- Keep local project MCPs read-only by default.
- Do not expose `.env`, build output, lockfiles, or personal usage logs.

## Usage Tracking

Recommended tracker: Tokscale.

Tokscale is optional project observability. It helps measure token and cost
usage, but it does not reduce tokens by itself.

Use it to compare:

- Baseline implementation sessions.
- Sessions using `lean-context`.
- Sessions using Context7 or project-context MCP.
- Sessions using Repomix compression.

Do not commit personal usage logs unless the user explicitly asks.

## Token Reduction

Recommended optimizer: Repomix with strict includes and compression.

Use it only for focused context packs:

```bash
rg --files src docs README.md AGENTS.md package.json | npx -y repomix@latest --stdin --config repomix.config.json
```

If the user enables many MCP servers, consider `mcp-compressor` or an MCP tool
router to reduce tool-description overhead. Measure before keeping it.
