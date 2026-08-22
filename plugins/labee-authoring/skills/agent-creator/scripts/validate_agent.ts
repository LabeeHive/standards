#!/usr/bin/env bun
/**
 * Validate a Claude Code agent file.
 *
 * Usage:
 *   bun scripts/validate_agent.ts <agent-file.md>
 *
 * Checks:
 *   - Valid YAML frontmatter
 *   - Required fields (name, description)
 *   - Name format (lowercase, hyphens, 1-64 chars)
 *   - Description quality (length, no angle brackets)
 *   - Valid field names, tool names, model, permissionMode, memory
 *   - System prompt structure
 *
 * Exit codes:
 *   0 - Valid
 *   1 - Invalid
 */

import { readFileSync } from "fs";

const VALID_FIELDS = new Set([
  "name",
  "description",
  "model",
  "tools",
  "disallowedTools",
  "permissionMode",
  "maxTurns",
  "skills",
  "mcpServers",
  "hooks",
  "memory",
  "background",
  "effort",
  "isolation",
  "color",
  "initialPrompt",
]);

// Aliases; a full model ID (e.g. claude-sonnet-5) is also valid and is accepted via ID_PATTERN.
const VALID_MODELS = new Set(["sonnet", "opus", "haiku", "fable", "inherit"]);
const MODEL_ID_PATTERN = /^claude-[a-z0-9.\-]+(\[[a-z0-9]+\])?$/;

const VALID_PERMISSION_MODES = new Set([
  "default",
  "acceptEdits",
  "auto",
  "dontAsk",
  "bypassPermissions",
  "plan",
]);

const VALID_MEMORY_SCOPES = new Set(["user", "project", "local"]);

// Not exhaustive: new tools ship every release, so an unlisted name is a warning, not an error.
const KNOWN_TOOLS = new Set([
  "Read",
  "Write",
  "Edit",
  "Bash",
  "Glob",
  "Grep",
  "WebSearch",
  "WebFetch",
  "Agent",
  "Task", // legacy alias for Agent
  "Skill",
  "SendMessage",
  "ListAgents",
  "NotebookEdit",
  "EnterPlanMode",
  "ExitPlanMode",
  "AskUserQuestion",
  "Artifact",
  "Monitor",
  "EnterWorktree",
  "ExitWorktree",
  "ToolSearch",
  "LSP",
  "Workflow",
  "ScheduleWakeup",
  "TaskCreate",
  "TaskUpdate",
  "TaskList",
  "TaskGet",
  "TaskStop",
  "TaskOutput",
  "CronCreate",
  "CronDelete",
  "CronList",
]);

/**
 * Split a tool list on whitespace or commas, but only outside parentheses, so
 * patterns that contain spaces stay in one piece: `Bash(git add *)`.
 */
function splitToolList(value: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let depth = 0;

  for (const ch of value) {
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);

    if (depth === 0 && (ch === "," || /\s/.test(ch))) {
      if (current.trim()) tokens.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) tokens.push(current.trim());

  return tokens;
}

interface ParseResult {
  frontmatter: Record<string, string> | null;
  body: string;
  errors: string[];
}

function parseFrontmatter(content: string): ParseResult {
  const errors: string[] = [];

  if (!content.startsWith("---")) {
    errors.push("File must start with YAML frontmatter (---)");
    return { frontmatter: null, body: content, errors };
  }

  const parts = content.split("---");
  if (parts.length < 3) {
    errors.push("YAML frontmatter must be closed with ---");
    return { frontmatter: null, body: content, errors };
  }

  const frontmatterText = parts[1].trim();
  const body = parts.slice(2).join("---").trim();

  const frontmatter: Record<string, string> = {};
  for (const line of frontmatterText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    frontmatter[key] = value;
  }

  return { frontmatter, body, errors };
}

function validateName(name: string): string[] {
  const errors: string[] = [];

  if (!name) {
    errors.push("[name] Cannot be empty");
    return errors;
  }

  if (name.length > 64) {
    errors.push(`[name] Must be 64 characters or less (got ${name.length})`);
  }

  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    errors.push("[name] Must start with a lowercase letter, use only lowercase letters, numbers, and hyphens");
  }

  if (name.includes("--")) {
    errors.push("[name] Must not contain consecutive hyphens (--)");
  }

  if (name.endsWith("-")) {
    errors.push("[name] Must not end with a hyphen");
  }

  return errors;
}

