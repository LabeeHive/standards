# Output Patterns

Patterns for consistent skill output.

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

| Model | Use When | Example Skills |
|-------|----------|----------------|
| haiku | Read-only guidance | documentation, automation-config |
| sonnet | Code generation, file creation | swift-development, repository-setup |
| opus | Complex multi-step workflows | vigilare-task, skill-creator |

## Skill Type Matrix

| Type | context: fork | agent | allowed-tools |
|------|:-------------:|-------|---------------|
| Guidance | No | - | Read, Glob, Grep |
| Code Gen | Yes | general-purpose | + Edit, Write, Bash(specific:*) |
| Workflow | Yes | general-purpose | + MCP tools, Task |
