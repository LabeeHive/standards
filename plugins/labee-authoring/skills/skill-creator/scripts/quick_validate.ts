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
  // Agent Skills Spec (https://agentskills.io/specification)
  "name",
  "description",
  "license",
  "compatibility",
  "allowed-tools",
  "metadata",
  // Claude Code extensions (https://code.claude.com/docs/en/skills)
  "model",
  "effort",
  "when_to_use",
  "arguments",
  "context",
  "agent",
  "background",
  "paths",
  "argument-hint",
  "disable-model-invocation",
  "user-invocable",
  "disallowed-tools",
  "hooks",
  "shell",
]);

// Valid Claude Code fields that this repository nonetheless forbids — see
// references/output-patterns.md. They stay in ALLOWED_PROPERTIES so a skill that
// sets one gets this specific message instead of a generic "unknown key".
const FORBIDDEN_PROPERTIES = ["allowed-tools", "model", "effort", "context", "agent", "background", "paths"];

const RESERVED_NAME_WORDS = ["anthropic", "claude"];

// Claude Code 2.1.218+ accepts these spellings for boolean frontmatter fields.
const TRUTHY_VALUES = new Set(["true", "yes", "on", "1"]);

function isTruthy(value: string | undefined): boolean {
  return TRUTHY_VALUES.has((value || "").trim().toLowerCase());
}

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

  // Check for properties this repository forbids
  const forbiddenKeys = FORBIDDEN_PROPERTIES.filter((k) => k in frontmatter);
  if (forbiddenKeys.length > 0) {
    return {
      valid: false,
      message: `Forbidden key(s) in SKILL.md frontmatter: ${forbiddenKeys.sort().join(", ")}. Do not set ${FORBIDDEN_PROPERTIES.join(", ")} in this repository — see references/output-patterns.md`,
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
    for (const word of RESERVED_NAME_WORDS) {
      if (name.includes(word)) {
        return { valid: false, message: `Name '${name}' contains reserved word '${word}'. Names cannot contain 'anthropic' or 'claude'.` };
      }
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

  // Trigger phrases must exist in when_to_use (recommended) or inline in description.
  // Skipped for disable-model-invocation skills: Claude cannot see or auto-invoke them,
  // so trigger phrases there are dead text (see SKILL.md Phase 8 checklist).
  const whenToUse = (frontmatter["when_to_use"] || "").trim();
  const modelInvocationDisabled = isTruthy(frontmatter["disable-model-invocation"]);
  if (
    description &&
    !modelInvocationDisabled &&
    !description.includes("Triggers on") &&
    !whenToUse.includes("Triggers on")
  ) {
    return { valid: false, message: "Missing 'Triggers on' section (Labee standard: put triggers in when_to_use, or inline in description)" };
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
