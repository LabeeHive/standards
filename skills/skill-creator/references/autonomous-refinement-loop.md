# Autonomous Refinement Loop Pattern

Pattern for creating skills that autonomously improve quality without human intervention.

## Overview

The Autonomous Refinement Loop (ARL) enables skills to:
1. **Execute** - Perform the task
2. **Verify** - Check the result against criteria
3. **Diagnose** - Analyze failures and identify fixes
4. **Refine** - Apply corrections automatically
5. **Re-verify** - Confirm the fix worked
6. **Learn** - Record insights for session memory

```
┌─────────────────────────────────────────────────────────────────┐
│                    Autonomous Refinement Loop                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    ┌──────────┐     ┌──────────┐     ┌──────────┐             │
│    │ Execute  │────▶│  Verify  │────▶│  Done?   │──Yes──▶ END │
│    └──────────┘     └──────────┘     └──────────┘             │
│         ▲                                  │ No                │
│         │                                  ▼                   │
│         │           ┌──────────┐     ┌──────────┐             │
│         └───────────│  Refine  │◀────│ Diagnose │             │
│                     └──────────┘     └──────────┘             │
│                          │                                     │
│                          ▼                                     │
│                     ┌──────────┐                               │
│                     │  Learn   │──▶ Session Memory             │
│                     └──────────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## When to Use

| Use ARL | Don't Use ARL |
|---------|---------------|
| Output has verifiable quality criteria | Subjective quality (user preference) |
| Automated verification is possible | Human judgment required |
| Multiple iterations may be needed | Single-shot task |
| Failures are correctable by agent | External dependency failures |

**Good candidates:**
- Slide generation → screenshot verification
- Code generation → test execution
- Documentation → linting/spell-check
- Data transformation → schema validation

**Poor candidates:**
- Creative writing (subjective)
- User preference gathering (needs human)
- External API calls (network failures not fixable)

## Pattern Components

### 1. Verification Mechanism

Define clear, automatable success criteria:

```markdown
## Verification

**Method:** [How to verify]
**Success Criteria:**
- [ ] Criterion 1 (measurable)
- [ ] Criterion 2 (automatable)

**Verification Command:**
`bun ${CLAUDE_SKILL_DIR}/scripts/verify.ts <output>`
```

**Verification Types:**

| Type | Method | Example |
|------|--------|---------|
| Visual | Screenshot comparison | Playwright snapshot |
| Functional | Test execution | pytest, jest |
| Structural | Schema validation | JSON Schema, TypeScript |
| Textual | Lint/format check | ESLint, markdownlint |

### 2. Diagnostic Analysis

When verification fails, diagnose before fixing:

```markdown
## Diagnosis Protocol

**On failure:**
1. Parse error output
2. Identify root cause category:
   - Syntax error → specific line/char
   - Logic error → expected vs actual
   - Resource error → missing file/dependency
3. Check session memory for prior similar failures
4. Determine fix strategy
```

**Diagnostic Categories:**

| Category | Signal | Fix Strategy |
|----------|--------|--------------|
| Syntax | Parse error, line number | Direct edit at location |
| Logic | Wrong output, test failure | Re-analyze requirements |
| Resource | File not found, import error | Create/install missing |
| Timeout | Process killed | Simplify or split task |
| Unknown | No clear error | Log and escalate |

### 3. Refinement Strategy

Apply fixes based on diagnosis:

```markdown
## Refinement Rules

**Priority order:**
1. Specific fix (known pattern) → Apply directly
2. Similar past fix (session memory) → Adapt and apply
3. General strategy → Try common solutions
4. Escalate → Ask user after max attempts

**Max iterations:** 3-5 (configurable)
**Backoff:** None (each attempt should be different)
```

### 4. Session Learning

Record learnings for current session:

```markdown
## Session Learning

**File:** `{output_dir}/.session-{timestamp}.md`
**Format:**
\```markdown
# Session: {skill-name} - {timestamp}

## Iteration 1
- **Action:** [What was attempted]
- **Result:** [Pass/Fail]
- **Error:** [If failed, error details]

## Iteration 2
- **Action:** [What was changed]
- **Result:** [Pass/Fail]
- **Learning:** [What worked]

## Summary
- **Total iterations:** N
- **Final status:** Success/Failed
- **Key learnings:**
  - [Learning 1]
  - [Learning 2]
\```
```

## SKILL.md Integration

### Workflow with ARL

