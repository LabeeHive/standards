#!/usr/bin/env bun
/**
 * Preflight check for Gemini image generation.
 * Fails fast if prerequisites are missing, avoiding slow Gemini CLI startup.
 *
 * Usage:
 *   bun scripts/preflight.ts
 *
 * Checks:
 *   1. gemini CLI installed
 *   2. nanobanana extension installed
 *   3. Authentication configured (API key or OAuth)
 *
 * Exit codes:
 *   0 - All checks passed
 *   1 - One or more checks failed
 */

import { existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

function main() {
  const errors: string[] = [];

  // 1. Check gemini CLI
  const geminiPath = Bun.spawnSync(["which", "gemini"]);
  if (geminiPath.exitCode !== 0) {
    errors.push(
      "gemini CLI not found. Install: npm install -g @google/gemini-cli"
    );
  }

  // 2. Check nanobanana extension
  const extensionDir = join(homedir(), ".gemini", "extensions", "nanobanana");
  if (!existsSync(extensionDir)) {
    errors.push(
      "nanobanana extension not found. Install: gemini extensions install https://github.com/gemini-cli-extensions/nanobanana"
    );
  }

  // 3. Check authentication (any one method is sufficient)
  const apiKeyVars = [
    "NANOBANANA_GEMINI_API_KEY",
    "NANOBANANA_GOOGLE_API_KEY",
    "GEMINI_API_KEY",
    "GOOGLE_API_KEY",
  ];
  const hasApiKey = apiKeyVars.some((v) => {
    const val = process.env[v];
    return val !== undefined && val.trim() !== "";
  });
  const oauthPath = join(homedir(), ".gemini", "oauth_creds.json");
  const hasOAuth = existsSync(oauthPath);

  if (!hasApiKey && !hasOAuth) {
    errors.push(
      `No authentication found. Set one of: ${apiKeyVars.join(", ")}, or run 'gemini' to login with Google OAuth`
    );
  }

  // Report
  if (errors.length > 0) {
    console.error("Preflight failed:");
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log("Preflight OK");
}

main();
