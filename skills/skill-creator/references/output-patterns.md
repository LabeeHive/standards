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


## Model, effort, and execution context

Do not set `model`, `effort`, `context`, or `agent` on a skill. Every Labee skill had these
removed; a skill inherits the session's model and effort.

`context: fork` runs the skill in an isolated background process. Measured behaviour: the
caller receives only `Skill "<name>" launched (forked execution, running in the background).`
— no instructions, no phase progress, no errors, and in one trial no completion notification
at all. The forked run cannot reach the user, so any instruction to ask a question or wait for
approval leaves it stalled indefinitely while appearing to work. That is what the `model` and
`effort` pinning mostly existed to configure, so all four fields went together.

If a skill genuinely needs isolation, spawn a subagent with the Task tool from inside the
skill instead — the result comes back to the caller.

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
| model | No | string | (inherited) | **Do not set.** Same values as `/model`, or `inherit`. Override applies for the rest of the current turn only; the session model resumes on the next prompt |
| effort | No | enum | (inherited) | **Do not set.** `low`, `medium`, `high`, `xhigh`, `max`. Available levels depend on the model. Overrides session effort while the skill is active |
| when_to_use | No | string | - | Additional triggering context (trigger phrases, example requests). Appended to `description` in the skill listing; counts toward the 1,536-char cap |
| arguments | No | string/list | - | Named positional arguments for `$name` substitution. `arguments: [issue, branch]` → `$issue`, `$branch` map to positions in order |
| context | No | enum | (normal) | `fork` for isolated execution. **Do not set** — see Model, effort, and execution context |
| agent | No | string | - | Agent type when `context: fork`. **Do not set** |
| paths | No | string | - | **Deprecated — do not set** (see paths Decision). Glob patterns intended to limit auto-activation to matching files |
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

**Deprecated in this repository — do not set `paths`.**

The field is still in the official docs ("Claude loads the skill automatically only when working with files matching the patterns"), but it is broken in practice as of Claude Code 2.1.150 (2026-06):

- The auto-load trigger does not fire at all ([#62049](https://github.com/anthropics/claude-code/issues/62049), verified at the API level)
- A skill carrying `paths` can become undiscoverable — missing from the skill listing and uninvocable via `/name` ([#49835](https://github.com/anthropics/claude-code/issues/49835), open)

`description` + `when_to_use` are the actual trigger mechanism — express file affinity there instead (e.g., mention the file types in the description). Re-check the issues above before reintroducing `paths`; the intended syntax was glob patterns as a comma-separated string (`paths: "**/*.swift, **/Package.swift"`) or YAML list.

## argument-hint Decision

| Condition | Set argument-hint | Example |
|-----------|:--:|---------|
| `disable-model-invocation: true` | Yes (strongly recommended) | `[target-environment]` |
| Skill takes meaningful arguments | Yes | `[issue-number]` |
| No arguments expected | No | - |
