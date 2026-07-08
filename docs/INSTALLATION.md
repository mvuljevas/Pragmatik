# Installation

Pragmatik is distributed as the scoped npm package `@mvuljevas/pragmatik`.
Install globally for the `pragmatik` command, or run through `npx` without
installing.

## Local Repository

From this repository:

```bash
npm run pragmatik
npm run pragmatik:help
npm run pragmatik:setup
```

Direct CLI execution:

```bash
node cli/pragmatik.js doctor
node cli/pragmatik.js setup --dry-run
node cli/pragmatik.js suggest --idea "React PWA"
```

## Local Package Test

Before publishing, test the package from a clean project:

```bash
npm pack
npm install -D ./mvuljevas-pragmatik-*.tgz
npx pragmatik doctor
```

## npm

Target experience after the package name is finalized:

```bash
npm install -g @mvuljevas/pragmatik
pragmatik doctor
```

Or without a global install:

```bash
npx @mvuljevas/pragmatik doctor
```

## System Package Managers

These channels are desirable but not implemented yet:

```bash
brew install <tap>/pragmatik
choco install pragmatik
sudo npm install -g @mvuljevas/pragmatik
```

Additional future options:

- `winget` for Windows.
- `scoop` for Windows developer environments.
- Homebrew tap for macOS and Linux.
- GitHub Releases with standalone binaries.

Do not document any of these as available until a release channel exists.
