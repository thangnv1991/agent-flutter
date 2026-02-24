# agent-flutter

CLI to initialize a reusable Flutter Skill/Rule pack for multiple AI IDEs.

## Usage

```bash
npx agent-flutter@latest init
```

By default `init` installs adapters for all supported IDEs:
- Trae
- Codex
- Cursor
- Windsurf
- Cline

## Commands

```bash
npx agent-flutter@latest init --ide all --cwd /path/to/project --force
npx agent-flutter@latest init --ide trae,codex
npx agent-flutter@latest list --cwd /path/to/project
```

## Installed files

- Shared pack: `.agent-flutter/`
- Trae: `.trae/`
- Codex: `AGENTS.md`
- Cursor: `.cursor/rules/agent-flutter.mdc`
- Windsurf: `.windsurf/rules/agent-flutter.md`
- Cline: `.clinerules/agent-flutter.md`
