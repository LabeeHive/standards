# Standards

## Purpose

Shared standards for Labee LLC projects, distributed as a Claude Code plugin marketplace. Skills live in `skills/` and AI agents in `agents/` — browse the directories to see what is available.

---

## Installation

```bash
# Add marketplace
/plugin marketplace add LabeeHive/standards

# Install the plugin
/plugin install labee-standards@labee-standards
```

The plugin activates immediately when that is safe (Claude Code 2.1.221 and later); otherwise run `/reload-plugins`.

Along with the skills and agents, the plugin registers one hook, defined entirely in `hooks/hooks.json` as an inline `jq` command with no script file: a `PreToolUse` hook on the Agent tool that appends the standard reporting instructions (send a plan, report each milestone, ask before going outside the brief, write the result to a file) to every subagent brief that does not already carry them. It requires `jq` on PATH. To turn it off, disable the plugin or remove the hook from `/hooks`.

---

## Updates

Re-run the install command — since Claude Code 2.1.232 it refreshes the marketplace first:

```bash
/plugin install labee-standards@labee-standards
```

On earlier versions, refresh the marketplace first:

```bash
/plugin marketplace update labee-standards
```

Then run the install command again to pick up the refreshed version:

```bash
/plugin install labee-standards@labee-standards
```

---

## Ideas not shipped

Mechanisms that were measured or discussed and deliberately left out. Each is worth revisiting under the condition named.

- **`SubagentStop` hook that refuses the stop (exit 2) until the final message names a result file.** Verified to work. Consider it if briefs keep coming back without the file they were told to write.
- **Plan approval by an advisor pass instead of the user, in swift-workflow Phase 4.** Consider it once the advisor is enabled and reliable here — it needs the Anthropic API and the Fable/Opus pairing.
- **A markdownlint custom rule against hard-wrapped paragraphs.** Consider it if wrapped prose keeps reappearing despite the written rule.
- **Skill evals via the official skill-creator plugin.** Consider it when a skill's triggering or output needs a measured before/after comparison rather than a judgement call.
- **A Stop-time verification gate that requires tests or a build to have run.** Consider it per project, where the build command is known and stable — not plugin-wide.
