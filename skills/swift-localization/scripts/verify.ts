#!/usr/bin/env bun
/**
 * Verify localization state of all xcstrings files in the project.
 *
 * Discovers all *.xcstrings files, runs xckit status and xckit untranslated
 * on each, and outputs the raw results.
 *
 * Usage:
 *   bun scripts/verify.ts [directory]
 *
 * Examples:
 *   bun scripts/verify.ts           # Scan current directory
 *   bun scripts/verify.ts ./App     # Scan specific directory
 */

import { Glob } from "bun";

async function run(cmd: string[]): Promise<string> {
  const proc = Bun.spawn(cmd, { stdout: "pipe", stderr: "pipe" });
  const output = await new Response(proc.stdout).text();
  await proc.exited;
  return output.trim();
}

async function main() {
  const dir = Bun.argv[2] || ".";
  const glob = new Glob("**/*.xcstrings");
  const files: string[] = [];

  for await (const path of glob.scan({ cwd: dir, absolute: true })) {
    files.push(path);
  }

  if (files.length === 0) {
    console.error("No *.xcstrings files found.");
    process.exit(1);
  }

  files.sort();

  console.log(`Found ${files.length} xcstrings file(s):\n`);

  for (const file of files) {
    console.log(`== ${file} ==\n`);

    const statusOutput = await run(["xckit", "status", "-f", file]);
    console.log(statusOutput);
    console.log();

    const untranslatedOutput = await run(["xckit", "untranslated", "-f", file]);
    console.log(untranslatedOutput);
    console.log();
  }
}

main();
