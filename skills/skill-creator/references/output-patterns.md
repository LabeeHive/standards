# Output Patterns

Patterns for consistent skill output.

## Core Principle

> **Claude is already very smart.** Don't explain what Claude already knows.

**Good:** Specific patterns, edge cases, project-specific conventions
**Bad:** "A function is a reusable block of code", "Git is a version control system"

## Description Format

**Required structure:** WHAT + WHEN + Triggers

```yaml
description: [What it does]. [When to use]. Triggers on "english", "日本語".
```

**Good:**
```yaml
description: Create GitHub Issues and PRs following standards. Use this when filing issues or opening PRs. Triggers on "Issue作成", "PR作成", "pull request", "起票".
```

**Bad:**
```yaml
description: GitHub workflow helper.
```

## allowed-tools Patterns

Use specific patterns, not generic tool names:

| Pattern | Use For |
|---------|---------|
| `Bash(git:*)` | Git operations |
| `Bash(gh:*)` | GitHub CLI |
| `Bash(npm:*)` | Node.js package management |
| `Bash(xckit:*)` | Xcode localization |
| `Bash(fastlane:*)` | iOS/macOS deployment |
| `mcp__app__tool_name` | Specific MCP tools |

**Good:**
```yaml
allowed-tools: Read, Glob, Grep, Bash(git:*), Bash(gh:*)
```

**Bad:**
```yaml
allowed-tools: Read, Glob, Grep, Bash
```

## Template Pattern

For strict output requirements:

```markdown
## Output Format

ALWAYS use this structure:

# [Title]

## Summary
[1-2 sentences]

## Details
- Point 1
- Point 2
```

For flexible guidance:

```markdown
## Output Format

Recommended structure (adapt as needed):

# [Title]

## Summary
[Overview]

## Details
[Adjust based on content]
```

## Examples Pattern

Show input/output pairs for quality calibration:

```markdown
## Examples

**Example 1: Simple case**
Input: Added login button
Output: `feat: add login button to header`

**Example 2: Bug fix**
Input: Fixed crash on startup
Output: `fix: resolve null pointer on app launch`
```

## Model Selection

**Numeric Decision Criteria:**

| Model | Steps | File Writes | External Services | MCP Tools |
|-------|:-----:|:-----------:|:-----------------:|:---------:|
| haiku | 1-2 | 0 | 0 | No |
| sonnet | 1-3 | 1-5 | 0-2 | No |
| opus | 4+ | Any | 3+ | Yes |

**Decision Tree:**
```
Does skill use MCP tools? → Yes → opus
Does skill call 3+ external services? → Yes → opus
Does skill have 4+ workflow steps? → Yes → opus
Does skill write files? → Yes → sonnet
Otherwise → haiku
```

**Examples:**

| Skill | Steps | Writes | Services | MCP | → Model |
|-------|:-----:|:------:|:--------:|:---:|:-------:|
| documentation | 2 | 0 | 0 | No | haiku |
| swift-development | 3 | 3 | 0 | No | sonnet |
| repository-setup | 4 | 5 | 1 | No | sonnet |
| vigilare-task | 5 | 2 | 0 | Yes | opus |
| skill-creator | 5 | 4 | 0 | No | opus |

## Skill Type Matrix

| Type | context: fork | agent | allowed-tools |
|------|:-------------:|-------|---------------|
| Guidance | No | - | Read, Glob, Grep |
| Code Gen | Yes | general-purpose | + Edit, Write, Bash(specific:*) |
| Workflow | Yes | general-purpose | + MCP tools, Task |
