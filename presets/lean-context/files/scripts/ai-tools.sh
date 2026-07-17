#!/usr/bin/env bash
set -euo pipefail

COMMAND="${1:-run}"
ROOT_DIR="$(pwd)"
RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)"
RUN_DIR=".ai-runs/${RUN_ID}"
TOKSCALE_BIN=(npx -y tokscale@latest)

read_kv_file() {
  local file="$1"
  local key="$2"
  [ -f "$file" ] || return 1
  awk -F= -v k="$key" '
    $0 !~ /^[[:space:]]*#/ && $1 == k {
      sub(/^[^=]*=/, "", $0)
      print $0
      exit
    }
  ' "$file"
}

value_for() {
  local key="$1"
  local default_value="$2"
  local value="${!key:-}"

  local alt_key="$key"
  if [[ "$key" == AGENTS_* ]]; then
    alt_key="PRAGMATIK_${key#AGENTS_}"
    if [ -n "${!alt_key:-}" ]; then
      value="${!alt_key}"
    fi
  fi

  if [ -z "$value" ]; then
    value="$(read_kv_file ".pragmatik.env" "$key" 2>/dev/null || read_kv_file ".pragmatik.env" "$alt_key" 2>/dev/null || read_kv_file ".agents.env" "$key" 2>/dev/null || true)"
  fi
  if [ -z "$value" ]; then
    value="$(read_kv_file ".env" "$key" 2>/dev/null || read_kv_file ".env" "$alt_key" 2>/dev/null || true)"
  fi
  if [ -z "$value" ]; then
    value="$default_value"
  fi
  printf '%s' "$value"
}

strip_ansi() {
  perl -pe 's/\e\[[0-9;?]*[ -\/]*[@-~]//g'
}

bool_on() {
  [ "$1" = "on" ] || [ "$1" = "true" ] || [ "$1" = "1" ]
}

client_selected() {
  case ",$AGENTS_TOKSCALE_CLIENTS," in
    *",$1,"*|*,all,*) return 0 ;;
    *) return 1 ;;
  esac
}

print_config() {
  cat <<EOF
AI tool automation
- context mode: ${AGENTS_CONTEXT_MODE}
- Context7: ${AGENTS_CONTEXT7}
- Repomix: ${AGENTS_REPOMIX}
- Tokscale: ${AGENTS_TOKSCALE}
- Tokscale clients: ${AGENTS_TOKSCALE_CLIENTS}
- Tokscale Cursor sync: ${AGENTS_TOKSCALE_CURSOR_SYNC}
- Tokscale Antigravity sync: ${AGENTS_TOKSCALE_ANTIGRAVITY_SYNC}
- Tokscale Warp sync: ${AGENTS_TOKSCALE_WARP_SYNC}
- Tokscale submit: ${AGENTS_TOKSCALE_SUBMIT}
- MCP: ${AGENTS_MCP}
- auto run on commit: ${AGENTS_AUTO_RUN_ON_COMMIT}
- usage report: ${AGENTS_USAGE_REPORT}
- report target: ${AGENTS_USAGE_REPORT_TARGET}
- optimization report: ${AGENTS_OPTIMIZATION_REPORT}
- optimization report target: ${AGENTS_OPTIMIZATION_REPORT_TARGET}
EOF
}

tool_available() {
  command -v "$1" >/dev/null 2>&1
}

ensure_run_dir() {
  mkdir -p "$RUN_DIR"
}

reset_run_dir() {
  RUN_ID="$1"
  RUN_DIR=".ai-runs/${RUN_ID}"
}

run_tokscale_cmd() {
  "${TOKSCALE_BIN[@]}" "$@"
}

run_context7() {
  ensure_run_dir
  local key
  key="$(value_for CONTEXT7_API_KEY "")"
  if [ -z "$key" ]; then
    echo "Context7 skipped: CONTEXT7_API_KEY is not configured." | tee "$RUN_DIR/context7.log"
    CONTEXT7_STATUS="skipped: missing key"
    return 0
  fi

  local library query
  library="$(value_for AGENTS_CONTEXT7_TEST_LIBRARY "/vitejs/vite")"
  query="$(value_for AGENTS_CONTEXT7_TEST_QUERY "How to configure the dev server port?")"

  if CONTEXT7_API_KEY="$key" npx -y ctx7@latest docs "$library" "$query" --json > "$RUN_DIR/context7.json" 2> "$RUN_DIR/context7.err"; then
    CONTEXT7_STATUS="ok: ${library}"
  else
    CONTEXT7_STATUS="failed: see ${RUN_DIR}/context7.err"
  fi
}

