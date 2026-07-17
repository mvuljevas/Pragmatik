# AI Measurement

Use this workflow to compare the same task across two matching runs: one
baseline run and one `lean-context` run.

## Local Mode File

Since `.agents.env` is versioned directly in the repository, you only need to copy the local log file template:

```bash
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

## Repeatable Local Pair

Use the paired automation when you want a clean local comparison appended to
`docs/AI_USAGE_REPORT.md` without hand-editing:

```bash
AGENTS_MEASUREMENT_PAIR_ID=issue-5-adoption-001 \
AGENTS_MEASUREMENT_TASK="Run the same adoption prompt in both modes" \
bash scripts/ai-tools.sh measure-pair
```

The command runs two profiles with matching labels:

- `AGENTS_CONTEXT_MODE=baseline`
- `AGENTS_CONTEXT_MODE=lean-context`

It stores raw outputs under `.ai-runs/<pair>-baseline/` and
`.ai-runs/<pair>-lean-context/`, keeps Tokscale submission off by default, and
appends a comparison section to `docs/AI_USAGE_REPORT.md`.

Default paired-measurement flags:

```text
AGENTS_MEASUREMENT_CONTEXT7=off
AGENTS_MEASUREMENT_REPOMIX=on
AGENTS_MEASUREMENT_TOKSCALE=on
AGENTS_MEASUREMENT_TOKSCALE_SUBMIT=off
AGENTS_MEASUREMENT_USAGE_REPORT=on
```

Set any of those values in `.agents.env` or as process-level overrides when a
specific experiment needs different tool coverage.

## Two-Repository A/B Setup

1. Create two identical repositories from the same template or same commit.
2. In repository A, set `AGENTS_CONTEXT_MODE=baseline`.
3. In repository B, set `AGENTS_CONTEXT_MODE=lean-context`.
4. Use the same prompt in both repositories.
5. Use Tokscale or the active client's usage report to capture token usage.
6. Run `bash scripts/ai-tools.sh measure-pair` when both sides should be
   summarized into the aggregate report, or run `bash scripts/ai-tools.sh run`
   separately in each repository.
7. Compare total tokens, output quality, repeated context, and time to useful
   result.

To automate active tools in each repository:

```bash
bash scripts/ai-tools.sh run
bash scripts/ai-tools.sh measure-pair
```

Set `AGENTS_USAGE_REPORT=on` to append an aggregate summary to
`docs/AI_USAGE_REPORT.md`. `measure-pair` sets report output on by default
unless `AGENTS_MEASUREMENT_USAGE_REPORT=off`.

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
