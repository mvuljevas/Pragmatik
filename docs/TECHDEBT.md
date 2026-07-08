# Technical Debt

Track accepted shortcuts, risks, and cleanup items for this repository on the
[Pragmatik Project Board](https://github.com/users/mvuljevas/projects/8).

## Open

| ID | Priority | Area | Debt | Impact | Planned Resolution | GitHub |
| --- | --- | --- | --- | --- | --- | --- |
| TD-008 | High | Dashboard | `pragmatik dashboard` does not yet provide a real Pragmatik dashboard UI. | Users expect a visual dashboard for usage, tooling, coverage, and optimization but only status/report commands are available. | Design and implement a real local dashboard or remove the command until it exists. | [#10](https://github.com/mvuljevas/pragmatik/issues/10) |

## Resolved

| ID | Priority | Area | Debt | Resolution |
| --- | --- | --- | --- | --- |
| TD-000 | Medium | GitHub | Technical debt automation needed a root `TECHDEBT.md` source. | Added this file and linked open debt to GitHub issues and Project cards. |
| TD-001 | Medium | MCP | `project-context-mcp` was documented but not implemented. | Resolved in v0.3.0 by implementing a fully compliant stdio-based JSON-RPC 2.0 MCP server generated via CLI. |
| TD-002 | Medium | Docs | The catalog had to be kept synchronized manually when templates or presets changed. | Resolved in v0.3.0 by adding `scripts/check-catalog.js` automated check which enforces synchronization during testing. |
| TD-003 | High | AI Context | `lean-context` had no automated way to prove token savings. | Resolved in v0.3.0 by adding `measure-pair` command to `scripts/ai-tools.sh` which compares baseline vs `lean-context` and appends reports. |
| TD-004 | High | Packaging | `@mvuljevas/pragmatik` was not validated from a clean external install. | Verified npm publish of `@mvuljevas/pragmatik@0.3.0` and tested successful global install. |
| TD-005 | Medium | Versioning | Version drift was possible between files. | Added `scripts/check-versions.js` consistency test automated inside package.json `"test"` script. |
| TD-006 | Low | Packaging | `package-lock.json` policy was undecided for this npm package repository. | Root `package-lock.json` is ignored while the package has no dependencies; template projects may include lockfiles when their stack benefits from reproducible application installs. |
| TD-007 | High | Packaging | The desired unscoped npm package name `agents` was already taken. | Renamed the project to Pragmatik (`@mvuljevas/pragmatik` / `pragmatik`). |
