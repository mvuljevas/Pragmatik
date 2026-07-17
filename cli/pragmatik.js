#!/usr/bin/env node
import { createServer } from "node:http";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { emitKeypressEvents } from "node:readline";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { homedir } from "node:os";
import { createHash } from "node:crypto";

const VERSION = "0.5.0";
const ROOT = process.cwd();

const CLI_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(CLI_DIR, "..");

const TOOL_REGISTRY = [
  {
    id: "tokscale",
    name: "Tokscale",
    category: "measurement",
    group: "Measurement tools",
    maturity: "stable",
    defaultSelected: false,
    commands: ["tokscale", "npx -y tokscale@latest"],
    description: "Measures multi-client AI token usage and can submit usage to a dashboard."
  },
  {
    id: "repomix",
    name: "Repomix",
    category: "context-packaging",
    group: "Context packaging",
    maturity: "stable",
    defaultSelected: true,
    commands: ["repomix", "npx -y repomix@latest"],
    description: "Builds bounded repository context packs. This is context reduction, not a runtime optimizer."
  },
  {
    id: "tokless",
    name: "Tokless",
    category: "optimization",
    group: "Optimization tools",
    maturity: "stable",
    defaultSelected: true,
    commands: ["tokless"],
    description: "Installs token-saving plugins for compatible AI coding agents."
  },
  {
    id: "context7",
    name: "Context7",
    category: "documentation",
    group: "Documentation MCPs",
    maturity: "stable",
    defaultSelected: false,
    commands: ["ctx7", "npx -y ctx7@latest"],
    description: "Fetches current library and framework documentation."
  },
  {
    id: "mcp-compressor",
    name: "mcp-compressor",
    category: "mcp-optimization",
    group: "Optimization MCPs",
    maturity: "optional",
    defaultSelected: false,
    commands: ["mcp-compressor"],
    description: "Compresses or routes MCP context when MCP overhead is material."
  },
  {
    id: "token-optimizer-mcp",
    name: "token-optimizer-mcp",
    category: "experimental",
    group: "Optimization MCPs",
    maturity: "verify-before-use",
    defaultSelected: false,
    commands: ["token-optimizer-mcp"],
    description: "Experimental MCP token optimizer; verify behavior before enabling."
  },
  {
    id: "sourcegraph-cody",
    name: "Sourcegraph Cody Enterprise",
    category: "paid-context",
    group: "Paid context tools",
    maturity: "paid",
    defaultSelected: false,
    commands: ["src"],
    description: "Paid code intelligence and multi-repository context option."
  },
  {
    id: "cursor-teams",
    name: "Cursor Teams",
    category: "paid-measurement",
    group: "Measurement tools",
    maturity: "paid",
    defaultSelected: false,
    commands: ["cursor"],
    description: "Paid team usage analytics and AI editor workflow."
  }
];

const MODEL_PRICING = {
  "claude-3-5-sonnet": { input: 3.0, output: 15.0 },
  "claude-3-opus": { input: 15.0, output: 75.0 },
  "gpt-4o": { input: 2.5, output: 10.0 },
  "gemini-1.5-pro": { input: 1.25, output: 5.0 },
  "gemini-2.5-pro": { input: 1.25, output: 10.0 },
  "gemini-2.5-flash": { input: 0.075, output: 0.3 }
};

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
  "--measure",
  "--report",
  "--login",
  "--dry-run",
  "--yes",
  "--issue",
  "--idea",
  "--port",
  "--no-open",
  "--client",
  "--session-id",
  "--since",
  "--human-hours",
  "--hourly-rate",
  "--task",
  "--model-price-input",
  "--model-price-output"
]);

const COMMANDS = new Set([
  "help",
  "version",
  "init",
  "setup",
  "doctor",
  "dashboard",
  "run",
  "suggest",
  "mcp-create",
  "measure",
  "report",
  "login"
]);

main().catch((error) => {
  printError(error.message);
  process.exitCode = 1;
});

async function main() {
  const rawArgs = process.argv.slice(2);
  rejectUppercaseFlags(rawArgs);
  const args = normalizeArgs(rawArgs);

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
    await startDashboard({ keepAlive: true, open: !args.includes("--no-open") });
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
  if (args.includes("--measure")) {
    await runMeasure(args);
    return;
  }
  if (args.includes("--report")) {
    await runReport();
    return;
  }
  if (args.includes("--login")) {
    await runLogin();
    return;
  }

  throw new Error(`unknown command. Run pragmatik help.`);
}

function normalizeArgs(args) {
  if (args.length === 0) return args;
  const [first, ...rest] = args;
  if (!COMMANDS.has(first)) return args;
  if (first === "help") return ["--help", ...rest];
  if (first === "version") return ["--version", ...rest];
  if (first === "mcp-create") return ["--mcp-create", ...rest];
  return [`--${first}`, ...rest];
}

function rejectUppercaseFlags(args) {
  for (const arg of args) {
    if (arg.startsWith("--") && /[A-Z]/.test(arg)) {
      throw new Error(`Unsupported option ${arg}. Run pragmatik help to see supported commands.`);
    }
    if (arg.startsWith("--") && !LOWER_FLAGS.has(arg) && !arg.includes("=")) {
      throw new Error(`Unsupported option ${arg}. Run pragmatik help to see supported commands.`);
    }
  }
}

