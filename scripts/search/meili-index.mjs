#!/usr/bin/env node
/**
 * 把 docs/ 下的 Markdown 灌入 Meilisearch。
 *
 * 用法：
 *   MEILI_HOST=http://127.0.0.1:7700 \
 *   MEILI_ADMIN_KEY=<master key 或 admin key> \
 *   node scripts/search/meili-index.mjs [--no-clear] [--locale zh-Hans]
 *
 * 说明：
 *   - 按「二级/三级标题」切块，每块一条记录；长段落再按空行二次切分。
 *     Meilisearch 官方建议段落级切分，长文会削弱 proximity 排序。
 *   - 只用 Node 内置 fetch，无需额外依赖。
 *   - 默认先清空旧文档，避免已删除页面残留在索引里。
 */

import fs from 'node:fs';
import path from 'node:path';

const HOST = (process.env.MEILI_HOST || 'http://127.0.0.1:7700').replace(/\/$/, '');
const ADMIN_KEY = process.env.MEILI_ADMIN_KEY || process.env.MEILI_MASTER_KEY || '';
const INDEX = process.env.MEILI_INDEX || 'wiki_docs';
// --locale 参数优先，其次环境变量
const localeFlag = process.argv.indexOf('--locale');
const LOCALE =
  localeFlag > -1 && process.argv[localeFlag + 1]
    ? process.argv[localeFlag + 1]
    : process.env.MEILI_LOCALE || 'zh-Hans';
const DOCS_ROOT = path.resolve(process.cwd(), 'docs');
const CLEAR = !process.argv.includes('--no-clear');

// 铁路/游戏专名：告诉分词器这些是完整词，别被切开
const DICTIONARY = ['SimRail', 'Maszyna', 'TD2', 'ISDR', 'TPF2', '波兰铁路'];

if (!ADMIN_KEY) {
  console.error('✗ 缺少 MEILI_ADMIN_KEY（或 MEILI_MASTER_KEY）');
  process.exit(1);
}

async function meili(pathname, {method = 'GET', body} = {}) {
  const res = await fetch(`${HOST}${pathname}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ADMIN_KEY}`,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`${method} ${pathname} -> ${res.status} ${await res.text()}`);
  }
  return res.status === 204 ? null : res.json();
}

async function waitTask(taskUid) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    const task = await meili(`/tasks/${taskUid}`);
    if (task.status === 'succeeded') return task;
    if (task.status === 'failed') {
      throw new Error(`任务失败: ${JSON.stringify(task.error)}`);
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`任务 ${taskUid} 超时`);
}

/** 解析 frontmatter（只需要 title / description / slug，够用即可） */
function parseFrontMatter(raw) {
  const fm = {};
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) return {fm, body: raw};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^\s*([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return {fm, body: raw.slice(m[0].length)};
}

/** 去掉 Markdown 语法，只留可检索的纯文本 */
function toPlainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ') // 代码块
    .replace(/`([^`]*)`/g, '$1') // 行内代码
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接
    .replace(/<[^>]+>/g, ' ') // 内联 HTML
    .replace(/^\s{0,3}>\s?/gm, '') // 引用
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // 标题的 # 号
    .replace(/[*_~]/g, '')
    .replace(/^\s*[-+*]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 按标题切块；过长的块再按句子/空行切一次 */
function splitSections(body) {
  const chunks = [];
  let current = {section: '', lines: []};
  const push = () => {
    const text = toPlainText(current.lines.join('\n'));
    if (text) chunks.push({section: current.section, text});
    current = {section: '', lines: []};
  };
  for (const line of body.split(/\r?\n/)) {
    const h = /^(#{2,6})\s+(.+?)\s*#*$/.exec(line);
    if (h) {
      push();
      current.section = h[2];
      continue;
    }
    current.lines.push(line);
  }
  push();

  // 二次切分：单块超过 800 字时按句号/空行断开，保证排序质量
  const result = [];
  for (const c of chunks) {
    if (c.text.length <= 800) {
      result.push(c);
      continue;
    }
    let buf = '';
    for (const piece of c.text.split(/(?<=[。！？；.!?;])/)) {
      if ((buf + piece).length > 800 && buf) {
        result.push({section: c.section, text: buf.trim()});
        buf = '';
      }
      buf += piece;
    }
    if (buf.trim()) result.push({section: c.section, text: buf.trim()});
  }
  return result;
}

/** 文档 id 只允许字母数字、-、_ */
function safeId(raw) {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '-');
}

function docUrl(game, relPath, fm) {
  const rel = relPath.replace(/\.mdx?$/, '');
  const base = rel === 'index' || rel.endsWith('/index') ? rel.replace(/\/?index$/, '') : rel;
  if (fm.slug) {
    return fm.slug === '/' ? `/${game}/` : `/${game}/${fm.slug.replace(/^\//, '')}`;
  }
  return base ? `/${game}/${base}` : `/${game}/`;
}

