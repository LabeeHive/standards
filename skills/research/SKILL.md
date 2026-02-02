---
name: research
description: Conduct deep research with multi-source verification and parallel investigation. Use for technical investigation, root cause analysis, and comprehensive comparison. Triggers on "調査して", "深掘りして", "research", "investigate", "徹底的に調べて".
model: opus
context: fork
agent: general-purpose
disable-model-invocation: true
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

**Execute ALL searches in a single message with multiple tool calls:**

```
[Single message]
- WebSearch(query="topic site:github.com issues")
- WebSearch(query="topic site:zenn.dev")
- WebSearch(query="topic site:qiita.com")
- WebSearch(query="topic site:note.com")
- WebSearch(query="topic reddit OR stackoverflow")
- Bash(gh search issues "topic" --repo owner/repo)
- Task(subagent_type="Explore", prompt="Investigate X aspect...")
- Task(subagent_type="Explore", prompt="Investigate Y aspect...")
```

**For each result:**
1. Actually fetch and read the content (WebFetch or gh issue view)
2. Extract specific information, not summaries
3. Note contradictions between sources
4. Follow references to related issues/articles

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

## Quality Checklist

- [ ] Used parallel searches (single message, multiple tools)
- [ ] Actually read content (not just listed URLs)
- [ ] Followed issue chains (duplicates, references)
- [ ] Included Japanese sources (Zenn, Qiita, note)
- [ ] Verified critical claims with 2+ sources
- [ ] Documented contradictions
- [ ] Provided specific evidence, not summaries
