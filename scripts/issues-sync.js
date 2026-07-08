#!/usr/bin/env node
/**
 * scripts/issues-sync.js
 *
 * Pragmatik Issues Sync — manage GitHub issues via gh CLI.
 * Clears GITHUB_TOKEN so gh uses the keyring token automatically.
 *
 * Usage:
 *   node scripts/issues-sync.js triage             List open issues with label gaps
 *   node scripts/issues-sync.js label-all          Apply missing labels to all open issues
 *   node scripts/issues-sync.js close-resolved     Close issues linked in TECHDEBT.md Resolved table
 *   node scripts/issues-sync.js add-label <n> <l>  Add label to issue number
 *   node scripts/issues-sync.js remove-label <n> <l> Remove label from issue number
 *
 * Flags:
 *   --dry-run    Print actions without executing
 *   --repo <r>   Override repo (default: auto-detect from git remote)
 */

import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── fix: clear injected dummy token so gh uses keyring ───────────────────
delete process.env.GITHUB_TOKEN;

// ─── helpers ──────────────────────────────────────────────────────────────

let DRY_RUN = false;
let REPO = null;

function gh(args, opts = {}) {
  const cmd = `gh ${args}`;
  if (DRY_RUN && !opts.read) {
    console.log(`  [dry-run] ${cmd}`);
    return opts.default ?? "";
  }
  try {
    return execSync(cmd, {
      cwd: ROOT,
      stdio: "pipe",
      encoding: "utf8",
      env: { ...process.env, GITHUB_TOKEN: "" },
    }).trim();
  } catch (err) {
    if (opts.optional) return opts.default ?? "";
    die(`gh command failed: ${cmd}\n${err.stderr ?? err.message}`);
  }
}

function die(msg) {
  console.error(`\nPragmatik issues-sync error\n---------------------------\n${msg}\n`);
  process.exit(1);
}

function info(msg)  { console.log(`\n→ ${msg}`); }
function ok(msg)    { console.log(`  ✓ ${msg}`); }
function warn(msg)  { console.log(`  ⚠ ${msg}`); }
function print(msg) { console.log(`  ${msg}`); }

// ─── repo detection ────────────────────────────────────────────────────────

function detectRepo() {
  if (REPO) return REPO;
  const remote = execSync("git remote get-url origin", {
    cwd: ROOT, stdio: "pipe", encoding: "utf8",
  }).trim();
  // https://github.com/owner/repo.git  or  git@github.com:owner/repo.git
  const m = remote.match(/github\.com[:/]([^/]+\/[^/.]+)/);
  if (!m) die(`Cannot detect GitHub repo from remote: ${remote}`);
  REPO = m[1];
  return REPO;
}

// ─── labeling rules ────────────────────────────────────────────────────────

const LABEL_RULES = [
  // type
  { match: /\bTD-\d+/i,                               labels: ["type:techdebt"] },
  { match: /\b(feat(ure)?|add|implement|prototype)\b/i, labels: ["type:feature"] },
  { match: /\b(fix|bug|patch|repair)\b/i,              labels: ["type:bug"] },
  { match: /\b(doc|docs|documentation|readme|changelog)\b/i, labels: ["type:docs"] },
  // area
  { match: /\b(template|preset|scaffold|monorepo|boilerplate)\b/i, labels: ["area:template"] },
  { match: /\b(mcp|model.?context|context.?server)\b/i, labels: ["area:mcp", "ai:mcp"] },
  { match: /\b(dashboard|ui|visual|workflow|process|gitflow|ci|action|cli|npm|package|install|binary)\b/i, labels: ["area:workflow"] },
  { match: /\b(doc|docs|readme|snapshot|roadmap|changelog)\b/i, labels: ["area:docs"] },
  { match: /\b(github|issue|label|project.?board|action)\b/i, labels: ["area:github"] },
  { match: /\b(token|lean.?context|repomix|tokscale|compression)\b/i, labels: ["ai:context"] },
  { match: /\b(typescript|electron|android|web)\b/i,   labels: ["area:template"] },
  // priority overrides
  { match: /\b(critical|urgent|blocker)\b/i,           labels: ["priority:high"] },
];

