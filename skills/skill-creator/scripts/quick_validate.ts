#!/usr/bin/env bun
/**
 * Quick validation script for skills
 *
 * Usage:
 *   bun scripts/quick_validate.ts <skill-directory>
 *
 * Exit codes:
 *   0 - Valid
 *   1 - Invalid
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ALLOWED_PROPERTIES = new Set([
  // Agent Skills Spec
  "name",
  "description",
  "license",
  "allowed-tools",
  "metadata",
  // Labee extensions
  "model",
  "context",
  "agent",
  "disable-model-invocation",
  "user-invocable",
]);

interface ValidationResult {
  valid: boolean;
  message: string;
}

export function validateSkill(skillPath: string): ValidationResult {
  // Check SKILL.md exists
  const skillMd = join(skillPath, "SKILL.md");
  if (!existsSync(skillMd)) {
    return { valid: false, message: "SKILL.md not found" };
  }

  // Read and validate frontmatter
  const content = readFileSync(skillMd, "utf-8");
  if (!content.startsWith("---")) {
    return { valid: false, message: "No YAML frontmatter found" };
  }

  // Extract frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return { valid: false, message: "Invalid frontmatter format" };
  }

  const frontmatterText = match[1];

  // Simple YAML parsing (key: value)
  const frontmatter: Record<string, string> = {};
  for (const line of frontmatterText.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    frontmatter[key] = value;
  }

  // Check for unexpected properties
  const unexpectedKeys = Object.keys(frontmatter).filter((k) => !ALLOWED_PROPERTIES.has(k));
  if (unexpectedKeys.length > 0) {
    return {
      valid: false,
      message: `Unexpected key(s) in SKILL.md frontmatter: ${unexpectedKeys.sort().join(", ")}. Allowed properties are: ${[...ALLOWED_PROPERTIES].sort().join(", ")}`,
    };
  }

  // Check required fields
  if (!frontmatter.name) {
    return { valid: false, message: "Missing 'name' in frontmatter" };
  }
  if (!frontmatter.description) {
    return { valid: false, message: "Missing 'description' in frontmatter" };
  }

  // Validate name
  const name = frontmatter.name.trim();
  if (name) {
    if (!/^[a-z0-9-]+$/.test(name)) {
      return { valid: false, message: `Name '${name}' should be hyphen-case (lowercase letters, digits, and hyphens only)` };
    }
    if (name.startsWith("-") || name.endsWith("-") || name.includes("--")) {
      return { valid: false, message: `Name '${name}' cannot start/end with hyphen or contain consecutive hyphens` };
    }
    if (name.length > 64) {
      return { valid: false, message: `Name is too long (${name.length} characters). Maximum is 64 characters.` };
    }
  }

  // Validate description
  const description = frontmatter.description.trim();
  if (description) {
    if (description.includes("<") || description.includes(">")) {
      return { valid: false, message: "Description cannot contain angle brackets (< or >)" };
    }
    if (description.length > 1024) {
      return { valid: false, message: `Description is too long (${description.length} characters). Maximum is 1024 characters.` };
    }
  }

  // --- Labee Standards ---

  // Description must have Triggers
  if (description && !description.includes("Triggers on")) {
    return { valid: false, message: "Description missing 'Triggers on' section (Labee standard: WHAT + WHEN + Triggers)" };
  }

  // allowed-tools must not contain bare "Bash" (must use specific patterns like Bash(git:*))
  const allowedTools = frontmatter["allowed-tools"] || "";
  if (allowedTools) {
    const tools = allowedTools.split(",").map((t) => t.trim());
    if (tools.includes("Bash")) {
      return { valid: false, message: "allowed-tools contains generic 'Bash'. Use specific patterns like Bash(git:*), Bash(bun:*)" };
    }
  }

  return { valid: true, message: "Skill is valid!" };
}

// CLI entry point
if (import.meta.main) {
  const skillPath = Bun.argv[2];

  if (!skillPath || skillPath === "--help" || skillPath === "-h") {
    console.log("Usage: bun scripts/quick_validate.ts <skill-directory>");
    process.exit(skillPath ? 0 : 1);
  }

  const { valid, message } = validateSkill(skillPath);
  console.log(message);
  process.exit(valid ? 0 : 1);
}
