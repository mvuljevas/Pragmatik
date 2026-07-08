# Technical Debt

Track accepted shortcuts, risks, and cleanup items for this repository on the
[Pragmatik Project Board](https://github.com/users/mvuljevas/projects/8).

## Open

| ID | Priority | Area | Debt | Impact | Planned Resolution | GitHub |
| --- | --- | --- | --- | --- | --- | --- |
| TD-001 | Medium | MCP | `project-context-mcp` is documented but not implemented. | Users cannot yet install a first-party context MCP from this repository. | Prototype a read-only MCP server with bounded resources and tools. | [#2](https://github.com/mvuljevas/pragmatik/issues/2) |
| TD-002 | Medium | Docs | The catalog must be kept synchronized manually when templates or presets change. | Agents may recommend stale options if the catalog drifts. | Maintain catalog updates in the same iteration as template or preset changes. | [#4](https://github.com/mvuljevas/pragmatik/issues/4) |
| TD-003 | High | AI Context | `lean-context` is behaviorally useful but does not yet prove token savings with real measurements. | Users may adopt extra docs and workflow steps without actually reducing AI token usage. | Add a lightweight measurement protocol and compare baseline vs `lean-context` sessions. | [#5](https://github.com/mvuljevas/pragmatik/issues/5) |
| TD-004 | High | Packaging | `@mvuljevas/pragmatik` has not been validated from a clean external project install. | The CLI may work in this repository but fail when consumed as an npm dependency. | Test `npm pack` or local link from a clean project and document the verified install path. | [#8](https://github.com/mvuljevas/pragmatik/issues/8) |
| TD-005 | Medium | Versioning | Repository, package, and template versions are updated manually. | Version drift can happen between root `VERSION`, `package.json`, template files, snapshots, and tags. | Add a version consistency check for root and template version sources. | [#7](https://github.com/mvuljevas/pragmatik/issues/7) |
| TD-008 | High | Dashboard | `pragmatik dashboard` does not yet provide a real Pragmatik dashboard UI. | Users expect a visual dashboard for usage, tooling, coverage, and optimization but only status/report commands are available. | Design and implement a real local dashboard or remove the command until it exists. | [#10](https://github.com/mvuljevas/pragmatik/issues/10) |

## Resolved

| ID | Priority | Area | Debt | Resolution |
| --- | --- | --- | --- | --- |
| TD-000 | Medium | GitHub | Technical debt automation needed a root `TECHDEBT.md` source. | Added this file and linked open debt to GitHub issues and Project cards. |
| TD-006 | Low | Packaging | `package-lock.json` policy was undecided for this npm package repository. | Root `package-lock.json` is ignored while the package has no dependencies; template projects may include lockfiles when their stack benefits from reproducible application installs. |
| TD-007 | High | Packaging | The desired unscoped npm package name `agents` was already taken. | Renamed the project to Pragmatik (`@mvuljevas/pragmatik` / `pragmatik`). |
