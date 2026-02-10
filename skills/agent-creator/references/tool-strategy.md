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
   Yes → Add Task (or Task(specific-agent) for allowlist)
```

## Permission Modes

| Mode | When to Use |
|------|-------------|
| `default` | Most agents. Standard permission prompts. |
| `acceptEdits` | Agents that edit files frequently (formatters, generators). User still approves Bash. |
| `dontAsk` | Restrictive agents. Auto-denies anything not in `tools`. |
| `plan` | Planning-phase agents. Read-only exploration. |
| `delegate` | Team lead agents that only coordinate, not implement. |
| `bypassPermissions` | CI/automation only. Skips ALL checks. Use with extreme caution. |

## Model Selection

| Model | When to Use | Cost |
|-------|-------------|------|
| `haiku` | Simple, fast tasks (1-2 steps). Search, lookup, format. | Low |
| `sonnet` | Most agents. Good balance of capability and cost. | Medium |
| `opus` | Complex reasoning, multi-step analysis, creative design. | High |
| `inherit` | Match parent conversation. Default if omitted. | Varies |

## Memory Selection

| Scope | Path | When to Use |
|-------|------|-------------|
| `user` | `~/.claude/agent-memory/<name>/` | **Recommended default.** Cross-project learnings. |
| `project` | `.claude/agent-memory/<name>/` | Project-specific, shareable via VCS. |
| `local` | `.claude/agent-memory-local/<name>/` | Project-specific, NOT in VCS. |
| (omit) | — | Stateless agent. No persistent memory. |

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
