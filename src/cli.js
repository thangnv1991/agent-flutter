import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SUPPORTED_IDES = ['trae', 'codex', 'cursor', 'windsurf', 'cline', 'github'];

const USAGE = `
agent-flutter

Usage:
  npx agent-flutter@latest init [--ide all|trae,codex,cursor,windsurf,cline,github] [--cwd <project_dir>] [--force]
  npx agent-flutter@latest sync [--ide all|trae,codex,cursor,windsurf,cline,github] [--cwd <project_dir>]
  npx agent-flutter@latest list [--cwd <project_dir>]

Commands:
  init   Install Flutter skills/rules/scripts for selected IDE adapters.
  sync   Update installed adapters from latest template.
  list   Print available skills/rules from package template.
`;

export async function runCli(argv) {
  if (argv.length === 0 || argv.includes('-h') || argv.includes('--help')) {
    console.log(USAGE.trim());
    return;
  }

  const command = argv[0];
  const options = parseOptions(argv.slice(1));

  switch (command) {
    case 'init':
      await runInit(options);
      return;
    case 'sync':
      await runSync(options);
      return;
    case 'list':
      await runList(options);
      return;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

function parseOptions(args) {
  const values = new Map();
  const flags = new Set();

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--force') {
      flags.add('force');
      continue;
    }

    if (!arg.startsWith('--')) {
      throw new Error(`Unknown argument: ${arg}`);
    }

    const key = arg.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith('--')) {
      throw new Error(`Missing value for option: ${arg}`);
    }
    values.set(key, next);
    i += 1;
  }

  return {
    get(key, fallback = null) {
      return values.has(key) ? values.get(key) : fallback;
    },
    hasFlag(flag) {
      return flags.has(flag);
    },
  };
}

async function runInit(options) {
  const packageRoot = getPackageRoot();
  const templateRoot = path.join(packageRoot, 'templates', 'shared');
  await assertDirExists(templateRoot, `Shared template not found: ${templateRoot}`);

  const projectRoot = path.resolve(options.get('cwd', process.cwd()));
  await assertDirExists(projectRoot, `Project directory not found: ${projectRoot}`);

  const ideTargets = resolveIdeTargets(options.get('ide', 'all'));
  const force = options.hasFlag('force');

  await applyPack({
    templateRoot,
    projectRoot,
    ideTargets,
    force,
    mode: 'install',
  });

  console.log('');
  console.log('Done.');
  console.log('Use --force to overwrite existing adapters.');
}

async function runSync(options) {
  const packageRoot = getPackageRoot();
  const templateRoot = path.join(packageRoot, 'templates', 'shared');
  await assertDirExists(templateRoot, `Shared template not found: ${templateRoot}`);

  const projectRoot = path.resolve(options.get('cwd', process.cwd()));
  await assertDirExists(projectRoot, `Project directory not found: ${projectRoot}`);

  let ideTargets;
  const ideOption = options.get('ide', null);
  if (ideOption) {
    ideTargets = resolveIdeTargets(ideOption);
  } else {
    ideTargets = await detectInstalledIdeTargets(projectRoot);
    if (ideTargets.size) {
      console.log(`Detected adapters: ${[...ideTargets].join(', ')}`);
    } else {
      ideTargets = new Set(SUPPORTED_IDES);
      console.log('No existing adapters detected. Syncing all adapters.');
    }
  }

  await applyPack({
    templateRoot,
    projectRoot,
    ideTargets,
    force: true,
    mode: 'sync',
  });

  console.log('');
  console.log('Sync completed.');
}