run_tokscale() {
  ensure_run_dir
  local clients period
  clients="$AGENTS_TOKSCALE_CLIENTS"
  period="$(value_for AGENTS_TOKSCALE_PERIOD "today")"

  local period_arg=""
  case "$period" in
    today|yesterday|week|month) period_arg="--${period}" ;;
    *) period_arg="--today" ;;
  esac

  if run_tokscale_cmd clients > "$RUN_DIR/tokscale-clients-before.raw" 2> "$RUN_DIR/tokscale-clients-before.err"; then
    strip_ansi < "$RUN_DIR/tokscale-clients-before.raw" > "$RUN_DIR/tokscale-clients-before.txt"
    TOKSCALE_COVERAGE_STATUS="ok: see ${RUN_DIR}/tokscale-clients-before.txt"
  else
    strip_ansi < "$RUN_DIR/tokscale-clients-before.raw" > "$RUN_DIR/tokscale-clients-before.txt" 2>/dev/null || true
    TOKSCALE_COVERAGE_STATUS="failed: see ${RUN_DIR}/tokscale-clients-before.err"
  fi

  if client_selected "cursor"; then
    run_tokscale_cmd cursor status > "$RUN_DIR/tokscale-cursor-status.raw" 2> "$RUN_DIR/tokscale-cursor-status.err" || true
    strip_ansi < "$RUN_DIR/tokscale-cursor-status.raw" > "$RUN_DIR/tokscale-cursor-status.txt" 2>/dev/null || true
    if bool_on "$AGENTS_TOKSCALE_CURSOR_SYNC"; then
      if run_tokscale_cmd cursor sync > "$RUN_DIR/tokscale-cursor-sync.raw" 2> "$RUN_DIR/tokscale-cursor-sync.err"; then
        strip_ansi < "$RUN_DIR/tokscale-cursor-sync.raw" > "$RUN_DIR/tokscale-cursor-sync.txt"
        if grep -Eq "Sync failed|Not authenticated|No saved Cursor accounts" "$RUN_DIR/tokscale-cursor-sync.txt" "$RUN_DIR/tokscale-cursor-status.txt" 2>/dev/null; then
          TOKSCALE_CURSOR_STATUS="sync failed: Cursor not authenticated"
        else
          TOKSCALE_CURSOR_STATUS="sync ok"
        fi
      else
        strip_ansi < "$RUN_DIR/tokscale-cursor-sync.raw" > "$RUN_DIR/tokscale-cursor-sync.txt" 2>/dev/null || true
        TOKSCALE_CURSOR_STATUS="sync failed: see ${RUN_DIR}/tokscale-cursor-sync.err"
      fi
    else
      TOKSCALE_CURSOR_STATUS="sync skipped: ${AGENTS_TOKSCALE_CURSOR_SYNC}"
    fi
  else
    TOKSCALE_CURSOR_STATUS="not selected"
  fi

  if client_selected "antigravity"; then
    run_tokscale_cmd antigravity status > "$RUN_DIR/tokscale-antigravity-status.raw" 2> "$RUN_DIR/tokscale-antigravity-status.err" || true
    strip_ansi < "$RUN_DIR/tokscale-antigravity-status.raw" > "$RUN_DIR/tokscale-antigravity-status.txt" 2>/dev/null || true
    if bool_on "$AGENTS_TOKSCALE_ANTIGRAVITY_SYNC"; then
      if run_tokscale_cmd antigravity sync > "$RUN_DIR/tokscale-antigravity-sync.raw" 2> "$RUN_DIR/tokscale-antigravity-sync.err"; then
        strip_ansi < "$RUN_DIR/tokscale-antigravity-sync.raw" > "$RUN_DIR/tokscale-antigravity-sync.txt"
        if grep -Eq "cached sessions after sync:[[:space:]]+0|detected sessions:[[:space:]]+0" "$RUN_DIR/tokscale-antigravity-sync.txt" 2>/dev/null; then
          TOKSCALE_ANTIGRAVITY_STATUS="sync ok: no sessions detected"
        else
          TOKSCALE_ANTIGRAVITY_STATUS="sync ok"
        fi
      else
        strip_ansi < "$RUN_DIR/tokscale-antigravity-sync.raw" > "$RUN_DIR/tokscale-antigravity-sync.txt" 2>/dev/null || true
        TOKSCALE_ANTIGRAVITY_STATUS="sync failed: see ${RUN_DIR}/tokscale-antigravity-sync.err"
      fi
    else
      TOKSCALE_ANTIGRAVITY_STATUS="sync skipped: ${AGENTS_TOKSCALE_ANTIGRAVITY_SYNC}"
    fi
  else
    TOKSCALE_ANTIGRAVITY_STATUS="not selected"
  fi

  if client_selected "warp"; then
    run_tokscale_cmd warp status > "$RUN_DIR/tokscale-warp-status.raw" 2> "$RUN_DIR/tokscale-warp-status.err" || true
    strip_ansi < "$RUN_DIR/tokscale-warp-status.raw" > "$RUN_DIR/tokscale-warp-status.txt" 2>/dev/null || true
    if bool_on "$AGENTS_TOKSCALE_WARP_SYNC"; then
      if run_tokscale_cmd warp sync > "$RUN_DIR/tokscale-warp-sync.raw" 2> "$RUN_DIR/tokscale-warp-sync.err"; then
        strip_ansi < "$RUN_DIR/tokscale-warp-sync.raw" > "$RUN_DIR/tokscale-warp-sync.txt"
        if grep -Eq "not authenticated|No auth|missing|failed" "$RUN_DIR/tokscale-warp-sync.txt" "$RUN_DIR/tokscale-warp-status.txt" 2>/dev/null; then
          TOKSCALE_WARP_STATUS="sync failed: Warp not authenticated"
        else
          TOKSCALE_WARP_STATUS="sync ok"
        fi
      else
        strip_ansi < "$RUN_DIR/tokscale-warp-sync.raw" > "$RUN_DIR/tokscale-warp-sync.txt" 2>/dev/null || true
        TOKSCALE_WARP_STATUS="sync failed: see ${RUN_DIR}/tokscale-warp-sync.err"
      fi
    else
      TOKSCALE_WARP_STATUS="sync skipped: ${AGENTS_TOKSCALE_WARP_SYNC}"
    fi
  else
    TOKSCALE_WARP_STATUS="not selected"
  fi

  run_tokscale_cmd clients > "$RUN_DIR/tokscale-clients-after.raw" 2> "$RUN_DIR/tokscale-clients-after.err" || true
  strip_ansi < "$RUN_DIR/tokscale-clients-after.raw" > "$RUN_DIR/tokscale-clients-after.txt" 2>/dev/null || true

  run_tokscale_cmd graph --client "$clients" "$period_arg" --output "$RUN_DIR/tokscale-graph.json" > "$RUN_DIR/tokscale-graph.raw" 2> "$RUN_DIR/tokscale-graph.err" || true
  strip_ansi < "$RUN_DIR/tokscale-graph.raw" > "$RUN_DIR/tokscale-graph.txt" 2>/dev/null || true

  if run_tokscale_cmd --client "$clients" "$period_arg" report > "$RUN_DIR/tokscale-report.raw" 2> "$RUN_DIR/tokscale-report.err"; then
    strip_ansi < "$RUN_DIR/tokscale-report.raw" > "$RUN_DIR/tokscale-report.txt"
    TOKSCALE_STATUS="ok: ${clients} ${period}"
  else
    strip_ansi < "$RUN_DIR/tokscale-report.raw" > "$RUN_DIR/tokscale-report.txt" 2>/dev/null || true
    TOKSCALE_STATUS="failed: see ${RUN_DIR}/tokscale-report.err"
  fi

  run_tokscale_cmd --client "$clients" "$period_arg" models > "$RUN_DIR/tokscale-models.raw" 2> "$RUN_DIR/tokscale-models.err" || true
  strip_ansi < "$RUN_DIR/tokscale-models.raw" > "$RUN_DIR/tokscale-models.txt" 2>/dev/null || true

  case "$AGENTS_TOKSCALE_SUBMIT" in
    off|ask|"")
      TOKSCALE_SUBMIT_STATUS="skipped: ${AGENTS_TOKSCALE_SUBMIT}"
      ;;
    dry-run)
      if run_tokscale_cmd submit --client "$clients" "$period_arg" --dry-run > "$RUN_DIR/tokscale-submit.raw" 2> "$RUN_DIR/tokscale-submit.err"; then
        strip_ansi < "$RUN_DIR/tokscale-submit.raw" > "$RUN_DIR/tokscale-submit.txt"
        TOKSCALE_SUBMIT_STATUS="dry-run ok: ${clients} ${period}"
      else
        strip_ansi < "$RUN_DIR/tokscale-submit.raw" > "$RUN_DIR/tokscale-submit.txt" 2>/dev/null || true
        TOKSCALE_SUBMIT_STATUS="dry-run failed: see ${RUN_DIR}/tokscale-submit.err"
      fi
      ;;
    on|true|1)
      if run_tokscale_cmd whoami > "$RUN_DIR/tokscale-whoami.raw" 2> "$RUN_DIR/tokscale-whoami.err"; then
        strip_ansi < "$RUN_DIR/tokscale-whoami.raw" > "$RUN_DIR/tokscale-whoami.txt"
        if grep -q "Not logged in" "$RUN_DIR/tokscale-whoami.txt"; then
          TOKSCALE_SUBMIT_STATUS="submit failed: not logged in"
        elif run_tokscale_cmd submit --client "$clients" "$period_arg" > "$RUN_DIR/tokscale-submit.raw" 2> "$RUN_DIR/tokscale-submit.err"; then
          strip_ansi < "$RUN_DIR/tokscale-submit.raw" > "$RUN_DIR/tokscale-submit.txt"
          TOKSCALE_SUBMIT_STATUS="submitted: ${clients} ${period}"
        else
          strip_ansi < "$RUN_DIR/tokscale-submit.raw" > "$RUN_DIR/tokscale-submit.txt" 2>/dev/null || true
          TOKSCALE_SUBMIT_STATUS="submit failed: see ${RUN_DIR}/tokscale-submit.err"
        fi
      else
        strip_ansi < "$RUN_DIR/tokscale-whoami.raw" > "$RUN_DIR/tokscale-whoami.txt" 2>/dev/null || true
        TOKSCALE_SUBMIT_STATUS="submit failed: not logged in"
      fi
      ;;
    *)
      TOKSCALE_SUBMIT_STATUS="skipped: invalid mode ${AGENTS_TOKSCALE_SUBMIT}"
      ;;
  esac
}

