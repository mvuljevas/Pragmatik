# Naming

This document defines naming standards for branches, commits, tags, files, and
template directories.

## Template Directories

Use lowercase kebab-case for template directory names.

Examples:

```text
laravel-react
react-vite-spa
chrome-extension-vanilla
docs-only
```

Avoid vague names such as:

```text
app
template1
misc
new-project
```

## Package And Binary Names

The public package and binary name must be short, memorable, and available on
the target distribution channel.

Do not document binary names as available unless they are actually published and
installable. The public package is `@mvuljevas/pragmatik` and the binary is
`pragmatik`.

For development and local package testing, use:
`@mvuljevas/pragmatik`.

## Branch Names

Use descriptive, neutral branch names.

Recommended prefixes:

```text
docs/
feature/
fix/
chore/
release/
```

Examples:

```text
docs/base-workflow
docs/laravel-template
docs/laravel-react-template
feature/react-vite-template
feature/chrome-extension-vanilla-template
fix/semver-tagging-rules
release/v0.1.0
```

Avoid:

- Agent names.
- AI tool names.
- Provider names.
- Personal scratch labels.
- Generic names such as `update`, `changes`, or `fixes`.

## Commit Messages

Commit messages should describe the result, not the tool used.

Recommended examples:

```text
Document base agent workflow
Add Laravel React project template
Add Chrome extension vanilla template
Clarify snapshot format
Fix SemVer release rules
```

Avoid:

```text
update
fix stuff
agent changes
ai generated docs
```

## Tags

Release tags must follow:

```text
vX.Y.Z
```

Where `X.Y.Z` follows Semantic Versioning.

Examples:

```text
v0.1.0
v0.2.0
v1.0.0
v1.0.1
```

Do not use:

```text
v1
1.0
latest
stable
release-final
```

## Snapshot Titles

Snapshots should use this format:

```text
## YYYY-MM-DD - Block NNN: Short Title
```

Examples:

```text
## 2026-06-27 - Block 001: Base Repository Structure
## 2026-06-28 - Block 002: Laravel React Template Draft
```

## Document Names

Use uppercase names for top-level governance documents:

```text
AGENTS.md
README.md
LICENSE
```

Use uppercase names for core docs:

```text
CONVENTIONS.md
NAMING.md
WORKFLOWS.md
SNAPSHOTS.md
ROADMAP.md
TECHDEBT.md
ARCHITECTURE.md
SECURITY.md
```

Use numbered lowercase files for ADRs:

```text
docs/adr/0001-data-store-choice.md
docs/adr/0002-auth-model.md
```
