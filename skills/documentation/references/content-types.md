# Content types

## Purpose

This document provides templates and guidelines for different types of documentation. Each content type serves a specific purpose and follows a particular structure to best serve its audience.

This guide uses the [Diátaxis framework](https://diataxis.fr/) to categorize documentation into four types: tutorials, how-to guides, reference, and explanation.

---

## Documentation types overview

| Type | Purpose | Oriented to | Example |
|------|---------|-------------|---------|
| **Tutorial** | Learning | Learning by doing | "Getting started with the API" |
| **How-to guide** | Problem-solving | Achieving a goal | "How to implement authentication" |
| **Reference** | Information | Looking up facts | "API endpoint reference" |
| **Explanation** | Understanding | Deeper knowledge | "How the caching system works" |

---

## README - P1

README files introduce a project or directory. They should help readers quickly understand what the project does and how to get started.

### Template

```markdown
# Project name

Brief description of what this project does (1-2 sentences).

## Features

- Feature 1
- Feature 2
- Feature 3

## Quick start

### Prerequisites

- Requirement 1
- Requirement 2

### Installation

[Installation steps]

### Usage

[Basic usage example]

## Documentation

- [Getting started guide](docs/getting_started.md)
- [API reference](docs/api_reference.md)
- [Contributing](CONTRIBUTING.md)

## License

[License name] - see [LICENSE](LICENSE) for details.
```

### Guidelines

- Keep the description concise (1-2 sentences)
- Prioritize getting users started quickly
- Link to detailed documentation rather than including everything
- Include prerequisites and installation steps
- Provide a minimal usage example

---

## Changelog - P1

Changelogs document notable changes between versions. Follow the [Keep a Changelog](https://keepachangelog.com/) format.

### Template

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New feature description

### Changed

- Modification to existing feature

### Deprecated

- Feature that will be removed in future

### Removed

- Feature that was removed

### Fixed

- Bug fix description

### Security

- Security-related fix

## [1.0.0] - 2025-01-15

### Added

- Initial release features
```

### Guidelines

- Use semantic versioning (MAJOR.MINOR.PATCH)
- Group changes by type (Added, Changed, Deprecated, Removed, Fixed, Security)
- Write entries from the user's perspective
- Keep entries concise but informative
- Link to issues or pull requests when relevant

---

## API reference - P1

API reference documentation provides comprehensive information about APIs, endpoints, parameters, and responses.

### Template

```markdown
# API reference

## Purpose

This document provides reference documentation for the [API name] API.

Base URL: `https://api.example.com/v1`

---

## Authentication

All requests require authentication using Bearer tokens.

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com/v1/resource
```

---

## Endpoints

### Get resource

Retrieves a resource by ID.

**Request**

```
GET /resources/{id}
```

**Parameters**

| Name | Type | In | Required | Description |
|------|------|-----|----------|-------------|
| `id` | string | path | Yes | Resource ID |
| `include` | string | query | No | Related resources to include |

**Response**

```json
{
  "id": "abc123",
  "name": "Example",
  "created_at": "2025-01-15T10:30:00Z"
}
```

**Status codes**

| Code | Description |
|------|-------------|
| 200 | Success |
| 404 | Resource not found |
| 401 | Unauthorized |

---

### Create resource

Creates a new resource.

**Request**

```
POST /resources
```

**Body**

```json
{
  "name": "New resource",
  "type": "example"
}
```

**Response**

```json
{
  "id": "def456",
  "name": "New resource",
  "type": "example",
  "created_at": "2025-01-15T10:30:00Z"
}
```
```

### Guidelines

- Document all endpoints, parameters, and response formats
- Provide request and response examples
- Include authentication requirements
- List all possible status codes and error responses
- Use consistent formatting for all endpoints

---

## How-to guide - P2

How-to guides help users accomplish specific tasks. They are goal-oriented and practical.

### Template

```markdown
# How to [accomplish task]

## Purpose

This guide explains how to [accomplish specific task].

---

## Prerequisites

Before you begin, ensure you have:

- Prerequisite 1
- Prerequisite 2

---

## Steps

### Step 1: [Action]

[Explanation and instructions]

```bash
# Example command or code
```

### Step 2: [Action]

[Explanation and instructions]

### Step 3: [Action]

[Explanation and instructions]

---

## Verification

To verify the task was completed successfully:

1. [Verification step 1]
2. [Verification step 2]

---

## Troubleshooting

### Problem: [Common issue]

**Solution:** [How to resolve]

### Problem: [Another issue]

**Solution:** [How to resolve]

---

## Next steps

- [Related guide 1](related_guide_1.md)
- [Related guide 2](related_guide_2.md)
```

### Guidelines

- Focus on a single, specific task
- Assume the reader knows what they want to accomplish
- Provide step-by-step instructions
- Include verification steps to confirm success
- Add troubleshooting for common issues

---

## Tutorial - P2

Tutorials guide users through a learning experience. They are learning-oriented and take users from start to finish.

### Template

```markdown
# Tutorial: [Learning goal]

## Purpose

In this tutorial, you will learn how to [learning goal]. By the end, you will have [concrete outcome].

**Time required:** Approximately [X] minutes

---

## Prerequisites

- Prerequisite 1
- Prerequisite 2

---

## What you will build

[Description of what the user will create, optionally with screenshot]

---

## Step 1: [First step title]

[Explanation of what we're doing and why]

```python
# Code example
```

[Explain what the code does]

---

## Step 2: [Second step title]

[Explanation of what we're doing and why]

```python
# Code example
```

[Explain what the code does]

---

## Step 3: [Third step title]

[Continue pattern...]

---

## Summary

In this tutorial, you learned:

- Learning outcome 1
- Learning outcome 2
- Learning outcome 3

---

## Next steps

- [Advanced tutorial](advanced_tutorial.md)
- [Related concept explanation](concept_explanation.md)
```

### Guidelines

- Guide users through a complete learning experience
- Start from the beginning (don't assume prior knowledge of this topic)
- Show concrete, working examples
- Explain not just what to do, but why
- Keep a consistent pace throughout
- End with a working result

---

## Explanation - P2

Explanation documents help users understand concepts. They provide background and context.

### Template

```markdown
# [Concept name]

## Purpose

This document explains [concept] and why it matters for [context].

---

## Overview

[High-level introduction to the concept]

---

## How it works

[Detailed explanation of the concept]

### [Sub-concept 1]

[Explanation]

### [Sub-concept 2]

[Explanation]

---

## When to use

[Guidance on when this concept applies]

### Use cases

- Use case 1
- Use case 2

### When not to use

- Anti-pattern 1
- Anti-pattern 2

---

## Comparison

| Approach | Pros | Cons |
|----------|------|------|
| This concept | Pro 1, Pro 2 | Con 1 |
| Alternative | Pro 1 | Con 1, Con 2 |

---

## Further reading

- [Related concept](related_concept.md)
- [External resource](https://example.com)
```

### Guidelines

- Focus on understanding, not tasks
- Provide context and background
- Explain trade-offs and alternatives
- Connect to related concepts
- Use diagrams and examples to illustrate

---

## Architecture Decision Record (ADR) - P3

ADRs document significant architecture decisions with their context and consequences.

### Template

```markdown
# ADR-[number]: [Decision title]

## Status

[Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Context

[What is the issue that we're seeing that is motivating this decision or change?]

## Decision

[What is the change that we're proposing and/or doing?]

## Consequences

### Positive

- [Positive consequence 1]
- [Positive consequence 2]

### Negative

- [Negative consequence 1]
- [Negative consequence 2]

### Neutral

- [Neutral consequence]

## Alternatives considered

### [Alternative 1]

[Description and why it was not chosen]

### [Alternative 2]

[Description and why it was not chosen]
```

### Guidelines

- Document the decision while context is fresh
- Include rejected alternatives
- Be honest about trade-offs
- Link to related ADRs
- Update status when decisions change

---

## Troubleshooting guide - P3

Troubleshooting guides help users diagnose and resolve problems.

### Template

```markdown
# Troubleshooting [topic]

## Purpose

This guide helps you diagnose and resolve common issues with [topic].

---

## Quick diagnostics

Before diving into specific issues, run these checks:

1. [Diagnostic check 1]
2. [Diagnostic check 2]

---

## Common issues

### Issue: [Problem description]

**Symptoms:**
- Symptom 1
- Symptom 2

**Cause:** [Why this happens]

**Solution:**

1. [Step 1]
2. [Step 2]

---

### Issue: [Another problem]

**Symptoms:**
- Symptom 1

**Cause:** [Why this happens]

**Solution:**

1. [Step 1]
2. [Step 2]

---

## Getting help

If you cannot resolve your issue:

1. [Check existing issues](https://github.com/org/repo/issues)
2. [Open a new issue](https://github.com/org/repo/issues/new) with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details
```

### Guidelines

- Organize by symptom, not cause
- Include diagnostic steps
- Provide clear, actionable solutions
- Link to related documentation
- Include guidance for escalation

---

## References

- [Diátaxis documentation framework](https://diataxis.fr/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Google developer documentation style guide](https://developers.google.com/style)
- [Write the Docs - Documentation types](https://www.writethedocs.org/guide/writing/docs-principles/)