repomix_config() {
  if [ -f "repomix.config.json" ]; then
    printf '%s' "repomix.config.json"
  elif [ -f "presets/lean-context/files/repomix.config.json" ]; then
    printf '%s' "presets/lean-context/files/repomix.config.json"
  else
    printf '%s' ""
  fi
}

repomix_file_list() {
  if [ -d "presets" ] || [ -d "templates" ]; then
    rg --files README.md AGENTS.md VERSION docs presets templates 2>/dev/null || true
  else
    rg --files README.md AGENTS.md VERSION docs src app routes resources tests package.json composer.json manifest.json 2>/dev/null || true
  fi
}

run_repomix() {
  ensure_run_dir
  local config
  config="$(repomix_config)"

  if [ -n "$config" ]; then
    if repomix_file_list | npx -y repomix@latest --stdin --config "$config" --output "$RUN_DIR/repomix-output.md" > "$RUN_DIR/repomix.log" 2> "$RUN_DIR/repomix.err"; then
      REPOMIX_STATUS="ok"
    else
      REPOMIX_STATUS="failed: see ${RUN_DIR}/repomix.err"
    fi
  else
    if repomix_file_list | npx -y repomix@latest --stdin --output "$RUN_DIR/repomix-output.md" > "$RUN_DIR/repomix.log" 2> "$RUN_DIR/repomix.err"; then
      REPOMIX_STATUS="ok"
    else
      REPOMIX_STATUS="failed: see ${RUN_DIR}/repomix.err"
    fi
  fi

  strip_ansi < "$RUN_DIR/repomix.log" > "$RUN_DIR/repomix.txt" 2>/dev/null || true
}

