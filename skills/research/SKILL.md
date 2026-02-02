---
name: research
description: Conduct deep research with multi-source verification and parallel investigation. Use for technical investigation, root cause analysis, and comprehensive comparison. Triggers on "調査して", "深掘りして", "research", "investigate", "徹底的に調べて".
model: opus
context: fork
agent: general-purpose
allowed-tools: Read, Glob, Grep, WebSearch, WebFetch, Bash(gh:*), Bash(curl:*), Task
---

# Deep Research

Conduct thorough, multi-source investigation with verification.

## Core Principles

1. **No claim without evidence** - Every assertion needs a source
2. **Parallel execution** - Launch multiple searches simultaneously
3. **Source triangulation** - Critical claims need 2+ independent sources
4. **Actually read content** - Don't just list URLs, extract information
5. **Follow the chain** - Issues reference other issues, follow them

## CRITICAL: Minimum Search Requirements

**You MUST perform at least 7+ parallel searches covering these source types:**

| Source Type | Required | Example Query |
|-------------|:--------:|---------------|
| Official docs | ✓ | `site:developer.apple.com` |
| GitHub Issues | ✓ | `gh search issues "topic"` |
| Zenn | ✓ | `site:zenn.dev` |
| Qiita | ✓ | `site:qiita.com` |
| Stack Overflow | ✓ | `site:stackoverflow.com` |
| Reddit | ○ | `site:reddit.com` |
| note.com | ○ | `site:note.com` |

**After searching, you MUST WebFetch at least 3 relevant results to actually read content.**

**DO NOT:**
- Do only 2-3 searches and call it done
- Skip Japanese sources
- Skip reading actual content

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
│ Task(subagent_type="Explore", prompt="Find related code patterns")  │
└─────────────────────────────────────────────────────────────────────┘
```

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

### Phase 4: Triangulate

For critical findings:
- Verify with 2+ independent sources
- If sources cite the same origin → count as 1 source
- Document contradictions explicitly

### Phase 5: Synthesize

Structure findings:
1. **Summary** - Key findings in 3-5 bullets
2. **Evidence** - Detailed findings with sources
3. **Contradictions** - Conflicting information and resolution
4. **Gaps** - What couldn't be verified
5. **Recommendation** - Based on evidence

## Blocked Sources

Do NOT use (will fail):
- Medium (authentication required)
- Authenticated services (Google Docs, Confluence, Jira)

## Quality Checklist (MANDATORY)

**Before marking research complete, verify ALL:**

- [ ] Performed 7+ parallel searches in single message
- [ ] Included official docs (Apple/Google/etc.)
- [ ] Included Japanese sources (Zenn, Qiita)
- [ ] Included community sources (SO, Reddit)
- [ ] Used gh command for GitHub Issues
- [ ] WebFetch'd at least 3 results to actually read
- [ ] Extracted specific quotes/code, not just summaries
- [ ] Followed reference chains
- [ ] Documented contradictions if any
- [ ] Verified critical claims with 2+ sources

**If any checkbox is unchecked, GO BACK and complete it.**
