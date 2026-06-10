#!/usr/bin/env bun
/**
 * Skill Initializer - Creates a new skill from template
 *
 * Usage:
 *   bun scripts/init_skill.ts <skill-name> --path <path>
 *
 * Examples:
 *   bun scripts/init_skill.ts my-new-skill --path skills
 *   bun scripts/init_skill.ts my-api-helper --path /custom/location
 *
 * Exit codes:
 *   0 - Success
 *   1 - Failure
 */

import { existsSync, mkdirSync, writeFileSync, chmodSync } from "fs";
import { join, resolve } from "path";

function titleCase(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const SKILL_TEMPLATE = (name: string, title: string) => `---
name: ${name}
description: [TODO: WHAT it does]. [WHEN to use].
when_to_use: Triggers on "english-trigger", "日本語トリガー".
model: sonnet
allowed-tools: Read Glob Grep
# paths: "**/*.ext"           # Glob patterns for auto-activation (strongly recommended)
# effort: high                # low | medium | high | xhigh | max (availability depends on model)
# argument-hint: "[input]"   # Hint shown in / autocomplete
# context: fork              # Uncomment for isolated execution
# agent: general-purpose     # Agent type when context: fork
---

# ${title}

## Overview

[TODO: 1-2 sentences explaining what this skill enables]

## Available Substitutions

- \`$ARGUMENTS\` — All arguments passed by user (e.g., \`/skill-name arg1 arg2\`)
- \`$ARGUMENTS[0]\` / \`$0\` — First argument by index
- \`\${CLAUDE_SKILL_DIR}\` — This skill's directory path (use for referencing bundled files)
- \`!\\\`command\\\`\` — Dynamic context injection (shell command output replaces placeholder)

Delete this section when done — it's just guidance.

## Structuring This Skill

[TODO: Choose the structure that best fits this skill's purpose. Common patterns:

**1. Workflow-Based** (best for sequential processes)
- Works well when there are clear step-by-step procedures
- Example: DOCX skill with "Workflow Decision Tree" → "Reading" → "Creating" → "Editing"
- Structure: ## Overview → ## Workflow Decision Tree → ## Step 1 → ## Step 2...

**2. Task-Based** (best for tool collections)
- Works well when the skill offers different operations/capabilities
- Example: PDF skill with "Quick Start" → "Merge PDFs" → "Split PDFs" → "Extract Text"
- Structure: ## Overview → ## Quick Start → ## Task Category 1 → ## Task Category 2...

**3. Reference/Guidelines** (best for standards or specifications)
- Works well for brand guidelines, coding standards, or requirements
- Example: Brand styling with "Brand Guidelines" → "Colors" → "Typography" → "Features"
- Structure: ## Overview → ## Guidelines → ## Specifications → ## Usage...

**4. Capabilities-Based** (best for integrated systems)
- Works well when the skill provides multiple interrelated features
- Example: Product Management with "Core Capabilities" → numbered capability list
- Structure: ## Overview → ## Core Capabilities → ### 1. Feature → ### 2. Feature...

Patterns can be mixed and matched as needed. Most skills combine patterns (e.g., start with task-based, add workflow for complex operations).

Delete this entire "Structuring This Skill" section when done - it's just guidance.]

## [TODO: Replace with the first main section based on chosen structure]

[TODO: Add content here. See examples in existing skills:
- Code samples for technical skills
- Decision trees for complex workflows
- Concrete examples with realistic user requests
- References to scripts/templates/references as needed]

## Resources

This skill includes example resource directories. **Delete unused directories.**

### scripts/
Executable code for **deterministic, repeatable operations**.

- **Language:** TypeScript with Bun (\`bun scripts/example.ts\`)
- **Use when:** Validation, transformation, automation
- **Pattern:** CLI with exit codes, stdout for results, stderr for errors
- **Note:** Avoid \`bunx <package>\` in CI (exit code issues); use \`bun\` direct execution

### references/
Documentation Claude **reads into context** when needed.

- **Use when:** API specs, detailed guides, domain knowledge
- **Pattern:** Focused markdown files, on-demand loading
- **Naming:** \`_filename.md\` for auto-load (use sparingly)

### assets/
Files used **in output**, not for Claude's understanding.

- **Use when:** Templates, images, fonts, boilerplate
- **Pattern:** Binary or template files copied to output

See \`references/resource-patterns.md\` in skill-creator for detailed guidelines.
`;

const EXAMPLE_SCRIPT = (name: string) => `#!/usr/bin/env bun
/**
 * Example helper script for ${name}
 *
 * Usage:
 *   bun scripts/example.ts <input>
 *
 * This is a placeholder script. Replace with actual implementation or delete.
 */

function main() {
  const args = Bun.argv.slice(2);

  if (args.length < 1) {
    console.error("Usage: bun scripts/example.ts <input>");
    process.exit(1);
  }

  console.log(\`Processing: \${args[0]}\`);
  // TODO: Add actual script logic here
}

main();
`;

const EXAMPLE_REFERENCE = (title: string) => `# Reference Documentation for ${title}

This is a placeholder for detailed reference documentation.
Replace with actual reference content or delete if not needed.

Example real reference docs from other skills:
- product-management/references/communication.md - Comprehensive guide for status updates
- product-management/references/context_building.md - Deep-dive on gathering context
- bigquery/references/ - API references and query examples

## When Reference Docs Are Useful

Reference docs are ideal for:
- Comprehensive API documentation
- Detailed workflow guides
- Complex multi-step processes
- Information too lengthy for main SKILL.md
- Content that's only needed for specific use cases

## Structure Suggestions

### API Reference Example
- Overview
- Authentication
- Endpoints with examples
- Error codes
- Rate limits

### Workflow Guide Example
- Prerequisites
- Step-by-step instructions
- Common patterns
- Troubleshooting
- Best practices
`;

const EXAMPLE_ASSET = `# Example Asset File

This placeholder represents where asset files would be stored.
Replace with actual asset files (templates, images, fonts, etc.) or delete if not needed.

Asset files are NOT intended to be loaded into context, but rather used within
the output Claude produces.

Example asset files from other skills:
- Brand guidelines: logo.png, slides_template.pptx
- Frontend builder: hello-world/ directory with HTML/React boilerplate
- Typography: custom-font.ttf, font-family.woff2
- Data: sample_data.csv, test_dataset.json

## Common Asset Types

- Templates: .pptx, .docx, boilerplate directories
- Images: .png, .jpg, .svg, .gif
- Fonts: .ttf, .otf, .woff, .woff2
- Boilerplate code: Project directories, starter files
- Icons: .ico, .svg
- Data files: .csv, .json, .xml, .yaml

Note: This is a text placeholder. Actual assets can be any file type.
`;

function main() {
  const args = Bun.argv.slice(2);

  if (args.length < 3 || args[1] !== "--path") {
    console.log(`Usage: bun scripts/init_skill.ts <skill-name> --path <path>

Skill name requirements:
  - Hyphen-case identifier (e.g., 'data-analyzer')
  - Lowercase letters, digits, and hyphens only
  - Max 64 characters
  - Must match directory name exactly

Examples:
  bun scripts/init_skill.ts my-new-skill --path skills
  bun scripts/init_skill.ts my-api-helper --path /custom/location`);
    process.exit(1);
  }

  const skillName = args[0];
  const path = args[2];

  console.log(`🚀 Initializing skill: ${skillName}`);
  console.log(`   Location: ${path}`);
  console.log();

  const skillDir = resolve(path, skillName);
  const skillTitle = titleCase(skillName);

  // Check if directory already exists
  if (existsSync(skillDir)) {
    console.error(`❌ Error: Skill directory already exists: ${skillDir}`);
    process.exit(1);
  }

  // Create skill directory
  mkdirSync(skillDir, { recursive: true });
  console.log(`✅ Created skill directory: ${skillDir}`);

  // Create SKILL.md
  writeFileSync(join(skillDir, "SKILL.md"), SKILL_TEMPLATE(skillName, skillTitle));
  console.log("✅ Created SKILL.md");

  // Create scripts/example.ts
  const scriptsDir = join(skillDir, "scripts");
  mkdirSync(scriptsDir);
  const exampleScript = join(scriptsDir, "example.ts");
  writeFileSync(exampleScript, EXAMPLE_SCRIPT(skillName));
  chmodSync(exampleScript, 0o755);
  console.log("✅ Created scripts/example.ts");

  // Create references/api_reference.md
  const referencesDir = join(skillDir, "references");
  mkdirSync(referencesDir);
  writeFileSync(join(referencesDir, "api_reference.md"), EXAMPLE_REFERENCE(skillTitle));
  console.log("✅ Created references/api_reference.md");

  // Create assets/example_asset.txt
  const assetsDir = join(skillDir, "assets");
  mkdirSync(assetsDir);
  writeFileSync(join(assetsDir, "example_asset.txt"), EXAMPLE_ASSET);
  console.log("✅ Created assets/example_asset.txt");

  console.log(`\n✅ Skill '${skillName}' initialized successfully at ${skillDir}`);
  console.log("\nNext steps:");
  console.log("1. Edit SKILL.md to complete the TODO items and update the description");
  console.log("2. Customize or delete the example files in scripts/, references/, and assets/");
  console.log("3. Run the validator when ready to check the skill structure");
}

main();