extract_repomix_metric() {
  local label="$1"
  local file="$RUN_DIR/repomix.txt"
  [ -f "$file" ] || return 0
  awk -F: -v label="$label" '$0 ~ label { gsub(/^[ \t]+|[ \t]+$/, "", $2); print $2; exit }' "$file"
}

extract_tokscale_summary() {
  local field="$1"
  local file="$RUN_DIR/tokscale-graph.json"
  [ -f "$file" ] || return 0
  python3 - "$file" "$field" <<'PY' 2>/dev/null || true
import json
import sys

path, field = sys.argv[1], sys.argv[2]
with open(path, "r", encoding="utf-8") as fh:
    data = json.load(fh)
value = data.get("summary", {}).get(field, "")
print(value)
PY
}

number_or_blank() {
  printf '%s' "$1" | tr -d ',[:space:]'
}

percent_delta() {
  local baseline="$1"
  local candidate="$2"
  python3 - "$baseline" "$candidate" <<'PY' 2>/dev/null || true
import sys

try:
    baseline = float(sys.argv[1])
    candidate = float(sys.argv[2])
except ValueError:
    sys.exit(0)

if baseline == 0:
    sys.exit(0)

delta = ((candidate - baseline) / baseline) * 100
sign = "+" if delta > 0 else ""
print(f"{sign}{delta:.1f}%")
PY
}

append_usage_report() {
  if ! bool_on "$AGENTS_USAGE_REPORT"; then
    return 0
  fi

  local target="$AGENTS_USAGE_REPORT_TARGET"
  mkdir -p "$(dirname "$target")"
  if [ ! -f "$target" ]; then
    cat > "$target" <<'EOF'
# AI Usage Report

This file records aggregate, non-sensitive AI usage observations for this
repository. Personal logs, raw transcripts, local dashboard data, API keys, and
tool credentials must stay out of version control.
EOF
  fi

  local total_files total_tokens total_chars
  total_files="$(extract_repomix_metric "Total Files")"
  total_tokens="$(extract_repomix_metric "Total Tokens")"
  total_chars="$(extract_repomix_metric "Total Chars")"

  {
    echo
    echo "## $(date -u +%Y-%m-%d) - Automated AI Tool Run ${RUN_ID}"
    echo
    echo "Scope:"
    echo
    echo "- Repository: $(basename "$ROOT_DIR")."
    echo "- Context mode: \`${AGENTS_CONTEXT_MODE}\`."
    echo "- Experiment ID: \`${AGENTS_EXPERIMENT_ID:-}\`."
    echo "- Experiment run: \`${AGENTS_EXPERIMENT_RUN:-$RUN_ID}\`."
    echo "- Task: ${AGENTS_EXPERIMENT_TASK:-unspecified}"
    echo
    echo "Tool state:"
    echo
    echo "- Context7: ${CONTEXT7_STATUS}."
    echo "- Tokscale: ${TOKSCALE_STATUS}."
    echo "- Tokscale coverage: ${TOKSCALE_COVERAGE_STATUS}."
    echo "- Tokscale Cursor sync: ${TOKSCALE_CURSOR_STATUS}."
    echo "- Tokscale Antigravity sync: ${TOKSCALE_ANTIGRAVITY_STATUS}."
    echo "- Tokscale Warp sync: ${TOKSCALE_WARP_STATUS}."
    echo "- Tokscale submit: ${TOKSCALE_SUBMIT_STATUS}."
    echo "- Repomix: ${REPOMIX_STATUS}."
    echo "- MCP: ${AGENTS_MCP}."
    echo
    echo "Measurements:"
    echo
    echo "| Source | Result |"
    echo "| --- | --- |"
    if [ -n "$total_tokens" ]; then
      echo "| Repomix bounded pack | ${total_files:-unknown files}, ${total_tokens}, ${total_chars:-unknown chars}. |"
    else
      echo "| Repomix bounded pack | Not available for this run. |"
    fi
    echo "| Tokscale local report | Generated locally at \`${RUN_DIR}/tokscale-report.txt\` when enabled. |"
    echo "| Tokscale coverage scan | ${TOKSCALE_COVERAGE_STATUS}. |"
    echo "| Tokscale Cursor sync | ${TOKSCALE_CURSOR_STATUS}. |"
    echo "| Tokscale Antigravity sync | ${TOKSCALE_ANTIGRAVITY_STATUS}. |"
    echo "| Tokscale Warp sync | ${TOKSCALE_WARP_STATUS}. |"
    echo "| Tokscale submit | ${TOKSCALE_SUBMIT_STATUS}. |"
    echo "| Context7 validation | ${CONTEXT7_STATUS}. |"
    echo
    echo "Notes:"
    echo
    echo "- Local raw outputs are stored under \`${RUN_DIR}/\` and remain ignored."
    echo "- Treat Tokscale grouping as approximate unless validated manually."
  } >> "$target"
}

