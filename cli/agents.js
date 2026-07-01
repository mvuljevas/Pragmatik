#!/usr/bin/env node
import { createServer } from "node:http";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const VERSION = "0.21.0";
const ROOT = process.cwd();
const CLI_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(CLI_DIR, "..");

const TOOL_REGISTRY = [
  {
    id: "tokscale",
    name: "Tokscale",
    category: "measurement",
    maturity: "stable",
    defaultSelected: false,
    commands: ["tokscale", "npx -y tokscale@latest"],
    description: "Measures multi-client AI token usage and can submit usage to a dashboard."
  },
  {
    id: "repomix",
    name: "Repomix",
    category: "context-packaging",
    maturity: "stable",
    defaultSelected: true,
    commands: ["repomix", "npx -y repomix@latest"],
    description: "Builds bounded repository context packs for AI agents."
  },
  {
    id: "tokless",
    name: "Tokless",
    category: "optimization",
    maturity: "stable",
    defaultSelected: true,
    commands: ["tokless"],
    description: "Installs token-saving plugins for compatible AI coding agents."
  },
  {
    id: "context7",
    name: "Context7",
    category: "documentation",
    maturity: "stable",
    defaultSelected: false,
    commands: ["ctx7", "npx -y ctx7@latest"],
    description: "Fetches current library and framework documentation."
  },
  {
    id: "mcp-compressor",
    name: "mcp-compressor",
    category: "mcp-optimization",
    maturity: "optional",
    defaultSelected: false,
    commands: ["mcp-compressor"],
    description: "Compresses or routes MCP context when MCP overhead is material."
  },
  {
    id: "token-optimizer-mcp",
    name: "token-optimizer-mcp",
    category: "experimental",
    maturity: "verify-before-use",
    defaultSelected: false,
    commands: ["token-optimizer-mcp"],
    description: "Experimental MCP token optimizer; verify behavior before enabling."
  },
  {
    id: "sourcegraph-cody",
    name: "Sourcegraph Cody Enterprise",
    category: "paid-context",
    maturity: "paid",
    defaultSelected: false,
    commands: ["src"],
    description: "Paid code intelligence and multi-repository context option."
  },
  {
    id: "cursor-teams",
    name: "Cursor Teams",
    category: "paid-measurement",
    maturity: "paid",
    defaultSelected: false,
    commands: ["cursor"],
    description: "Paid team usage analytics and AI editor workflow."
  }
];

const LOWER_FLAGS = new Set([
  "--help",
  "--version",
  "--init",
  "--setup",
  "--doctor",
  "--run",
  "--dashboard",
  "--suggest",
  "--mcp-create",
  "--dry-run",
  "--yes",
  "--issue",
  "--idea",
  "--port",
  "--no-open"
]);

main().catch((error) => {
  printError(error.message);
  process.exitCode = 1;
});

async function main() {
  const args = process.argv.slice(2);
  rejectUppercaseFlags(args);

  if (args.length === 0 || args.includes("--help")) {
    printHelp();
    return;
  }
  if (args.includes("--version")) {
    console.log(VERSION);
    return;
  }
  if (args.includes("--doctor")) {
    printDoctor(detectProject(ROOT));
    return;
  }
  if (args.includes("--dashboard")) {
    await startDashboard({ keepAlive: true, open: !args.includes("--no-open"), port: numberArg(args, "--port") });
    return;
  }
  if (args.includes("--run")) {
    await runWithDashboard(args);
    return;
  }
  if (args.includes("--setup") || args.includes("--init")) {
    await setupProject({ initMode: args.includes("--init"), dryRun: args.includes("--dry-run"), yes: args.includes("--yes") });
    return;
  }
  if (args.includes("--suggest")) {
    suggestTemplate({ idea: valueArg(args, "--idea") || "", issue: args.includes("--issue"), dryRun: args.includes("--dry-run"), yes: args.includes("--yes") });
    return;
  }
  if (args.includes("--mcp-create")) {
    createProjectMcp({ dryRun: args.includes("--dry-run") });
    return;
  }

  throw new Error(`unknown command. Run agents --help.`);
}

function rejectUppercaseFlags(args) {
  for (const arg of args) {
    if (arg.startsWith("--") && /[A-Z]/.test(arg)) {
      throw new Error(`Unsupported option ${arg}. Run agents --help to see supported commands.`);
    }
    if (arg.startsWith("--") && !LOWER_FLAGS.has(arg) && !arg.includes("=")) {
      throw new Error(`Unsupported option ${arg}. Run agents --help to see supported commands.`);
    }
  }
}

