---
name: research
description: Conduct deep research with multi-source verification and parallel investigation. Use for technical investigation, root cause analysis, and comprehensive comparison.
when_to_use: Triggers on "調査して", "深掘りして", "research", "investigate", "徹底的に調べて".
allowed-tools: Read Glob Grep WebSearch WebFetch Bash(cat:*) Bash(gh:*) Bash(curl:*) Agent SendMessage
argument-hint: "[research topic]"
---

# Deep Research

Conduct thorough, multi-source investigation with verification.

## Source Patterns (injected on every invocation)

```!
cat "${CLAUDE_SKILL_DIR}/references/_source-patterns.md" 2>/dev/null || echo "(reference missing: _source-patterns.md)"
```

## Core Principles

1. **No claim without evidence** - Every assertion needs a source
2. **Parallel execution** - Launch multiple searches simultaneously
3. **Deep verification** - Verify the source, then verify its source (裏取りの裏取り)
4. **Freshness matters** - Check dates, prefer recent info, be skeptical of old content
5. **Actually read content** - Don't just list URLs, extract information
6. **Follow the chain** - Issues reference other issues, follow them

## Source coverage

Cover these source types, running the searches in parallel in a single message. Japanese sources are part of the sweep, not an optional extra:

| Source Type | Required | Example Query |
|-------------|:--------:|---------------|
| Official docs | ✓ | `site:developer.apple.com` |
| GitHub Issues | ✓ | `gh search issues "topic"` |
| Zenn | ✓ | `site:zenn.dev` |
| Qiita | ✓ | `site:qiita.com` |
| Stack Overflow | ✓ | `site:stackoverflow.com` |
| Reddit | ○ | `site:reddit.com` |
| note.com | ○ | `site:note.com` |

Then WebFetch and read at least three of the substantive results — a list of URLs is not research, and a search result page is not content.

WebSearch has a per-session cap (200 by default), so scale the sweep to the question and budget across the whole session rather than re-running every source for each sub-question.

## Execution Protocol

### Phase 1: Scope

Ask user (if unclear):

- What specifically needs to be investigated?
- What decision will this inform?
- Any known constraints (time range, sources to include/exclude)?

### Phase 2: Plan

1. Decompose into 3-7 sub-questions
2. Identify source types needed:
   - GitHub Issues/PRs/Discussions
   - Official documentation
   - Japanese tech blogs (Zenn, Qiita, note.com)
   - English resources (Reddit, Stack Overflow)
   - Repository code/structure

3. Plan search queries for each source type

### Phase 3: Retrieve (PARALLEL)

**CRITICAL: Execute ALL searches in a single message with multiple tool calls.**

```
┌─────────────────────────────────────────────────────────────────────┐
│ SINGLE MESSAGE - ALL THESE IN PARALLEL:                             │
├─────────────────────────────────────────────────────────────────────┤
│ WebSearch(query="topic site:developer.apple.com")                   │
│ WebSearch(query="topic site:zenn.dev")                              │
│ WebSearch(query="topic site:qiita.com")                             │
│ WebSearch(query="topic site:stackoverflow.com")                     │
│ WebSearch(query="topic site:reddit.com")                            │
│ Bash(gh search issues "topic" --limit 10)                           │
│ Agent(subagent_type="Explore", prompt="Find related code patterns") │
└─────────────────────────────────────────────────────────────────────┘
```

**Brief contents for the `Explore` agent:** where to put the result (a file path once it runs past a few lines), the output format, what a complete answer covers, and what is out of scope; the reporting lines (plan to main, one line per milestone, message-and-wait before going outside the brief, results to a file) are appended to every brief by this plugin's `hooks/hooks.json`.

### Phase 3.5: Deep Read (PARALLEL)

**After getting search results, ACTUALLY READ the content:**

```
┌─────────────────────────────────────────────────────────────────────┐
│ SINGLE MESSAGE - READ TOP RESULTS:                                  │
├─────────────────────────────────────────────────────────────────────┤
│ WebFetch(url="top result from Apple docs")                          │
│ WebFetch(url="top result from Zenn")                                │
│ WebFetch(url="top result from Qiita")                               │
│ Bash(gh issue view 123 --repo owner/repo)                           │
└─────────────────────────────────────────────────────────────────────┘
```

**For each result:**

1. Extract specific information, not summaries
2. Note contradictions between sources
3. Follow references to related issues/articles

### Phase 4: Deep Verification

**Level 1: Claim verification**

- Find the claim in multiple sources

**Level 2: Source verification**

- Who wrote it? What's their expertise?
- Is it official documentation or blog speculation?
- Do other experts cite this source?

**Level 3: Origin verification**

- Where did this information originate?
- Is the blog just paraphrasing official docs?
- If sources cite the same origin → count as 1 source

**Example:**

```
Claim: "SwiftUI @Observable is better than @ObservableObject"
  ↓ Level 1: Found in Zenn article
  ↓ Level 2: Author is iOS engineer, cites WWDC23
  ↓ Level 3: Check WWDC23 session directly → Confirmed by Apple
  → Verified: 2 independent paths (Zenn → WWDC, Apple docs → WWDC)
```

### Phase 4.5: Freshness Check

**ALWAYS check information age:**

| Age | Action |
|-----|--------|
| < 6 months | Trust with normal verification |
| 6-12 months | Verify still current, check for updates |
| 1-2 years | Be skeptical, search for newer info |
| > 2 years | Assume outdated unless confirmed current |

**For each source, note:**

- Publication date
- Last updated date (if available)
- iOS/macOS version it refers to

**Red flags:**

- No date on the article
- References deprecated APIs
- Uses old syntax (e.g., SwiftUI 1.0 patterns)

### Phase 5: Synthesize

Structure findings:

1. **Summary** - Key findings in 3-5 bullets
2. **Evidence** - Detailed findings with sources and dates
3. **Verification chain** - How each critical claim was verified (origin traced)
4. **Freshness notes** - Age of sources, any outdated info flagged
5. **Contradictions** - Conflicting information and resolution
6. **Gaps** - What couldn't be verified
7. **Recommendation** - Based on evidence

## Blocked Sources

Do NOT use (will fail):

- Medium (authentication required)
- Authenticated services (Google Docs, Confluence, Jira)

## Quality checklist

Before reporting, check:

### Search Coverage

- [ ] Searches ran in parallel in one message and covered the source types above
- [ ] Included official docs (Apple/Google/etc.)
- [ ] Included Japanese sources (Zenn, Qiita)
- [ ] Included community sources (SO, Reddit)
- [ ] Used gh command for GitHub Issues

### Deep Reading

- [ ] Fetched and read at least three substantive results
- [ ] Extracted specific quotes/code, not just summaries
- [ ] Followed reference chains

### Verification Depth

- [ ] Traced critical claims to their origin
- [ ] Verified source credibility (who wrote it, their expertise)
- [ ] Checked if multiple sources share same origin

### Freshness

- [ ] Noted publication dates for all sources
- [ ] Flagged information older than 1 year
- [ ] Searched for more recent alternatives to old info
- [ ] Verified old info still applies to current OS/API versions

### Documentation

- [ ] Documented contradictions if any
- [ ] Noted confidence level for each finding

## Reference Files

| File | Load When |
|------|-----------|
| references/_source-patterns.md | Injected on every invocation (above) — gh/curl commands, source quality tiers |
| references/report-template.md | Structuring final research output |
