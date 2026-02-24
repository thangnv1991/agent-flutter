import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SUPPORTED_IDES = ['trae', 'codex', 'cursor', 'windsurf', 'cline'];

const USAGE = `
agent-flutter

Usage:
  npx agent-flutter@latest init [--ide all|trae,codex,cursor,windsurf,cline] [--cwd <project_dir>] [--force]
  npx agent-flutter@latest list [--cwd <project_dir>]

Commands:
  init   Install shared Flutter skills/rules and IDE adapters.
  list   Print available skills/rules from the shared pack.
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

  const sharedTarget = path.join(projectRoot, '.agent-flutter');
  if ((await exists(sharedTarget)) && !force) {
    console.log(`Using existing shared pack: ${sharedTarget}`);
  } else {
    await copyTemplateDirectory({
      sourceDir: templateRoot,
      destinationDir: sharedTarget,
      projectRoot,
      force: true,
    });
    console.log(`Installed shared pack: ${sharedTarget}`);
  }

  if (ideTargets.has('trae')) {
    const traeTarget = path.join(projectRoot, '.trae');
    if ((await exists(traeTarget)) && !force) {
      console.log(`Skipped Trae adapter (exists): ${traeTarget}`);
    } else {
      await copyTemplateDirectory({
        sourceDir: templateRoot,
        destinationDir: traeTarget,
        projectRoot,
        force: true,
      });
      console.log(`Installed Trae adapter: ${traeTarget}`);
    }
  }

  const skills = await loadSkillMetadata(path.join(sharedTarget, 'skills'));
  const rules = await loadRuleMetadata(path.join(sharedTarget, 'rules'));

  if (ideTargets.has('codex')) {
    const agentsPath = path.join(projectRoot, 'AGENTS.md');
    const written = await writeTextFile(
      agentsPath,
      buildCodexAgents({
        projectRoot,
        projectName: path.basename(projectRoot),
        skills,
        rules,
      }),
      { force },
    );
    console.log(
      written
        ? `Installed Codex adapter: ${agentsPath}`
        : `Skipped Codex adapter (exists): ${agentsPath}`,
    );
  }

  if (ideTargets.has('cursor')) {
    const cursorPath = path.join(projectRoot, '.cursor', 'rules', 'agent-flutter.mdc');
    const written = await writeTextFile(
      cursorPath,
      buildCursorRule(),
      { force },
    );
    console.log(
      written
        ? `Installed Cursor adapter: ${cursorPath}`
        : `Skipped Cursor adapter (exists): ${cursorPath}`,
    );
  }

  if (ideTargets.has('windsurf')) {
    const windsurfPath = path.join(projectRoot, '.windsurf', 'rules', 'agent-flutter.md');
    const written = await writeTextFile(
      windsurfPath,
      buildWindsurfRule(),
      { force },
    );
    console.log(
      written
        ? `Installed Windsurf adapter: ${windsurfPath}`
        : `Skipped Windsurf adapter (exists): ${windsurfPath}`,
    );
  }

  if (ideTargets.has('cline')) {
    const clinePath = path.join(projectRoot, '.clinerules', 'agent-flutter.md');
    const written = await writeTextFile(
      clinePath,
      buildClineRule(),
      { force },
    );
    console.log(
      written
        ? `Installed Cline adapter: ${clinePath}`
        : `Skipped Cline adapter (exists): ${clinePath}`,
    );
  }

  console.log('');
  console.log('Done.');
  console.log('Use --force to overwrite existing adapters.');
}

async function runList(options) {
  const projectRoot = path.resolve(options.get('cwd', process.cwd()));
  const sharedTarget = path.join(projectRoot, '.agent-flutter');
  const templateRoot = await exists(sharedTarget)
    ? sharedTarget
    : path.join(getPackageRoot(), 'templates', 'shared');

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

function buildCodexAgents({ projectRoot, projectName, skills, rules }) {
  const lines = [];
  lines.push(`# AGENTS.md instructions for ${projectName}`);
  lines.push('');
  lines.push('## Agent Flutter Shared Pack');
  lines.push('This project uses a shared local pack installed at `.agent-flutter`.');
  lines.push('');
  lines.push('### Available skills');
  for (const skill of skills) {
    lines.push(
      `- ${skill.slug}: ${skill.description || 'No description'} (file: ${toPosixPath(skill.path)})`,
    );
  }
  lines.push('');
  lines.push('### Available rules');
  for (const rule of rules) {
    lines.push(`- ${rule.file} (file: ${toPosixPath(rule.path)})`);
  }
  lines.push('');
  lines.push('### Trigger rules');
  lines.push('- If a task clearly matches a skill description, apply that skill first.');
  lines.push('- Apply matching rule files before making code changes.');
  lines.push('- Keep generated docs/specs updated when UI or API behavior changes.');
  lines.push('');
  lines.push('### Location policy');
  lines.push(`- Project root: ${toPosixPath(projectRoot)}`);
  lines.push('- Shared pack root: `.agent-flutter`');
  lines.push('- Do not duplicate skill/rule content outside the shared pack unless required.');
  return `${lines.join('\n')}\n`;
}

function buildCursorRule() {
  return `---
description: Agent Flutter shared skills and rules
alwaysApply: false
---
Use shared instructions from \`.agent-flutter\`.

Priority:
1. \`.agent-flutter/rules/ui.md\`
2. \`.agent-flutter/rules/integration-api.md\`
3. \`.agent-flutter/rules/document-workflow-function.md\`
4. \`.agent-flutter/rules/unit-test.md\` and \`.agent-flutter/rules/widget-test.md\`

When a task matches a skill, load the corresponding \`SKILL.md\` under:
\`.agent-flutter/skills/<skill>/SKILL.md\`
`;
}

function buildWindsurfRule() {
  return `# Agent Flutter Rules

Use the shared rule/skill pack at \`.agent-flutter\`.

Required order:
1. Apply relevant files in \`.agent-flutter/rules/\`.
2. If task matches a skill, load \`.agent-flutter/skills/<skill>/SKILL.md\`.
3. Keep spec documentation synchronized after UI/API changes.
`;
}

function buildClineRule() {
  return `# Agent Flutter Cline Rule

This repository uses shared instructions in \`.agent-flutter\`.

Execution checklist:
1. Read matching rule files under \`.agent-flutter/rules\`.
2. Apply matching skills from \`.agent-flutter/skills\`.
3. Preserve Flutter architecture conventions and localization requirements.
4. Update docs/specs after behavior changes.
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

function toPosixPath(value) {
  return String(value || '').replaceAll('\\', '/');
}

function stripTrailingSlash(value) {
  if (value.endsWith('/')) return value.slice(0, -1);
  return value;
}
