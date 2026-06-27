# AGENTS

AGENTS is a reusable documentation and workflow template library for AI-assisted
software projects.

The goal is to standardize how projects define agent behavior, documentation
rules, snapshots, versioning, naming, and repeatable delivery workflows.

## Purpose

This repository provides reusable templates for projects such as:

- Laravel + React applications, aligned with the Prisma project workflow.
- React, Vite, SPA, or PWA applications.
- Documentation-only repositories.
- Future project types with their own stack-specific rules.

Every template should help a user clone or copy a project foundation, then start
with an analysis request such as:

```text
Analiza el repo.
Analyze this repository.
Review the project structure.
Inspect the repo and tell me where we are.
What is the current state of this project?
```

The agent should interpret these as equivalent requests to inspect the
repository, read its governance files, understand the current state, and then
ask a project-start question such as:

```text
¿Que vamos a construir hoy?
What are we building today?
What should we work on next?
```

If the repository is already in development, the agent should explain how to
adopt the rules without overwriting existing project decisions.

## Base Structure

```text
README.md
AGENTS.md
LICENSE
VERSION

docs/
  CONVENTIONS.md
  NAMING.md
  WORKFLOWS.md
  SNAPSHOTS.md
```

Future reusable project templates should live under `templates/`, grouped by
project type.

## Shared Standards

All templates in this repository should share:

- Agent workflow rules.
- Snapshot rules.
- Documentation update rules.
- Git workflow and branch naming.
- Semantic Versioning for releases.
- Coherent `X.Y.Z` project versions.
- Matching `vX.Y.Z` git tags for versioned iterations.
- Version-file updates that match the project stack, such as `package.json` for
  React projects.
- Neutral public metadata without AI tool, agent, or provider names.

## Documentation Map

- [Agent rules](AGENTS.md)
- [Conventions](docs/CONVENTIONS.md)
- [Naming](docs/NAMING.md)
- [Workflows](docs/WORKFLOWS.md)
- [Snapshots](docs/SNAPSHOTS.md)

## License

This repository is licensed under the MIT License.
