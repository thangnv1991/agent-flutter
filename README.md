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

## Publish to npm (one-time setup)

1. Create npm token and save to GitHub repository secret:
   - Secret name: `NPM_TOKEN`
2. Push a semantic version tag:

```bash
npm version patch
git push origin main --follow-tags
```

GitHub Actions workflow `.github/workflows/publish.yml` will publish automatically on tags `v*.*.*`.

## Release shortcuts

```bash
npm run release:patch
npm run release:minor
npm run release:major
```

## Installed files

- Shared pack: `.agent-flutter/`
- Trae: `.trae/`
- Codex: `AGENTS.md`
- Cursor: `.cursor/rules/agent-flutter.mdc`
- Windsurf: `.windsurf/rules/agent-flutter.md`
- Cline: `.clinerules/agent-flutter.md`
