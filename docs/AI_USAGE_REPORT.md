# AI Usage Report

This file records aggregate, non-sensitive AI usage observations for this
repository. Personal logs, raw transcripts, local dashboard data, API keys, and
tool credentials must stay out of version control.

## 2026-06-29 - Initial lean-context Measurement

Scope:

- Repository: AGENTS.
- Local mode: `AGENTS_CONTEXT_MODE=lean-context`.
- Experiment ID: `agents-repo-token-measurement`.
- Run: `lean-context-local-001`.
- Client: Codex.

Local configuration:

- `.agents.env` configured locally and ignored.
- `.ai-usage-log.md` configured locally and ignored.
- `.env` configured locally for Context7 CLI use and ignored.
- `.codex/config.toml` remains ignored for Context7 MCP use.

Tool state:

- Context7: available through local CLI validation.
- Tokscale: available for local Codex usage reporting.
- Repomix: available for bounded context packs.
- MCP: Context7 local config exists; active MCP tools may require client reload.

Measurements:

| Source | Result |
| --- | --- |
| Tokscale task report | `Work on AGENTS`: 1 session, approximately 1.9M tokens, approximately $30.28. |
| Tokscale all local Codex report | 17 sessions, approximately 297.7M tokens, approximately $1668.33. |
| Repomix bounded repository pack | 106 files, 48,012 tokens, 200,871 characters, no suspicious files detected. |
| Context7 CLI validation | Successfully returned Vite documentation for a dev-server configuration query. |

Interpretation:

- Tokscale is useful for local observability, but task grouping is approximate
  and should not be treated as a precise per-repository invoice.
- Repomix gives a concrete context ceiling for the current repository: a broad
  bounded pack is about 48K tokens.
- This run establishes the first `lean-context` measurement point. It does not
  prove savings until compared with a matching baseline run.

Next measurement:

- Clone or copy the same repository state.
- Set `AGENTS_CONTEXT_MODE=baseline` in `.agents.env`.
- Run the same prompt and task.
- Compare Tokscale task totals, Repomix context size, repeated context, and
  output quality.

## 2026-06-29 - Automated AI Tool Run 20260629T165436Z

Scope:

- Repository: AGENTS.
- Context mode: `lean-context`.
- Experiment ID: `agents-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure AGENTS repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex today.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 64,376 tokens, 256,505 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260629T165436Z/tokscale-report.txt` when enabled. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260629T165436Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-29 - Automated AI Tool Run 20260629T172719Z

Scope:

- Repository: AGENTS.
- Context mode: `lean-context`.
- Experiment ID: `agents-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure AGENTS repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex today.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 68,181 tokens, 271,117 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260629T172719Z/tokscale-report.txt` when enabled. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260629T172719Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-29 - Automated AI Tool Run 20260629T232848Z

Scope:

- Repository: AGENTS.
- Context mode: `lean-context`.
- Experiment ID: `agents-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure AGENTS repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex today.
- Tokscale submit: submit failed: see .ai-runs/20260629T232848Z/tokscale-submit.err.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 74,713 tokens, 295,265 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260629T232848Z/tokscale-report.txt` when enabled. |
| Tokscale submit | submit failed: see .ai-runs/20260629T232848Z/tokscale-submit.err. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260629T232848Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-29 - Automated AI Tool Run 20260629T233122Z

Scope:

- Repository: AGENTS.
- Context mode: `lean-context`.
- Experiment ID: `agents-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure AGENTS repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex today.
- Tokscale submit: submit failed: not logged in.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 76,179 tokens, 301,889 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260629T233122Z/tokscale-report.txt` when enabled. |
| Tokscale submit | submit failed: not logged in. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260629T233122Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-29 - Automated AI Tool Run 20260629T233258Z

Scope:

- Repository: AGENTS.
- Context mode: `lean-context`.
- Experiment ID: `agents-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure AGENTS repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex today.
- Tokscale submit: submit failed: not logged in.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 76,675 tokens, 303,636 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260629T233258Z/tokscale-report.txt` when enabled. |
| Tokscale submit | submit failed: not logged in. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260629T233258Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.
