---
name: labee-llc-guide
description: Labee LLC brand guide with voice, tone, and messaging context. Use when writing marketing copy, reviewing brand consistency, or providing company context. Triggers on "brand voice", "ブランド", "Labee", "ラビー", "トーン", "brand guide".
model: haiku
allowed-tools: Read, Glob, Grep
---

# Labee LLC Guide

Shared brand and company context for all Labee agents and skills.

## Company Identity

- **Name:** ラビー合同会社 (Labee LLC)
- **Location:** Yokohama, Japan (横浜線沿線)
- **Vision:** 人間とAIが並んで働く未来へ (Toward a future where humans and AI work side by side)
- **Values:** Proximity and speed (近さと速さ), direct engineer engagement, flexibility

## How to Apply

This skill provides context, not a workflow. When loaded:

**Writing new copy:**
1. `references/_brand-voice.md` is auto-loaded — match tone to context (LP, App Store, SNS, docs)
2. Read `references/products.md` — get accurate product descriptions and positioning
3. Write content following the voice attributes: direct, confident, approachable, forward-looking

**Reviewing existing content:**
1. Use the Review Checklist in `references/_brand-voice.md` (auto-loaded)
2. Flag any anti-patterns (corporate speak, startup hype, overly cute, empty confidence)
3. Suggest rewrites that match Labee's voice

**Providing company context:**
1. Use Company Identity above for basic facts
2. Read `references/products.md` for service/product details and messaging principles

## Reference Files

| File | Load When |
|------|-----------|
| references/_brand-voice.md | **Auto-loaded.** Tone spectrum, Good/Bad examples per context, anti-patterns, and review checklist. |
| references/products.md | Describing Labee services or products (Chimr, Vigilare). Contains target audiences, positioning, and messaging principles. |
