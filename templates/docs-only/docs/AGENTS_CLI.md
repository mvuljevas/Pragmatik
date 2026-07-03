# AGENTS CLI

`agents` is the project-governance command for AGENTS-based repositories.

The CLI is distributed as `@mvuljevas/agents` and can run as a project
dependency or through `npx`.

## Purpose

Use `agents` to inspect a repository, initialize AGENTS workflow files, adopt
AGENTS in an existing project, choose templates, report dashboard status, and
scaffold optional AI tooling.

The CLI is designed to work in any project type. Node projects can install it
as a dev dependency. Laravel, PHP, documentation-only, Chrome extension, or
other projects can run it through `npx` without adding Node project artifacts.

## Commands

```bash
agents help                         Show commands, common flows, safety rules, and detected state.
agents doctor                       Inspect the current repository and print readiness checks.
agents init [--dry-run] [--yes]     Prepare a new project with AGENTS workflow files.
agents setup [--dry-run] [--yes]    Adopt AGENTS in an existing project without overwriting conventions.
agents run -- <command>             Run a command with the AGENTS dashboard lifecycle.
agents dashboard [--no-open]        Show dashboard status. The real UI is planned, not implemented.
agents suggest --idea "..."         Recommend a template and preset from a project idea.
agents mcp-create [--dry-run]       Scaffold a read-only project MCP.
```

## Safe Defaults

- Tools are optional.
- Existing repositories are changed only after preview and confirmation.
- Non-interactive setup prints a preview and requires `--yes` before writing.
- `npm run dev` is not replaced by default.
- `agents:dev` is the safe wrapper for dashboard plus the original dev command.
- Dashboard data is local unless a selected external tool is configured to
  submit data.
- Missing base files are created only when absent: `AGENTS.md`, `README.md`,
  `docs/AI_CONTEXT.md`, `docs/ROADMAP.md`, `docs/SNAPSHOTS.md`, and
  `docs/TECHDEBT.md`.
- GitHub-minimal repositories can complete placeholder `README.md`, `.gitignore`,
  and `.gitattributes` after preview and confirmation.

## Recommended Scripts

When a project has `package.json`, `agents setup` can add these scripts:

```json
{
  "scripts": {
    "agents": "agents doctor",
    "agents:help": "agents help",
    "agents:init": "agents init",
    "agents:setup": "agents setup",
    "agents:dashboard": "agents dashboard",
    "agents:measure": "bash scripts/ai-tools.sh measure-pair",
    "agents:dev": "agents run -- npm run dev"
  }
}
```

The wrapper keeps normal project scripts intact unless the user explicitly
approves a deeper integration.

`agents:measure` is a repository-local compatibility script. It runs the
repeatable baseline-vs-`lean-context` measurement pair and appends the
comparison to `docs/AI_USAGE_REPORT.md`.

Projects without `package.json` should use:

```bash
npx -y @mvuljevas/agents doctor
npx -y @mvuljevas/agents setup
```

When running through npm scripts, prefer named scripts:

```bash
npm run agents
npm run agents:help
npm run agents:setup
```

`npm run agents` runs the default project diagnosis. Avoid `npm run agents
--help`: npm consumes that flag before AGENTS receives it.

## Dashboard

The real dashboard UI is not implemented yet. Until then, use:

```bash
agents doctor
agents run
```

`agents dashboard` reports the current dashboard status and points to available
reports. It should not be treated as a complete dashboard UI until the roadmap
item is implemented.

## Interactive Setup

`agents setup` uses interactive selectors when the terminal supports them.

- Enter accepts the value shown as the default.
- Single-choice prompts show explicit shortcuts, for example `[c]`, `[b]`, and
  `[g]`.
- Tool selection is grouped by category and supports multiple selections.
- In multi-select prompts, `Space` selects or unselects the highlighted item.
- In multi-select prompts, `Enter` continues with the checked items currently
  shown on screen.
- In multi-select prompts, `0` selects `None`.
- `None` clears the current category and continues without tools from that
  category.

Tool categories:

- Measurement tools: Tokscale, Cursor Teams, and future usage analytics.
- Optimization and context tools: Tokless, Repomix, and future reducers.
- MCPs and documentation context: Context7, MCP compression tools, and paid
  context providers.

The wizard explains when tools overlap. For example, Tokscale and Cursor Teams
can both report usage, and Tokless plus MCP compression can both affect context.
AGENTS should recommend measuring one change before stacking multiple optimizers.

## Recommended Start

For a new project:

```bash
agents init
```

For a repository freshly created on GitHub with only `README.md`, `.gitignore`,
`LICENSE`, and `.git`, AGENTS treats the repository as conceptually new:

```bash
agents doctor
agents suggest --idea "Describe the app you want to build"
agents init --dry-run
agents init
```

AGENTS treats these files as placeholders for a new project. It can complete a
minimal `README.md`, append AGENTS-safe defaults to `.gitignore`, and create or
complete `.gitattributes` after preview and confirmation.

For an existing project:

```bash
agents doctor
agents setup --dry-run
agents setup
```

For template selection:

```bash
agents suggest --idea "Laravel CRM with React"
```

## Error Handling

Errors should explain what failed and how to recover. Unsupported options point
back to `agents help`. Setup does not write files from non-interactive shells
unless `--yes` is provided.
