# Custom MCP: project-context-mcp

`project-context-mcp` is a proposed read-only MCP server for projects generated
from AGENTS templates.

It is not required by this preset. It is a recommended implementation path when
the user wants consistent context retrieval across AI tools.

## Goals

- Expose compact project context before raw files.
- Respect `.aiignore`.
- Provide bounded repository search.
- Avoid leaking secrets.
- Work across editors and agents that support MCP.

## Resources

Recommended resources:

```text
project://summary
project://version
project://repo-map
project://recent-snapshots
project://techdebt
project://roadmap
project://commands
project://stack
```

Resource behavior:

- `project://summary`: content from `docs/AI_CONTEXT.md`.
- `project://version`: authoritative version source and current tag state.
- `project://repo-map`: compact file tree excluding ignored paths.
- `project://recent-snapshots`: newest entries from `docs/SNAPSHOTS.md`.
- `project://techdebt`: open or active debt from `docs/TECHDEBT.md`.
- `project://roadmap`: current milestones from `docs/ROADMAP.md`.
- `project://commands`: install, test, build, lint, and smoke commands.
- `project://stack`: detected stack and version-file policy.

## Tools

Recommended tools:

```text
search_text(query, paths?, max_results?)
search_files(pattern, max_results?)
read_slice(file, start_line, end_line)
list_symbols(file)
find_symbol(name, paths?, max_results?)
```

Tool behavior:

- `search_text`: wraps `rg` and returns bounded matches.
- `search_files`: returns paths only.
- `read_slice`: refuses ignored paths and caps line ranges.
- `list_symbols`: uses a local symbol index when available.
- `find_symbol`: searches symbol index before raw text.

## Security

- Read-only by default.
- No write, format, migration, shell execution, or network mutation tools.
- Deny `.env`, secret files, SSH keys, token stores, and credential folders.
- Deny dependency and generated folders by default.
- Require explicit user approval before expanding roots.
- Log denied paths without returning their contents.

## Implementation Notes

- Use MCP Roots to limit accessible directories when the client supports roots.
- Build the repo map from `rg --files`.
- Use `.aiignore` first, then `.gitignore`, then tool-specific ignore files.
- Cache symbol indexes locally, but never commit generated indexes unless the
  project explicitly wants them.
- Keep responses short and deterministic.
