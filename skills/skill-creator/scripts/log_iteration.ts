#!/usr/bin/env bun
/**
 * Log an iteration to a session learning file.
 *
 * Usage:
 *   bun scripts/log_iteration.ts <session-file> <iteration> --status pass|fail [options]
 *
 * Examples:
 *   bun scripts/log_iteration.ts .session-123.md 1 --status fail --error "Syntax error" --category syntax
 *   bun scripts/log_iteration.ts .session-123.md 2 --status pass --learning "Fixed by adding semicolon"
 *
 * Options:
 *   --status      Required: pass or fail
 *   --attempt     Description of what was attempted
 *   --error       Error message (for failures)
 *   --category    Error category: syntax|logic|resource|timeout|unknown
 *   --diagnosis   Analysis of what went wrong
 *   --learning    What was learned from this iteration
 */

import { parseArgs } from "util";
import { readFileSync, writeFileSync, existsSync } from "fs";

interface IterationLog {
  iteration: number;
  status: "pass" | "fail";
  attempt?: string;
  error?: string;
  category?: string;
  diagnosis?: string;
  learning?: string;
}

function formatIteration(log: IterationLog): string {
  let content = `\n## Iteration ${log.iteration}\n\n`;

  if (log.attempt) {
    content += `**Attempt:**\n${log.attempt}\n\n`;
  }

  content += `**Verification:**\n`;
  content += `- Status: ${log.status.toUpperCase()}\n`;

  if (log.status === "fail") {
    if (log.error) {
      content += `- Error: ${log.error}\n`;
    }
    if (log.category) {
      content += `- Category: ${log.category}\n`;
    }
  }

  content += "\n";

  if (log.diagnosis && log.status === "fail") {
    content += `**Diagnosis:**\n${log.diagnosis}\n\n`;
  }

  if (log.learning) {
    content += `**Learning:**\n${log.learning}\n\n`;
  }

  content += "---\n";

  return content;
}

function updateSummary(content: string, iteration: number, status: "pass" | "fail"): string {
  // Update iteration count
  content = content.replace(
    /\| Total iterations \| \d+ \|/,
    `| Total iterations | ${iteration} |`
  );

  // Update status if passed
  if (status === "pass") {
    content = content.replace(
      /\| Final status \| IN_PROGRESS \|/,
      "| Final status | SUCCESS |"
    );
    content = content.replace(/\*\*Status:\*\* IN_PROGRESS/, "**Status:** SUCCESS");
  }

  return content;
}

function main() {
  const { positionals, values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      status: { type: "string", short: "s" },
      attempt: { type: "string", short: "a" },
      error: { type: "string", short: "e" },
      category: { type: "string", short: "c" },
      diagnosis: { type: "string", short: "d" },
      learning: { type: "string", short: "l" },
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length < 2 || !values.status) {
    console.error(`Usage: bun scripts/log_iteration.ts <session-file> <iteration> --status pass|fail [options]

Arguments:
  session-file  Path to the session file
  iteration     Iteration number (1, 2, 3, ...)

Required:
  --status, -s  pass or fail

Optional:
  --attempt, -a   Description of what was attempted
  --error, -e     Error message (for failures)
  --category, -c  Error category: syntax|logic|resource|timeout|unknown
  --diagnosis, -d Analysis of what went wrong
  --learning, -l  What was learned
  --help, -h      Show this help message

Example:
  bun scripts/log_iteration.ts .session-123.md 1 --status fail --error "Missing semicolon" --category syntax
`);
    process.exit(values.help ? 0 : 1);
  }

  const sessionFile = positionals[0];
  const iteration = parseInt(positionals[1], 10);

  if (!existsSync(sessionFile)) {
    console.error(`Error: Session file not found: ${sessionFile}`);
    process.exit(1);
  }

  if (values.status !== "pass" && values.status !== "fail") {
    console.error("Error: --status must be 'pass' or 'fail'");
    process.exit(1);
  }

  const log: IterationLog = {
    iteration,
    status: values.status as "pass" | "fail",
    attempt: values.attempt,
    error: values.error,
    category: values.category,
    diagnosis: values.diagnosis,
    learning: values.learning,
  };

  // Read current content
  let content = readFileSync(sessionFile, "utf-8");

  // Find insertion point (before "---\n\n## Summary")
  const summaryMarker = "---\n\n## Summary";
  const insertionPoint = content.lastIndexOf(summaryMarker);

  if (insertionPoint === -1) {
    console.error("Error: Could not find Summary section in session file");
    process.exit(1);
  }

  // Insert iteration log
  const iterationContent = formatIteration(log);
  content =
    content.slice(0, insertionPoint) +
    iterationContent +
    "\n" +
    content.slice(insertionPoint);

  // Update summary
  content = updateSummary(content, iteration, log.status);

  // Write back
  writeFileSync(sessionFile, content, "utf-8");

  console.log(
    JSON.stringify(
      {
        success: true,
        sessionFile,
        iteration,
        status: log.status,
      },
      null,
      2
    )
  );
}

main();
