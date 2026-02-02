# Issues

## Purpose

This document defines standards for writing GitHub issues. Well-written issues improve communication, reduce back-and-forth, and help track work effectively.

---

## Before creating an issue - P1

### Search for existing issues

Before creating a new issue, search the repository to check if a similar issue already exists. If found, add a comment to the existing issue instead of creating a duplicate.

### Choose the right type

Determine whether your issue is a:

| Type | Description |
|------|-------------|
| Bug | Something is broken or not working as expected |
| Feature | Request for new functionality |
| Enhancement | Improvement to existing functionality |
| Question | Clarification needed about behavior or design |

---

## Title - P1

### Write clear, specific titles

The title should be descriptive enough that someone can understand the issue without reading the description.

**Rules:**
- Use imperative mood ("Add...", "Fix...", "Update...")
- Be specific about what and where
- Keep it concise but informative

**✅ Good:**

```text
Fix login button not responding on Safari
Add dark mode toggle to settings page
Update user profile validation to accept international phone numbers
```

**❌ Bad:**

```text
Bug
Login doesn't work
Please fix
Feature request
```

---

## Description - P1

### Bug reports

For bug reports, include the following information:

**Required elements:**

| Element | Description |
|---------|-------------|
| Expected behavior | What should happen |
| Actual behavior | What actually happens |
| Steps to reproduce | Numbered steps to recreate the issue |
| Environment | OS, browser, version, etc. |

**Example:**

```markdown
## Expected behavior

Clicking the "Submit" button should save the form and show a success message.

## Actual behavior

The button becomes unresponsive after the first click. No error message is displayed.

## Steps to reproduce

1. Navigate to Settings > Profile
2. Change any field value
3. Click "Submit"
4. Observe the button becomes disabled but nothing happens

## Environment

- OS: macOS 14.0
- Browser: Safari 17.0
- App version: 2.1.0
```

### Feature requests

For feature requests, explain the problem and proposed solution:

**Required elements:**

| Element | Description |
|---------|-------------|
| Problem | What problem are you trying to solve |
| Proposed solution | How you think it should be solved |
| Alternatives | Other solutions you considered (optional) |

**Example:**

```markdown
## Problem

Users frequently ask how to export their data, but there's no export functionality.

## Proposed solution

Add an "Export" button in Settings that generates a CSV file of user data.

## Alternatives considered

- JSON export (less user-friendly for non-technical users)
- PDF report (more complex to implement)
```

---

## Visual evidence - P2

### Screenshots and recordings

Include visual evidence when applicable:

**Rules:**
- Attach screenshots for UI bugs
- Use screen recordings (GIF/video) for interaction issues
- Annotate images to highlight the problem area
- Include error messages in full

**Example:**

```markdown
## Screenshot

![Error state on submit button](./images/submit_error.png)

The red outline shows where the error occurs.
```

---

## Labels and metadata - P2

### Use labels consistently

Apply appropriate labels to help with triage and filtering:

| Label category | Examples |
|----------------|----------|
| Type | `bug`, `feature`, `enhancement`, `question` |
| Priority | `priority:high`, `priority:medium`, `priority:low` |
| Status | `needs-triage`, `blocked`, `ready` |
| Area | `frontend`, `backend`, `docs` |

### Link related issues

Reference related issues to provide context:

```markdown
Related to #123
Blocks #456
Depends on #789
```

---

## Scope - P2

### Keep issues focused

Each issue should represent a single, discrete unit of work.

**Rules:**
- One issue per problem or feature
- Break large features into smaller, manageable issues
- Avoid mixing unrelated changes

**✅ Good:**

```text
Issue 1: Add email validation to signup form
Issue 2: Add password strength indicator
Issue 3: Add terms of service checkbox
```

**❌ Bad:**

```text
Issue 1: Improve signup form (add validation, password indicator, terms checkbox, redesign layout, add social login...)
```

---

## Maintenance - P3

### Update issue status

Keep issues up to date as work progresses:

- Add comments when starting work
- Update with progress or blockers
- Close with a reference to the fixing PR

**Closing with PR reference:**

```markdown
Fixed in #234
```

Or in the PR description:

```markdown
Closes #123
Fixes #456
```

---

## References

- [GitHub Community - Best Practices for Writing Effective GitHub Issues](https://github.com/orgs/community/discussions/147722)
- [Tilburg Science Hub - Best Practices for GitHub Issues Management](https://tilburgsciencehub.com/topics/automation/version-control/start-git/write-good-issues/)
