#!/usr/bin/env bun
/**
 * Skill Packager - Creates a distributable .skill file of a skill folder
 *
 * Usage:
 *   bun scripts/package_skill.ts <path/to/skill-folder> [output-directory]
 *
 * Examples:
 *   bun scripts/package_skill.ts skills/my-skill
 *   bun scripts/package_skill.ts skills/my-skill ./dist
 *
 * Exit codes:
 *   0 - Success
 *   1 - Failure
 */

import { existsSync, mkdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { validateSkill } from "./quick_validate.ts";

async function main() {
  const args = Bun.argv.slice(2);

  if (args.length < 1 || args[0] === "--help" || args[0] === "-h") {
    console.log(`Usage: bun scripts/package_skill.ts <path/to/skill-folder> [output-directory]

Examples:
  bun scripts/package_skill.ts skills/my-skill
  bun scripts/package_skill.ts skills/my-skill ./dist`);
    process.exit(args.length === 0 ? 1 : 0);
  }

  const skillPath = resolve(args[0]);
  const outputDir = args[1] ? resolve(args[1]) : process.cwd();

  console.log(`📦 Packaging skill: ${args[0]}`);
  if (args[1]) {
    console.log(`   Output directory: ${args[1]}`);
  }
  console.log();

  // Validate path
  if (!existsSync(skillPath)) {
    console.error(`❌ Error: Skill folder not found: ${skillPath}`);
    process.exit(1);
  }

  if (!statSync(skillPath).isDirectory()) {
    console.error(`❌ Error: Path is not a directory: ${skillPath}`);
    process.exit(1);
  }

  if (!existsSync(join(skillPath, "SKILL.md"))) {
    console.error(`❌ Error: SKILL.md not found in ${skillPath}`);
    process.exit(1);
  }

  // Validate skill
  console.log("🔍 Validating skill...");
  const { valid, message } = validateSkill(skillPath);
  if (!valid) {
    console.error(`❌ Validation failed: ${message}`);
    console.error("   Please fix the validation errors before packaging.");
    process.exit(1);
  }
  console.log(`✅ ${message}\n`);

  // Create output directory
  mkdirSync(outputDir, { recursive: true });

  // Package as .skill (zip)
  const skillName = skillPath.split("/").pop()!;
  const skillFilename = join(outputDir, `${skillName}.skill`);
  const parentDir = resolve(skillPath, "..");

  const proc = Bun.spawnSync(["zip", "-r", skillFilename, skillName], {
    cwd: parentDir,
    stdout: "pipe",
    stderr: "pipe",
  });

  if (proc.exitCode !== 0) {
    console.error(`❌ Error creating .skill file: ${proc.stderr.toString()}`);
    process.exit(1);
  }

  console.log(`\n✅ Successfully packaged skill to: ${skillFilename}`);
}

main();