function printHelp() {
  const project = detectProject(ROOT);
  console.log(`AGENTS ${VERSION}

Project governance, AI-tool setup, local dashboard, and template guidance for
new or existing repositories.

Usage:
  agents --help                         Show this guide.
  agents --doctor                       Inspect the current repository.
  agents --init [--dry-run] [--yes]     Prepare a new project.
  agents --setup [--dry-run] [--yes]    Adopt AGENTS in an existing project.
  agents --run -- <command>             Run a command with AGENTS dashboard.
  agents --dashboard [--no-open]        Start the local dashboard.
  agents --suggest --idea "..."         Recommend a template and preset.
  agents --mcp-create [--dry-run]       Scaffold a read-only project MCP.

Common flows:
  New project:
    agents --init

  Existing project:
    agents --doctor
    agents --setup --dry-run
    agents --setup

  Project without Node artifacts:
    npx -y @mvuljevas/agents --doctor
    npx -y @mvuljevas/agents --setup

Safety:
  - Setup always previews changes before writing.
  - Interactive runs ask for confirmation before writing.
  - Non-interactive runs require --yes to write.
  - Existing package scripts are not replaced by default.

Detected here:
  - stack: ${project.stack.name}
  - state: ${project.projectState}
  - next: ${recommendedCommand(project)}
`);
}

function detectProject(cwd) {
  const packageJson = readJson(join(cwd, "package.json"));
  const env = readEnv(join(cwd, ".agents.env")) || readEnv(join(cwd, ".agents.env.example"));
  const templates = listTemplates();
  const stack = detectStack(cwd, packageJson);
  return {
    cwd,
    isGit: existsSync(join(cwd, ".git")),
    hasAgents: existsSync(join(cwd, "AGENTS.md")),
    hasReadme: existsSync(join(cwd, "README.md")),
    hasDocs: existsSync(join(cwd, "docs")),
    hasPackageJson: Boolean(packageJson),
    packageJson,
    packageManager: detectPackageManager(cwd),
    stack,
    projectState: detectProjectState(cwd, packageJson),
    scripts: packageJson?.scripts || {},
    hasAiRuns: existsSync(join(cwd, ".ai-runs")),
    env,
    templates,
    tools: TOOL_REGISTRY.map((tool) => ({ ...tool, available: tool.commands.some(commandAvailable) })),
    clients: detectClients(cwd)
  };
}

function printDoctor(project) {
  const assessment = assessProject(project);
  printSection("AGENTS doctor");
  printKV("Repository", project.cwd);
  printKV("State", project.projectState);
  printKV("Stack", `${project.stack.name} (${project.stack.confidence})`);
  printKV("Git", project.isGit ? "yes" : "no");
  printKV("AGENTS.md", project.hasAgents ? "present" : "missing");
  printKV("README.md", project.hasReadme ? "present" : "missing");
  printKV("docs/", project.hasDocs ? "present" : "missing");
  printKV("Package manager", project.packageManager);
  printKV("Dashboard data", project.hasAiRuns ? "present" : "missing");
  printKV("Detected clients", project.clients.join(", ") || "none");

  printSection("Readiness");
  for (const item of assessment) {
    console.log(`${statusIcon(item.level)} ${item.label}: ${item.message}`);
  }

  printSection("Optional tools");
  for (const tool of project.tools) {
    console.log(`${tool.available ? "ok" : "--"} ${tool.id.padEnd(21)} ${tool.available ? "available" : "missing"}  ${tool.category}  ${tool.maturity}`);
  }

  printSection("Templates");
  for (const template of project.templates) {
    console.log(`- ${template.name}: ${template.available ? "available" : "missing"}`);
  }

  printSection("Recommended next step");
  console.log(`- ${recommendedCommand(project)}`);
}

function detectStack(cwd, packageJson) {
  if (existsSync(join(cwd, "artisan")) || existsSync(join(cwd, "composer.json")) && readText(join(cwd, "composer.json")).includes("laravel/framework")) {
    return { name: packageJson ? "laravel-node" : "laravel", confidence: "high" };
  }
  if (existsSync(join(cwd, "manifest.json"))) {
    const manifest = readJson(join(cwd, "manifest.json"));
    if (manifest?.manifest_version) return { name: "chrome-extension-vanilla", confidence: "high" };
  }
  if (packageJson?.dependencies?.vite || packageJson?.devDependencies?.vite) {
    return { name: "react-vite-spa", confidence: packageJson.dependencies?.react || packageJson.devDependencies?.react ? "high" : "medium" };
  }
  if (packageJson) return { name: "node", confidence: "medium" };
  if (existsSync(join(cwd, "README.md")) || existsSync(join(cwd, "docs"))) return { name: "docs-only", confidence: "medium" };
  return { name: "unknown", confidence: "low" };
}

