# Output Patterns

Patterns for consistent skill output.

## Core Principle

> **Claude is already very smart.** Don't explain what Claude already knows.

**Good:** Specific patterns, edge cases, project-specific conventions
**Bad:** "A function is a reusable block of code", "Git is a version control system"

## Description Format

**Recommended split:** `description` = WHAT + WHEN summary, `when_to_use` = trigger phrases (JP & EN).

```yaml
description: [What it does]. [When to use].
when_to_use: Triggers on "english-trigger", "日本語トリガー", "another phrase".
```

Why this split:
- `description` has a 1,024-char spec limit; `when_to_use` adds room for trigger phrases beyond it.
- Claude Code appends `when_to_use` to `description` in the skill listing, so triggering behavior is the same as inlining the triggers.
- `when_to_use` is a Claude Code extension (snake_case, unlike other fields). Spec-compliant tools ignore it — so `description` must stand alone: keep the WHEN summary in `description`, not only in `when_to_use`.

**Constraints:**
- **1,536-char listing cap**: The combined `description` + `when_to_use` text is truncated at 1,536 characters in the skill listing (configurable via `maxSkillDescriptionChars`). `when_to_use` is appended after `description`, so it is trimmed first — front-load the key use case in `description`. The total listing budget for all skills is 1% of the context window (`skillListingBudgetFraction`), and least-used skills lose their descriptions first.
- **Third person only**: Description is injected into the system prompt. Inconsistent point-of-view causes discovery problems.
- **Triggers must include BOTH English AND Japanese** for international accessibility.

**Good:**
```yaml
description: Create GitHub Issues and PRs following standards. Use this when filing issues or opening PRs.
when_to_use: Triggers on "Issue作成", "PR作成", "pull request", "create issue", "起票".
```

Inlining triggers in `description` (the previous Labee pattern) remains valid — prefer it only when the skill must work in non-Claude-Code agents that should still see the trigger phrases.

**Bad (first person):**
```yaml
description: I can help you create GitHub Issues and PRs.
```

**Bad (missing English triggers):**
```yaml
description: Create tasks in Vigilare. Use this when adding tasks.
when_to_use: Triggers on "タスク作成", "起票して".
```

**Bad (missing description):**
```yaml
description: GitHub workflow helper.
```

## allowed-tools Patterns

Use specific patterns, not generic tool names. The Agent Skills Spec defines `allowed-tools` as space-delimited. Claude Code also accepts comma-separated and YAML list format.

**Semantics (Claude Code):** `allowed-tools` *pre-approves* the listed tools while the skill is active, so they run without permission prompts. It does NOT restrict the tool pool — every other tool remains callable under normal permission settings. To remove tools from the pool, use `disallowed-tools` instead. For project skills, pre-approval takes effect only after the workspace trust dialog is accepted.

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
| documentation | 2 | 2 | 0 | No | sonnet | File writes (Edit, Write) |
| today | 2 | 0 | 0 | Yes | sonnet | Simple MCP queries + formatting |
| swift-development | 3 | 3 | 0 | No | sonnet | File writes |
| repository-setup | 5 | 5 | 1 | No | sonnet | Writes + simple services |
| github-workflow | 5 | 0 | 1 | No | sonnet | Analyzes code, writes PR body |
| vigilare-task | 6 | 0 | 0 | Yes | sonnet | MCP orchestration (no ARL needed) |
| swift-workflow | 8 | 5 | 0 | Yes | sonnet | Multi-step workflow, standard orchestration |
| skill-creator | 7 | 4 | 0 | No | opus | ARL-capable, architectural design decisions |
| gemini-image | 2 | 0 | 1 | No | opus | CLI image generation, deep creative reasoning |
| swift-localization | 4 | 2 | 0 | No | opus | ARL pattern (verify→translate→re-verify loop) |
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
| name | Yes (spec) | string | 1-64 chars, `[a-z0-9-]`, no leading/trailing/consecutive hyphens. Reserved words: `anthropic`, `claude` | Skill identifier, must match folder name. Claude Code treats it as optional (defaults to directory name; the `/command` name always comes from the directory) — set it anyway for cross-tool portability |
| description | Yes | string | 1-1024 chars, no angle brackets. Listing shows `description` + `when_to_use` up to 1,536 chars. Must be third person | WHAT + WHEN + Triggers |
| license | No | string | SPDX identifier | License for the skill |
| compatibility | No | string | 1-500 chars | Environment requirements (platform, packages, network) |
| allowed-tools | No | string | Space-delimited (spec standard). Claude Code also accepts comma-separated and YAML list | Tools the skill can use |
| metadata | No | object | Key-value pairs | Arbitrary metadata |

### Claude Code Extension Fields

Source: https://code.claude.com/docs/en/skills

