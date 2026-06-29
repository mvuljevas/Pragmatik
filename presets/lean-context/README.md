# lean-context

`lean-context` is a reusable preset for AI-assisted projects that need to make
better use of limited AI quota.

The preset reduces waste by changing how agents load context:

1. Retrieve before reading.
2. Search before opening files.
3. Read slices before whole files.
4. Prefer project summaries, snapshots, symbols, and MCP resources over raw
   repository dumps.

## Levels

### Level 1: No MCP Required

Works in any editor, IDE, terminal agent, or chat interface.

- Use `docs/AI_CONTEXT.md` as the first compact project summary.
- Use `docs/AI_SEARCH.md` to search by stack and subsystem.
- Use `docs/AI_TOKEN_BUDGET.md` to keep context loading bounded.
- Use `.aiignore` and `.rgignore` to avoid generated files, dependencies,
  caches, secrets, and lockfiles by default.
- Keep snapshots concise so agents can recover state without rereading history.

### Level 2: Optional MCPs

Adds optional Model Context Protocol integrations for richer retrieval.

- Sourcegraph MCP for code intelligence and multi-repository retrieval.
- Context7 for current library documentation.
- CodeGraphContext or code graph style MCPs for symbol and relationship lookup.
- TOON MCP for compact structured context.
- A custom `project-context-mcp` for repository-specific summaries, snapshots,
  commands, and read-only search.

All MCPs are opt-in. Templates must work without them.

### Level 3: Observability and Compression

Adds visibility and compression tools when the user wants them.

- Token and cost tracking with tools such as Tokscale.
- Compact structured payloads with TOON.
- Controlled repository packaging with Repomix.
- Terse response modes such as Caveman Mode for output-token reduction.
- Tokenless/Tokless-style compression tools where the user has verified the
  tool and accepts the tradeoffs.

## Adoption

For a new template, copy or merge:

- `AGENTS.patch.md` into the template `AGENTS.md`.
- `docs/*` into the template `docs/`.
- `files/.aiignore` and `files/.rgignore` into the project root.
- `files/.env.example` and `files/.codex/config.example.toml` when the project
  wants optional local AI tool setup.
- `files/repomix.config.json` only when the project wants explicit repository
  packing support.

For an existing project, do not overwrite current workflow files. Add the lean
context documents incrementally, preserve existing conventions, then create an
adoption snapshot.

## Recommendation Before Adoption

Before downloading, copying, or applying a template, agents should recommend the
smallest useful template and preset combination based on the user's app idea.

Use `docs/RECOMMENDATION_FLOW.md` to decide:

- Which template fits the requested product.
- Whether the project is new or already in progress.
- Which presets are useful.
- Which MCP, compression, tracking, or GitHub workflow capabilities are
  optional.

## Language

Reusable technical documentation should be written in concise English. Spanish
phrases may appear as examples of prompts that agents should recognize, such as
`Analiza el repo.` or `¿Que vamos a construir hoy?`.

English often tokenizes more compactly than equivalent Spanish in common BPE
tokenizers, but token counts depend on model, wording, punctuation, and content
shape. Use tokenizer tools for exact counts when the difference matters.
