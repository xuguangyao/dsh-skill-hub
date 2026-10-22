#!/usr/bin/env node
/**
 * build-catalog.mjs — builds catalog/skills.json for the DSH "skill market" plugin.
 *
 * Data source: live ClawHub + SkillHub public APIs. Metadata only; no skill bodies
 * are downloaded or bundled.
 *
 * Usage:
 *   node scripts/build-catalog.mjs
 *
 * The script is re-runnable: it recreates the output from scratch on every run.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'catalog');
const OUT_FILE = join(OUT_DIR, 'skills.json');
const REPORT_FILE = join(__dirname, 'catalog-report.txt');

const USER_AGENT = 'dsh-skill-hub/1.0';

const CLAWHUB_LIST = 'https://clawhub.ai/api/v1/skills';
const SKILLHUB_LIST = 'https://api.skillhub.cn/api/skills';

const CLAWHUB_PAGES = 5;
const SKILLHUB_PAGES = 6;
const PAGE_SIZE = 50;

const TARGET_CLAWHUB = 142;
const TARGET_SKILLHUB = 20;
const MAX_TOTAL = 180; // keeps the shipped catalog inside the 120..180 validation window
const MIN_ZH_SUMMARIES = 30;
const KEY_CATEGORY_MIN = 25;
const THIN_CATEGORY_MIN = 6;
const KEY_CATEGORIES = ['agent', 'dev', 'office', 'search'];

const CATEGORIES = [
  { key: 'agent', name: '智能体增强', nameEn: 'Agent Boost' },
  { key: 'search', name: '搜索调研', nameEn: 'Search & Research' },
  { key: 'dev', name: '开发编程', nameEn: 'Development' },
  { key: 'office', name: '办公文档', nameEn: 'Office & Docs' },
  { key: 'data', name: '数据分析', nameEn: 'Data & Analytics' },
  { key: 'design', name: '设计创意', nameEn: 'Design & Creative' },
  { key: 'writing', name: '写作内容', nameEn: 'Writing' },
  { key: 'media', name: '音视频图像', nameEn: 'Media' },
  { key: 'ops', name: '运维部署', nameEn: 'DevOps' },
  { key: 'security', name: '安全合规', nameEn: 'Security' },
  { key: 'productivity', name: '效率工具', nameEn: 'Productivity' },
  { key: 'education', name: '教育学习', nameEn: 'Education' },
  { key: 'other', name: '其他', nameEn: 'Other' },
];
const CATEGORY_KEYS = new Set(CATEGORIES.map((c) => c.key));
const CATEGORY_PRIORITY = [
  'search', 'dev', 'office', 'data', 'design', 'media',
  'writing', 'ops', 'security', 'productivity', 'education', 'agent', 'other',
];

/** SkillHub category slug -> catalog category. */
const HUB_CATEGORY_MAP = {
  'ai-agent': 'agent',
  'data-analysis': 'data',
  'design-media': 'design',
  'knowledge-management': 'productivity',
  'office-efficiency': 'office',
  'dev-programming': 'dev',
  education: 'education',
  'content-creation': 'writing',
  'business-ops': 'productivity',
  'it-ops-security': 'ops',
  'life-service': 'other',
  professional: 'other',
};

/**
 * Keyword heuristics. Each entry is a regex tested against individual text fields.
 * Weights: hub category 6, sub-category 3, tag 3, name 2, summary 1, zh summary 1.
 */
