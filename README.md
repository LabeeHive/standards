# Standards

## Purpose

This repository contains shared standards for Labee LLC projects. Install as a Claude Code plugin marketplace to use skills across your projects.

---

## Getting started

**Setting up a new repository?** Use the `/repository-setup` skill or see [skills/repository-setup/references/setup.md](skills/repository-setup/references/setup.md)

---

## Skills

This repository provides skills for Claude Code:

| Skill | Description |
|-------|-------------|
| `/documentation` | Write documentation following Labee standards |
| `/swift-development` | Write Swift/SwiftUI code following standards |
| `/swift-release` | Execute Swift app release workflow with fastlane |
| `/swift-localization` | Manage Swift app localization with xckit |
| `/swift-mcp-server` | Guide MCP server implementation for Swift apps |
| `/github-workflow` | Create GitHub Issues and PRs |
| `/repository-setup` | Set up new repositories |
| `/docusaurus-setup` | Configure Docusaurus sites |
| `/automation-config` | Configure automation tools (Renovate) |
| `/vigilare-task` | Create Vigilare tasks with proper structure |
| `/commit-message` | Generate commit messages (conventional commits) |

---

## Structure

```text
skills/
├── documentation/       # Documentation writing standards
├── swift-development/   # Swift and SwiftUI coding standards
├── swift-release/       # Swift app release workflow
├── swift-localization/  # Swift app localization
├── swift-mcp-server/    # MCP server implementation
├── github-workflow/     # GitHub Issues and PR standards
├── repository-setup/    # Repository setup standards
├── docusaurus-setup/    # Docusaurus configuration standards
├── automation-config/   # Automation (Renovate) standards
├── vigilare-task/       # Vigilare task creation standards
└── commit-message/      # Commit message generation
```

---

## Priority levels

Each standard uses priority levels to indicate importance:

- **P1 (Required)**: Must be followed
- **P2 (Recommended)**: Should be followed when possible
- **P3 (Optional)**: Nice-to-have

---

## Installation

```bash
# Add marketplace
/plugin marketplace add labeehive/standards

# Install a plugin
/plugin install documentation@labee-standards
```

---

## Updates

```bash
# Update marketplace
/plugin marketplace update labee-standards
```
