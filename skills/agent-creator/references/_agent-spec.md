# Claude Code Agent Specification

## Frontmatter Fields

| Field | Required | Type | Default | Description |
|-------|----------|------|---------|-------------|
| `name` | Yes | string | — | Unique identifier. Lowercase letters, numbers, hyphens. 1-64 chars. |
| `description` | Yes | string | — | When Claude should delegate. Max 1024 chars. |
| `model` | No | enum | `inherit` | `sonnet`, `opus`, `haiku`, or `inherit` |
| `tools` | No | string | All tools | Comma-separated allowlist. Inherits all if omitted. |
| `disallowedTools` | No | string | — | Comma-separated denylist. Removed from inherited/specified. |
| `permissionMode` | No | enum | `default` | `default`, `acceptEdits`, `dontAsk`, `delegate`, `bypassPermissions`, `plan` |
| `maxTurns` | No | integer | — | Max agentic turns before stopping |
| `skills` | No | list | — | Skills preloaded at startup (full content injected, NOT inherited from parent) |
| `mcpServers` | No | object | — | MCP server names or inline definitions |
| `hooks` | No | object | — | Lifecycle hooks scoped to this agent |
| `memory` | No | enum | — | `user`, `project`, or `local` |

## Name Rules

- Lowercase letters, numbers, hyphens only
- Must start with a letter
- Must end with a letter or number
- No consecutive hyphens (`--`)
- No leading/trailing hyphens
- Max 64 characters

## File Placement

| Location | Path | Scope |
|----------|------|-------|
| Project | `.claude/agents/{name}.md` | This project (check into VCS) |
| User | `~/.claude/agents/{name}.md` | All your projects |
| Plugin | `agents/{name}.md` | Where plugin is enabled |

Priority: Session (`--agents` flag) > Project > User > Plugin

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
- Agents cannot spawn other agents
- Agents are loaded at session start; restart or use `/agents` to load new ones
- When `memory` is enabled, Read/Write/Edit tools are auto-enabled for memory management
- Background agents: pre-approved permissions, no MCP tools, no clarifying questions

## Official Best Practices

1. **Design focused agents**: each should excel at one specific task
2. **Write detailed descriptions**: Claude uses this to decide when to delegate
3. **Limit tool access**: grant only necessary permissions for security and focus
4. **Check into version control**: share project agents with your team
