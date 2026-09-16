#!/usr/bin/env node
/**
 * 同一 docs 实例内的 URL slug 重复检查
 *
 * 用法：
 *   node scripts/check-slug.mjs
 *   INSTANCES="simrail,maszyna" node scripts/check-slug.mjs   # 只查指定实例
 *
 * 背景：
 *   Docusaurus 会把每篇文档按 permalink 注册进路由表，同一实例内出现两条相同
 *   permalink 时后加载的会覆盖先加载的（页面丢失、链接随机跳错）。
 *   而 `npm run build` 对此只在日志里打 WARNING（Duplicate routes found!），
 *   构建照样成功、CI 照样绿，等到线上才发现就晚了。这里把它提前到 PR 阶段拦住，
 *   并且直接指出是哪几个文件冲突。
 *
 * 约定（与当前 docusaurus.config.js 一致）：
 *   docs/ 下的每个顶层目录 = 一个实例，实例 id 同时是该实例的 routeBasePath。
 *
 * 解析规则尽量与 @docusaurus/plugin-content-docs 对齐：
 *   - 收录 docs/<实例>/ 下的 .md / .mdx；`_` 开头的文件与目录、`__tests__/`、
 *     `*.test.*` 视为 partial 跳过
 *   - frontmatter 的 slug 以 `/` 开头 → 相对实例根；否则相对所在目录（支持 `../`）
 *   - 没有 slug 时取文件名（去扩展名），并剥掉数字前缀（`02-faq` → `faq`）
 *   - `index` / `README` / 与所在目录同名的文件视为该目录的首页
 *   - permalink = `/<routeBasePath>` + slug
 *   - 比较时忽略结尾多余的斜杠（`/foo` 与 `/foo/` 视为同一条路由）
 *
 * 限制：只识别 frontmatter 顶层的简单标量（`slug: xxx` / `id: xxx`）。
 *       多级嵌套、块标量、流集合等写法不参与 slug 解析（与 Docusaurus 一样取不到值）。
 *
 * 退出码：0 = 无重复；1 = 存在重复（CI / PR 门禁据此失败）
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..');
const DOCS_ROOT = path.join(ROOT, 'docs');

const INCLUDE_EXTENSIONS = new Set(['.md', '.mdx']);

// 与 @docusaurus/plugin-content-docs 的 DefaultNumberPrefixParser 保持一致
// 形如 7.0-foo / 2021-11-foo 的「版本号」「日期」不当作数字前缀
const IGNORED_PREFIX_PATTERN = /^\d+[-_.]\d+/;
const NUMBER_PREFIX_PATTERN = /^(\d+)\s*[-_.]+\s*([^-_.\s].*)$/;

function stripNumberPrefix(segment) {
  if (IGNORED_PREFIX_PATTERN.test(segment)) {
    return segment;
  }
  const match = NUMBER_PREFIX_PATTERN.exec(segment);
  return match ? match[2] : segment;
}

function stripPathNumberPrefixes(relativePath) {
  return relativePath.split('/').map(stripNumberPrefix).join('/');
}

// ---------------------------------------------------------------------------
// 文件收集：include = ['**/*.{md,mdx}']，exclude = GlobExcludeDefault
// ---------------------------------------------------------------------------

function isIgnoredSource(relativePath) {
  const segments = relativePath.split('/');
  return (
    segments.some((segment) => segment.startsWith('_') || segment === '__tests__') ||
    // *.test.{js,jsx,ts,tsx,md,mdx}
    /(^|\/)[^/]+\.test\.[^/]+$/.test(relativePath)
  );
}

function collectSources(dir) {
  const found = [];
  if (!fs.existsSync(dir)) {
    return found;
  }
  const walk = (current, prefix) => {
    for (const entry of fs.readdirSync(current, {withFileTypes: true})) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(path.join(current, entry.name), relative);
      } else if (
        entry.isFile() &&
        INCLUDE_EXTENSIONS.has(path.extname(entry.name)) &&
        !isIgnoredSource(relative)
      ) {
        found.push(relative);
      }
    }
  };
  walk(dir, '');
  return found.sort();
}

// ---------------------------------------------------------------------------
// frontmatter：只取顶层简单标量
// ---------------------------------------------------------------------------

function parseScalarValue(rawValue) {
  const value = rawValue.trim();
  // 注释行、块标量、流集合一律不解析
  if (!value || value.startsWith('#') || value === '|' || value === '>') {
    return undefined;
  }
  if (value.startsWith('[') || value.startsWith('{')) {
    return undefined;
  }
  const quote = value[0];
  if (quote === '"' || quote === "'") {
    const closing = value.indexOf(quote, 1);
    return closing > 0 ? value.slice(1, closing) : undefined;
  }
  // YAML 的行尾注释必须前面有空白，`slug: a#b` 里的 # 是内容本身
  const commentIndex = value.search(/\s#/);
  return (commentIndex === -1 ? value : value.slice(0, commentIndex)).trim();
}

function parseFrontMatter(content) {
  // 统一换行并处理 BOM（源码里用 \uFEFF 转义，避免留下不可见字符）
  const text = content.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const lines = text.split('\n');
  if (lines[0].trim() !== '---') {
    return {};
  }
  const endIndex = lines.findIndex((line, index) => index > 0 && /^(---|\.\.\.)[ \t]*$/.test(line));
  if (endIndex === -1) {
    return {};
  }

  const frontMatter = {};
  for (let i = 1; i < endIndex; i += 1) {
    const match = /^([A-Za-z_][\w-]*):[ \t]*(.*)$/.exec(lines[i]);
    if (!match) {
      continue;
    }
    const [, key, rawValue] = match;
    const value = parseScalarValue(rawValue);
    if (value !== undefined && frontMatter[key] === undefined) {
      frontMatter[key] = value;
    }
  }
  return frontMatter;
}

// ---------------------------------------------------------------------------
// slug 解析：对应 plugin-content-docs 的 lib/slug.js
// ---------------------------------------------------------------------------

function addLeadingSlash(value) {
  return value.startsWith('/') ? value : `/${value}`;
}

function addTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}