const KEYWORDS = {
  agent: [
    /agents?\b/, /multi[- ]?agent/, /agentic/, /memory/, /prompt/, /skill/, /orchestrat/,
    /workflow/, /automation/, /autonomous/, /self[- ]?improv/, /\bcontext\b/, /subagent/,
    /智能体/, /记忆/, /提示词/, /编排/, /自动化/, /多\s?agent/i, /框架/, /上下文/, /工作流/,
  ],
  search: [
    /\bsearch/, /research/, /scrap/, /crawl/, /browser/, /\bserp\b/, /web\s?search/, /\bnews\b/,
    /\brss\b/, /retriev/, /\brag\b/, /tavily/, /exa\b/, /perplexity/, /搜索/, /检索/, /调研/,
    /抓取/, /爬虫/, /新闻/, /信息检索/, /资料查询/, /查资料/,
  ],
  dev: [
    /\bcode\b/, /coding/, /github/, /\bgit\b/, /develop/, /debug/, /\btest/, /\bapi\b/, /\bjson\b/,
    /typescript|javascript|python|rust|\bgolang\b|\bjava\b/, /refactor/, /code review/,
    /backend/, /frontend/, /\bsdk\b/, /\bcli\b/, /http/, /代码/, /开发/, /编程/, /调试/, /测试/,
    /接口/, /前端/, /后端/, /数据库/, /代码审查/, /代码生成/, /仓库/, /重构/,
  ],
  office: [
    /\bpdf\b/, /docx/, /\bword\b/, /xlsx/, /excel/, /ppt/i, /powerpoint/, /slides?\b/,
    /spreadsheet/, /office/, /document/, /keynote/, /wps/, /表格/, /文档/, /幻灯片/, /演示文稿/,
    /办公/, /公文/, /pdf\s?处理/, /排版/, /标书/,
  ],
  data: [
    /\bdata\b/, /analytics/, /\bsql\b/, /\bchart/, /dashboard/, /statistic/, /\bcsv\b/,
    /visuali[sz]/, /\bstocks?\b/, /financ/, /invest/, /\bquant\b/, /数据/, /分析/, /可视化/,
    /报表/, /统计/, /洞察/, /指标/, /股票/, /金融/, /投研/, /财务/,
  ],
  design: [
    /design/, /figma/, /\bui\b/, /\bux\b/, /\bcss\b/, /logo/, /\bicon/, /illustrat/, /pixel/,
    /\bimage/, /diagram/, /\bbrand/, /poster/, /banner/, /设计/, /视觉/, /图标/, /配色/, /海报/,
    /界面/, /排版设计/, /ui\s?设计/, /品牌/, /配图/,
  ],
  writing: [
    /\bwrit/, /\bseo\b/, /translat/, /blog/, /copywrit/, /\bcopy\b/, /\bcontent\b/, /humaniz/,
    /grammar/, /marketing/, /写作/, /文章/, /翻译/, /文案/, /改写/, /自媒体/, /选题/, /润色/,
    /公众号/, /摘要总结/, /营销/,
  ],
  media: [
    /video/, /audio/, /music/, /photo/, /voice/, /speech/, /\btts\b/, /subtitle/, /podcast/,
    /speaker/, /sonos/, /camera/, /youtube/, /spotify/, /remotion/, /视频/, /音频/, /音乐/, /配音/,
    /图片生成/, /图像/, /摄影/, /字幕/, /剪辑/, /数字人/, /影视/,
  ],
  ops: [
    /docker/, /kubernetes|\bk8s\b/, /deploy/, /ci\/cd/, /devops/, /server/, /nginx/, /terraform/,
    /ansible/, /\bbackup/, /linux/, /systemd/, /infra/, /运维/, /部署/, /服务器/, /容器/, /监控/,
    /发布/, /备份/,
  ],
  security: [
    /security/, /audit/, /vulnerab/, /compliance/, /\bprivacy\b/, /malware/, /pentest/,
    /guardrail/, /injection/, /password/, /secret/, /安全/, /合规/, /审计/, /漏洞/, /隐私/,
    /风控/, /权限/, /存证/,
  ],
  productivity: [
    /calendar/, /email/, /gmail/, /\btask/, /notion/, /obsidian/, /\btodo\b/, /reminder/,
    /schedul/, /slack/, /workspace/, /\bdrive\b/, /discord/, /feishu/, /telegram/, /messaging/,
    /summari[sz]/, /productivit/, /knowledge/, /\bphone\b/, /知识库/, /笔记/, /日程/, /邮件/,
    /待办/, /任务/, /效率/, /资料整理/, /摘要/, /清单/, /客服/,
  ],
  education: [
    /educat/, /teach/, /\bcourse/, /\bexam/, /tutor/, /quiz/, /教学/, /课程/, /教育/, /考试/,
    /辅导/, /讲解/, /学习/, /科研/, /论文/, /学术/, /单词/,
  ],
};

const CJK_RE = /[\u4e00-\u9fff]/;
const WARNINGS = [];

