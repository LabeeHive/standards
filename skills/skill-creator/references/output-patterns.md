# Output Patterns

Patterns for consistent skill output.

## Core Principle

> **Claude is already very smart.** Don't explain what Claude already knows.

**Good:** Specific patterns, edge cases, project-specific conventions
**Bad:** "A function is a reusable block of code", "Git is a version control system"

## Description Format

**Required structure:** WHAT + WHEN + Triggers (JP & EN)

**Constraints:**
- **250-char truncation**: Descriptions longer than 250 characters are truncated in the skill listing. Front-load key use case and triggers within the first 250 characters.
- **Third person only**: Description is injected into the system prompt. Inconsistent point-of-view causes discovery problems.
- **Triggers must include BOTH English AND Japanese** for international accessibility.

```yaml
description: [What it does]. [When to use]. Triggers on "english", "日本語".
```

**Good:**
```yaml
description: Create GitHub Issues and PRs following standards. Use this when filing issues or opening PRs. Triggers on "Issue作成", "PR作成", "pull request", "create issue", "起票".
```

**Bad (first person):**
```yaml
description: I can help you create GitHub Issues and PRs.
```

**Bad (missing English triggers):**
```yaml
description: Create tasks in Vigilare. Use this when adding tasks. Triggers on "タスク作成", "起票して".
```

**Bad (missing description):**
```yaml
description: GitHub workflow helper.
```

## allowed-tools Patterns

Use specific patterns, not generic tool names. The Agent Skills Spec defines `allowed-tools` as space-delimited. Claude Code also accepts comma-separated and YAML list format.

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
allowed-tools: Read Glob Grep Bash(git:*) Bash(gh:*)
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

> **Context (Feb 2026):** Sonnet 4.6 matches Opus 4.5 on most practical tasks (SWE-bench 79.6%, OSWorld 72.5%) and exceeds it on office/finance benchmarks. Opus 4.6 leads only in abstract reasoning (ARC-AGI-2), terminal operations (Terminal-Bench), and complex web autonomy (BrowseComp). Haiku 4.5 is Anthropic's official recommendation for sub-agent tasks.

**Numeric Decision Criteria:**

| Model | When to Use | Price (in/out per MTok) |
|-------|-------------|:-----------------------:|
| haiku | No file writes, no complex reasoning, sub-agent tasks | $1 / $5 |
| sonnet | File writes, MCP tools, multi-step workflows, standard orchestration | $3 / $15 |
| opus | Autonomous self-correction loops (ARL), architectural design decisions, deep abstract reasoning | $5 / $25 |

**Decision Tree:**
```
Does skill require autonomous self-correction (ARL pattern)? → Yes → opus
Does skill make architectural design decisions requiring deep abstract reasoning? → Yes → opus
Does skill write files OR use MCP tools? → Yes → sonnet
Otherwise → haiku
```

**Exceptions:**
- Guidance-only skills (no Write/Edit in allowed-tools) can use haiku regardless of step count
- Simple MCP query skills (read-only queries + formatting) can use sonnet
- Skills with many steps but only standard orchestration (no ARL, no architectural decisions) → sonnet

**Examples:**

| Skill | Steps | Writes | Services | MCP | → Model | Reason |
|-------|:-----:|:------:|:--------:|:---:|:-------:|--------|
| automation-config | 4 | 0 | 0 | No | haiku | Guidance-only, no writes |
| documentation | 2 | 0 | 0 | No | haiku | Few steps, no writes |
| today | 2 | 0 | 0 | Yes | sonnet | Simple MCP queries + formatting |
| swift-development | 3 | 3 | 0 | No | sonnet | File writes |
| repository-setup | 5 | 5 | 1 | No | sonnet | Writes + simple services |
| github-workflow | 5 | 0 | 1 | No | sonnet | Analyzes code, writes PR body |
| vigilare-task | 6 | 0 | 0 | Yes | sonnet | MCP orchestration (no ARL needed) |
| swift-workflow | 8 | 5 | 0 | Yes | sonnet | Multi-step workflow, standard orchestration |
| skill-creator | 7 | 4 | 0 | No | opus | ARL-capable, architectural design decisions |
| aso-review | 3 | 3+ | 0 | No | sonnet | Multi-language ASO evaluation with file edits |

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

