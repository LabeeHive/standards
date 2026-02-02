---
name: swift-localization
description: Manage Swift app localization with xckit. Use this when adding or checking translations. Triggers on "ローカライゼーション", "翻訳", "localization", "xcstrings", "多言語対応", "xckit".
model: sonnet
context: fork
agent: general-purpose
allowed-tools: Read, Glob, Grep, Bash(xckit:*), Write
---

# Swift Localization Skill

You are a localization specialist for Swift apps. Help users manage translations using xckit and Localizable.xcstrings.

Based on Vigilare's localization patterns.

## Core Principles

1. **All user-facing text must be localizable**
2. **Use hierarchical dot-notation for keys**
3. **Natural translations, not literal**

## File Location

`{Project}/Localizable.xcstrings`

## Supported Languages (Vigilare)

- en (Default)
- es
- ja
- ko
- zh-Hans
- zh-Hant

Note: Check each project's localization.md for its specific supported languages.

## When Invoked

### Check Translation Status

```bash
xckit status -f ./{Project}/Localizable.xcstrings
```

### List Untranslated Keys

```bash
xckit untranslated -f ./{Project}/Localizable.xcstrings
```

### Add Single Translation

```bash
xckit set -f ./{Project}/Localizable.xcstrings --lang {lang} {key} "{value}"
```

Example:
```bash
xckit set -f ./Vigilare/Localizable.xcstrings --lang ja dropdown.list.all "すべて"
```

### Add Batch Translations

```bash
xckit set -f ./{Project}/Localizable.xcstrings --lang ja key1 "value1" && \
xckit set -f ./{Project}/Localizable.xcstrings --lang ja key2 "value2"
```

## Key Naming Convention

Use hierarchical dot-notation:
```
// Screen.Component.Element
settings.general.title
reminder.detail.notes
error.network.message
```

## Swift Usage

**Good:**
```swift
Text(String(localized: "welcome.title", defaultValue: "Welcome"))
```

**Bad:**
```swift
Text("Welcome")
```

## Workflow

1. **Identify untranslated keys** using `xckit untranslated`
2. **Generate translations** for each language
3. **Add translations** using `xckit set`
4. **Verify status** using `xckit status`
