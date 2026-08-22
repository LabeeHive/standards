#!/usr/bin/env bun
/**
 * Initialize a Claude Code agent scaffold.
 *
 * Usage:
 *   bun scripts/init_agent.ts <agent-name> [options]
 *
 * Options:
 *   --path <dir>       Directory to create the agent file (default: .claude/agents)
 *   --scope <scope>    project | user | plugin (default: project)
 *   --labee            Use Labee team agent template with persona sections
 *   --description <d>  Agent description
 *   --model <model>    sonnet | opus | haiku | inherit (default: omit the field, which inherits)
 *   --tools <tools>    Comma-separated tool list (default: "Read, Grep, Glob, Bash")
 *   --memory <scope>   user | project | local | none (default: omit the field — auto memory
 *                      is off in Labee's environment, CLAUDE_CODE_DISABLE_AUTO_MEMORY=1)
 *
 * Exit codes:
 *   0 - Success
 *   1 - Validation error or failure
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { parseArgs } from "util";

/**
 * The reporting convention every agent in this repository carries.
 * Keep these bullets identical to references/system-prompt-patterns.md and to
 * agents/*.md. Reviewing and scanning agents add their own extras by hand —
 * the "0 findings after scanning" vs "not scanned" distinction, false-positive
 * marking, and re-review handling — which is why they are not in this template.
 */
const REPORTING_SECTION = `## Reporting

- Within your first tool round, \`SendMessage\` a one-line plan to \`"main"\`.
- Send one line to \`"main"\` at each milestone.
- Before doing anything outside the brief you were given, \`SendMessage\` to \`"main"\` and wait for an answer.
- When the result runs longer than a few lines, write it to the file path the brief names, and state that path in your last message.
- Never claim a check you did not run.`;

const AGENT_TEMPLATE = (opts: {
  name: string;
  description: string;
  model: string;
  tools: string;
  memory: string;
  role: string;
}) => {
  const modelLine = opts.model ? `\nmodel: ${opts.model}` : "";
  const memoryLine = opts.memory && opts.memory !== "none" ? `\nmemory: ${opts.memory}` : "";
  return `---
name: ${opts.name}
description: "${opts.description}"${modelLine}
tools: ${opts.tools}${memoryLine}
---

You are a ${opts.role}.

## About You

- TODO: Background, personality traits, expertise

## Responsibilities

- TODO: List primary responsibilities

## Handling Requests

When invoked:

1. TODO: First step
2. TODO: Second step
3. TODO: Third step

## Key Practices

- TODO: Important guidelines

${REPORTING_SECTION}

## Communication Style

- TODO: How the agent communicates

## Prohibited

- TODO: What the agent must never do
`;
};

const LABEE_TEMPLATE = (opts: {
  name: string;
  description: string;
  model: string;
  tools: string;
}) => `---
name: ${opts.name}
description: "${opts.description}"${opts.model ? `\nmodel: ${opts.model}` : ""}
tools: ${opts.tools}
---

You are TODO: 日本名 (TODO: English Name).
You work as a TODO: role title at Labee LLC, handling requests from the CEO and other team members.

## About You

- TODO: Age, education background
- TODO: Personality traits
- TODO: Relevant expertise
- TODO: Hobbies and personal details

## Company

- Vision: もっと自由に、もっと楽しく。 (More freedom, more fun.)
- Mission: Develop free and innovative services and tools, bringing positive change to society through technology and design
- Values: Freedom, sharing joy, simplicity, honesty in technology

## Responsibilities

- TODO: Primary responsibility 1
- TODO: Primary responsibility 2
- TODO: Primary responsibility 3

## Handling Requests

You receive requests as a team member. Respond in your own words, not with template-like replies.

1. TODO: How to accept requests
2. TODO: How to process work
3. TODO: How to present results
4. TODO: How to confirm and finalize

${REPORTING_SECTION}

## Communication Style

- TODO: Tone description
- Catchphrases: TODO: 2-4 characteristic phrases in Japanese
- TODO: How to address others

## Prohibited

- TODO: Hard boundary 1
- TODO: Hard boundary 2
- TODO: Hard boundary 3
`;

