# Technical Debt

Track accepted shortcuts, risks, and cleanup items for this repository on the
[Pragmatik Project Board](https://github.com/users/mvuljevas/projects/8).

## Open

| ID | Priority | Area | Debt | Impact | Planned Resolution | GitHub |
| --- | --- | --- | --- | --- | --- | --- |
| TD-009 | Low | Versioning | Version `0.3.2` was skipped in the release sequence. | The jump from `0.3.1` to `0.3.3` is unexplained in git history. Work that should have closed as `0.3.2` (global rename + bundled backend) was committed together as `0.3.3` across two rigs without an intermediate tag. | Accepted as-is. Document the gap here and in `SNAPSHOTS.md`. Do not rewrite history. | — |
| TD-011 | Medium | Backend | `scripts/ai-tools.sh` is a Bash backend that depends on Tokscale, Repomix, and Context7 as required tools. | Bash dependency limits portability; third-party tool dependency conflicts with Pragmatik's autonomy goal. The script cannot grow further without deepening these dependencies. | Freeze the script in v0.3.x. Migrate measurement and reporting logic to Node.js in v0.4.0. Move the script to `legacy/` and remove it from the default npm package in v1.0.0. | — |

## Resolved

| ID | Priority | Area | Debt | Resolution | GitHub |
| --- | --- | --- | --- | --- | --- |
| TD-010 | High | Measurement | Pragmatik depends on Tokscale for token usage measurement. | Resolved in v0.4.0 by building an autonomous local-first measurement layer: parses local transcripts, estimates tokens via character heuristics, and computes costs using built-in model pricing. | — |
| TD-000 | Medium | GitHub | Technical debt automation needed a root `TECHDEBT.md` source. | Added this file and linked open debt to GitHub issues and Project cards. | — |
| TD-001 | Medium | MCP | `project-context-mcp` was documented but not implemented. | Resolved in v0.3.0 by implementing a fully compliant stdio-based JSON-RPC 2.0 MCP server generated via CLI. | [#2](https://github.com/mvuljevas/Pragmatik/issues/2) |
| TD-002 | Medium | Docs | The catalog had to be kept synchronized manually when templates or presets changed. | Resolved in v0.3.0 by adding `scripts/check-catalog.js` automated check which enforces synchronization during testing. | [#4](https://github.com/mvuljevas/Pragmatik/issues/4) |
| TD-003 | High | AI Context | `lean-context` had no automated way to prove token savings. | Resolved in v0.3.0 by adding `measure-pair` command to `scripts/ai-tools.sh` which compares baseline vs `lean-context` and appends reports. | [#5](https://github.com/mvuljevas/Pragmatik/issues/5) |
| TD-004 | High | Packaging | `@mvuljevas/pragmatik` was not validated from a clean external install. | Verified npm publish of `@mvuljevas/pragmatik@0.3.0` and tested successful global install. | [#8](https://github.com/mvuljevas/Pragmatik/issues/8) |
| TD-005 | Medium | Versioning | Version drift was possible between files. | Added `scripts/check-versions.js` consistency test automated inside package.json `"test"` script. | [#7](https://github.com/mvuljevas/Pragmatik/issues/7) |
| TD-006 | Low | Packaging | `package-lock.json` policy was undecided for this npm package repository. | Root `package-lock.json` is ignored while the package has no dependencies; template projects may include lockfiles when their stack benefits from reproducible application installs. | — |
| TD-007 | High | Packaging | The originally desired unscoped npm package name was unavailable. | Renamed the project to Pragmatik (`@mvuljevas/pragmatik` / `pragmatik`). | [#9](https://github.com/mvuljevas/Pragmatik/issues/9) |