append_measurement_comparison() {
  if ! bool_on "$AGENTS_USAGE_REPORT"; then
    return 0
  fi

  local target="$AGENTS_USAGE_REPORT_TARGET"
  mkdir -p "$(dirname "$target")"
  if [ ! -f "$target" ]; then
    cat > "$target" <<'EOF'
# AI Usage Report

This file records aggregate, non-sensitive AI usage observations for this
repository. Personal logs, raw transcripts, local dashboard data, API keys, and
tool credentials must stay out of version control.
EOF
  fi

  local pair_id="$1"
  local baseline_run="$2"
  local lean_run="$3"
  local baseline_dir="$4"
  local lean_dir="$5"
  local baseline_repomix_tokens="$6"
  local lean_repomix_tokens="$7"
  local baseline_tokscale_tokens="$8"
  local lean_tokscale_tokens="$9"
  local baseline_cost="${10}"
  local lean_cost="${11}"
  local task="${12}"

  local repomix_delta tokscale_delta cost_delta
  repomix_delta="$(percent_delta "$(number_or_blank "$baseline_repomix_tokens")" "$(number_or_blank "$lean_repomix_tokens")")"
  tokscale_delta="$(percent_delta "$(number_or_blank "$baseline_tokscale_tokens")" "$(number_or_blank "$lean_tokscale_tokens")")"
  cost_delta="$(percent_delta "$(number_or_blank "$baseline_cost")" "$(number_or_blank "$lean_cost")")"

  {
    echo
    echo "## $(date -u +%Y-%m-%d) - Baseline vs lean-context Measurement ${pair_id}"
    echo
    echo "Scope:"
    echo
    echo "- Repository: $(basename "$ROOT_DIR")."
    echo "- Experiment ID: \`${pair_id}\`."
    echo "- Task: ${task:-unspecified}"
    echo "- Baseline run: \`${baseline_run}\`."
    echo "- lean-context run: \`${lean_run}\`."
    echo
    echo "Measurements:"
    echo
    echo "| Metric | baseline | lean-context | Delta |"
    echo "| --- | --- | --- | --- |"
    echo "| Repomix bounded pack tokens | ${baseline_repomix_tokens:-not available} | ${lean_repomix_tokens:-not available} | ${repomix_delta:-not available} |"
    echo "| Tokscale measured tokens | ${baseline_tokscale_tokens:-not available} | ${lean_tokscale_tokens:-not available} | ${tokscale_delta:-not available} |"
    echo "| Tokscale measured cost | ${baseline_cost:-not available} | ${lean_cost:-not available} | ${cost_delta:-not available} |"
    echo
    echo "Run data:"
    echo
    echo "- Baseline raw outputs: \`${baseline_dir}/\`."
    echo "- lean-context raw outputs: \`${lean_dir}/\`."
    echo
    echo "Interpretation:"
    echo
    echo "- Treat Tokscale grouping as approximate unless validated manually."
    echo "- This automated comparison records available measurements; output quality and repeated-context behavior still require reviewer judgment."
  } >> "$target"
}

append_optimization_report() {
  if ! bool_on "$AGENTS_OPTIMIZATION_REPORT"; then
    return 0
  fi

  local target="$AGENTS_OPTIMIZATION_REPORT_TARGET"
  mkdir -p "$(dirname "$target")"
  if [ ! -f "$target" ]; then
    cat > "$target" <<'EOF'
# AI Optimization Report

This file records aggregate, non-sensitive optimization observations for this
repository. It combines Tokscale usage data, bounded Repomix context size, and
client coverage notes. Raw local logs stay under `.ai-runs/` and must not be
committed.

Real token savings must only be claimed after matched baseline and optimized
runs exist for the same task.
EOF
  fi

  local total_files total_tokens total_chars measured_tokens measured_cost
  total_files="$(extract_repomix_metric "Total Files")"
  total_tokens="$(extract_repomix_metric "Total Tokens")"
  total_chars="$(extract_repomix_metric "Total Chars")"
  measured_tokens="$(extract_tokscale_summary "totalTokens")"
  measured_cost="$(extract_tokscale_summary "totalCost")"

  {
    echo
    echo "## $(date -u +%Y-%m-%d) - Optimization Run ${RUN_ID}"
    echo
    echo "Measured usage:"
    echo
    echo "- Tokscale clients: \`${AGENTS_TOKSCALE_CLIENTS}\`."
    echo "- Measured tokens: ${measured_tokens:-not available}."
    echo "- Measured cost: ${measured_cost:-not available}."
    echo "- Tokscale graph export: \`${RUN_DIR}/tokscale-graph.json\`."
    echo
    echo "Context size:"
    echo
    echo "- Optimized Repomix pack: ${total_files:-unknown files}, ${total_tokens:-unknown tokens}, ${total_chars:-unknown chars}."
    echo "- Unoptimized baseline: not available unless a matched baseline run is captured."
    echo "- Estimated savings: not claimed without matched baseline and optimized runs."
    echo
    echo "Coverage:"
    echo
    echo "- Codex and selected clients: ${TOKSCALE_COVERAGE_STATUS}."
    echo "- Cursor: ${TOKSCALE_CURSOR_STATUS}."
    echo "- Antigravity: ${TOKSCALE_ANTIGRAVITY_STATUS}."
    echo "- Warp: ${TOKSCALE_WARP_STATUS}."
    echo "- Ollama: not directly supported by Tokscale; measure through the invoking agent or a separate telemetry layer."
  } >> "$target"
}

