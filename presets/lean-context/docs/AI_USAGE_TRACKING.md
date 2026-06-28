# AI Usage Tracking

Usage tracking helps users understand where AI quota is going. It does not
reduce token usage by itself, but it makes waste visible.

## Recommended Signals

Track:

- Tool or client used.
- Task type.
- Prompt size when available.
- Output size when available.
- Approximate token usage.
- Estimated cost when available.
- Files or context packs used.

## Optional Tools

### Tokscale

Tokscale is a token and cost visibility tool for AI coding workflows.

Reference: https://github.com/junhoyeo/tokscale

Recommended use:

- Comparing agents or IDEs.
- Finding high-cost workflows.
- Monitoring repeated context waste.

### Browser Token Trackers

Browser extensions can help track usage in web AI products when the user works
outside an IDE or terminal.

Recommended use:

- Chat-based workflows.
- Manual prompting sessions.

## Local Tracking Template

Projects may keep a lightweight local log when the user wants quota visibility:

```text
Date:
Tool:
Task:
Context source:
Approximate token/cost:
Waste noticed:
Action to reduce next time:
```

Do not commit personal cost logs unless the user explicitly wants them in the
repository.
