#!/usr/bin/env bun
/**
 * Finalize a session learning file with summary and learnings.
 *
 * Usage:
 *   bun scripts/finalize_session.ts <session-file> --status success|failed [options]
 *
 * Examples:
 *   bun scripts/finalize_session.ts .session-123.md --status success --learning "Use early return"
 *   bun scripts/finalize_session.ts .session-123.md --status failed --recommendation "Check API docs"
 *
 * Options:
 *   --status         Required: success or failed
 *   --learning       Key learning to add (can be used multiple times)
 *   --recommendation Recommendation for future sessions
 *   --elapsed        Time elapsed (e.g., "45s", "2m30s")
 */

import { parseArgs } from "util";
import { readFileSync, writeFileSync, existsSync } from "fs";

function main() {
  const { positionals, values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      status: { type: "string", short: "s" },
      learning: { type: "string", multiple: true, short: "l" },
      recommendation: { type: "string", multiple: true, short: "r" },
      elapsed: { type: "string", short: "e" },
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length < 1 || !values.status) {
    console.error(`Usage: bun scripts/finalize_session.ts <session-file> --status success|failed [options]

Arguments:
  session-file  Path to the session file

Required:
  --status, -s         success or failed

Optional:
  --learning, -l       Key learning (can repeat: -l "one" -l "two")
  --recommendation, -r Recommendation for future (can repeat)
  --elapsed, -e        Time elapsed (e.g., "45s", "2m30s")
  --help, -h           Show this help message

Example:
  bun scripts/finalize_session.ts .session-123.md --status success -l "Early return works" -e "30s"
`);
    process.exit(values.help ? 0 : 1);
  }

  const sessionFile = positionals[0];

  if (!existsSync(sessionFile)) {
    console.error(`Error: Session file not found: ${sessionFile}`);
    process.exit(1);
  }

  if (values.status !== "success" && values.status !== "failed") {
    console.error("Error: --status must be 'success' or 'failed'");
    process.exit(1);
  }

  let content = readFileSync(sessionFile, "utf-8");

  // Update final status
  const statusDisplay = values.status.toUpperCase();
  content = content.replace(
    /\| Final status \| [A-Z_]+ \|/,
    `| Final status | ${statusDisplay} |`
  );
  content = content.replace(
    /\*\*Status:\*\* [A-Z_]+/,
    `**Status:** ${statusDisplay}`
  );

  // Update elapsed time if provided
  if (values.elapsed) {
    content = content.replace(
      /\| Time elapsed \| [^\|]+ \|/,
      `| Time elapsed | ${values.elapsed} |`
    );
  }

  // Add learnings
  if (values.learning && values.learning.length > 0) {
    const learningsMarker = "### Key Learnings";
    const learningsIndex = content.indexOf(learningsMarker);
    if (learningsIndex !== -1) {
      const insertAfter = content.indexOf("\n", learningsIndex) + 1;
      const learningsText = values.learning
        .map((l, i) => `${i + 1}. ${l}`)
        .join("\n");
      content =
        content.slice(0, insertAfter) +
        "\n" +
        learningsText +
        "\n" +
        content.slice(insertAfter);
    }
  }

  // Add recommendations
  if (values.recommendation && values.recommendation.length > 0) {
    const recsMarker = "### Recommendations";
    const recsIndex = content.indexOf(recsMarker);
    if (recsIndex !== -1) {
      const insertAfter = content.indexOf("\n", recsIndex) + 1;
      const recsText = values.recommendation.map((r) => `- ${r}`).join("\n");
      content =
        content.slice(0, insertAfter) +
        "\n" +
        recsText +
        "\n" +
        content.slice(insertAfter);
    }
  }

  // Remove HTML comments (cleanup for final version)
  content = content.replace(/<!--[\s\S]*?-->\n?/g, "");

  writeFileSync(sessionFile, content, "utf-8");

  console.log(
    JSON.stringify(
      {
        success: true,
        sessionFile,
        finalStatus: values.status,
        learningsAdded: values.learning?.length || 0,
        recommendationsAdded: values.recommendation?.length || 0,
      },
      null,
      2
    )
  );
}

main();
