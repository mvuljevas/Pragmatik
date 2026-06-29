# AI Tools

This template can work without external AI tools. The tools below are optional
and must be enabled only after the user approves them.

## Recommended MCP

Recommended MCP: `project-context-mcp` when available.

Chrome extension projects are usually small enough that a compact local project
MCP is more useful than broad code packing.

Use it to expose:

```text
project://summary
project://repo-map
project://version
project://recent-snapshots
project://roadmap
project://techdebt
```

Generic client shape:

```bash
cp .env.example .env
cp .codex/config.example.toml .codex/config.toml
```

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

Optional documentation MCP: Context7 when the extension adds third-party
libraries or framework code.

Rules:

- Ask before adding or changing MCP configuration.
- Keep local MCP access read-only by default.
- Do not expose extension store credentials, `.env`, private keys, or personal
  usage logs.
- Verify Chrome Extension APIs against official docs when behavior is
  security-sensitive.

## Usage Tracking

Recommended tracker: Tokscale.

Tokscale is optional project observability. It helps measure token and cost
usage, but it does not reduce tokens by itself.

Use it to compare:

- Baseline implementation sessions.
- Sessions using `lean-context`.
- Sessions using project-context MCP.
- Sessions using Repomix compression.

Do not commit personal usage logs unless the user explicitly asks.

## Token Reduction

Recommended optimizer: Repomix with strict includes and compression.

Use it only for focused context packs:

```bash
rg --files manifest.json background.js content.js docs README.md AGENTS.md | npx -y repomix@latest --stdin --config repomix.config.json
```

Avoid full-repository packs by default.
