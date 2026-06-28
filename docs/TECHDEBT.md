# Technical Debt

Track accepted shortcuts, risks, and cleanup items for this repository.

## Open

| ID | Priority | Area | Debt | Impact | Planned Resolution | GitHub |
| --- | --- | --- | --- | --- | --- | --- |
| TD-001 | Medium | MCP | `project-context-mcp` is documented but not implemented. | Users cannot yet install a first-party context MCP from this repository. | Prototype a read-only MCP server with bounded resources and tools. | [#2](https://github.com/mvuljevas/AGENTS/issues/2) |
| TD-002 | Medium | Docs | The catalog must be kept synchronized manually when templates or presets change. | Agents may recommend stale options if the catalog drifts. | Maintain catalog updates in the same iteration as template or preset changes. | [#4](https://github.com/mvuljevas/AGENTS/issues/4) |
| TD-003 | High | AI Context | `lean-context` is behaviorally useful but does not yet prove token savings with real measurements. | Users may adopt extra docs and workflow steps without actually reducing AI token usage. | Add a lightweight measurement protocol and compare baseline vs `lean-context` sessions. | [#5](https://github.com/mvuljevas/AGENTS/issues/5) |

## Resolved

| ID | Priority | Area | Debt | Resolution |
| --- | --- | --- | --- | --- |
| TD-000 | Medium | GitHub | Technical debt automation needed a root `TECHDEBT.md` source. | Added this file and linked open debt to GitHub issues and Project cards. |
