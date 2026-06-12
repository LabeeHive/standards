---
name: agent-creator
description: Create and improve Claude Code custom agents (subagents) following official best practices. Use when building new agents or improving existing ones.
when_to_use: Triggers on "エージェント作成", "agent作成", "create agent", "new agent", "エージェント改善".
model: opus
effort: max
allowed-tools: Read Write Edit Glob Grep Bash(bun:*) WebSearch WebFetch Task(Explore) TaskCreate TaskUpdate TaskList
---

# Agent Creator

Create effective Claude Code custom agents following official best practices and Labee patterns.

## Phase Tracking

**At workflow start, create tasks for each phase:**

```
TaskCreate: "Phase 1: Understand"
TaskCreate: "Phase 2: Research"
TaskCreate: "Phase 3: Design"
TaskCreate: "Phase 4: Initialize"
TaskCreate: "Phase 5: Write System Prompt"
TaskCreate: "Phase 6: Validate"
TaskCreate: "Phase 7: Test"
```

Update status as you progress: `in_progress` when starting, `completed` when done.

## Workflow

### Phase 1: Understand

1. Ask for **2-3 concrete tasks** the agent will handle:
   - "What specific tasks should this agent do?"
   - "Walk me through a typical delegation — what triggers it, what happens?"
   - "What does the result look like?"

2. Determine agent type:
   - **Utility agent**: Focused tool (code-reviewer, debugger, data-scientist)
   - **Persona agent**: Team member with personality (Labee AI employee)
   - **Improve existing**: Read and analyze an existing agent file

3. Confirm understanding with the user.

**Skip when:** Improving an existing agent with clear requirements.

### Phase 2: Research

**Run in parallel as needed:**

| Target | Method |
|--------|--------|
| Existing agents in project | `Glob .claude/agents/*.md` and `agents/*.md` |
| Agent spec quick reference | Read `references/_agent-spec.md` (auto-loaded) |
| Domain-specific knowledge | WebSearch for relevant tools/APIs |

**Skip when:** Simple agent with clear requirements and no domain research needed.

### Phase 3: Design

Decide these configuration values:

1. **Tools** — See `references/tool-strategy.md` for selection matrix
2. **Model** — `sonnet` for most agents, `haiku` for simple/fast, `opus` for complex reasoning
3. **Memory** — `user` recommended default. Omit for stateless agents.
4. **permissionMode** — `default` for most. See `references/tool-strategy.md`
5. **Description** — Follow pattern: `"[Expertise]. [Proactive trigger]. Use [when]."`
6. **System prompt pattern** — See `references/system-prompt-patterns.md`
7. **Hooks** — Only if the agent needs operational constraints (e.g., read-only DB)

For persona agents, also design:
- Name (Japanese + English)
- Background and personality
- Communication style and catchphrases
- See `references/persona-design.md`

**Present the design to the user for approval.**

### Phase 4: Initialize

Run the scaffolder:

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/init_agent.ts {agent-name} --path {target-dir}
```

Options:
- `--path .claude/agents` — Project scope (default)
- `--path agents` — Plugin scope
- `--scope user` — User scope (`~/.claude/agents/`)
- `--labee` — Labee team agent template with persona sections
- `--model sonnet` — Model selection
- `--tools "Read, Grep, Glob, Bash"` — Tool list
- `--memory user` — Memory scope

### Phase 5: Write System Prompt

Fill in the generated scaffold following the appropriate pattern from `references/system-prompt-patterns.md`:

**For utility agents:**
1. "You are a {role}." opening
2. "When invoked:" numbered steps (3-5)
3. Checklist or key practices
4. Output format specification
5. Closing behavioral principle

**For persona agents:**
1. Identity + company context
2. About You (personality, background, hobbies)
3. Company info
4. Responsibilities (3-6 items)
5. Handling Requests (with characteristic phrases)
6. Domain-specific section
7. Communication Style (tone, catchphrases)
8. Prohibited (3-5 hard boundaries)

**For improving existing agents:**
1. Read the current agent file
2. Identify issues (vague description, missing sections, tool mismatch)
3. Propose specific improvements
4. Apply changes after user approval

### Phase 6: Validate

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/validate_agent.ts {agent-file.md}
```

Fix errors and re-run until valid.

**Checklist:**
- [ ] `name`: lowercase, hyphens, 1-64 chars, no `--`, no leading/trailing `-`
- [ ] `description`: specific expertise + when to use, under 1024 chars
- [ ] `tools`: minimal set for the agent's role
- [ ] `model`: appropriate for task complexity
- [ ] System prompt: no TODO placeholders remaining
- [ ] System prompt: under 200 lines
- [ ] Prohibited section present (for persona agents)

### Phase 7: Test

Suggest 2-3 test tasks to try with the new agent:

```
Use the {agent-name} agent to {test task 1}
```

Remind the user to restart Claude Code or use `/agents` to load the new agent.

## Reference Files

| File | Load When |
|------|-----------|
| `references/_agent-spec.md` | Always (frontmatter fields, name rules, placement, best practices) |
| `references/persona-design.md` | Creating persona/team agents |
| `references/tool-strategy.md` | Deciding tools, permissions, model, memory |
| `references/system-prompt-patterns.md` | Writing or improving system prompts |
