# GitHub Workflow

This document defines the default GitHub workflow for projects that use
`lean-context`.

References:

- GitHub CLI manual: https://cli.github.com/manual/
- `gh project`: https://cli.github.com/manual/gh_project
- Managing labels: https://docs.github.com/issues/using-labels-and-milestones-to-track-work/managing-labels
- Signing commits: https://docs.github.com/authentication/managing-commit-signature-verification/signing-commits

## Versioning

- Use Semantic Versioning: `X.Y.Z`.
- Use git tags formatted as `vX.Y.Z`.
- Keep the authoritative version file synchronized with the tag.
- Create local tags when a versioned iteration closes.
- Push commits and tags only when the user explicitly approves pushing.

## Labels

Use `files/github/labels.json` as the default label set.

Default groups:

- `type:*` for kind of work.
- `status:*` for workflow state.
- `priority:*` for urgency.
- `area:*` for project area.
- `ai:*` for AI-context and automation work.

## GitHub Projects

Use GitHub CLI as the first implementation path when available.

Before managing Projects, confirm authentication and required scopes:

```bash
gh auth status
gh auth refresh -s project
```

Interactive question for new or adopted projects:

```text
Does this repository already have a GitHub Project? Should I create or link one?
```

Recommended fields:

- Status
- Priority
- Type
- Area
- Target Version

## Technical Debt Automation

When `docs/TECHDEBT.md` exists:

1. Parse open debt entries.
2. Propose one issue per actionable debt item.
3. Apply `type:techdebt`.
4. Apply `priority:*` and `area:*` when obvious.
5. Link the issue to the GitHub Project when the user approves.

Do not create issues automatically without user approval.

## Signed Commits

Prefer signed commits when the user already has signing configured through GPG,
SSH, or S/MIME.

Check local configuration:

```bash
git config --get commit.gpgsign
git config --get user.signingkey
git config --get gpg.format
```

If signing is not configured, do not block the workflow. Document the state and
continue with descriptive commits unless the user asks to configure signing.

## Commit Messages

Commit messages must describe the result:

```text
Add lean context preset
Document Chrome extension workflow
Fix snapshot version notes
```

Do not mention agent names, AI tools, providers, generated-by signatures, or
irrelevant metadata.
