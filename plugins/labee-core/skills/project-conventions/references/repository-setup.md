# Repository Setup

What a new Labee repository carries from its first commit, and how dependency automation is wired. Everything here is Labee-specific — the parts that only restate GitHub's or Renovate's own documentation are deliberately absent, because upstream owns those and they go stale here.

## New repository baseline

Every repository gets these three files regardless of project type.

| File | Contents |
|------|----------|
| `README.md` | What the project is and how to run it |
| `AGENTS.md` | AI context — `/documentation` owns how it is written |
| `.gitignore` | Matched to the project type (Swift app, Node.js, generic) |

`docs/` is added once the project has documentation to place; its namespaces are `references/docs-structure.md`, not a decision made at setup time.

## GitHub repository settings

Two settings are required, and Renovate's automerge does not work without them.

```bash
gh repo edit --enable-auto-merge --delete-branch-on-merge
```

Verify with:

```bash
gh api repos/{owner}/{repo} --jq '{allow_auto_merge: .allow_auto_merge, delete_branch_on_merge: .delete_branch_on_merge}'
```

Issue and pull request templates, and GitHub Saved Replies, are optional and follow whatever the repository already does.

## Renovate

The organization's Renovate GitHub App is installed org-wide. Individual repositories do not install it.

Configuration lives at `.github/renovate.json5` — JSON5 so that overrides can carry a comment explaining themselves, and under `.github/` so GitHub-related configuration stays together.

```json5
{
  $schema: 'https://docs.renovatebot.com/renovate-schema.json',
  extends: [
    'github>LabeeHive/.github:default.json5',
  ],
  assignees: ['@your-username'],
}
```

Extend the shared config rather than restating its rules. It already sets `config:best-practices` (Docker and GitHub Actions digest pinning, dev-dependency pinning, config migration), the Monday-morning `Asia/Tokyo` schedule, and the monorepo and known-package groupings. Duplicating any of that in a project config means two places to change it.

### Automerge

Automerge is for updates that would be merged without detailed review, and only where automated tests actually gate the merge. A repository without tests reaches for `:skipStatusChecks`, which removes the only thing making automerge safe — treat it as temporary and write down why.

| Update type | Automerge |
|-------------|-----------|
| `patch` | Yes |
| `minor` | Yes |
| `pin` | Yes |
| `digest` | Yes |
| `lockFileMaintenance` | Yes |
| `major` | No — review the changelog and migration guide |

`minimumReleaseAge` is 5 days at minimum and 14 days by preference, which buys time for the community to find problems and for registries to pull malicious packages.

### Overrides

Override the shared config only for a project-specific need — `assignees`/`reviewers`, `ignoreDeps` for a package needing special handling, or `packageRules` for project-specific grouping. Each override carries a comment stating why, because the next person reading it cannot tell a deliberate pin from an abandoned one.

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

## Checklist

- [ ] `README.md`, `AGENTS.md`, and a project-appropriate `.gitignore` exist
- [ ] Auto-merge and delete-branch-on-merge are enabled, and verified by `gh api`
- [ ] `.github/renovate.json5` extends `github>LabeeHive/.github:default.json5` and sets `assignees`
- [ ] Nothing in the project config restates what the shared config already provides
- [ ] Automerge is enabled only where tests gate the merge; any `:skipStatusChecks` says why
- [ ] Every override carries a comment explaining it