function detectProjectState(cwd, packageJson) {
  if (existsSync(join(cwd, "AGENTS.md")) && existsSync(join(cwd, ".agents.env"))) return "agents-configured";
  if (existsSync(join(cwd, "AGENTS.md"))) return "agents-partial";
  if (packageJson || existsSync(join(cwd, "composer.json")) || existsSync(join(cwd, "artisan")) || existsSync(join(cwd, "manifest.json"))) return "existing-project";
  return "new-or-empty";
}

function assessProject(project) {
  const items = [];
  items.push({
    level: project.hasAgents ? "ok" : "warn",
    label: "Governance",
    message: project.hasAgents ? "AGENTS.md is present." : "AGENTS.md is missing; run agents --setup to add project rules."
  });
  items.push({
    level: project.env ? "ok" : "warn",
    label: "Local config",
    message: project.env ? ".agents.env or sample config is present." : ".agents.env is missing; setup can create non-secret local defaults."
  });
  items.push({
    level: project.hasReadme ? "ok" : "warn",
    label: "README",
    message: project.hasReadme ? "README.md is present." : "README.md is missing; templates should include one."
  });
  items.push({
    level: project.stack.confidence === "low" ? "warn" : "ok",
    label: "Stack",
    message: project.stack.confidence === "low" ? "Stack was not recognized; use agents --suggest --idea to choose a template." : `Detected ${project.stack.name}.`
  });
  items.push({
    level: project.tools.some((tool) => tool.available) ? "ok" : "info",
    label: "AI tools",
    message: project.tools.some((tool) => tool.available) ? "At least one optional AI tool is available." : "No optional AI tools were found; setup remains usable without them."
  });
  return items;
}

function recommendedCommand(project) {
  if (!project.hasAgents) return "Run agents --setup --dry-run, then agents --setup after reviewing the preview.";
  if (!project.env) return "Run agents --setup --dry-run to create local non-secret AGENTS config.";
  if (!project.hasAiRuns) return "Run agents --run to generate the first local usage and optimization reports.";
  return "Run agents --dashboard to review coverage, reports, and next actions.";
}

function printSetupIntro(project, initMode) {
  printSection(initMode ? "Initialize project" : "Adopt AGENTS");
  printKV("Repository", project.cwd);
  printKV("Detected stack", `${project.stack.name} (${project.stack.confidence})`);
  printKV("Detected state", project.projectState);
  console.log("");
  console.log("This wizard can create local AGENTS configuration, rollback notes, optional npm scripts when package.json exists, and safe AI-tool defaults.");
  console.log("No external tool is mandatory.");
}

function recommendationReason(template) {
  if (template === "react-vite-spa") return "The idea mentions React, Vite, SPA, or PWA terms.";
  if (template === "laravel-react") return "The idea mentions Laravel, PHP, or Inertia-style application terms.";
  if (template === "chrome-extension-vanilla") return "The idea mentions Chrome, browser, or extension terms.";
  return "No stack-specific signal was detected, so the docs-only foundation is safest.";
}

async function setupProject({ initMode, dryRun, yes }) {
  const project = detectProject(ROOT);
  const interactive = process.stdin.isTTY && !yes;
  const answers = {
    projectMode: initMode ? "new" : project.hasAgents ? "existing" : "existing",
    profile: "balanced",
    privacy: "dry-run",
    selectedTools: TOOL_REGISTRY.filter((tool) => tool.defaultSelected).map((tool) => tool.id)
  };

  printSetupIntro(project, initMode);

  if (interactive) {
    const rl = createInterface({ input, output });
    answers.projectMode = await ask(rl, "Project mode [new/existing]", answers.projectMode);
    answers.profile = await ask(rl, "Setup profile [conservative/balanced/aggressive]", answers.profile);
    answers.privacy = await ask(rl, "AI submit mode [off/dry-run/on]", answers.privacy);
    const defaults = answers.selectedTools.join(",");
    const tools = await ask(rl, "Optional tools to enable [comma list]", defaults);
    answers.selectedTools = tools.split(",").map((item) => item.trim()).filter(Boolean);
    await rl.close();
  }

  const changes = buildSetupChanges(project, answers);
  printChangePreview(changes, dryRun);
  printToolGuidance(answers.selectedTools);
  if (dryRun) return;
  if (!yes && !interactive) {
    console.log("");
    console.log("No changes were written.");
    console.log("Reason: this shell is non-interactive. Re-run with --yes after reviewing the preview.");
    return;
  }
  if (!yes && interactive) {
    const rl = createInterface({ input, output });
    const confirmed = await ask(rl, "Apply these changes? [y/N]", "N");
    await rl.close();
    if (confirmed.toLowerCase() !== "y") {
      console.log("Setup cancelled.");
      return;
    }
  }
  applyChanges(changes);
  printSection("Setup complete");
  console.log("- Run agents --doctor to verify repository readiness.");
  console.log("- Run agents --dashboard to inspect local usage and tooling status.");
}

