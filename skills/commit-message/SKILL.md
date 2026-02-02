---
name: commit-message
description: Generate commit messages following conventional commits. Use this when preparing to commit staged changes. Triggers on "コミットメッセージ", "commit message", "what should I commit", "変更をコミット".
model: haiku
context: fork
agent: general-purpose
allowed-tools: Bash(git:*)
---

# Commit Message Skill

Generate a commit message based on staged changes. Do not commit directly, just generate the message.

## Format

```
<type>: <subject>
```

## Types

| Type | Use When |
|------|----------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `refactor` | Code refactoring (no feature or bug fix) |
| `ci` | CI/CD related changes |
| `test` | Test code additions or modifications |
| `chore` | Other changes (build process, tools, etc.) |

## Subject Rules

- Maximum 50 characters
- Use imperative mood ("add" not "added" or "adds")
- No period at the end
- English only

## Process

1. Run `git diff --cached --stat` to see staged files
2. Run `git diff --cached` to see actual changes
3. Analyze the changes
4. Generate appropriate commit message

## Examples

- `feat: add user authentication`
- `fix: resolve null pointer in login flow`
- `docs: update API documentation`
- `refactor: extract validation logic to separate module`
- `chore: update dependencies`
