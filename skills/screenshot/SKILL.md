---
name: screenshot
description: Capture macOS screen region and read as image. Use when terminal doesn't support image paste or user wants to show specific screen area. Triggers on "スクショ", "screenshot", "スクリーンショット", "画面キャプチャ", "screen capture".
model: haiku
effort: low
allowed-tools: Bash(bun:*) Read
argument-hint: [mode]
---

# Screenshot

Capture the macOS screen and read the image with the Read tool.
Workaround for terminals (WezTerm, etc.) that don't support image clipboard paste.

## Execution

### 1. Capture

```bash
bun scripts/capture.ts [mode]
```

| Argument | Behavior |
|----------|----------|
| (none) | Interactive region selection (default) |
| `select` / `選択` | Interactive region selection |
| `window` / `ウィンドウ` | Click to select window |
| `full` / `フルスクリーン` | Full screen, silent |

The script outputs the saved file path. Images are saved as JPG and downscaled if the long edge exceeds 2000px.

### 2. Read

Use the Read tool to read the file path printed by the script.

### 3. Respond

Describe what you see or answer the user's question about the screen content.

## Notes

- macOS only (requires `screencapture` command)
- May require Screen Recording permission in System Settings > Privacy & Security
- Temporary files are saved in `/tmp/`