function buildSetupChanges(project, answers) {
  const changes = [];
  const envPath = join(ROOT, ".agents.env");
  if (!project.hasAgents) {
    changes.push({
      path: join(ROOT, "AGENTS.md"),
      mode: "create",
      content: renderProjectAgents(project, answers)
    });
  }
  if (!project.hasReadme) {
    changes.push({
      path: join(ROOT, "README.md"),
      mode: "create",
      content: renderProjectReadme(project)
    });
  }
  const docs = {
    "docs/AI_CONTEXT.md": renderProjectAiContext(project),
    "docs/ROADMAP.md": renderProjectRoadmap(),
    "docs/SNAPSHOTS.md": renderProjectSnapshots(project),
    "docs/TECHDEBT.md": renderProjectTechDebt()
  };
  for (const [path, content] of Object.entries(docs)) {
    const absolute = join(ROOT, path);
    if (!existsSync(absolute)) {
      changes.push({ path: absolute, mode: "create", content });
    }
  }
  if (!existsSync(envPath)) {
    changes.push({
      path: envPath,
      mode: "create",
      content: renderAgentsEnv(answers)
    });
  }
  if (project.hasPackageJson) {
    const nextPackage = structuredClone(project.packageJson);
    nextPackage.scripts = nextPackage.scripts || {};
    const scripts = {
      agents: "agents --help",
      "agents:init": "agents --init",
      "agents:setup": "agents --setup",
      "agents:doctor": "agents --doctor",
      "agents:dashboard": "agents --dashboard",
      "agents:dev": "agents --run -- npm run dev"
    };
    let changed = false;
    for (const [key, value] of Object.entries(scripts)) {
      if (!nextPackage.scripts[key]) {
        nextPackage.scripts[key] = value;
        changed = true;
      }
    }
    if (nextPackage.name !== "@mvuljevas/agents") {
      nextPackage.devDependencies = nextPackage.devDependencies || {};
    }
    if (nextPackage.name !== "@mvuljevas/agents" && !nextPackage.devDependencies["@mvuljevas/agents"]) {
      nextPackage.devDependencies["@mvuljevas/agents"] = `^${VERSION}`;
      changed = true;
    }
    if (changed) {
      changes.push({
        path: join(ROOT, "package.json"),
        mode: "update",
        content: `${JSON.stringify(nextPackage, null, 2)}\n`
      });
    }
  }
  changes.push({
    path: join(ROOT, ".agents", "ROLLBACK.md"),
    mode: existsSync(join(ROOT, ".agents", "ROLLBACK.md")) ? "skip" : "create",
    content: renderRollback(changes, answers)
  });
  changes.push({
    path: join(ROOT, ".agents", "config.json"),
    mode: existsSync(join(ROOT, ".agents", "config.json")) ? "skip" : "create",
    content: `${JSON.stringify({
      version: VERSION,
      projectMode: answers.projectMode,
      profile: answers.profile,
      privacy: answers.privacy,
      selectedTools: answers.selectedTools,
      dashboard: { autoStart: true, wrapperOnly: true }
    }, null, 2)}\n`
  });
  return changes;
}

