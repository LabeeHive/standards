# Localization Principles

Core principle: **Localize, don't translate.**

Metadata must read as if a native speaker wrote it from scratch for their local market.

## "Translated Feel" Detection Checklist

Flag any locale where:

1. Subtitle reads as a translated phrase, not a natural local expression
2. Description opens with feature list instead of local-style benefit statement
3. Source-language sentence structure leaks through (e.g., JP word order in EN text)
4. Formality level mismatches locale norms (too formal or too casual)
5. Idioms are literally translated instead of replaced with local equivalents
6. Keywords are translated rather than locally researched

## Language-Agnostic AI Patterns

Detect these regardless of language:

- Excessive formality where casual tone fits the app category
- Uniform sentence length / monotonous rhythm
- Source-language structure bleeding through word order
- Generic filler phrases where specifics belong
- Keyword stuffing disguised as natural text

## Per-Language Red Flags

### Japanese (ja)
- Casual tone OK for consumer apps
- Noun-ending sentences are natural (体言止め)
- Avoid keigo (敬語) in consumer app metadata
- Natural: 「チームのタスクと時間をまとめて管理」
- Unnatural: 「タスクを管理することができます」

### Korean (ko)
- Avoid overly formal -습니다 endings for consumer apps
- Use casual/friendly register: -해요 or noun endings
- 할 일 (casual) preferred over 작업 (formal/technical)
- Natural: 「할 일, 한눈에 정리」
- Unnatural: 「작업을 관리할 수 있습니다」

### Chinese Simplified (zh-Hans)
- Short punchy phrases preferred
- Four-character idioms (成语) add punch when appropriate
- Avoid 书面语 (written/formal register) in consumer apps
- Natural: 「轻松搞定每日待办」
- Unnatural: 「任务管理和时间跟踪」

### German (de)
- Direct and precise, avoid marketing fluff
- "du" form for consumer apps (Deine, not Ihre)
- Address user directly
- Natural: 「Deine Aufgaben und Zeit im Griff」
- Unnatural: 「Verwaltet Aufgaben und Zeit」

### Spanish (es)
- Tu form for consumer apps (avoid usted)
- Warm but not excessive
- Natural: 「Organiza tus tareas a tu manera」
- Unnatural: 「Gestione sus tareas de manera eficiente」

### French (fr)
- Slightly more formal than EN, but not stiff
- Avoid heavy anglicisms where French equivalents exist
- Natural: 「Tes tâches, bien organisées」
- Unnatural: 「Gérez vos tâches de manière comprehensive」