function validateAgentName(name: string): string[] {
  const errors: string[] = [];

  if (!name) {
    errors.push("Agent name cannot be empty");
    return errors;
  }

  if (name.length > 64) {
    errors.push(`Agent name must be 64 characters or less (got ${name.length})`);
  }

  if (name.length === 1) {
    if (!/^[a-z]$/.test(name)) {
      errors.push("Single-character agent name must be a lowercase letter");
    }
  } else if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(name)) {
    errors.push(
      "Agent name must use lowercase letters, numbers, and hyphens only, " +
        "starting with a letter and ending with a letter or number"
    );
  }

  if (name.includes("--")) {
    errors.push("Agent name must not contain consecutive hyphens (--)");
  }

  return errors;
}

function titleCase(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function main() {
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      path: { type: "string", default: ".claude/agents" },
      scope: { type: "string", default: "project" },
      labee: { type: "boolean", default: false },
      description: { type: "string", default: "TODO: Describe what this agent does and when to use it" },
      model: { type: "string" },
      tools: { type: "string", default: "Read, Grep, Glob, Bash" },
      memory: { type: "string" },
      help: { type: "boolean", short: "h", default: false },
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length === 0) {
    console.log(`Usage: bun scripts/init_agent.ts <agent-name> [options]

Options:
  --path <dir>         Directory to create the agent file (default: .claude/agents)
  --scope <scope>      project | user | plugin (default: project)
  --labee              Use Labee team agent template
  --description <d>    Agent description
  --model <model>      sonnet | opus | haiku | fable | inherit
                       (default: omit the field, so the agent inherits the session model)
  --tools <tools>      Comma-separated tool list (default: "Read, Grep, Glob, Bash")
  --memory <scope>     user | project | local | none
                       (default: omit the field, since auto memory is off in Labee's
                       environment via CLAUDE_CODE_DISABLE_AUTO_MEMORY=1)
  -h, --help           Show this help`);
    process.exit(positionals.length === 0 && !values.help ? 1 : 0);
  }

  const name = positionals[0];

  // Validate name
  const errors = validateAgentName(name);
  if (errors.length > 0) {
    for (const e of errors) {
      console.error(`Error: ${e}`);
    }
    process.exit(1);
  }

  // Validate model (optional: omitted means the agent inherits the session model)
  const validModels = ["sonnet", "opus", "haiku", "fable", "inherit"];
  if (values.model !== undefined && !validModels.includes(values.model)) {
    console.error(`Error: Invalid model "${values.model}". Must be one of: ${validModels.join(", ")}`);
    process.exit(1);
  }

  // Validate memory (optional: omitted means no memory field, the Labee default)
  const validMemory = ["user", "project", "local", "none"];
  if (values.memory !== undefined && !validMemory.includes(values.memory)) {
    console.error(`Error: Invalid memory "${values.memory}". Must be one of: ${validMemory.join(", ")}`);
    process.exit(1);
  }

  // Determine output path
  let outputDir: string;
  if (values.scope === "user") {
    outputDir = join(process.env.HOME || "~", ".claude", "agents");
  } else {
    outputDir = values.path!;
  }

  const outputFile = join(outputDir, `${name}.md`);

  if (existsSync(outputFile)) {
    console.error(`Error: Agent file already exists: ${outputFile}`);
    process.exit(1);
  }

  // Create directory
  mkdirSync(outputDir, { recursive: true });

  // Generate content
  let content: string;
  if (values.labee) {
    content = LABEE_TEMPLATE({
      name,
      description: values.description!,
      model: values.model ?? "",
      tools: values.tools!,
    });
  } else {
    content = AGENT_TEMPLATE({
      name,
      description: values.description!,
      model: values.model ?? "",
      tools: values.tools!,
      memory: values.memory ?? "",
      role: titleCase(name).toLowerCase() + " specialist",
    });
  }

  writeFileSync(outputFile, content);

  console.log(`Created agent: ${outputFile}`);
  console.log();
  console.log("Next steps:");
  console.log("  1. Edit the file to fill in TODO sections");
  console.log("  2. Run validate_agent.ts to check the configuration");
  console.log("  3. Restart Claude Code or use /agents to load");
}

main();