function renderProjectAgents(project, answers) {
  return `# Agent Workflow

This repository uses AGENTS project governance.

## Start

When the user asks to analyze the repository, inspect the project with minimal
context first:

1. Read \`README.md\`, \`AGENTS.md\`, and \`docs/AI_CONTEXT.md\`.
2. Check \`docs/SNAPSHOTS.md\`, \`docs/ROADMAP.md\`, and \`docs/TECHDEBT.md\`.
3. Inspect git status and the detected stack.
4. Summarize the current state.
5. Ask what the user wants to build or change next.

Recognize prompts such as:

- "Analiza el repo."
- "Analyze this repository."
- "What is the current state of this project?"

## Rules

- Do not overwrite existing project conventions without confirmation.
- Preview file changes before applying them.
- Keep README, roadmap, snapshots, and technical debt updated when project state changes.
- Use Semantic Versioning for meaningful iterations when the project defines a version source.
- Treat optional AI tools as opt-in unless local config explicitly enables them.

## Local Setup

- Setup profile: ${answers.profile}
- Submit mode: ${answers.privacy}
- Selected tools: ${answers.selectedTools.join(", ") || "none"}
- Detected stack at setup: ${project.stack.name}
`;
}

function renderProjectReadme(project) {
  return `# ${projectName(project)}

Project initialized with AGENTS workflow guidance.

## Start

\`\`\`bash
agents --doctor
agents --setup --dry-run
agents --dashboard
\`\`\`

If this project does not use Node, run AGENTS through \`npx\`:

\`\`\`bash
npx -y @mvuljevas/agents --doctor
\`\`\`

## Documentation

- \`AGENTS.md\`: agent workflow rules.
- \`docs/AI_CONTEXT.md\`: compact project context.
- \`docs/ROADMAP.md\`: next milestones.
- \`docs/SNAPSHOTS.md\`: project memory.
- \`docs/TECHDEBT.md\`: accepted debt and cleanup items.
`;
}

function renderProjectAiContext(project) {
  return `# AI Context

Compact context for agents working in this repository.

## Project

- Name: ${projectName(project)}.
- Detected stack: ${project.stack.name}.
- Project state: ${project.projectState}.
- Package manager: ${project.packageManager}.

## Start Here

1. Read \`README.md\` and \`AGENTS.md\`.
2. Review recent entries in \`docs/SNAPSHOTS.md\`.
3. Check open items in \`docs/ROADMAP.md\` and \`docs/TECHDEBT.md\`.
4. Use focused search before opening large files.
`;
}

function renderProjectRoadmap() {
  return `# Roadmap

Track the next logical milestones for this project.

## Next Milestones

1. Define the project goal.
2. Confirm the target stack and runtime commands.
3. Establish the first implementation milestone.

## Completed Milestones

- AGENTS workflow initialized.
`;
}

function renderProjectSnapshots(project) {
  const date = new Date().toISOString().slice(0, 10);
  return `# Snapshots

Chronological project memory for agents and maintainers.

## ${date} - AGENTS Workflow Initialized

Current state:

- AGENTS workflow files were created.
- Detected stack: ${project.stack.name}.
- Project state: ${project.projectState}.

Next suggested step:

- Define what should be built or changed first.
`;
}

function renderProjectTechDebt() {
  return `# Technical Debt

Track accepted shortcuts, risks, and cleanup items.

## Open

| ID | Priority | Area | Debt | Impact | Planned Resolution | GitHub |
| --- | --- | --- | --- | --- | --- | --- |

## Resolved

| ID | Priority | Area | Debt | Resolution |
| --- | --- | --- | --- | --- |
`;
}

function renderAgentsEnv(answers) {
  return `# Local non-secret AGENTS configuration.
AGENTS_CONTEXT_MODE=lean-context
AGENTS_SETUP_PROFILE=${answers.profile}
AGENTS_SELECTED_TOOLS=${answers.selectedTools.join(",")}
AGENTS_TOKSCALE_SUBMIT=${answers.privacy}
AGENTS_DASHBOARD=on
AGENTS_DASHBOARD_AUTOSTART=on
AGENTS_DASHBOARD_WRAPPER_ONLY=on
AGENTS_REPOMIX=${answers.selectedTools.includes("repomix") ? "on" : "ask"}
AGENTS_TOKSCALE=${answers.selectedTools.includes("tokscale") ? "on" : "ask"}
AGENTS_TOKLESS=${answers.selectedTools.includes("tokless") ? "on" : "ask"}
AGENTS_CONTEXT7=${answers.selectedTools.includes("context7") ? "on" : "ask"}
AGENTS_MCP=ask
`;
}

function renderRollback(changes, answers) {
  return `# AGENTS Rollback Notes

Generated by AGENTS ${VERSION}.

Profile: ${answers.profile}
Submit mode: ${answers.privacy}
Selected tools: ${answers.selectedTools.join(", ") || "none"}

To roll back this setup, remove files created by the setup preview and restore
any updated files from version control.
`;
}

