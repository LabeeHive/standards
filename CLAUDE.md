# Standards - AI Context

Shared standards repository for Labee LLC projects. Install as a Claude Code plugin marketplace to use skills across your projects.

---

## Skills

This repository provides skills for Claude Code. Use `/skill-name` to invoke.

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
| `/docusaurus-i18n` | Localize Docusaurus pages (Translate wrapping, translation, build) |
| `/automation-config` | Configure automation tools (Renovate) |
| `/vigilare-task` | Create Vigilare tasks with proper structure |
| `/commit-message` | Generate commit messages (conventional commits) |
| `/today` | Show today's calendar events and tasks |
| `/humanizer` | Remove AI writing patterns from text |
| `/labee-llc-guide` | Labee brand voice, tone, and messaging context |
| `/lp-review` | Review English LP copy (messaging, naturalness, SEO) |
| `/aso-review` | Review App Store metadata across 14+ languages |
| `/agent-creator` | Create Claude Code custom agents |

---

## Agents

AI employees for Labee LLC. Available as custom agents when this plugin is installed.

| Agent | Role | Name |
|-------|------|------|
| `labee-pr-sns-ruka` | PR & SNS | 広瀬 瑠華 (Hirose Ruka) |
| `labee-pmm-fujimoto-ren` | Product Marketing | 藤本 蓮 (Fujimoto Ren) |
| `labee-pr-media` | PR & Media | 白石 結月 (Shiraishi Yuzuki) |
| `labee-marketing-seo` | SEO & Blog | 高橋 陽菜 (Takahashi Hina) |
| `labee-marketing-aso` | App Store Optimization | 佐藤 翔太 (Sato Shota) |
| `labee-marketing-analyst` | Data Analytics | 中村 理沙 (Nakamura Risa) |
| `labee-dev-apm` | APM & Performance | 山田 健一 (Yamada Kenichi) |

---

## Structure

```text
agents/
├── labee-pr-sns-ruka.md        # PR & SNS (Hirose Ruka)
├── labee-pmm-fujimoto-ren.md   # Product Marketing (Fujimoto Ren)
├── labee-pr-media.md           # PR & Media (Shiraishi Yuzuki)
├── labee-marketing-seo.md      # SEO & Blog (Takahashi Hina)
├── labee-marketing-aso.md      # App Store Optimization (Sato Shota)
├── labee-marketing-analyst.md  # Data Analytics (Nakamura Risa)
└── labee-dev-apm.md            # APM & Performance (Yamada Kenichi)
skills/
├── documentation/       # Documentation writing standards
├── swift-development/   # Swift and SwiftUI coding standards
├── swift-release/       # Swift app release workflow
├── swift-localization/  # Swift app localization
├── swift-mcp-server/    # MCP server implementation
├── github-workflow/     # GitHub Issues and PR standards
├── repository-setup/    # Repository setup standards
├── docusaurus-setup/    # Docusaurus configuration standards
├── docusaurus-i18n/     # Docusaurus page localization
├── automation-config/   # Automation (Renovate) standards
├── vigilare-task/       # Vigilare task creation standards
├── commit-message/      # Commit message generation
├── today/               # Daily overview (calendar + tasks)
├── humanizer/           # Remove AI writing patterns
├── labee-llc-guide/     # Labee brand voice and messaging context
├── lp-review/           # English LP copy review (team-based)
├── aso-review/          # App Store metadata review (14+ languages)
└── agent-creator/       # Create Claude Code custom agents
```

---

## Culture

We value: **もっと自由に、もっと楽しく** (More freedom, more fun)

### Principles

1. **Freedom with responsibility** - Act freely. Own the results.
2. **Be open** - Share openly. Explain your reasoning.
3. **Involve others** - Work together. Bring others in.

For AI agents:
- When uncertain, ask before proceeding
- Always explain your reasoning
- One question is cheaper than one wrong assumption

---

## Rules

### Use skills

Invoke the appropriate skill for the task at hand.

### Follow existing patterns

Match the style and structure of existing documents in this repository.

### Keep it simple

Document only what is necessary. Avoid duplication and over-explanation.

### Priority labels

Use P1/P2/P3 priority labels in section headings. See `README.md` for definitions.

---

## Language

- Respond in user's language
- Think in English
- Write documentation in English
