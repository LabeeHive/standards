---
name: obsidian-note
description: Create and append notes in Obsidian vault using the official CLI. Use when saving ideas, research, or knowledge to Obsidian. Triggers on "メモして", "Obsidianに書いて", "ノート作成", "note to obsidian", "save note", "メモ追加", "書き留めて".
model: sonnet
allowed-tools: Bash(obsidian:*)
argument-hint: [note content or topic]
---

# Obsidian Note

Create and manage notes in the user's Obsidian vault via the `obsidian` CLI.

**Out of scope:** Daily notes, MOC (Maps of Content) notes. Do not create or modify these automatically. If the user asks for a daily note, suggest using Obsidian's daily note feature directly.

## Vault Conventions

### Folder Structure

Folders separate notes by **type**, not topic. Tags and links handle topic classification.

| Folder | Purpose | When |
|--------|---------|------|
| `Inbox/` | Unsorted notes | Default. When unsure where it belongs. |
| `Notes/` | Permanent knowledge (flat) | Ideas, research, technical references |
| `Projects/<name>/` | Active project notes | Clearly tied to a specific project |
| `Archive/` | Retired notes | Never place notes here directly. User moves notes here manually. |

### Properties

- `context` — organizational context: `labee`, `tang3cko`, or `solo`
- `project` — project name (only when applicable): `vigilare`, `chimr`, `reactive-so`, etc.

### Tags

Nested tags for classification and status. Lowercase kebab-case, singular form.

```
#type/idea    #type/reference    #type/meeting    #type/log
#status/inbox    #status/active    #status/done
```

Check existing tags before creating new ones:

```
obsidian tags sort=count
```

### File Naming

Use unique, descriptive names. The name should work well with Quick Switcher (Cmd+O).

## Workflow

### Step 0: Verify CLI

```
obsidian search query="test" limit=1
```

If this fails, stop and inform the user that Obsidian CLI is not available. They need Obsidian running with CLI enabled.

### Step 1: Determine Note Metadata

From the conversation context, decide:

1. **Title** — Descriptive, unique. Use the language natural to the content.
2. **Folder** — `Inbox/` by default. `Notes/` for clear permanent knowledge. `Projects/<name>/` for project-specific.
3. **Tags** — At least one `#type/*` tag. Add `#status/inbox` for notes that need further processing.
4. **Properties** — Set `context` if clearly identifiable. Set `project` if applicable.

### Step 2: Check for Duplicates

```
obsidian search query="<relevant keywords>" limit=5
```

If a related note exists, ask the user: append to existing or create new?

### Step 3: Create or Append

**Create new note:**

```
obsidian create name="<Title>" path=<Folder>/
```

Then set all properties:

```
obsidian properties:set file="<Title>" context=<context>
obsidian properties:set file="<Title>" project=<project>
obsidian properties:set file="<Title>" tags="type/idea, status/inbox"
```

Then write the body:

```
obsidian append file="<Title>" content="# <Title>\n\n<body content>"
```

**Append to existing note:**

Only append content. Do not modify existing properties or tags.

```
obsidian append file="<Note Name>" content="\n\n## <Section Title>\n\n<additional content>"
```

### Step 4: Confirm

Report to the user: note title, location, and tags.

## Examples

**Example 1: Quick idea capture**

User: "ハムスターの放置ゲームのアイデアをメモして"

```
obsidian search query="ハムスター" limit=3
obsidian create name="ハムスター放置ゲーム" path=Notes/
obsidian properties:set file="ハムスター放置ゲーム" context=solo
obsidian properties:set file="ハムスター放置ゲーム" tags="type/idea, status/inbox"
obsidian append file="ハムスター放置ゲーム" content="# ハムスター放置ゲーム\n\n<idea content>"
```

**Example 2: Append research to existing note**

User: "さっきの調査結果をSwift Metal ECSのノートに追記して"

```
obsidian search query="Swift Metal ECS" limit=3
obsidian append file="Swift Metal Unified Memory ECS Library" content="\n\n## 追加調査\n\n<research content>"
```

**Example 3: Project-specific note**

User: "Vigilareのアーキテクチャ決定をメモしておいて"

```
obsidian create name="アーキテクチャ決定ログ" path=Projects/vigilare/
obsidian properties:set file="アーキテクチャ決定ログ" context=labee
obsidian properties:set file="アーキテクチャ決定ログ" project=vigilare
obsidian properties:set file="アーキテクチャ決定ログ" tags="type/reference, status/active"
obsidian append file="アーキテクチャ決定ログ" content="# アーキテクチャ決定ログ\n\n<content>"
```
