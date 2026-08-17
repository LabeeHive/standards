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