function validateDescription(description: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!description) {
    errors.push("[description] Cannot be empty");
    return { errors, warnings };
  }

  if (description.startsWith("TODO")) {
    errors.push("[description] Still contains TODO placeholder");
  }

  if (description.length > 1024) {
    errors.push(`[description] Must be 1024 characters or less (got ${description.length})`);
  }

  if (description.includes("<") || description.includes(">")) {
    errors.push("[description] Must not contain angle brackets");
  }

  if (description.length < 20) {
    warnings.push("[description] Very short — consider adding more detail for better delegation");
  }

  if (!description.toLowerCase().includes("use") && !description.toLowerCase().includes("when")) {
    warnings.push('[description] Consider adding usage context (e.g., "Use when...")');
  }

  return { errors, warnings };
}

function validateTools(toolsStr: string): string[] {
  const warnings: string[] = [];
  if (!toolsStr) return warnings;

  const tools = splitToolList(toolsStr);
  for (const tool of tools) {
    const baseTool = tool.split("(")[0].trim();
    // MCP tools are named mcp__<server>__<tool> and are never in KNOWN_TOOLS.
    if (baseTool.startsWith("mcp__")) continue;
    if (!KNOWN_TOOLS.has(baseTool)) {
      warnings.push(`[tools] Unrecognized tool name: ${tool} (check spelling; new tools ship every release)`);
    }
  }

  return warnings;
}

function validateBody(body: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!body.trim()) {
    warnings.push("[body] System prompt is empty");
    return { errors, warnings };
  }

  if (body.includes("TODO")) {
    warnings.push("[body] Still contains TODO placeholders");
  }

  const lines = body.split("\n");
  if (lines.length > 200) {
    warnings.push(`[body] System prompt is long (${lines.length} lines) — consider keeping under 200 lines`);
  }

  return { errors, warnings };
}

function main() {
  const filepath = Bun.argv[2];

  if (!filepath || filepath === "--help" || filepath === "-h") {
    console.log("Usage: bun scripts/validate_agent.ts <agent-file.md>");
    process.exit(filepath ? 0 : 1);
  }

  let content: string;
  try {
    content = readFileSync(filepath, "utf-8");
  } catch {
    console.error(`Error: Cannot read file: ${filepath}`);
    process.exit(1);
  }

  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Parse frontmatter
  const { frontmatter, body, errors: parseErrors } = parseFrontmatter(content);
  allErrors.push(...parseErrors);

  if (frontmatter) {
    // Required fields
    if (!frontmatter.name) {
      allErrors.push("[frontmatter] Missing required field: name");
    } else {
      allErrors.push(...validateName(frontmatter.name));
    }

    if (!frontmatter.description) {
      allErrors.push("[frontmatter] Missing required field: description");
    } else {
      const { errors, warnings } = validateDescription(frontmatter.description);
      allErrors.push(...errors);
      allWarnings.push(...warnings);
    }

    // Unknown fields
    for (const key of Object.keys(frontmatter)) {
      if (!VALID_FIELDS.has(key)) {
        allWarnings.push(`[frontmatter] Unknown field: ${key}`);
      }
    }

    // Model
    if (
      frontmatter.model &&
      !VALID_MODELS.has(frontmatter.model) &&
      !MODEL_ID_PATTERN.test(frontmatter.model)
    ) {
      allErrors.push(
        `[model] Invalid value: ${frontmatter.model}. Must be one of: ${[...VALID_MODELS].sort().join(", ")}, or a full model ID (claude-...)`
      );
    }

    // Permission mode
    if (frontmatter.permissionMode && !VALID_PERMISSION_MODES.has(frontmatter.permissionMode)) {
      allErrors.push(
        `[permissionMode] Invalid value: ${frontmatter.permissionMode}. Must be one of: ${[...VALID_PERMISSION_MODES].sort().join(", ")}`
      );
    }

    // Memory
    if (frontmatter.memory && !VALID_MEMORY_SCOPES.has(frontmatter.memory)) {
      allErrors.push(
        `[memory] Invalid value: ${frontmatter.memory}. Must be one of: ${[...VALID_MEMORY_SCOPES].sort().join(", ")}`
      );
    }

    // Tools
    if (frontmatter.tools) {
      allWarnings.push(...validateTools(frontmatter.tools));
    }
  }

  // Body
  const { errors: bodyErrors, warnings: bodyWarnings } = validateBody(body);
  allErrors.push(...bodyErrors);
  allWarnings.push(...bodyWarnings);

  // Output
  if (allWarnings.length > 0) {
    for (const w of allWarnings) {
      console.log(`  Warning: ${w}`);
    }
    console.log();
  }

  if (allErrors.length > 0) {
    console.log(`INVALID: ${allErrors.length} error(s) found:`);
    for (const e of allErrors) {
      console.log(`  ${e}`);
    }
    process.exit(1);
  } else {
    console.log(`VALID: ${filepath}`);
    process.exit(0);
  }
}

main();