async function applyPack({
  templateRoot,
  projectRoot,
  ideTargets,
  force,
  mode,
}) {
  const verb = mode === 'sync' ? 'Synced' : 'Installed';
  const sharedUtilityDirs = ['tool', 'tools'];
  const syncDirectory = async ({ sourceDir, destinationDir, label }) => {
    if ((await exists(destinationDir)) && !force) {
      console.log(`Skipped ${label} (exists): ${destinationDir}`);
      return;
    }
    await copyTemplateDirectory({
      sourceDir,
      destinationDir,
      projectRoot,
      force: true,
    });
    console.log(`${verb} ${label}: ${destinationDir}`);
  };
  const syncTemplateFile = async ({ sourcePath, destinationPath, label }) => {
    if ((await exists(destinationPath)) && !force) {
      console.log(`Skipped ${label} (exists): ${destinationPath}`);
      return;
    }
    await fs.mkdir(path.dirname(destinationPath), { recursive: true });
    if (isTextFile(path.basename(sourcePath))) {
      const raw = await fs.readFile(sourcePath, 'utf8');
      const transformed = replaceProjectPlaceholders(raw, projectRoot);
      await fs.writeFile(destinationPath, transformed, 'utf8');
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
    await copyFileMode(sourcePath, destinationPath);
    console.log(`${verb} ${label}: ${destinationPath}`);
  };
  const syncWorkspaceUtilities = async () => {
    for (const dirName of sharedUtilityDirs) {
      await syncDirectory({
        sourceDir: path.join(templateRoot, dirName),
        destinationDir: path.join(projectRoot, dirName),
        label: `Workspace ${dirName}`,
      });
    }
  };
  const syncWorkspaceVscodeTasks = async () => {
    const sourcePath = path.join(templateRoot, 'vscode', 'tasks.json');
    if (!(await exists(sourcePath))) return;
    const raw = await fs.readFile(sourcePath, 'utf8');
    const transformed = replaceProjectPlaceholders(raw, projectRoot);
    const targetPath = path.join(projectRoot, '.vscode', 'tasks.json');
    const written = await writeTextFile(
      targetPath,
      transformed,
      { force },
    );
    console.log(
      written
        ? `${verb} Workspace VS Code tasks: ${targetPath}`
        : `Skipped Workspace VS Code tasks (exists): ${targetPath}`,
    );
  };
  await syncWorkspaceUtilities();
  await syncWorkspaceVscodeTasks();

  if (ideTargets.has('trae')) {
    const traeTarget = path.join(projectRoot, '.trae');
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'skills'),
      destinationDir: path.join(traeTarget, 'skills'),
      label: 'Trae skills',
    });
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'scripts'),
      destinationDir: path.join(traeTarget, 'scripts'),
      label: 'Trae scripts',
    });
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'rules'),
      destinationDir: path.join(traeTarget, 'rules'),
      label: 'Trae rules',
    });
    await syncTemplateFile({
      sourcePath: path.join(templateRoot, '.ignore'),
      destinationPath: path.join(traeTarget, '.ignore'),
      label: 'Trae ignore',
    });
    await syncTemplateFile({
      sourcePath: path.join(templateRoot, 'TEMPLATES.md'),
      destinationPath: path.join(traeTarget, 'TEMPLATES.md'),
      label: 'Trae templates',
    });
  }

  const skills = await loadSkillMetadata(path.join(templateRoot, 'skills'));
  const rules = await loadRuleMetadata(path.join(templateRoot, 'rules'));

  if (ideTargets.has('codex')) {
    const codexRoot = path.join(projectRoot, '.codex');
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'skills'),
      destinationDir: path.join(codexRoot, 'skills'),
      label: 'Codex skills',
    });
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'scripts'),
      destinationDir: path.join(codexRoot, 'scripts'),
      label: 'Codex scripts',
    });
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'rules'),
      destinationDir: path.join(codexRoot, 'rules'),
      label: 'Codex rules',
    });

    const agentsPath = path.join(projectRoot, 'AGENTS.md');
    const written = await writeTextFile(
      agentsPath,
      buildCodexAgents({
        projectRoot,
        projectName: path.basename(projectRoot),
        skills,
        rules,
        packRoot: '.codex',
      }),
      { force },
    );
    console.log(
      written
        ? `${verb} Codex adapter: ${agentsPath}`
        : `Skipped Codex adapter (exists): ${agentsPath}`,
    );
  }

  if (ideTargets.has('cursor')) {
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'skills'),
      destinationDir: path.join(projectRoot, '.cursor', 'skills'),
      label: 'Cursor skills',
    });
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'scripts'),
      destinationDir: path.join(projectRoot, '.cursor', 'scripts'),
      label: 'Cursor scripts',
    });
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'rules'),
      destinationDir: path.join(projectRoot, '.cursor', 'rules', 'shared'),
      label: 'Cursor rules',
    });

    const cursorPath = path.join(projectRoot, '.cursor', 'rules', 'agent-flutter.mdc');
    const written = await writeTextFile(
      cursorPath,
      buildCursorRule(),
      { force },
    );
    console.log(
      written
        ? `${verb} Cursor adapter: ${cursorPath}`
        : `Skipped Cursor adapter (exists): ${cursorPath}`,
    );
  }

  if (ideTargets.has('windsurf')) {
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'skills'),
      destinationDir: path.join(projectRoot, '.windsurf', 'skills'),
      label: 'Windsurf skills',
    });
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'scripts'),
      destinationDir: path.join(projectRoot, '.windsurf', 'scripts'),
      label: 'Windsurf scripts',
    });
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'rules'),
      destinationDir: path.join(projectRoot, '.windsurf', 'rules', 'shared'),
      label: 'Windsurf rules',
    });

    const windsurfPath = path.join(projectRoot, '.windsurf', 'rules', 'agent-flutter.md');
    const written = await writeTextFile(
      windsurfPath,
      buildWindsurfRule(),
      { force },
    );
    console.log(
      written
        ? `${verb} Windsurf adapter: ${windsurfPath}`
        : `Skipped Windsurf adapter (exists): ${windsurfPath}`,
    );
  }

  if (ideTargets.has('cline')) {
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'skills'),
      destinationDir: path.join(projectRoot, '.clinerules', 'skills'),
      label: 'Cline skills',
    });
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'scripts'),
      destinationDir: path.join(projectRoot, '.clinerules', 'scripts'),
      label: 'Cline scripts',
    });
    await syncDirectory({
      sourceDir: path.join(templateRoot, 'rules'),
      destinationDir: path.join(projectRoot, '.clinerules', 'rules'),
      label: 'Cline rules',
    });

    const clinePath = path.join(projectRoot, '.clinerules', 'agent-flutter.md');
    const written = await writeTextFile(
      clinePath,
      buildClineRule(),
      { force },
    );
    console.log(
      written
        ? `${verb} Cline adapter: ${clinePath}`
        : `Skipped Cline adapter (exists): ${clinePath}`,
    );
  }

  if (ideTargets.has('github')) {
    const githubSkillsPath = path.join(projectRoot, '.github', 'skills');
    if ((await exists(githubSkillsPath)) && !force) {
      console.log(`Skipped GitHub skills (exists): ${githubSkillsPath}`);
    } else {
      await copyTemplateDirectory({
        sourceDir: path.join(templateRoot, 'skills'),
        destinationDir: githubSkillsPath,
        projectRoot,
        force: true,
      });
      console.log(`${verb} GitHub skills: ${githubSkillsPath}`);
    }

    const githubScriptsPath = path.join(projectRoot, '.github', 'scripts');
    if ((await exists(githubScriptsPath)) && !force) {
      console.log(`Skipped GitHub scripts (exists): ${githubScriptsPath}`);
    } else {
      await copyTemplateDirectory({
        sourceDir: path.join(templateRoot, 'scripts'),
        destinationDir: githubScriptsPath,
        projectRoot,
        force: true,
      });
      console.log(`${verb} GitHub scripts: ${githubScriptsPath}`);
    }

    const githubRulesPath = path.join(projectRoot, '.github', 'rules');
    if ((await exists(githubRulesPath)) && !force) {
      console.log(`Skipped GitHub rules (exists): ${githubRulesPath}`);
    } else {
      await copyTemplateDirectory({
        sourceDir: path.join(templateRoot, 'rules'),
        destinationDir: githubRulesPath,
        projectRoot,
        force: true,
      });
      console.log(`${verb} GitHub rules: ${githubRulesPath}`);
    }

    const githubPrTemplateSource = path.join(templateRoot, 'github', 'pull_request_template.md');
    if (await exists(githubPrTemplateSource)) {
      await syncTemplateFile({
        sourcePath: githubPrTemplateSource,
        destinationPath: path.join(projectRoot, '.github', 'pull_request_template.md'),
        label: 'GitHub PR template',
      });
    }

    const githubPrGateSource = path.join(templateRoot, 'github', 'workflows', 'pr-template-gate.yml');
    if (await exists(githubPrGateSource)) {
      await syncTemplateFile({
        sourcePath: githubPrGateSource,
        destinationPath: path.join(projectRoot, '.github', 'workflows', 'pr-template-gate.yml'),
        label: 'GitHub PR gate workflow',
      });
    }

    const githubPath = path.join(projectRoot, '.github', 'copilot-instructions.md');
    const written = await writeTextFile(
      githubPath,
      buildGithubCopilotInstructions(),
      { force },
    );
    console.log(
      written
        ? `${verb} GitHub adapter: ${githubPath}`
        : `Skipped GitHub adapter (exists): ${githubPath}`,
    );
  }
}

