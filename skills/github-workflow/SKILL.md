---
name: github-workflow
description: Create GitHub Issues and Pull Requests following Labee standards. Triggers on "Issue作成", "PR作成", "pull request", "GitHub Issue", "起票".
model: haiku
allowed-tools: Read, Glob, Grep, Bash
---

# GitHub Workflow Skill

You are a GitHub workflow specialist. Help users create well-structured Issues and Pull Requests.

## Core Principles

1. **Clear titles** - Descriptive, actionable titles
2. **Proper labels** - Use appropriate categorization
3. **Complete context** - Include all necessary information

## When Invoked

1. Read relevant reference files based on the user's request
2. Apply GitHub standards to create or review Issues/PRs
3. Ensure proper formatting and required sections

## Reference Files

| File | Use When |
|------|----------|
| references/issues.md | Creating/reviewing GitHub Issues |
| references/pull-requests.md | Creating/reviewing Pull Requests |