function isCategoryIndex(source, sourceDirName) {
  const fileName = path.posix.parse(source).name.toLowerCase();
  const parentDir = sourceDirName.split('/').reverse()[0];
  return ['index', 'readme', parentDir.toLowerCase()].includes(fileName);
}

function resolvePathname(to, from) {
  if (to.startsWith('/')) {
    return to;
  }
  const segments = from.split('/').slice(0, -1);
  for (const part of to.split('/')) {
    if (!part || part === '.') {
      continue;
    }
    if (part === '..') {
      segments.pop();
    } else {
      segments.push(part);
    }
  }
  return addLeadingSlash(segments.join('/'));
}

function computeDocSlug(source, frontMatter) {
  const fileNameWithoutExtension = path.posix.basename(source, path.posix.extname(source));
  const sourceDirName = path.posix.dirname(source); // 根目录下的文件是 '.'
  const baseID = frontMatter.id ?? stripNumberPrefix(fileNameWithoutExtension);

  const dirNameSlug =
    sourceDirName === '.'
      ? '/'
      : addLeadingSlash(addTrailingSlash(stripPathNumberPrefixes(sourceDirName)));

  const frontMatterSlug = frontMatter.slug;
  if (typeof frontMatterSlug === 'string' && frontMatterSlug.startsWith('/')) {
    return frontMatterSlug;
  }
  if (!frontMatterSlug && isCategoryIndex(source, sourceDirName)) {
    return dirNameSlug;
  }
  return resolvePathname(frontMatterSlug ?? baseID, dirNameSlug);
}

// npm run build 出来的路由登记形式，尾斜杠差异不构成两条路由
function routeKey(permalink) {
  return permalink === '/' ? permalink : permalink.replace(/\/+$/, '');
}

function normalizePermalink(segments) {
  return addLeadingSlash(segments.filter(Boolean).join('/').replace(/\/{2,}/g, '/'));
}

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------

function listInstances() {
  if (!fs.existsSync(DOCS_ROOT)) {
    return [];
  }
  const all = fs
    .readdirSync(DOCS_ROOT, {withFileTypes: true})
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort();

  const requested = (process.env.INSTANCES ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
  return requested.length > 0 ? requested : all;
}

function checkInstance(instance) {
  const instanceDir = path.join(DOCS_ROOT, instance);
  const sources = collectSources(instanceDir);

  /** @type {Map<string, Array<{file: string, slug: string, from: string}>>} */
  const routes = new Map();

  for (const source of sources) {
    const content = fs.readFileSync(path.join(instanceDir, source), 'utf8');
    const frontMatter = parseFrontMatter(content);
    const slug = computeDocSlug(source, frontMatter);
    const permalink = normalizePermalink([`/${instance}`, slug]);
    const from = frontMatter.slug ? `frontmatter slug: ${frontMatter.slug}` : '文件路径推导';
    const entries = routes.get(routeKey(permalink)) ?? [];
    entries.push({file: `docs/${instance}/${source}`, slug: permalink, from});
    routes.set(routeKey(permalink), entries);
  }

  return {instance, sources, routes};
}

const instances = listInstances();

if (instances.length === 0) {
  console.error('❌ 没有找到任何 docs 实例，检查 docs/ 目录是否存在');
  process.exit(1);
}

console.log(`==> 实例数: ${instances.length} | ${instances.join(', ')}`);
console.log();

const conflicts = [];
let totalDocs = 0;

for (const instance of instances) {
  const {sources, routes} = checkInstance(instance);
  totalDocs += sources.length;

  const duplicates = [...routes.entries()].filter(([, entries]) => entries.length > 1);
  if (duplicates.length === 0) {
    console.log(`--- ${instance}: ${sources.length} 篇文档，无重复 slug`);
    continue;
  }

  console.log(`--- ${instance}: ${sources.length} 篇文档，发现 ${duplicates.length} 组重复 slug`);
  for (const [route, entries] of duplicates) {
    console.log(`    ✗ ${route}`);
    for (const entry of entries) {
      console.log(`        ${entry.file}   (${entry.from})`);
    }
  }
  conflicts.push({instance, duplicates});
}

console.log();

if (conflicts.length === 0) {
  console.log(`✅ slug 重复检查通过：${instances.length} 个实例 / ${totalDocs} 篇文档，路由唯一`);
  process.exit(0);
}

console.log(`❌ slug 重复检查失败：${conflicts.length} 个实例内存在 ${conflicts.reduce((sum, c) => sum + c.duplicates.length, 0)} 组重复路由`);
console.log();
console.log('修复方式（任选其一）：');
console.log('  1. 给不该占用该 URL 的那篇加一个唯一的 slug：');
console.log('       ---');
console.log('       slug: /新的路径');
console.log('       ---');
console.log('  2. 合并或删除重复的文档；');
console.log('  3. 顺手检查是否只是文件名数字前缀（02-faq.md 与 faq.md 会撞车）。');
process.exit(1);
