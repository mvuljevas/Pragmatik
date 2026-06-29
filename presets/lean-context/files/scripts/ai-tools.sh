#!/usr/bin/env bash
set -euo pipefail

COMMAND="${1:-run}"
ROOT_DIR="$(pwd)"
RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)"
RUN_DIR=".ai-runs/${RUN_ID}"

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
  if [ -z "$value" ]; then
    value="$(read_kv_file ".agents.env" "$key" 2>/dev/null || true)"
  fi
  if [ -z "$value" ]; then
    value="$(read_kv_file ".env" "$key" 2>/dev/null || true)"
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

print_config() {
  cat <<EOF
AI tool automation
- context mode: ${AGENTS_CONTEXT_MODE}
- Context7: ${AGENTS_CONTEXT7}
- Repomix: ${AGENTS_REPOMIX}
- Tokscale: ${AGENTS_TOKSCALE}
- Tokscale submit: ${AGENTS_TOKSCALE_SUBMIT}
- MCP: ${AGENTS_MCP}
- auto run on commit: ${AGENTS_AUTO_RUN_ON_COMMIT}
- usage report: ${AGENTS_USAGE_REPORT}
- report target: ${AGENTS_USAGE_REPORT_TARGET}
EOF
}

tool_available() {
  command -v "$1" >/dev/null 2>&1
}

ensure_run_dir() {
  mkdir -p "$RUN_DIR"
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
  local client period
  client="$(value_for AGENTS_TOKSCALE_CLIENT "codex")"
  period="$(value_for AGENTS_TOKSCALE_PERIOD "today")"

  local period_arg=""
  case "$period" in
    today|yesterday|week|month) period_arg="--${period}" ;;
    *) period_arg="--today" ;;
  esac

  if npx -y tokscale@latest --client "$client" "$period_arg" report > "$RUN_DIR/tokscale-report.raw" 2> "$RUN_DIR/tokscale-report.err"; then
    strip_ansi < "$RUN_DIR/tokscale-report.raw" > "$RUN_DIR/tokscale-report.txt"
    TOKSCALE_STATUS="ok: ${client} ${period}"
  else
    strip_ansi < "$RUN_DIR/tokscale-report.raw" > "$RUN_DIR/tokscale-report.txt" 2>/dev/null || true
    TOKSCALE_STATUS="failed: see ${RUN_DIR}/tokscale-report.err"
  fi

  npx -y tokscale@latest --client "$client" "$period_arg" models > "$RUN_DIR/tokscale-models.raw" 2> "$RUN_DIR/tokscale-models.err" || true
  strip_ansi < "$RUN_DIR/tokscale-models.raw" > "$RUN_DIR/tokscale-models.txt" 2>/dev/null || true

  case "$AGENTS_TOKSCALE_SUBMIT" in
    off|ask|"")
      TOKSCALE_SUBMIT_STATUS="skipped: ${AGENTS_TOKSCALE_SUBMIT}"
      ;;
    dry-run)
      if npx -y tokscale@latest submit --client "$client" "$period_arg" --dry-run > "$RUN_DIR/tokscale-submit.raw" 2> "$RUN_DIR/tokscale-submit.err"; then
        strip_ansi < "$RUN_DIR/tokscale-submit.raw" > "$RUN_DIR/tokscale-submit.txt"
        TOKSCALE_SUBMIT_STATUS="dry-run ok: ${client} ${period}"
      else
        strip_ansi < "$RUN_DIR/tokscale-submit.raw" > "$RUN_DIR/tokscale-submit.txt" 2>/dev/null || true
        TOKSCALE_SUBMIT_STATUS="dry-run failed: see ${RUN_DIR}/tokscale-submit.err"
      fi
      ;;
    on|true|1)
      if npx -y tokscale@latest whoami > "$RUN_DIR/tokscale-whoami.raw" 2> "$RUN_DIR/tokscale-whoami.err"; then
        strip_ansi < "$RUN_DIR/tokscale-whoami.raw" > "$RUN_DIR/tokscale-whoami.txt"
        if rg -q "Not logged in" "$RUN_DIR/tokscale-whoami.txt"; then
          TOKSCALE_SUBMIT_STATUS="submit failed: not logged in"
        elif npx -y tokscale@latest submit --client "$client" "$period_arg" > "$RUN_DIR/tokscale-submit.raw" 2> "$RUN_DIR/tokscale-submit.err"; then
          strip_ansi < "$RUN_DIR/tokscale-submit.raw" > "$RUN_DIR/tokscale-submit.txt"
          TOKSCALE_SUBMIT_STATUS="submitted: ${client} ${period}"
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
    echo "| Tokscale submit | ${TOKSCALE_SUBMIT_STATUS}. |"
    echo "| Context7 validation | ${CONTEXT7_STATUS}. |"
    echo
    echo "Notes:"
    echo
    echo "- Local raw outputs are stored under \`${RUN_DIR}/\` and remain ignored."
    echo "- Treat Tokscale grouping as approximate unless validated manually."
  } >> "$target"
}

