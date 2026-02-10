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
]);

const VALID_MODELS = new Set(["sonnet", "opus", "haiku", "inherit"]);

const VALID_PERMISSION_MODES = new Set([
  "default",
  "acceptEdits",
  "dontAsk",
  "delegate",
  "bypassPermissions",
  "plan",
]);

const VALID_MEMORY_SCOPES = new Set(["user", "project", "local"]);

const KNOWN_TOOLS = new Set([
  "Read",
  "Write",
  "Edit",
  "Bash",
  "Glob",
  "Grep",
  "WebSearch",
  "WebFetch",
  "Task",
  "Skill",
  "SendMessage",
  "NotebookEdit",
  "EnterPlanMode",
  "ExitPlanMode",
  "AskUserQuestion",
  "TodoWrite",
  "TaskCreate",
  "TaskUpdate",
  "TaskList",
  "TaskGet",
  "TeamCreate",
  "TeamDelete",
]);

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
  const errors: string[] = [];
  if (!toolsStr) return errors;

  const tools = toolsStr.split(",").map((t) => t.trim());
  for (const tool of tools) {
    const baseTool = tool.split("(")[0].trim();
    if (!KNOWN_TOOLS.has(baseTool)) {
      errors.push(`[tools] Unknown tool: ${tool}`);
    }
  }

  return errors;
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
    if (frontmatter.model && !VALID_MODELS.has(frontmatter.model)) {
      allErrors.push(
        `[model] Invalid value: ${frontmatter.model}. Must be one of: ${[...VALID_MODELS].sort().join(", ")}`
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
      allErrors.push(...validateTools(frontmatter.tools));
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
