# Tool Strategy Guide

## Tool Selection Matrix

Match tools to the agent's role:

| Role Pattern | Tools | Example |
|-------------|-------|---------|
| Read-only / Reviewer | `Read, Grep, Glob, Bash` | code-reviewer, auditor |
| Modifier / Fixer | `Read, Edit, Bash, Grep, Glob` | debugger, refactorer |
| Creator / Writer | `Read, Write, Edit, Bash, Glob, Grep` | generator, scaffolder |
| Data Analyst | `Bash, Read, Write` | data-scientist, reporter |
| Researcher | `Read, Grep, Glob, WebSearch, WebFetch` | researcher, documentation |
| Communicator | Above + `Skill, SendMessage` | PR agent, team coordinator |
| Full (Labee agent) | `Read, Write, Edit, Glob, Grep, Bash, WebSearch, WebFetch, Skill, SendMessage` | labee-dev-apm |

## Decision Flow

```
1. Does the agent need to MODIFY files?
   No  → Start with Read, Grep, Glob
   Yes → Add Edit (and Write if creating new files)

2. Does it need to RUN commands?
   Yes → Add Bash

3. Does it need EXTERNAL information?
   Yes → Add WebSearch, WebFetch

4. Does it need to use OTHER SKILLS?
   Yes → Add Skill

5. Does it need to MESSAGE teammates?
   Yes → Add SendMessage

6. Can it SPAWN sub-agents?
   Yes → Add Agent (or Agent(specific-agent) for allowlist)
```

Spawning is allowed: agents can spawn agents up to a nesting depth of 3 by default (`references/_agent-spec.md` Key Constraints). Note that the Agent tool's default `subagent_type: "fork"` inherits the caller's conversation — name a specific agent type when you want a reader who has not seen it.

## Permission Modes

| Mode | When to Use |
|------|-------------|
| `default` | Most agents. Standard permission prompts. |
| `acceptEdits` | Agents that edit files frequently (formatters, generators). User still approves Bash. |
| `auto` | Permission decisions classified automatically instead of prompting. |
| `dontAsk` | Restrictive agents. Auto-denies anything not in `tools`. |
| `plan` | Planning-phase agents. Read-only exploration. |
| `bypassPermissions` | CI/automation only. Skips ALL checks. Use with extreme caution. |

Plugin subagents ignore `permissionMode` (along with `mcpServers` and `hooks`).

## Model Selection

**Default: omit `model` entirely.** An agent with no `model` field defaults to `inherit` and runs on the same model as the main conversation, so the user's model choice carries into every agent they delegate to. Pin a model only when a deliberate reason applies — typically that a cheaper model is demonstrably enough for the work.

| Model | When to Pin It | Cost |
|-------|----------------|------|
| (omitted) | **Default.** Same model as the main conversation. | Varies |
| `haiku` | Simple, fast tasks (1-2 steps). Search, lookup, format. | Low |
| `sonnet` | Routine work where the session model would be overkill. | Medium |
| `opus` | Complex reasoning, multi-step analysis, creative design. | High |
| `fable` | Highest-capability tier. Only where the task justifies it and the org has access. | Highest |
| `inherit` | Same as omitting the field. Write it only when the intent needs to be explicit. | Varies |

Aliases resolve to the current member of each family (`sonnet` is Sonnet 5, `opus` is Opus 5 since 2.1.219). A full model ID also works when you need to pin an exact version. Note that a pin is not a guarantee: since 2.1.222 an organization's model allowlist can substitute another family's alias when the pinned family is blocked, which is one more reason to omit the field unless the pin is doing real work.

## Memory Selection

**Default: omit `memory` entirely.** Auto memory is disabled in Labee's environment (`CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`), so a `memory` field buys nothing and none of the agents in this repository set one. Set it only in a project that has deliberately turned memory back on.

| Scope | Path | When to Use |
|-------|------|-------------|
| (omit) | — | **Default.** Stateless agent. No persistent memory. |
| `user` | `~/.claude/agent-memory/<name>/` | Cross-project learnings, in a project that enables memory. |
| `project` | `.claude/agent-memory/<name>/` | Project-specific, shareable via VCS. |
| `local` | `.claude/agent-memory-local/<name>/` | Project-specific, NOT in VCS. |

Include memory instructions in the system prompt when enabled:

```markdown
Update your agent memory as you discover codepaths, patterns, library
locations, and key architectural decisions. This builds up institutional
knowledge across conversations. Write concise notes about what you found
and where.
```

## Hook Patterns

### Validate commands before execution

```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-command.sh $TOOL_INPUT"
```

### Auto-lint after file changes

```yaml
hooks:
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "./scripts/run-linter.sh"
```

### Read-only database agent (block mutations)

```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
```

Exit code 2 blocks the operation.
