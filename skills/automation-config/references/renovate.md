# Renovate

## Purpose

This document defines standards for using Renovate to automate dependency updates. Following these guidelines ensures consistent, secure, and maintainable dependency management across all projects.

---

## File placement - P1

### Use `.github/renovate.json5`

**Rules:**
- Place configuration file at `.github/renovate.json5`
- Use JSON5 format to allow comments

**Rationale:**
- Keeps GitHub-related configuration in `.github/` directory
- JSON5 allows inline comments for documenting overrides

**Example:**

```text
project/
├── .github/
│   └── renovate.json5    # Renovate configuration
├── src/
└── ...
```

---

## Getting started - P1

### Prerequisites

The organization's Renovate GitHub App is already installed. Individual repositories do not need to install the app separately.

### Repository settings

Ensure the following repository settings are configured for automerge to work:

**Required settings:**
- Allow auto-merge: enabled
- Automatically delete head branches: enabled (recommended)

**Verification commands:**

```bash
# Check if auto-merge is enabled
gh api repos/{owner}/{repo} --jq '.allow_auto_merge'

# Check if delete branch on merge is enabled
gh api repos/{owner}/{repo} --jq '.delete_branch_on_merge'
```

### Creating configuration file

Create `.github/renovate.json5` with the following content:

```json5
{
  $schema: 'https://docs.renovatebot.com/renovate-schema.json',
  extends: [
    'github>LabeeHive/.github:default.json5',
  ],
  assignees: ['@your-username'],
}
```

### For new repositories

When Renovate first detects a repository without configuration, it creates an Onboarding PR titled "Configure Renovate". You can either:

1. Merge the Onboarding PR and then update the configuration
2. Edit the configuration in the `renovate/configure` branch before merging

---

## Basic principles - P1

### Enable Renovate on all repositories

All repositories with dependencies should have Renovate enabled. Automated dependency updates reduce security risks, prevent technical debt accumulation, and ensure timely access to bug fixes and new features.

### Use shared configuration

Extend the organization's shared configuration instead of writing project-specific rules from scratch. This ensures consistency and reduces maintenance overhead.

**✅ Good:**

```json5
{
  $schema: 'https://docs.renovatebot.com/renovate-schema.json',
  extends: [
    'github>LabeeHive/.github:default.json5',
  ],
  assignees: ['@your-username'],
}
```

**❌ Bad:**

```json5
{
  $schema: 'https://docs.renovatebot.com/renovate-schema.json',
  // Duplicating all rules instead of extending shared config
  timezone: 'Asia/Tokyo',
  schedule: ['before 9am on Monday'],
  // ... many more duplicated settings
}
```

### Use `config:best-practices` preset

The organization's shared configuration extends `config:best-practices` instead of `config:recommended`. This preset includes additional security measures such as:

- Docker digest pinning
- GitHub Actions digest pinning
- Development dependency pinning
- Configuration migration

Individual repositories do not need to configure this—it is inherited automatically from the shared configuration.

---

## Automerge - P1

### Enable automerge for low-risk updates

Enable automerge for updates that you would merge without detailed review. This reduces manual effort and keeps dependencies current.

**Recommended automerge targets:**

| Update type | Automerge | Reason |
|-------------|-----------|--------|
| `patch` | Yes | Bug fixes, low risk |
| `minor` | Yes | New features, backward compatible |
| `pin` | Yes | No functional change |
| `digest` | Yes | Security updates for pinned versions |
| `lockFileMaintenance` | Yes | Lowest risk |
| `major` | No | Breaking changes possible |

### Require tests for automerge

Automerge should only be enabled when the repository has automated tests. Without tests, there is no way to verify that updates don't break functionality.

**✅ Good:**

```json5
{
  extends: ['github>LabeeHive/.github:default.json5'],
  // Repository has tests, automerge will work
}
```

**❌ Bad (only when necessary):**

```json5
{
  extends: [
    'github>LabeeHive/.github:default.json5',
    ':skipStatusChecks',  // Use only when no tests exist
  ],
}
```