/** SkillHub authors often decorate names with a ".Skill" suffix; strip it before keyword matching. */
function classificationName(name) {
  const stripped = name.replace(/(?:[^\w]|[\u4e00-\u9fff])\s*skill\b\.?$/i, '').trim();
  return stripped || name;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function warn(message) {
  WARNINGS.push(message);
  console.warn(`[warn] ${message}`);
}

/** Fetch JSON with UA header, timeout and 2 retries (500ms / 1500ms backoff). */
async function fetchJson(url, label) {
  const delays = [500, 1500];
  let lastError;
  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
        signal: AbortSignal.timeout(25_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (error) {
      lastError = error;
      if (attempt < delays.length) {
        warn(`${label}: attempt ${attempt + 1} failed (${error.message}); retrying in ${delays[attempt]}ms`);
        await sleep(delays[attempt]);
      }
    }
  }
  throw new Error(`${label}: failed after 3 attempts (${lastError?.message})`);
}

async function loadClawhubPool() {
  const items = [];
  let cursor = null;
  for (let page = 1; page <= CLAWHUB_PAGES; page += 1) {
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), sort: 'downloads' });
    if (cursor) params.set('cursor', cursor);
    let payload;
    try {
      payload = await fetchJson(`${CLAWHUB_LIST}?${params}`, `clawhub page ${page}`);
    } catch (error) {
      warn(`${error.message}; continuing with ${items.length} ClawHub items already fetched`);
      break;
    }
    const pageItems = Array.isArray(payload?.items) ? payload.items : [];
    items.push(...pageItems);
    cursor = typeof payload?.nextCursor === 'string' ? payload.nextCursor : null;
    if (!pageItems.length || !cursor) break;
    await sleep(200);
  }
  return items;
}

async function loadSkillhubPool() {
  const items = [];
  for (let page = 1; page <= SKILLHUB_PAGES; page += 1) {
    // `sortBy=downloads` is required for a stable, popularity-ranked page window:
    // without it SkillHub returns an unstable ranking and pages overlap heavily.
    let payload;
    try {
      payload = await fetchJson(
        `${SKILLHUB_LIST}?page=${page}&pageSize=${PAGE_SIZE}&sortBy=downloads`,
        `skillhub page ${page}`,
      );
    } catch (error) {
      warn(`${error.message}; continuing with ${items.length} SkillHub items already fetched`);
      break;
    }
    const pageItems = Array.isArray(payload?.data?.skills) ? payload.data.skills : [];
    items.push(...pageItems);
    if (pageItems.length < PAGE_SIZE) break;
    await sleep(200);
  }
  return items;
}

const toNumber = (value) => (Number.isFinite(value) ? value : 0);

function cleanText(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim();
}