write_summary() {
  ensure_run_dir
  cat > "$RUN_DIR/summary.md" <<EOF
# AI Tool Run ${RUN_ID}

- Context mode: ${AGENTS_CONTEXT_MODE}
- Context7: ${CONTEXT7_STATUS}
- Tokscale: ${TOKSCALE_STATUS}
- Tokscale submit: ${TOKSCALE_SUBMIT_STATUS}
- Repomix: ${REPOMIX_STATUS}
- MCP: ${AGENTS_MCP}
- Usage report target: ${AGENTS_USAGE_REPORT_TARGET}
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
  echo "AI tool run complete: ${RUN_DIR}"
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
}

AGENTS_CONTEXT_MODE="$(value_for AGENTS_CONTEXT_MODE "lean-context")"
AGENTS_CONTEXT7="$(value_for AGENTS_CONTEXT7 "ask")"
AGENTS_REPOMIX="$(value_for AGENTS_REPOMIX "ask")"
AGENTS_TOKSCALE="$(value_for AGENTS_TOKSCALE "ask")"
AGENTS_TOKSCALE_SUBMIT="$(value_for AGENTS_TOKSCALE_SUBMIT "off")"
AGENTS_MCP="$(value_for AGENTS_MCP "ask")"
AGENTS_AUTO_RUN_ON_COMMIT="$(value_for AGENTS_AUTO_RUN_ON_COMMIT "off")"
AGENTS_USAGE_REPORT="$(value_for AGENTS_USAGE_REPORT "off")"
AGENTS_USAGE_REPORT_TARGET="$(value_for AGENTS_USAGE_REPORT_TARGET "docs/AI_USAGE_REPORT.md")"
AGENTS_EXPERIMENT_ID="$(value_for AGENTS_EXPERIMENT_ID "")"
AGENTS_EXPERIMENT_RUN="$(value_for AGENTS_EXPERIMENT_RUN "$RUN_ID")"
AGENTS_EXPERIMENT_TASK="$(value_for AGENTS_EXPERIMENT_TASK "")"
TOKSCALE_API_TOKEN_VALUE="$(value_for TOKSCALE_API_TOKEN "")"

if [ -n "$TOKSCALE_API_TOKEN_VALUE" ]; then
  export TOKSCALE_API_TOKEN="$TOKSCALE_API_TOKEN_VALUE"
fi

CONTEXT7_STATUS="not run"
TOKSCALE_STATUS="not run"
TOKSCALE_SUBMIT_STATUS="not run"
REPOMIX_STATUS="not run"

case "$COMMAND" in
  check)
    print_config
    echo "- npx: $(tool_available npx && echo available || echo missing)"
    echo "- rg: $(tool_available rg && echo available || echo missing)"
    echo "- .agents.env: $([ -f .agents.env ] && echo present || echo missing)"
    echo "- .env: $([ -f .env ] && echo present || echo missing)"
    echo "- repomix config: $(repomix_config)"
    ;;
  run)
    run_active_tools
    ;;
  run-and-stage)
    run_active_tools
    stage_usage_report
    ;;
  install-hooks)
    install_hooks
    ;;
  *)
    echo "Usage: scripts/ai-tools.sh [check|run|run-and-stage|install-hooks]" >&2
    exit 2
    ;;
esac