const PRIORITY_LABELS = new Set(["priority:high", "priority:medium", "priority:low"]);
const STATUS_LABELS   = new Set(["status:triage", "status:ready", "status:blocked"]);

function computeLabelsForTitle(title, existingLabels) {
  const existing = new Set(existingLabels.map((l) => l.name));
  const toAdd = new Set();

  for (const rule of LABEL_RULES) {
    if (rule.match.test(title)) {
      for (const l of rule.labels) toAdd.add(l);
    }
  }

  // Add default priority if none present
  const hasPriority = [...existing, ...toAdd].some((l) => PRIORITY_LABELS.has(l));
  if (!hasPriority) toAdd.add("priority:medium");

  // Add status:triage if no status label present
  const hasStatus = [...existing].some((l) => STATUS_LABELS.has(l));
  if (!hasStatus) toAdd.add("status:triage");

  // Filter out labels already on the issue
  return [...toAdd].filter((l) => !existing.has(l));
}

// ─── fetch issues ──────────────────────────────────────────────────────────

function fetchOpenIssues() {
  const repo = detectRepo();
  const raw = gh(
    `issue list --repo ${repo} --state open --limit 100 --json number,title,labels`,
    { read: true }
  );
  return JSON.parse(raw || "[]");
}

// ─── parse TECHDEBT.md for resolved issue URLs ─────────────────────────────