function clip(text, max = 220) {
  const value = cleanText(text);
  if (!value) return '';
  if (value.length <= max) return value;
  const cut = value.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const base = lastSpace > max * 0.7 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,;:.-]+$/, '')}…`;
}

function buildTags(candidates, category) {
  const seen = new Set();
  const tags = [];
  for (const raw of candidates) {
    if (typeof raw !== 'string') continue;
    let tag = cleanText(raw);
    if (!tag) continue;
    if (tag.length > 24) tag = `${tag.slice(0, 23)}…`;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
    if (tags.length === 5) break;
  }
  if (!tags.length) tags.push(category);
  return tags;
}

/** Weighted keyword scoring over structured signals. */
function classify(signals) {
  const scores = new Map();
  const bump = (category, amount) => scores.set(category, (scores.get(category) ?? 0) + amount);

  const hubCategory = signals.hubCategory ? HUB_CATEGORY_MAP[signals.hubCategory] : undefined;
  if (hubCategory) bump(hubCategory, 6);

  for (const [category, patterns] of Object.entries(KEYWORDS)) {
    const test = (text) => patterns.some((re) => re.test(text));

    for (const sub of signals.subCategories) {
      if (test(sub.toLowerCase())) bump(category, 3);
    }
    for (const tag of signals.tags) {
      if (test(tag.toLowerCase())) bump(category, 3);
    }
    if (signals.name && test(signals.name.toLowerCase())) bump(category, 3);
    if (signals.summaryEn && test(signals.summaryEn.toLowerCase())) bump(category, 1);
    if (signals.summaryZh && test(signals.summaryZh)) bump(category, 1);
  }

  const ranked = [...scores.entries()]
    .filter(([key]) => key !== 'other')
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return CATEGORY_PRIORITY.indexOf(a[0]) - CATEGORY_PRIORITY.indexOf(b[0]);
    });

  const best = ranked[0];
  if (!best) return 'other';

  // A clear signal (name, tag or category) beats weak incidental matches, and a
  // specific category beats the generic "agent" bucket on a tie.
  const SPECIFIC_MIN = 3;
  const FALLBACK_MIN = 2;
  const specific = ranked.find(([key, score]) => score >= SPECIFIC_MIN && key !== 'agent');
  if (specific) return specific[0];
  if (best[1] >= SPECIFIC_MIN) return best[0];
  if (best[1] >= FALLBACK_MIN) return best[0];
  return 'other';
}

function normalizeClawhub(item, hubBySlug) {
  const slug = cleanText(item?.slug);
  const owner = cleanText(item?.ownerHandle);
  const name = cleanText(item?.displayName) || slug;
  const version = cleanText(item?.latestVersion?.version);
  if (!slug || !name || !version || !owner) return null;

  const summaryEn = clip(item.summary || item.description || '');
  if (!summaryEn) return null;

  const mirror = hubBySlug.get(slug.toLowerCase());
  const mirrorZh = cleanText(mirror?.description_zh || mirror?.summary_zh || '');
  const summaryZh = CJK_RE.test(mirrorZh) ? clip(mirrorZh) : '';
  const summary = summaryZh || summaryEn;

  const topics = Array.isArray(item.topics) ? item.topics : [];

  const category = classify({
    name: classificationName(name),
    summaryEn,
    summaryZh,
    tags: topics,
    subCategories: [],
    hubCategory: '',
  });
  const tags = buildTags(topics, category);

  const updatedAt = toNumber(item.updatedAt) || toNumber(item.createdAt);

  return {
    id: `clawhub:${slug}`,
    source: 'clawhub',
    slug,
    owner,
    name,
    summary,
    summaryEn,
    category,
    tags,
    stats: {
      downloads: toNumber(item?.stats?.downloads),
      installs: toNumber(item?.stats?.installs),
      stars: toNumber(item?.stats?.stars),
    },
    version,
    updatedAt,
    security: 'unknown',
    requiresApiKey: false,
    pageUrl: `https://clawhub.ai/${encodeURIComponent(owner)}/${encodeURIComponent(slug)}`,
  };
}

function normalizeSkillhub(item) {
  const slug = cleanText(item?.slug);
  const name = cleanText(item?.name);
  const owner = cleanText(item?.ownerName) || cleanText(item?.namespace?.handle);
  const version = cleanText(item?.version);
  if (!slug || !name || !version || !owner) return null;

  const description = cleanText(item?.description || item?.summary || '');
  const descriptionZh = cleanText(item?.description_zh || item?.summary_zh || '');
  const zhCandidate = CJK_RE.test(descriptionZh) ? descriptionZh : '';
  const summaryEn = clip(description || descriptionZh || name);
  const summary = zhCandidate ? clip(zhCandidate) : summaryEn;
  if (!summaryEn || !summary) return null;

  const subCategories = Array.isArray(item?.subCategories)
    ? item.subCategories.map((s) => cleanText(s?.name)).filter(Boolean)
    : [];
  const rawTags = Array.isArray(item?.tags) ? item.tags : [];

  const category = classify({
    name: classificationName(name),
    summaryEn,
    summaryZh: zhCandidate,
    tags: [...subCategories, ...rawTags],
    subCategories,
    hubCategory: cleanText(item?.category),
  });

  const tags = buildTags([...subCategories, ...rawTags], category);
  const updatedAt = toNumber(item?.updated_at) || toNumber(item?.created_at);

  return {
    id: `skillhub:${slug}`,
    source: 'skillhub',
    slug,
    owner,
    name,
    summary,
    summaryEn,
    category,
    tags,
    stats: {
      downloads: toNumber(item?.downloads),
      installs: toNumber(item?.installs),
      stars: toNumber(item?.stars),
    },
    version,
    updatedAt,
    security: item?.verified === true ? 'verified' : 'unknown',
    requiresApiKey: String(item?.labels?.requires_api_key ?? '') === 'true',
    pageUrl: `https://skillhub.cn/skills/${encodeURIComponent(slug)}`,
  };
}

