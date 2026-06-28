# Interactive Start

This document defines how agents should start work in new and existing projects
that use `lean-context`.

## Recognized Analysis Prompts

Treat these as equivalent repository-analysis requests:

```text
Analiza el repo.
Analyze this repository.
Review the project structure.
Inspect the repo and tell me where we are.
What is the current state of this project?
Audit the repository setup.
Read the docs and summarize the current state.
```

## New Project Flow

When a project appears to be newly generated from a template:

1. Read `README.md`, `AGENTS.md`, `docs/AI_CONTEXT.md`, and recent snapshots.
2. Inspect git state and authoritative version source.
3. Identify stack, commands, and workflow documents.
4. Summarize the project state.
5. Ask:

```text
¿Que vamos a construir hoy?
What are we building today?
What should we work on next?
```

Then ask whether GitHub project management should be linked:

```text
Does this repository already have a GitHub Project? Should I create or link one?
```

If the user accepts, prepare labels, project fields, and initial issues before
implementation work starts.

## Pre-Download Recommendation Flow

When the user describes an application before a template has been downloaded or
copied, the agent should recommend a template and preset combination first.

Use `RECOMMENDATION_FLOW.md` to produce:

- One primary template.
- Recommended presets.
- A short rationale.
- Optional capabilities such as MCPs, compression, usage tracking, labels, and
  GitHub Projects.
- Questions that must be answered before applying anything.

Do not download, copy, or apply template files until the user approves the
recommendation.

## Existing Project Flow

When a project already has code or documentation:

1. Detect stack, existing docs, version source, issues, labels, and GitHub
   Project state when available.
2. Preserve existing conventions unless the user explicitly asks to replace
   them.
3. Propose an incremental adoption path.
4. Ask whether existing logs, roadmap notes, or debt should be migrated to
   `docs/SNAPSHOTS.md`, `docs/TECHDEBT.md`, and GitHub issues.
5. If technical debt exists, propose converting it into labeled issues linked
   to the GitHub Project.

## Do Not Assume

- Do not create GitHub Projects without user approval.
- Do not create issues from technical debt without user approval.
- Do not overwrite existing docs without mapping old content.
- Do not push commits or tags without explicit approval.

## Iteration Close

Every iteration should end with the next logical step.

Use `docs/ROADMAP.md` first. If it is missing or not actionable, use
`docs/TECHDEBT.md`. If neither provides a clear next action, ask the user how
they would like to proceed.
