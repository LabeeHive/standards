---
name: agent-creator
description: Create and improve Claude Code custom agents (subagents) following official best practices. Use when building new agents or improving existing ones.
when_to_use: Triggers on "エージェント作成", "agent作成", "create agent", "new agent", "エージェント改善".
---

# Agent Creator

Create effective Claude Code custom agents following official best practices and Labee patterns.

## Agent Spec (injected on every invocation)

```!
cat "${CLAUDE_SKILL_DIR}/references/_agent-spec.md" 2>/dev/null || echo "(reference missing: _agent-spec.md)"
```

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

The task tools are opt-in on current models — Claude Code 2.1.233 removed `TaskCreate`/`TaskGet`/`TaskUpdate`/`TaskList` from Opus 4.8, Sonnet 5, Fable 5, Mythos 5 and newer unless `CLAUDE_CODE_ENABLE_TODO_TOOLS=1` is set. When they are unavailable, keep the same phases as a checklist in your responses; do not drop a phase because the tool is missing.

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
| Domain-specific knowledge | WebSearch for relevant tools/APIs |

**Skip when:** Simple agent with clear requirements and no domain research needed.

### Phase 3: Design

Decide these configuration values:

1. **Tools** — See `references/tool-strategy.md` for selection matrix
2. **Model** — omit by default, so the agent inherits the main conversation's model. Pin only when a cheaper model is deliberately enough (e.g. `haiku` for simple/fast lookups). See `references/tool-strategy.md`
3. **Memory** — omit the field. Auto memory is off in Labee's environment (`CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`), so set `memory` only for a project that turns it back on. See `references/tool-strategy.md`
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
- `--model haiku` — Pin a model. Omitted by default, which inherits the session model
- `--tools "Read, Grep, Glob, Bash"` — Tool list
- `--memory user` — Memory scope. Omitted by default, since auto memory is off in Labee's environment

### Phase 5: Write System Prompt

Fill in the generated scaffold following the appropriate pattern from `references/system-prompt-patterns.md`:

**For utility agents:**

1. "You are a {role}." opening
2. "When invoked:" numbered steps (3-5)
3. Checklist or key practices
4. Output format specification
5. Reporting section — see `references/system-prompt-patterns.md` Reporting Convention
6. Closing behavioral principle

**For persona agents:**

1. Identity + company context
2. About You (personality, background, hobbies)
3. Company info
4. Responsibilities (3-6 items)
5. Handling Requests (with characteristic phrases)
6. Domain-specific section
7. Communication Style (tone, catchphrases)
8. Prohibited (3-5 hard boundaries)
9. Reporting section — see `references/system-prompt-patterns.md` Reporting Convention

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
- [ ] `model`: absent unless a pin is justified — an omitted field inherits the session model
- [ ] System prompt: no TODO placeholders remaining
- [ ] System prompt: Reporting section present (plan to `"main"`, one line per milestone, message-and-wait before out-of-brief work; scanning agents distinguish "0 findings" from "not scanned")
- [ ] System prompt: under 200 lines
- [ ] Prohibited section present (for persona agents)

### Phase 7: Test

Suggest 2-3 test tasks to try with the new agent:

```
Use the {agent-name} agent to {test task 1}
```

Claude Code watches `~/.claude/agents/` and `.claude/agents/`, so an edited agent file is picked up within seconds and no restart is needed. Restart only if you just created the first file in an `agents` directory that did not exist when the session started. (The `/agents` wizard was removed in 2.1.198 — agents are edited as files.)

## Reference Files

| File | Load When |
|------|-----------|
| `references/_agent-spec.md` | Injected on every invocation (above) — frontmatter fields, name rules, placement, best practices |
| `references/persona-design.md` | Creating persona/team agents |
| `references/tool-strategy.md` | Deciding tools, permissions, model, memory |
| `references/system-prompt-patterns.md` | Writing or improving system prompts |
