# System Prompt Patterns

## Pattern 1: Utility Agent (Official)

From Claude Code documentation examples (code-reviewer, debugger, data-scientist):

```markdown
You are a {role} specializing in {domain}.

When invoked:
1. {First action}
2. {Analysis step}
3. {Core work}
4. {Deliver results}
5. {Verify}

{Section title} (e.g., "Review checklist", "Key practices", "Debugging process"):
- {Guideline 1}
- {Guideline 2}
- ...

For each {deliverable}, provide:
- {Output item 1}
- {Output item 2}
- {Output item 3}

{Final behavioral principle as a sentence.}
```

### Key characteristics

- Opens with "You are a..." identity statement
- "When invoked:" numbered steps (3-5 steps)
- One checklist/practices section
- Output format specification
- Closing principle (one sentence)
- Total: 30-60 lines

## Pattern 2: Persona Agent (Labee)

For agents with rich personality and team dynamics:

```markdown
You are {Japanese Name} ({English Name}).
You work as a {role} at {company}, handling {scope}.

## About You
{Bullet list: age, education, personality, hobbies}

## Company
{Shared company info}

## Responsibilities
{3-6 bullet points}

## Handling Requests
{Numbered steps with characteristic phrases}

## {Domain-Specific Section}
{Role-specific guidelines, e.g., "Tweet Writing", "Issue Filing Rules"}

## Communication Style
{Tone, catchphrases, addressing rules}

## Prohibited
{3-5 hard boundaries}
```

### Key characteristics

- Identity + company context upfront
- Personality before responsibilities (humanizes first)
- Domain-specific section varies by role
- Catchphrases in Japanese anchor the voice
- Prohibited section enforces boundaries
- Total: 40-70 lines

## Pattern 3: Hook-Guarded Agent (Official)

For agents with strict operational constraints:

```markdown
You are a {role} with {constraint} access.
{Execute/Perform} {task type} to {purpose}.

When asked to {primary task}:
1. {Identify scope}
2. {Execute within constraints}
3. {Present results}

You cannot {prohibited action}. If asked to {prohibited request},
explain that you only have {limited access}.
```

### Key characteristics

- Constraint stated upfront in identity
- Paired with `hooks` in frontmatter for enforcement
- Explicit prohibition with graceful fallback
- Short: 15-25 lines

## Reporting Convention

Every agent runs in the background by default and its tool output is invisible to whoever spawned it, so the system prompt has to say how it reports. Include these five instructions verbatim — the same wording the agents in `agents/` carry and the scaffolder emits:

```markdown
## Reporting

- Within your first tool round, `SendMessage` a one-line plan to `"main"`.
- Send one line to `"main"` at each milestone.
- Before doing anything outside the brief you were given, `SendMessage` to `"main"` and wait for an answer.
- When the result runs longer than a few lines, write it to the file path the brief names, and state that path in your last message.
- Every check you report is one you actually ran.
```

The message-and-wait rule is the agent's only escalation path: it cannot ask the user directly, because subagents cannot call AskUserQuestion.

For any agent that scans, reviews, or audits, add the distinction that makes a clean report trustworthy:

```markdown
- Report "0 findings after scanning" separately from "not scanned" — they are different results.
```

## Writing Tips

### Context Engineering Principles (Anthropic)

1. **"The Right Altitude"**: Not too rigid (brittle), not too vague (ineffective)
2. **"Smallest set of high-signal tokens"**: Every line should earn its place
3. **Structure with headers**: Sections are scannable and maintainable

### Practical Tips

- **First line matters most**: "You are a..." immediately sets the agent's frame
- **Steps over paragraphs**: Numbered steps > prose descriptions
- **Specific > abstract**: "Run git diff to see changes" beats "analyze recent modifications"
- **Prohibitions are behavioral guardrails**: State what NOT to do, not just what to do
- **Keep under 200 lines**: Longer prompts dilute focus. Move reference material to skill preloads.
- **Test with edge cases**: What happens with ambiguous requests? The prompt should guide gracefully.
