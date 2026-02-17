---
name: gemini-image
description: Generate images using Gemini CLI with nanobanana extension. Use when creating illustrations, icons, textures, or visual assets. Triggers on "画像生成", "image generation", "Gemini画像", "generate image", "イラスト生成".
model: sonnet
allowed-tools: Bash(gemini:*), Bash(bun:*), Read, Glob
---

# Gemini Image Generation

Generate images via Gemini CLI's nanobanana extension (MCP-based image generation).

## Prerequisites

- Bun runtime installed
- Gemini CLI installed (`npm install -g @google/gemini-cli`)
- nanobanana extension installed (`gemini extensions install https://github.com/gemini-cli-extensions/nanobanana`)
- Google AI API key or Vertex AI authentication configured

## Workflow

### 1. Clarify requirements

Ask the user if not already clear:

| Item | Example |
|------|---------|
| Subject | "A mascot character waving", "texture of old brick wall" |
| Dimensions | 512x512, 1024x1024, 1200x400 |
| Format | PNG, PNG with alpha (transparent background) |
| Style | "watercolor", "digital painting", "pixel art" |

### 2. Build the prompt

Structure the prompt in this order:

```
[Dimensions and format] + [Subject description] + [Style/mood] + [Lighting] + [Technical requirements]
```

Append a negative prompt if the user has style constraints:

```
Avoid: [unwanted elements]
```

### 3. Preflight check

Run the preflight script to verify prerequisites before the slow Gemini CLI startup:

```bash
bun scripts/preflight.ts
```

If preflight fails, follow the error messages to install missing prerequisites.

### 4. Generate

Run Gemini CLI **without** the `-m` flag. The nanobanana extension handles image generation automatically via MCP tools.

```bash
gemini -p '{prompt}' -y
```

| Flag | Purpose |
|------|---------|
| `-p` | Non-interactive mode (headless) |
| `-y` | Auto-approve file save actions (YOLO mode) |

**IMPORTANT:** Do NOT use `-m gemini-2.5-flash-image`. The nanobanana extension manages model selection internally.

**Model selection via environment variable:**

| Environment Variable | Value | Effect |
|---------------------|-------|--------|
| `NANOBANANA_MODEL` | (unset) | Uses `gemini-2.5-flash-image` (default, fast) |
| `NANOBANANA_MODEL` | `gemini-3-pro-image-preview` | Higher quality, slower (Nano Banana Pro) |

> Note: `gemini-2.5-flash-image` is scheduled for deprecation in June 2026. Consider switching to `gemini-3-pro-image-preview` for new projects.

**Output:** Images are auto-saved to `nanobanana-output/` in the current directory.

### 5. Verify

1. Check the Gemini CLI output for the saved file path
2. Read the image with the Read tool to verify quality
3. If unsatisfactory, iterate by adjusting the prompt and re-generating

## Iteration tips

- Change only one aspect per iteration for consistent results
- Pin colors with hex codes (e.g., `vivid teal (#2DDAB3)`), not just color names
- Specify line weight, shadow style, and texture explicitly
- Use negative prompts to prevent unwanted styles

## Notes

- Generated images include SynthID watermark
- Gemini CLI auto-saves to `nanobanana-output/` with smart filenames derived from the prompt
- Duplicate filenames are handled automatically (appends `_1`, `_2`, etc.)
