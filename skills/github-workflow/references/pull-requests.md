# Pull requests

## Purpose

This document defines standards for writing pull request descriptions. Clear PR descriptions speed up code review, preserve context for future reference, and improve team collaboration.

---

## Title - P1

### Write descriptive titles

The title should summarize the change in a way that makes sense in a commit history.

**Rules:**
- Use imperative mood ("Add...", "Fix...", "Update...")
- Be specific about what changed
- Keep under 72 characters when possible
- Optionally prefix with type (feat, fix, docs, refactor, test, chore)

**✅ Good:**

```text
Fix overflow bug in user profile modal
Add dark mode support to settings page
feat: implement OAuth2 authentication
refactor: extract validation logic into separate module
```

**❌ Bad:**

```text
Bug fix
Update
WIP
Changes
```

---

## Description structure - P1

### Start with the purpose

Begin the description with a clear statement of purpose. This helps reviewers understand the intent immediately.

**Patterns:**

```markdown
This PR fixes...
This PR adds...
This PR refactors...
This PR updates...
```

### What and why

Every PR description should answer two questions:

| Question | Content |
|----------|---------|
| **What** | What changes are included in this PR |
| **Why** | Why these changes are necessary |

The "why" is often more important than the "what" because the code shows what changed, but not the reasoning behind it.

**Example:**

```markdown
## Summary

This PR adds rate limiting to the public API endpoints.

## Why

We've observed abuse patterns where some clients make excessive requests,
degrading performance for other users. Rate limiting protects the service
and ensures fair usage.

## Changes

- Add rate limiting middleware using token bucket algorithm
- Configure limits: 100 requests per minute for authenticated users
- Add rate limit headers to responses (X-RateLimit-*)
- Return 429 status when limit exceeded
```

---

## Linking issues - P1

### Connect PRs to issues

Always link the related issue when one exists. This creates traceability and can auto-close issues.

**Auto-closing keywords:**

```markdown
Closes #123
Fixes #456
Resolves #789
```

**For multiple issues:**

```markdown
Closes #123, closes #456
```

**When not closing an issue:**

```markdown
Related to #123
Part of #456
```

---

## Visual changes - P1

### Include screenshots for UI changes

When the PR includes visual changes, screenshots or recordings help reviewers understand the impact.

**Rules:**
- Show before and after when modifying existing UI
- Use screen recordings for interaction changes
- Annotate to highlight key changes

**Example:**

```markdown
## Screenshots

### Before
![Old profile page](./before.png)

### After
![New profile page with dark mode](./after.png)
```

---

## Testing - P1

### Describe how to test

Help reviewers verify the changes by providing clear testing instructions.

**Include:**
- Steps to test the change manually
- Any setup required
- Expected outcomes

**Example:**

```markdown
## How to test

1. Enable dark mode in Settings > Appearance
2. Navigate to Profile page
3. Verify all text is readable and contrast is sufficient
4. Toggle back to light mode and verify styling returns to normal

## Automated tests

- Added unit tests for theme switching logic
- Added snapshot tests for dark mode variants
```

---

## Review comments - P1

### Use comment labels

Prefix review comments with labels to clarify intent and reduce misunderstandings. This helps authors understand the severity and required action for each comment.

**Required labels:**

| Label | Meaning | Action required |
|-------|---------|-----------------|
| **MUST** | Critical issue that must be fixed | Yes, blocking |
| **IMO** | Personal opinion or suggestion | No, author decides |
| **ASK** | Question seeking clarification | Response required |
| **NITS** | Minor nitpick (style, naming, etc.) | No, optional |
| **GOOD** | Praise for well-written code | No |
| **MEMO** | Informational note for reference | No |

### Format

Use GitHub Saved Replies with badge images for visual clarity:

**Example comment:**

```markdown
![must-badge](https://img.shields.io/badge/review-must-red.svg)

This function doesn't handle null input and will crash.
```

### Setting up Saved Replies

