#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const HELP = `
Download Figma MCP assets to feature-scoped folders.

Usage:
  node tool/download_figma_mcp_assets.mjs --assets <json_file> --feature <feature_name> [options]

Required:
  --assets      Path to JSON file containing asset URL mapping from Figma MCP.
  --feature     Feature name, e.g. home_demo.

Options:
  --icons-dir   Target icon directory. Default: assets/images/icons/<feature>
  --images-dir  Target image directory. Default: assets/images/<feature>
  --report      Output mapping report path. Default: spec/figma-assets/<feature>-asset-map.json
  --overwrite   Overwrite existing files.
  --dry-run     Fetch and print mapping without writing files.
  --help        Show this message.
`;

function parseArgs(argv) {
  const args = new Map();
  const flags = new Set();

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      throw new Error(`Unknown argument: ${token}`);
    }

    const key = token.slice(2);
    if (key === 'overwrite' || key === 'dry-run' || key === 'help') {
      flags.add(key);
      continue;
    }

    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      throw new Error(`Missing value for ${token}`);
    }
    args.set(key, next);
    i += 1;
  }

  return {
    get(name, fallback = null) {
      return args.has(name) ? args.get(name) : fallback;
    },
    has(name) {
      return flags.has(name);
    },
  };
}

function toSnakeCase(value) {
  return String(value || '')
    .replace(/\.[^/.]+$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function toCamelCase(value) {
  const parts = toSnakeCase(value)
    .split('_')
    .filter(Boolean);
  if (!parts.length) return 'asset';
  return parts[0] + parts.slice(1).map((item) => item[0].toUpperCase() + item.slice(1)).join('');
}

function toPascalCase(value) {
  return toSnakeCase(value)
    .split('_')
    .filter(Boolean)
    .map((item) => item[0].toUpperCase() + item.slice(1))
    .join('') || 'Asset';
}

function toPosix(value) {
  return String(value).replaceAll('\\', '/');
}

function resolveEntries(raw) {
  if (Array.isArray(raw)) {
    return raw
      .map((item, index) => {
        if (typeof item === 'string') {
          return { key: `asset_${index + 1}`, url: item };
        }
        if (item && typeof item === 'object') {
          const key = String(item.key ?? item.name ?? item.id ?? `asset_${index + 1}`);
          const url = item.url ?? item.src ?? item.href;
          return { key, url: typeof url === 'string' ? url : null };
        }
        return null;
      })
      .filter(Boolean)
      .filter((item) => item.url);
  }

  if (raw && typeof raw === 'object') {
    const nested = raw.assets ?? raw.downloadUrls ?? raw.urls;
    if (nested && typeof nested === 'object') {
      return resolveEntries(nested);
    }

    return Object.entries(raw)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => ({ key, url: value }));
  }

  return [];
}

function extensionFromContentType(contentType) {
  const type = String(contentType || '').toLowerCase();
  if (type.includes('image/svg+xml')) return '.svg';
  if (type.includes('image/png')) return '.png';
  if (type.includes('image/jpeg')) return '.jpg';
  if (type.includes('image/webp')) return '.webp';
  if (type.includes('image/gif')) return '.gif';
  return null;
}

function extensionFromPathname(urlString) {
  try {
    const ext = path.extname(new URL(urlString).pathname || '').toLowerCase();
    if (['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) {
      return ext === '.jpeg' ? '.jpg' : ext;
    }
    return null;
  } catch {
    return null;
  }
}

function extensionFromBuffer(buffer) {
  const head = buffer.subarray(0, 64).toString('utf8').trimStart().toLowerCase();
  if (head.startsWith('<svg') || head.startsWith('<?xml')) return '.svg';
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return '.png';
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return '.jpg';
  }
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return '.webp';
  }
  return '.bin';
}

async function ensureUniquePath(basePath, overwrite) {
  if (overwrite) return basePath;

  try {
    await fs.access(basePath);
  } catch {
    return basePath;
  }

  const ext = path.extname(basePath);
  const name = basePath.slice(0, -ext.length);
  let index = 1;
  while (true) {
    const candidate = `${name}_${index}${ext}`;
    try {
      await fs.access(candidate);
      index += 1;
    } catch {
      return candidate;
    }
  }
}

function guessIsIcon(entryKey, ext) {
  if (ext === '.svg') return true;
  return /(^|[_-])(icon|icons|ic)($|[_-])/i.test(entryKey);
}

async function downloadAsset(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  return {
    buffer,
    contentType: response.headers.get('content-type'),
  };
}

function buildConstantName({ feature, key, ext, isIcon }) {
  const featurePrefix = toCamelCase(feature);
  const featureSnake = toSnakeCase(feature);
  const normalizedKey = toSnakeCase(key);
  let trimmedKey = normalizedKey.startsWith(`${featureSnake}_`)
    ? normalizedKey.slice(featureSnake.length + 1)
    : normalizedKey;
  if (isIcon && trimmedKey.startsWith('icon_')) {
    trimmedKey = trimmedKey.slice('icon_'.length);
  }
  if (!isIcon && (trimmedKey.startsWith('img_') || trimmedKey.startsWith('image_'))) {
    trimmedKey = trimmedKey.replace(/^img_|^image_/, '');
  }
  const keyName = toPascalCase(trimmedKey || normalizedKey);
  const suffix = ext.replace('.', '');
  const extSuffix = suffix ? suffix[0].toUpperCase() + suffix.slice(1) : 'Asset';
  const typePrefix = isIcon ? 'Icon' : 'Img';
  return `${featurePrefix}${typePrefix}${keyName}${extSuffix}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.has('help')) {
    console.log(HELP.trim());
    return;
  }

  const assetsPath = args.get('assets');
  const feature = args.get('feature');
  if (!assetsPath || !feature) {
    throw new Error('Missing required options: --assets and --feature');
  }

  const iconsDir = args.get('icons-dir', path.join('assets', 'images', 'icons', feature));
  const imagesDir = args.get('images-dir', path.join('assets', 'images', feature));
  const reportPath = args.get('report', path.join('spec', 'figma-assets', `${feature}-asset-map.json`));
  const overwrite = args.has('overwrite');
  const dryRun = args.has('dry-run');

  const rawContent = await fs.readFile(assetsPath, 'utf8');
  const parsed = JSON.parse(rawContent);
  const entries = resolveEntries(parsed).filter((item) => /^https?:\/\//i.test(item.url));

  if (!entries.length) {
    throw new Error(`No valid URL entries found in: ${assetsPath}`);
  }

  const reportItems = [];
  let successCount = 0;
  let failureCount = 0;

  for (const item of entries) {
    const rawKey = item.key || 'asset';
    const normalizedKey = toSnakeCase(rawKey) || 'asset';

    try {
      const { buffer, contentType } = await downloadAsset(item.url);
      const ext =
        extensionFromPathname(item.url)
        || extensionFromContentType(contentType)
        || extensionFromBuffer(buffer);

      const isIcon = guessIsIcon(normalizedKey, ext);
      const targetDir = isIcon ? iconsDir : imagesDir;
      const targetName = `${normalizedKey}${ext}`;
      const absoluteTarget = await ensureUniquePath(path.resolve(targetDir, targetName), overwrite);
      const relativeTarget = toPosix(path.relative(process.cwd(), absoluteTarget) || absoluteTarget);
      const constantName = buildConstantName({
        feature,
        key: normalizedKey,
        ext,
        isIcon,
      });

      if (!dryRun) {
        await fs.mkdir(path.dirname(absoluteTarget), { recursive: true });
        await fs.writeFile(absoluteTarget, buffer);
      }

      reportItems.push({
        key: rawKey,
        url: item.url,
        type: isIcon ? 'icon' : 'image',
        output: relativeTarget,
        constantName,
        contentType: contentType || '',
      });
      successCount += 1;
      console.log(`${dryRun ? '[DRY-RUN] ' : ''}Saved ${rawKey} -> ${relativeTarget}`);
    } catch (error) {
      failureCount += 1;
      console.error(`Failed ${rawKey}: ${error.message}`);
    }
  }

  const report = {
    feature,
    source: toPosix(path.relative(process.cwd(), path.resolve(assetsPath))),
    generatedAt: new Date().toISOString(),
    total: entries.length,
    success: successCount,
    failed: failureCount,
    items: reportItems,
  };

  const reportAbsolute = path.resolve(reportPath);
  if (!dryRun) {
    await fs.mkdir(path.dirname(reportAbsolute), { recursive: true });
    await fs.writeFile(reportAbsolute, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(`Report written: ${toPosix(path.relative(process.cwd(), reportAbsolute))}`);
  } else {
    console.log(JSON.stringify(report, null, 2));
  }

  if (failureCount > 0) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
