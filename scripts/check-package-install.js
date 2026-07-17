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
  writeFileSync(join(project, ".pragmatik.env"), [
    "PRAGMATIK_CONTEXT_MODE=lean-context",
    "PRAGMATIK_SELECTED_TOOLS=",
    "PRAGMATIK_SUBMIT=off",
    "PRAGMATIK_DASHBOARD=off",
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

  // Verify measure and report commands with mock transcript data
  const mockHome = join(sandbox, "home");
  const brainDir = join(mockHome, ".gemini", "antigravity", "brain", "mock-session-123", ".system_generated", "logs");
  mkdirSync(brainDir, { recursive: true });
  writeFileSync(join(brainDir, "transcript.jsonl"), [
    JSON.stringify({ source: "USER_EXPLICIT", type: "USER_INPUT", created_at: "2026-07-17T00:00:00Z", content: "Hello world" }),
    JSON.stringify({ source: "MODEL", type: "TOOL_CALL", created_at: "2026-07-17T00:05:00Z", content: "Model response", tool_calls: [{}] })
  ].join("\n") + "\n");

  const measureOutput = execFileSync(join(project, "node_modules", ".bin", "pragmatik"), [
    "measure",
    "--client", "antigravity",
    "--human-hours", "1.5",
    "--hourly-rate", "100",
    "--task", "Integration test task"
  ], {
    cwd: project,
    env: { ...process.env, HOME: mockHome },
    encoding: "utf8"
  });

  if (!measureOutput.includes("Pragmatik Measure Complete")) {
    throw new Error(`Measure command failed during packed package test:\n${measureOutput}`);
  }
  console.log("\x1b[32m✓\x1b[0m Packed installation successfully runs 'pragmatik measure' on transcript logs.");

  const reportOutput = execFileSync(join(project, "node_modules", ".bin", "pragmatik"), ["report"], {
    cwd: project,
    env: { ...process.env, HOME: mockHome },
    encoding: "utf8"
  });

  if (!reportOutput.includes("Comparative Analytics") || !reportOutput.includes("Integration test task")) {
    throw new Error(`Report command failed during packed package test:\n${reportOutput}`);
  }
  console.log("\x1b[32m✓\x1b[0m Packed installation successfully runs 'pragmatik report' with comparative analytics.");

} finally {
  rmSync(sandbox, { recursive: true, force: true });
}
