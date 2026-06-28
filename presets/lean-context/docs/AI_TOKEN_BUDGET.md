# AI Token Budget

This document defines context-loading rules for agents.

## Budget Rules

- Do not read the whole repository by default.
- Do not paste large command outputs into the conversation.
- Do not open generated files, dependencies, caches, build artifacts, or
  lockfiles unless directly relevant.
- Do not inspect secrets or `.env` files unless the user explicitly asks and the
  task requires it.
- Prefer summaries, snapshots, symbols, and search results before source files.
- Prefer a narrow file slice over a full file.
- Stop searching once enough evidence exists to make a safe change or plan.

## Read Order

Default read order for analysis:

1. `README.md`
2. `AGENTS.md`
3. `docs/AI_CONTEXT.md`
4. Recent entries in `docs/SNAPSHOTS.md`
5. Version source for the stack
6. Search results from `docs/AI_SEARCH.md`
7. Targeted file slices

## Output Rules

- Summarize command results instead of quoting full output.
- Quote only short excerpts that are necessary for precision.
- Use links to files and line numbers when possible.
- Keep final answers focused on decisions, changes, validation, and next steps.

## Large Files

Before opening a large file:

```bash
wc -l path/to/file
rg "target-pattern" path/to/file
```

Then read only the relevant section.

## Language

Concise English is preferred for reusable technical instructions. It often uses
fewer tokens than equivalent Spanish in common tokenizers, but exact counts vary
by model and wording. Use a tokenizer when the difference matters.
