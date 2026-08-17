---
name: repository-setup
description: Set up new repositories following Labee standards. Use this when initializing a new project repository. User-invoked only via /repository-setup.
disable-model-invocation: true
argument-hint: [project-type]
---

# Repository Setup

Create a repository following Labee standards. `references/setup.md` holds the full checklist.

## Workflow

1. **Gather** — repository name and owner (org or personal), visibility, and project type (Swift app, Node.js, generic). The project type drives the .gitignore and the docs layout.
2. **Load** `references/setup.md`.
3. **Create** — README.md, AGENTS.md, and a project-appropriate .gitignore for every project. Add `docs/` and `.github/renovate.json5` where they apply.
4. **Configure GitHub**

   ```bash
   gh repo edit --enable-auto-merge --delete-branch-on-merge
   ```

5. **Report** — what was created, which GitHub settings were applied, and what is left for the user to do. Pushing the initial commit is the user's call, not this skill's.

## Reference Files

| File | Load When |
|------|-----------|
| references/setup.md | Setting up any new repository — full checklist and per-type variations |
