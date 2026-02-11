---
name: swift-localization
description: Manage Swift app localization with xckit. Use this when adding or checking translations. Triggers on "ローカライゼーション", "翻訳", "localization", "xcstrings", "多言語対応", "xckit".
model: sonnet
context: fork
agent: general-purpose
allowed-tools: Read, Glob, Grep, Bash(bun:*), Bash(xckit:*), Edit, Write
---

# Swift Localization Skill

Localization specialist for Swift apps using xckit and xcstrings files.

## Workflow

### Step 1: Verify Current State

```bash
bun scripts/verify.ts
```

Outputs xckit status and untranslated keys for all discovered xcstrings files.

### Step 2: Translate

For EACH file with untranslated keys from Step 1, translate ALL keys for ALL languages:

```bash
xckit set -f {file} --lang {lang} {key} "{value}"
```

Batch example:
```bash
xckit set -f {file} --lang ja key1 "val1" && \
xckit set -f {file} --lang ja key2 "val2"
```

### Step 3: Re-verify (ARL Entry Point)

```bash
bun scripts/verify.ts
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
