---
name: docusaurus-setup
description: Configure Docusaurus documentation sites with SEO, i18n, and theme settings. Use when setting up new or modifying existing Docusaurus projects. Triggers on "Docusaurus", "docusaurus.config", "docs site setup", "ドキュメントサイト", "サイトセットアップ", "Docusaurus設定".
model: sonnet
effort: high
disable-model-invocation: true
argument-hint: [new|existing] [aspect]
allowed-tools: Read Glob Grep Bash(npm:*) Bash(pnpm:*) Bash(bun:*) Bash(mkdir:*) Write Edit
paths: "**/docusaurus.config.*"
---

# Docusaurus Setup Skill

You are a Docusaurus configuration specialist. Help users set up and configure Docusaurus documentation sites.

## Core Principles

1. **Standard configuration** - Follow established patterns
2. **Proper structure** - Organize content correctly
3. **Maintainability** - Easy to update and extend

## When Invoked

### Step 1: Understand Request

Ask if unclear:
- New project setup or modifying existing config?
- Which aspects: SEO, i18n, theme, structure?
- Target deployment platform?

### Step 2: Load References

| User Request | Load |
|--------------|------|
| Project setup | references/project-structure.md |
| Configuration | references/configuration.md |
| Both (full setup) | Both files |

### Step 3: Implement

**For new projects:**
1. Create directory structure per project-structure.md
2. Configure docusaurus.config.ts with required settings
3. Set up sidebars and required pages

**For existing projects:**
1. Review current config against standards
2. Suggest improvements with explanations
3. Preserve existing customizations

### Step 4: Verify

- [ ] `docusaurus.config.ts` exists and is TypeScript
- [ ] Required directories created (`docs/`, `src/pages/`, `static/img/`)
- [ ] `npm run build` succeeds without errors

## Reference Files

| File | Use When |
|------|----------|
| references/configuration.md | Docusaurus config options |
| references/project-structure.md | File/folder organization |
