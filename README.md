# Standards

## Purpose

Shared standards for Labee LLC projects, distributed as a Claude Code plugin marketplace. Each plugin lives under `plugins/` — browse its `skills/` and `agents/` to see what it carries.

---

## Plugins

| Plugin | Contents |
|--------|----------|
| `labee-core` | Project operating conventions, documentation standards, writing quality, deep research, product definition by verbs, the AI employee agents, and the subagent reporting hook |
| `labee-swift` | Swift and SwiftUI standards — code style, architecture, testing, localization, releases, MCP servers, and the task-to-implementation workflow |
| `labee-marketing` | App Store metadata review across languages, English landing page copy review, and the brand voice they are measured against |
| `labee-authoring` | Creating and improving Claude Code skills and agents |

`labee-swift`, `labee-marketing`, and `labee-authoring` declare `labee-core` as a dependency, so installing any of them pulls it in.

---

## Installation

```bash
# Add marketplace
/plugin marketplace add LabeeHive/standards

# Install what the project needs — labee-core comes along with any of the others
/plugin install labee-swift@labee-standards
/plugin install labee-marketing@labee-standards
/plugin install labee-authoring@labee-standards

# Or install the foundation on its own
/plugin install labee-core@labee-standards
```

A plugin activates immediately when that is safe (Claude Code 2.1.221 and later); otherwise run `/reload-plugins`.

`labee-core` registers one hook, defined entirely in `hooks/hooks.json` with no script file: a `SubagentStart` hook that adds the standard reporting instructions (send a plan to main, one line per milestone, ask before going outside the brief, write the result to a file) to every subagent's context before its first prompt. It has no dependency beyond `printf`. To turn it off, disable the plugin or remove the hook from `/hooks`.

---

## Updates

Re-run the install command — since Claude Code 2.1.232 it refreshes the marketplace first:

```bash
/plugin install labee-core@labee-standards
```

On earlier versions, refresh the marketplace first, then install again to pick up the refreshed version:

```bash
/plugin marketplace update labee-standards
/plugin install labee-core@labee-standards
```

---

## Ideas not shipped

Mechanisms that were measured or discussed and deliberately left out. Each is worth revisiting under the condition named.

- **`SubagentStop` hook that refuses the stop (exit 2) until the final message names a result file.** Verified to work. Consider it if briefs keep coming back without the file they were told to write.
- **Plan approval by an advisor pass instead of the user, in swift-workflow Phase 4.** Consider it once the advisor is enabled and reliable here — it needs the Anthropic API and the Fable/Opus pairing.
- **A markdownlint custom rule against hard-wrapped paragraphs.** Consider it if wrapped prose keeps reappearing despite the written rule.
- **Skill evals via the official skill-creator plugin.** Consider it when a skill's triggering or output needs a measured before/after comparison rather than a judgement call.
- **A Stop-time verification gate that requires tests or a build to have run.** Consider it per project, where the build command is known and stable — not plugin-wide.
