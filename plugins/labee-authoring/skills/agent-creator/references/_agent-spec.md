# Claude Code Agent Specification

## Frontmatter Fields

| Field | Required | Type | Default | Description |
|-------|----------|------|---------|-------------|
| `name` | Yes | string | — | Unique identifier. Lowercase letters, numbers, hyphens. 1-64 chars. |
| `description` | Yes | string | — | When Claude should delegate. Max 1024 chars. |
| `model` | No | enum | `inherit` | `sonnet`, `opus`, `haiku`, `fable`, a full model ID, or `inherit`. **Omit by default** — an omitted field means `inherit`, so the agent runs on the main conversation's model. Pin only when a cheaper model is deliberately enough. An org model allowlist can substitute another family's alias when the pinned family is blocked (2.1.222+) |
| `tools` | No | string | All tools | Comma-separated allowlist. Inherits all if omitted. |
| `disallowedTools` | No | string | — | Comma-separated denylist. Removed from inherited/specified. |
| `permissionMode` | No | enum | `default` | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan`. Ignored for plugin subagents |
| `maxTurns` | No | integer | — | Max agentic turns before stopping |
| `skills` | No | list | — | Skills preloaded at startup (full content injected, NOT inherited from parent) |
| `mcpServers` | No | object | — | MCP server names or inline definitions. Ignored for plugin subagents |
| `hooks` | No | object | — | Lifecycle hooks scoped to this agent (`PreToolUse`, `PostToolUse`, `Stop` → fires as `SubagentStop`). Active only while this agent runs. Project agents need workspace trust for frontmatter hooks (2.1.218+). Ignored for plugin subagents |
| `memory` | No | enum | — | `user`, `project`, or `local` |
| `background` | No | bool | — | Force background execution. Subagents already run in the background by default (2.1.198+) |
| `effort` | No | enum | (inherited) | Reasoning effort for this agent. Available levels depend on the model |
| `isolation` | No | enum | — | `worktree` runs the agent in its own git worktree |
| `color` | No | string | — | Display color for the agent in the UI |
| `initialPrompt` | No | string | — | Auto-submitted as the first user turn **only when this agent runs as the main session agent** (via `--agent` or the `agent` setting). Prepended to any user-provided prompt; commands and skills in it are processed. No effect when the agent is delegated to as a subagent |

## Name Rules

- Lowercase letters, numbers, hyphens only
- Must start with a letter
- Must end with a letter or number
- No consecutive hyphens (`--`)
- No leading/trailing hyphens
- No colons — `:` is reserved for plugin and namespace prefixes and is rejected in agent names (Claude Code 2.1.218+). `scripts/init_agent.ts` enforces this
- Max 64 characters

## File Placement

| Location | Path | Scope |
|----------|------|-------|
| Project | `.claude/agents/{name}.md` | This project (check into VCS) |
| User | `~/.claude/agents/{name}.md` | All your projects |
| Plugin | `agents/{name}.md` | Where plugin is enabled |

Priority: Managed (organization policy) > Session (`--agents` flag) > Project > User > Plugin

## Description Patterns

Claude uses `description` to decide when to delegate. Format:

```
[Expertise]. [Proactive trigger]. Use [when].
```

Examples from official docs:

- `"Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code."`
- `"Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues."`
- `"Data analysis expert for SQL queries, BigQuery operations, and data insights. Use proactively for data analysis tasks and queries."`

Including "use proactively" encourages automatic delegation.

## Key Constraints

- Agents receive ONLY their system prompt + basic environment details (working directory), NOT the full Claude Code system prompt
- Agents **can** spawn other agents. Nesting depth defaults to 3 (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`) and at most 20 subagents run concurrently (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`); the old per-session total cap was removed in 2.1.224. A forked agent cannot fork again
- Edit `.claude/agents/` directly to add or change an agent — the `/agents` wizard was removed in 2.1.198. Claude Code watches `~/.claude/agents/` and `.claude/agents/`: an added or edited file is detected within a few seconds and the next delegation uses it, no restart needed. Two exceptions still need a restart — creating the first agent file in an `agents` directory that did not exist when the session started, and sessions run with `--disable-slash-commands` (which do not watch at all)
- When `memory` is enabled, Read/Write/Edit tools are auto-enabled for memory management
- **Execution model:** subagents run in the background by default (2.1.198+). The Agent tool's `subagent_type: "fork"` — the default since 2.1.232 — inherits the parent's conversation and prompt cache, so a forked reviewer is not an independent reader; naming any other agent type starts it from a fresh context
- **User interaction:** background subagents surface permission prompts in the main session (2.1.186+), but no subagent can ever call `AskUserQuestion`. An agent that needs a decision must report back and let its caller ask

## Official Best Practices

1. **Design focused agents**: each should excel at one specific task
2. **Write detailed descriptions**: Claude uses this to decide when to delegate
3. **Limit tool access**: grant only necessary permissions for security and focus
4. **Check into version control**: share project agents with your team