async function detectInstalledIdeTargets(projectRoot) {
  const detected = new Set();
  if (await exists(path.join(projectRoot, '.trae'))) detected.add('trae');
  if (
    (await exists(path.join(projectRoot, 'AGENTS.md')))
    || (await exists(path.join(projectRoot, '.codex', 'skills')))
  ) {
    detected.add('codex');
  }
  if (await exists(path.join(projectRoot, '.cursor', 'rules', 'agent-flutter.mdc'))) {
    detected.add('cursor');
  }
  if (await exists(path.join(projectRoot, '.windsurf', 'rules', 'agent-flutter.md'))) {
    detected.add('windsurf');
  }
  if (await exists(path.join(projectRoot, '.clinerules', 'agent-flutter.md'))) {
    detected.add('cline');
  }
  if (
    (await exists(path.join(projectRoot, '.github', 'copilot-instructions.md')))
    || (await exists(path.join(projectRoot, '.github', 'skills')))
  ) {
    detected.add('github');
  }
  return detected;
}

async function runList(options) {
  const templateRoot = path.join(getPackageRoot(), 'templates', 'shared');

  const skills = await loadSkillMetadata(path.join(templateRoot, 'skills'));
  const rules = await loadRuleMetadata(path.join(templateRoot, 'rules'));

  console.log(`Source: ${templateRoot}`);
  console.log('');
  console.log(`Skills (${skills.length})`);
  for (const skill of skills) {
    console.log(`- ${skill.name} (${skill.slug})`);
  }
  console.log('');
  console.log(`Rules (${rules.length})`);
  for (const rule of rules) {
    console.log(`- ${rule.file}`);
  }
}

