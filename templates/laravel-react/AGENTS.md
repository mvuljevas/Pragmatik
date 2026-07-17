# Agent Workflow

This template is an Pragmatik shell. It intentionally contains no application
runtime files.

## Start

When the user asks to analyze the repository:

1. Read `README.md`, `AGENTS.md`, `docs/AI_CONTEXT.md`, and recent snapshots.
2. Run `pragmatik doctor` when the CLI is available.
3. Identify whether this is a new project or an existing project adopting the
   template.
4. Summarize the current state.
5. Ask what the user wants to build or change next.

Recognize prompts such as:

```text
Analiza el repo.
Analyze this repository.
Review the project structure.
What is the current state of this project?
```

## Rules

- Do not generate application files until the user describes the project goal.
- Preview changes before writing files.
- Keep README, roadmap, snapshots, and technical debt updated.
- Use `docs/ROADMAP.md` for next steps, then `docs/TECHDEBT.md` as fallback.
- Do not push commits or tags without explicit approval.
