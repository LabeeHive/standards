---
name: humanizer
description: Remove AI-generated writing patterns from text. Use when reviewing or editing text to make it sound more natural.
when_to_use: Triggers on "AI臭", "humanize", "自然にして", "AI-like", "AIっぽい", "人間らしく".
allowed-tools: Read Edit Write Glob Grep
argument-hint: [text or file path]
---

# Humanizer

Remove signs of AI-generated writing based on [Wikipedia's Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).

## When Invoked

1. **Scan** - Identify AI patterns in the text
2. **Rewrite** - Replace with natural alternatives
3. **Preserve** - Keep the core meaning intact
4. **Add voice** - Inject personality, not just remove bad patterns

## Patterns to Detect and Fix

### 1. Inflated Significance

**Watch for:** serves as, stands as, testament to, vital/crucial/pivotal role, watershed moment, lasting impact, enduring legacy

**Before:**
> The library serves as a testament to the community's enduring commitment to education.

**After:**
> The library opened in 1985 and still hosts weekly reading programs.

### 2. Promotional Language

**Watch for:** rich cultural heritage, breathtaking, must-visit, stunning, vibrant, nestled, in the heart of, natural beauty

**Before:**
> Nestled in the breathtaking mountains, this vibrant town boasts stunning natural beauty.

**After:**
> The town sits at 2,400m elevation in the Sierra Nevada range.

### 3. Superficial -ing Analysis (Present Participial Phrases)

**Watch for:** highlighting, emphasizing, showcasing, reflecting, ensuring, fostering, underscoring, surpassing, garnering, comprehending

AI uses "main clause + comma + -ing phrase" at 2-5x human rate ([arXiv:2412.11385](https://arxiv.org/abs/2412.11385)).

**Before:**
> The festival celebrates local traditions, showcasing the region's heritage and fostering community bonds.

**After:**
> The festival features traditional dances and locally-made crafts. About 5,000 people attend each year.

### 4. AI Vocabulary

**Watch for:** Additionally, Moreover, Furthermore, crucial, delve, intricate, multifaceted, comprehensive, landscape (abstract), tapestry (abstract), realm, era, groundbreaking, advancements, garnered, comprehending, ever-evolving, underscores

**High-frequency markers** (per [arXiv:2412.11385](https://arxiv.org/abs/2412.11385)):

- aligns (16x), aims to explore (50x), today's fast-paced world (107x), notable works include (120x+)

**Before:**
> Additionally, the multifaceted approach delves into the intricate landscape of modern challenges.

**After:**
> The program also addresses housing and job training.

### 5. Copula Avoidance

**Watch for:** serves as, functions as, stands as, acts as (instead of "is")

**Before:**
> The building serves as the headquarters for the organization.

**After:**
> The building is the organization's headquarters.

### 6. Vague Attribution

**Watch for:** Experts say, Industry reports, Observers note, Some critics argue, Studies show (without citation)

**Before:**
> Experts argue that this approach is more effective than traditional methods.

**After:**
> A 2024 Stanford study found this approach reduced errors by 30%.

### 7. Negative Parallelism

**Watch for:** It's not just X, it's Y / Not only X but also Y / It's not about X, it's about Y

**Before:**
> It's not just a tool, it's a revolution. It's not about features, it's about transformation.

**After:**
> The tool automates three manual steps.

### 8. Rule of Three

**Watch for:** Forced groupings of three adjectives, benefits, or features

**Before:**
> The platform is fast, reliable, and secure. It offers speed, stability, and safety.

**After:**
> The platform handles 10,000 requests per second with 99.9% uptime.

### 9. Em Dash Overuse

**Watch for:** Multiple em dashes (—) per paragraph

**Before:**
> The system—which was developed last year—has become essential—even critical—to operations.

**After:**
> The system, developed last year, has become essential to operations.

### 10. Communication Artifacts

**Watch for:** I hope this helps, Certainly!, Great question!, Let me know if, Here is a...

**Before:**
> Great question! Here is an overview of the topic. I hope this helps!

**After:**
> [Just the content, no meta-commentary]

### 11. Hedging Overload

**Watch for:** could potentially, might possibly, it could be argued that, tends to somewhat

**Before:**
> It could potentially be argued that this might possibly have some effect.

**After:**
> This likely has an effect. / This may have an effect.

### 12. Generic Conclusions

**Watch for:** The future looks bright, Exciting times ahead, continues to evolve, remains to be seen

**Before:**
> The future looks bright as the company continues to evolve. Exciting times lie ahead.

**After:**
> The company plans to open two more locations next year.

### 13. Cohesion without Coherence

Surface polish with no substance. Text reads smoothly but says nothing specific.

**Watch for:** Grammatically correct but logically disconnected paragraphs, claims without evidence, four sentences conveying one sentence of meaning

**Before:**
> This innovative approach leverages cutting-edge technology to deliver transformative results. By harnessing the power of data-driven insights, organizations can unlock unprecedented value. The implications are far-reaching and significant.

**After:**
> The tool reduced processing time from 3 hours to 15 minutes.

Per [AI Slop taxonomy](https://arxiv.org/html/2509.19163v1): density (verbose with minimal content), relevance, and tone are top predictors.

### 14. Elegant Variation (Synonym Cycling)

AI cycles through synonyms to avoid repetition, resulting in unnatural word choices.

**Watch for:** The same concept referred to by 3+ different terms in quick succession (protagonist → main character → central figure → hero)

**Before:**
> The protagonist faces many challenges. The main character must overcome obstacles. The central figure eventually triumphs.

**After:**
> The protagonist faces challenges and eventually overcomes them.

This pattern stems from AI repetition-penalty mechanisms.

### 15. False Ranges

X-to-Y constructions where X and Y don't form a meaningful spectrum.

**Watch for:** "from X to Y" where X and Y are unrelated or don't represent endpoints of a scale

**Before:**
> From the Big Bang to dark matter, from stars to galaxies, the universe reveals its secrets.

**After:**
> The universe spans 13.8 billion years and contains billions of galaxies.

True ranges have meaningful endpoints: "from 10 to 100", "from beginner to expert".

### 16. Title Case Overuse

Capitalizing every major word in headings (English-style title case).

**Watch for:** "Strategic Negotiations And Global Partnerships" instead of sentence case

**Before:**

> ## Building Effective Communication Skills For Modern Teams

**After:**

> ## Building effective communication skills for modern teams

Sentence case is more natural in most contexts except proper titles.

### 17. Curly Quotation Marks (ChatGPT Signature)

ChatGPT often produces curly quotes (" ") while most humans type straight quotes (" ").

**Watch for:** " " (U+201C, U+201D) instead of " " (U+0022)

**Before:**
> The report states "this is critical" to the project.

**After:**
> The report states "this is critical" to the project.

### 18. Inline-Header Vertical Lists

Every list item starts with bold text followed by a colon.

**Watch for:** Repeated `**Header:** description` pattern in lists

**Before:**
>
> - **Speed:** The system processes requests quickly
> - **Reliability:** Uptime exceeds 99.9%
> - **Security:** End-to-end encryption protects data

**After:**
> The system processes requests quickly, maintains 99.9% uptime, and uses end-to-end encryption.

## Full Example

**Before (AI-generated):**

> Building Effective Remote Work Strategies For Modern Teams
>
> In today's fast-paced world, remote work has become increasingly crucial for organizations seeking to remain competitive. This comprehensive guide delves into the multifaceted landscape of distributed teams.
>
> Remote work offers numerous benefits:
>
> - **Flexibility:** Employees can work from anywhere
> - **Productivity:** Studies show remote workers are more productive
> - **Cost Savings:** Organizations can reduce overhead expenses
>
> Additionally, the transition to remote work requires careful consideration. It's not just about technology, it's about culture. It's not about location, it's about connection.
>
> Experts argue that successful remote teams share common characteristics. From communication to collaboration, from trust to transparency, these elements form the foundation of effective distributed work.
>
> In conclusion, remote work represents a transformative shift in how we approach professional life. The future looks bright as organizations continue to evolve. I hope this overview helps you understand the key considerations!

**After (humanized):**

> How we made remote work actually work
>
> We went fully remote in 2022. The first three months were rough—missed deadlines, miscommunication, people feeling isolated.
>
> What fixed it: async by default. We stopped expecting instant replies. Important decisions go in writing. Meetings dropped from 15 hours/week to 4.
>
> The hardest part wasn't the tools. It was trusting people you can't see. We had to learn that "online" doesn't mean "available."
>
> Our setup now: Slack for quick stuff, Notion for decisions, one weekly sync. Office costs went from $8k/month to zero.

**Changes made:**

- Title case → sentence case, generic → specific
- Removed: "comprehensive", "delves", "multifaceted landscape", "crucial"
- Removed: inline-header list format, negative parallelism ("It's not just...")
- Removed: false range ("from X to Y"), vague attribution ("experts argue")
- Removed: generic conclusion, communication artifacts ("I hope this helps")
- Added: specific numbers, first-person experience, honest struggles

## Adding Voice (Not Just Removing)

Sterile text is also AI-like. Good writing has personality.

**Signs of soulless writing:**

- Every sentence same length
- No opinions, just neutral reporting
- No first-person when appropriate
- No humor or edge

**How to add voice:**

- Have opinions: "I don't know how to feel about this" > neutral pros/cons
- Vary rhythm: Short. Then longer sentences that take their time.
- Be specific: Not "concerning" but "unsettling that agents work at 3am"
- Use "I" when it fits

## Checklist (English)

Quick verification for English text:

### Vocabulary

- [ ] No "delve", "crucial", "multifaceted", "landscape", "tapestry"
- [ ] No "Additionally", "Moreover", "Furthermore" at sentence start
- [ ] No "serves as", "stands as", "functions as" (use "is")
- [ ] No "in today's fast-paced world", "notable works include"

### Structure

- [ ] No title case in headings (unless proper title)
- [ ] No forced rule-of-three lists
- [ ] No inline-header pattern (`**Bold:** text`) repeated
- [ ] Varying sentence lengths

### Attribution

- [ ] No "Experts say" / "Studies show" without citation
- [ ] Specific numbers over "many" / "various" / "significant"

### Tone

- [ ] No "I hope this helps" / "Great question!"
- [ ] No generic conclusions ("The future looks bright")
- [ ] No negative parallelism ("It's not X, it's Y")
- [ ] Clear opinion/stance when appropriate

### Formatting

- [ ] Straight quotes (" ") not curly (" ")
- [ ] Reasonable em dash usage (not 3+ per paragraph)
- [ ] No excessive hedging ("could potentially possibly")

## Output

Provide:

1. Rewritten text
2. Brief list of changes (optional)

## Reference Files

| File | When to Load |
|------|--------------|
| [references/japanese-patterns.md](references/japanese-patterns.md) | 日本語テキストを処理する場合 |

## Related Skills

| Skill | Purpose |
|-------|---------|
| /documentation | Write and review documentation following Labee standards |

## External Reference

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- [Wikipedia: WikiProject AI Cleanup](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup)
- [Wikipedia: 大規模言語モデルの利用](https://ja.wikipedia.org/wiki/Wikipedia:%E5%A4%A7%E8%A6%8F%E6%A8%A1%E8%A8%80%E8%AA%9E%E3%83%A2%E3%83%87%E3%83%AB%E3%81%AE%E5%88%A9%E7%94%A8)
- [Wikipedia: AIスロップ](https://ja.wikipedia.org/wiki/AI%E3%82%B9%E3%83%AD%E3%83%83%E3%83%97)
- [arXiv: Why Does ChatGPT "Delve" So Much?](https://arxiv.org/abs/2412.11385)
- [arXiv: Measuring AI "Slop" in Text](https://arxiv.org/abs/2509.19163)
- [GitHub: blader/humanizer](https://github.com/blader/humanizer) - 24 patterns reference