Register these templates in [GitHub Saved Replies](https://github.com/settings/replies) for quick access during code review.

**Templates:**

| Label | Template |
|-------|----------|
| ASK | `![ask-badge](https://img.shields.io/badge/review-ask-yellowgreen.svg)` |
| GOOD | `![good-badge](https://img.shields.io/badge/review-good-brightgreen.svg)` |
| IMO | `![imo-badge](https://img.shields.io/badge/review-imo-orange.svg)` |
| MEMO | `![memo-badge](https://img.shields.io/badge/review-memo-lightgrey.svg)` |
| MUST | `![must-badge](https://img.shields.io/badge/review-must-red.svg)` |
| NITS | `![nits-badge](https://img.shields.io/badge/review-nits-green.svg)` |

Add a blank line after the badge, then write your comment.

### When to use each label

**MUST** - Use for:
- Bugs or incorrect behavior
- Security vulnerabilities
- Breaking changes without migration
- Violations of critical coding standards

**IMO** - Use for:
- Alternative approaches you prefer
- Suggestions that improve but aren't required
- Personal style preferences beyond team standards

**ASK** - Use for:
- Understanding design decisions
- Clarifying unclear code
- Confirming assumptions

**NITS** - Use for:
- Typos and minor naming issues
- Formatting preferences not caught by linters
- Minor style suggestions

**GOOD** - Use for:
- Acknowledging good patterns
- Recognizing improvements
- Encouraging team members

**MEMO** - Use for:
- Sharing related context
- Pointing to similar code elsewhere
- Future considerations (not for this PR)

---

## Work in progress - P2

### Mark incomplete PRs clearly

When opening a PR for early feedback or to run CI, mark it clearly as work in progress.

**Options:**
- Use draft PR feature (preferred)
- Add `[WIP]` or `[Draft]` prefix to title
- State clearly in description what's not ready

**Example:**

```markdown
## Status

This is a draft PR for early feedback on the approach.

### Done
- [x] Basic implementation
- [x] Unit tests

### Todo
- [ ] Integration tests
- [ ] Documentation
- [ ] Error handling edge cases
```

---

## Feedback requests - P2

### Be explicit about what you need

Tell reviewers what kind of feedback you're looking for.

**Examples:**

```markdown
## Feedback requested

- Is this the right approach for handling authentication?
- Any concerns about the database schema changes?
- cc @security-team for security review
```

**Types of review:**

| Type | Description |
|------|-------------|
| Quick look | Just sanity check, low risk change |
| Technical review | Deep dive into implementation approach |
| Design review | Feedback on architecture or patterns |
| Security review | Check for vulnerabilities |

---

## Size and scope - P2

### Keep PRs focused

Small, focused PRs are easier to review and less likely to introduce bugs.

**Guidelines:**
- One logical change per PR
- Aim for under 400 lines of changes
- Split large features into incremental PRs
- Separate refactoring from feature changes

**When a PR is too large:**

```markdown
This PR is part of a larger effort to migrate to the new API.

See the tracking issue #123 for the full plan.

Previous: #120 (database schema)
This: API endpoints
Next: #125 (frontend integration)
```

---

## Self-review checklist - P2

### Review before requesting review

Before requesting review, check your own PR:

**Checklist:**
- [ ] Code compiles and tests pass
- [ ] No unintended changes included
- [ ] PR description is complete
- [ ] Relevant issue is linked
- [ ] Screenshots added (if UI change)
- [ ] No secrets or sensitive data committed

---

## After review - P3

### Respond to all comments

Address every review comment, either by making the change or explaining why not.

**Response patterns:**

```markdown
Done in abc1234

Good catch, fixed!

I considered this, but chose the current approach because...
Let me know if you'd like to discuss further.
```

### Keep the conversation moving

- Respond promptly to review feedback
- Re-request review after addressing comments
- Use "Resolve conversation" when addressed

---

## References

- [Google Engineering Practices - CL Descriptions](https://google.github.io/eng-practices/review/developer/cl-descriptions.html)
- [GitHub Blog - How to write the perfect pull request](https://github.blog/2015-01-21-how-to-write-the-perfect-pull-request/)
- [Graphite - GitHub PR Description Best Practices](https://graphite.com/guides/github-pr-description-best-practices)
- [Conventional Comments](https://conventionalcomments.org/)
- [Google Engineering Practices - How to write code review comments](https://google.github.io/eng-practices/review/reviewer/comments.html)
