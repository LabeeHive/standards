# Setup

## Purpose

This document provides a checklist for setting up new repositories. Use this as a guide when creating new projects to ensure all standard configurations are in place.

---

## Repository creation - P1

### Initial setup

After creating a new repository, configure these settings immediately.

**Checklist:**

- [ ] Create README.md with project overview
- [ ] Create AGENTS.md for AI context ([guide](../documentation/ai_documentation.md))
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

## Documentation structure - P1

### Create docs directory

Set up internal documentation structure.

**Checklist:**

- [ ] Create `docs/` directory
- [ ] Add coding-standards as submodule

**Commands:**

```bash
# Add coding-standards submodule
git submodule add https://github.com/LabeeHive/coding-standards.git docs/standards

# Verify submodule
git submodule status
```

**Recommended structure:**

```text
project/
├── docs/
│   ├── 00_overview/
│   │   └── README.md
│   ├── 01_architecture/
│   └── standards/        # coding-standards submodule
├── src/
└── README.md
```

See [documentation/project_structure.md](../documentation/project_structure.md) for details.

---

## Dependency management - P1

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

See [automation/renovate.md](../automation/renovate.md) for details.

---

## Collaboration - P2

### GitHub templates (optional)

Create templates for issues and pull requests if needed.

**Checklist:**

- [ ] Create `.github/ISSUE_TEMPLATE/` (optional)
- [ ] Create `.github/PULL_REQUEST_TEMPLATE.md` (optional)

**Note:** Templates are optional. The important thing is following the standards in:
- [github/issues.md](../github/issues.md)
- [github/pull_requests.md](../github/pull_requests.md)

### Saved Replies

Set up review comment labels.

**Checklist:**

- [ ] Configure [GitHub Saved Replies](https://github.com/settings/replies)

See [github/pull_requests.md](../github/pull_requests.md#setting-up-saved-replies) for templates.

---

## Public site (if applicable) - P2

### Docusaurus setup

If the project needs a public-facing website.

**Checklist:**

- [ ] Create `pages/` directory
- [ ] Initialize Docusaurus project
- [ ] Configure SEO (headTags)
- [ ] Configure Google Analytics

See [docusaurus/](../docusaurus/) for details.

---

## Quick reference

### Essential commands

```bash
# Clone with submodules
git clone --recurse-submodules <repository-url>

# Initialize submodules in existing clone
git submodule update --init --recursive

# Update coding-standards submodule
git submodule update --remote docs/standards

# Check repository settings
gh api repos/{owner}/{repo} --jq '{
  allow_auto_merge: .allow_auto_merge,
  delete_branch_on_merge: .delete_branch_on_merge
}'
```

### Related documents

| Topic | Document |
|-------|----------|
| Documentation writing | [documentation/](../documentation/) |
| AI context files | [documentation/ai_documentation.md](../documentation/ai_documentation.md) |
| Renovate | [automation/renovate.md](../automation/renovate.md) |
| Issues | [github/issues.md](../github/issues.md) |
| Pull requests | [github/pull_requests.md](../github/pull_requests.md) |
| Docusaurus | [docusaurus/](../docusaurus/) |
| Swift | [swift/](../swift/) |

---

## References

- [GitHub Docs - Creating a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
- [GitHub Docs - Repository Settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features)
- [Git Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
