# Output Patterns

Patterns for consistent skill output.

## Core Principle

> **Claude is already very smart.** Don't explain what Claude already knows.

**Good:** Specific patterns, edge cases, project-specific conventions
**Bad:** "A function is a reusable block of code", "Git is a version control system"

## Description Format

**Required structure:** WHAT + WHEN + Triggers (JP & EN)

```yaml
description: [What it does]. [When to use]. Triggers on "english", "日本語".
```

**Good:**
```yaml
description: Create GitHub Issues and PRs following standards. Use this when filing issues or opening PRs. Triggers on "Issue作成", "PR作成", "pull request", "create issue", "起票".
```

**Bad (missing English triggers):**
```yaml
description: Create tasks in Vigilare. Use this when adding tasks. Triggers on "タスク作成", "起票して".
```

**Bad (missing description):**
```yaml
description: GitHub workflow helper.
```

**Triggers must include BOTH English AND Japanese** for international accessibility.

## allowed-tools Patterns

Use specific patterns, not generic tool names:

| Pattern | Use For |
|---------|---------|
| `Bash(git:*)` | Git operations |
| `Bash(gh:*)` | GitHub CLI |
| `Bash(npm:*)` | Node.js package management |
| `Bash(mkdir:*)` | Directory creation |
| `Bash(xckit:*)` | Xcode localization |
| `Bash(fastlane:*)` | iOS/macOS deployment |
| `Bash(swift:*)` | Swift CLI (build, test, package) |
| `Bash(xcodebuild:*)` | Xcode builds |
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
| haiku | Any | 0 | 0 | No |
| sonnet | Any | 1-5 | 0-2 | Simple queries only |
| opus | 4+ | Any | 3+ | Complex orchestration |

**Decision Tree:**
```
Does skill use MCP tools AND perform complex reasoning/orchestration? → Yes → opus
Does skill call 3+ external services? → Yes → opus
Does skill have 4+ workflow steps AND write files or call external services? → Yes → opus
Does skill write files? → Yes → sonnet
Otherwise → haiku
```

**Exceptions:**
- Guidance-only skills (no Write/Edit in allowed-tools) can use haiku regardless of step count
- Simple MCP query skills (2 or fewer calls + formatting only) can use sonnet

**Examples:**

| Skill | Steps | Writes | Services | MCP | → Model | Reason |
|-------|:-----:|:------:|:--------:|:---:|:-------:|--------|
| automation-config | 4 | 0 | 0 | No | haiku | Guidance-only, no writes |
| documentation | 2 | 0 | 0 | No | haiku | Few steps, no writes |
| today | 2 | 0 | 0 | Yes | sonnet | Simple MCP queries + formatting |
| swift-development | 3 | 3 | 0 | No | sonnet | File writes |
| repository-setup | 5 | 5 | 1 | No | sonnet | Writes but simple services |
| github-workflow | 5 | 0 | 1 | No | sonnet | Analyzes code, writes PR body |
| vigilare-task | 6 | 0 | 0 | Yes | opus | Complex MCP orchestration |
| skill-creator | 7 | 4 | 0 | No | opus | Many steps + writes |

## Skill Type Matrix

| Type | context: fork | agent | allowed-tools |
|------|:-------------:|-------|---------------|
| Guidance | Optional | - | Read, Glob, Grep |
| Code Gen | Yes | general-purpose | + Edit, Write, Bash(specific:*) |
| Workflow | Yes | general-purpose | + MCP tools, Task |

**Note:** `context: fork` isolates the skill's context from the main conversation. Use it even for Guidance skills when you want to avoid polluting the conversation context.

## Invocation Control

```yaml
disable-model-invocation: true  # User must invoke manually with /skill-name
user-invocable: false           # Only Claude can invoke (hidden from / menu)
```

### When to use `disable-model-invocation: true`

| Pattern | Example | Reason |
|---------|---------|--------|
| Setup/Init | repository-setup, docusaurus-setup | One-time setup should be intentional |
| Release/Deploy | swift-release | Side effects, requires user confirmation |
| Config changes | automation-config | Modifies project configuration |
| Complex creation | swift-mcp-server | Large-scale changes, user should control timing |

### When to keep default (auto-invocation allowed)

| Pattern | Example | Reason |
|---------|---------|--------|
| Daily tasks | commit-message, vigilare-task | Frequent use, triggers naturally |
| Code assistance | swift-development, documentation | Helps during normal development flow |
| Workflow shortcuts | github-workflow | "Issue作って" should just work |

### When to use `user-invocable: false`

| Pattern | Example | Reason |
|---------|---------|--------|
| Helper sub-skill | Internal validation | Only called by other skills |
| Background automation | Session cleanup | Claude decides when to run |

## context: fork Decision

**IMPORTANT:** `context: fork` runs in **isolation with NO conversation history** (not a true fork). See [Issue #20492](https://github.com/anthropics/claude-code/issues/20492).

### Use `context: fork`

| Condition | Example |
|-----------|---------|
| Self-contained task with explicit instructions | Release workflow |
| Final report is sufficient | Code generation |
| Long-running automation | Deploy pipeline |
| Orchestration that calls other skills (no conversation context needed) | swift-release |

### Do NOT use `context: fork`

| Condition | Example |
|-----------|---------|
| Needs conversation context | Answering questions about prior discussion |
| User wants to see process | Interactive guidance |
| Interactive/dialogue-based | Requirements gathering |
| Guidance/reference content | Documentation standards |

**Most skills should NOT use `context: fork`.**

## Frontmatter Fields

Complete field reference combining Agent Skills Spec and Labee extensions.

### Agent Skills Spec Fields

| Field | Required | Type | Constraints | Description |
|-------|:--------:|------|-------------|-------------|
| name | Yes | string | 1-64 chars, `[a-z0-9-]`, no leading/trailing/consecutive hyphens | Skill identifier, must match folder name |
| description | Yes | string | 1-1024 chars, no angle brackets | WHAT + WHEN + Triggers |
| license | No | string | SPDX identifier | License for the skill |
| allowed-tools | No | string | Comma-separated | Tools the skill can use |
| metadata | No | object | Key-value pairs | Arbitrary metadata |

### Labee Extension Fields

| Field | Required | Type | Default | Description |
|-------|:--------:|------|---------|-------------|
| model | No | enum | (inherited) | `haiku`, `sonnet`, or `opus` |
| context | No | enum | (normal) | `fork` for isolated execution |
| agent | No | string | - | Agent type (e.g., `general-purpose`) |
| disable-model-invocation | No | bool | false | Prevent auto-invocation by Claude |
| user-invocable | No | bool | true | Show in `/` menu |
