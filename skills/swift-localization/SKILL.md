---
name: swift-localization
description: Manage Swift app localization with xckit. Use this when adding or checking translations. Triggers on "ローカライゼーション", "翻訳", "localization", "xcstrings", "多言語対応", "xckit".
model: sonnet
context: fork
agent: general-purpose
allowed-tools: Read, Glob, Grep, Bash(xckit:*), Edit, Write
---

# Swift Localization Skill

Localization specialist for Swift apps using xckit and Localizable.xcstrings.

## Workflow

### Step 1: Discover Project

```bash
Glob("**/Localizable.xcstrings")
```

### Step 2: Check Status

```bash
xckit status -f ./{Project}/Localizable.xcstrings
```

Note ALL supported languages from output.

### Step 3: Identify Untranslated Keys

```bash
xckit untranslated -f ./{Project}/Localizable.xcstrings
```

### Step 4: Translate

For EACH language, translate ALL untranslated keys:

```bash
xckit set -f ./{Project}/Localizable.xcstrings --lang {lang} {key} "{value}"
```

Batch example:
```bash
xckit set -f ./{Project}/Localizable.xcstrings --lang ja key1 "val1" && \
xckit set -f ./{Project}/Localizable.xcstrings --lang ja key2 "val2"
```

### Step 5: Verify (ARL Entry Point)

```bash
xckit status -f ./{Project}/Localizable.xcstrings
```

- **ALL languages 100%** → Go to Step 7 (Report)
- **Any language < 100%** → Go to Step 6 (Diagnose & Refine)

### Step 6: Diagnose & Refine

1. Run `xckit untranslated` to identify remaining keys
2. Categorize failure (see Error Reference)
3. Apply fix
4. Return to Step 5

**Exit conditions:**
- Max iterations: 3
- Same keys fail 2 consecutive times

### Step 7: Report

**On success:**
> All translations complete. {N} languages at 100%.

**On failure (max iterations or stuck):**
> Translation incomplete. Remaining issues:
> - {key}: {reason}
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
