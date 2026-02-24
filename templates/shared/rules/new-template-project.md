---
alwaysApply: false
---
# New Template Project (Script-first)

Use the bootstrap script instead of generating the full workflow text.

## Script path
- Trae: `.trae/scripts/bootstrap_flutter_template.sh`
- Codex: `.codex/scripts/bootstrap_flutter_template.sh`
- Cursor: `.cursor/scripts/bootstrap_flutter_template.sh`
- Windsurf: `.windsurf/scripts/bootstrap_flutter_template.sh`
- Cline: `.clinerules/scripts/bootstrap_flutter_template.sh`
- GitHub: `.github/scripts/bootstrap_flutter_template.sh`

## Run
Interactive mode:
```bash
bash .codex/scripts/bootstrap_flutter_template.sh
```

Non-interactive mode:
```bash
bash .codex/scripts/bootstrap_flutter_template.sh \
  --name link_home_mobile \
  --org com.company \
  --flutter-version stable \
  --dir ~/workspace \
  --force \
  --non-interactive
```

## Inputs
- `--name`: project folder name (required in non-interactive mode).
- `--org`: reverse-domain org id (default: `com.example`).
- `--flutter-version`: Flutter version for FVM (default: `stable`).
- `--dir`: parent folder to create project in (default: current directory).
- `--force`: allow overwrite in an existing non-empty directory.

## What the script does
1. Ensures FVM exists (auto-installs with `dart pub global activate fvm` if needed).
2. Creates Flutter project with FVM and selected version.
3. Adds core dependencies and dev dependencies.
4. Creates architecture folders and starter files (`main`, DI, locale, routing, home feature).
5. Creates `.env`, `.env.staging`, `.env.prod` and updates `.gitignore`.

## Validation
```bash
cd <project_name>
fvm flutter run
```