function collect() {
  const docs = [];
  if (!fs.existsSync(DOCS_ROOT)) return docs;
  for (const game of fs.readdirSync(DOCS_ROOT)) {
    const gameDir = path.join(DOCS_ROOT, game);
    if (!fs.statSync(gameDir).isDirectory()) continue;

    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (/\.mdx?$/.test(entry.name)) {
          const relPath = path.relative(gameDir, full).split(path.sep).join('/');
          const {fm, body} = parseFrontMatter(fs.readFileSync(full, 'utf8'));
          const url = docUrl(game, relPath, fm);
          const pageTitle = fm.title || path.basename(relPath, path.extname(relPath));
          const sections = splitSections(body);
          const blocks = sections.length ? sections : [{section: '', text: toPlainText(body)}];

          blocks.forEach((block, i) => {
            if (!block.text) return;
            docs.push({
              id: safeId(`${game}-${relPath}-${i}`),
              pageId: url,
              game,
              locale: LOCALE,
              url: block.section ? url : url,
              title: pageTitle,
              section: block.section || '',
              breadcrumb: [game, pageTitle, block.section].filter(Boolean).join(' › '),
              description: fm.description || '',
              content: block.text,
            });
          });
        }
      }
    };
    walk(gameDir);
  }
  return docs;
}

async function main() {
  // 不回显地址：MEILI_HOST 是机密（可能含内网 IP / 端口），写进日志就等于泄露
  console.log(`==> 索引: ${INDEX}（Meilisearch 地址已配置，不回显）`);
  // 索引不存在时创建（已存在则返回错误，忽略即可）
  await meili('/indexes', {method: 'POST', body: {uid: INDEX, primaryKey: 'id'}}).catch(() => {});

  const docs = collect();
  console.log(`==> 共解析出 ${docs.length} 个片段`);

  if (CLEAR) {
    const task = await meili(`/indexes/${INDEX}/documents`, {method: 'DELETE'});
    await waitTask(task.taskUid);
    console.log('==> 已清空旧索引');
  }

  for (let i = 0; i < docs.length; i += 200) {
    const batch = docs.slice(i, i + 200);
    const task = await meili(`/indexes/${INDEX}/documents`, {method: 'POST', body: batch});
    await waitTask(task.taskUid);
    console.log(`    写入 ${Math.min(i + 200, docs.length)}/${docs.length}`);
  }

  const settings = await meili(`/indexes/${INDEX}/settings`, {
    method: 'PATCH',
    body: {
      searchableAttributes: ['title', 'section', 'description', 'content', 'breadcrumb'],
      filterableAttributes: ['game', 'locale', 'pageId'],
      distinctAttribute: 'pageId', // 每个页面只保留最相关的一个片段
      dictionary: DICTIONARY,
      typoTolerance: {enabled: true, minWordSizeForTypos: {oneTypo: 5, twoTypos: 9}},
      pagination: {maxTotalHits: 500},
    },
  });
  await waitTask(settings.taskUid);
  console.log('==> 索引设置已更新');
  console.log(`✅ 完成：${docs.length} 个片段已写入 ${INDEX}`);
}

main().catch((err) => {
  // fetch 失败等错误信息里可能夹带完整地址，统一打码后再输出
  const hostPart = HOST.replace(/^https?:\/\//, '');
  const message = String((err && err.message) || err)
    .split(HOST)
    .join('<meili-host>')
    .split(hostPart)
    .join('<meili-host>');
  console.error('✗ 失败:', message);
  process.exit(1);
});
