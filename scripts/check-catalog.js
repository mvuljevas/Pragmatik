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
  const catalogPath = join(ROOT, "docs", "CATALOG.md");
  if (!existsSync(catalogPath)) {
    throw new Error("docs/CATALOG.md is missing");
  }

  const catalogContent = readFileSync(catalogPath, "utf8");

  // Regex to match markdown table rows: | Name | Path | Status | Use When |
  // e.g. | `docs-only` | `templates/docs-only/` | available | ... |
  const rowRegex = /\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*([a-zA-Z0-9_-]+)\s*\|/g;

  const catalogEntries = [];
  let match;
  while ((match = rowRegex.exec(catalogContent)) !== null) {
    catalogEntries.push({
      name: match[1].trim(),
      path: match[2].trim(),
      status: match[3].trim().toLowerCase()
    });
  }

  if (catalogEntries.length === 0) {
    throw new Error("No template or preset entries found in docs/CATALOG.md table");
  }

  logSuccess(`Found ${catalogEntries.length} catalog entries in docs/CATALOG.md`);

  // Track registered available/draft directories
  const registeredPaths = new Set();

  // Validate catalog entry statuses against filesystem
  for (const entry of catalogEntries) {
    // Strip trailing slash for matching
    const relativePath = entry.path.replace(/\/$/, "");
    const fullPath = join(ROOT, relativePath);
    const pathExists = existsSync(fullPath);

    logSuccess(`Checking catalog entry: ${entry.name} (${entry.status}) at ${entry.path}`);

    if (entry.status === "available" || entry.status === "draft") {
      if (!pathExists) {
        throw new Error(`Catalog drift: Entry "${entry.name}" is marked as "${entry.status}" but path "${entry.path}" does not exist in filesystem`);
      }
      registeredPaths.add(relativePath);
    } else if (entry.status === "planned") {
      if (pathExists) {
        throw new Error(`Catalog drift: Entry "${entry.name}" is marked as "planned" but its directory "${entry.path}" already exists. Update its status to "available" or "draft"`);
      }
    }
  }

  // Scan physical directories in templates/
  const templatesDir = join(ROOT, "templates");
  if (existsSync(templatesDir)) {
    const templates = readdirSync(templatesDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `templates/${entry.name}`);

    for (const templatePath of templates) {
      if (!registeredPaths.has(templatePath)) {
        throw new Error(`Catalog drift: Directory "${templatePath}/" exists on disk but is not registered as "available" or "draft" in docs/CATALOG.md`);
      }
    }
  }

  // Scan physical directories in presets/
  const presetsDir = join(ROOT, "presets");
  if (existsSync(presetsDir)) {
    const presets = readdirSync(presetsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `presets/${entry.name}`);

    for (const presetPath of presets) {
      if (!registeredPaths.has(presetPath)) {
        throw new Error(`Catalog drift: Directory "${presetPath}/" exists on disk but is not registered as "available" or "draft" in docs/CATALOG.md`);
      }
    }
  }

  console.log("\n\x1b[32m✓ Catalog consistency and synchronization checks passed successfully.\x1b[0m");
  process.exit(0);
} catch (error) {
  logError(error.message);
  process.exit(1);
}