function printChangePreview(changes, dryRun) {
  printSection(`Setup preview${dryRun ? " (dry-run)" : ""}`);
  if (changes.length === 0) {
    console.log("- No file changes required.");
    return;
  }
  for (const change of changes) {
    const note = change.mode === "skip" ? "already exists" : "pending";
    console.log(`- ${change.mode.padEnd(6)} ${relative(change.path)} (${note})`);
  }
}

function printToolGuidance(selectedTools) {
  printSection("Tool guidance");
  if (selectedTools.length === 0) {
    console.log("- No optional tools selected.");
    return;
  }
  for (const id of selectedTools) {
    const tool = TOOL_REGISTRY.find((entry) => entry.id === id);
    if (!tool) {
      console.log(`- ${id}: unknown tool; verify manually before enabling.`);
      continue;
    }
    console.log(`- ${tool.id}: ${tool.description}`);
    if (tool.id === "tokscale") {
      console.log("  auth: npx -y tokscale@latest login");
    }
    if (tool.id === "tokless") {
      console.log("  auth: none by default; run tokless --help to choose plugins.");
    }
    if (tool.id === "repomix") {
      console.log("  auth: none; AGENTS uses bounded local context packs.");
    }
    if (tool.id === "context7") {
      console.log("  auth: set CONTEXT7_API_KEY in a local ignored secret store.");
    }
  }
}

function applyChanges(changes) {
  for (const change of changes) {
    if (change.mode === "skip") continue;
    mkdirSync(dirname(change.path), { recursive: true });
    writeFileSync(change.path, change.content);
  }
}

async function runWithDashboard(args) {
  const separator = args.indexOf("--");
  const command = separator >= 0 ? args.slice(separator + 1) : [];
  const server = await startDashboard({ keepAlive: false, open: false });
  if (command.length === 0) {
    printSection("Running AGENTS tools");
    await runAiTools();
    await closeServer(server);
    return;
  }
  console.log(`AGENTS dashboard: ${server.url}`);
  const child = spawn(command[0], command.slice(1), { stdio: "inherit", shell: process.platform === "win32" });
  child.on("exit", async (code) => {
    await closeServer(server);
    process.exitCode = code ?? 0;
  });
}

async function runAiTools() {
  const script = join(ROOT, "scripts", "ai-tools.sh");
  if (!existsSync(script)) {
    console.log("No scripts/ai-tools.sh found. Nothing to run.");
    return;
  }
  const result = spawnSync("bash", [script, "run"], { stdio: "inherit" });
  if (result.status && result.status !== 0) {
    throw new Error(`ai-tools failed with exit code ${result.status}`);
  }
}

async function startDashboard({ keepAlive, open, port = 8787 }) {
  const project = detectProject(ROOT);
  const html = renderDashboard(project);
  const server = createServer((req, res) => {
    if (req.url === "/data.json") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(buildDashboardData(project), null, 2));
      return;
    }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html);
  });
  const selectedPort = await listen(server, port);
  const url = `http://127.0.0.1:${selectedPort}`;
  server.url = url;
  console.log(`AGENTS dashboard: ${url}`);
  if (open) openUrl(url);
  if (keepAlive) {
    console.log("Press Ctrl+C to stop.");
  }
  return server;
}

