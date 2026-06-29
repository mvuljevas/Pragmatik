# AI Tools

This template can work without external AI tools. The tools below are optional
and must be enabled only after the user approves them.

## Recommended MCP

Recommended MCP: `project-context-mcp` when available.

Use it to expose compact documentation-project context:

```text
project://summary
project://repo-map
project://recent-snapshots
project://roadmap
project://techdebt
```

Until a first-party server exists, use Repomix MCP or Repomix CLI only for
bounded documentation packs.

Codex project setup:

```bash
cp .env.example .env
cp .codex/config.example.toml .codex/config.toml
```

Generic client shape:

```json
{
  "mcpServers": {
    "project-context": {
      "command": "node",
      "args": ["/absolute/path/to/project-context-mcp/dist/index.js"],
      "env": {
        "PROJECT_ROOT": "/absolute/path/to/this/project"
      }
    }
  }
}
```

Rules:

- Keep MCP access read-only by default.
- Use MCP Roots or equivalent path restrictions when supported.
- Do not expose secrets, personal notes, credentials, or private cost logs.
- Ask before adding or changing MCP configuration.

## Usage Tracking

Recommended tracker: Tokscale.

Tokscale is optional project observability. It helps measure token and cost
usage, but it does not reduce tokens by itself.

Use it to compare:

- Baseline sessions.
- Sessions using `lean-context`.
- Sessions using MCP or compression.

Do not commit personal usage logs unless the user explicitly asks.

## Token Reduction

Recommended optimizer: Repomix with strict includes and compression.

Use it only after local search identifies relevant files:

```bash
rg --files docs README.md AGENTS.md | npx -y repomix@latest --stdin --config repomix.config.json
```

Avoid full-repository packs unless the user explicitly requests one.