```markdown
## When Invoked

### Step 1: Gather Input
[Collect requirements]

### Step 2: Execute Initial Attempt
[Perform the main task]

### Step 3: Verify (ARL Entry Point)

Run verification:
`bun ${CLAUDE_SKILL_DIR}/scripts/verify.ts <output>`

**If verification passes:** Continue to Step 6
**If verification fails:** Continue to Step 4

### Step 4: Diagnose

Analyze the failure:
1. Parse error output
2. Check `.session-*.md` for similar failures
3. Identify fix category (syntax/logic/resource)

### Step 5: Refine and Re-verify

Apply fix based on diagnosis, then return to Step 3.

**Max iterations:** 3
**If max reached:** Report failure with diagnosis to user

### Step 6: Learn

Append to session file:
- What was attempted
- What worked/failed
- Key insights

### Step 7: Report

[Final output to user]
```

### Frontmatter Additions

For ARL-enabled skills:

```yaml
---
name: skill-name
description: ... Triggers on ...
allowed-tools: Read Glob Grep Write Edit Bash(specific:*)
---
```

**Model selection for ARL:**
- Do not pin one. The loop inherits the session's model and effort.
- sonnet: Acceptable if verification is simple and fixes are straightforward

## Reference Implementation Patterns

### From LangGraph (Reflection Pattern)

```
StateGraph:
  START → "graph" (main task)
        → "reflection" (critique)
        → conditional: END or back to "graph"
```

**Key insight:** Use `remaining_steps` to limit iterations.

### From Reflexion (Memory Pattern)

```
Components:
  - Actor: Executes task
  - Evaluator: Judges result
  - Self-Reflection: Generates verbal feedback
  - Memory: Stores reflections across trials
```

**Key insight:** Store reflections as natural language, not just error codes.

### From Self-Refine (Iterative Pattern)

```
Loop:
  1. Generate output (y₀)
  2. Generate feedback on output
  3. Refine based on feedback (y₁)
  4. Check if sufficient
  5. If not, goto 2
```

**Key insight:** Feedback should include both problem localization AND improvement instructions.

## Session Memory Format

### File Location

```
{project_root}/{output_dir}/.session-{YYYYMMDD-HHMMSS}.md
```

Example: `slides/my-presentation/.session-20260203-143022.md`

### Template

```markdown
# Session: {skill-name}
**Started:** {timestamp}
**Task:** {brief description}

---

## Iteration 1

**Attempt:**
{What was generated/executed}

**Verification:**
- Status: FAIL
- Error: {error message}
- Category: {syntax|logic|resource|timeout}

**Diagnosis:**
{Analysis of what went wrong}

---

## Iteration 2

**Attempt:**
{What was changed}

**Verification:**
- Status: PASS

**Learning:**
{What fixed the issue}

---

## Summary

| Metric | Value |
|--------|-------|
| Total iterations | 2 |
| Final status | SUCCESS |
| Time elapsed | 45s |

### Key Learnings

1. **Pattern:** {Problem} → {Solution}
2. **Pattern:** {Problem} → {Solution}

### Recommendations

- {Future improvement suggestion}
```

## Exit Conditions

### Success Exit

```markdown
**Exit when:**
- All verification criteria pass
- Output meets quality threshold

**Action:**
1. Write final output
2. Append success to session file
3. Report to user
```

### Failure Exit

```markdown
**Exit when:**
- Max iterations reached (default: 3)
- Unrecoverable error detected
- Same error repeats 2+ times

**Action:**
1. Append failure analysis to session file
2. Report to user with:
   - What was attempted
   - What failed
   - Recommended manual action
```

### Escalation Criteria

| Condition | Action |
|-----------|--------|
| Same error 2x | Stop loop, report pattern |
| Unknown error category | Stop loop, ask user |
| External dependency failure | Stop loop, report dependency |
| Timeout exceeded | Stop loop, suggest simplification |

## Anti-Patterns

### Infinite Loop Risk

**Bad:**
```markdown
If fails, try again.
```

**Good:**
```markdown
If fails:
1. Diagnose (must identify different fix)
2. Apply fix (must be different from previous)
3. Re-verify
4. If same error, exit with report
```

### Blind Retry

**Bad:**
```markdown
On error, regenerate from scratch.
```

**Good:**
```markdown
On error:
1. Preserve working parts
2. Identify specific failure point
3. Fix only the failing part
4. Retain context from previous attempt
```

### Silent Failure

**Bad:**
```markdown
After 3 attempts, return best effort.
```

**Good:**
```markdown
After 3 attempts:
1. Report all attempts and their failures
2. Explain why each fix didn't work
3. Suggest manual intervention path
```

## Quality Checklist

Before marking an ARL-enabled skill complete:

- [ ] Verification criteria are automatable
- [ ] Diagnosis categories are defined
- [ ] Max iterations specified
- [ ] Session file location defined
- [ ] Exit conditions documented
- [ ] Escalation path clear
- [ ] Anti-patterns avoided
