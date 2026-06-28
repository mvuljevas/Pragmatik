# Workflows

This document defines shared workflows for projects based on AGENTS templates.

## Starting a Session

When the user asks the agent to analyze the repository, the agent should treat
these prompts as equivalent:

```text
Analiza el repo.
Analyze this repository.
Review the project structure.
Inspect the repo and tell me where we are.
What is the current state of this project?
Audit the repository setup.
Read the docs and summarize the current state.
```

The agent should:

1. Read project governance documents.
2. Inspect the repository tree.
3. Inspect git branch and working tree state.
4. Identify stack, commands, and documentation structure.
5. Summarize the current state.
6. Ask a project-start question such as:

```text
¿Que vamos a construir hoy?
What are we building today?
What should we work on next?
```

If the project already exists and lacks these rules, the agent should propose an
adoption plan instead of overwriting current conventions.

## Work Blocks

Use small blocks with a clear outcome.

Each block should close with:

- What changed.
- Main files touched.
- Verification performed.
- Risks or debt detected.
- Documentation updated.
- Snapshot updated when state changed.
- Version file updated when the iteration changes project state.
- Matching git tag created for the new version when the iteration is closed.
- Next logical step.

## Documentation Workflow

Update documentation as part of the work, not as a separate afterthought.

Update `README.md` when:

- Setup commands change.
- Usage changes.
- Project scope changes.
- Documentation links change.

Update `docs/ROADMAP.md` when:

- Product direction changes.
- Milestones are completed.
- Priorities shift.

Update `docs/TECHDEBT.md` when:

- A shortcut is accepted.
- A risk is discovered.
- Debt changes status.
- Debt is resolved.

Update `docs/SNAPSHOTS.md` when:

- The project reaches a new meaningful state.
- A decision needs to survive context loss.
- A block completes with structural, product, workflow, or release impact.

## Git Workflow

Default branch flow:

```text
feature/* -> develop -> staging -> main
```

Small documentation-only repositories may use:

```text
feature/* -> main
```

Only use the simplified flow when the project owner explicitly accepts it.

Rules:

- Create focused branches.
- Keep branch names descriptive and neutral.
- Do not push without explicit approval.
- Create local version tags when a versioned iteration is closed.
- Do not push tags without explicit approval.
- Do not mix unrelated refactors with feature work.

## Versioning Workflow

All templates and projects based on them should use Semantic Versioning for each
meaningful iteration.

Version format:

```text
X.Y.Z
```

Tag format:

```text
vX.Y.Z
```

Increment rules:

- Increase `MAJOR` for incompatible workflow, template, API, or behavior
  changes.
- Increase `MINOR` for backward-compatible new templates, workflows, features,
  or project capabilities.
- Increase `PATCH` for backward-compatible fixes, clarifications, or small
  documentation corrections.

The project version and git tag must always match.

Examples:

- `package.json` version `0.1.0` matches tag `v0.1.0`.
- `package.json` version `0.1.1` matches tag `v0.1.1`.
- `VERSION` value `1.0.0` matches tag `v1.0.0`.

## Version File Workflow

Each template must define the authoritative version file for its stack.

Default version sources:

- React, Vite, SPA, PWA, or Node projects: `package.json`.
- npm projects with `package-lock.json`: keep lockfile metadata synchronized
  with `package.json`.
- Chrome extension projects: `manifest.json`; if `package.json` also has a
  `version` field, keep it synchronized with `manifest.json`.
- Laravel or PHP projects: use the project's existing version source when one
  exists; otherwise use the template-defined version file.
- Documentation-only projects: use the template-defined version file when one
  exists.
- Template-library repositories: use `VERSION` unless a stack-specific template
  defines another authoritative source.

When an iteration changes the project state, the agent should:

1. Determine the SemVer increment from the work performed.
2. Update the authoritative version file.
3. Update lockfiles or generated version metadata when required by the stack.
4. Record the version change in the snapshot.
5. Create the matching local git tag `vX.Y.Z` when the iteration is closed.

## Release Checklist

Use this checklist when a versioned iteration is ready to close:

1. Determine or confirm the intended version.
2. Confirm the version follows `X.Y.Z`.
3. Update the authoritative version file.
4. Update release notes or changelog when the project has one.
5. Run project verification.
6. Commit the iteration changes.
7. Create local tag `vX.Y.Z`.
8. Push commit and tag only after explicit approval.

## Iteration Tagging

Iteration tagging means the agent may create a local version tag for each
completed iteration that changes the project state.

The agent should not create a tag for analysis-only work, failed work, or a
partial block that has not been closed.

Valid tagging examples:

```text
Implement the login page.
Add the Laravel React template.
Update the workflow documentation.
```

Invalid tagging examples:

```text
Analyze the repo.
Plan the next template.
Review this branch without changing files.
```

Pushing tags remains separate from creating tags. The agent must not push tags
without explicit user approval.

## Existing Project Adoption

When applying these templates to an existing project:

1. Read existing docs and workflows first.
2. Identify overlapping rules.
3. Preserve project-specific conventions when they are intentional.
4. Add AGENTS rules incrementally.
5. Avoid replacing existing roadmap or technical debt without mapping old
   content into the new structure.
6. Create an adoption snapshot explaining what changed and what remains.

## Agent Behavior

Agents should be proactive about project memory.

That means they should suggest or update:

- Snapshots.
- README sections.
- Roadmap items.
- Technical debt.
- Architecture notes.
- Verification commands.

Agents should ask for clarification only when a reasonable assumption would be
risky or irreversible.

## Lean Context Preset

New templates should integrate `presets/lean-context/` by default unless the
project type has a clear reason not to.

The preset adds:

- Minimal context loading rules.
- Search-first workflows.
- Optional MCP recommendations.
- Usage tracking and compression guidance.
- Interactive start and adoption flows.
- GitHub labels, Projects, signed commit, and technical debt guidance.

Templates should copy the relevant preset files so generated projects remain
self-contained.
