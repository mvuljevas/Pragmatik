# AI Search

Use this file to locate the smallest useful context before opening files.

## General Search Rules

- Prefer `rg` over recursive `grep`.
- Search for names, routes, symbols, commands, and errors before reading files.
- Use `rg --files` to discover file paths.
- Use small slices such as `sed -n '40,120p' path` after locating a target.
- Avoid dependency folders, build outputs, caches, lockfiles, and secrets.

## Common Commands

```bash
rg --files
rg "pattern"
rg "pattern" app resources routes tests
git status --short --branch
git diff --stat
git log --oneline --decorate -n 10
```

## Laravel + React

```bash
rg "Route::" routes app
rg "class .*Controller" app/Http/Controllers
rg "class .* extends Model" app/Models
rg "Schema::" database/migrations
rg "__\\(" resources lang app
rg "Inertia|React|jsx|tsx" resources app
rg "describe\\(|it\\(|test\\(" tests
```

## React, Vite, SPA, or PWA

```bash
rg --files src public
rg "createRoot|BrowserRouter|Routes|Route" src
rg "useState|useEffect|useMemo|useCallback" src
rg "fetch\\(|axios|queryClient|useQuery" src
rg "serviceWorker|manifest|workbox" src public
rg "describe\\(|it\\(|test\\(" src tests
```

## Chrome Extension Vanilla

```bash
rg --files
rg "\"manifest_version\"|\"version\"|\"permissions\"" manifest.json
rg "chrome\\.runtime|chrome\\.storage|chrome\\.tabs|chrome\\.action" .
rg "content_scripts|service_worker|web_accessible_resources" manifest.json
rg "ShadowRoot|attachShadow|textContent|innerHTML" *.js
rg "node --check|smoke:extension|playwright" package.json scripts
```

## Documentation-Only Repositories

```bash
rg --files -g '*.md'
rg "^#|^##" README.md docs
rg "TODO|Risk|Decision|Next suggested step" docs
rg "version|SemVer|tag" README.md docs VERSION
```

## When Search Is Not Enough

Open only the smallest useful slice:

```bash
sed -n '1,120p' path/to/file
sed -n '120,240p' path/to/file
```

Read complete files only when the file is short, canonical, or directly
required for correctness.
