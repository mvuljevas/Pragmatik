# AI Compression

Compression tools can reduce context size, but they do not replace disciplined
retrieval.

Use compression only after deciding what context is relevant.

## TOON

TOON is useful for compact structured data, especially repeated objects and
tables that would be verbose as JSON.

Recommended use:

- Issue lists.
- Label inventories.
- Snapshot summaries.
- Repeated records with shared fields.

Avoid TOON when exact JSON compatibility is required.

Reference: https://github.com/aj-geddes/toon

## Repomix

Repomix can package repository context for AI tools. Use it only with strict
include and ignore rules.

Recommended use:

- Small documentation packs.
- Focused subsystem reviews.
- Sharing a bounded context package outside the local environment.

Avoid full-repository packs by default.

Reference: https://repomix.com/

## Caveman Mode

Caveman Mode means asking the agent to respond tersely and skip nonessential
prose.

Recommended use:

- Status updates.
- Repeated implementation loops.
- Low-risk confirmations.

Do not use it for requirements discovery, legal/security decisions, migration
plans, or user-facing documentation drafts.

## Tokenless / Tokless-Style Tools

Tokenless or Tokless-style compression tools may be useful when the user has
verified the implementation and accepts the tradeoffs.

Recommended policy:

- Treat as optional.
- Test on non-sensitive context first.
- Compare compressed output against source for lost constraints.
- Do not compress secrets or credentials.
- Do not rely on compressed context as the only source for high-risk changes.

## Compression Rule

Compress after filtering, not before.

The preferred sequence is:

1. Ignore irrelevant paths.
2. Search locally.
3. Select the smallest relevant context.
4. Summarize or encode only that context.
