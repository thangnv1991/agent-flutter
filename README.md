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

## Publish to npm (one-time setup, Trusted Publishing)

1. On npm package settings, add a **Trusted publisher**:
   - Provider: `GitHub Actions`
   - Owner: `thangnv1991`
   - Repository: `agent-flutter`
   - Workflow file: `.github/workflows/publish.yml`
2. Push a semantic version tag:

```bash
npm version patch
git push origin main --follow-tags
```

GitHub Actions workflow `.github/workflows/publish.yml` will publish automatically on tags `v*.*.*` without `NPM_TOKEN`.

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
