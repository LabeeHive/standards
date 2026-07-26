# Research Report Template

## Structure

```markdown
# [Topic] 調査レポート

## Summary
- Finding 1
- Finding 2
- Finding 3

## Evidence

### [Sub-question 1]

**Finding:** [Specific finding]

**Sources:**
- [Source 1 Title](url) - "relevant quote or detail"
- [Source 2 Title](url) - "relevant quote or detail"

**Confidence:** High/Medium/Low

### [Sub-question 2]
...

## Contradictions

| Claim | Source A | Source B | Resolution |
|-------|----------|----------|------------|
| X works | Issue #123 says yes | Blog says no | Issue is more recent, trust it |

## Gaps

- Could not verify: [specific claim]
- No sources found for: [topic]
- Blocked access to: [source]

## Recommendation

Based on evidence:
1. [Actionable recommendation]
2. [Alternative if applicable]

## Sources

### Tier A (High Trust)
- [Official Doc](url)
- [GitHub Issue with official response](url)

### Tier B (Medium Trust)
- [Zenn Article](url)
- [Stack Overflow](url)

### Tier C (Low Trust - for context only)
- [Reddit thread](url)
```

## Confidence Levels

| Level | Criteria |
|-------|----------|
| High | 2+ Tier A/B sources agree, no contradictions |
| Medium | 1 Tier A/B source OR multiple Tier C agree |
| Low | Only Tier C/D sources OR contradictions exist |

## Anti-Patterns (AVOID)

### Bad: URL dump

```
Found these results:
- https://example.com/1
- https://example.com/2
- https://example.com/3
```

### Good: Extracted evidence

```
**Finding:** The `skills` array in marketplace.json is ignored.

**Evidence:**
- [Issue #13344](url): "Claude Code scans entire source directory, ignoring skills array filter"
- [Issue #14549](url): Confirmed by 5 users, 33 upvotes, status: Open since Dec 2025
- [mhattingpete/claude-skills-marketplace](url): Uses separate source directories as workaround
```

### Bad: Surface summary

```
This article talks about Claude Code skills and how to set them up.
```

### Good: Specific extraction

```
From [Zenn article by @username](url):
- Workaround: Use `source: "./skills/[name]"` instead of `source: "./"`
- Tested on v2.1.19, confirmed working
- Limitation: Requires restructuring existing plugins
```