function renderDashboard(project) {
  const data = buildDashboardData(project);
  const rows = data.tools.map((tool) => `<tr><td>${escapeHtml(tool.id)}</td><td>${tool.available ? "available" : "missing"}</td><td>${escapeHtml(tool.category)}</td><td>${escapeHtml(tool.maturity)}</td></tr>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AGENTS Dashboard</title>
<style>
body{margin:0;font-family:Inter,ui-sans-serif,system-ui,sans-serif;background:#f7f8fb;color:#12151c}
main{max-width:1120px;margin:0 auto;padding:32px}
h1{font-size:32px;margin:0 0 8px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:24px 0}
.card{background:white;border:1px solid #e4e7ee;border-radius:8px;padding:16px}
.value{font-size:24px;font-weight:700;margin-top:8px}
table{width:100%;border-collapse:collapse;background:white;border:1px solid #e4e7ee;border-radius:8px;overflow:hidden}
td,th{padding:10px;border-bottom:1px solid #eef0f4;text-align:left;font-size:14px}
.muted{color:#5d6678}
</style>
</head>
<body>
<main>
<h1>AGENTS Dashboard</h1>
<p class="muted">${escapeHtml(data.cwd)}</p>
<section class="grid">
<div class="card">Detected agents<div class="value">${data.clients.length}</div></div>
<div class="card">Available tools<div class="value">${data.tools.filter((tool) => tool.available).length}/${data.tools.length}</div></div>
<div class="card">Last usage tokens<div class="value">${escapeHtml(data.lastUsage.tokens)}</div></div>
<div class="card">Estimated cost<div class="value">${escapeHtml(data.lastUsage.cost)}</div></div>
<div class="card">Optimized context<div class="value">${escapeHtml(data.lastUsage.contextTokens)}</div></div>
<div class="card">Savings<div class="value">${escapeHtml(data.lastUsage.savings)}</div></div>
</section>
<h2>Tool Status</h2>
<table><thead><tr><th>Tool</th><th>Status</th><th>Category</th><th>Maturity</th></tr></thead><tbody>${rows}</tbody></table>
<h2>Next Actions</h2>
<ul>${data.nextActions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
</main>
</body>
</html>`;
}

function buildDashboardData(project) {
  const optimization = readText(join(ROOT, "docs", "AI_OPTIMIZATION_REPORT.md"));
  const usage = readText(join(ROOT, "docs", "AI_USAGE_REPORT.md"));
  return {
    cwd: project.cwd,
    clients: project.clients,
    tools: project.tools,
    lastUsage: {
      tokens: matchLast(optimization, /Measured tokens: ([^.]+)\./) || "not measured",
      cost: matchLast(optimization, /Measured cost: ([^.]+)\./) || "not measured",
      contextTokens: matchLast(optimization, /Optimized Repomix pack: ([^.]+)\./) || "not measured",
      savings: optimization.includes("Estimated savings: not claimed") ? "baseline required" : "not measured"
    },
    reports: {
      usage: Boolean(usage),
      optimization: Boolean(optimization)
    },
    nextActions: nextActions(project)
  };
}

function nextActions(project) {
  const actions = [];
  if (!project.tools.find((tool) => tool.id === "tokscale")?.available) actions.push("Install or use npx Tokscale for usage measurement.");
  if (!project.tools.find((tool) => tool.id === "tokless")?.available) actions.push("Tokless is optional; install it only if you want prompt/plugin optimization.");
  if (!project.hasAgents) actions.push("Add AGENTS.md or run agents --setup to adopt governance rules.");
  if (actions.length === 0) actions.push("Run a matched baseline vs optimized task before claiming savings.");
  return actions;
}

function suggestTemplate({ idea, issue, dryRun, yes }) {
  const normalized = idea.toLowerCase();
  let template = "docs-only";
  if (/react|vite|spa|pwa/.test(normalized)) template = "react-vite-spa";
  if (/laravel|inertia|php/.test(normalized)) template = "laravel-react";
  if (/chrome|extension|browser/.test(normalized)) template = "chrome-extension-vanilla";
  printSection("Recommendation");
  printKV("Template", template);
  printKV("Preset", "lean-context");
  printKV("Reason", recommendationReason(template));
  console.log("");
  console.log("Next:");
  console.log(`- Start from templates/${template}/ when creating a new project.`);
  console.log("- Apply presets/lean-context/ when adopting an existing project.");
  if (issue) {
    const body = [
      "# Template Request",
      "",
      `Idea: ${idea || "not provided"}`,
      "",
      `Current recommendation: ${template} + lean-context`,
      "",
      "Reason: no more specific template was selected by the current heuristic."
    ].join("\n");
    console.log("Issue draft:");
    console.log("Title: Add template for requested project type");
    console.log(body);
    if (!dryRun && yes) {
      const result = spawnSync("gh", [
        "issue",
        "create",
        "--repo",
        "mvuljevas/AGENTS",
        "--title",
        "Add template for requested project type",
        "--body",
        body,
        "--label",
        "type:docs,area:template,status:triage"
      ], { stdio: "inherit" });
      if (result.status !== 0) {
        throw new Error("failed to create GitHub issue with gh");
      }
    } else if (!dryRun) {
      console.log("Create the issue with gh only after explicit user confirmation.");
    }
  }
}

function createProjectMcp({ dryRun }) {
  const target = join(ROOT, ".agents", "mcp", "project-context-mcp.mjs");
  const content = `#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";

const resources = {
  "project://summary": () => read("docs/AI_CONTEXT.md") || read("README.md"),
  "project://repo-map": () => read("docs/AI_SEARCH.md") || "",
  "project://version": () => read("VERSION") || packageVersion(),
  "project://recent-snapshots": () => tail("docs/SNAPSHOTS.md", 120),
  "project://techdebt": () => read("docs/TECHDEBT.md") || "",
  "project://commands": () => read("package.json") || "",
  "project://tool-status": () => read("docs/AI_OPTIMIZATION_REPORT.md") || ""
};

function read(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8").slice(0, 20000);
}

function tail(path, lines) {
  const text = read(path);
  return text.split("\\n").slice(-lines).join("\\n");
}

function packageVersion() {
  try {
    return JSON.parse(readFileSync("package.json", "utf8")).version || "";
  } catch {
    return "";
  }
}

console.log(JSON.stringify({ resources: Object.keys(resources) }, null, 2));
`;
  if (dryRun) {
    printSection("MCP scaffold preview");
    console.log(`- create ${relative(target)}`);
    return;
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
  printSection("MCP scaffold complete");
  console.log(`- Created ${relative(target)}`);
}

function listTemplates() {
  const root = existsSync(join(ROOT, "templates")) ? ROOT : PACKAGE_ROOT;
  const templatesDir = join(root, "templates");
  if (!existsSync(templatesDir)) return [];
  return readdirSync(templatesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ name: entry.name, available: true }));
}

