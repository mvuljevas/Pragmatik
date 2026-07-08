#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

const resources = {
  "project://summary": {
    name: "Project Summary",
    description: "Main project goals, stack details, and state summary from AI_CONTEXT.md or README.md",
    mimeType: "text/markdown",
    read: () => read("docs/AI_CONTEXT.md") || read("README.md")
  },
  "project://repo-map": {
    name: "Repository Map",
    description: "Structure and directory maps of files from docs/AI_SEARCH.md",
    mimeType: "text/markdown",
    read: () => read("docs/AI_SEARCH.md")
  },
  "project://version": {
    name: "Version",
    description: "Authoritative project and package version from VERSION or package.json",
    mimeType: "text/plain",
    read: () => read("VERSION") || packageVersion()
  },
  "project://recent-snapshots": {
    name: "Recent Snapshots",
    description: "Changelog, recent decisions, and memory snapshots from docs/SNAPSHOTS.md",
    mimeType: "text/markdown",
    read: () => tail("docs/SNAPSHOTS.md", 120)
  },
  "project://techdebt": {
    name: "Technical Debt",
    description: "Active technical debt, shortcuts, and bugs from docs/TECHDEBT.md",
    mimeType: "text/markdown",
    read: () => read("docs/TECHDEBT.md")
  },
  "project://roadmap": {
    name: "Roadmap",
    description: "Next milestones and future planning from docs/ROADMAP.md",
    mimeType: "text/markdown",
    read: () => read("docs/ROADMAP.md")
  }
};

function read(path) {
  const fullPath = join(ROOT, path);
  if (!existsSync(fullPath)) return "";
  return readFileSync(fullPath, "utf8").slice(0, 50000);
}

function tail(path, lines) {
  const text = read(path);
  if (!text) return "";
  return text.split("\n").slice(-lines).join("\n");
}

function packageVersion() {
  try {
    return JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version || "";
  } catch {
    return "";
  }
}

let buffer = "";
process.stdin.on("data", (chunk) => {
  buffer += chunk.toString();
  let lineEnd;
  while ((lineEnd = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, lineEnd).trim();
    buffer = buffer.slice(lineEnd + 1);
    if (line) {
      try {
        handleRequest(JSON.parse(line));
      } catch (err) {
        sendError(null, -32700, "Parse error");
      }
    }
  }
});

function sendResponse(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
}

function sendError(id, code, message) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }) + "\n");
}

function logDebug(msg) {
  console.error(`[MCP Debug] ${msg}`);
}

function handleRequest(req) {
  if (req.jsonrpc !== "2.0") {
    return sendError(req.id || null, -32600, "Invalid Request");
  }

  const { id, method, params } = req;

  switch (method) {
    case "initialize":
      return sendResponse(id, {
        protocolVersion: "2024-11-05",
        capabilities: {
          resources: {}
        },
        serverInfo: {
          name: "pragmatik-context-mcp",
          version: "0.3.0"
        }
      });

    case "notifications/initialized":
      logDebug("Client initialized successfully");
      return;

    case "resources/list": {
      const list = Object.entries(resources).map(([uri, res]) => ({
        uri,
        name: res.name,
        description: res.description,
        mimeType: res.mimeType
      }));
      return sendResponse(id, { resources: list });
    }

    case "resources/read": {
      const uri = params?.uri;
      if (!uri || !resources[uri]) {
        return sendError(id, -32602, `Invalid params: resource not found "${uri}"`);
      }
      const res = resources[uri];
      const text = res.read();
      return sendResponse(id, {
        contents: [{
          uri,
          mimeType: res.mimeType,
          text
        }]
      });
    }

    default:
      return sendError(id, -32601, `Method not found: ${method}`);
  }
}
