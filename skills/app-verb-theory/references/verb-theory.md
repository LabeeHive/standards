# Verb Theory for Apps

## Purpose

This document adapts Satoshi Tajiri's verb theory from game design to app and web service design. It provides a framework for defining, auditing, and maintaining the core experience of a product through verbs.

### Scope and limits

Verb theory diagnoses **inner collapse** — when a product team destroys its own core by adding unrelated verbs. It does NOT diagnose **external erosion** — market commoditization, platform bundling, demand shifts, or business model disruption. These require separate frameworks. A product can maintain a perfect verb structure and still fail if the market moves beneath it.

This applies equally to games: a game with a clear core verb can fail due to market saturation or platform changes, not verb design.

---

## Foundations

### Origin

Satoshi Tajiri (creator of Pokemon) defined games by their core verb. Mario = "jump". Pokemon = "collect" + "trade". The verb drives every design decision.

### Translation to apps

Users have an **impulse** — a recurring frustration or need. The app resolves that impulse through a **core verb**. Every feature in the app is a verb that serves the core verb. Features that introduce unrelated verbs dilute the product.

### Core verb definition

The core verb is NOT the surface-level action (tap, scroll, type). It is the **fundamental desire** the user fulfills repeatedly.

**Example:**
- Surface action: "look at the widget" → Core verb: **confirm** (resolve uncertainty about Japanese era dates)
- Surface action: "type a year and see the result" → Still **confirm** (same impulse, different method)

### Sense of understanding (わかった感)

The feeling of "now I get it." Presenting a single correct answer does not produce this feeling. Comparing multiple candidates does.

**Structure:**
- Single answer → User trusts the source but does not feel they understand
- Multiple candidates with comparison → User sees the differences and arrives at "ah, that's what it means"

**Where it applies:**
- Domains where the answer is not unique: translation, writing, decision support, rephrasing
- Domains where the user must choose a nuance

**Where it does NOT apply:**
- Domains where the answer is unique: calculation, address lookup, inventory check
- In these domains, multiple candidates create confusion rather than understanding

**Design implication:**
When the core verb is "deeply grasp", "understand", or "choose", presenting comparable alternatives is more effective than presenting a single result.

---

## Verb hierarchy

### Structure

```
Core verb              ← The fundamental user impulse
├── Primary verbs      ← Main ways to perform the core verb
├── Secondary verbs    ← Supporting actions
├── Ephemeral verbs    ← One-time or conditional (e.g., onboarding)
└── Emotional premise  ← Not a feature, but a precondition for the core verb
```

### Definitions

| Type | Definition | Example (Wareki) |
|------|-----------|-----------------|
| Core verb | The most essential, repeated action | Confirm (確かめる) |
| Primary verb | Concrete means to perform the core verb | Glance (見る), Convert (変換する) |
| Secondary verb | Supports primary verbs but is not the main experience | Copy (写す) |
| Ephemeral verb | Appears only once or conditionally | Learn (学ぶ) — onboarding only |
| Emotional premise | Feeling the user must have before the core verb works | Trust (信頼する) — user must trust the source |

---

## 6-step process

### Step 1: Identify the user's impulse

What frustration or anxiety drives the user to open the app? Be specific. Not "they want information" but "they're sitting in front of a government form and don't know what year to write."

### Step 2: Extract the core verb

Abstract the impulse into a single verb. Test it: does this verb describe what the user does EVERY time they use the app? If not, go deeper.

**Common mistake:** Choosing a surface verb ("look", "search") instead of the underlying desire ("confirm", "orient", "prepare").

### Step 3: Classify existing features as verbs

List every feature. Assign a verb to each. Map each verb's relationship to the core verb.

### Step 4: Verify consistency

Ask for each feature: "Does this verb serve the core verb?" If a feature introduces a verb unrelated to the core, it's a candidate for removal or redesign.

### Step 5: Find missing or excess verbs

- **Missing:** What does the user need to do AFTER the core verb that the app doesn't support? (e.g., after confirming → copying the value to use it)
- **Excess:** What features serve a different verb entirely? (e.g., a statistics dashboard in a simple confirmation tool)

### Step 6: Evaluate new features through the verb lens

For any proposed feature, ask:
1. What verb does it introduce?
2. Does that verb serve the core verb, or is it a new, independent verb?
3. If independent: will it eventually become the dominant verb and change the app's identity?

