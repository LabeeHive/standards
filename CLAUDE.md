# Standards - AI Context

Shared standards repository for Labee LLC projects. Install as a Claude Code plugin marketplace to use skills across your projects.

Each plugin lives under `plugins/`, with its skills in `skills/` (invoke with `/skill-name`) and its AI employee agents in `agents/` — browse the directories to see what is available. `labee-core` carries the conventions every project needs and the employee agents; `labee-swift`, `labee-marketing`, and `labee-authoring` add a domain on top and depend on it.

A skill belongs to the plugin whose domain it serves, and a file it links to with a relative path must sit inside that same plugin — only the plugin's own directory is copied at install, so a link that climbs above it breaks.

---

## Culture

We value: **もっと自由に、もっと楽しく** (More freedom, more fun)

### Principles

1. **Freedom with responsibility** - Act freely. Own the results.
2. **Be open** - Share openly. Explain your reasoning.
3. **Involve others** - Work together. Bring others in.

For AI agents:

- When uncertain, ask before proceeding
- Always explain your reasoning
- One question is cheaper than one wrong assumption

---

## Rules

### Use skills

Invoke the appropriate skill for the task at hand.

### Follow existing patterns

Match the style and structure of existing documents in this repository.

### Keep it simple

Document only what is necessary. Avoid duplication and over-explanation.

---

## Language

- Respond in user's language
- Think in English
- Write documentation in English
