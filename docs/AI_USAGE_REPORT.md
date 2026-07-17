# AI Usage Report

This file records aggregate, non-sensitive AI usage observations for this
repository. Personal logs, raw transcripts, local dashboard data, API keys, and
tool credentials must stay out of version control.

## 2026-06-29 - Initial lean-context Measurement

Scope:

- Repository: Pragmatik.
- Local mode: `AGENTS_CONTEXT_MODE=lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
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
| Tokscale task report | `Work on Pragmatik`: 1 session, approximately 1.9M tokens, approximately $30.28. |
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

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

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

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

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

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

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

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

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

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

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

## 2026-06-29 - Automated AI Tool Run 20260629T234209Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex today.
- Tokscale submit: submitted: codex today.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 76,931 tokens, 304,558 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260629T234209Z/tokscale-report.txt` when enabled. |
| Tokscale submit | submitted: codex today. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260629T234209Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-29 - Automated AI Tool Run 20260629T234347Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex today.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 77,447 tokens, 306,584 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260629T234347Z/tokscale-report.txt` when enabled. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260629T234347Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T004027Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude today.
- Tokscale coverage: ok: see .ai-runs/20260630T004027Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync ok.
- Tokscale Antigravity sync: sync ok.
- Tokscale submit: submitted: codex,cursor,antigravity,claude today.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 86,994 tokens, 339,121 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T004027Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T004027Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync ok. |
| Tokscale Antigravity sync | sync ok. |
| Tokscale submit | submitted: codex,cursor,antigravity,claude today. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T004027Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T004219Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude today.
- Tokscale coverage: ok: see .ai-runs/20260630T004219Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 88,080 tokens, 342,993 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T004219Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T004219Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T004219Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T004338Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude today.
- Tokscale coverage: ok: see .ai-runs/20260630T004338Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 88,455 tokens, 344,337 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T004338Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T004338Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T004338Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T131524Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude today.
- Tokscale coverage: ok: see .ai-runs/20260630T131524Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 90,240 tokens, 352,456 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T131524Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T131524Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T131524Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T131631Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude today.
- Tokscale coverage: ok: see .ai-runs/20260630T131631Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 90,615 tokens, 353,800 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T131631Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T131631Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T131631Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T133614Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude today.
- Tokscale coverage: ok: see .ai-runs/20260630T133614Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 90,990 tokens, 355,144 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T133614Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T133614Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T133614Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T133828Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude today.
- Tokscale coverage: ok: see .ai-runs/20260630T133828Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 112 files, 91,667 tokens, 357,912 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T133828Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T133828Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T133828Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T152740Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260630T152740Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 118 files, 112,427 tokens, 435,400 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T152740Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T152740Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T152740Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T153154Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260630T153154Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 118 files, 113,121 tokens, 437,978 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T153154Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T153154Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T153154Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T184704Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260630T184704Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: failed: see .ai-runs/20260630T184704Z/repomix.err.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 134 files, 122,971 tokens, 480,334 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T184704Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T184704Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T184704Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T184901Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260630T184901Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 134 files, 123,630 tokens, 482,726 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T184901Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T184901Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T184901Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T195016Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260630T195016Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 134 files, 124,895 tokens, 487,854 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T195016Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T195016Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T195016Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T203902Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260630T203902Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 134 files, 125,928 tokens, 491,948 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T203902Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T203902Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T203902Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-06-30 - Automated AI Tool Run 20260630T213252Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260630T213252Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 134 files, 126,880 tokens, 495,482 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260630T213252Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260630T213252Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260630T213252Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-07-01 - Automated AI Tool Run 20260701T022708Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260701T022708Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 134 files, 127,793 tokens, 499,170 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260701T022708Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260701T022708Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260701T022708Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-07-01 - Automated AI Tool Run 20260701T024315Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260701T024315Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 134 files, 131,967 tokens, 516,782 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260701T024315Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260701T024315Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260701T024315Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-07-01 - Automated AI Tool Run 20260701T025113Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260701T025113Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 134 files, 133,439 tokens, 522,695 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260701T025113Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260701T025113Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260701T025113Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-07-01 - Automated AI Tool Run 20260701T030052Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260701T030052Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 134 files, 135,739 tokens, 532,066 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260701T030052Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260701T030052Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260701T030052Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-07-01 - Automated AI Tool Run 20260701T034607Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260701T034607Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 78 files, 75,315 tokens, 308,594 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260701T034607Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260701T034607Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260701T034607Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-07-01 - Automated AI Tool Run 20260701T041721Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260701T041721Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 78 files, 77,430 tokens, 317,829 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260701T041721Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260701T041721Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260701T041721Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-07-01 - Automated AI Tool Run 20260701T043033Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260701T043033Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: skipped: off.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 78 files, 78,665 tokens, 322,866 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260701T043033Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260701T043033Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | skipped: off. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260701T043033Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.

## 2026-07-03 - Automated AI Tool Run 20260703T140008Z

Scope:

- Repository: Pragmatik.
- Context mode: `lean-context`.
- Experiment ID: `pragmatik-repo-token-measurement`.
- Experiment run: `lean-context-local-001`.
- Task: Configure Pragmatik repository for lean-context usage measurement.

Tool state:

- Context7: ok: /vitejs/vite.
- Tokscale: ok: codex,cursor,antigravity,claude,gemini,warp today.
- Tokscale coverage: ok: see .ai-runs/20260703T140008Z/tokscale-clients-before.txt.
- Tokscale Cursor sync: sync failed: Cursor not authenticated.
- Tokscale Antigravity sync: sync ok: no sessions detected.
- Tokscale Warp sync: sync failed: Warp not authenticated.
- Tokscale submit: submitted: codex,cursor,antigravity,claude,gemini,warp today.
- Repomix: ok.
- MCP: ask.

Measurements:

| Source | Result |
| --- | --- |
| Repomix bounded pack | 78 files, 82,864 tokens, 339,120 chars. |
| Tokscale local report | Generated locally at `.ai-runs/20260703T140008Z/tokscale-report.txt` when enabled. |
| Tokscale coverage scan | ok: see .ai-runs/20260703T140008Z/tokscale-clients-before.txt. |
| Tokscale Cursor sync | sync failed: Cursor not authenticated. |
| Tokscale Antigravity sync | sync ok: no sessions detected. |
| Tokscale Warp sync | sync failed: Warp not authenticated. |
| Tokscale submit | submitted: codex,cursor,antigravity,claude,gemini,warp today. |
| Context7 validation | ok: /vitejs/vite. |

Notes:

- Local raw outputs are stored under `.ai-runs/20260703T140008Z/` and remain ignored.
- Treat Tokscale grouping as approximate unless validated manually.
