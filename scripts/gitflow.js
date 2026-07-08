#!/usr/bin/env node
/**
 * scripts/gitflow.js
 *
 * Pragmatik Gitflow automation — Node.js only, no external dependencies.
 *
 * Usage:
 *   node scripts/gitflow.js <command> [subcommand] [name|version] [--push] [--dry-run]
 *
 * Commands:
 *   feature start <name>     Create feature/<name> from develop
 *   feature finish <name>    Merge feature/<name> into develop (--no-ff), delete branch
 *   fix start <name>         Create fix/<name> from develop
 *   fix finish <name>        Merge fix/<name> into develop (--no-ff), delete branch
 *   release start <version>  Create release/<version> from develop, bump VERSION
 *   release finish <version> Merge release/<version> into staging + main, tag v<version>
 *   hotfix start <version>   Create hotfix/<version> from main, bump VERSION
 *   hotfix finish <version>  Merge hotfix/<version> into main + develop, tag v<version>
 *   promote staging          Merge develop → staging (--no-ff)
 *   promote main             Merge staging → main (--no-ff) + tag
 *   status                   Show all flow branches and their relationship to main
 *
 * Flags:
 *   --push       Push affected branches and tags to origin after finish
 *   --dry-run    Print all git commands without executing them
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─────────────────────────────── helpers ────────────────────────────────────

let DRY_RUN = false;
let DO_PUSH = false;

function git(cmd, opts = {}) {
  const full = `git ${cmd}`;
  if (DRY_RUN) {
    console.log(`  [dry-run] ${full}`);
    return "";
  }
  try {
    return execSync(full, { cwd: ROOT, stdio: opts.silent ? "pipe" : "inherit", encoding: "utf8" });
  } catch (err) {
    if (opts.optional) return "";
    die(`git ${cmd.split(" ")[0]} failed:\n${err.message}`);
  }
}

function gitOut(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: ROOT, stdio: "pipe", encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function die(msg) {
  console.error(`\nPragmatik gitflow error\n-----------------------\n${msg}\n`);
  process.exit(1);
}

function info(msg) {
  console.log(`\n→ ${msg}`);
}

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function currentBranch() {
  return gitOut("rev-parse --abbrev-ref HEAD");
}

function branchExists(branch) {
  return gitOut(`branch --list ${branch}`) !== "";
}

function remoteBranchExists(branch) {
  return gitOut(`ls-remote --heads origin ${branch}`) !== "";
}

function requireClean() {
  const status = gitOut("status --porcelain");
  if (status) {
    die(
      `Working tree is not clean. Commit or stash your changes first.\n\nUntracked/modified files:\n${status}`
    );
  }
}

function requireBranch(branch) {
  if (!branchExists(branch)) {
    die(`Branch "${branch}" does not exist locally. Run setup or create it first.`);
  }
}

// ─────────────────────────────── VERSION ────────────────────────────────────

function readVersion() {
  const vfile = resolve(ROOT, "VERSION");
  if (!existsSync(vfile)) die("VERSION file not found at repo root.");
  return readFileSync(vfile, "utf8").trim();
}

function writeVersion(ver) {
  const vfile = resolve(ROOT, "VERSION");
  if (DRY_RUN) {
    console.log(`  [dry-run] write VERSION → ${ver}`);
    return;
  }
  writeFileSync(vfile, `${ver}\n`, "utf8");
  ok(`VERSION → ${ver}`);
}

function validateSemver(ver) {
  if (!/^\d+\.\d+\.\d+$/.test(ver)) {
    die(`"${ver}" is not a valid semver (expected X.Y.Z).`);
  }
}

// ─────────────────────────────── push helper ────────────────────────────────

function maybePush(branches, tags = []) {
  if (!DO_PUSH) {
    const pushCmd = [
      ...branches.map((b) => `  git push origin ${b}`),
      ...tags.map((t) => `  git push origin ${t}`),
    ].join("\n");
    console.log(`\nPush skipped. To push manually:\n${pushCmd}`);
    return;
  }
  for (const b of branches) {
    info(`Pushing ${b} to origin…`);
    git(`push origin ${b}`);
  }
  for (const t of tags) {
    info(`Pushing tag ${t} to origin…`);
    git(`push origin ${t}`);
  }
}

// ─────────────────────────────── commands ───────────────────────────────────

function cmdFeatureStart(name) {
  if (!name) die("Usage: gitflow feature start <name>");
  const branch = `feature/${name}`;
  requireClean();
  requireBranch("develop");
  if (branchExists(branch)) die(`Branch "${branch}" already exists.`);
  info(`Creating ${branch} from develop…`);
  git("checkout develop");
  git("pull origin develop --ff-only", { optional: true });
  git(`checkout -b ${branch}`);
  ok(`Branch "${branch}" created. Start your work and run:\n  npm run gf:feature finish ${name}`);
}

function cmdFeatureFinish(name) {
  if (!name) die("Usage: gitflow feature finish <name>");
  const branch = `feature/${name}`;
  requireClean();
  requireBranch(branch);
  requireBranch("develop");
  info(`Merging ${branch} → develop…`);
  git("checkout develop");
  git("pull origin develop --ff-only", { optional: true });
  git(`merge --no-ff ${branch} -m "Merge ${branch} into develop"`);
  git(`branch -d ${branch}`);
  if (DO_PUSH) git(`push origin :${branch}`, { optional: true });
  maybePush(["develop"]);
  ok(`Feature "${name}" finished and merged into develop.`);
}

function cmdFixStart(name) {
  if (!name) die("Usage: gitflow fix start <name>");
  const branch = `fix/${name}`;
  requireClean();
  requireBranch("develop");
  if (branchExists(branch)) die(`Branch "${branch}" already exists.`);
  info(`Creating ${branch} from develop…`);
  git("checkout develop");
  git("pull origin develop --ff-only", { optional: true });
  git(`checkout -b ${branch}`);
  ok(`Branch "${branch}" created. Start your fix and run:\n  npm run gf:fix finish ${name}`);
}

function cmdFixFinish(name) {
  if (!name) die("Usage: gitflow fix finish <name>");
  const branch = `fix/${name}`;
  requireClean();
  requireBranch(branch);
  requireBranch("develop");
  info(`Merging ${branch} → develop…`);
  git("checkout develop");
  git("pull origin develop --ff-only", { optional: true });
  git(`merge --no-ff ${branch} -m "Merge ${branch} into develop"`);
  git(`branch -d ${branch}`);
  if (DO_PUSH) git(`push origin :${branch}`, { optional: true });
  maybePush(["develop"]);
  ok(`Fix "${name}" finished and merged into develop.`);
}

function cmdReleaseStart(ver) {
  if (!ver) die("Usage: gitflow release start <version>");
  validateSemver(ver);
  const branch = `release/${ver}`;
  requireClean();
  requireBranch("develop");
  if (branchExists(branch)) die(`Branch "${branch}" already exists.`);
  info(`Creating ${branch} from develop…`);
  git("checkout develop");
  git("pull origin develop --ff-only", { optional: true });
  git(`checkout -b ${branch}`);
  writeVersion(ver);
  if (!DRY_RUN) {
    git(`add VERSION`);
    git(`commit -m "Bump version to ${ver} for release"`);
  }
  ok(
    `Release branch "${branch}" ready.\nMake final adjustments, then run:\n  npm run gf:release finish ${ver}`
  );
}

function cmdReleaseFinish(ver) {
  if (!ver) die("Usage: gitflow release finish <version>");
  validateSemver(ver);
  const branch = `release/${ver}`;
  const tag = `v${ver}`;
  requireClean();
  requireBranch(branch);
  requireBranch("staging");
  requireBranch("main");

  // merge into staging
  info(`Merging ${branch} → staging…`);
  git("checkout staging");
  git("pull origin staging --ff-only", { optional: true });
  git(`merge --no-ff ${branch} -m "Merge ${branch} into staging"`);

  // merge into main
  info(`Merging ${branch} → main…`);
  git("checkout main");
  git("pull origin main --ff-only", { optional: true });
  git(`merge --no-ff ${branch} -m "Merge ${branch} into main"`);

  // tag
  info(`Tagging ${tag}…`);
  git(`tag -a ${tag} -m "Release ${tag}"`);

  // sync back to develop
  info(`Syncing ${tag} back to develop…`);
  git("checkout develop");
  git("pull origin develop --ff-only", { optional: true });
  git(`merge --no-ff ${branch} -m "Sync ${branch} back to develop"`);

  // cleanup
  git(`branch -d ${branch}`);
  if (DO_PUSH) git(`push origin :${branch}`, { optional: true });

  maybePush(["main", "staging", "develop"], [tag]);
  ok(`Release ${tag} finished. main, staging, and develop are now at ${ver}.`);
}

function cmdHotfixStart(ver) {
  if (!ver) die("Usage: gitflow hotfix start <version>");
  validateSemver(ver);
  const branch = `hotfix/${ver}`;
  requireClean();
  requireBranch("main");
  if (branchExists(branch)) die(`Branch "${branch}" already exists.`);
  info(`Creating ${branch} from main…`);
  git("checkout main");
  git("pull origin main --ff-only", { optional: true });
  git(`checkout -b ${branch}`);
  writeVersion(ver);
  if (!DRY_RUN) {
    git(`add VERSION`);
    git(`commit -m "Bump version to ${ver} for hotfix"`);
  }
  ok(
    `Hotfix branch "${branch}" ready.\nApply your fix, then run:\n  npm run gf:hotfix finish ${ver}`
  );
}

function cmdHotfixFinish(ver) {
  if (!ver) die("Usage: gitflow hotfix finish <version>");
  validateSemver(ver);
  const branch = `hotfix/${ver}`;
  const tag = `v${ver}`;
  requireClean();
  requireBranch(branch);
  requireBranch("main");
  requireBranch("develop");

  // merge into main
  info(`Merging ${branch} → main…`);
  git("checkout main");
  git("pull origin main --ff-only", { optional: true });
  git(`merge --no-ff ${branch} -m "Merge ${branch} into main"`);

  // tag
  info(`Tagging ${tag}…`);
  git(`tag -a ${tag} -m "Hotfix ${tag}"`);

  // merge into develop
  info(`Syncing ${branch} → develop…`);
  git("checkout develop");
  git("pull origin develop --ff-only", { optional: true });
  git(`merge --no-ff ${branch} -m "Sync ${branch} back to develop"`);

  // merge into staging if it exists
  if (branchExists("staging")) {
    info(`Syncing ${branch} → staging…`);
    git("checkout staging");
    git("pull origin staging --ff-only", { optional: true });
    git(`merge --no-ff ${branch} -m "Sync ${branch} to staging"`);
  }

  // cleanup
  git(`branch -d ${branch}`);
  if (DO_PUSH) git(`push origin :${branch}`, { optional: true });

  maybePush(["main", "develop", ...(branchExists("staging") ? ["staging"] : [])], [tag]);
  ok(`Hotfix ${tag} merged into main + develop${branchExists("staging") ? " + staging" : ""}.`);
}

function cmdPromote(target) {
  if (!target) die("Usage: gitflow promote <staging|main>");

  if (target === "staging") {
    requireClean();
    requireBranch("develop");
    requireBranch("staging");
    info("Merging develop → staging…");
    git("checkout staging");
    git("pull origin staging --ff-only", { optional: true });
    git("merge --no-ff develop -m \"Promote develop into staging\"");
    maybePush(["staging"]);
    ok("develop promoted to staging.");
    return;
  }

  if (target === "main") {
    requireClean();
    requireBranch("staging");
    requireBranch("main");
    const ver = readVersion();
    const tag = `v${ver}`;
    const existingTag = gitOut(`tag -l ${tag}`);
    info("Merging staging → main…");
    git("checkout main");
    git("pull origin main --ff-only", { optional: true });
    git("merge --no-ff staging -m \"Promote staging into main\"");
    if (!existingTag) {
      info(`Tagging ${tag}…`);
      git(`tag -a ${tag} -m "Release ${tag}"`);
      maybePush(["main"], [tag]);
    } else {
      console.log(`  Tag ${tag} already exists, skipping tag creation.`);
      maybePush(["main"]);
    }
    ok(`staging promoted to main${!existingTag ? ` and tagged ${tag}` : ""}.`);
    return;
  }

  die(`Unknown promote target "${target}". Use "staging" or "main".`);
}

function cmdStatus() {
  const branches = ["main", "staging", "develop"];
  const prefixes = ["feature", "fix", "release", "hotfix"];

  // gather all local branches matching flow prefixes
  const allLocal = gitOut("branch --format=%(refname:short)").split("\n").filter(Boolean);
  const flowBranches = allLocal.filter((b) =>
    prefixes.some((p) => b.startsWith(`${p}/`))
  );

  console.log("\nPragmatik Gitflow Status\n========================");

  for (const b of [...branches, ...flowBranches]) {
    if (!branchExists(b)) {
      console.log(`  ${b.padEnd(24)} [missing]`);
      continue;
    }
    const sha = gitOut(`rev-parse --short ${b}`);
    const isCurrent = b === currentBranch() ? " ← current" : "";
    const aheadBehind = b !== "main"
      ? (() => {
          const base = b.startsWith("hotfix/") ? "main" : b === "staging" ? "main" : "develop";
          if (b === base) return "";
          const ahead = gitOut(`rev-list --count ${base}..${b}`);
          const behind = gitOut(`rev-list --count ${b}..${base}`);
          return ` (↑${ahead} ↓${behind} vs ${base})`;
        })()
      : "";
    console.log(`  ${b.padEnd(24)} ${sha}${aheadBehind}${isCurrent}`);
  }

  const latestTag = gitOut("describe --tags --abbrev=0 2>/dev/null") || "(none)";
  console.log(`\n  Latest tag: ${latestTag}`);
  console.log(`  VERSION:    ${readVersion()}\n`);
}

// ─────────────────────────────── dispatch ───────────────────────────────────

function printHelp() {
  console.log(`
Pragmatik Gitflow — usage:

  node scripts/gitflow.js feature start <name>
  node scripts/gitflow.js feature finish <name>
  node scripts/gitflow.js fix start <name>
  node scripts/gitflow.js fix finish <name>
  node scripts/gitflow.js release start <version>
  node scripts/gitflow.js release finish <version>
  node scripts/gitflow.js hotfix start <version>
  node scripts/gitflow.js hotfix finish <version>
  node scripts/gitflow.js promote staging
  node scripts/gitflow.js promote main
  node scripts/gitflow.js status

Flags:
  --push       Push branches/tags to origin after finish
  --dry-run    Print commands without executing

npm shortcuts:
  npm run gf:feature [start|finish] <name>
  npm run gf:fix [start|finish] <name>
  npm run gf:release [start|finish] <version>
  npm run gf:hotfix [start|finish] <version>
  npm run gf:promote [staging|main]
  npm run gf:status
`);
}

const rawArgs = process.argv.slice(2);
const args = rawArgs.filter((a) => {
  if (a === "--dry-run") { DRY_RUN = true; return false; }
  if (a === "--push")    { DO_PUSH = true; return false; }
  return true;
});

const [cmd, sub, name] = args;

if (!cmd || cmd === "help" || cmd === "--help") {
  printHelp();
  process.exit(0);
}

if (cmd === "feature") {
  if (sub === "start")  cmdFeatureStart(name);
  else if (sub === "finish") cmdFeatureFinish(name);
  else die(`Unknown feature subcommand "${sub}". Use start or finish.`);
} else if (cmd === "fix") {
  if (sub === "start")  cmdFixStart(name);
  else if (sub === "finish") cmdFixFinish(name);
  else die(`Unknown fix subcommand "${sub}". Use start or finish.`);
} else if (cmd === "release") {
  if (sub === "start")  cmdReleaseStart(name);
  else if (sub === "finish") cmdReleaseFinish(name);
  else die(`Unknown release subcommand "${sub}". Use start or finish.`);
} else if (cmd === "hotfix") {
  if (sub === "start")  cmdHotfixStart(name);
  else if (sub === "finish") cmdHotfixFinish(name);
  else die(`Unknown hotfix subcommand "${sub}". Use start or finish.`);
} else if (cmd === "promote") {
  cmdPromote(sub);
} else if (cmd === "status") {
  cmdStatus();
} else {
  die(`Unknown command "${cmd}". Run: node scripts/gitflow.js help`);
}