function printHelp() {
  const project = detectProject(ROOT);
  console.log(`Pragmatik ${VERSION}

Project governance, AI-tool setup, local dashboard, and template guidance for
new or existing repositories.

Usage:
  pragmatik help                           Show this guide.
  pragmatik doctor                         Inspect the current repository.
  pragmatik init [--dry-run] [--yes]       Prepare a new project.
  pragmatik setup [--dry-run] [--yes]      Adopt Pragmatik in an existing project.
  pragmatik run -- <command>               Run a command with Pragmatik dashboard.
  pragmatik dashboard [--no-open]          Show dashboard status; real UI is planned.
  pragmatik suggest --idea "..."           Recommend a template and preset.
  pragmatik mcp-create [--dry-run]         Scaffold a read-only project MCP.
  pragmatik login                          Authenticate machine with Pragmatik.
  pragmatik measure [options]              Parse transcripts and calculate session metrics.
  pragmatik report                         Print comparative session report in console.

Common flows:
  New project:
    pragmatik init

  Existing project:
    pragmatik doctor
    pragmatik setup --dry-run
    pragmatik setup

  Project without Node artifacts:
    npx -y @mvuljevas/pragmatik doctor
    npx -y @mvuljevas/pragmatik setup

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
  const env = readEnv(join(cwd, ".pragmatik.env")) || readEnv(join(cwd, ".agents.env"));
  const templates = listTemplates();
  const stack = detectStack(cwd, packageJson);
  const projectState = detectProjectState(cwd, packageJson);
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
    projectState,
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
  printSection("Pragmatik doctor");
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
  if (isGithubMinimalRepo(cwd)) return { name: "unselected", confidence: "high" };
  if (existsSync(join(cwd, "docs"))) return { name: "docs-only", confidence: "medium" };
  if (existsSync(join(cwd, "README.md"))) return { name: "docs-only", confidence: "low" };
  return { name: "unknown", confidence: "low" };
}

function detectProjectState(cwd, packageJson) {
  if (existsSync(join(cwd, "AGENTS.md")) && existsSync(join(cwd, ".pragmatik.env"))) return "agents-configured";
  if (existsSync(join(cwd, "AGENTS.md"))) return "agents-partial";
  if (packageJson || existsSync(join(cwd, "composer.json")) || existsSync(join(cwd, "artisan")) || existsSync(join(cwd, "manifest.json"))) return "existing-project";
  if (isGithubMinimalRepo(cwd)) return "github-minimal";
  return "new-or-empty";
}

function isGithubMinimalRepo(cwd) {
  const entries = safeReaddir(cwd).filter((entry) => !entry.startsWith(".DS_Store"));
  if (entries.length === 0) return true;
  const allowed = new Set([".git", "README.md", "LICENSE", "LICENSE.md", ".gitignore", ".gitattributes"]);
  return entries.every((entry) => allowed.has(entry));
}

function isMinimalReadme(path) {
  const text = readText(path).trim();
  if (!text) return true;
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length <= 3 && lines[0]?.startsWith("# ")) return true;
  return !/##\s+(Start|Installation|Usage|Documentation|Project Goal|Roadmap)/i.test(text);
}

function assessProject(project) {
  const items = [];
  items.push({
    level: project.hasAgents ? "ok" : "warn",
    label: "Governance",
    message: project.hasAgents ? "AGENTS.md is present." : "AGENTS.md is missing; run pragmatik setup to add project rules."
  });
  items.push({
    level: project.env ? "ok" : "warn",
    label: "Local config",
    message: project.env ? ".pragmatik.env is present." : ".pragmatik.env is missing; setup can create non-secret local defaults."
  });
  items.push({
    level: project.hasReadme ? "ok" : "warn",
    label: "README",
    message: project.hasReadme ? "README.md is present." : "README.md is missing; templates should include one."
  });
  items.push({
    level: project.stack.name === "unselected" || project.stack.confidence === "low" ? "warn" : "ok",
    label: "Stack",
    message: project.stack.name === "unselected" ? "No application stack has been selected yet; use agents suggest --idea to choose one." : project.stack.confidence === "low" ? "Stack was not recognized; use agents suggest --idea to choose a template." : `Detected ${project.stack.name}.`
  });
  items.push({
    level: project.tools.some((tool) => tool.available) ? "ok" : "info",
    label: "AI tools",
    message: project.tools.some((tool) => tool.available) ? "At least one optional AI tool is available." : "No optional AI tools were found; setup remains usable without them."
  });
  return items;
}

function recommendedCommand(project) {
  if (project.projectState === "github-minimal") return "Run pragmatik suggest --idea \"...\" to choose a template, then pragmatik init --dry-run.";
  if (!project.hasAgents) return "Run pragmatik setup --dry-run, then pragmatik setup after reviewing the preview.";
  if (!project.env) return "Run pragmatik setup --dry-run to create local non-secret Pragmatik config.";
  if (!project.hasAiRuns) return "Run pragmatik run to generate the first local usage and optimization reports.";
  return "Run pragmatik dashboard to review coverage, reports, and next actions.";
}

function printSetupIntro(project, initMode) {
  printSection(initMode ? "Initialize project" : "Adopt Pragmatik");
  printKV("Repository", project.cwd);
  printKV("Detected stack", `${project.stack.name} (${project.stack.confidence})`);
  printKV("Detected state", project.projectState);
  console.log("");
  if (project.projectState === "github-minimal") {
    console.log("This looks like a freshly created GitHub repository with only minimal files.");
    console.log("Pragmatik will treat it as a new project and can complete README, .gitignore, and .gitattributes after preview.");
  }
  console.log("This wizard can create local Pragmatik configuration, rollback notes, optional npm scripts when package.json exists, and safe AI-tool defaults.");
  console.log("No external tool is mandatory.");
}

function recommendationReason(template) {
  if (template === "react-vite-spa") return "The idea mentions React, Vite, SPA, or PWA terms.";
  if (template === "laravel-react") return "The idea mentions Laravel, PHP, or Inertia-style application terms.";
  if (template === "chrome-extension-vanilla") return "The idea mentions Chrome, browser, or extension terms.";
  return "No stack-specific signal was detected, so the docs-only foundation is safest.";
}

async function selectTools(project, answers) {
  const selected = new Set();
  const groups = [
    {
      title: "Measurement tools",
      description: "Track usage, cost, or coverage. Multiple tools can be selected.",
      ids: ["tokscale", "cursor-teams"]
    },
    {
      title: "Optimization and context tools",
      description: "Reduce or package context before it reaches an AI client.",
      ids: ["tokless", "repomix"]
    },
    {
      title: "MCPs and documentation context",
      description: "Add read-only context sources or MCP helpers.",
      ids: ["context7", "mcp-compressor", "token-optimizer-mcp", "sourcegraph-cody"]
    }
  ];

  for (const group of groups) {
    const tools = group.ids.map((id) => TOOL_REGISTRY.find((tool) => tool.id === id)).filter(Boolean);
    const values = await selectMany({
      title: group.title,
      description: group.description,
      options: tools.map((tool) => ({
        value: tool.id,
        label: tool.name,
        description: `${tool.description} ${tool.available ? "(available)" : "(not installed)"}`
      })),
      defaults: tools.filter((tool) => answers.selectedTools.includes(tool.id)).map((tool) => tool.id)
    });
    for (const value of values) selected.add(value);
  }

  printToolConflictNotes([...selected], project);
  await guideSelectedTools([...selected], answers);
  return [...selected];
}

function printToolConflictNotes(selectedTools, project) {
  printSection("Tool compatibility");
  if (selectedTools.length === 0) {
    console.log("- No optional tools selected.");
    return;
  }
  if (selectedTools.includes("tokscale") && selectedTools.includes("cursor-teams")) {
    console.log("- Tokscale and Cursor Teams can both measure usage. Keep both only if you want local plus team-level reporting.");
  }
  if (selectedTools.includes("tokless") && selectedTools.includes("mcp-compressor")) {
    console.log("- Tokless and MCP compression tools may both alter context. Enable one first, measure, then add the other if needed.");
  }
  if (selectedTools.includes("repomix")) {
    console.log("- Repomix packages context. It is useful for lean context, but it is not a live optimizer by itself.");
  }
  for (const id of selectedTools) {
    const tool = project.tools.find((entry) => entry.id === id);
    if (tool && !tool.available) console.log(`- ${id} is not installed. Pragmatik will write config guidance, not install it automatically.`);
  }
}

async function guideSelectedTools(selectedTools, answers) {
  if (selectedTools.length === 0) return;
  printSection("Tool setup guidance");
  for (const id of selectedTools) {
    if (id === "tokscale") {
      console.log("- Tokscale: requires login for remote dashboard submission.");
      console.log(`  Selected submit mode: ${answers.privacy}.`);
      console.log("  Run later: npx -y tokscale@latest login");
    } else if (id === "context7") {
      console.log("- Context7: requires an API key. Pragmatik will propose adding CONTEXT7_API_KEY placeholder to `.env`.");
      console.log("  Do NOT commit secrets to `.pragmatik.env` (which is versioned).");
    } else if (id === "tokless") {
      console.log("- Tokless: configure only the plugins you intend to use. Measure before and after enabling it.");
    } else if (id === "repomix") {
      console.log("- Repomix: use strict ignores and bounded output. It prepares context packs for AI clients.");
    } else if (id.includes("mcp")) {
      console.log(`- ${id}: keep read-only by default and restrict roots before exposing project context.`);
    }
  }
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
    answers.projectMode = await selectOne({
      title: "Project mode",
      options: [
        { value: "new", label: "New project", shortcut: "n", description: "Start from a GitHub-minimal or empty repository." },
        { value: "existing", label: "Existing project", shortcut: "e", description: "Adopt Pragmatik without overwriting existing conventions." }
      ],
      defaultValue: answers.projectMode
    });
    answers.profile = await selectOne({
      title: "Setup profile",
      options: [
        { value: "conservative", label: "Conservative", shortcut: "c", description: "Minimum local files, no external tooling enabled." },
        { value: "balanced", label: "Balanced", shortcut: "b", description: "Recommended local setup with safe optional defaults." },
        { value: "aggressive", label: "Aggressive", shortcut: "g", description: "Offer more tooling, still confirmed before writing." }
      ],
      defaultValue: answers.profile
    });
    answers.privacy = await selectOne({
      title: "Usage submission",
      options: [
        { value: "off", label: "Off", shortcut: "o", description: "Local-only. Do not submit usage externally." },
        { value: "dry-run", label: "Dry run", shortcut: "d", description: "Prepare reports without remote submission." },
        { value: "on", label: "On", shortcut: "s", description: "Submit usage when the selected tool is authenticated." }
      ],
      defaultValue: answers.privacy
    });
    answers.selectedTools = await selectTools(project, answers);
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
  console.log("- Run pragmatik doctor to verify repository readiness.");
  console.log("- Run pragmatik dashboard to inspect local usage and tooling status.");
}

function buildSetupChanges(project, answers) {
  const changes = [];
  const envPath = join(ROOT, ".pragmatik.env");
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
  } else if (project.projectState === "github-minimal" && isMinimalReadme(join(ROOT, "README.md"))) {
    changes.push({
      path: join(ROOT, "README.md"),
      mode: "update",
      content: renderProjectReadme(project)
    });
  }
  if (project.projectState === "github-minimal") {
    const gitignorePath = join(ROOT, ".gitignore");
    const gitattributesPath = join(ROOT, ".gitattributes");
    changes.push({
      path: gitignorePath,
      mode: existsSync(gitignorePath) ? "update" : "create",
      content: mergeGitignore(readText(gitignorePath))
    });
    changes.push({
      path: gitattributesPath,
      mode: existsSync(gitattributesPath) ? "update" : "create",
      content: mergeGitattributes(readText(gitattributesPath))
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
      content: renderPragmatikEnv(answers)
    });
  }
  const dotenvPath = join(ROOT, ".env");
  let dotenvContent = "";
  if (existsSync(dotenvPath)) {
    dotenvContent = readText(dotenvPath);
  }
  let dotenvUpdated = false;
  let secretLines = [];
  if (answers.selectedTools.includes("context7")) {
    if (!dotenvContent.includes("CONTEXT7_API_KEY")) {
      secretLines.push("# Context7 API Key (secret)\nCONTEXT7_API_KEY=");
      dotenvUpdated = true;
    }
  }
  if (dotenvUpdated) {
    if (dotenvContent && !dotenvContent.endsWith("\n")) {
      dotenvContent += "\n";
    }
    dotenvContent += secretLines.join("\n\n") + "\n";
    changes.push({
      path: dotenvPath,
      mode: existsSync(dotenvPath) ? "update" : "create",
      content: dotenvContent
    });
  }
  if (project.hasPackageJson) {
    const nextPackage = structuredClone(project.packageJson);
    nextPackage.scripts = nextPackage.scripts || {};
    const scripts = {
      pragmatik: "pragmatik doctor",
      "pragmatik:help": "pragmatik help",
      "pragmatik:init": "pragmatik init",
      "pragmatik:setup": "pragmatik setup",
      "pragmatik:dashboard": "pragmatik dashboard",
      "pragmatik:dev": "pragmatik run -- npm run dev"
    };
    let changed = false;
    for (const [key, value] of Object.entries(scripts)) {
      if (!nextPackage.scripts[key]) {
        nextPackage.scripts[key] = value;
        changed = true;
      }
    }
    if (nextPackage.name !== "@mvuljevas/pragmatik") {
      nextPackage.devDependencies = nextPackage.devDependencies || {};
    }
    if (nextPackage.name !== "@mvuljevas/pragmatik" && !nextPackage.devDependencies["@mvuljevas/pragmatik"]) {
      nextPackage.devDependencies["@mvuljevas/pragmatik"] = `^${VERSION}`;
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

This repository uses Pragmatik project governance.

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

Project initialized with Pragmatik workflow guidance.

## Project Goal

Define what this project will build.

## Start

\`\`\`bash
pragmatik doctor
pragmatik setup --dry-run
pragmatik dashboard
\`\`\`

If this project does not use Node, run Pragmatik through \`npx\`:

\`\`\`bash
npx -y @mvuljevas/pragmatik doctor
\`\`\`

## Documentation

- \`AGENTS.md\`: agent workflow rules.
- \`docs/AI_CONTEXT.md\`: compact project context.
- \`docs/ROADMAP.md\`: next milestones.
- \`docs/SNAPSHOTS.md\`: project memory.
- \`docs/TECHDEBT.md\`: accepted debt and cleanup items.
`;
}

function mergeGitignore(current) {
  let cleaned = current.replace(/# AGENTS[\s\S]*?(?=(#|$))/g, "").trimEnd();
  const block = [
    "# Pragmatik local configuration",
    ".agents/",
    "!.agents/skills/",
    "",
    "# AI tool outputs",
    ".ai-runs/",
    "repomix-output.md",
    "tokscale-*.json",
    "tokscale-*.md",
    "",
    "# Local secrets",
    ".env",
    ".env.*",
    "!.env.example",
    "",
    "# Operating system files",
    ".DS_Store",
    "Thumbs.db"
  ].join("\n");
  return appendBlock(cleaned, "# Pragmatik", block);
}

function mergeGitattributes(current) {
  let cleaned = current.replace(/# AGENTS[\s\S]*?(?=(#|$))/g, "").trimEnd();
  const block = [
    "# Normalize text files",
    "* text=auto eol=lf",
    "",
    "# Common binary files",
    "*.png binary",
    "*.jpg binary",
    "*.jpeg binary",
    "*.gif binary",
    "*.webp binary",
    "*.ico binary",
    "*.pdf binary"
  ].join("\n");
  return appendBlock(cleaned, "# Pragmatik", block);
}

function appendBlock(current, marker, block) {
  const text = current.trimEnd();
  if (text.includes(marker)) return `${text}\n`;
  return `${text ? `${text}\n\n` : ""}${block}\n`;
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

- Pragmatik workflow initialized.
`;
}

function renderProjectSnapshots(project) {
  const date = new Date().toISOString().slice(0, 10);
  return `# Snapshots

Chronological project memory for agents and maintainers.

## ${date} - Pragmatik Workflow Initialized

Current state:

- Pragmatik workflow files were created.
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

function renderPragmatikEnv(answers) {
  return `# Pragmatik Project Configuration
PRAGMATIK_CONTEXT_MODE=lean-context
PRAGMATIK_SETUP_PROFILE=${answers.profile}
PRAGMATIK_SELECTED_TOOLS=${answers.selectedTools.join(",")}
PRAGMATIK_SUBMIT=${answers.privacy}
PRAGMATIK_DASHBOARD=on
`;
}

function renderRollback(changes, answers) {
  return `# Pragmatik Rollback Notes

Generated by Pragmatik ${VERSION}.

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
      console.log("  auth: none; Pragmatik uses bounded local context packs.");
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
    printSection("Running Pragmatik tools");
    await runAiTools();
    await closeServer(server);
    return;
  }
  console.log(`Pragmatik dashboard: ${server.url}`);
  const child = spawn(command[0], command.slice(1), { stdio: "inherit", shell: process.platform === "win32" });
  child.on("exit", async (code) => {
    await closeServer(server);
    process.exitCode = code ?? 0;
  });
}

async function runAiTools() {
  const projectScript = join(ROOT, "scripts", "ai-tools.sh");
  const packageScript = join(PACKAGE_ROOT, "scripts", "ai-tools.sh");
  const script = existsSync(projectScript) ? projectScript : packageScript;
  if (!existsSync(script)) {
    throw new Error("Pragmatik AI-tool backend is missing from both the project and the installed package.");
  }
  const result = spawnSync("bash", [script, "run"], { cwd: ROOT, stdio: "inherit" });
  if (result.error) {
    throw result.error;
  }
  if (result.status && result.status !== 0) {
    throw new Error(`ai-tools failed with exit code ${result.status}`);
  }
}

async function startDashboard({ keepAlive, open, port = 8787 }) {
  const server = createServer((req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (urlObj.pathname === "/data.json") {
      const scope = urlObj.searchParams.get("scope") || "project";
      res.writeHead(200, {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      });
      res.end(JSON.stringify(buildPragmatikDashboardData(scope), null, 2));
      return;
    }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(renderDashboard());
  });
  const selectedPort = await listen(server, port);
  const url = `http://127.0.0.1:${selectedPort}`;
  server.url = url;
  console.log(`Pragmatik dashboard: ${url}`);
  if (open) openUrl(url);
  if (keepAlive) {
    console.log("Press Ctrl+C to stop.");
  }
  return server;
}

function renderDashboard() {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Pragmatik Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #09090b;
      --card-bg: rgba(24, 24, 27, 0.6);
      --border: rgba(63, 63, 70, 0.4);
      --text: #f4f4f5;
      --text-muted: #a1a1aa;
      --primary: #8b5cf6;
      --primary-glow: rgba(139, 92, 246, 0.15);
      --accent: #06b6d4;
      --accent-glow: rgba(6, 182, 212, 0.15);
      --success: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Outfit', sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      border-bottom: 1px solid var(--border);
      padding: 1.25rem 2rem;
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 10;
      background: rgba(9, 9, 11, 0.8);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-group { display: flex; align-items: center; gap: 0.75rem; }
    .logo-icon {
      width: 2.2rem;
      height: 2.2rem;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.25rem;
      box-shadow: 0 0 15px var(--primary-glow);
    }
    h1 { font-size: 1.35rem; font-weight: 600; }
    .scope-selector {
      display: flex;
      background: rgba(39, 39, 42, 0.6);
      border: 1px solid var(--border);
      padding: 0.25rem;
      border-radius: 0.75rem;
      gap: 0.25rem;
    }
    .scope-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.4rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      font-size: 0.85rem;
    }
    .scope-btn.active {
      background: var(--primary);
      color: var(--text);
      box-shadow: 0 0 10px var(--primary-glow);
    }
    main {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 100%;
    }
    .grid-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      backdrop-filter: blur(8px);
      border-radius: 1rem;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s ease;
    }
    .card:hover { border-color: var(--primary); }
    .card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 2px;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      opacity: 0.6;
    }
    .card-title { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
    .card-value { font-size: 1.85rem; font-weight: 700; margin-top: 0.5rem; }
    .card-sub { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; }
    .grid-charts {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 1.5rem;
    }
    @media (max-width: 900px) {
      .grid-charts { grid-template-columns: 1fr; }
    }
    .chart-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .chart-title { font-size: 1rem; font-weight: 600; }
    .chart-container {
      width: 100%;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .table-container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 1rem;
      overflow-x: auto;
    }
    .table-title { padding: 1.5rem 1.5rem 1rem 1.5rem; font-size: 1.1rem; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; text-align: left; min-width: 600px; }
    th {
      background: rgba(39, 39, 42, 0.4);
      padding: 1rem 1.5rem;
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 1rem 1.5rem;
      font-size: 0.85rem;
      border-bottom: 1px solid rgba(63, 63, 70, 0.2);
    }
    tr:hover td { background: rgba(255, 255, 255, 0.02); }
    .badge-client {
      background: var(--primary-glow);
      color: var(--primary);
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    .text-success { color: var(--success); font-weight: 600; }
    .text-muted { color: var(--text-muted); }
    .footer { text-align: center; margin-top: auto; padding: 2rem; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 0.8rem; }
  </style>
</head>
<body>
  <header>
    <div class="logo-group">
      <div class="logo-icon">P</div>
      <div>
        <h1>Pragmatik Dashboard</h1>
        <p style="font-size:0.75rem;color:var(--text-muted)" id="project-path">Cargando...</p>
      </div>
    </div>
    <div class="scope-selector">
      <button class="scope-btn active" id="btn-project" onclick="setScope('project')">Proyecto</button>
      <button class="scope-btn" id="btn-global" onclick="setScope('global')">Global</button>
    </div>
  </header>

  <main>
    <section class="grid-stats">
      <div class="card">
        <div class="card-title">Ahorro Neto</div>
        <div class="card-value" id="stat-savings" style="color: var(--success);">$0.00</div>
        <div class="card-sub" id="stat-savings-sub">Ahorro financiero acumulado</div>
      </div>
      <div class="card">
        <div class="card-title">Tiempo Salvado</div>
        <div class="card-value" id="stat-time">0h</div>
        <div class="card-sub" id="stat-time-sub">Horas de desarrollo optimizadas</div>
      </div>
      <div class="card">
        <div class="card-title">Eficiencia de IA</div>
        <div class="card-value" id="stat-efficiency">0%</div>
        <div class="card-sub">Ratio de optimización de costo</div>
      </div>
      <div class="card">
        <div class="card-title">Tokens Totales</div>
        <div class="card-value" id="stat-tokens">0</div>
        <div class="card-sub" id="stat-cost">IA Cost: $0.00</div>
      </div>
    </section>

    <section class="grid-charts">
      <div class="card chart-card">
        <div class="chart-header">
          <div class="chart-title">Comparativa de Costo</div>
        </div>
        <div class="chart-container" id="comp-chart">
          <!-- SVG injected dynamically -->
        </div>
      </div>
      <div class="card chart-card">
        <div class="chart-header">
          <div class="chart-title">Evolución de Ahorros Acumulados (USD)</div>
        </div>
        <div class="chart-container" id="timeline-chart">
          <!-- SVG injected dynamically -->
        </div>
      </div>
    </section>

    <section class="table-container">
      <div class="table-title">Historial de Sesiones (<span id="session-count">0</span>)</div>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tarea / Commit</th>
            <th>Cliente</th>
            <th>Duración</th>
            <th>Tokens</th>
            <th>Costo IA</th>
            <th>Ahorro Neto</th>
          </tr>
        </thead>
        <tbody id="sessions-list">
          <tr>
            <td colspan="7" class="text-muted" style="text-align: center; padding: 2rem;">Cargando sesiones...</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

  <footer class="footer">
    Pragmatik v<span id="pragmatik-version">0.5.0</span> — Con tecnología de medición autónoma local.
  </footer>

  <script>
    let currentScope = 'project';

    function setScope(scope) {
      currentScope = scope;
      document.getElementById('btn-project').classList.toggle('active', scope === 'project');
      document.getElementById('btn-global').classList.toggle('active', scope === 'global');
      loadData();
    }

    async function loadData() {
      try {
        const response = await fetch(\`/data.json?scope=\${currentScope}\`);
        const data = await response.json();
        
        document.getElementById('project-path').textContent = currentScope === 'project' 
          ? \`Local: \${data.projectRoot}\`
          : 'Global: Sesiones de toda la máquina';
        
        // Update stats
        document.getElementById('stat-savings').textContent = \`$\${data.aggregates.cost.money_saved_usd.toFixed(2)}\`;
        document.getElementById('stat-time').textContent = \`\${data.aggregates.cost.time_saved_hours.toFixed(1)}h\`;
        document.getElementById('stat-efficiency').textContent = \`\${data.aggregates.cost.efficiency_ratio.toFixed(1)}%\`;
        document.getElementById('stat-tokens').textContent = data.aggregates.tokens.total.toLocaleString();
        document.getElementById('stat-cost').textContent = \`IA Cost: $\${data.aggregates.cost.ai_cost_usd.toFixed(4)}\`;
        document.getElementById('session-count').textContent = data.aggregates.totalSessions;
        
        document.getElementById('stat-savings-sub').textContent = \`En \${data.aggregates.totalSessions} sesiones de desarrollo\`;
        
        // Render comparison chart
        drawComparisonChart(data.aggregates.cost.ai_cost_usd, data.aggregates.cost.human_cost_usd);

        // Render timeline chart
        drawSavingsTimeline(data.sessions);

        // Render session list
        const tbody = document.getElementById('sessions-list');
        if (data.sessions.length === 0) {
          tbody.innerHTML = \`<tr><td colspan="7" class="text-muted" style="text-align: center; padding: 2rem;">No se encontraron sesiones registradas. Corre 'pragmatik measure' para registrar una.</td></tr>\`;
          return;
        }

        tbody.innerHTML = data.sessions.map(s => {
          const date = new Date(s.started_at).toLocaleString();
          const tokensStr = s.tokens ? s.tokens.total.toLocaleString() : '0';
          const aiCostStr = s.cost ? \`$\${s.cost.ai_cost_usd.toFixed(4)}\` : '$0.00';
          const savedStr = s.savings && s.savings.money_saved_usd !== null 
            ? \`$\${s.savings.money_saved_usd.toFixed(2)}\` 
            : '-';
          const durationStr = \`\${s.duration_minutes} min\`;
          const savedClass = s.savings && s.savings.money_saved_usd > 0 ? 'text-success' : '';

          return \`
            <tr>
              <td>\${date}</td>
              <td style="font-weight: 500;">\${escapeHtml(s.task)}</td>
              <td><span class="badge-client">\${escapeHtml(s.client)}</span></td>
              <td>\${durationStr}</td>
              <td>\${tokensStr}</td>
              <td>\${aiCostStr}</td>
              <td class="\${savedClass}">\${savedStr}</td>
            </tr>
          \`;
        }).join('');

      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      }
    }

    function escapeHtml(str) {
      if (!str) return '';
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function drawComparisonChart(aiCost, humanCost) {
      const container = document.getElementById('comp-chart');
      const max = Math.max(aiCost, humanCost, 1);
      const aiPct = (aiCost / max) * 120;
      const humanPct = (humanCost / max) * 120;
      
      container.innerHTML = \`
        <svg width="100%" height="200" viewBox="0 0 200 200">
          <rect x="35" y="\${160 - humanPct}" width="40" height="\${humanPct}" fill="#3f3f46" rx="6"></rect>
          <text x="55" y="180" fill="#a1a1aa" font-size="10" text-anchor="middle">Humano</text>
          <text x="55" y="\${150 - humanPct}" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">$\${humanCost.toFixed(0)}</text>
          
          <rect x="125" y="\${160 - aiPct}" width="40" height="\${aiPct}" fill="url(#grad)" rx="6"></rect>
          <text x="145" y="180" fill="#a1a1aa" font-size="10" text-anchor="middle">IA Cost</text>
          <text x="145" y="\${150 - aiPct}" fill="#8b5cf6" font-size="11" font-weight="bold" text-anchor="middle">$\${aiCost.toFixed(2)}</text>

          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#8b5cf6"></stop>
              <stop offset="100%" stop-color="#06b6d4"></stop>
            </linearGradient>
          </defs>
        </svg>
      \`;
    }

    function drawSavingsTimeline(sessions) {
      const container = document.getElementById('timeline-chart');
      if (sessions.length < 2) {
        container.innerHTML = \`<div style="color: var(--text-muted); font-size: 0.85rem;">Se necesitan al menos 2 sesiones para graficar la evolución.</div>\`;
        return;
      }
      
      let currentSaving = 0;
      const cronSessions = [...sessions].reverse();
      const savingsData = cronSessions.map(s => {
        currentSaving += s.savings ? (s.savings.money_saved_usd || 0) : 0;
        return currentSaving;
      });

      const maxSaving = Math.max(...savingsData, 10);
      const minSaving = Math.min(...savingsData, 0);
      const range = maxSaving - minSaving;
      
      const width = 600;
      const height = 200;
      const padding = 40;
      
      const step = (width - padding * 2) / (savingsData.length - 1);
      const xCoords = savingsData.map((_, i) => padding + i * step);
      const yCoords = savingsData.map(val => height - padding - ((val - minSaving) / range) * (height - padding * 2));
      
      let pathD = \`M \${xCoords[0]} \${yCoords[0]}\`;
      for (let i = 1; i < savingsData.length; i++) {
        pathD += \` L \${xCoords[i]} \${yCoords[i]}\`;
      }
      
      let areaD = \`\${pathD} L \${xCoords[xCoords.length - 1]} \${height - padding} L \${xCoords[0]} \${height - padding} Z\`;
      
      let circles = xCoords.map((x, i) => \`
        <circle cx="\${x}" cy="\${yCoords[i]}" r="4" fill="#8b5cf6" stroke="#09090b" stroke-width="2"></circle>
      \`).join('');

      container.innerHTML = \`
        <svg width="100%" height="100%" viewBox="0 0 \${width} \${height}">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3"></stop>
              <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"></stop>
            </linearGradient>
          </defs>
          <path d="\${areaD}" fill="url(#areaGrad)"></path>
          <path d="\${pathD}" fill="none" stroke="#8b5cf6" stroke-width="3" stroke-linecap="round"></path>
          \${circles}
          <line x1="\${padding}" y1="\${height - padding}" x2="\${width - padding}" y2="\${height - padding}" stroke="rgba(255,255,255,0.1)"></line>
        </svg>
      \`;
    }
  </script>
</body>
</html>`;
}

function buildPragmatikDashboardData(scope) {
  const sessions = [];
  
  if (scope === "project") {
    const aiRunsDir = join(ROOT, ".ai-runs");
    if (existsSync(aiRunsDir)) {
      const entries = readdirSync(aiRunsDir);
      for (const entry of entries) {
        const sessionPath = join(aiRunsDir, entry, "session.json");
        if (existsSync(sessionPath)) {
          try {
            sessions.push(JSON.parse(readFileSync(sessionPath, "utf8")));
          } catch {
            // ignore
          }
        }
      }
    }
  } else {
    const globalRunsDir = join(homedir(), ".pragmatik", "runs");
    if (existsSync(globalRunsDir)) {
      const entries = readdirSync(globalRunsDir);
      for (const entry of entries) {
        if (entry.endsWith(".json")) {
          const sessionPath = join(globalRunsDir, entry);
          try {
            sessions.push(JSON.parse(readFileSync(sessionPath, "utf8")));
          } catch {
            // ignore
          }
        }
      }
    }
  }

  sessions.sort((a, b) => new Date(b.started_at) - new Date(a.started_at));

  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalTokens = 0;
  let totalAiCost = 0;
  let totalHumanCost = 0;
  let totalMoneySaved = 0;
  let totalTimeSavedHours = 0;
  let totalSessions = sessions.length;
  let totalDurationMinutes = 0;

  for (const s of sessions) {
    totalInputTokens += s.tokens?.input || 0;
    totalOutputTokens += s.tokens?.output || 0;
    totalTokens += s.tokens?.total || 0;
    totalAiCost += s.cost?.ai_cost_usd || 0;
    totalDurationMinutes += s.duration_minutes || 0;

    if (s.human_estimate?.estimated_cost_usd !== null) {
      totalHumanCost += s.human_estimate.estimated_cost_usd;
    }
    if (s.savings?.money_saved_usd !== null) {
      totalMoneySaved += s.savings.money_saved_usd;
    }
    if (s.savings?.time_saved_hours !== null) {
      totalTimeSavedHours += s.savings.time_saved_hours;
    }
  }

  const efficiencyRatio = totalHumanCost > 0 
    ? ((totalMoneySaved / totalHumanCost) * 100) 
    : 0;

  return {
    scope,
    projectRoot: ROOT,
    aggregates: {
      totalSessions,
      totalDurationMinutes,
      tokens: {
        input: totalInputTokens,
        output: totalOutputTokens,
        total: totalTokens
      },
      cost: {
        ai_cost_usd: Number(totalAiCost.toFixed(4)),
        human_cost_usd: Number(totalHumanCost.toFixed(2)),
        money_saved_usd: Number(totalMoneySaved.toFixed(2)),
        time_saved_hours: Number(totalTimeSavedHours.toFixed(2)),
        efficiency_ratio: Number(efficiencyRatio.toFixed(1))
      }
    },
    sessions
  };
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
        "mvuljevas/Pragmatik",
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
import { join } from "node:path";

const ROOT = process.cwd();

const resources = {
  "project://summary": {
    name: "Project Summary",
    description: "Main project goals, stack details, and state summary from AI_CONTEXT.md or README.md",
    mimeType: "text/markdown",
    read: () => read("docs/AI_CONTEXT.md") || read("README.md")
  },
  "project://repo-map": {
    name: "Repository Map",
    description: "Structure and directory maps of files from docs/AI_SEARCH.md",
    mimeType: "text/markdown",
    read: () => read("docs/AI_SEARCH.md")
  },
  "project://version": {
    name: "Version",
    description: "Authoritative project and package version from VERSION or package.json",
    mimeType: "text/plain",
    read: () => read("VERSION") || packageVersion()
  },
  "project://recent-snapshots": {
    name: "Recent Snapshots",
    description: "Changelog, recent decisions, and memory snapshots from docs/SNAPSHOTS.md",
    mimeType: "text/markdown",
    read: () => tail("docs/SNAPSHOTS.md", 120)
  },
  "project://techdebt": {
    name: "Technical Debt",
    description: "Active technical debt, shortcuts, and bugs from docs/TECHDEBT.md",
    mimeType: "text/markdown",
    read: () => read("docs/TECHDEBT.md")
  },
  "project://roadmap": {
    name: "Roadmap",
    description: "Next milestones and future planning from docs/ROADMAP.md",
    mimeType: "text/markdown",
    read: () => read("docs/ROADMAP.md")
  }
};

function read(path) {
  const fullPath = join(ROOT, path);
  if (!existsSync(fullPath)) return "";
  return readFileSync(fullPath, "utf8").slice(0, 50000);
}

function tail(path, lines) {
  const text = read(path);
  if (!text) return "";
  return text.split("\\n").slice(-lines).join("\\n");
}

function packageVersion() {
  try {
    return JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version || "";
  } catch {
    return "";
  }
}

let buffer = "";
process.stdin.on("data", (chunk) => {
  buffer += chunk.toString();
  let lineEnd;
  while ((lineEnd = buffer.indexOf("\\n")) !== -1) {
    const line = buffer.slice(0, lineEnd).trim();
    buffer = buffer.slice(lineEnd + 1);
    if (line) {
      try {
        handleRequest(JSON.parse(line));
      } catch (err) {
        sendError(null, -32700, "Parse error");
      }
    }
  }
});

function sendResponse(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\\n");
}

function sendError(id, code, message) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }) + "\\n");
}

function logDebug(msg) {
  console.error(\`[MCP Debug] \${msg}\`);
}

function handleRequest(req) {
  if (req.jsonrpc !== "2.0") {
    return sendError(req.id || null, -32600, "Invalid Request");
  }

  const { id, method, params } = req;

  switch (method) {
    case "initialize":
      return sendResponse(id, {
        protocolVersion: "2024-11-05",
        capabilities: {
          resources: {}
        },
        serverInfo: {
          name: "pragmatik-context-mcp",
          version: "0.3.0"
        }
      });

    case "notifications/initialized":
      logDebug("Client initialized successfully");
      return;

    case "resources/list": {
      const list = Object.entries(resources).map(([uri, res]) => ({
        uri,
        name: res.name,
        description: res.description,
        mimeType: res.mimeType
      }));
      return sendResponse(id, { resources: list });
    }

    case "resources/read": {
      const uri = params?.uri;
      if (!uri || !resources[uri]) {
        return sendError(id, -32602, \`Invalid params: resource not found "\${uri}"\`);
      }
      const res = resources[uri];
      const text = res.read();
      return sendResponse(id, {
        contents: [{
          uri,
          mimeType: res.mimeType,
          text
        }]
      });
    }

    default:
      return sendError(id, -32601, \`Method not found: \${method}\`);
  }
}
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

function getGlobalConfigPath() {
  return join(homedir(), ".pragmatik", "config.json");
}

function readGlobalConfig() {
  const path = getGlobalConfigPath();
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
}

function writeGlobalConfig(config) {
  const path = getGlobalConfigPath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(config, null, 2) + "\n");
}

function resolveHourlyRate(args, env, dotenv) {
  let rate = numberArgWithFallback(args, "--hourly-rate", null);
  if (rate !== null) return rate;

  if (dotenv.PRAGMATIK_HOURLY_RATE) {
    rate = Number(dotenv.PRAGMATIK_HOURLY_RATE);
    if (Number.isFinite(rate) && rate >= 0) return rate;
  }

  if (env.PRAGMATIK_HOURLY_RATE) {
    rate = Number(env.PRAGMATIK_HOURLY_RATE);
    if (Number.isFinite(rate) && rate >= 0) return rate;
  }

  const globalConfig = readGlobalConfig();
  if (globalConfig.hourlyRate !== undefined) {
    rate = Number(globalConfig.hourlyRate);
    if (Number.isFinite(rate) && rate >= 0) return rate;
  }

  return null;
}

async function runMeasure(args) {
  const env = readEnv(join(ROOT, ".pragmatik.env")) || readEnv(join(ROOT, ".agents.env")) || {};

  let client = valueArg(args, "--client");
  if (!client) {
    client = env.PRAGMATIK_CLIENT || "antigravity";
  }

  let sessionId = valueArg(args, "--session-id");
  let logPath = "";

  if (client === "antigravity") {
    const brainDir = join(homedir(), ".gemini", "antigravity", "brain");
    if (!existsSync(brainDir)) {
      throw new Error(`Antigravity brain directory not found at: ${brainDir}`);
    }
    if (sessionId) {
      logPath = join(brainDir, sessionId, ".system_generated", "logs", "transcript.jsonl");
      if (!existsSync(logPath)) {
        throw new Error(`Antigravity session transcript not found at: ${logPath}`);
      }
    } else {
      const dirs = readdirSync(brainDir);
      let latestMtime = 0;
      for (const dir of dirs) {
        const path = join(brainDir, dir, ".system_generated", "logs", "transcript.jsonl");
        if (existsSync(path)) {
          const mtime = statSync(path).mtimeMs;
          if (mtime > latestMtime) {
            latestMtime = mtime;
            sessionId = dir;
            logPath = path;
          }
        }
      }
      if (!logPath) {
        throw new Error("No Antigravity sessions found in brain directory.");
      }
    }
  } else if (client === "claude") {
    throw new Error("Claude Code parser is not implemented yet. Support is planned for v0.4.0.");
  } else {
    throw new Error(`Unsupported client: ${client}`);
  }

  const transcriptContent = readFileSync(logPath, "utf8");
  const lines = transcriptContent.trim().split("\n");
  let totalInputChars = 0;
  let totalOutputChars = 0;
  let modelTurns = 0;
  let toolCallsCount = 0;
  let userMessages = 0;
  let startedAt = null;
  let endedAt = null;

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const step = JSON.parse(line);
      const src = step.source;
      const type = step.type;
      const stepContent = step.content || "";
      const createdAt = step.created_at;

      if (createdAt) {
        const time = new Date(createdAt);
        if (!startedAt || time < startedAt) startedAt = time;
        if (!endedAt || time > endedAt) endedAt = time;
      }

      if (src === "USER_EXPLICIT" && type === "USER_INPUT") {
        totalInputChars += stepContent.length;
        userMessages++;
      } else if (src === "MODEL") {
        modelTurns++;
        totalOutputChars += stepContent.length;
        const tcs = step.tool_calls || [];
        toolCallsCount += tcs.length;
      }
    } catch {
      // ignore
    }
  }

  const inputTokens = Math.ceil(totalInputChars / 4);
  const outputTokens = Math.ceil(totalOutputChars / 4);
  const totalTokens = inputTokens + outputTokens;

  const dotenv = readEnv(join(ROOT, ".env")) || {};
  let hourlyRate = resolveHourlyRate(args, env, dotenv);

  if (hourlyRate === null) {
    const interactive = process.stdin.isTTY && !args.includes("--yes");
    if (interactive) {
      const readline = createInterface({ input, output });
      const answer = await readline.question("Hourly rate not configured. Enter hourly rate in USD [Default: 80]: ");
      const parsed = Number(answer.trim() || "80");
      hourlyRate = Number.isFinite(parsed) && parsed >= 0 ? parsed : 80;

      const saveChoice = await readline.question("Save this hourly rate? (g)lobally / (l)ocally in .env / (s)kip: ");
      readline.close();
      if (saveChoice.toLowerCase() === "g") {
        const config = readGlobalConfig();
        config.hourlyRate = hourlyRate;
        writeGlobalConfig(config);
        console.log(`- Saved global hourly rate $${hourlyRate}/hour to ~/.pragmatik/config.json`);
      } else if (saveChoice.toLowerCase() === "l") {
        const dotenvPath = join(ROOT, ".env");
        let dotenvContent = existsSync(dotenvPath) ? readText(dotenvPath) : "";
        if (dotenvContent && !dotenvContent.endsWith("\n")) {
          dotenvContent += "\n";
        }
        dotenvContent += `# Private project hourly rate (USD)\nPRAGMATIK_HOURLY_RATE=${hourlyRate}\n`;
        writeFileSync(dotenvPath, dotenvContent);
        console.log(`- Saved project private hourly rate $${hourlyRate}/hour to .env`);
      }
    } else {
      hourlyRate = 80;
    }
  }

  const humanHours = numberArgWithFallback(args, "--human-hours", null);

  const priceInputOverride = numberArgWithFallback(args, "--model-price-input", null);
  const priceOutputOverride = numberArgWithFallback(args, "--model-price-output", null);

  let priceInput = priceInputOverride;
  let priceOutput = priceOutputOverride;

  if (priceInput === null || priceOutput === null) {
    let key = "gemini-2.5-pro";
    if (priceInput === null) priceInput = MODEL_PRICING[key].input;
    if (priceOutput === null) priceOutput = MODEL_PRICING[key].output;
  }

  const inputCost = (inputTokens / 1000000) * priceInput;
  const outputCost = (outputTokens / 1000000) * priceOutput;
  const aiCostUsd = Number((inputCost + outputCost).toFixed(6));

  const durationMinutes = startedAt && endedAt ? Math.round((endedAt - startedAt) / 60000) : 0;
  const projectRootBasename = ROOT.split(/[\\/]/).filter(Boolean).at(-1) || "project";

  const checksumHash = createHash("sha256");
  checksumHash.update(`${sessionId}:${projectRootBasename}:${startedAt ? startedAt.toISOString() : ""}`);
  const checksum = checksumHash.digest("hex");

  let moneySavedUsd = null;
  let timeSavedHours = null;
  if (humanHours !== null) {
    const humanCost = humanHours * hourlyRate;
    moneySavedUsd = Number((humanCost - aiCostUsd).toFixed(2));
    timeSavedHours = Number((humanHours - (durationMinutes / 60)).toFixed(2));
  }

  let task = valueArg(args, "--task");
  if (!task) {
    try {
      const gitLog = spawnSync("git", ["log", "-1", "--pretty=%s"], { encoding: "utf8" });
      if (gitLog.status === 0 && gitLog.stdout.trim()) {
        task = gitLog.stdout.trim();
      }
    } catch {
      // ignore
    }
  }
  if (!task) {
    task = `Development session in ${projectRootBasename}`;
  }

  const sessionData = {
    schema: "pragmatik-session/1",
    id: sessionId,
    checksum,
    task,
    client,
    started_at: startedAt ? startedAt.toISOString() : new Date().toISOString(),
    ended_at: endedAt ? endedAt.toISOString() : new Date().toISOString(),
    duration_minutes: durationMinutes,
    tokens: {
      input: inputTokens,
      output: outputTokens,
      total: totalTokens
    },
    cost: {
      currency: "USD",
      price_input_per_1m: priceInput,
      price_output_per_1m: priceOutput,
      ai_cost_usd: aiCostUsd
    },
    human_estimate: {
      hourly_rate_usd: hourlyRate,
      estimated_hours: humanHours,
      estimated_cost_usd: humanHours !== null ? humanHours * hourlyRate : null
    },
    savings: {
      money_saved_usd: moneySavedUsd,
      time_saved_hours: timeSavedHours
    },
    activity: {
      model_turns: modelTurns,
      tool_calls: toolCallsCount,
      user_messages: userMessages
    }
  };

  const aiRunsDir = join(ROOT, ".ai-runs");
  if (!existsSync(aiRunsDir)) {
    mkdirSync(aiRunsDir, { recursive: true });
  }

  const sessionDir = join(aiRunsDir, sessionId);
  if (!existsSync(sessionDir)) {
    mkdirSync(sessionDir, { recursive: true });
  }

  writeFileSync(join(sessionDir, "session.json"), JSON.stringify(sessionData, null, 2) + "\n");
  writeFileSync(join(aiRunsDir, "latest-session.json"), JSON.stringify(sessionData, null, 2) + "\n");

  const globalRunsDir = join(homedir(), ".pragmatik", "runs");
  if (!existsSync(globalRunsDir)) {
    mkdirSync(globalRunsDir, { recursive: true });
  }
  writeFileSync(join(globalRunsDir, `${sessionId}.json`), JSON.stringify(sessionData, null, 2) + "\n");

  printSection("Pragmatik Measure Complete");
  console.log(`- Session ID:  ${sessionId}`);
  console.log(`- Checksum:    ${checksum}`);
  console.log(`- Saved to:    .ai-runs/${sessionId}/session.json`);
  console.log(`- Saved to:    .ai-runs/latest-session.json`);
  console.log("\nRun 'pragmatik report' to view detailed comparison.");
}

async function runReport() {
  const latestPath = join(ROOT, ".ai-runs", "latest-session.json");
  let data = null;

  if (existsSync(latestPath)) {
    try {
      data = JSON.parse(readFileSync(latestPath, "utf8"));
    } catch {
      // ignore
    }
  }

  if (!data) {
    const aiRunsDir = join(ROOT, ".ai-runs");
    if (existsSync(aiRunsDir)) {
      const dirs = readdirSync(aiRunsDir);
      let latestMtime = 0;
      let newestSessionPath = "";
      for (const dir of dirs) {
        const path = join(aiRunsDir, dir, "session.json");
        if (existsSync(path)) {
          const mtime = statSync(path).mtimeMs;
          if (mtime > latestMtime) {
            latestMtime = mtime;
            newestSessionPath = path;
          }
        }
      }
      if (newestSessionPath) {
        try {
          data = JSON.parse(readFileSync(newestSessionPath, "utf8"));
        } catch {
          // ignore
        }
      }
    }
  }

  if (!data) {
    printSection("Pragmatik Report");
    console.log("No session reports found. Run 'pragmatik measure' first.");
    return;
  }

  printSection("Pragmatik Report: Comparative Analytics");
  console.log(`Session ID:       ${data.id}`);
  console.log(`Checksum:         ${data.checksum}`);
  console.log(`Task:             ${data.task}`);
  console.log(`AI Client:        ${data.client}`);
  console.log(`Duration:         ${data.duration_minutes} minutes`);

  console.log("\nAI Usage");
  console.log("--------");
  console.log(`Input tokens:     ${data.tokens.input.toLocaleString()} (est.)`);
  console.log(`Output tokens:    ${data.tokens.output.toLocaleString()} (est.)`);
  console.log(`Total tokens:     ${data.tokens.total.toLocaleString()} (est.)`);
  console.log(`AI Cost (USD):    $${data.cost.ai_cost_usd.toFixed(4)}`);

  console.log("\nHuman Equivalent");
  console.log("----------------");
  if (data.human_estimate.estimated_hours !== null) {
    console.log(`Estimated time:   ${data.human_estimate.estimated_hours} hours`);
    console.log(`Hourly rate:      $${data.human_estimate.hourly_rate_usd.toFixed(2)}/hour`);
    console.log(`Human Cost (USD): $${data.human_estimate.estimated_cost_usd.toFixed(2)}`);

    console.log("\nSavings & Optimization");
    console.log("----------------------");
    const pct = data.human_estimate.estimated_cost_usd > 0
      ? ((data.savings.money_saved_usd / data.human_estimate.estimated_cost_usd) * 100).toFixed(1)
      : "0";
    console.log(`Money saved:      $${data.savings.money_saved_usd.toFixed(2)} USD (${pct}% saved)`);

    const minutesSaved = Math.round(data.savings.time_saved_hours * 60);
    const hrs = Math.floor(minutesSaved / 60);
    const mins = minutesSaved % 60;
    console.log(`Time saved:       ${hrs > 0 ? hrs + " hours, " : ""}${mins} minutes`);
  } else {
    console.log("No human hours provided for comparison.");
    console.log("Run measure again with '--human-hours <hours>' to calculate savings.");
  }
}

async function runLogin() {
  printSection("Pragmatik Login");
  console.log("Pragmatik cloud integration uses GitHub OAuth.");
  console.log("This will authorize your local CLI to submit anonymous aggregate stats.");
  console.log("\nStatus: Local login setup complete. Preparing integration registry...");

  const dotenvPath = join(ROOT, ".env");
  let dotenvContent = "";
  if (existsSync(dotenvPath)) {
    dotenvContent = readText(dotenvPath);
  }

  if (!dotenvContent.includes("PRAGMATIK_API_TOKEN")) {
    const readline = createInterface({ input, output });
    const token = await readline.question("Enter your Pragmatik API Token (press enter to skip): ");
    readline.close();

    if (token.trim()) {
      if (dotenvContent && !dotenvContent.endsWith("\n")) {
        dotenvContent += "\n";
      }
      dotenvContent += `# Pragmatik API Token (secret)\nPRAGMATIK_API_TOKEN=${token.trim()}\n`;
      writeFileSync(dotenvPath, dotenvContent);
      console.log("- Successfully saved Pragmatik API Token to `.env`.");
    } else {
      console.log("- Login skipped. Headless/local mode remains active.");
    }
  } else {
    console.log("- Machine is already logged in (PRAGMATIK_API_TOKEN exists in `.env`).");
  }
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

function safeReaddir(path) {
  try {
    return readdirSync(path);
  } catch {
    return [];
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
  console.error("Pragmatik error");
  console.error("---------------");
  console.error(message);
  console.error("");
  console.error("Run pragmatik help for usage and examples.");
}

function matchLast(text, regex) {
  const matches = [...text.matchAll(new RegExp(regex.source, "g"))];
  return matches.length ? matches.at(-1)[1] : "";
}

function ask(rl, question, defaultValue) {
  return rl.question(`${question} (${defaultValue}): `).then((answer) => answer.trim() || defaultValue);
}

async function selectOne({ title, options, defaultValue }) {
  const defaultIndex = Math.max(0, options.findIndex((option) => option.value === defaultValue));
  const selected = await interactiveMenu({
    title,
    instructions: "Use arrow keys, Enter to choose. Shortcuts are shown in brackets.",
    options,
    cursor: defaultIndex,
    multi: false,
    defaults: [defaultValue]
  });
  return selected[0] || defaultValue;
}

async function selectMany({ title, description, options, defaults = [] }) {
  const noneOption = {
    value: "__none__",
    label: "None",
    shortcut: "0",
    description: "Clear this category and continue without these tools."
  };
  const selected = await interactiveMenu({
    title,
    description,
    instructions: "Use Up/Down to move, Space to select or unselect, Enter to continue. Press 0 for None.",
    options: [...options, noneOption],
    cursor: 0,
    multi: true,
    defaults
  });
  return selected.includes("__none__") ? [] : selected;
}

function interactiveMenu({ title, description = "", instructions, options, cursor, multi, defaults }) {
  if (!input.isTTY || !output.isTTY) {
    return Promise.resolve(defaults.filter(Boolean));
  }
  return new Promise((resolve) => {
    const selected = new Set(defaults.filter(Boolean));
    let index = cursor;
    let done = false;
    const wasRaw = input.isRaw;

    emitKeypressEvents(input);
    input.setRawMode(true);
    input.resume();

    const render = () => {
      output.write("\x1b[2J\x1b[H");
      console.log(title);
      console.log("-".repeat(title.length));
      if (description) console.log(description);
      console.log(instructions);
      console.log(menuEnterHint(multi, selected, defaults));
      console.log("");
      options.forEach((option, optionIndex) => {
        const pointer = optionIndex === index ? ">" : " ";
        const mark = multi ? (selected.has(option.value) ? "[x]" : "[ ]") : (option.value === options[index]?.value ? "(*)" : "( )");
        const shortcut = option.shortcut ? ` [${option.shortcut}]` : "";
        console.log(`${pointer} ${mark} ${option.label}${shortcut}`);
        if (optionIndex === index && option.description) {
          console.log(`    ${option.description}`);
          if (multi && option.value === "__none__" && selected.size > 0 && !selected.has("__none__")) {
            console.log(`    Selecting None will clear: ${selectedLabels(options, selected).join(", ")}.`);
          }
        }
      });
    };

    const cleanup = () => {
      input.off("keypress", onKeypress);
      input.setRawMode(wasRaw);
      output.write("\n");
    };

    const finish = () => {
      if (done) return;
      done = true;
      cleanup();
      if (multi) resolve([...selected]);
      else resolve([options[index]?.value].filter(Boolean));
    };

    const onKeypress = (_str, key) => {
      if (key.name === "c" && key.ctrl) {
        cleanup();
        process.exit(130);
      }
      if (key.name === "up") index = (index - 1 + options.length) % options.length;
      else if (key.name === "down") index = (index + 1) % options.length;
      else if (key.name === "space" && multi) toggleMenuValue(selected, options[index].value);
      else if (key.name === "return") finish();
      else {
        const match = options.findIndex((option) => option.shortcut === key.name);
        if (match >= 0) {
          index = match;
          if (multi) toggleMenuValue(selected, options[index].value);
          else finish();
        }
      }
      if (!done) render();
    };

    input.on("keypress", onKeypress);
    render();
  });
}

function menuEnterHint(multi, selected, defaults) {
  if (!multi) return "Enter chooses the highlighted option. Shortcuts choose immediately.";
  const current = [...selected].filter((value) => value !== "__none__");
  if (selected.has("__none__")) return "Enter continues with no tools in this category.";
  if (current.length > 0) return `Enter continues with selected tools: ${current.length}.`;
  if (defaults.filter(Boolean).length > 0) return "Enter keeps the current default selections.";
  return "Enter continues without selecting tools unless you toggle one first.";
}

function selectedLabels(options, selected) {
  return options
    .filter((option) => option.value !== "__none__" && selected.has(option.value))
    .map((option) => option.label);
}

function toggleMenuValue(selected, value) {
  if (value === "__none__") {
    selected.clear();
    selected.add(value);
    return;
  }
  selected.delete("__none__");
  if (selected.has(value)) selected.delete(value);
  else selected.add(value);
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

function numberArgWithFallback(args, flag, fallback) {
  const raw = valueArg(args, flag);
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
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