write_summary() {
  ensure_run_dir
  cat > "$RUN_DIR/summary.md" <<EOF
# AI Tool Run ${RUN_ID}

- Context mode: ${AGENTS_CONTEXT_MODE}
- Context7: ${CONTEXT7_STATUS}
- Tokscale: ${TOKSCALE_STATUS}
- Tokscale coverage: ${TOKSCALE_COVERAGE_STATUS}
- Tokscale Cursor sync: ${TOKSCALE_CURSOR_STATUS}
- Tokscale Antigravity sync: ${TOKSCALE_ANTIGRAVITY_STATUS}
- Tokscale Warp sync: ${TOKSCALE_WARP_STATUS}
- Tokscale submit: ${TOKSCALE_SUBMIT_STATUS}
- Repomix: ${REPOMIX_STATUS}
- MCP: ${AGENTS_MCP}
- Usage report target: ${AGENTS_USAGE_REPORT_TARGET}
- Optimization report target: ${AGENTS_OPTIMIZATION_REPORT_TARGET}
EOF
}

run_active_tools() {
  print_config
  if [ "$AGENTS_CONTEXT_MODE" = "baseline" ]; then
    echo "Baseline mode active. Optional accelerators run only when their flags are set to on."
  fi
  bool_on "$AGENTS_CONTEXT7" && run_context7 || CONTEXT7_STATUS="skipped: ${AGENTS_CONTEXT7}"
  bool_on "$AGENTS_TOKSCALE" && run_tokscale || TOKSCALE_STATUS="skipped: ${AGENTS_TOKSCALE}"
  bool_on "$AGENTS_REPOMIX" && run_repomix || REPOMIX_STATUS="skipped: ${AGENTS_REPOMIX}"
  write_summary
  append_usage_report
  append_optimization_report
  echo "AI tool run complete: ${RUN_DIR}"
}

run_measurement_pair() {
  local pair_id base_task original_mode original_run original_id original_task
  local original_context7 original_repomix original_tokscale original_submit original_usage_report original_optimization_report
  pair_id="$(value_for AGENTS_MEASUREMENT_PAIR_ID "")"
  if [ -z "$pair_id" ]; then
    pair_id="measurement-${RUN_ID}"
  fi
  base_task="$(value_for AGENTS_MEASUREMENT_TASK "$AGENTS_EXPERIMENT_TASK")"
  if [ -z "$base_task" ]; then
    base_task="baseline vs lean-context measurement"
  fi

  original_mode="$AGENTS_CONTEXT_MODE"
  original_id="$AGENTS_EXPERIMENT_ID"
  original_run="$AGENTS_EXPERIMENT_RUN"
  original_task="$AGENTS_EXPERIMENT_TASK"
  original_context7="$AGENTS_CONTEXT7"
  original_repomix="$AGENTS_REPOMIX"
  original_tokscale="$AGENTS_TOKSCALE"
  original_submit="$AGENTS_TOKSCALE_SUBMIT"
  original_usage_report="$AGENTS_USAGE_REPORT"
  original_optimization_report="$AGENTS_OPTIMIZATION_REPORT"

  AGENTS_CONTEXT7="$(value_for AGENTS_MEASUREMENT_CONTEXT7 "off")"
  AGENTS_REPOMIX="$(value_for AGENTS_MEASUREMENT_REPOMIX "on")"
  AGENTS_TOKSCALE="$(value_for AGENTS_MEASUREMENT_TOKSCALE "on")"
  AGENTS_TOKSCALE_SUBMIT="$(value_for AGENTS_MEASUREMENT_TOKSCALE_SUBMIT "off")"
  AGENTS_USAGE_REPORT="off"
  AGENTS_OPTIMIZATION_REPORT="off"
  AGENTS_EXPERIMENT_ID="$pair_id"
  AGENTS_EXPERIMENT_TASK="$base_task"

  local baseline_run lean_run baseline_dir lean_dir
  local baseline_repomix_tokens lean_repomix_tokens baseline_tokscale_tokens lean_tokscale_tokens baseline_cost lean_cost

  baseline_run="${pair_id}-baseline"
  reset_run_dir "$baseline_run"
  AGENTS_CONTEXT_MODE="baseline"
  AGENTS_EXPERIMENT_RUN="$baseline_run"
  run_active_tools
  baseline_dir="$RUN_DIR"
  baseline_repomix_tokens="$(extract_repomix_metric "Total Tokens")"
  baseline_tokscale_tokens="$(extract_tokscale_summary "totalTokens")"
  baseline_cost="$(extract_tokscale_summary "totalCost")"

  lean_run="${pair_id}-lean-context"
  reset_run_dir "$lean_run"
  AGENTS_CONTEXT_MODE="lean-context"
  AGENTS_EXPERIMENT_RUN="$lean_run"
  run_active_tools
  lean_dir="$RUN_DIR"
  lean_repomix_tokens="$(extract_repomix_metric "Total Tokens")"
  lean_tokscale_tokens="$(extract_tokscale_summary "totalTokens")"
  lean_cost="$(extract_tokscale_summary "totalCost")"

  AGENTS_USAGE_REPORT="$(value_for AGENTS_MEASUREMENT_USAGE_REPORT "on")"
  AGENTS_OPTIMIZATION_REPORT="$original_optimization_report"
  append_measurement_comparison "$pair_id" "$baseline_run" "$lean_run" "$baseline_dir" "$lean_dir" \
    "$baseline_repomix_tokens" "$lean_repomix_tokens" "$baseline_tokscale_tokens" "$lean_tokscale_tokens" "$baseline_cost" "$lean_cost" "$base_task"

  AGENTS_CONTEXT_MODE="$original_mode"
  AGENTS_EXPERIMENT_ID="$original_id"
  AGENTS_EXPERIMENT_RUN="$original_run"
  AGENTS_EXPERIMENT_TASK="$original_task"
  AGENTS_CONTEXT7="$original_context7"
  AGENTS_REPOMIX="$original_repomix"
  AGENTS_TOKSCALE="$original_tokscale"
  AGENTS_TOKSCALE_SUBMIT="$original_submit"
  AGENTS_USAGE_REPORT="$original_usage_report"
  AGENTS_OPTIMIZATION_REPORT="$original_optimization_report"

  echo "Measurement pair complete: ${pair_id}"
  echo "- baseline: ${baseline_dir}"
  echo "- lean-context: ${lean_dir}"
  echo "- report: ${AGENTS_USAGE_REPORT_TARGET}"
}