function popularity(skill) {
  return skill.stats.downloads + skill.stats.installs + skill.stats.stars;
}

/** Deduplicate by lowercase slug, keeping the most downloaded copy. */
function dedupeBySlug(skills) {
  const map = new Map();
  for (const skill of skills) {
    const key = skill.slug.toLowerCase();
    const existing = map.get(key);
    if (!existing || skill.stats.downloads > existing.stats.downloads) map.set(key, skill);
  }
  return [...map.values()];
}

function selectCatalog(clawPool, hubPool) {
  const chosen = [];
  const usedSlugs = new Set();

  const add = (skill) => {
    const key = skill.slug.toLowerCase();
    if (usedSlugs.has(key)) return false;
    usedSlugs.add(key);
    chosen.push(skill);
    return true;
  };

  const clawSorted = [...clawPool].sort((a, b) => b.stats.downloads - a.stats.downloads);
  for (const skill of clawSorted.slice(0, TARGET_CLAWHUB)) add(skill);

  const hubSorted = [...hubPool].sort((a, b) => popularity(b) - popularity(a));
  let hubPicked = 0;
  for (const skill of hubSorted) {
    if (hubPicked >= TARGET_SKILLHUB || chosen.length >= MAX_TOTAL) break;
    if (add(skill)) hubPicked += 1;
  }

  const countByCategory = () => {
    const counts = Object.fromEntries(CATEGORIES.map((c) => [c.key, 0]));
    for (const skill of chosen) counts[skill.category] += 1;
    return counts;
  };

  // Fill under-represented key categories from the still-unused pool, best-downloads first.
  for (const category of KEY_CATEGORIES) {
    let counts = countByCategory();
    if (counts[category] >= KEY_CATEGORY_MIN) continue;
    const candidates = [...clawSorted.slice(TARGET_CLAWHUB), ...hubSorted]
      .filter((skill) => skill.category === category)
      .sort((a, b) => b.stats.downloads - a.stats.downloads);
    for (const candidate of candidates) {
      counts = countByCategory();
      if (counts[category] >= KEY_CATEGORY_MIN || chosen.length >= MAX_TOTAL) break;
      add(candidate);
    }
  }

  // Improve the home grid by lifting very thin categories out of the single digits.
  const floorFor = (key) => (KEY_CATEGORIES.includes(key) ? KEY_CATEGORY_MIN : THIN_CATEGORY_MIN);
  const remainingCandidates = (preferClawhub = false) => [...clawSorted.slice(TARGET_CLAWHUB), ...hubSorted]
    .filter((skill) => !usedSlugs.has(skill.slug.toLowerCase()))
    .sort((a, b) => {
      if (preferClawhub && a.source !== b.source) return a.source === 'clawhub' ? -1 : 1;
      return b.stats.downloads - a.stats.downloads;
    });

  // Spend any leftover slots first.
  for (const key of CATEGORY_PRIORITY) {
    if (key === 'other') continue;
    for (const candidate of remainingCandidates()) {
      if (chosen.length >= MAX_TOTAL) break;
      if ((countByCategory()[key] ?? 0) >= floorFor(key)) break;
      if (candidate.category === key) add(candidate);
    }
  }

  // Then repair the remaining deficits by trading surplus entries, so the total stays fixed.
  const zhCount = () => chosen.filter((skill) => CJK_RE.test(skill.summary)).length;
  const remove = (skill) => {
    const index = chosen.findIndex((entry) => entry.id === skill.id);
    if (index === -1) return;
    chosen.splice(index, 1);
    usedSlugs.delete(skill.slug.toLowerCase());
  };
  let swaps = 0;
  for (let guard = 0; guard < 40; guard += 1) {
    const counts = countByCategory();
    const deficits = CATEGORY_PRIORITY
      .filter((key) => key !== 'other' && (counts[key] ?? 0) < floorFor(key))
      .sort((a, b) => ((counts[a] ?? 0) - floorFor(a)) - ((counts[b] ?? 0) - floorFor(b)));
    if (!deficits.length) break;
    const target = deficits[0];
    const candidate = remainingCandidates(true).find((skill) => skill.category === target);
    if (!candidate) break;

    const removable = chosen
      .filter((skill) => !skill.featured && skill.category !== target)
      .filter((skill) => (counts[skill.category] ?? 0) > floorFor(skill.category))
      .filter((skill) => !(CJK_RE.test(skill.summary) && zhCount() <= MIN_ZH_SUMMARIES))
      .sort((a, b) => {
        const aOther = a.category === 'other' ? 0 : 1;
        const bOther = b.category === 'other' ? 0 : 1;
        if (aOther !== bOther) return aOther - bOther;
        const aSurplus = (counts[a.category] ?? 0) - floorFor(a.category);
        const bSurplus = (counts[b.category] ?? 0) - floorFor(b.category);
        if (aSurplus !== bSurplus) return bSurplus - aSurplus;
        return a.stats.downloads - b.stats.downloads;
      })[0];
    if (!removable) break;
    remove(removable);
    add(candidate);
    swaps += 1;
  }
  if (swaps > 0) console.log(`rebalance: swapped ${swaps} entr(ies) to fill under-represented categories`);

  const finalCounts = countByCategory();
  for (const key of CATEGORY_PRIORITY) {
    if (key === 'other') continue;
    if ((finalCounts[key] ?? 0) < floorFor(key)) {
      warn(`category "${key}" has only ${finalCounts[key]} entries (floor ${floorFor(key)})`);
    }
  }

  // Guarantee enough Chinese summaries by adding SkillHub-native entries.
  if (zhCount() < MIN_ZH_SUMMARIES) {
    const zhCandidates = hubSorted.filter((skill) => CJK_RE.test(skill.summary));
    for (const candidate of zhCandidates) {
      if (zhCount() >= MIN_ZH_SUMMARIES || chosen.length >= MAX_TOTAL) break;
      add(candidate);
    }
  }

  // Never exceed the shipped size budget: drop non-key-category entries with lowest downloads.
  if (chosen.length > MAX_TOTAL) {
    const removable = chosen
      .filter((skill) => !KEY_CATEGORIES.includes(skill.category))
      .sort((a, b) => a.stats.downloads - b.stats.downloads);
    const excess = chosen.length - MAX_TOTAL;
    const dropIds = new Set(removable.slice(0, excess).map((skill) => skill.id));
    for (let i = chosen.length - 1; i >= 0; i -= 1) {
      if (dropIds.has(chosen[i].id)) chosen.splice(i, 1);
    }
    if (chosen.length > MAX_TOTAL) {
      warn(`catalog still has ${chosen.length} entries after trimming (cap ${MAX_TOTAL})`);
    }
  }

  return chosen;
}

