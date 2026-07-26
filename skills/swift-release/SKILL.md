---
name: swift-release
description: Execute a Labee app's App Store release notes handoff — generates What's New text for every configured locale from the commit diff between two versions and stages it into App Store Connect's editable version via the Portus MCP server. App-specific values (ASC app id, locale title lines, product context) come from the repo's .claude/release-config.md.
allowed-tools: Read Glob Bash(git:*) Task mcp__portus__portus_list_apps mcp__portus__portus_get_metadata mcp__portus__portus_set_metadata mcp__portus__portus_get_diff mcp__portus__portus_push
argument-hint: "<current_version> <previous_version>"
disable-model-invocation: true
---

# Swift Release

## Overview

This skill's only job is to generate release notes and stage them into App Store Connect via
Portus. Versioning (`MARKETING_VERSION`), tagging, pushing, and the Xcode Cloud
build/distribute pipeline are handled entirely by the user — never touch `project.pbxproj`,
never create or push a git tag. Portus writes metadata as a **draft** — actually sending it
to ASC still requires the user to approve the confirmation dialog Portus opens, so this
skill never sends unattended.

No local files are created at any point in this workflow — release notes text is generated
in-memory and passed directly to Portus.

## Workflow

### 0. Load the repo's release config (required)

Read `.claude/release-config.md` at the repo root. It defines everything app-specific:

- **ASC app id** and bundle id (never guess an id — if Portus rejects the configured id,
  re-resolve with `portus_list_apps` and tell the user to update the config)
- **Tag convention** (whether version tags carry a `v` prefix)
- **Locales and title lines** — the table of locale → `whatsNew` title line. This is the
  authoritative locale set for the app; generate exactly these locales, no more, no fewer.
- **Product context** — the app description used to brief the release notes generator.

If the file is missing, stop and tell the user to create it (point them at another Labee
repo's `.claude/release-config.md` as a template). Do not fall back to guessing.

### 1. Parse arguments

`$ARGUMENTS` is `<current_version> <previous_version>` (e.g., `2026.07.2 2026.07.1`). Both
required. Use `$ARGUMENTS[0]` as current, `$ARGUMENTS[1]` as previous — never guess the pair
from HEAD, branch name, `MARKETING_VERSION`, or the latest tag.

### 2. Verify tags and commits (auto-injected)

Apply the tag convention from the release config (Labee repos use bare `2026.07.1`-style
tags with no `v` prefix unless the config says otherwise).

```!
git tag -l "$ARGUMENTS[1]" && git tag -l "$ARGUMENTS[0]"
git log $ARGUMENTS[1]..HEAD --pretty=format:'- %s' --no-merges
```

Treat the commit list as authoritative — don't re-run `git log` in step 3. Sanity-check the
result before continuing:

- If `$ARGUMENTS[1]` doesn't exist as a tag, stop and ask the user instead of guessing.
- If the commit list comes back empty or contradictory, stop and ask the user.
- The existence (or absence) of a tag for `$ARGUMENTS[0]` is expected and not itself a
  problem — the user tags and pushes independently of this skill, possibly before or after
  running it. Don't treat it as an error condition either way.

### 3. Generate release notes

Read `references/release-notes-generator.md` for the generation guidelines, then spawn a
Task (general-purpose) whose prompt contains:

- Those guidelines verbatim
- The **product context** section from the release config
- `$ARGUMENTS[0]` / `$ARGUMENTS[1]` and the commit list from step 2
- The locale list from the release config's title-line table

The agent returns the generated text for every configured locale directly in its response —
it must not write any files, and must not re-run `git log`. Focus only on user-facing
features — the guidelines already exclude
`refactor:`/`chore:`/`ci:`/`docs:`/`test:`/`build:`/`i18n:` commits.

**Show the generated text to the user and ask them to review it before continuing.**

### 4. Verify every configured locale is present

Check the agent's response covers every locale in the config's title-line table. Report any
missing locale before continuing — go back to the agent to fill the gap rather than
inventing text yourself.

Each locale's text must start with its configured title line (with `{v}` replaced by
`$ARGUMENTS[0]`), a blank line, then the bullets — this is what gets pasted verbatim into
ASC's `whatsNew` field in step 5. If a locale is missing its title line, fix it before
step 5 — the title-line convention is per-app ASC history recorded in the config, so the
config is authoritative, not this skill.

### 5. Stage release notes in App Store Connect via Portus

1. Call `mcp__portus__portus_set_metadata` once with the configured `app_id` and `locales`
   mapping each locale code to `{"whatsNew": "<generated text>"}` — pass the text verbatim
   (title line + blank line + bullets), don't reformat it.
2. Call `mcp__portus__portus_get_diff` with the same `app_id` and show the user what will
   be pushed (every `whatsNew` entry changing from the previous version's notes to the new
   ones).
3. Call `mcp__portus__portus_push` with the same `app_id` (pass `issuer_id` from the config
   if Portus asks for one). This only opens Portus's push confirmation dialog — it does
   **not** push by itself. Tell the user to switch to Portus and approve the dialog to
   actually send the changes to ASC.

If `portus_set_metadata` returns any `warnings`, surface them to the user — a warning
usually means a locale Apple doesn't recognize, which needs manual attention.

Description, keywords, and support URL are not covered by this skill — remind the user to
check those manually in ASC (via Portus or the web UI) if anything changed this release.

### 6. Report completion status

Summarize for the user:

- The version pair processed (`$ARGUMENTS[0]` / `$ARGUMENTS[1]`).
- How many locales were written to Portus and whether any had warnings.
- That the metadata is staged as a **draft** in App Store Connect — nothing is live yet.
- The next action is on the user: open Portus and approve the push confirmation dialog to
  actually send the `whatsNew` text to ASC.

## Reference Files

| File | Load When |
|------|-----------|
| `references/release-notes-generator.md` | Step 3, to brief the generation Task |
