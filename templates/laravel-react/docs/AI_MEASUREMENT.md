# AI Measurement

Use this workflow to compare the same task across two identical repositories:
one baseline run and one `lean-context` run.

## Local Mode File

Copy the example file:

```bash
cp .agents.env.example .agents.env
cp .ai-usage-log.example.md .ai-usage-log.md
```

Then set:

```text
AGENTS_CONTEXT_MODE=baseline
```

or:

```text
AGENTS_CONTEXT_MODE=lean-context
```

`.agents.env` is for non-secret experiment flags only. Do not place API keys or
credentials in it.

## Modes

### baseline

The agent should simulate a normal repository analysis without optional
`lean-context` accelerators.

Expected behavior:

- Read only the minimum project docs needed to understand the task.
- Do not use Context7, Repomix, MCP servers, or context packs unless the user
  explicitly asks.
- Do not perform the AI tooling bootstrap flow.
- Record the run label and tool state when a local usage log exists.

### lean-context

The agent should use the normal template workflow.

Expected behavior:

- Read `AGENTS.md`, `docs/AI_CONTEXT.md`, recent snapshots, and targeted docs.
- Run the optional AI tooling check.
- Ask before enabling Context7, Repomix, Tokscale, MCP servers, or generated
  context packs.
- Record the run label and tool state when a local usage log exists.

## Recommended A/B Setup

1. Create two identical repositories from the same template.
2. In repository A, set `AGENTS_CONTEXT_MODE=baseline`.
3. In repository B, set `AGENTS_CONTEXT_MODE=lean-context`.
4. Use the same prompt in both repositories.
5. Use Tokscale or the active client's usage report to capture token usage.
6. Record results in `.ai-usage-log.md`.
7. Compare total tokens, output quality, repeated context, and time to useful
   result.

To automate active tools in each repository:

```bash
bash scripts/ai-tools.sh run
```

Set `AGENTS_USAGE_REPORT=on` to append an aggregate summary to
`docs/AI_USAGE_REPORT.md`.

For automatic iteration closure, install the versioned pre-commit hook:

```bash
bash scripts/ai-tools.sh install-hooks
```

Then set `AGENTS_AUTO_RUN_ON_COMMIT=on` in `.agents.env`. Each commit runs
`bash scripts/ai-tools.sh run-and-stage` before the commit is created, so the active
tool run and aggregate report are captured with the iteration.

Tokscale submit defaults to `dry-run` in reusable samples. Inspect `.ai-runs/<timestamp>/tokscale-submit.txt`, set `AGENTS_TOKSCALE_SUBMIT=on` only after confirming external submission, or use `off` for local-only measurement.

## Suggested Prompt

```text
Analiza el repo.
```

Then give the same implementation or planning task to both runs.

## Interpretation

- If `lean-context` uses fewer total tokens with similar or better output,
  preserve the preset behavior.
- If `lean-context` uses more initial tokens but avoids repeated context later,
  measure multi-step tasks before deciding.
- If `lean-context` increases total tokens without improving quality or speed,
  reduce the initial docs read set or defer optional tool checks.