function markFeatured(skills) {
  const usedCategories = new Set();
  const featuredIds = new Set();
  const byDownloads = [...skills].sort((a, b) => b.stats.downloads - a.stats.downloads);
  for (const skill of byDownloads) {
    if (featuredIds.size >= 12) break;
    if (usedCategories.has(skill.category)) continue;
    usedCategories.add(skill.category);
    featuredIds.add(skill.id);
  }
  for (const skill of skills) {
    if (featuredIds.has(skill.id)) skill.featured = true;
  }
}

function sortSkills(skills) {
  return skills.sort((a, b) => {
    const af = a.featured ? 1 : 0;
    const bf = b.featured ? 1 : 0;
    if (af !== bf) return bf - af;
    if (b.stats.downloads !== a.stats.downloads) return b.stats.downloads - a.stats.downloads;
    return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0;
  });
}

function buildReport(catalog, stats) {
  const lines = [];
  lines.push('DSH skill-hub catalog build report');
  lines.push(`generatedAt: ${catalog.generatedAt} (${new Date(catalog.generatedAt).toISOString()})`);
  lines.push('');
  lines.push(`total skills: ${catalog.skills.length}`);
  lines.push(`by source: clawhub=${stats.bySource.clawhub}, skillhub=${stats.bySource.skillhub}`);
  lines.push(`featured: ${stats.featured}`);
  lines.push(`chinese summaries: ${stats.zh} (clawhub=${stats.zhBySource.clawhub}, skillhub=${stats.zhBySource.skillhub})`);
  lines.push(`unique ids: ${stats.uniqueIds}`);
  lines.push('');
  lines.push('selection:');
  lines.push(`  fetched: clawhub=${stats.pools.clawFetched}, skillhub=${stats.pools.hubFetched} raw items`);
  lines.push(`  normalized pools: clawhub=${stats.pools.clawNormalized}, skillhub=${stats.pools.hubNormalized}`);
  lines.push(`  targets: ~${TARGET_CLAWHUB} clawhub + ~${TARGET_SKILLHUB} skillhub, hard cap ${MAX_TOTAL}`);
  lines.push(`  category floors: ${KEY_CATEGORIES.join('/')} >= ${KEY_CATEGORY_MIN}, others >= ${THIN_CATEGORY_MIN}`);
  lines.push('');
  lines.push('by category:');
  for (const category of CATEGORIES) {
    lines.push(`  ${category.key.padEnd(13)} ${String(stats.byCategory[category.key] ?? 0).padStart(3)}  ${category.name}`);
  }
  lines.push('');
  lines.push('checks:');
  for (const check of stats.checks) lines.push(`  [${check.ok ? 'PASS' : 'FAIL'}] ${check.label}`);
  lines.push('');
  lines.push(`warnings (${WARNINGS.length}):`);
  if (!WARNINGS.length) lines.push('  none');
  for (const message of WARNINGS) lines.push(`  - ${message}`);
  lines.push('');
  lines.push('limitations:');
  lines.push('  - ClawHub exposes no per-skill security verdict in the list endpoint, so security is "unknown"' +
    ' for every clawhub entry (detail/moderation calls are intentionally avoided).');
  lines.push('  - SkillHub\'s default listing order is unstable and overlaps between pages, so the pool is' +
    ' fetched with the undocumented sortBy=downloads parameter to get a deterministic, popularity-ranked window.');
  lines.push('  - Chinese summaries come from SkillHub records matched by slug; unmatched ClawHub entries fall' +
    ' back to their English upstream summary. summaryEn is the raw upstream text, so it is Chinese for' +
    ' Chinese-native SkillHub skills (no English source exists).');
  lines.push(`  - ${stats.bySource.skillhub} SkillHub entries are shipped: ${TARGET_SKILLHUB} from the popularity` +
    ' window plus extras used to satisfy per-category floors and Chinese coverage.');
  lines.push('  - Categories are keyword heuristics over topics/tags/taxonomy/name/summary; a few edge cases may' +
    ' land in a neighbouring category.');
  lines.push('  - featured = top 12 by downloads with at most one entry per category.');
  return `${lines.join('\n')}\n`;
}

