#!/usr/bin/env bun
/**
 * Capture macOS screen using screencapture and optimize for AI consumption.
 *
 * Usage:
 *   bun scripts/capture.ts [mode]
 *
 * Modes:
 *   (none)              Full screen capture (silent)
 *   select / 選択       Interactive region selection
 *   window / ウィンドウ  Click to select window
 *
 * Output:
 *   Prints the saved file path to stdout.
 *
 * Exit codes:
 *   0 - Success
 *   1 - Failure
 */

import { parseArgs } from "util";
import { dlopen, FFIType } from "bun:ffi";
import { $ } from "bun";

const MAX_LONG_EDGE = 2000;

function checkScreenRecordingPermission(): boolean {
  const cg = dlopen(
    "/System/Library/Frameworks/CoreGraphics.framework/CoreGraphics",
    {
      CGPreflightScreenCaptureAccess: { args: [], returns: FFIType.bool },
    },
  );
  return cg.symbols.CGPreflightScreenCaptureAccess();
}

function printHelp() {
  console.log(`Capture macOS screen and optimize for AI consumption.

Usage:
  bun scripts/capture.ts [mode]

Modes:
  (none)              Full screen capture (silent)
  select / 選択       Interactive region selection
  window / ウィンドウ  Click to select window

Options:
  --help              Show this help message`);
}

function main() {
  const { positionals, values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      help: { type: "boolean", default: false },
    },
    allowPositionals: true,
  });

  if (values.help) {
    printHelp();
    process.exit(0);
  }

  if (!checkScreenRecordingPermission()) {
    console.error(
      "Screen Recording permission is required.\n" +
        "Enable in: System Settings > Privacy & Security > Screen Recording",
    );
    process.exit(1);
  }

  const mode = positionals[0] ?? "";
  const flags = resolveFlags(mode);
  const filePath = `/tmp/screenshot_${Date.now()}.jpg`;

  capture(flags, filePath);
}

function resolveFlags(mode: string): string[] {
  switch (mode) {
    case "select":
    case "選択":
      return ["-i", "-x", "-t", "jpg"];
    case "window":
    case "ウィンドウ":
      return ["-w", "-x", "-t", "jpg"];
    default:
      return ["-x", "-t", "jpg"];
  }
}

async function capture(flags: string[], filePath: string) {
  const result = await $`screencapture ${flags} ${filePath}`.quiet();
  if (result.exitCode !== 0) {
    console.error("screencapture failed");
    process.exit(1);
  }

  const file = Bun.file(filePath);
  if (!(await file.exists())) {
    console.error("Capture cancelled by user");
    process.exit(1);
  }

  await optimize(filePath);
  console.log(filePath);
}

async function optimize(filePath: string) {
  const info = await $`sips -g pixelWidth -g pixelHeight ${filePath}`.quiet();
  if (info.exitCode !== 0) {
    console.error("Failed to read image dimensions");
    process.exit(1);
  }

  const output = info.text();
  const width = parseInt(output.match(/pixelWidth:\s*(\d+)/)?.[1] ?? "0");
  const height = parseInt(output.match(/pixelHeight:\s*(\d+)/)?.[1] ?? "0");
  const longEdge = Math.max(width, height);

  if (longEdge > MAX_LONG_EDGE) {
    const resizeResult =
      width >= height
        ? await $`sips --resampleWidth ${MAX_LONG_EDGE} ${filePath}`.quiet()
        : await $`sips --resampleHeight ${MAX_LONG_EDGE} ${filePath}`.quiet();

    if (resizeResult.exitCode !== 0) {
      console.error("Failed to resize image");
      process.exit(1);
    }
  }
}

main();
