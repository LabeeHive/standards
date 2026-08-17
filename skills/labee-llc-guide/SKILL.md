---
name: labee-llc-guide
description: Labee LLC brand guide with voice, tone, and messaging context. Use when writing marketing copy, reviewing brand consistency, or providing company context.
when_to_use: Triggers on "brand voice", "ブランド", "Labee", "ラビー", "トーン", "brand guide".
---

# Labee LLC Guide

Shared brand and company context for all Labee agents and skills.

## Brand Voice (injected on every invocation)

```!
cat "${CLAUDE_SKILL_DIR}/references/_brand-voice.md" 2>/dev/null || echo "(reference missing: _brand-voice.md)"
```

## Company Identity

- **Name:** ラビー合同会社 (Labee LLC)
- **Location:** Yokohama, Japan (横浜線沿線)
- **ビジョン:** もっと自由に、もっと楽しく。 (More freedom, more fun.)
- **2026年のテーマ:** 人間もAIも使える、同じツール
- **Mission:** テクノロジーとデザインの力で、あなたのビジネスに新しい価値を創造します。
- **Values:** Freedom, sharing joy, simplicity, honesty in technology
- **How Labee works:** proximity and speed (近さと速さ), direct engineer engagement, flexibility

Three levels, often confused. The **Vision** is the standing identity and never changes with the calendar. The **2026 theme** is this year's work toward it: one tool that a human drives through a GUI and an AI drives through conversation, reaching the same data and the same functions. 「人間とAIが並んで働く」 names the future that theme is aiming at — it describes the destination, not the Vision, so do not quote it as one.

Source: <https://labee.jp/news/2026-02-09-vision-2026>

## How to Apply

This skill provides context, not a workflow. When loaded:

**Writing new copy:**

1. Use the injected brand voice above — match tone to context (LP, App Store, SNS, docs)
2. Read `references/products.md` — get accurate product descriptions and positioning
3. Write content following the voice attributes: direct, confident, approachable, forward-looking

**Reviewing existing content:**

1. Work through the Review Checklist in the injected brand voice above
2. Flag any anti-patterns (corporate speak, startup hype, overly cute, empty confidence)
3. Suggest rewrites that match Labee's voice

**Providing company context:**

1. Use Company Identity above for basic facts
2. Read `references/products.md` for service/product details and messaging principles

## Reference Files

| File | Load When |
|------|-----------|
| references/_brand-voice.md | **Injected on every invocation (above).** Tone spectrum, Good/Bad examples per context, anti-patterns, and review checklist. |
| references/products.md | Describing Labee services or products (Chimr, Vigilare). Contains target audiences, positioning, and messaging principles. |
