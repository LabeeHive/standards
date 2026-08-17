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

## allowed-tools Decision

**Not used in this repository — do not set `allowed-tools`.** `quick_validate.ts` fails a skill that carries it.

The field exists and is valid in the Agent Skills Spec, so it is worth knowing what it does before deciding not to use it. `allowed-tools` *pre-approves* the listed tools while the skill is active — it grants, it never restricts. Every tool left off the list remains callable under the session's normal permission settings, so the field cannot be used to keep a skill away from anything. `disallowed-tools` is the field that removes tools from the pool, and it stays.

The grant is also worth very little here, and costs something. Labee sessions run in auto mode, where deny and ask rules are applied before the classifier, a narrow `Bash(...)` grant only skips the classifier, a broad one is suspended outright, and non-Bash tools go to the classifier regardless — so most of a typical list changes nothing. Dynamic injection (`` ```! `` and `` !`command` `` blocks) runs without any `allowed-tools` entry in both default and auto modes, measured on Claude Code 2.1.233, so injecting a `_reference.md` with `cat` needs no grant either. What the field does do is apply without the workspace trust dialog, which makes a checked-in pre-approval an exposure that buys nothing.

**Bad — do not add this to a skill:**

```yaml
allowed-tools: Read Glob Grep Bash(git:*) Bash(gh:*)
```

**Fine — restricting a skill still works:**

```yaml
disallowed-tools: Edit Write Bash(sed:*) Bash(awk:*)
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

Do not set `model`, `effort`, `context`, `agent`, or `background` on a skill. No skill in this repository sets any of them; a skill inherits the session's model and effort.

`context: fork` runs the skill in an **isolated** subagent that starts from a fresh context — the name is misleading, because it does not inherit the conversation. (The Agent tool's `subagent_type: "fork"`, the default since Claude Code 2.1.232, is the one that inherits the parent's conversation and prompt cache.) Since 2.1.218 a forked skill runs in the background by default; `background: false` makes the caller wait for it in-turn instead. Either way the forked run cannot reach the user, so a skill that has to ask a question or wait for approval stalls there. That is why the field was removed from this repository in July; a skill that needs isolation spawns a subagent instead.

`model` and `effort` existed mostly to configure those forked runs. `model` additionally does not work: since 2.1.227 (still true on 2.1.233) a skill's `model` is recorded but never applied in interactive sessions — it only takes effect under `claude -p`. Anthropic reproduced this on 2.1.233 and it is unfixed ([#85658](https://github.com/anthropics/claude-code/issues/85658)). A skill that pins a model therefore silently runs on whatever the session is using.

If a skill genuinely needs isolation, spawn a subagent with the Agent tool from inside the skill instead — the result comes back to the caller, and the caller stays able to talk to the user.

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
| Code assistance | swift-core, documentation | Helps during normal development flow |
| Workflow shortcuts | obsidian-note | "メモして" should just work |

### When to use `user-invocable: false`

| Pattern | Example | Reason |
|---------|---------|--------|
| Helper sub-skill | Internal validation | Only called by other skills |
| Background automation | Session cleanup | Claude decides when to run |

### Naming and visibility of the invocation

- **Stacked invocations.** A prompt can lead with several skills — `/skill-a /skill-b …` loads up to 5 leading skills into the same turn (Claude Code 2.1.199). Write a skill so it composes: do not assume it is the only instruction set in the turn.
- **Nested skill directories.** Skills under a nested `.claude/skills` appear as `<dir>:<name>` when the bare name collides with another skill (2.1.178). Plugin skills are always `plugin:<name>`.
- **`skillOverrides` setting.** Users can downgrade a skill's availability per project without editing it: `"on"` (normal), `"name-only"` (listed by name, description withheld), `"user-invocable-only"` (Claude cannot auto-invoke it), `"off"`. Toggled with Space in the `/skills` menu and saved to `.claude/settings.local.json`. It does not apply to plugin skills — those are managed through `/plugin`.

## Frontmatter Fields

Two layers: the open standard (agentskills.io) and Claude Code extensions.

### Agent Skills Spec Fields

Source: <https://agentskills.io/specification>

| Field | Required | Type | Constraints | Description |
|-------|:--------:|------|-------------|-------------|
| name | Yes (spec) | string | 1-64 chars, `[a-z0-9-]`, no leading/trailing/consecutive hyphens. Reserved words: `anthropic`, `claude` | Skill identifier, must match folder name. Claude Code treats it as optional (defaults to directory name; the `/command` name always comes from the directory) — set it anyway for cross-tool portability |
| description | Yes | string | 1-1024 chars, no angle brackets. Listing shows `description` + `when_to_use` up to 1,536 chars. Must be third person | WHAT + WHEN + Triggers |
| license | No | string | SPDX identifier | License for the skill |
| compatibility | No | string | 1-500 chars | Environment requirements (platform, packages, network) |
| allowed-tools | No | string | **Do not set in this repository** (see allowed-tools Decision). Space-delimited (spec standard); Claude Code also accepts comma-separated and YAML list | Pre-approves the listed tools while the skill is active. It grants, never restricts, and applies without the workspace trust dialog — use `disallowed-tools` to take tools away |
| metadata | No | object | Key-value pairs | Arbitrary metadata |

### Claude Code Extension Fields

Source: <https://code.claude.com/docs/en/skills>

| Field | Required | Type | Default | Description |
|-------|:--------:|------|---------|-------------|
| model | No | string | (inherited) | **Do not set.** Same values as `/model`, or `inherit`. Documented to apply for the rest of the current turn only; the session model resumes on the next prompt. Also broken in interactive sessions — see Model, effort, and execution context |
| effort | No | enum | (inherited) | **Do not set.** `low`, `medium`, `high`, `xhigh`, `max`. Available levels depend on the model. Overrides session effort while the skill is active |
| when_to_use | No | string | - | Additional triggering context (trigger phrases, example requests). Appended to `description` in the skill listing; counts toward the 1,536-char cap |
| arguments | No | string/list | - | Named positional arguments for `$name` substitution. `arguments: [issue, branch]` → `$issue`, `$branch` map to positions in order |
| context | No | enum | (normal) | `fork` runs the skill in an isolated subagent. **Do not set** — see Model, effort, and execution context |
| agent | No | string | - | Agent type when `context: fork`. **Do not set** |
| background | No | bool | true | Only meaningful together with `context: fork` (Claude Code 2.1.218+). `true` runs the forked skill in the background; `background: false` makes the caller wait for it in-turn. **Do not set** — it has no effect without `context: fork` |
| paths | No | string | - | **Not used in this repository** (see paths Decision). Glob patterns intended to limit auto-activation to matching files |
| argument-hint | No | string | - | Hint shown in `/` autocomplete (e.g., `[issue-number]`) |
| disable-model-invocation | No | bool | false | Prevent auto-invocation by Claude. The skill's description is removed from Claude's context entirely (still visible in the `/` menu) |
| user-invocable | No | bool | true | Show in `/` menu |
| disallowed-tools | No | string/list | - | Tools removed from Claude's available pool while the skill is active. Restriction clears on the next user message |
| hooks | No | object | - | Hooks scoped to this skill's lifecycle |
| shell | No | enum | bash | Shell for `` !`command` `` blocks. `bash` or `powershell` |

Boolean fields (`disable-model-invocation`, `user-invocable`, `background`, …) accept `yes`/`no`, `on`/`off`, and `1`/`0` in addition to `true`/`false` since Claude Code 2.1.218. Prefer `true`/`false` anyway — it is the form the skills in this repository already use, and spec-compliant tools outside Claude Code only guarantee the YAML booleans.

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
| `${CLAUDE_PROJECT_DIR}` | Project root directory |
| `${CLAUDE_PLUGIN_ROOT}` | Plugin root directory — plugin skills only |
| `${CLAUDE_PLUGIN_DATA}` | Plugin data directory that survives plugin updates — plugin skills only |

Unmatched `$N` placeholders are left in place rather than deleted (Claude Code 2.1.210). Do not write a literal `$0` or `$1` in body prose that is not meant as a placeholder: multi-word argument values have been reported to corrupt such literals during substitution ([#87109](https://github.com/anthropics/claude-code/issues/87109), 2026-08-16). Write the index in prose ("the first argument") or fence it as code when you need to talk about the syntax itself.

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

**Not used in this repository — do not set `paths`.**

`paths` is not deprecated: the official skills documentation still lists it as a current field ("Claude loads the skill automatically only when working with files matching the patterns"). This repository removed it on 2026-06-11 because it did not work, as of Claude Code 2.1.150:

- The auto-load trigger does not fire at all ([#62049](https://github.com/anthropics/claude-code/issues/62049), verified at the API level)
- A skill carrying `paths` can become undiscoverable — missing from the skill listing and uninvocable via `/name` ([#49835](https://github.com/anthropics/claude-code/issues/49835), open)

`description` + `when_to_use` are the actual trigger mechanism — express file affinity there instead (e.g., mention the file types in the description). Both issues predate the versions this repository now targets, so re-verify them on your Claude Code version before relying on `paths`; the intended syntax is glob patterns as a comma-separated string (`paths: "**/*.swift, **/Package.swift"`) or a YAML list.

## argument-hint Decision

| Condition | Set argument-hint | Example |
|-----------|:--:|---------|
| `disable-model-invocation: true` | Yes (strongly recommended) | `[target-environment]` |
| Skill takes meaningful arguments | Yes | `[issue-number]` |
| No arguments expected | No | - |