install_hooks() {
  if [ ! -d ".git" ]; then
    echo "Git hooks can only be installed from the repository root." >&2
    exit 1
  fi
  if [ ! -x ".githooks/pre-commit" ]; then
    echo ".githooks/pre-commit is missing or not executable." >&2
    exit 1
  fi
  git config core.hooksPath .githooks
  echo "Git hooks installed: core.hooksPath=.githooks"
}

stage_usage_report() {
  if bool_on "$AGENTS_USAGE_REPORT" && [ -f "$AGENTS_USAGE_REPORT_TARGET" ]; then
    git add "$AGENTS_USAGE_REPORT_TARGET"
  fi
  if bool_on "$AGENTS_OPTIMIZATION_REPORT" && [ -f "$AGENTS_OPTIMIZATION_REPORT_TARGET" ]; then
    git add "$AGENTS_OPTIMIZATION_REPORT_TARGET"
  fi
}

setup_machine() {
  ensure_run_dir
  print_config
  cat <<'EOF'

Tokscale machine setup

Portable command used by automation:

  npx -y tokscale@latest

Optional global install, useful for Warp and normal shell usage:

  npm install -g tokscale
  # or
  bun install -g tokscale

Verify that the global command is visible in this shell:

  command -v tokscale
  tokscale --help

If Warp or zsh cannot find `tokscale`, check npm's global bin path:

  npm prefix -g
  npm bin -g
  echo "$PATH"

Login and dashboard:

  npx -y tokscale@latest login
  npx -y tokscale@latest whoami
  npx -y tokscale@latest tui --today

Client setup:

  cursor agent login
  npx -y tokscale@latest cursor login
  npx -y tokscale@latest cursor sync

  npx -y tokscale@latest warp login
  npx -y tokscale@latest warp sync

  npx -y tokscale@latest antigravity status
  npx -y tokscale@latest antigravity sync

Claude Code coverage is transcript-based when local JSONL transcripts exist.
Gemini coverage depends on readable local CLI logs. Ollama is not a direct
Tokscale client; measure it through the invoking agent or separate telemetry.

Opt-down modes:

  AGENTS_TOKSCALE_SUBMIT=dry-run
  AGENTS_TOKSCALE_SUBMIT=off
EOF
  echo
  echo "Detected setup:"
  echo "- tokscale global: $(tool_available tokscale && command -v tokscale || echo missing)"
  echo "- npx: $(tool_available npx && command -v npx || echo missing)"
  echo "- npm: $(tool_available npm && command -v npm || echo missing)"
  echo "- bun: $(tool_available bun && command -v bun || echo missing)"
  run_tokscale_cmd whoami > "$RUN_DIR/tokscale-whoami.raw" 2> "$RUN_DIR/tokscale-whoami.err" || true
  strip_ansi < "$RUN_DIR/tokscale-whoami.raw" > "$RUN_DIR/tokscale-whoami.txt" 2>/dev/null || true
  echo "- Tokscale auth: $(tr '\n' ' ' < "$RUN_DIR/tokscale-whoami.txt" 2>/dev/null || echo unknown)"
  run_tokscale_cmd clients > "$RUN_DIR/tokscale-clients-setup.raw" 2> "$RUN_DIR/tokscale-clients-setup.err" || true
  strip_ansi < "$RUN_DIR/tokscale-clients-setup.raw" > "$RUN_DIR/tokscale-clients-setup.txt" 2>/dev/null || true
  echo "- Client scan: ${RUN_DIR}/tokscale-clients-setup.txt"
}

dashboard() {
  ensure_run_dir
  cat <<EOF
Tokscale dashboard

Built-in local TUI:

  npx -y tokscale@latest
  npx -y tokscale@latest tui --today

Machine-readable graph export:

  npx -y tokscale@latest graph --client "${AGENTS_TOKSCALE_CLIENTS}" --today --output "${RUN_DIR}/tokscale-graph.json"

Repository reports:

  ${AGENTS_USAGE_REPORT_TARGET}
  ${AGENTS_OPTIMIZATION_REPORT_TARGET}

Latest local run data:

  ${RUN_DIR}
EOF
}

