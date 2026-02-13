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

    // Validate key naming convention (hierarchical dot-notation)
    // Valid: settings.general.title, reminder.detail.notes
    // Invalid: natural language ("Are you sure?"), flat (SettingsTitle),
    //          snake_case (settings_title), UpperCamelCase segments (Settings.Title)
    const content = await Bun.file(file).json();
    const keys = Object.keys(content.strings || {});
    // Skip Xcode auto-generated keys:
    // - Empty string (source language marker)
    // - Pure format specifier keys: %lld, (%lld), %@, etc.
    // For keys containing format specifiers (list.create %@),
    // strip the specifier and validate the remaining dot-notation.
    const isPureFormatSpecifier = (key: string) => /^[()]*%/.test(key);
    const stripFormatSpecifiers = (key: string) =>
      key.replace(/\s*%[@dllfsc]+/g, "").trim();

    const invalidKeys = keys.filter((key) => {
      if (key === "") return false;
      if (isPureFormatSpecifier(key)) return false;
      const normalized = stripFormatSpecifiers(key);
      if (normalized.includes(" ")) return true;
      if (!normalized.includes(".")) return true;
      const segments = normalized.split(".");
      return segments.some(
        (s) =>
          s.length === 0 ||
          /[A-Z]/.test(s[0]) ||
          s.includes("_") ||
          s.includes("-"),
      );
    });

    if (invalidKeys.length > 0) {
      console.log(`Key naming violations (expected: screen.section.element):`);
      for (const key of invalidKeys) {
        console.log(`  - "${key}"`);
      }
      console.log();
    }
  }
}

main();