function validate(catalog, stats) {
  const checks = [];
  const push = (label, ok) => checks.push({ label, ok });

  push(`skills length ${catalog.skills.length} within 120..180`, catalog.skills.length >= 120 && catalog.skills.length <= 180);
  push('categories count is 13', catalog.categories.length === 13);
  push('ids unique', new Set(catalog.skills.map((s) => s.id)).size === catalog.skills.length);
  push('slugs unique', new Set(catalog.skills.map((s) => s.slug.toLowerCase())).size === catalog.skills.length);
  push('all category keys valid', catalog.skills.every((s) => CATEGORY_KEYS.has(s.category)));
  push('all required fields present', catalog.skills.every((s) =>
    Boolean(s.id && s.source && s.slug && s.owner && s.name && s.summary && s.summaryEn && s.category &&
      Array.isArray(s.tags) && s.tags.length > 0 && s.tags.length <= 5 &&
      s.stats && Number.isFinite(s.stats.downloads) && Number.isFinite(s.stats.installs) &&
      Number.isFinite(s.stats.stars) && s.version && Number.isFinite(s.updatedAt) &&
      ['verified', 'benign', 'unknown', 'flagged'].includes(s.security) &&
      typeof s.requiresApiKey === 'boolean')));
  for (const category of KEY_CATEGORIES) {
    push(`${category} >= ${KEY_CATEGORY_MIN} (${stats.byCategory[category] ?? 0})`, (stats.byCategory[category] ?? 0) >= KEY_CATEGORY_MIN);
  }
  push(`chinese summaries >= ${MIN_ZH_SUMMARIES} (${stats.zh})`, stats.zh >= MIN_ZH_SUMMARIES);
  stats.checks = checks;
  return checks.every((check) => check.ok);
}

