# AI Tool Registry

This registry lists tools Pragmatik can detect, recommend, or configure. No tool is
mandatory.

## Measurement And Cost

| Tool | Type | Status | Notes |
| --- | --- | --- | --- |
| Tokscale | Local and remote usage tracking | Stable | Tracks supported clients and can submit usage when configured. |
| OpenAI usage dashboard | Paid/platform | Account feature | Useful for Codex/OpenAI spend visibility. |
| Cursor Teams analytics | Paid/platform | Account feature | Useful for team usage and governance. |
| Claude Team/Enterprise or Max | Paid/platform | Account feature | Capacity and governance option, not a token optimizer by itself. |

## Optimization And Compression

| Tool | Type | Status | Notes |
| --- | --- | --- | --- |
| Tokless | Agent plugin optimizer | Stable | Optional global CLI for token-saving plugins. |
| Repomix | Context packaging | Stable | Recommended local-safe default for bounded repo context. |
| mcp-compressor | MCP optimization | Optional | Consider only after measuring MCP overhead. |
| token-optimizer-mcp | MCP optimization | Experimental | Verify behavior before enabling. |
| mcp-compression-proxy | MCP proxy | Experimental | Verify behavior before enabling. |
| Token Optimizer | Prompt/context optimizer | Experimental | Verify maturity before enabling. |
| squeez | Compression utility | Experimental | Verify maturity before enabling. |

## Context And Retrieval

| Tool | Type | Status | Notes |
| --- | --- | --- | --- |
| Context7 | Current documentation | Stable | Useful for framework, SDK, API, and CLI docs. |
| Sourcegraph Cody Enterprise | Paid code intelligence | Paid | Useful for organization-scale code context. |
| CodeGraph or CodeGraphContext | Code graph retrieval | Optional | Useful when symbol relationships are available. |

## Adapter Contract

Each Pragmatik tool adapter should expose:

- `detect`: determine local availability without mutation.
- `install`: print or run install steps after confirmation.
- `auth`: guide login or token setup without committing secrets.
- `configure`: preview and write local config only after confirmation.
- `run`: execute the enabled tool.
- `status`: return dashboard-ready state.
- `rollback`: explain how to undo local changes.
