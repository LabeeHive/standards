---
name: swift-release
description: Execute Swift app release workflow with fastlane. Use this when releasing apps to App Store. Triggers on "リリース", "release", "App Store", "fastlane", "リリースノート生成".
model: sonnet
context: fork
agent: general-purpose
disable-model-invocation: true
allowed-tools: Read Glob Grep Write Bash(git:*) Bash(mise:*) Bash(bundle:*) Bash(fastlane:*) Bash(ls:*) Task
paths: "**/*.swift"
argument-hint: "[current-version previous-version]"
---

# Swift Release Skill

You are a release workflow specialist for Swift/macOS/iOS apps. Execute the complete release process based on the patterns established in Vigilare and Chimr.

## When Invoked

### Step 1: Parse Versions

Extract current and previous versions from user input:
```
Input: "2025.08.5 2025.08.4"
Current: 2025.08.5
Previous: 2025.08.4
```

### Step 2: Get Git Commits

```bash
# Try with v prefix first
git log v{previous}..v{current} --pretty=format:'- %s' --no-merges

# Fallback without v prefix
git log {previous}..{current} --pretty=format:'- %s' --no-merges
```

### Step 3: Generate Release Notes

Read `references/release-notes-generator.md` for detailed guidelines, then use Task tool to generate release notes:
- Focus ONLY on user-facing features (ignore refactor, chore, ci, docs, test)
- Create 14 language files in `fastlane/metadata/{lang}/release_notes.txt` format

**Supported Languages (14):**
en, de, es, fr, hi, id, it, ja, ko, pt-BR, ru, vi, zh-Hans, zh-Hant

**Ask the user to review the content of the release notes and proceed if they give permission.**

### Step 4: Verify Release Note Files

Check all 14 release note files exist:
```bash
ls fastlane/metadata/*/release_notes.txt
```

Expected files:
- fastlane/metadata/en/release_notes.txt
- fastlane/metadata/de/release_notes.txt
- fastlane/metadata/es/release_notes.txt
- fastlane/metadata/fr/release_notes.txt
- fastlane/metadata/hi/release_notes.txt
- fastlane/metadata/id/release_notes.txt
- fastlane/metadata/it/release_notes.txt
- fastlane/metadata/ja/release_notes.txt
- fastlane/metadata/ko/release_notes.txt
- fastlane/metadata/pt-BR/release_notes.txt
- fastlane/metadata/ru/release_notes.txt
- fastlane/metadata/vi/release_notes.txt
- fastlane/metadata/zh-Hans/release_notes.txt
- fastlane/metadata/zh-Hant/release_notes.txt

### Step 5: Execute Fastlane

```bash
# macOS app (Vigilare pattern)
fastlane mac release current:{current} previous:{previous}

# iOS app (Chimr pattern)
mise exec -- bundle exec fastlane ios release current:{current} previous:{previous}
```

This will: build app, upload to App Store Connect, update metadata

### Step 6: Report Completion

- List all generated release note files
- Report fastlane execution status

## Guidelines

- Focus on user-facing changes, not technical details
- Use native tone for each language (not literal translations)
- Lead with the most impactful changes
- Avoid technical jargon

## Reference Files

| File | Use When |
|------|----------|
| references/release-notes-generator.md | Generating release notes for App Store |
