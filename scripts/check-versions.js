import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function logSuccess(msg) {
  console.log(`\x1b[32m✓\x1b[0m ${msg}`);
}

function logError(msg) {
  console.error(`\x1b[31m✗\x1b[0m ${msg}`);
}

try {
  // 1. Read root VERSION
  const versionPath = join(ROOT, "VERSION");
  if (!existsSync(versionPath)) {
    throw new Error("Root VERSION file is missing");
  }
  const rootVersion = readFileSync(versionPath, "utf8").trim();
  logSuccess(`Root VERSION file: ${rootVersion}`);

  // 2. Read package.json version
  const packageJsonPath = join(ROOT, "package.json");
  if (!existsSync(packageJsonPath)) {
    throw new Error("Root package.json file is missing");
  }
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const packageVersion = packageJson.version;
  logSuccess(`package.json version: ${packageVersion}`);

  if (rootVersion !== packageVersion) {
    throw new Error(`Version mismatch: Root VERSION (${rootVersion}) does not match package.json version (${packageVersion})`);
  }

  // 3. Read cli/pragmatik.js version constant
  const cliPath = join(ROOT, "cli", "pragmatik.js");
  if (!existsSync(cliPath)) {
    throw new Error("cli/pragmatik.js is missing");
  }
  const cliContent = readFileSync(cliPath, "utf8");
  const versionMatch = cliContent.match(/const\s+VERSION\s*=\s*["']([^"']+)["']/);
  if (!versionMatch) {
    throw new Error("Could not find const VERSION in cli/pragmatik.js");
  }
  const cliVersion = versionMatch[1];
  logSuccess(`cli/pragmatik.js VERSION constant: ${cliVersion}`);

  if (rootVersion !== cliVersion) {
    throw new Error(`Version mismatch: Root VERSION (${rootVersion}) does not match cli/pragmatik.js VERSION (${cliVersion})`);
  }

  // 4. Verify template versions consistency
  const templatesDir = join(ROOT, "templates");
  if (existsSync(templatesDir)) {
    const templates = readdirSync(templatesDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    if (templates.length === 0) {
      logSuccess("No templates found to verify.");
    } else {
      let expectedTemplateVersion = null;
      for (const template of templates) {
        const templateVersionPath = join(templatesDir, template, "VERSION");
        if (!existsSync(templateVersionPath)) {
          throw new Error(`Template "${template}" is missing its VERSION file`);
        }
        const templateVersion = readFileSync(templateVersionPath, "utf8").trim();
        logSuccess(`Template "${template}" version: ${templateVersion}`);

        if (expectedTemplateVersion === null) {
          expectedTemplateVersion = templateVersion;
        } else if (templateVersion !== expectedTemplateVersion) {
          throw new Error(`Template version mismatch: Template "${template}" version (${templateVersion}) does not match other templates (${expectedTemplateVersion})`);
        }
      }
      logSuccess(`All templates are synchronized on version: ${expectedTemplateVersion}`);
    }
  }

  console.log("\n\x1b[32m✓ All version consistency checks passed successfully.\x1b[0m");
  process.exit(0);
} catch (error) {
  logError(error.message);
  process.exit(1);
}