function resolveIdeTargets(rawValue) {
  const value = String(rawValue || 'all')
    .trim()
    .toLowerCase();
  if (!value || value === 'all') {
    return new Set(SUPPORTED_IDES);
  }

  const requested = new Set(
    value
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
  for (const ide of requested) {
    if (!SUPPORTED_IDES.includes(ide)) {
      throw new Error(`Unsupported IDE target: ${ide}`);
    }
  }
  return requested;
}

function getPackageRoot() {
  const currentFile = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(currentFile), '..');
}

async function assertDirExists(dirPath, errorMessage) {
  const stat = await safeStat(dirPath);
  if (!stat || !stat.isDirectory()) {
    throw new Error(errorMessage);
  }
}

async function copyTemplateDirectory({
  sourceDir,
  destinationDir,
  projectRoot,
  force,
}) {
  if (await exists(destinationDir)) {
    if (force) {
      await fs.rm(destinationDir, { recursive: true, force: true });
    }
  }

  await fs.mkdir(destinationDir, { recursive: true });
  await copyTemplateEntries({
    sourceDir,
    destinationDir,
    projectRoot,
  });
}

async function copyTemplateEntries({ sourceDir, destinationDir, projectRoot }) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;
    const fromPath = path.join(sourceDir, entry.name);
    const toPath = path.join(destinationDir, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(toPath, { recursive: true });
      await copyTemplateEntries({
        sourceDir: fromPath,
        destinationDir: toPath,
        projectRoot,
      });
      continue;
    }

    if (!entry.isFile()) continue;

    if (isTextFile(entry.name)) {
      const raw = await fs.readFile(fromPath, 'utf8');
      const transformed = replaceProjectPlaceholders(raw, projectRoot);
      await fs.writeFile(toPath, transformed, 'utf8');
    } else {
      await fs.copyFile(fromPath, toPath);
    }
    await copyFileMode(fromPath, toPath);
  }
}

