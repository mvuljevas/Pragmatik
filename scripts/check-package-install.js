import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sandbox = mkdtempSync(join(tmpdir(), "pragmatik-package-"));
const project = join(sandbox, "project");

try {
  mkdirSync(project, { recursive: true });
  const packOutput = execFileSync("npm", ["pack", "--json", "--pack-destination", sandbox], {
    cwd: ROOT,
    encoding: "utf8"
  });
  const [{ filename }] = JSON.parse(packOutput);
  const tarball = join(sandbox, basename(filename));

  writeFileSync(join(project, "package.json"), `${JSON.stringify({
    name: "pragmatik-install-check",
    private: true
  }, null, 2)}\n`);
  writeFileSync(join(project, ".agents.env"), [
    "AGENTS_CONTEXT_MODE=lean-context",
    "AGENTS_CONTEXT7=off",
    "AGENTS_REPOMIX=off",
    "AGENTS_TOKSCALE=off",
    "AGENTS_MCP=off",
    "AGENTS_USAGE_REPORT=off",
    "AGENTS_OPTIMIZATION_REPORT=off",
    ""
  ].join("\n"));

  execFileSync("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund", tarball], {
    cwd: project,
    stdio: "pipe"
  });
  const output = execFileSync(join(project, "node_modules", ".bin", "pragmatik"), ["run"], {
    cwd: project,
    encoding: "utf8"
  });

  if (!output.includes("AI tool automation")) {
    throw new Error(`Installed package did not run its bundled AI-tool backend.\n${output}`);
  }
  if (output.includes("No scripts/ai-tools.sh found")) {
    throw new Error(`Installed package reported the missing-backend regression.\n${output}`);
  }
  console.log("\x1b[32m✓\x1b[0m Packed installation runs the bundled AI-tool backend in the consumer project.");
} finally {
  rmSync(sandbox, { recursive: true, force: true });
}
