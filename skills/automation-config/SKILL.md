---
name: automation-config
description: Configure Renovate and automation tools. Use this when setting up dependency automation. User-invoked only via /automation-config.
disable-model-invocation: true
argument-hint: "[tool-name or question]"
allowed-tools: Read Glob Grep
---

# Automation Config

Renovate and dependency-automation setup. Configurations favour safe defaults and low notification noise — `references/renovate.md` holds the shared config and what it already covers, so check there before writing rules by hand.

## Workflow

1. **Clarify** — new repository or existing config? Which tool (Renovate is the default)? Does the repository have CI and tests? Automerge settings depend on that answer.
2. **Load** `references/renovate.md`. Its Automerge and Noise reduction sections cover most requests.
3. **Configure**
   - *New repository:* explain the prerequisites (repo settings, app installation), give the starter config, and say what the shared config already provides so it is not duplicated.
   - *Existing config:* review it against the standard, suggest improvements with reasons, and preserve existing customizations rather than replacing the file wholesale.
4. **Verify** — valid JSON5, extends the shared config where applicable, automerge settings consistent with whether CI actually gates merges.

## Reference Files

| File | Load When |
|------|-----------|
| references/renovate.md | Any Renovate configuration — shared config, automerge, grouping, noise reduction |
