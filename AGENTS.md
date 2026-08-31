# Standards - AI Context

## Purpose

Shared standards for Labee LLC projects. The repository distributes reusable skills and agent guidance for Claude Code and Codex.

## Repository structure

- `plugins/` contains the reusable plugins.
- Each plugin's `skills/` directory contains workflow skills and their references.
- `.claude-plugin/` contains Claude Code marketplace metadata.
- Each plugin may contain both `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`.

## Working rules

- Read the relevant skill before acting on a specialized task.
- Follow existing patterns and keep changes within the requested scope.
- Verify claims and report uncertainty instead of guessing.
- Use `AGENTS.md` as the vendor-neutral project context; keep tool-specific differences in their respective configuration files.
- Task and progress tracking lives in Vigilare (list: `Labee - Operations`) — implementation-status belongs there, not in project documentation.

## Documentation

See `README.md` for installation and the plugin inventory. Skills should keep detailed references beside their `SKILL.md` and avoid relying on Claude-only runtime variables or tool names when the workflow is intended for both hosts.
