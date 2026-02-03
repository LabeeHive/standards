#!/usr/bin/env bun
/**
 * Initialize a session learning file for Autonomous Refinement Loop.
 *
 * Usage:
 *   bun scripts/init_session.ts <skill-name> <output-dir> [--task "description"]
 *
 * Examples:
 *   bun scripts/init_session.ts slide-editing slides/my-presentation
 *   bun scripts/init_session.ts slide-editing slides/demo --task "Create intro slide"
 *
 * Output:
 *   Creates .session-{timestamp}.md in the output directory
 *   Returns the session file path for subsequent logging
 */

import { parseArgs } from "util";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

interface SessionConfig {
  skillName: string;
  outputDir: string;
  task?: string;
}

function generateTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function generateSessionTemplate(config: SessionConfig, timestamp: string): string {
  const taskLine = config.task ? `**Task:** ${config.task}` : "**Task:** (Not specified)";

  return `# Session: ${config.skillName}
**Started:** ${new Date().toISOString()}
${taskLine}
**Status:** IN_PROGRESS

---

## Iterations

<!--
Add iterations as they occur:

## Iteration N

**Attempt:**
{What was generated/executed}

**Verification:**
- Status: PASS|FAIL
- Error: {error message if failed}
- Category: syntax|logic|resource|timeout

**Diagnosis:** (if failed)
{Analysis of what went wrong}

**Learning:** (if passed or important insight)
{What worked or what was learned}

-->

---

## Summary

| Metric | Value |
|--------|-------|
| Total iterations | 0 |
| Final status | IN_PROGRESS |
| Time elapsed | - |

### Key Learnings

<!-- Add learnings as discovered -->

### Recommendations

<!-- Add recommendations for future sessions -->
`;
}

function main() {
  const { positionals, values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      task: { type: "string", short: "t" },
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length < 2) {
    console.error(`Usage: bun scripts/init_session.ts <skill-name> <output-dir> [--task "description"]

Arguments:
  skill-name    Name of the skill being executed
  output-dir    Directory where output will be generated

Options:
  --task, -t    Brief description of the task
  --help, -h    Show this help message

Example:
  bun scripts/init_session.ts slide-editing slides/my-presentation --task "Create intro"
`);
    process.exit(values.help ? 0 : 1);
  }

  const config: SessionConfig = {
    skillName: positionals[0],
    outputDir: positionals[1],
    task: values.task,
  };

  // Ensure output directory exists
  if (!existsSync(config.outputDir)) {
    mkdirSync(config.outputDir, { recursive: true });
  }

  // Generate session file
  const timestamp = generateTimestamp();
  const sessionFileName = `.session-${timestamp}.md`;
  const sessionFilePath = join(config.outputDir, sessionFileName);

  const content = generateSessionTemplate(config, timestamp);
  writeFileSync(sessionFilePath, content, "utf-8");

  // Output the path for use by the skill
  console.log(
    JSON.stringify(
      {
        sessionFile: sessionFilePath,
        timestamp: timestamp,
        skillName: config.skillName,
        outputDir: config.outputDir,
      },
      null,
      2
    )
  );
}

main();
