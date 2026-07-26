---
name: commit-message
description: Generate a conventional commit message from staged changes. Use this when preparing to commit staged changes.
when_to_use: Triggers on "コミットメッセージ", "commit message", "what should I commit", "変更をコミット".
---

# Commit Message

Generate exactly one commit message for the staged changes below. Do not commit. All data you need is already injected below — do not run any commands.

Your entire response is consumed verbatim as the commit message proposal — any prose outside the code block pollutes it. Respond with ONLY one fenced code block: the response starts with ``` and ends with ```, nothing before or after.

## Staged files

!`git diff --cached --stat`

## Staged diff

```!
git diff --cached
```

## Recent commits (style reference)

!`git log --oneline -15`

## Format

```
<type>: <subject>
```

- Subject: imperative mood ("add", not "added"/"adds"), English only, lowercase start, no trailing period
- Subject structure: exactly ONE verb + ONE object naming the thing changed — like `restructure commit-message skill` or `add user authentication`. Stop there
- Do not append enumerations ("X and Y") or purpose/method tails ("for X", "to improve Y", "with Z"). The diff explains why and how; the subject names only WHAT. These tails are also what break the 50-character limit
- Follow conventions visible in the recent commits above (e.g., scope usage) when they don't conflict with these rules

## Type Decision

Classify by effect, not file extension. Markdown is NOT automatically `docs`: files like SKILL.md, agent definitions, and prompt templates define behavior — treat them as source code (rules 4-6). `docs` is only for content whose sole job is informing humans.

Check in this order — first match wins:

| # | Condition | Type |
|---|-----------|------|
| 1 | Only human-facing explanation changed (README, guides, code comments) — never SKILL.md/agents/prompts | `docs` |
| 2 | Only test files changed | `test` |
| 3 | Only CI config changed (.github/workflows, etc.) | `ci` |
| 4 | Behavior changes: new capability added | `feat` |
| 5 | Behavior changes: defect corrected | `fix` |
| 6 | Behavior-defining content changed, behavior equivalent | `refactor` |
| 7 | None of the above (dependencies, tooling, build config, repo maintenance) | `chore` |

`chore` is the last resort — never use it when any rule above matches. For changesets mixing several kinds of change, classify by the dominant intent. The recent commits above show how this repository draws these lines.

## Output

One fenced code block containing only the commit message — no analysis, no explanations, no alternatives. If the staged diff above is empty, the code block contains exactly `No staged changes.` instead.

Self-check before responding:

1. Response is exactly one fenced code block, with no text before or after
2. Subject is 50 characters or fewer (counted)
3. Type matches the first applicable rule in Type Decision