---

## Reach cost

How much effort does it take for the user to perform a verb?

| Cost | Mechanism | Example |
|------|-----------|---------|
| Zero | Widget, notification, ambient display | Home screen widget showing today's date |
| Low | Open app → instant display | Today section visible on launch |
| Medium | Open app → input → result | Date conversion tool |
| High | Open app → configure → multi-step | Calendar event creation |

**Rule:** The core verb's reach cost should be as close to zero as possible. If the core verb requires medium or high cost, the app is failing its primary mission.

**Caveat:** This principle applies specifically to the core verb's reach cost. Reducing friction for non-core flows (settings, customization, learning) is a separate concern. Applying reach cost minimization unconditionally can conflict with intentional restrictions that protect the core verb (see: Verb subtraction).

---

## Design patterns

Patterns for implementing verb theory effectively. These also serve as countermeasures to anti-patterns.

### Verb ownership (動詞の帰属先の設計)

Explicitly design who owns the core verb. Platform-owned and user-owned verbs produce different engagement depth and long-term retention.

| Ownership | Characteristics | Example |
|---|---|---|
| Platform-owned | Content/data tied to the service | Qiita articles, SNS posts |
| User-owned | Content/data portable and controlled by the user | Zenn (GitHub integration), しずかなインターネット (private mode) |

Verb ownership is not a feature decision — it is a design philosophy about **who is the subject of the core verb**.

### Verb subtraction (動詞の引き算)

Sharpen the core verb by removing features, not adding them.

**Example — しずかなインターネット:**
Removed: likes, followers, PV counts, comments, rankings, recommendations → Only "write quietly" remains.

**Decision criterion:**
"If I remove this feature, does the core verb become purer?" If yes, the feature is a removal candidate.

### Emotional premise first (感情的前提動詞の優先設計)

Design the emotional state the user needs BEFORE implementing the core verb's features. The emotional premise in the verb hierarchy is not a concept — it is an implementation priority.

**Example:** Wareki's "Confirm" requires "Trust" first → Triple-set display (kanji + romanized + western year) is the concrete implementation of the emotional premise, built before any other feature.

### Verb gap exploitation (既存の動詞のズレを突く)

Find the gap between a competitor's surface verb and their users' underlying impulse. Place your core verb directly on the impulse.

**Process:**
1. List the competitor's surface verb
2. Describe what their users actually want (the underlying impulse)
3. Check if the surface verb fully satisfies the impulse
4. If there is a gap, that is your entry point

**Examples:**
- DeepL "translate" ← User impulse is "understand" = "deeply grasp" → Nani !?'s entry point
- Qiita "share" ← User impulse is "create a lasting work" = "author" → Zenn's entry point
- SNS "connect" ← User impulse is "write without pressure" = "write quietly" → しずかなインターネット's entry point

---

## Anti-patterns

### Verb proliferation

Adding features that introduce unrelated verbs. A memo app that adds task management, calendar, drawing, and chat has lost its core verb.

**Symptom:** "What does this app DO?" becomes hard to answer in one sentence.

### Verb mutation

A feature starts as one verb and gradually becomes another.

**Example:** "Save" (store a date for quick reference) → "Manage" (organize, categorize, sort, archive multiple items). The original verb served the core verb (confirm), but the mutated verb is independent.

**Prevention:** Limit scope. If "Save" is limited to 3-5 items, it stays as "Save". If unlimited, it becomes "Manage".

### Core contradiction

Adding a feature that actively hinders the core verb.

**Example:** A complex settings screen in a "confirm at a glance" app. The settings introduce friction that contradicts instant confirmation.

### Verb dilution

Trying to make the core verb so broad it loses meaning. "Help" or "Assist" are not verbs — they're categories.

### What anti-patterns cannot explain

A product can avoid every anti-pattern and still fail. Verb theory detects self-inflicted damage, not external threats.

| External cause | Example | Verb theory says |
|---|---|---|
| Core verb commoditized (free bundling) | Dropbox — "Share" absorbed into Google Drive / OneDrive | Nothing wrong with the verb design |
| Demand for core verb evaporates | Zoom — "Meet" demand collapsed post-pandemic | Nothing wrong with the verb design |
| Business model disrupted | 2026 SaaS crash — per-seat pricing undermined by AI agents | Nothing wrong with the verb design |