AGENTS_CONTEXT_MODE="$(value_for AGENTS_CONTEXT_MODE "lean-context")"
AGENTS_CONTEXT7="$(value_for AGENTS_CONTEXT7 "ask")"
AGENTS_REPOMIX="$(value_for AGENTS_REPOMIX "ask")"
AGENTS_TOKSCALE="$(value_for AGENTS_TOKSCALE "ask")"
AGENTS_TOKSCALE_CLIENT="$(value_for AGENTS_TOKSCALE_CLIENT "codex")"
AGENTS_TOKSCALE_CLIENTS="$(value_for AGENTS_TOKSCALE_CLIENTS "$AGENTS_TOKSCALE_CLIENT")"
AGENTS_TOKSCALE_CURSOR_SYNC="$(value_for AGENTS_TOKSCALE_CURSOR_SYNC "off")"
AGENTS_TOKSCALE_ANTIGRAVITY_SYNC="$(value_for AGENTS_TOKSCALE_ANTIGRAVITY_SYNC "off")"
AGENTS_TOKSCALE_WARP_SYNC="$(value_for AGENTS_TOKSCALE_WARP_SYNC "off")"
AGENTS_TOKSCALE_SUBMIT="$(value_for AGENTS_TOKSCALE_SUBMIT "off")"
AGENTS_MCP="$(value_for AGENTS_MCP "ask")"
AGENTS_AUTO_RUN_ON_COMMIT="$(value_for AGENTS_AUTO_RUN_ON_COMMIT "off")"
AGENTS_USAGE_REPORT="$(value_for AGENTS_USAGE_REPORT "off")"
AGENTS_USAGE_REPORT_TARGET="$(value_for AGENTS_USAGE_REPORT_TARGET "docs/AI_USAGE_REPORT.md")"
AGENTS_OPTIMIZATION_REPORT="$(value_for AGENTS_OPTIMIZATION_REPORT "off")"
AGENTS_OPTIMIZATION_REPORT_TARGET="$(value_for AGENTS_OPTIMIZATION_REPORT_TARGET "docs/AI_OPTIMIZATION_REPORT.md")"
AGENTS_EXPERIMENT_ID="$(value_for AGENTS_EXPERIMENT_ID "")"
AGENTS_EXPERIMENT_RUN="$(value_for AGENTS_EXPERIMENT_RUN "$RUN_ID")"
AGENTS_EXPERIMENT_TASK="$(value_for AGENTS_EXPERIMENT_TASK "")"
TOKSCALE_API_TOKEN_VALUE="$(value_for TOKSCALE_API_TOKEN "")"

if [ -n "$TOKSCALE_API_TOKEN_VALUE" ]; then
  export TOKSCALE_API_TOKEN="$TOKSCALE_API_TOKEN_VALUE"
fi

CONTEXT7_STATUS="not run"
TOKSCALE_STATUS="not run"
TOKSCALE_COVERAGE_STATUS="not run"
TOKSCALE_CURSOR_STATUS="not run"
TOKSCALE_ANTIGRAVITY_STATUS="not run"
TOKSCALE_WARP_STATUS="not run"
TOKSCALE_SUBMIT_STATUS="not run"
REPOMIX_STATUS="not run"

case "$COMMAND" in
  check)
    print_config
    echo "- npx: $(tool_available npx && echo available || echo missing)"
    echo "- tokscale global: $(tool_available tokscale && command -v tokscale || echo missing)"
    echo "- rg: $(tool_available rg && echo available || echo missing)"
    echo "- .agents.env: $([ -f .agents.env ] && echo present || echo missing)"
    echo "- .env: $([ -f .env ] && echo present || echo missing)"
    echo "- repomix config: $(repomix_config)"
    ensure_run_dir
    run_tokscale_cmd whoami > "$RUN_DIR/tokscale-whoami-check.raw" 2> "$RUN_DIR/tokscale-whoami-check.err" || true
    strip_ansi < "$RUN_DIR/tokscale-whoami-check.raw" > "$RUN_DIR/tokscale-whoami-check.txt" 2>/dev/null || true
    echo "- Tokscale auth: $(tr '\n' ' ' < "$RUN_DIR/tokscale-whoami-check.txt" 2>/dev/null || echo unknown)"
    run_tokscale_cmd clients > "$RUN_DIR/tokscale-clients-check.raw" 2> "$RUN_DIR/tokscale-clients-check.err" || true
    strip_ansi < "$RUN_DIR/tokscale-clients-check.raw" > "$RUN_DIR/tokscale-clients-check.txt" 2>/dev/null || true
    echo "- Tokscale client scan: ${RUN_DIR}/tokscale-clients-check.txt"
    ;;
  run)
    run_active_tools
    ;;
  measure-pair)
    run_measurement_pair
    ;;
  run-and-stage)
    run_active_tools
    stage_usage_report
    ;;
  install-hooks)
    install_hooks
    ;;
  setup-machine)
    setup_machine
    ;;
  dashboard)
    dashboard
    ;;
  *)
    echo "Usage: scripts/ai-tools.sh [check|run|measure-pair|run-and-stage|install-hooks|setup-machine|dashboard]" >&2
    exit 2
    ;;
esac