function parseTechdebtResolved() {
  const path = resolve(ROOT, "docs", "TECHDEBT.md");
  if (!existsSync(path)) die("docs/TECHDEBT.md not found.");
  const content = readFileSync(path, "utf8");

  // Find ## Resolved section
  const resolvedMatch = content.match(/## Resolved[\s\S]*/);
  if (!resolvedMatch) return [];

  const resolved = resolvedMatch[0];
  // Extract GitHub issue numbers from URLs like /issues/9
  const urlPattern = /https?:\/\/github\.com\/[^/]+\/[^/]+\/issues\/(\d+)/g;
  const nums = new Set();
  for (const m of resolved.matchAll(urlPattern)) {
    nums.add(parseInt(m[1], 10));
  }
  return [...nums];
}

// ─── commands ─────────────────────────────────────────────────────────────

function cmdTriage() {
  info("Fetching open issues…");
  const issues = fetchOpenIssues();
  const repo = detectRepo();
  console.log(`\nTriage report — ${repo} (${issues.length} open issues)\n${"─".repeat(50)}`);

  let needsWork = 0;
  for (const issue of issues) {
    const toAdd = computeLabelsForTitle(issue.title, issue.labels);
    const existing = issue.labels.map((l) => l.name);
    if (toAdd.length === 0) {
      print(`#${issue.number} ✓ ${issue.title.slice(0, 60)}`);
    } else {
      print(`#${issue.number} ⚠ ${issue.title.slice(0, 55)}`);
      print(`     existing: ${existing.length ? existing.join(", ") : "(none)"}`);
      print(`     would add: ${toAdd.join(", ")}`);
      needsWork++;
    }
  }

  console.log(`\n${"─".repeat(50)}`);
  if (needsWork > 0) {
    console.log(`${needsWork} issue(s) need labels. Run:\n  npm run issues:label`);
  } else {
    console.log("All issues are labeled correctly.");
  }

  // Resolved check
  const resolvedNums = parseTechdebtResolved();
  const openResolved = issues.filter((i) => resolvedNums.includes(i.number));
  if (openResolved.length > 0) {
    console.log(`\n${openResolved.length} resolved issue(s) still open:`);
    for (const i of openResolved) {
      print(`#${i.number} — ${i.title}`);
    }
    console.log(`Run:\n  npm run issues:close-resolved`);
  }
}

function cmdLabelAll() {
  info("Fetching open issues…");
  const issues = fetchOpenIssues();
  const repo = detectRepo();
  let changed = 0;

  for (const issue of issues) {
    const toAdd = computeLabelsForTitle(issue.title, issue.labels);
    if (toAdd.length === 0) {
      print(`#${issue.number} — already labeled, skipping`);
      continue;
    }
    const labelArgs = toAdd.map((l) => `--add-label "${l}"`).join(" ");
    if (DRY_RUN) {
      console.log(`  [dry-run] gh issue edit ${issue.number} --repo ${repo} ${labelArgs}`);
    } else {
      info(`Labeling #${issue.number}: ${issue.title.slice(0, 50)}…`);
      gh(`issue edit ${issue.number} --repo ${repo} ${labelArgs}`);
    }
    ok(`#${issue.number} ← ${toAdd.join(", ")}`);
    changed++;
  }

  console.log(`\n${changed} issue(s) labeled.`);
}

function cmdCloseResolved() {
  const resolvedNums = parseTechdebtResolved();
  if (resolvedNums.length === 0) {
    console.log("No resolved issues found in docs/TECHDEBT.md.");
    return;
  }

  info(`Found ${resolvedNums.length} resolved issue(s) in TECHDEBT.md: ${resolvedNums.join(", ")}`);
  const issues = fetchOpenIssues();
  const repo = detectRepo();
  const toClose = issues.filter((i) => resolvedNums.includes(i.number));

  if (toClose.length === 0) {
    ok("All resolved issues are already closed. Nothing to do.");
    return;
  }

  for (const issue of toClose) {
    info(`Closing #${issue.number}: ${issue.title}`);
    if (!DRY_RUN) {
      gh(`issue close ${issue.number} --repo ${repo} --comment "Automatically closed: this item is listed as resolved in \`docs/TECHDEBT.md\`."`);
    } else {
      console.log(`  [dry-run] gh issue close ${issue.number} --repo ${repo} --comment "Automatically closed..."`);
    }
    ok(`#${issue.number} closed`);
  }

  console.log(`\n${toClose.length} issue(s) closed.`);
}

function cmdAddLabel(num, label) {
  if (!num || !label) die("Usage: issues-sync add-label <issue-number> <label-name>");
  const repo = detectRepo();
  info(`Adding label "${label}" to #${num}…`);
  gh(`issue edit ${num} --repo ${repo} --add-label "${label}"`);
  ok(`Done.`);
}

function cmdRemoveLabel(num, label) {
  if (!num || !label) die("Usage: issues-sync remove-label <issue-number> <label-name>");
  const repo = detectRepo();
  info(`Removing label "${label}" from #${num}…`);
  gh(`issue edit ${num} --repo ${repo} --remove-label "${label}"`);
  ok(`Done.`);
}

function printHelp() {
  console.log(`
Pragmatik Issues Sync — usage:

  node scripts/issues-sync.js triage               List label gaps for all open issues
  node scripts/issues-sync.js label-all            Apply missing labels to all open issues
  node scripts/issues-sync.js close-resolved       Close issues resolved in TECHDEBT.md
  node scripts/issues-sync.js add-label <n> <l>    Add label to issue
  node scripts/issues-sync.js remove-label <n> <l> Remove label from issue

Flags:
  --dry-run   Print actions without executing
  --repo <r>  Override repo (owner/name)

npm shortcuts:
  npm run issues:triage
  npm run issues:label
  npm run issues:close-resolved
`);
}

// ─── dispatch ─────────────────────────────────────────────────────────────

const rawArgs = process.argv.slice(2);
const args = [];
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i] === "--dry-run") { DRY_RUN = true; }
  else if (rawArgs[i] === "--repo") { REPO = rawArgs[++i]; }
  else args.push(rawArgs[i]);
}

const [cmd, a1, a2] = args;

if (!cmd || cmd === "help" || cmd === "--help") { printHelp(); process.exit(0); }

switch (cmd) {
  case "triage":         cmdTriage(); break;
  case "label-all":      cmdLabelAll(); break;
  case "close-resolved": cmdCloseResolved(); break;
  case "add-label":      cmdAddLabel(a1, a2); break;
  case "remove-label":   cmdRemoveLabel(a1, a2); break;
  default:
    die(`Unknown command "${cmd}". Run: node scripts/issues-sync.js help`);
}