async function main() {
  console.log(`Fetching ClawHub (up to ${CLAWHUB_PAGES} pages) and SkillHub (up to ${SKILLHUB_PAGES} pages)...`);
  const [clawRaw, hubRaw] = await Promise.all([loadClawhubPool(), loadSkillhubPool()]);
  console.log(`Raw items: clawhub=${clawRaw.length}, skillhub=${hubRaw.length}`);

  const hubNormalized = dedupeBySlug(
    hubRaw.map((item) => normalizeSkillhub(item)).filter(Boolean),
  );
  const hubBySlug = new Map(hubNormalized.map((skill) => [skill.slug.toLowerCase(), skill]));
  const clawNormalized = dedupeBySlug(
    clawRaw.map((item) => normalizeClawhub(item, hubBySlug)).filter(Boolean),
  );

  const dropped = (clawRaw.length + hubRaw.length) - (clawNormalized.length + hubNormalized.length);
  if (dropped > 0) warn(`${dropped} raw item(s) dropped for missing slug/name/version or duplicates`);

  console.log(`Normalized pools: clawhub=${clawNormalized.length}, skillhub=${hubNormalized.length}`);

  const skills = selectCatalog(clawNormalized, hubNormalized);
  markFeatured(skills);
  sortSkills(skills);

  const catalog = {
    version: 1,
    generatedAt: Date.now(),
    categories: CATEGORIES,
    skills,
  };

  const bySource = { clawhub: 0, skillhub: 0 };
  const byCategory = Object.fromEntries(CATEGORIES.map((c) => [c.key, 0]));
  for (const skill of catalog.skills) {
    bySource[skill.source] += 1;
    byCategory[skill.category] += 1;
  }
  const stats = {
    bySource,
    byCategory,
    featured: catalog.skills.filter((s) => s.featured).length,
    zh: catalog.skills.filter((s) => CJK_RE.test(s.summary)).length,
    zhBySource: {
      clawhub: catalog.skills.filter((s) => s.source === 'clawhub' && CJK_RE.test(s.summary)).length,
      skillhub: catalog.skills.filter((s) => s.source === 'skillhub' && CJK_RE.test(s.summary)).length,
    },
    uniqueIds: new Set(catalog.skills.map((s) => s.id)).size,
    pools: {
      clawFetched: clawRaw.length,
      hubFetched: hubRaw.length,
      clawNormalized: clawNormalized.length,
      hubNormalized: hubNormalized.length,
    },
    checks: [],
  };

  const ok = validate(catalog, stats);

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  await writeFile(REPORT_FILE, buildReport(catalog, stats), 'utf8');

  console.log('');
  console.log('--- catalog summary ---');
  console.log(`generatedAt : ${catalog.generatedAt} (${new Date(catalog.generatedAt).toISOString()})`);
  console.log(`total       : ${catalog.skills.length}`);
  console.log(`by source   : clawhub=${bySource.clawhub}, skillhub=${bySource.skillhub}`);
  console.log(`featured    : ${stats.featured}`);
  console.log(`zh summaries: ${stats.zh} (clawhub=${stats.zhBySource.clawhub}, skillhub=${stats.zhBySource.skillhub})`);
  console.log('by category :');
  for (const category of CATEGORIES) {
    console.log(`  ${category.key.padEnd(13)} ${String(byCategory[category.key]).padStart(3)}  ${category.name}`);
  }
  console.log(`warnings    : ${WARNINGS.length}`);
  for (const check of stats.checks) {
    console.log(`  [${check.ok ? 'PASS' : 'FAIL'}] ${check.label}`);
  }
  console.log(`\nwrote ${OUT_FILE}`);
  console.log(`wrote ${REPORT_FILE}`);

  if (!ok) {
    console.error('catalog validation failed — see FAIL lines above');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`fatal: ${error.stack || error.message}`);
  process.exitCode = 1;
});