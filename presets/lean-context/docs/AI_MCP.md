# AI MCP

Model Context Protocol servers are optional accelerators for context retrieval.
Templates must remain useful without MCP.

Official MCP concepts to understand:

- Resources expose contextual data to clients.
- Tools perform actions or queries.
- Roots limit the filesystem scope a server may access.

References:

- Model Context Protocol: https://modelcontextprotocol.io/
- MCP Resources: https://modelcontextprotocol.io/specification/2025-06-18/server/resources
- MCP Tools: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
- MCP Roots: https://modelcontextprotocol.io/specification/2025-06-18/client/roots

## Safety Defaults

- Prefer read-only servers first.
- Restrict filesystem access with MCP Roots when supported.
- Never expose `.env`, credentials, tokens, private keys, or secret stores.
- Exclude dependencies, generated files, caches, build output, and lockfiles by
  default.
- Bound tool output by lines, files, or tokens.
- Prefer resources such as summaries and repo maps before raw file reads.

## Recommended Optional MCPs

### Sourcegraph MCP

Use when a project benefits from code intelligence, cross-repository search, or
symbol-aware lookup.

Reference: https://sourcegraph.com/mcp

Recommended use:

- Large repositories.
- Multi-repository systems.
- Code navigation before reading source files.

### Context7

Use when agents need current library or framework documentation without pasting
large docs into the chat.

Reference: https://context7.com/

Recommended use:

- Framework APIs.
- Package documentation.
- Reducing repeated web searches for library usage.

### CodeGraphContext

Use for local code graph retrieval and relationship lookup when available.

Reference: https://github.com/CodeGraphContext/CodeGraphContext

Recommended use:

- Symbol relationships.
- Dependency impact checks.
- Local graph summaries before file reads.

### TOON MCP

Use for compact structured data when JSON would be too verbose.

Reference: https://github.com/aj-geddes/toon-context-mcp

Recommended use:

- Tables.
- Repeated object arrays.
- Compact structured snapshots.

## Custom MCP

For teams that want consistent retrieval across tools, implement
`project-context-mcp`. See `CUSTOM_MCP.md`.
