---
name: swift-localization
description: Manage Swift app localization with xckit. Use this when adding or checking translations.
when_to_use: Triggers on "localization", "xcstrings", "xckit", "ローカライゼーション", "翻訳", "多言語対応".
model: opus
effort: max
context: fork
agent: general-purpose
allowed-tools: Read Glob Grep Bash(bun:*) Bash(xckit:*)
disallowed-tools: Edit Write NotebookEdit Bash(python:*) Bash(python3:*) Bash(ruby:*) Bash(perl:*) Bash(node:*) Bash(jq:*) Bash(sed:*) Bash(awk:*)
---

# Swift Localization Skill

Localization specialist for Swift apps using xckit and xcstrings files.

## Core Principles

1. **verify.ts execution is mandatory** - You MUST run `bun ${CLAUDE_SKILL_DIR}/scripts/verify.ts` at Step 1 and Step 3. Skipping verification is never acceptable.
2. **xckit is the ONLY write path** - Never edit .xcstrings files directly and never write ad-hoc scripts (python, bun one-liners, jq, etc.) to read or modify them. All writes go through `xckit set`; the only script you may run is the bundled verify.ts.
3. **Fail loudly, don't work around** - If xckit or verify.ts fails, report the error to the user and stop. Do not improvise an alternative tool.
4. **Localize, don't translate** - Each translation must read as if a native speaker wrote the UI from scratch
5. **Phase tracking** - Use TaskCreate at start, TaskUpdate to mark progress

## Phase Tracking

**At workflow start, create tasks for each step:**

```
TaskCreate: "Step 1: Verify Current State  | MUST run: bun ${CLAUDE_SKILL_DIR}/scripts/verify.ts"
TaskCreate: "Step 2: Translate             | xckit set for each language"
TaskCreate: "Step 3: Re-verify             | MUST run: bun ${CLAUDE_SKILL_DIR}/scripts/verify.ts"
TaskCreate: "Step 4: Report                | Output results"
```

Update status as you progress: `in_progress` when starting, `completed` when done.

## Workflow

### Step 1: Verify Current State

**MUST run:**

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/verify.ts
```

Outputs xckit status, untranslated keys, and key naming violations for all discovered xcstrings files.

### Step 2: Translate

**Localize, don't translate.** Each translation must read as if a native speaker wrote the UI from scratch. See `references/_translation-quality.md` for per-language guidelines.

**Before writing any translation, consider:**

1. **String type** — Is this a button, tab label, description, or error? Each has different rules.
2. **Register** — Match the app's consumer tone per locale (casual for most consumer apps).
3. **Length** — UI labels should be 1-3 words. Don't expand short English into long translated sentences.
4. **Cultural fit** — Use locally natural phrasing, not source-language word order.

**Good/Bad examples:**

Button label "Delete":
- **Bad** (ko): "작업을 삭제하시겠습니까?" (verbose, overly formal)
- **Good** (ko): "삭제할까요?" (casual, native)
- **Bad** (de): "Möchten Sie diese Aufgabe wirklich löschen?" (Sie form, verbose)
- **Good** (de): "Aufgabe löschen?" (concise, du-implied)

Tab label "Settings":
- **Bad** (zh-Hans): "管理您的设置" (verbose, formal)
- **Good** (zh-Hans): "设置" (native, scannable)
- **Bad** (ja): "設定を管理する" (verb form, translated feel)
- **Good** (ja): "設定" (noun form, native)

**Then set translations with xckit:**

```bash
xckit set -f {file} --lang {lang} {key} "{value}"
```

Batch example:
```bash
xckit set -f {file} --lang ja key1 "val1" && \
xckit set -f {file} --lang ja key2 "val2"
```

### Step 3: Re-verify (ARL Entry Point)

**MUST run:**

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/verify.ts
```

- **All languages 100%** → Go to Step 4 (Report)
- **Any language < 100%** → Translate remaining keys, then re-verify

**Exit conditions:**
- Max iterations: 3
- Same keys fail 2 consecutive times

### Step 4: Report

**On success (all 100%):**
> All translations complete.
> - {file}: {N} languages at 100%

**On failure (max iterations or stuck):**
> Translation incomplete.
> - {file}: {key}: {reason}
> Suggested action: {action}

## Key Naming Convention

Use hierarchical dot-notation:
```
settings.general.title
reminder.detail.notes
error.network.message
```

## Swift Usage

```swift
// Good
Text(String(localized: "welcome.title", defaultValue: "Welcome"))

// Bad
Text("Welcome")
```

## Error Reference

| Error | Cause | Fix |
|-------|-------|-----|
| `xckit not found` | CLI not installed | Inform user xckit CLI is required |
| `File not found` | Wrong path or legacy .strings | Check path; suggest creating xcstrings in Xcode |
| `Key not found` | Key doesn't exist in source | Run `xckit untranslated` to get valid keys |
| `Invalid value` | Malformed translation string | Check for unescaped quotes or special chars |
| `Set failed` | Permission or file lock | Check file permissions; close Xcode if open |
| `Same key fails 2x` | Persistent issue | Report to user with key and last error |

## Reference Files

| File | Load When |
|------|-----------|
| references/_translation-quality.md | Auto-loaded: per-language UI translation guidelines and anti-patterns |