| Field | Required | Type | Default | Description |
|-------|:--------:|------|---------|-------------|
| model | No | string | (inherited) | Same values as `/model`, or `inherit`. Override applies for the rest of the current turn only; the session model resumes on the next prompt |
| effort | No | enum | (inherited) | `low`, `medium`, `high`, `xhigh`, `max`. Available levels depend on the model. Overrides session effort while the skill is active |
| when_to_use | No | string | - | Additional triggering context (trigger phrases, example requests). Appended to `description` in the skill listing; counts toward the 1,536-char cap |
| arguments | No | string/list | - | Named positional arguments for `$name` substitution. `arguments: [issue, branch]` → `$issue`, `$branch` map to positions in order |
| context | No | enum | (normal) | `fork` for isolated execution |
| agent | No | string | - | Agent type when `context: fork` (e.g., `general-purpose`, `Explore`) |
| paths | No | string | - | Glob patterns (comma-separated or YAML list). Skill auto-activates only when working with matching files |
| argument-hint | No | string | - | Hint shown in `/` autocomplete (e.g., `[issue-number]`) |
| disable-model-invocation | No | bool | false | Prevent auto-invocation by Claude. The skill's description is removed from Claude's context entirely (still visible in the `/` menu) |
| user-invocable | No | bool | true | Show in `/` menu |
| disallowed-tools | No | string/list | - | Tools removed from Claude's available pool while the skill is active. Restriction clears on the next user message |
| hooks | No | object | - | Hooks scoped to this skill's lifecycle |
| shell | No | enum | bash | Shell for `` !`command` `` blocks. `bash` or `powershell` |

### String Substitutions

Available in SKILL.md body content:

| Variable | Description |
|----------|-------------|
| `$ARGUMENTS` | All arguments passed when invoking the skill. If absent from content, arguments are appended as `ARGUMENTS: <value>` |
| `$ARGUMENTS[N]` / `$N` | Specific argument by 0-based index |
| `$name` | Named argument declared in the `arguments` frontmatter field |
| `${CLAUDE_SESSION_ID}` | Current session ID |
| `${CLAUDE_EFFORT}` | Current effort level (`low`–`max`). Use to adapt instructions to the active effort |
| `${CLAUDE_SKILL_DIR}` | Directory containing SKILL.md (use for referencing bundled scripts/files) |

### Dynamic Context Injection

`` !`command` `` in SKILL.md runs shell commands before content is sent to Claude. Output replaces the placeholder.

```yaml
## Context
- Current branch: !`git branch --show-current`
- Changed files: !`git diff --name-only`
```

For multi-line commands, use a fenced block opened with ` ```! `. Substitution runs once over the original file; command output is not re-scanned for further placeholders. Users can disable this via the `disableSkillShellExecution` setting.

## Skill Content Lifecycle

Why SKILL.md conciseness matters beyond the initial load:

- **Content persists across turns.** Once invoked, the rendered SKILL.md enters the conversation as a message and stays for the rest of the session. Claude Code does not re-read the file on later turns — every line is a *recurring* token cost, and guidance must be written as standing instructions, not one-time steps.
- **Compaction budget.** During auto-compaction, the most recent invocation of each skill is re-attached after the summary, keeping the first 5,000 tokens per skill within a combined 25,000-token budget (most recently invoked first). Oversized skills get truncated; older skills can be dropped entirely.
- **Implication:** put the most important standing instructions in the first ~5,000 tokens of SKILL.md, and move everything else to references/.

## paths Decision

`paths` controls *automatic* loading only: "Claude loads the skill automatically only when working with files matching the patterns." It has no effect on manual `/name` invocation.

| Condition | paths value | Example |
|-----------|------------|---------|
| Targets specific language files | `**/*.{ext}` | swift-core → `"**/*.swift"` |
| Targets specific directory | `src/components/**` | component skill |
| Universal skill (no file affinity) | Do not set | commit-message, today |
| `disable-model-invocation: true` | Do not set | swift-release |

**Why not with `disable-model-invocation: true`:** that flag disables automatic loading entirely (only the user can invoke), so `paths` can never fire — it is dead config.

**Known issues (as of Claude Code 2.1.150, 2026-06):** the `paths` auto-load trigger reportedly does not fire at all ([#62049](https://github.com/anthropics/claude-code/issues/62049), verified at the API level), and a skill with `paths` but no `description` disappears from the skill listing entirely ([#49835](https://github.com/anthropics/claude-code/issues/49835)). Treat `paths` as forward-compatible metadata: always pair it with a strong `description`/`when_to_use`, which remain the primary trigger mechanism. Re-check these issues before relying on `paths` behavior.

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

Levels: `low`, `medium`, `high`, `xhigh`, `max` (availability depends on the model).

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
