# ARL-Enabled Skill Template

Template for creating skills with Autonomous Refinement Loop capability.

## SKILL.md Template

```yaml
---
name: {skill-name}
description: {WHAT it does}. {WHEN to use}. Supports autonomous quality refinement. Triggers on "{english1}", "{english2}", "{日本語1}".
allowed-tools: Read Glob Grep Write Edit Bash({specific}:*)
---

# {Skill Name}

{Brief description of what this skill does.}

## Core Behavior

This skill uses the **Autonomous Refinement Loop** pattern:
1. Execute the task
2. Verify the result
3. If verification fails: diagnose, fix, and re-verify (up to 3 times)
4. Record learnings in session file

## When Invoked

### Step 1: Initialize Session

Copy session scripts from skill-creator and run init:

```bash
# One-time setup at skill creation (run from the standards repo root):
cp skills/skill-creator/scripts/init_session.ts skills/{skill-name}/scripts/
cp skills/skill-creator/scripts/log_iteration.ts skills/{skill-name}/scripts/
cp skills/skill-creator/scripts/finalize_session.ts skills/{skill-name}/scripts/

# Initialize session (at skill runtime)
bun ${CLAUDE_SKILL_DIR}/scripts/init_session.ts {output-dir}
```

Store the returned `sessionFile` path for subsequent logging.

### Step 2: Gather Requirements

{What information to collect from user or context}

### Step 3: Execute Initial Attempt

{Main task execution - generate output}

### Step 4: Verify (ARL Entry Point)

**Verification method:** {How to verify - command, script, or check}

```bash
{verification command}
```

**Success criteria:**
- [ ] {Criterion 1}
- [ ] {Criterion 2}

**If verification passes:**
1. Log success to session file (append iteration result)
2. Continue to Step 7

**If verification fails:** Continue to Step 5

### Step 5: Diagnose

1. Parse error output
2. Identify category:
   - **syntax**: Parse error, invalid format
   - **logic**: Wrong output, failed assertion
   - **resource**: Missing file, dependency
   - **timeout**: Process killed, hung

3. Check session file for similar past failures
4. Determine fix strategy

Log to session file:
```markdown
## Iteration {N}

**Attempt:** {what was tried}

**Verification:**
- Status: FAIL
- Error: {error message}
- Category: {category}

**Diagnosis:** {what went wrong}
```

### Step 6: Refine and Re-verify

Apply fix based on diagnosis, then return to Step 4.

**Max iterations:** 3

**If max reached:**
1. Finalize session as failed
2. Report to user with:
   - What was attempted
   - All errors encountered
   - Recommended manual action

### Step 7: Finalize Session

Update session file summary:
- Set `Final status` to SUCCESS or FAILED
- Add elapsed time
- Record key learnings under `### Key Learnings`
- Add recommendations under `### Recommendations`

### Step 8: Report

{Final output format to user}

## Verification Details

### Method

{Detailed description of verification approach}

### Success Criteria

| Criterion | How to Check | Required |
|-----------|--------------|:--------:|
| {Criterion 1} | {Check method} | Yes |
| {Criterion 2} | {Check method} | Yes |
| {Criterion 3} | {Check method} | No |

### Common Failures

| Error Pattern | Category | Typical Fix |
|---------------|----------|-------------|
| {Error 1} | syntax | {Fix approach} |
| {Error 2} | logic | {Fix approach} |
| {Error 3} | resource | {Fix approach} |

## Reference Files

| File | Load When |
|------|-----------|
| references/{domain}.md | {When to load} |

## Session File Location

```
{output-dir}/.session-{timestamp}.md
```

Session files record:
- Each iteration's attempt and result
- Diagnoses and fixes applied
- Key learnings for future reference
```

## Directory Structure

```
{skill-name}/
├── SKILL.md                      # Main skill with ARL workflow
├── references/
│   └── {domain-specific}.md      # Domain knowledge
└── scripts/
    ├── verify.ts                 # Custom verification script (optional)
    ├── init_session.ts           # Session init helper (optional, copy from skill-creator)
    ├── log_iteration.ts          # Iteration logger (optional, copy from skill-creator)
    └── finalize_session.ts       # Session finalizer (optional, copy from skill-creator)
```

**Note:** Session management can be done inline (as shown in the template) or using helper scripts copied from `skill-creator/scripts/`.

## Custom Verification Script Template

If the skill needs custom verification logic:

```typescript
#!/usr/bin/env bun
/**
 * Verify {skill-name} output.
 *
 * Usage:
 *   bun <skill-dir>/scripts/verify.ts <output-path> [options]
 *
 * Exit codes:
 *   0 - All checks passed
 *   1 - Verification failed (see stderr for details)
 */

import { parseArgs } from "util";
import { existsSync, readFileSync } from "fs";

interface VerificationResult {
  passed: boolean;
  checks: Array<{
    name: string;
    passed: boolean;
    error?: string;
  }>;
  summary: string;
}

function verify(outputPath: string): VerificationResult {
  const checks: VerificationResult["checks"] = [];

  // Check 1: Output exists
  const exists = existsSync(outputPath);
  checks.push({
    name: "output_exists",
    passed: exists,
    error: exists ? undefined : `Output not found: ${outputPath}`,
  });

  if (!exists) {
    return {
      passed: false,
      checks,
      summary: "Output file does not exist",
    };
  }

  // Check 2: {Custom check}
  // const content = readFileSync(outputPath, "utf-8");
  // checks.push({
  //   name: "custom_check",
  //   passed: /* condition */,
  //   error: /* error if failed */,
  // });

  // Add more checks as needed...

  const allPassed = checks.every((c) => c.passed);
  const failedCount = checks.filter((c) => !c.passed).length;

  return {
    passed: allPassed,
    checks,
    summary: allPassed
      ? `All ${checks.length} checks passed`
      : `${failedCount}/${checks.length} checks failed`,
  };
}

function main() {
  const { positionals, values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      json: { type: "boolean", short: "j" },
      help: { type: "boolean", short: "h" },
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length < 1) {
    console.error(`Usage: bun <skill-dir>/scripts/verify.ts <output-path> [--json]

Arguments:
  output-path   Path to the output to verify

Options:
  --json, -j    Output as JSON (for programmatic use)
  --help, -h    Show this help message
`);
    process.exit(values.help ? 0 : 1);
  }

  const result = verify(positionals[0]);

  if (values.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Verification: ${result.passed ? "PASSED" : "FAILED"}`);
    console.log(`Summary: ${result.summary}`);
    console.log("\nChecks:");
    for (const check of result.checks) {
      const status = check.passed ? "✓" : "✗";
      console.log(`  ${status} ${check.name}`);
      if (check.error) {
        console.log(`    Error: ${check.error}`);
      }
    }
  }

  process.exit(result.passed ? 0 : 1);
}

main();
```

## Checklist for ARL-Enabled Skills

Before finalizing:

### Core Requirements
- [ ] No `model` / `effort` / `context` / `agent` in frontmatter
- [ ] Session initialization step included
- [ ] Verification criteria defined and automatable
- [ ] Max iterations specified (recommend 3)
- [ ] Diagnosis categories mapped to fix strategies

### Error Handling
- [ ] Each error category has a fix approach
- [ ] Same-error-twice exit condition defined
- [ ] Failure report includes actionable next steps
- [ ] Session file location documented

### Quality
- [ ] Verification can run without human input
- [ ] Fixes are different each iteration (no blind retry)
- [ ] Learnings are captured in session file
- [ ] Common failures documented with solutions