function replaceProjectPlaceholders(content, projectRoot) {
  const rootPath = toPosixPath(projectRoot);
  const rootUri = stripTrailingSlash(
    pathToFileURL(path.resolve(projectRoot, '.')).toString(),
  );
  return content
    .replaceAll('{{PROJECT_ROOT_URI}}', rootUri)
    .replaceAll('{{PROJECT_ROOT}}', rootPath);
}

function isTextFile(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (!ext) return true;
  const binaryExtensions = new Set([
    '.a',
    '.class',
    '.dll',
    '.dylib',
    '.eot',
    '.exe',
    '.gif',
    '.ico',
    '.jpeg',
    '.jpg',
    '.mp3',
    '.mp4',
    '.otf',
    '.pdf',
    '.png',
    '.so',
    '.ttf',
    '.wav',
    '.webp',
    '.woff',
    '.woff2',
    '.zip',
  ]);
  return !binaryExtensions.has(ext);
}

async function writeTextFile(filePath, content, { force }) {
  if (!force && (await exists(filePath))) {
    return false;
  }
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf8');
  return true;
}

async function loadSkillMetadata(skillsDir) {
  const result = [];
  const root = await safeStat(skillsDir);
  if (!root || !root.isDirectory()) return result;

  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const skillPath = path.join(skillsDir, slug, 'SKILL.md');
    if (!(await exists(skillPath))) continue;
    const content = await fs.readFile(skillPath, 'utf8');
    const frontmatter = parseFrontmatter(content);
    result.push({
      slug,
      name: frontmatter.name || slug,
      description: frontmatter.description || '',
      path: skillPath,
    });
  }

  result.sort((a, b) => a.slug.localeCompare(b.slug));
  return result;
}

async function loadRuleMetadata(rulesDir) {
  const result = [];
  const root = await safeStat(rulesDir);
  if (!root || !root.isDirectory()) return result;

  const entries = await fs.readdir(rulesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    result.push({
      file: entry.name,
      path: path.join(rulesDir, entry.name),
    });
  }

  result.sort((a, b) => a.file.localeCompare(b.file));
  return result;
}

function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0] !== '---') return {};
  const data = {};
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === '---') break;
    const index = line.indexOf(':');
    if (index <= 0) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, '');
    data[key] = value;
  }
  return data;
}