When diagnosing a struggling product, check external factors first. If the verb structure is intact and the product is still declining, the problem is outside verb theory's scope.

---

## Case studies

### Wareki (Japanese era widget app)

- **User impulse:** "I'm filling out a form and don't know what Japanese era year to write"
- **Core verb:** Confirm (確かめる)
- **Internal context:** Users don't just want to verify — they have zero prior knowledge. The verb is "confirm" but the underlying need is "fill a knowledge gap"
- **Hierarchy:**
  - Confirm (core)
    - Glance (primary) — widget, zero cost, most important
    - Convert (primary) — conversion tool, medium cost
    - Learn (ephemeral) — onboarding, one-time
  - Trust (emotional premise) — triple-set display (kanji + romanized + western year) provides redundancy that builds confidence in the source
- **Findings:**
  - Missing: "Copy" — after confirming, users need to use the value (digital forms)
  - Risk: "Save" feature could mutate into "Manage" → limit to 3-5 items
- **ASO insight:** Core verb "Confirm" → emotional need "don't want to be wrong" → keyword: "confidence" → subtitle: "zero guesswork"

### catnose products (competitive verb differentiation)

These cases demonstrate exploiting the gap between a competitor's surface verb and their users' underlying impulse.

| Product | Core verb | Competitor's verb | Differentiation axis |
|---|---|---|---|
| Zenn | Author (著す) | Qiita: Share (共有する) | Individual ownership, monetization |
| しずかなインターネット | Write quietly (綴る) | SNS: Connect (つながる) | Safety through disconnection |
| Nani !? | Deeply grasp (腑に落とす) | DeepL: Translate (翻訳する) | Sense of understanding via comparison |
| RESUME | Prove (証明する) | Manual coding: Build (作る) | Trust presentation without effort |

**Zenn vs Qiita in detail:**
- Qiita "Share": Community-centered. LGTM counts for approval. Fragmented tips. Content belongs to the platform
- Zenn "Author": Individual-centered. Revenue for compensation. Systematic books. Content owned via GitHub integration

Qiita continues to strengthen "Share" (Organization features, trend emphasis), widening the gap over time.

**RESUME verb note:**
"Present (見せる)" is the surface verb, not the core. The user's underlying impulse is "get the other person to believe in my abilities" — the core verb is "Prove (証明する)".

**Common patterns across catnose products:**

1. **Emotional premise first** — Every product prioritizes designing the emotional precondition before the core verb's features. しずかなインターネット designs "feel safe" before "write quietly"
2. **Verb gap exploitation** — Each product enters the market by finding what competitors' surface verbs fail to address
3. **Verb subtraction** — Features are removed, not added, to sharpen the core verb. しずかなインターネット removes likes, followers, PV, comments, rankings — all of them
4. **Verb ownership** — Content and data belong to the user (Zenn: GitHub, しずかなインターネット: private mode)

### Calendar app

- **Core verb:** Organize (整理する)
- **Hierarchy:** Record, Notify, Share
- **Anti-pattern risk:** Adding social features → verb mutation to "Communicate"

### Memo app

- **Core verb:** Capture (書き留める)
- **Hierarchy:** Organize, Search, Share
- **Anti-pattern risk:** Adding task management → verb proliferation

### Weather app

- **Core verb:** Prepare (備える)
- **Hierarchy:** Check, Compare
- **Anti-pattern risk:** Adding social weather sharing → core contradiction (preparation is personal)

---

## Marketing application

### From verb to message

The core verb reveals the emotional need behind the product. Map it:

```
Core verb → What the user fears without it → Positive framing
```

**Example:**
```
Confirm → "I'll write the wrong year" → "Fill forms with confidence"
Capture → "I'll forget this idea" → "Never lose a thought"
Prepare → "I'll get caught in the rain" → "Always one step ahead"
Deeply grasp → "I don't really understand this" → "Understand, don't just translate"
```

### Application to ASO

- **Title/Subtitle:** Embed the core verb's emotional payoff
- **Description:** Structure around the verb hierarchy (core verb first, then primary verbs as features)
- **Screenshots:** Each screenshot should depict one verb in action

---

## References

- Tajiri, S. — Verb theory as applied to Pokemon game design
- Sakurai, M. — Risk-reward as complementary framework to verb theory
- catnose — Zenn, しずかなインターネット, Nani !?, RESUME as practical examples of verb-driven product design
