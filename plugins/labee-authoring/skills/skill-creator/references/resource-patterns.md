# Resource Patterns

Guidelines for organizing skill resources: scripts/, references/, assets/.

## Directory Decision Matrix

| Directory | Purpose | Context Cost | Use When |
|-----------|---------|--------------|----------|
| scripts/ | Execute code | Output only | Deterministic, repeatable operations |
| references/ | Read into context | Full file | Documentation Claude needs to understand |
| assets/ | Use in output | On-demand | Templates, images, binary files |

**Delete unused directories.** Most skills need only 1-2 of these.

---

## scripts/

### When to Use

| Use scripts/ | Don't use scripts/ |
|--------------|-------------------|
| Deterministic operations | Claude needs to modify logic |
| Repeated execution expected | One-time exploratory task |
| Token efficiency matters | Simple operation (< 10 lines) |
| Complex multi-step automation | - |

### Language Selection

**Default: TypeScript with Bun**

Bun executes TypeScript natively without transpilation.

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/validate.ts input.json
```

| Language | Use When |
|----------|----------|
| TypeScript (bun) | Default choice |
| Python | Required library has no JS equivalent |
| Bash | Simple file/git operations |

### Bun Usage Guidelines

**✓ Recommended:**

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/example.ts        # Direct TypeScript execution
bun ${CLAUDE_SKILL_DIR}/scripts/example.ts --flag # With arguments
```

**⚠ Use with caution:**

```bash
bunx tsc --noEmit             # Type checking (acceptable)
bunx prettier --write .       # Dev tools (acceptable)
```

**✗ Avoid in CI/production scripts:**

```bash
bunx some-cli-tool            # Exit code issues (GitHub #26674)
```

**Known bunx issues:**

- May silently swallow exit codes (CI failures go undetected)
- Requires network even for cached packages
- Use `bun` direct execution instead when possible

### Security: Dependency Policy

**Prefer self-contained scripts** using only:

- Language built-ins
- Bun standard APIs

**If external dependencies required:**

1. Include `package.json` with **exact versions**
2. Include `bun.lock` (lockfile)
3. Document why the dependency is needed
4. Prefer established packages (>1M weekly downloads)

**These leave a script that breaks on someone else's machine:**

- Dynamic package installation at runtime
- Unpinned dependency versions
- Packages from unknown sources

### Implementation Pattern

```typescript
#!/usr/bin/env bun
/**
 * Brief description of what this script does.
 *
 * Usage:
 *   bun <skill-dir>/scripts/example.ts <input> [--option value]
 *
 * Examples:
 *   bun <skill-dir>/scripts/example.ts data.json
 *   bun <skill-dir>/scripts/example.ts data.json --format pretty
 */

import { parseArgs } from "util";

function main() {
  const { positionals, values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      format: { type: "string", default: "json" },
    },
    allowPositionals: true,
  });

  if (positionals.length < 1) {
    console.error("Usage: bun <skill-dir>/scripts/example.ts <input>");
    process.exit(1);
  }

  // Processing logic
  const result = process(positionals[0]);

  // Output to stdout (consumed by Claude)
  console.log(JSON.stringify(result, null, 2));
}

main();
```

**Requirements:**

- Shebang: `#!/usr/bin/env bun`
- Usage documentation at top
- Exit codes: 0 = success, 1 = failure
- Errors to stderr, results to stdout

### Referencing in SKILL.md

Always prefix script paths with `${CLAUDE_SKILL_DIR}` — Claude Code substitutes it with the skill's directory at invocation, so the command works regardless of the current working directory. A cwd-relative `bun scripts/...` breaks when the skill runs inside another project and invites improvised workarounds.

```markdown
Run the validation script:
`bun ${CLAUDE_SKILL_DIR}/scripts/validate.ts <input.json>`

If validation fails, fix the errors and retry.
```

Note: this works only in SKILL.md content (where substitution happens). Inside script source code or shell strings, write `<skill-dir>` as a plain placeholder.

### Output Format

Choose format based on **who consumes the output**:

| Consumer | Format | Rationale |
|----------|--------|-----------|
| Claude (reads and acts) | Raw text | Claude reads human-readable output directly. No parsing needed, no bugs from format mismatches. |
| Another script | JSON | Structured data for programmatic consumption. |

**Default to raw text.** Only use JSON when another script must parse the output.

### Context Efficiency

Scripts execute **without loading code into context**. Only output consumes tokens.

| Approach | Tokens Used |
|----------|-------------|
| Inline code in SKILL.md | Code + output |
| Script execution | Output only |

---

## references/

### When to Use

| Use references/ | Don't use references/ |
|-----------------|----------------------|
| Detailed documentation | Executable logic |
| API specs, schemas | Simple instructions |
| Domain knowledge | Content < 50 lines (put in SKILL.md) |
| Optional context | Always-needed content |

### Naming Conventions

| Pattern | Meaning |
|---------|---------|
| `_filename.md` | Applies to every invocation — SKILL.md injects it with a `` ```! `` block |
| `filename.md` | Situational — SKILL.md says when to read it |

**There is no auto-load mechanism.** Invoking a skill delivers `SKILL.md` and nothing else; reference content never arrives on its own. So a `_` file is injected into the body by dynamic context injection: Claude Code runs the command before the body is sent to the model, and the file content lands inline.

````markdown
## Core Rules (injected on every invocation)

```!
cat "${CLAUDE_SKILL_DIR}/references/_core-rules.md" 2>/dev/null || echo "(reference missing: _core-rules.md)"
```
````

Put the block near the top of the body, right after the intro. The injected command needs no `allowed-tools` entry — injection runs before the body reaches the model and does not go through the tool-permission path at all (measured on Claude Code 2.1.233, in both default and auto mode), and this repository does not set `allowed-tools` on any skill.

**Why injection instead of an instruction.** "Read `references/_core-rules.md` first" is a request the model may or may not act on, and content that applies to every invocation cannot depend on that. Injection puts the content in front of the model before it starts, so there is nothing to skip.

**Costs and limits:**

- Every invocation pays the tokens, so use it only for files that genuinely apply every time. Keep them under 200 lines.
- A non-zero exit from an injected command aborts the whole invocation — hence `2>/dev/null || echo "(reference missing: ...)"`, which keeps a missing file visible instead of fatal.
- The inline form `` !`command` `` must start at line start or after whitespace; for multi-line output use the fenced ```` ```! ```` form above.
- Injection does not run in claude.ai-synced skills, or when `disableSkillShellExecution` is set. A skill that must work there needs the content in the body itself.
- Subagents receive only what their brief carries. When a SKILL.md hands a checklist to a reviewer agent, it still has to tell that agent to read the `_` file.

### Structure

```
references/
├── _core-rules.md    # Injected into SKILL.md every invocation (keep it small)
├── api.md            # Situational
└── schemas.md        # On-demand
```

---

## assets/

### When to Use

Files used **in output**, not for Claude's understanding:

- Templates (pptx, docx)
- Images, icons, fonts
- Boilerplate code/projects
- Configuration templates

### Structure

```
assets/
├── template.pptx
├── logo.png
└── boilerplate/
    └── ...
```

---

## Degrees of Freedom

Match resource type to operation risk (see workflows.md):

| Freedom | Resource Choice | Example |
|---------|-----------------|---------|
| Low (fragile) | scripts/ with exact commands | PDF form filling |
| Medium | scripts/ with parameters | Validation with options |
| High | references/ with guidelines | Code style suggestions |
