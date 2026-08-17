# Setup

## Purpose

This document provides a checklist for setting up new repositories. Use this as a guide when creating new projects to ensure all standard configurations are in place.

---

## Repository creation

### Initial setup

After creating a new repository, configure these settings immediately.

**Checklist:**

- [ ] Create README.md with project overview
- [ ] Create AGENTS.md for AI context ([guide](../../documentation/references/ai-documentation.md))
- [ ] Add appropriate .gitignore

**Repository settings (GitHub):**

- [ ] Enable "Allow auto-merge"
- [ ] Enable "Automatically delete head branches"

**Verification commands:**

```bash
# Check repository settings
gh api repos/{owner}/{repo} --jq '{
  allow_auto_merge: .allow_auto_merge,
  delete_branch_on_merge: .delete_branch_on_merge
}'
```

---

## Documentation structure

### Create docs directory

Set up internal documentation structure.

**Checklist:**

- [ ] Create `docs/` directory

**Recommended structure:**

```text
project/
├── docs/
│   ├── 00_overview/
│   │   └── README.md
│   └── 01_architecture/
├── src/
└── README.md
```

See [project-conventions/docs-structure.md](../../project-conventions/references/docs-structure.md) for details.

---

## Dependency management

### Configure Renovate

Set up automated dependency updates.

**Checklist:**

- [ ] Create `.github/renovate.json5`
- [ ] Extend organization shared configuration
- [ ] Set assignees

**Template:**

```json5
{
  $schema: 'https://docs.renovatebot.com/renovate-schema.json',
  extends: [
    'github>LabeeHive/.github:default.json5',
  ],
  assignees: ['@your-username'],
}
```

See [automation/renovate.md](../../automation-config/references/renovate.md) for details.

---

## Collaboration

### GitHub templates (optional)

Create templates for issues and pull requests if needed.

**Checklist:**

- [ ] Create `.github/ISSUE_TEMPLATE/` (optional)
- [ ] Create `.github/PULL_REQUEST_TEMPLATE.md` (optional)

**Note:** Templates are optional. Issue and pull request conventions are not covered by a skill; follow whatever the repository already does.

### Saved Replies

Set up review comment labels.

**Checklist:**

- [ ] Configure [GitHub Saved Replies](https://github.com/settings/replies)

Write replies that match the review comments this repository already uses.

---

## Public site (if applicable)

### Docusaurus setup

If the project needs a public-facing website.

**Checklist:**

- [ ] Create `pages/` directory
- [ ] Initialize Docusaurus project
- [ ] Configure SEO (headTags)
- [ ] Configure Google Analytics

Docusaurus setup is not covered by a skill; copy the configuration from an existing Labee site.

---

## Quick reference

### Essential commands

```bash
# Check repository settings
gh api repos/{owner}/{repo} --jq '{
  allow_auto_merge: .allow_auto_merge,
  delete_branch_on_merge: .delete_branch_on_merge
}'
```

### Related documents

| Topic | Document |
|-------|----------|
| Documentation writing | [documentation/](../../documentation/references/) |
| AI context files | [documentation/ai_documentation.md](../../documentation/references/ai-documentation.md) |
| Renovate | [automation/renovate.md](../../automation-config/references/renovate.md) |
| Swift | [swift-core](../../swift-core/), [swift-architecture](../../swift-architecture/), [swift-ui](../../swift-ui/), [swift-testing](../../swift-testing/) |

---

## References

- [GitHub Docs - Creating a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
- [GitHub Docs - Repository Settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features)
