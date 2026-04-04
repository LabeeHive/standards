---
name: app-verb-theory
description: Define the core experience of an app through verbs to ensure design consistency. Use when designing a new product, auditing existing features, or evaluating feature proposals. Triggers on "動詞理論", "verb theory", "core verb", "コアアクション", "体験設計", "experience design", "コア動詞", "核となる動詞".
model: opus
allowed-tools: Read, Glob, Grep
---

# App Verb Theory Skill

Apply Tajiri's verb theory (game design) to app and web service design. Define the core user experience through verbs and ensure all features serve that core verb.

## Core Principles

1. **One core verb** - Every app has one fundamental action users perform
2. **Verb hierarchy** - All features are verbs that serve the core verb
3. **Consistency** - New features must strengthen, not dilute, the core verb

## When Invoked

1. Read `references/verb-theory.md` for the full framework
2. Based on the user's request, apply one of the following workflows:

### New product

Extract core verb from user needs using the 6-step process (Steps 1-3).

### Existing product

Audit verb consistency across features using the 6-step process (Steps 3-5). Check for anti-patterns: verb proliferation, verb mutation, core contradiction, verb dilution.

### Feature evaluation

Assess if a new feature aligns with the core verb using Step 6. Evaluate reach cost impact.

### Messaging

Derive marketing messages from the core verb using the Marketing Application section. Map: core verb → user fear → positive framing.

## Reference Files

| File | Load When |
|------|-----------|
| references/verb-theory.md | On invoke — full framework, case studies, patterns |
