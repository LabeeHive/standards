# Translation Quality Guide

Core principle: **Localize, don't translate.**

Every translation must read as if a native speaker wrote the UI from scratch. Grammatically correct is not enough — it must feel culturally natural.

## UI String Categories

Different string types have different rules:

| Type | Rule | Example (EN source) |
|------|------|---------------------|
| Navigation/Tab labels | Noun form, 1-2 words | "Settings", "Reminders" |
| Button labels | Short imperative or noun | "Save", "Delete", "Add Task" |
| Section headers | Brief, scannable | "General", "Notifications" |
| Descriptions | Natural sentence, benefit-oriented | "Tasks due today" |
| Error messages | Helpful, not robotic | "Couldn't save. Try again." |
| Placeholder text | Casual hint | "Search tasks..." |
| Empty states | Encouraging, not sterile | "No tasks yet. Enjoy the quiet." |

## Per-Language Guidelines

### Japanese (ja)
- Casual tone for consumer apps — avoid keigo
- Noun-ending sentences are natural
- Keep UI labels short (2-4 characters ideal)
- **Bad:** "タスクを削除することができます" (verbose, translated feel)
- **Good:** "削除" (button), "タスクなし" (empty state)
- **Bad:** "設定を管理する" (verb form for tab label)
- **Good:** "設定" (noun form, native)

### Korean (ko)
- Casual/friendly register for consumer apps (-해요 or noun endings)
- Avoid formal -습니다 in UI labels
- 할 일 (casual) over 작업 (formal/technical)
- **Bad:** "설정을 관리합니다" (overly formal for settings tab)
- **Good:** "설정" (simple, native)
- **Bad:** "작업을 삭제하시겠습니까?" (keigo-influenced)
- **Good:** "삭제할까요?" (casual confirmation)

### Chinese Simplified (zh-Hans)
- Short punchy labels preferred
- Avoid written/formal register (书面语) in consumer apps
- Four-character phrases add rhythm when appropriate
- **Bad:** "管理您的提醒事项" (formal, translated feel)
- **Good:** "提醒事项" (native, scannable)
- **Bad:** "请点击此处以添加新的任务" (verbose, translated)
- **Good:** "添加任务" (direct)

### German (de)
- "du" form for consumer apps (dein/deine, not Ihr/Ihre)
- Direct and concise — avoid unnecessary compound nouns
- Address user directly
- **Bad:** "Einstellungen verwalten" (verbose tab label)
- **Good:** "Einstellungen" (direct)
- **Bad:** "Möchten Sie diese Aufgabe wirklich löschen?" (Sie form)
- **Good:** "Aufgabe löschen?" (du-implied, concise)

### Spanish (es)
- Tu form for consumer apps (avoid usted)
- Warm but concise
- **Bad:** "Gestione sus tareas de manera eficiente" (usted, verbose)
- **Good:** "Tus tareas" (casual, direct)
- **Bad:** "Presione aquí para eliminar" (robotic instruction)
- **Good:** "Eliminar" (button label, imperative)

### French (fr)
- Tu form for consumer apps (ton/ta, not votre)
- Slightly more formal than EN, but not stiff
- Avoid anglicisms where French equivalents exist
- **Bad:** "Gérez vos tâches efficacement" (vous form, generic)
- **Good:** "Tes tâches" (casual, direct)
- **Bad:** "Cliquer ici pour supprimer" (robotic)
- **Good:** "Supprimer" (clean button label)

## Common Anti-patterns (All Languages)

1. **Verbose where short works** — UI labels should be 1-3 words, not sentences
2. **Formal register in casual apps** — Match the app's consumer tone
3. **Source-language word order** — Rearrange to feel native
4. **Literal idiom translation** — Use local equivalents
5. **Inconsistent register** — If one screen is casual, all screens should be casual
6. **Translating brand terms** — Keep product names (Chimr, Vigilare) untranslated
