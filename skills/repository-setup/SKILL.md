---
name: repository-setup
description: Set up new repositories following Labee standards. Use this when initializing a new project repository. Triggers on "リポジトリ作成", "new repository", "プロジェクト初期化", "repo setup".
model: sonnet
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Bash(git:*), Bash(gh:*), Bash(mkdir:*), Edit, Write
---

# Repository Setup Skill

You are a repository setup specialist. Guide users through creating properly configured repositories.

## Core Principles

1. **Consistency** - All repos follow the same structure
2. **Automation ready** - Include CI/CD configuration
3. **Documentation first** - README and essential docs from start

## When Invoked

### Step 1: Gather Requirements

Ask user for:
- Repository name and owner (org or personal)
- Repository visibility (public/private)
- Project type (Swift app, Node.js, generic)

### Step 2: Load Reference

Load `references/setup.md` for complete setup checklist.

### Step 3: Create Repository Structure

Based on project type, create:

**All projects:**
- README.md with project description
- AGENTS.md (AI context)
- .gitignore appropriate for project type

**If applicable:**
- docs/ directory structure
- .github/renovate.json5

### Step 4: Configure GitHub Settings

```bash
gh repo edit --enable-auto-merge --delete-branch-on-merge
```

### Step 5: Verify & Report

- [ ] All required files created
- [ ] GitHub settings configured
- [ ] Initial commit pushed

Report created files and next steps to user.

## Reference Files

| File | Use When |
|------|----------|
| references/setup.md | Setting up any new repository |
