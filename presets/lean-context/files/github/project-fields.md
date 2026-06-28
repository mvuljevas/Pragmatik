# GitHub Project Fields

Use these fields for GitHub Projects linked to AGENTS templates.

## Required Fields

| Field | Type | Values |
| --- | --- | --- |
| Status | Single select | Triage, Ready, In Progress, Blocked, Done |
| Priority | Single select | High, Medium, Low |
| Type | Single select | Feature, Bug, Docs, Tech Debt, Security, Chore |
| Area | Single select | Workflow, Docs, Template, GitHub, MCP |
| Target Version | Text | `vX.Y.Z` |

## Recommended Views

- Roadmap by Target Version.
- Board by Status.
- Debt by Priority.
- AI Work by `ai:*` labels.

## Usage Rules

- Do not create a GitHub Project without user approval.
- Keep project fields simple enough to maintain manually.
- Link technical debt issues when the user approves debt automation.
- Use issues as the durable source of work; use snapshots as project memory.
