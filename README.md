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
- GitHub (Copilot)

## Commands

```bash
npx agent-flutter@latest init --ide all --cwd /path/to/project --force
npx agent-flutter@latest init --ide trae,codex
npx agent-flutter@latest sync
npx agent-flutter@latest sync --ide trae,codex,github
npx agent-flutter@latest list --cwd /path/to/project
```

## Bootstrap new Flutter project (script)

After `init`, run the script from the IDE-specific folder:

```bash
bash .trae/scripts/bootstrap_flutter_template.sh
```

Examples by IDE:

```bash
bash .codex/scripts/bootstrap_flutter_template.sh
bash .cursor/scripts/bootstrap_flutter_template.sh
bash .windsurf/scripts/bootstrap_flutter_template.sh
bash .clinerules/scripts/bootstrap_flutter_template.sh
bash .github/scripts/bootstrap_flutter_template.sh
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

- Workspace utilities: `tool/`, `tools/`, `.vscode/tasks.json`
- Trae: `.trae/` (skills/rules/scripts)
- Codex: `.codex/` (skills/rules/scripts) + `AGENTS.md`
- Cursor: `.cursor/skills/`, `.cursor/rules/shared/`, `.cursor/scripts/`, `.cursor/rules/agent-flutter.mdc`
- Windsurf: `.windsurf/skills/`, `.windsurf/rules/shared/`, `.windsurf/scripts/`, `.windsurf/rules/agent-flutter.md`
- Cline: `.clinerules/skills/`, `.clinerules/rules/`, `.clinerules/scripts/`, `.clinerules/agent-flutter.md`
- GitHub: `.github/skills/`, `.github/rules/`, `.github/scripts/`, `.github/copilot-instructions.md`
