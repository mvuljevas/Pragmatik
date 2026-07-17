#!/usr/bin/env node
import { createServer } from "node:http";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { emitKeypressEvents } from "node:readline";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const VERSION = "0.3.4";
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

const COMMANDS = new Set([
  "help",
  "version",
  "init",
  "setup",
  "doctor",
  "dashboard",
  "run",
  "suggest",
  "mcp-create"
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
    printDashboardUnavailable(detectProject(ROOT));
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
  const env = readEnv(join(cwd, ".agents.env")) || readEnv(join(cwd, ".agents.env.example"));
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

function printDashboardUnavailable(project) {
  printSection("Pragmatik dashboard");
  console.log("A real Pragmatik dashboard UI is not implemented yet.");
  console.log("");
  console.log("Available now:");
  console.log("- pragmatik doctor: repository readiness and tool status.");
  console.log("- pragmatik run: execute configured local AI tooling and append reports.");
  console.log("- docs/AI_USAGE_REPORT.md: aggregate usage observations.");
  console.log("- docs/AI_OPTIMIZATION_REPORT.md: aggregate optimization observations.");
  console.log("");
  console.log("Detected status:");
  printKV("Repository", project.cwd);
  printKV("Dashboard data", project.hasAiRuns ? "present" : "missing");
  printKV("Tools available", `${project.tools.filter((tool) => tool.available).length}/${project.tools.length}`);
  console.log("");
  console.log("Next:");
  console.log("- Use pragmatik doctor for current status.");
  console.log("- Track the real dashboard as a roadmap item before exposing this as a UI.");
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
  if (existsSync(join(cwd, "AGENTS.md")) && existsSync(join(cwd, ".agents.env"))) return "agents-configured";
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
    message: project.env ? ".agents.env or sample config is present." : ".agents.env is missing; setup can create non-secret local defaults."
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
      console.log("- Context7: requires an API key. Store it in a local ignored secret file, not in committed docs.");
      console.log("  Example local key name: CONTEXT7_API_KEY.");
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
      content: renderAgentsEnv(answers)
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
  const block = [
    "# AGENTS local configuration",
    ".agents.env",
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
  return appendBlock(current, "# AGENTS", block);
}

function mergeGitattributes(current) {
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
  return appendBlock(current, "# AGENTS", block);
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

function renderAgentsEnv(answers) {
  return `# Local non-secret Pragmatik configuration.
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
  console.log(`Pragmatik dashboard: ${url}`);
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
<title>Pragmatik Dashboard</title>
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
<h1>Pragmatik Dashboard</h1>
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
  if (!project.hasAgents) actions.push("Add AGENTS.md or run pragmatik setup to adopt governance rules.");
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