### Set minimum release age

Wait before automerging to allow time for the community to discover issues with new releases and for registries to remove malicious packages.

| Setting | Minimum | Recommended |
|---------|---------|-------------|
| `minimumReleaseAge` | 5 days | 14 days |

---

## Manual merge workflow - P1

### Review major updates manually

Major version updates often contain breaking changes. Always review the changelog and migration guide before merging.

**Checklist for major updates:**

1. Read the changelog and release notes
2. Check for breaking changes
3. Review migration guide if available
4. Test locally if significant changes
5. Update related code if necessary

### Use Dependency Dashboard for visibility

Enable Dependency Dashboard to get an overview of all pending updates. This creates an issue in the repository that shows:

- Pending updates awaiting action
- Detected problems (deprecated/abandoned packages)
- Previously closed/ignored updates

### Establish team review process

Define clear responsibilities for reviewing and merging dependency updates.

**Example processes:**

| Approach | Description |
|----------|-------------|
| Morning rotation | First developer each morning reviews all open PRs |
| Weekly assignment | One developer is responsible for all updates each week |
| Package ownership | Specific developers own specific dependency categories |

### Regular dependency review

Schedule regular reviews to prevent accumulation of pending updates.

**Recommended frequency:**

| Update type | Review frequency |
|-------------|-----------------|
| Security updates | Immediately |
| Major updates | Weekly |
| Dashboard issues | Weekly |
| Ignored/deferred updates | Monthly |

---

## Overriding shared configuration - P2

### Valid reasons to override

Only override shared configuration when there is a project-specific need.

**Acceptable overrides:**

| Override | When to use |
|----------|-------------|
| `assignees` / `reviewers` | Project-specific team members |
| `:skipStatusChecks` | Repository has no tests (temporary) |
| `ignoreDeps` | Package requires special handling |
| `packageRules` | Project-specific grouping or scheduling |

### Document overrides

When adding project-specific overrides, include comments explaining why.

**✅ Good:**

```json5
{
  extends: ['github>LabeeHive/.github:default.json5'],
  assignees: ['@project-lead'],
  packageRules: [
    {
      // Pin react version until migration to v19 is complete
      matchPackageNames: ['react', 'react-dom'],
      allowedVersions: '<19.0.0',
    },
  ],
}
```

---

## Noise reduction - P2

### Group related packages

Group updates for related packages to reduce the number of PRs.

**Default groupings (via shared config):**

- Monorepo packages (e.g., all `@angular/*` packages)
- Known package groups (e.g., ESLint and plugins)

**Custom grouping example:**

```json5
{
  packageRules: [
    {
      groupName: 'Testing packages',
      matchPackagePatterns: ['^jest', '^@testing-library/'],
    },
  ],
}
```

### Schedule updates appropriately

Schedule updates during low-activity periods to avoid disruption.

**Shared config default:**

- Schedule: Monday morning (before 9am)
- Timezone: Asia/Tokyo

---

## Troubleshooting - P3

### Common automerge issues

| Problem | Solution |
|---------|----------|
| Automerge not working | Check if tests pass, branch protection rules allow it |
| Required reviews blocking | Use `renovate-approve` bot or adjust branch protection |
| CODEOWNERS blocking | Exclude Renovate paths or configure approvals |

### Debugging configuration

Use Renovate's debug logging to troubleshoot configuration issues:

1. Check the Dependency Dashboard for errors
2. Review Renovate's PR descriptions for applied rules
3. Use the [Renovate Config Validator](https://docs.renovatebot.com/config-validation/)

---

## References

- [Renovate Documentation](https://docs.renovatebot.com/)
- [Automerge Configuration](https://docs.renovatebot.com/key-concepts/automerge/)
- [Upgrade Best Practices](https://docs.renovatebot.com/upgrade-best-practices/)
- [Noise Reduction](https://docs.renovatebot.com/noise-reduction/)
- [Dependency Dashboard](https://docs.renovatebot.com/key-concepts/dashboard/)