Two layers: the open standard (agentskills.io) and Claude Code extensions.

### Agent Skills Spec Fields

Source: https://agentskills.io/specification

| Field | Required | Type | Constraints | Description |
|-------|:--------:|------|-------------|-------------|
| name | Yes | string | 1-64 chars, `[a-z0-9-]`, no leading/trailing/consecutive hyphens. Reserved words: `anthropic`, `claude` | Skill identifier, must match folder name |
| description | Yes | string | 1-1024 chars, no angle brackets. First 250 chars shown in listing. Must be third person | WHAT + WHEN + Triggers |
| license | No | string | SPDX identifier | License for the skill |
| compatibility | No | string | 1-500 chars | Environment requirements (platform, packages, network) |
| allowed-tools | No | string | Space-delimited (spec standard). Claude Code also accepts comma-separated and YAML list | Tools the skill can use |
| metadata | No | object | Key-value pairs | Arbitrary metadata |

### Claude Code Extension Fields

Source: https://code.claude.com/docs/en/skills

| Field | Required | Type | Default | Description |
|-------|:--------:|------|---------|-------------|
| model | No | enum | (inherited) | `haiku`, `sonnet`, or `opus` |
| effort | No | enum | (inherited) | `low`, `medium`, `high`, `max` (max = Opus 4.6 only). Overrides session effort |
| context | No | enum | (normal) | `fork` for isolated execution |
| agent | No | string | - | Agent type when `context: fork` (e.g., `general-purpose`, `Explore`) |
| paths | No | string | - | Glob patterns (comma-separated or YAML list). Skill auto-activates only when working with matching files |
| argument-hint | No | string | - | Hint shown in `/` autocomplete (e.g., `[issue-number]`) |
| disable-model-invocation | No | bool | false | Prevent auto-invocation by Claude |
| user-invocable | No | bool | true | Show in `/` menu |
| hooks | No | object | - | Hooks scoped to this skill's lifecycle |
| shell | No | enum | bash | Shell for `` !`command` `` blocks. `bash` or `powershell` |

### String Substitutions

Available in SKILL.md body content:

| Variable | Description |
|----------|-------------|
| `$ARGUMENTS` | All arguments passed when invoking the skill |
| `$ARGUMENTS[N]` / `$N` | Specific argument by 0-based index |
| `${CLAUDE_SESSION_ID}` | Current session ID |
| `${CLAUDE_SKILL_DIR}` | Directory containing SKILL.md (use for referencing bundled scripts/files) |

### Dynamic Context Injection

`` !`command` `` in SKILL.md runs shell commands before content is sent to Claude. Output replaces the placeholder.

```yaml
## Context
- Current branch: !`git branch --show-current`
- Changed files: !`git diff --name-only`
```

## paths Decision

**Skill auto-activation rate is below 20% even in relevant contexts.** Setting `paths` significantly improves activation for file-type-specific skills.

| Condition | paths value | Example |
|-----------|------------|---------|
| Targets specific language files | `**/*.{ext}` | swift-core → `"**/*.swift"` |
| Targets specific directory | `src/components/**` | component skill |
| Universal skill (no file affinity) | Do not set | commit-message, today |

`paths` accepts glob patterns as comma-separated string or YAML list. Same format as path-specific rules.

```yaml
# Single pattern
paths: "**/*.swift"

# Multiple patterns
paths: "**/*.swift, **/Package.swift, **/Info.plist"

# YAML list
paths:
  - "**/*.swift"
  - "**/Package.swift"
```

## effort Decision

| model | Recommended effort | Reason |
|-------|-------------------|--------|
| opus | `max` | Deep abstract reasoning benefits from maximum compute |
| sonnet | (inherit or `high`) | Standard orchestration; override only if needed |
| haiku | `low` | Guidance-only; minimize token usage |

## argument-hint Decision

| Condition | Set argument-hint | Example |
|-----------|:--:|---------|
| `disable-model-invocation: true` | Yes (strongly recommended) | `[target-environment]` |
| Skill takes meaningful arguments | Yes | `[issue-number]` |
| No arguments expected | No | - |
