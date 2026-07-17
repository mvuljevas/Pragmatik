# Pragmatik CLI

`pragmatik` is the project-governance command for Pragmatik-based repositories.

The CLI is distributed as `@mvuljevas/pragmatik` and can run as a project
dependency or through `npx`.

## Purpose

Use `pragmatik` to inspect a repository, initialize Pragmatik workflow files, adopt
Pragmatik in an existing project, choose templates, report dashboard status, and
scaffold optional AI tooling.

The CLI is designed to work in any project type. Node projects can install it
as a dev dependency. Laravel, PHP, documentation-only, Chrome extension, or
other projects can run it through `npx` without adding Node project artifacts.

## Commands

```bash
pragmatik help                         Show commands, common flows, safety rules, and detected state.
pragmatik doctor                       Inspect the current repository and print readiness checks.
pragmatik init [--dry-run] [--yes]     Prepare a new project with Pragmatik workflow files.
pragmatik setup [--dry-run] [--yes]    Adopt Pragmatik in an existing project without overwriting conventions.
pragmatik run -- <command>             Run a command with the Pragmatik dashboard lifecycle.
pragmatik dashboard [--no-open]        Show dashboard status. The real UI is planned, not implemented.
pragmatik suggest --idea "..."         Recommend a template and preset from a project idea.
pragmatik mcp-create [--dry-run]       Scaffold a read-only project MCP.
pragmatik login                        Authenticate the local machine globally with Pragmatik.
pragmatik measure [options]            Parse local transcripts and calculate session metrics.
pragmatik report                       Print comparative session report in console.
```

## Safe Defaults

- Tools are optional.
- Existing repositories are changed only after preview and confirmation.
- Non-interactive setup prints a preview and requires `--yes` before writing.
- `npm run dev` is not replaced by default.
- `pragmatik:dev` is the safe wrapper for dashboard plus the original dev command.
- Dashboard data is local unless a selected external tool is configured to
  submit data.
- Missing base files are created only when absent: `AGENTS.md`, `README.md`,
  `docs/AI_CONTEXT.md`, `docs/ROADMAP.md`, `docs/SNAPSHOTS.md`, and
  `docs/TECHDEBT.md`.
- GitHub-minimal repositories can complete placeholder `README.md`, `.gitignore`,
  and `.gitattributes` after preview and confirmation.

## Recommended Scripts

When a project has `package.json`, `pragmatik setup` can add these scripts:

```json
{
  "scripts": {
    "pragmatik": "pragmatik doctor",
    "pragmatik:help": "pragmatik help",
    "pragmatik:init": "pragmatik init",
    "pragmatik:setup": "pragmatik setup",
    "pragmatik:dashboard": "pragmatik dashboard",
    "pragmatik:dev": "pragmatik run -- npm run dev"
  }
}
```

The wrapper keeps normal project scripts intact unless the user explicitly
approves a deeper integration.

`pragmatik run` does not require a copied `scripts/ai-tools.sh`. It first uses a
project-local backend when one exists, then falls back to the backend shipped in
the installed npm package. In both cases, configuration, logs, and reports are
resolved from the consumer project directory.

For repository-local baseline-vs-`lean-context` measurements, run
`bash scripts/ai-tools.sh measure-pair`. It appends the comparison to
`docs/AI_USAGE_REPORT.md`.

Projects without `package.json` should use:

```bash
npx -y @mvuljevas/pragmatik doctor
npx -y @mvuljevas/pragmatik setup
```

When running through npm scripts, prefer named scripts:

```bash
npm run pragmatik
npm run pragmatik:help
npm run pragmatik:setup
```

`npm run pragmatik` runs the default project diagnosis. Avoid `npm run pragmatik
--help`: npm consumes that flag before Pragmatik receives it.

## Dashboard

The real dashboard UI is not implemented yet. Until then, use:

```bash
pragmatik doctor
pragmatik run
```

`pragmatik dashboard` reports the current dashboard status and points to available
reports. It should not be treated as a complete dashboard UI until the roadmap
item is implemented.

## Interactive Setup

`pragmatik setup` uses interactive selectors when the terminal supports them.

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
Pragmatik should recommend measuring one change before stacking multiple optimizers.

## Recommended Start

For a new project:

```bash
pragmatik init
```

For a repository freshly created on GitHub with only `README.md`, `.gitignore`,
`LICENSE`, and `.git`, Pragmatik treats the repository as conceptually new:

```bash
pragmatik doctor
pragmatik suggest --idea "Describe the app you want to build"
pragmatik init --dry-run
pragmatik init
```

Pragmatik treats these files as placeholders for a new project. It can complete a
minimal `README.md`, append Pragmatik-safe defaults to `.gitignore`, and create or
complete `.gitattributes` after preview and confirmation.

For an existing project:

```bash
pragmatik doctor
pragmatik setup --dry-run
pragmatik setup
```

For template selection:

```bash
pragmatik suggest --idea "Laravel CRM with React"
```

## Autonomous Measurement

Pragmatik provides built-in, local-first commands to measure AI resource usage and calculate equivalent human cost/time savings.

### `pragmatik measure`

Parses local AI client transcripts and computes metrics.

Options:
- `--client <name>`: AI client log format to read (`antigravity`, `claude`).
- `--session-id <id>`: Session identifier to measure. Defaults to the latest session.
- `--since <timestamp>`: Filter events since a specific timestamp.
- `--human-hours <n>`: Estimated human hours for the task (used for comparison).
- `--hourly-rate <n>`: Developer hourly rate in USD.
- `--task <desc>`: Task description for the session log.
- `--model-price-input <n>`: Cost in USD per 1M input tokens.
- `--model-price-output <n>`: Cost in USD per 1M output tokens.

### `pragmatik report`

Renders the calculated comparison metrics in a clean tabular view directly in the console.

## Error Handling

Errors should explain what failed and how to recover. Unsupported options point
back to `pragmatik help`. Setup does not write files from non-interactive shells
unless `--yes` is provided.