function buildCodexAgents({
  projectRoot,
  projectName,
  skills,
  rules,
  packRoot,
}) {
  const lines = [];
  lines.push(`# AGENTS.md instructions for ${projectName}`);
  lines.push('');
  lines.push('## Agent Flutter Local Pack');
  lines.push(`This project uses local instructions installed at \`${packRoot}\`.`);
  lines.push('');
  lines.push('### Available skills');
  for (const skill of skills) {
    lines.push(
      `- ${skill.slug}: ${skill.description || 'No description'} (file: ${path.posix.join(packRoot, 'skills', skill.slug, 'SKILL.md')})`,
    );
  }
  lines.push('');
  lines.push('### Available rules');
  for (const rule of rules) {
    lines.push(`- ${rule.file} (file: ${path.posix.join(packRoot, 'rules', rule.file)})`);
  }
  lines.push('');
  lines.push('### Trigger rules');
  lines.push('- If a task clearly matches a skill description, apply that skill first.');
  lines.push('- Apply matching rule files before making code changes.');
  lines.push('- Keep generated docs/specs updated when UI or API behavior changes.');
  lines.push('');
  lines.push('### Location policy');
  lines.push(`- Project root: ${toPosixPath(projectRoot)}`);
  lines.push(`- Local pack root: \`${packRoot}\``);
  return `${lines.join('\n')}\n`;
}

function buildCursorRule() {
  return `---
description: Agent Flutter local skills and rules
alwaysApply: false
---
Use local instructions from \`.cursor\`.

Priority:
1. \`.cursor/rules/shared/ui.md\`
2. \`.cursor/rules/shared/integration-api.md\`
3. \`.cursor/rules/shared/ci-cd-pr.md\`
4. \`.cursor/rules/shared/unit-test.md\` and \`.cursor/rules/shared/widget-test.md\`

When a task matches a skill, load the corresponding \`SKILL.md\` under:
\`.cursor/skills/<skill>/SKILL.md\`

For new project scaffolding, run:
\`bash .cursor/scripts/bootstrap_flutter_template.sh\`
`;
}

function buildWindsurfRule() {
  return `# Agent Flutter Rules

Use local instructions in \`.windsurf\`.

Required order:
1. Apply relevant files in \`.windsurf/rules/shared/\`.
2. If task matches a skill, load \`.windsurf/skills/<skill>/SKILL.md\`.
3. For new project scaffolding, run \`bash .windsurf/scripts/bootstrap_flutter_template.sh\`.
4. Keep spec documentation synchronized after UI/API changes.
5. For completed UI/API features, follow \`.windsurf/rules/shared/ci-cd-pr.md\` before handoff.
`;
}

function buildClineRule() {
  return `# Agent Flutter Cline Rule

This repository uses local instructions in \`.clinerules\`.

Execution checklist:
1. Read matching rule files under \`.clinerules/rules\`.
2. Apply matching skills from \`.clinerules/skills\`.
3. For new project scaffolding, run \`bash .clinerules/scripts/bootstrap_flutter_template.sh\`.
4. Preserve Flutter architecture conventions and localization requirements.
5. Update docs/specs after behavior changes.
6. For completed UI/API features, follow \`.clinerules/rules/ci-cd-pr.md\` before handoff.
`;
}

function buildGithubCopilotInstructions() {
  return `# Agent Flutter Copilot Instructions

This repository uses local instruction packs in \`.github/skills\`, \`.github/rules\`, and \`.github/scripts\`.

Follow this order when generating code:
1. Read applicable files in \`.github/rules/\`.
2. If task matches a skill, read \`.github/skills/<skill>/SKILL.md\`.
3. For new project scaffolding, run \`bash .github/scripts/bootstrap_flutter_template.sh\`.
4. Keep architecture, localization, and UI conventions aligned with local instructions.
5. Update specs/docs when UI/API behavior changes.
6. For completed UI/API features, follow \`.github/rules/ci-cd-pr.md\` before final handoff.
`;
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function safeStat(filePath) {
  try {
    return await fs.stat(filePath);
  } catch {
    return null;
  }
}

async function copyFileMode(fromPath, toPath) {
  try {
    const fromStat = await fs.stat(fromPath);
    await fs.chmod(toPath, fromStat.mode);
  } catch {
    // ignore permission propagation failures on unsupported filesystems
  }
}

function toPosixPath(value) {
  return String(value || '').replaceAll('\\', '/');
}

function stripTrailingSlash(value) {
  if (value.endsWith('/')) return value.slice(0, -1);
  return value;
}
