# Source Patterns

## GitHub Investigation

### Search Issues

```bash
gh search issues "keyword" --repo owner/repo --limit 20 --json number,title,state
```

### Read Issue with Comments

```bash
gh issue view 12345 --repo owner/repo --comments
```

### Search PRs

```bash
gh pr list --repo owner/repo --search "keyword" --state merged --json number,title,mergedAt
```

### Fetch Raw Files

```bash
curl -s "https://raw.githubusercontent.com/owner/repo/main/path/to/file"
```

### List Directory Contents

```bash
gh api repos/owner/repo/contents/path | jq '.[].name'
```

## Japanese Tech Blogs

### Zenn

```
WebSearch(query="keyword site:zenn.dev")
```

- Articles: zenn.dev/username/articles/slug
- Books: zenn.dev/username/books/slug

### Qiita

```
WebSearch(query="keyword site:qiita.com")
```

- Articles: qiita.com/username/items/id

### note.com

```
WebSearch(query="keyword site:note.com")
```

- Articles: note.com/username/n/slug

## English Resources

### Reddit

```
WebSearch(query="keyword site:reddit.com")
```

### Stack Overflow

```
WebSearch(query="keyword site:stackoverflow.com")
```

### Official Docs

```
WebSearch(query="keyword site:docs.example.com")
```

## Parallel Execution Example

```
[Single message with all these tools]
WebSearch(query="Claude Code plugin skills issue site:github.com")
WebSearch(query="Claude Code スキル site:zenn.dev")
WebSearch(query="Claude Code スキル site:qiita.com")
WebSearch(query="Claude Code skills problem reddit")
Bash(command="gh search issues 'plugin skills' --repo anthropics/claude-code --limit 10 --json number,title,state")
Agent(subagent_type="Explore", description="Analyze official docs", prompt="Read Claude Code official documentation about skills and plugins...")
```

## Source Quality Tiers

| Tier | Sources | Trust Level |
|------|---------|-------------|
| A | Official docs, GitHub source code | High |
| B | GitHub Issues (with Anthropic response), Official blogs | High |
| C | Zenn, Qiita (verified authors), Stack Overflow (accepted) | Medium |
| D | Reddit, note.com, personal blogs | Low (verify) |
| E | SEO spam, AI-generated content | Ignore |

## Verification Rules

1. **Critical claims**: 2+ Tier A/B sources
2. **Technical details**: 1 Tier A/B + 1 Tier C
3. **Opinions/trends**: Note the source tier and present it as that source's position