function detectPackageManager(cwd) {
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  if (existsSync(join(cwd, "bun.lockb"))) return "bun";
  if (existsSync(join(cwd, "package-lock.json"))) return "npm";
  return existsSync(join(cwd, "package.json")) ? "npm" : "none";
}

function detectClients(cwd) {
  const clients = [];
  if (existsSync(join(cwd, ".codex"))) clients.push("codex");
  if (existsSync(join(cwd, ".cursor"))) clients.push("cursor");
  if (existsSync(join(cwd, ".mcp.json"))) clients.push("claude-compatible");
  if (commandAvailable("cursor")) clients.push("cursor-global");
  if (commandAvailable("claude")) clients.push("claude");
  if (commandAvailable("gemini")) clients.push("gemini");
  if (commandAvailable("ollama")) clients.push("ollama");
  return [...new Set(clients)];
}

function commandAvailable(command) {
  const bin = command.split(" ")[0];
  return spawnSync("sh", ["-lc", `command -v ${shellQuote(bin)} >/dev/null 2>&1`]).status === 0;
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

function readEnv(path) {
  if (!existsSync(path)) return null;
  const env = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) continue;
    const [key, ...rest] = line.split("=");
    env[key.trim()] = rest.join("=").trim();
  }
  return env;
}

function readText(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function printSection(title) {
  console.log("");
  console.log(title);
  console.log("-".repeat(title.length));
}

function printKV(label, value) {
  console.log(`${label.padEnd(18)} ${value}`);
}

function statusIcon(level) {
  if (level === "ok") return "ok ";
  if (level === "warn") return "warn";
  return "info";
}

function printError(message) {
  console.error("");
  console.error("AGENTS error");
  console.error("------------");
  console.error(message);
  console.error("");
  console.error("Run agents --help for usage and examples.");
}

function matchLast(text, regex) {
  const matches = [...text.matchAll(new RegExp(regex.source, "g"))];
  return matches.length ? matches.at(-1)[1] : "";
}

function ask(rl, question, defaultValue) {
  return rl.question(`${question} (${defaultValue}): `).then((answer) => answer.trim() || defaultValue);
}

function valueArg(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) return "";
  return args[index + 1] || "";
}

function numberArg(args, flag) {
  const value = Number(valueArg(args, flag));
  return Number.isFinite(value) && value > 0 ? value : 8787;
}

function relative(path) {
  return path.replace(`${ROOT}/`, "");
}

function projectName(project) {
  if (project.packageJson?.name) return project.packageJson.name;
  return ROOT.split(/[\\/]/).filter(Boolean).at(-1) || "project";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

function listen(server, port) {
  return new Promise((resolveListen) => {
    server.once("error", () => resolveListen(listen(server, port + 1)));
    server.listen(port, "127.0.0.1", () => resolveListen(server.address().port));
  });
}

function closeServer(server) {
  return new Promise((resolveClose) => server.close(resolveClose));
}

function openUrl(url) {
  const command = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  spawn(command, [url], { stdio: "ignore", detached: true, shell: process.platform === "win32" }).unref();
}
