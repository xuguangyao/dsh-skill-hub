/**
 * Skill Market — Host half.
 *
 * Provides:
 *  - a bundled curated catalog (catalog/skills.json) served through four
 *    authenticated Fetch routes under /api/skill-market;
 *  - live ClawHub / SkillHub search, detail and file reads;
 *  - install / uninstall into `<DSH_HOME>/skills` with a managed marker;
 *  - a `skills` provider so installed market skills reach agents without
 *    requiring the filesystem provider to be enabled separately.
 *
 * No third-party dependencies: only node: builtins and the global fetch.
 */

import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PACKAGE_DIR = path.dirname(fileURLToPath(import.meta.url))
const CATALOG_FILE = path.join(PACKAGE_DIR, 'catalog', 'skills.json')
const META_FILE = '.skill-market.json'
const USER_AGENT = 'dsh-skill-hub/1.0'
const CLAWHUB_BASE = 'https://clawhub.ai'
const SKILLHUB_BASE = 'https://api.skillhub.cn'

const LIMITS = {
  maxFileSize: 5 * 1024 * 1024,
  maxTotalSize: 20 * 1024 * 1024,
  maxFileCount: 200,
  previewBytes: 300 * 1024,
  searchCap: 40,
  bodyBytes: 64 * 1024,
}

const DEFAULT_CATEGORIES = [
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
]

const LANG_BY_EXT = {
  md: 'markdown', markdown: 'markdown', ts: 'typescript', tsx: 'typescript',
  js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
  json: 'json', yaml: 'yaml', yml: 'yaml', sh: 'bash', bash: 'bash', zsh: 'bash',
  ps1: 'powershell', py: 'python', toml: 'toml', css: 'css', html: 'html',
  txt: 'text', xml: 'xml', sql: 'sql', rs: 'rust', go: 'go', rb: 'ruby',
  java: 'java', c: 'c', h: 'c', cpp: 'cpp', cs: 'csharp', vue: 'vue', svelte: 'svelte',
}

class HttpError extends Error {
  constructor(status, code, message) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
  }
}

class UpstreamError extends Error {
  constructor(source, code, message) {
    super(message)
    this.name = 'UpstreamError'
    this.source = source
    this.code = code
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  })
}

function fold(text) {
  return String(text ?? '').normalize('NFKC').toLowerCase()
}

function asString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function asNumber(value, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function clampText(value, max = 220) {
  const text = asString(value).replace(/\s+/g, ' ').trim()
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

function languageOf(filename) {
  const ext = String(filename).split('.').pop()?.toLowerCase() ?? ''
  return LANG_BY_EXT[ext] ?? 'text'
}

function sha256(content) {
  return createHash('sha256').update(content, 'utf8').digest('hex')
}

function sanitizeDirName(slug) {
  const name = String(slug ?? '').toLowerCase()
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(name)) return null
  if (name.includes('..')) return null
  return name
}

function parseSkillId(id) {
  const raw = String(id ?? '')
  const at = raw.indexOf(':')
  if (at <= 0) return null
  const source = raw.slice(0, at)
  const slug = raw.slice(at + 1)
  if ((source !== 'clawhub' && source !== 'skillhub') || !slug) return null
  return { source, slug, id: `${source}:${slug}` }
}

function isSafeRelativePath(filePath) {
  if (typeof filePath !== 'string' || !filePath || filePath.length > 512) return false
  if (filePath.includes('\0') || filePath.includes('\\')) return false
  if (path.posix.isAbsolute(filePath) || /^[A-Za-z]:/.test(filePath)) return false
  const segments = filePath.split('/')
  if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) return false
  return true
}

function detectBinary(text) {
  return text.includes('\u0000')
}

function truncatePreview(text) {
  const bytes = Buffer.byteLength(text, 'utf8')
  if (bytes <= LIMITS.previewBytes) return { content: text, size: bytes, truncated: false }
  let slice = text.slice(0, LIMITS.previewBytes)
  const size = Buffer.byteLength(slice, 'utf8')
  return { content: slice, size, truncated: true }
}

/** Minimal YAML frontmatter reader: top-level scalars, quoted values and `|` / `>` blocks. */
function parseFrontmatter(content) {
  const text = String(content ?? '').replace(/^\uFEFF/, '')
  if (!text.startsWith('---')) return { frontmatter: {}, body: text, hasFrontmatter: false }
  const end = text.indexOf('\n---', 3)
  if (end === -1) return { frontmatter: {}, body: text, hasFrontmatter: false }
  const header = text.slice(3, end).replace(/^\r?\n/, '')
  let body = text.slice(end + 4)
  if (body.startsWith('\r\n')) body = body.slice(2)
  else if (body.startsWith('\n')) body = body.slice(1)

  const frontmatter = {}
  let pendingKey = null
  let pendingStyle = null
  let pendingLines = []
  const flush = () => {
    if (pendingKey === null) return
    const raw = pendingStyle === '|'
      ? pendingLines.join('\n')
      : pendingLines.join(' ').replace(/\s+/g, ' ').trim()
    frontmatter[pendingKey] = raw
    pendingKey = null
    pendingStyle = null
    pendingLines = []
  }

  for (const line of header.split(/\r?\n/)) {
    if (pendingKey !== null) {
      if (/^\s+/.test(line) || line.trim() === '') {
        pendingLines.push(line.replace(/^\s{2,}/, ''))
        continue
      }
      flush()
    }
    const match = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/)
    if (!match) continue
    const key = match[1]
    let value = match[2].trim()
    if (value === '|' || value === '>') {
      pendingKey = key
      pendingStyle = value
      pendingLines = []
      continue
    }
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (/^(true|yes|on|1)$/i.test(value)) frontmatter[key] = true
    else if (/^(false|no|off|0)$/i.test(value)) frontmatter[key] = false
    else frontmatter[key] = value
  }
  flush()
  return { frontmatter, body, hasFrontmatter: true }
}

function invocationOf(frontmatter) {
  const off = (value) => value === true || /^(true|yes|on|1)$/i.test(String(value))
  return {
    modelInvocable: !off(frontmatter['disable-model-invocation']),
    userInvocable: !off(frontmatter['user-invocable']),
  }
}

/** Capability hints derived from the skill body and its file names. Read-only guidance. */
function analyzeSkill(body, files, frontmatter = {}) {
  const commands = []
  const network = []
  const secrets = []
  const hooks = []

  for (const match of String(body).matchAll(/```(?:bash|sh|shell|zsh|powershell|ps1|cmd)\s*\n([\s\S]*?)```/gi)) {
    const block = match[1].trim()
    const first = block.split(/\r?\n/).map((line) => line.trim()).find(Boolean)
    if (first && !first.startsWith('#') && !commands.includes(first)) commands.push(first.slice(0, 160))
    if (commands.length >= 4) break
  }

  for (const match of String(body).matchAll(/https?:\/\/[^\s)\]"'<>]+/gi)) {
    const url = match[0].replace(/[.,;:]+$/, '')
    if (network.includes(url)) continue
    network.push(url.slice(0, 180))
    if (network.length >= 5) break
  }

  for (const match of String(body).matchAll(/\b([A-Z][A-Z0-9_]{2,}(?:_KEY|_TOKEN|_SECRET|_PASSWORD|_API_KEY))\b/g)) {
    if (secrets.includes(match[1])) continue
    secrets.push(match[1])
    if (secrets.length >= 5) break
  }

  if (frontmatter && typeof frontmatter.hooks === 'object' && frontmatter.hooks !== null) {
    for (const key of Object.keys(frontmatter.hooks)) hooks.push(key)
  }

  const scripts = (files ?? [])
    .map((file) => file.path)
    .filter((file) => /\.(sh|bash|ps1|bat|cmd|py|js|mjs|cjs|ts|rb|pl)$/i.test(file))
    .slice(0, 6)

  return { commands, network, secrets, hooks, scripts }
}

function inferTriggers(summary, whenToUse, body) {
  const triggers = []
  const push = (value) => {
    const text = clampText(value, 120)
    if (text && !triggers.includes(text)) triggers.push(text)
  }
  if (typeof whenToUse === 'string') {
    for (const part of whenToUse.split(/[;；。]\s*/)) push(part)
  }
  for (const match of String(body).matchAll(/(?:^|\n)\s*(?:Use (?:this skill )?when|When to use|Triggers?|适用于|使用场景)[:：]?\s*([^\n]{3,200})/gi)) {
    push(match[1])
  }
  if (triggers.length === 0) {
    for (const sentence of String(summary ?? '').split(/(?<=[.!?。！？])\s+/)) {
      if (sentence.trim().length >= 8) push(sentence)
      if (triggers.length >= 2) break
    }
  }
  return triggers.slice(0, 4)
}

function mapClawhubSecurity(security) {
  if (!security || typeof security !== 'object' || !security.status) {
    return { status: 'unknown', reports: [] }
  }
  const clean = security.status === 'clean'
  const benign = BENIGN_STATUS.has(String(security.status).toLowerCase())
  const flagged = /malicious|danger|fail|bad|infected/.test(String(security.status).toLowerCase())
  const reports = [{
    vendor: 'clawhub-scan',
    status: String(security.status),
    statusText: clean ? (security.hasWarnings ? 'Clean (with warnings)' : 'Clean') : `Scan status: ${security.status}`,
    reportUrl: typeof security.virustotalUrl === 'string' ? security.virustotalUrl : undefined,
  }]
  const scanners = [
    ['VirusTotal', security.scanners?.vt],
    ['skillspector', security.scanners?.skillspector],
    ['LLM review', security.scanners?.llm],
  ]
  for (const [vendor, scanner] of scanners) {
    const status = scanner?.normalizedStatus || scanner?.status
    if (typeof status !== 'string' || !status) continue
    reports.push({
      vendor,
      status,
      statusText: scanner?.recommendation ? `${status} · ${scanner.recommendation}` : status,
      summary: typeof scanner?.summary === 'string' ? scanner.summary : undefined,
      reportUrl: vendor === 'VirusTotal' && typeof security.virustotalUrl === 'string' ? security.virustotalUrl : undefined,
    })
  }
  return { status: benign ? 'benign' : flagged ? 'flagged' : 'unknown', reports }
}

const BENIGN_STATUS = new Set(['benign', 'safe', 'clean'])

function mapSkillhubSecurity(reports, verified) {
  const normalized = []
  for (const [vendor, report] of Object.entries(reports ?? {})) {
    if (!report || typeof report.status !== 'string' || !report.status) continue
    normalized.push({
      vendor,
      status: report.status,
      statusText: asString(report.statusText, report.status),
      reportUrl: typeof report.reportUrl === 'string' ? report.reportUrl : undefined,
    })
  }
  if (normalized.length === 0) return { status: 'unknown', reports: [] }
  const flagged = normalized.some((report) => !BENIGN_STATUS.has(report.status.toLowerCase()))
  if (flagged) return { status: 'flagged', reports: normalized }
  return { status: verified ? 'verified' : 'benign', reports: normalized }
}

function meaningfulChangelog(text) {
  const value = asString(text).trim()
  if (!value) return undefined
  if (/^synced by .*pipeline$/i.test(value)) return undefined
  return value
}

async function fetchText(url, { timeoutMs = 15000, source = 'upstream' } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      headers: { 'user-agent': USER_AGENT, accept: 'application/json, text/plain, */*' },
      redirect: 'follow',
      signal: controller.signal,
    })
    const text = await response.text()
    return { ok: response.ok, status: response.status, text, url: response.url }
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new UpstreamError(source, 'UPSTREAM_TIMEOUT', `${source} request timed out`)
    }
    throw new UpstreamError(source, 'UPSTREAM_NETWORK', `${source} request failed: ${error instanceof Error ? error.message : String(error)}`)
  } finally {
    clearTimeout(timer)
  }
}

async function fetchJson(url, options) {
  const result = await fetchText(url, options)
  if (!result.ok) {
    throw new UpstreamError(options?.source ?? 'upstream', 'UPSTREAM_HTTP', `upstream responded ${result.status}`)
  }
  try {
    return JSON.parse(result.text)
  } catch {
    throw new UpstreamError(options?.source ?? 'upstream', 'UPSTREAM_BAD_RESPONSE', 'upstream returned invalid JSON')
  }
}

function normalizeCatalogEntry(entry) {
  if (!entry || typeof entry !== 'object') return null
  const source = entry.source
  const slug = asString(entry.slug).trim()
  if ((source !== 'clawhub' && source !== 'skillhub') || !slug) return null
  const id = `${source}:${slug}`
  return {
    id,
    source,
    slug,
    owner: asString(entry.owner),
    name: clampText(entry.name || slug, 80),
    summary: clampText(entry.summary, 260),
    summaryEn: clampText(entry.summaryEn || entry.summary, 260),
    category: asString(entry.category, 'other'),
    tags: Array.isArray(entry.tags) ? entry.tags.filter((tag) => typeof tag === 'string' && tag).slice(0, 6) : [],
    featured: entry.featured === true,
    stats: {
      downloads: asNumber(entry.stats?.downloads),
      installs: typeof entry.stats?.installs === 'number' ? entry.stats.installs : undefined,
      stars: typeof entry.stats?.stars === 'number' ? entry.stats.stars : undefined,
    },
    version: asString(entry.version) || undefined,
    updatedAt: typeof entry.updatedAt === 'number' ? entry.updatedAt : undefined,
    securityStatus: ['verified', 'benign', 'unknown', 'flagged'].includes(entry.security) ? entry.security : 'unknown',
    securityNote: asString(entry.securityNote) || undefined,
    requiresApiKey: entry.requiresApiKey === true,
    pageUrl: asString(entry.pageUrl) || undefined,
    curated: true,
  }
}

function createMarket(ctx, config) {
  const skillsDir = path.resolve(
    asString(config?.skillsDir) ||
      process.env.DSH_SKILL_HUB_DIR ||
      path.join(process.env.DSH_HOME || path.join(homedir(), '.dsh'), 'skills'),
  )

  let catalogPromise = null
  let invalidateProvider = null
  const detailCache = new Map()
  const detailInFlight = new Map()
  const fileCache = new Map()
  const installLocks = new Set()
  const DETAIL_TTL = 5 * 60 * 1000
  const FILE_TTL = 2 * 60 * 1000

  function log(level, message) {
    const logger = ctx.logger
    if (!logger) return
    if (typeof logger[level] === 'function') logger[level](`skill-hub: ${message}`)
  }

  async function getCatalog() {
    if (!catalogPromise) {
      catalogPromise = (async () => {
        try {
          const raw = await fs.readFile(CATALOG_FILE, 'utf8')
          const data = JSON.parse(raw)
          const categories = Array.isArray(data.categories) && data.categories.length
            ? data.categories
            : DEFAULT_CATEGORIES
          const skills = Array.isArray(data.skills)
            ? data.skills.map(normalizeCatalogEntry).filter(Boolean)
            : []
          return { version: 1, generatedAt: asNumber(data.generatedAt), categories, skills }
        } catch (error) {
          log('warn', `catalog unavailable: ${error instanceof Error ? error.message : String(error)}`)
          return { version: 1, generatedAt: 0, categories: DEFAULT_CATEGORIES, skills: [] }
        }
      })()
    }
    return catalogPromise
  }

  async function readMeta(dir) {
    try {
      const raw = await fs.readFile(path.join(dir, META_FILE), 'utf8')
      const meta = JSON.parse(raw)
      return meta && typeof meta === 'object' ? meta : null
    } catch {
      return null
    }
  }

  async function scanInstalled() {
    const map = new Map()
    let entries
    try {
      entries = await fs.readdir(skillsDir, { withFileTypes: true })
    } catch {
      return map
    }
    await Promise.all(entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith('.')).map(async (entry) => {
      const dir = path.join(skillsDir, entry.name)
      const meta = await readMeta(dir)
      if (!meta || typeof meta.id !== 'string') return
      map.set(meta.id, {
        id: meta.id,
        source: asString(meta.source),
        slug: asString(meta.slug, entry.name),
        version: asString(meta.version) || undefined,
        installedAt: asString(meta.installedAt) || undefined,
        fileCount: asNumber(meta.fileCount),
        dirName: entry.name,
        path: dir,
      })
    }))
    return map
  }

  function annotate(item, installed) {
    const record = installed.get(item.id)
    return {
      ...item,
      installState: record ? 'installed' : 'installable',
      installedInfo: record
        ? { version: record.version, installedAt: record.installedAt, dirName: record.dirName }
        : undefined,
    }
  }

  function matchesQuery(item, terms) {
    if (terms.length === 0) return true
    const head = fold(`${item.name} ${item.slug}`)
    const body = fold(`${item.summary} ${item.summaryEn ?? ''} ${(item.tags ?? []).join(' ')} ${item.owner ?? ''}`)
    return terms.every((term) => head.includes(term) || body.includes(term))
  }

  function filterItems(items, params) {
    const terms = fold(params.q).split(/\s+/).filter(Boolean)
    const category = asString(params.category, 'all')
    const source = asString(params.source, 'all')
    const security = asString(params.security, 'all')
    const installedFilter = asString(params.installed, 'all')
    return items.filter((item) => {
      if (!matchesQuery(item, terms)) return false
      if (category !== 'all' && item.category !== category) return false
      if (source !== 'all' && item.source !== source) return false
      if (security !== 'all' && item.securityStatus !== security) return false
      if (installedFilter === 'installed' && item.installState !== 'installed') return false
      if (installedFilter === 'installable' && item.installState !== 'installable') return false
      return true
    })
  }

  async function categoryList(catalog) {
    const counts = new Map()
    for (const skill of catalog.skills) counts.set(skill.category, (counts.get(skill.category) ?? 0) + 1)
    return catalog.categories
      .map((category) => ({
        key: category.key,
        name: category.name,
        nameEn: category.nameEn,
        count: counts.get(category.key) ?? 0,
      }))
      .filter((category) => category.count > 0)
  }

  function clawhubOwnerParam(owner) {
    return typeof owner === 'string' && /^[A-Za-z0-9_.-]{1,64}$/.test(owner) ? owner : ''
  }

  async function clawhubRequest(pathname, query, source = 'clawhub') {
    const url = new URL(pathname, CLAWHUB_BASE)
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
    }
    return fetchText(url.toString(), { source })
  }

  async function clawhubDetail(slug, owner) {
    let pinnedOwner = clawhubOwnerParam(owner)
    let response = await clawhubRequest(`/api/v1/skills/${encodeURIComponent(slug)}`, { owner: pinnedOwner })
    if (response.status === 409) {
      let matches
      try {
        matches = JSON.parse(response.text)
      } catch {
        matches = null
      }
      const resolved = matches?.matches?.[0]?.ownerHandle
      if (!pinnedOwner && typeof resolved === 'string' && resolved) {
        pinnedOwner = resolved
        response = await clawhubRequest(`/api/v1/skills/${encodeURIComponent(slug)}`, { owner: pinnedOwner })
      }
    }
    if (!response.ok) {
      throw new UpstreamError('clawhub', 'UPSTREAM_HTTP', `ClawHub responded ${response.status} for ${slug}`)
    }
    let data
    try {
      data = JSON.parse(response.text)
    } catch {
      throw new UpstreamError('clawhub', 'UPSTREAM_BAD_RESPONSE', 'ClawHub returned invalid JSON')
    }
    if (!data?.skill?.slug) {
      throw new UpstreamError('clawhub', 'UPSTREAM_BAD_RESPONSE', 'ClawHub detail is missing the skill')
    }

    const version = asString(data.latestVersion?.version) || asString(data.skill.latestVersion?.version) || undefined
    let files = []
    let license = asString(data.latestVersion?.license) || undefined
    let security = { status: 'unknown', reports: [] }
    if (version) {
      try {
        const versionResponse = await clawhubRequest(
          `/api/v1/skills/${encodeURIComponent(slug)}/versions/${encodeURIComponent(version)}`,
          { owner: pinnedOwner },
        )
        if (versionResponse.ok) {
          const parsed = JSON.parse(versionResponse.text)
          files = Array.isArray(parsed?.version?.files) ? parsed.version.files : []
          license = asString(parsed?.version?.license) || license
          security = mapClawhubSecurity(parsed?.version?.security)
        }
      } catch {
        // The version read is best effort: the skill detail is still useful without files.
      }
    }

    const rawDescription = asString(data.skill.description)
    const parsedFrontmatter = parseFrontmatter(rawDescription)
    let body = parsedFrontmatter.body
    if (!body.trim() && files.some((file) => file.path === 'SKILL.md')) {
      try {
        const fetched = await clawhubFile(slug, 'SKILL.md', pinnedOwner)
        body = parseFrontmatter(fetched.content).body
      } catch {
        // Keep the empty body; the UI can still show the summary.
      }
    }

    const fileMetas = files.map((file) => ({
      path: asString(file.path),
      size: asNumber(file.size),
      sha256: asString(file.sha256) || undefined,
      contentType: asString(file.contentType) || undefined,
      language: languageOf(file.path),
      tooBig: asNumber(file.size) > LIMITS.maxFileSize,
    })).filter((file) => file.path)

    const ownerHandle = asString(data.owner?.handle) || pinnedOwner
    const changelogText = meaningfulChangelog(data.latestVersion?.changelog)
    const detail = {
      id: `clawhub:${slug}`,
      source: 'clawhub',
      slug,
      owner: ownerHandle,
      name: clampText(data.skill.displayName || slug, 80),
      summary: clampText(data.skill.summary, 260),
      summaryEn: clampText(data.skill.summary, 260),
      author: {
        handle: ownerHandle,
        displayName: asString(data.owner?.displayName) || undefined,
        avatarUrl: asString(data.owner?.image) || undefined,
      },
      stats: {
        downloads: asNumber(data.skill.stats?.downloads),
        installs: typeof data.skill.stats?.installs === 'number' ? data.skill.stats.installs : undefined,
        stars: typeof data.skill.stats?.stars === 'number' ? data.skill.stats.stars : undefined,
      },
      tags: Array.isArray(data.skill.topics) ? data.skill.topics.filter((tag) => typeof tag === 'string').slice(0, 6) : [],
      version,
      updatedAt: typeof data.skill.updatedAt === 'number' ? data.skill.updatedAt : undefined,
      securityStatus: security.status,
      securityReports: security.reports,
      license,
      description: body,
      descriptionFrontmatter: parsedFrontmatter.frontmatter,
      files: fileMetas,
      totalSize: fileMetas.reduce((sum, file) => sum + file.size, 0),
      changelog: changelogText
        ? {
            version,
            text: changelogText,
            publishedAt: typeof data.latestVersion?.createdAt === 'number' ? data.latestVersion.createdAt : undefined,
          }
        : undefined,
      pageUrl: ownerHandle
        ? `${CLAWHUB_BASE}/${encodeURIComponent(ownerHandle)}/${encodeURIComponent(slug)}`
        : undefined,
      capabilities: analyzeSkill(body, fileMetas, parsedFrontmatter.frontmatter),
      triggers: inferTriggers(data.skill.summary, parsedFrontmatter.frontmatter.whenToUse, body),
      curated: false,
      ownerParam: pinnedOwner || undefined,
    }
    return detail
  }

  async function clawhubFiles(slug, version, owner) {
    const response = await clawhubRequest(
      `/api/v1/skills/${encodeURIComponent(slug)}/versions/${encodeURIComponent(version)}`,
      { owner: clawhubOwnerParam(owner) },
    )
    if (!response.ok) {
      throw new UpstreamError('clawhub', 'UPSTREAM_HTTP', `ClawHub responded ${response.status} for the file list`)
    }
    let data
    try {
      data = JSON.parse(response.text)
    } catch {
      throw new UpstreamError('clawhub', 'UPSTREAM_BAD_RESPONSE', 'ClawHub returned invalid JSON for the file list')
    }
    const files = Array.isArray(data?.version?.files) ? data.version.files : []
    return files.map((file) => ({
      path: asString(file.path),
      size: asNumber(file.size),
      sha256: asString(file.sha256) || undefined,
    })).filter((file) => file.path)
  }

  async function clawhubFile(slug, filePath, owner) {
    const response = await clawhubRequest(`/api/v1/skills/${encodeURIComponent(slug)}/file`, {
      path: filePath,
      owner: clawhubOwnerParam(owner),
    })
    if (!response.ok) {
      throw new UpstreamError('clawhub', 'UPSTREAM_HTTP', `ClawHub responded ${response.status} for ${filePath}`)
    }
    return { content: response.text, size: Buffer.byteLength(response.text, 'utf8') }
  }

  async function skillhubListPage(page, pageSize, keyword) {
    const url = new URL('/api/skills', SKILLHUB_BASE)
    url.searchParams.set('page', String(page))
    url.searchParams.set('pageSize', String(pageSize))
    if (keyword) url.searchParams.set('keyword', keyword)
    const data = await fetchJson(url.toString(), { source: 'skillhub' })
    if (data?.code !== 0 || !Array.isArray(data?.data?.skills)) {
      throw new UpstreamError('skillhub', 'UPSTREAM_BAD_RESPONSE', 'SkillHub returned an invalid list')
    }
    return {
      items: data.data.skills.filter((item) => item && typeof item.slug === 'string'),
      total: asNumber(data.data.total),
    }
  }

  function normalizeSkillhubItem(item) {
    const tags = []
    for (const sub of Array.isArray(item.subCategories) ? item.subCategories : []) {
      if (sub && typeof sub.name === 'string' && !tags.includes(sub.name)) tags.push(sub.name)
    }
    const summary = asString(item.description_zh) || asString(item.description) || asString(item.summary_zh) || asString(item.summary)
    return {
      id: `skillhub:${item.slug}`,
      source: 'skillhub',
      slug: item.slug,
      owner: asString(item.ownerName),
      name: clampText(item.name || item.displayName || item.slug, 80),
      summary: clampText(summary, 260),
      summaryEn: clampText(asString(item.summary) || asString(item.description) || summary, 260),
      author: { handle: asString(item.ownerName) },
      stats: {
        downloads: asNumber(item.downloads),
        installs: typeof item.installs === 'number' ? item.installs : undefined,
        stars: typeof item.stars === 'number' ? item.stars : undefined,
      },
      tags: tags.slice(0, 6),
      category: asString(item.category) || undefined,
      version: asString(item.version) || undefined,
      updatedAt: typeof item.updated_at === 'number' ? item.updated_at : undefined,
      securityStatus: item.verified ? 'verified' : 'unknown',
      requiresApiKey: item.labels?.requires_api_key === 'true',
      pageUrl: asString(item.homepage) || undefined,
      curated: false,
    }
  }

  async function skillhubDetail(slug) {
    const response = await fetchText(`${SKILLHUB_BASE}/api/v1/skills/${encodeURIComponent(slug)}`, { source: 'skillhub' })
    if (!response.ok) {
      throw new UpstreamError('skillhub', 'UPSTREAM_HTTP', `SkillHub responded ${response.status} for ${slug}`)
    }
    let data
    try {
      data = JSON.parse(response.text)
    } catch {
      throw new UpstreamError('skillhub', 'UPSTREAM_BAD_RESPONSE', 'SkillHub returned invalid JSON')
    }
    if (!data?.skill?.slug) {
      throw new UpstreamError('skillhub', 'UPSTREAM_BAD_RESPONSE', 'SkillHub detail is missing the skill')
    }
    const base = normalizeSkillhubItem(data.skill)
    if (data.skill.stats) {
      base.stats = {
        downloads: asNumber(data.skill.stats.downloads, base.stats.downloads),
        installs: typeof data.skill.stats.installs === 'number' ? data.skill.stats.installs : base.stats.installs,
        stars: typeof data.skill.stats.stars === 'number' ? data.skill.stats.stars : base.stats.stars,
      }
    }
    const security = mapSkillhubSecurity(data.securityReports, data.skill.verified)
    const version = asString(data.latestVersion?.version) || base.version
    let files = []
    try {
      files = await skillhubFiles(slug)
    } catch {
      // File metadata is best effort at detail time; install re-reads it.
    }
    let body = ''
    if (files.some((file) => file.path === 'SKILL.md')) {
      try {
        const fetched = await skillhubFile(slug, 'SKILL.md')
        body = parseFrontmatter(fetched.content).body
      } catch {
        body = ''
      }
    }
    const fileMetas = files.map((file) => ({
      path: file.path,
      size: file.size,
      sha256: file.sha256,
      language: languageOf(file.path),
      tooBig: file.size > LIMITS.maxFileSize,
    }))
    const changelogText = meaningfulChangelog(data.latestVersion?.changelog)
    return {
      ...base,
      author: {
        handle: asString(data.owner?.handle) || base.owner,
        displayName: asString(data.owner?.displayName) || undefined,
        avatarUrl: asString(data.owner?.image) || undefined,
      },
      securityStatus: security.status,
      securityReports: security.reports,
      version,
      description: body || base.summary,
      descriptionFrontmatter: {},
      files: fileMetas,
      totalSize: fileMetas.reduce((sum, file) => sum + file.size, 0),
      changelog: changelogText
        ? {
            version,
            text: changelogText,
            publishedAt: typeof data.latestVersion?.createdAt === 'number' ? data.latestVersion.createdAt : undefined,
          }
        : undefined,
      capabilities: analyzeSkill(body || base.summary, fileMetas),
      triggers: inferTriggers(base.summary, undefined, body),
      installState: 'installable',
    }
  }

  async function skillhubFiles(slug) {
    const data = await fetchJson(`${SKILLHUB_BASE}/api/v1/skills/${encodeURIComponent(slug)}/files`, { source: 'skillhub' })
    if (!Array.isArray(data?.files)) {
      throw new UpstreamError('skillhub', 'UPSTREAM_BAD_RESPONSE', 'SkillHub returned an invalid file list')
    }
    return data.files
      .map((file) => ({ path: asString(file.path), size: asNumber(file.size), sha256: asString(file.sha256) || undefined }))
      .filter((file) => file.path)
  }

  async function skillhubFile(slug, filePath) {
    const url = new URL('/api/v1/skills/' + encodeURIComponent(slug) + '/file', SKILLHUB_BASE)
    url.searchParams.set('path', filePath)
    const response = await fetchText(url.toString(), { source: 'skillhub' })
    if (!response.ok) {
      throw new UpstreamError('skillhub', 'UPSTREAM_HTTP', `SkillHub responded ${response.status} for ${filePath}`)
    }
    return { content: response.text, size: Buffer.byteLength(response.text, 'utf8') }
  }

  async function liveDetail(source, slug, owner) {
    return source === 'clawhub' ? clawhubDetail(slug, owner) : skillhubDetail(slug)
  }

  async function cachedDetail(source, slug, owner) {
    const key = `${source}:${slug}:${owner ?? ''}`
    const hit = detailCache.get(key)
    if (hit && Date.now() - hit.at < DETAIL_TTL) return hit.value
    if (detailInFlight.has(key)) return detailInFlight.get(key)
    const task = (async () => {
      const value = await liveDetail(source, slug, owner)
      detailCache.set(key, { at: Date.now(), value })
      return value
    })().finally(() => detailInFlight.delete(key))
    detailInFlight.set(key, task)
    return task
  }

  async function liveSearch(query, installed) {
    const q = clampText(query, 120)
    const sources = {}
    const settled = await Promise.allSettled([
      (async () => {
        const response = await clawhubRequest('/api/v1/search', { q }, 'clawhub')
        if (!response.ok) throw new UpstreamError('clawhub', 'UPSTREAM_HTTP', `ClawHub search responded ${response.status}`)
        const data = JSON.parse(response.text)
        if (!Array.isArray(data?.results)) throw new UpstreamError('clawhub', 'UPSTREAM_BAD_RESPONSE', 'ClawHub search returned no results array')
        return data.results
          .filter((item) => item?.slug && (item.source === undefined || item.source === 'clawhub') && (item.install?.kind === undefined || item.install.kind === 'clawhub'))
          .map((item) => ({
            id: `clawhub:${item.slug}`,
            source: 'clawhub',
            slug: item.slug,
            owner: asString(item.owner?.handle) || asString(item.ownerHandle),
            name: clampText(item.displayName || item.slug, 80),
            summary: clampText(item.summary, 260),
            summaryEn: clampText(item.summary, 260),
            author: {
              handle: asString(item.owner?.handle) || asString(item.ownerHandle),
              displayName: asString(item.owner?.displayName) || undefined,
              avatarUrl: asString(item.owner?.image) || undefined,
            },
            stats: { downloads: asNumber(item.downloads) },
            tags: [],
            updatedAt: typeof item.updatedAt === 'number' ? item.updatedAt : undefined,
            securityStatus: 'unknown',
            curated: false,
          }))
      })(),
      (async () => {
        const page = await skillhubListPage(1, 20, q)
        return page.items.map(normalizeSkillhubItem)
      })(),
    ])

    const fromClawhub = settled[0].status === 'fulfilled' ? settled[0].value : []
    sources.clawhub = settled[0].status === 'fulfilled'
      ? { status: 'ok' }
      : { status: 'failed', error: settled[0].reason instanceof Error ? settled[0].reason.message : String(settled[0].reason) }
    const fromSkillhub = settled[1].status === 'fulfilled' ? settled[1].value : []
    sources.skillhub = settled[1].status === 'fulfilled'
      ? { status: 'ok' }
      : { status: 'failed', error: settled[1].reason instanceof Error ? settled[1].reason.message : String(settled[1].reason) }

    const bySlug = new Map()
    for (const item of [...fromClawhub, ...fromSkillhub]) {
      const existing = bySlug.get(item.slug)
      if (!existing) {
        bySlug.set(item.slug, item)
        continue
      }
      // Prefer the ClawHub entry but fill in its Chinese summary and security.
      if (existing.source === 'clawhub' && item.source === 'skillhub') {
        if (!existing.summary || /^[\x00-\x7F\s]*$/.test(existing.summary)) existing.summary = item.summary
        existing.securityStatus = item.securityStatus
      }
    }
    const items = [...bySlug.values()]
      .map((item) => {
        const catalogCategory = item.category && DEFAULT_CATEGORIES.some((category) => category.key === item.category)
          ? item.category
          : 'other'
        return annotate({ ...item, category: catalogCategory }, installed)
      })
      .sort((left, right) => right.stats.downloads - left.stats.downloads)
      .slice(0, LIMITS.searchCap)

    return { items, sources }
  }

  async function installedEntries() {
    const entries = []
    let dirents
    try {
      dirents = await fs.readdir(skillsDir, { withFileTypes: true })
    } catch {
      return entries
    }
    for (const dirent of dirents) {
      if (!dirent.isDirectory() || dirent.name.startsWith('.')) continue
      const dir = path.join(skillsDir, dirent.name)
      const meta = await readMeta(dir)
      const skillFile = path.join(dir, 'SKILL.md')
      let text = ''
      try {
        text = await fs.readFile(skillFile, 'utf8')
      } catch {
        const flat = path.join(skillsDir, `${dirent.name}.md`)
        try {
          text = await fs.readFile(flat, 'utf8')
        } catch {
          continue
        }
      }
      const parsed = parseFrontmatter(text)
      const data = parsed.frontmatter
      const description = clampText(data.description || parsed.body.replace(/^#.*$/m, ''), 240)
      let size = 0
      let fileCount = 0
      try {
        const walk = async (current) => {
          const list = await fs.readdir(current, { withFileTypes: true })
          for (const item of list) {
            if (fileCount > 500) return
            const full = path.join(current, item.name)
            if (item.isDirectory()) await walk(full)
            else if (item.isFile()) {
              try {
                const stat = await fs.stat(full)
                size += stat.size
                fileCount += 1
              } catch {
                // Ignore unreadable files in the size report.
              }
            }
          }
        }
        await walk(dir)
      } catch {
        // Keep the partial size.
      }
      entries.push({
        id: meta?.id || `local:${dirent.name}`,
        name: clampText(data.name || dirent.name, 80),
        slug: meta?.slug || dirent.name,
        source: meta?.source || 'local',
        version: meta?.version || asString(data.version) || undefined,
        description,
        installedAt: meta?.installedAt,
        managed: Boolean(meta),
        path: dir,
        fileCount,
        size,
      })
    }
    return entries.sort((left, right) => left.name.localeCompare(right.name))
  }

  async function localDetail(source, slug) {
    const installed = await scanInstalled()
    const record = installed.get(`${source}:${slug}`)
    if (!record) return null
    const text = await fs.readFile(path.join(record.path, 'SKILL.md'), 'utf8')
    const parsed = parseFrontmatter(text)
    const files = []
    const walk = async (dir, prefix = '') => {
      const list = await fs.readdir(dir, { withFileTypes: true })
      for (const item of list) {
        if (item.name === META_FILE || item.name.startsWith('.')) continue
        const relative = prefix ? `${prefix}/${item.name}` : item.name
        const full = path.join(dir, item.name)
        if (item.isDirectory()) await walk(full, relative)
        else if (item.isFile()) {
          const stat = await fs.stat(full)
          files.push({ path: relative, size: stat.size, language: languageOf(relative), tooBig: stat.size > LIMITS.maxFileSize })
        }
        if (files.length > LIMITS.maxFileCount) return
      }
    }
    await walk(record.path)
    return {
      id: `${source}:${slug}`,
      source,
      slug,
      name: clampText(parsed.frontmatter.name || slug, 80),
      summary: clampText(parsed.frontmatter.description, 260),
      summaryEn: clampText(parsed.frontmatter.description, 260),
      author: { handle: '' },
      stats: { downloads: 0 },
      tags: [],
      version: record.version,
      securityStatus: 'unknown',
      description: parsed.body,
      descriptionFrontmatter: parsed.frontmatter,
      files,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      capabilities: analyzeSkill(parsed.body, files, parsed.frontmatter),
      triggers: inferTriggers(parsed.frontmatter.description, parsed.frontmatter.whenToUse, parsed.body),
      installState: 'installed',
      installedInfo: { version: record.version, installedAt: record.installedAt, dirName: record.dirName },
      local: true,
      curated: false,
    }
  }

  async function catalogDetail(entry, owner) {
    const installed = await scanInstalled()
    try {
      const detail = await cachedDetail(entry.source, entry.slug, owner || entry.owner)
      return annotate({
        ...detail,
        name: entry.name || detail.name,
        summary: entry.summary || detail.summary,
        summaryEn: entry.summaryEn || detail.summaryEn,
        category: entry.category,
        tags: entry.tags.length ? entry.tags : detail.tags,
        featured: entry.featured,
        curated: true,
        securityStatus: detail.securityStatus === 'unknown' ? entry.securityStatus : detail.securityStatus,
        securityNote: entry.securityNote,
        pageUrl: detail.pageUrl || entry.pageUrl,
      }, installed)
    } catch (error) {
      const local = await localDetail(entry.source, entry.slug).catch(() => null)
      if (local) return local
      return {
        ...entry,
        author: { handle: entry.owner },
        description: entry.summary,
        descriptionFrontmatter: {},
        files: [],
        totalSize: 0,
        securityReports: [],
        capabilities: { commands: [], network: [], secrets: [], hooks: [], scripts: [] },
        triggers: inferTriggers(entry.summary, undefined, ''),
        installState: 'unavailable',
        stale: true,
        error: error instanceof Error ? error.message : String(error),
        installedInfo: undefined,
      }
    }
  }

  async function installedMapSnapshot() {
    return scanInstalled()
  }

  // ── Fetch route handlers ───────────────────────────────────────────────────

  async function handleCatalog(request) {
    const url = new URL(request.url)
    const scope = url.searchParams.get('scope') === 'live' ? 'live' : 'catalog'
    const installed = await installedMapSnapshot()
    const catalog = await getCatalog()

    if (scope === 'live') {
      const query = asString(url.searchParams.get('q')).trim()
      if (!query) return json({ scope, items: [], total: 0, categories: [], sources: {}, catalogGeneratedAt: catalog.generatedAt })
      const result = await liveSearch(query, installed)
      const filtered = filterItems(result.items, {
        q: '',
        category: url.searchParams.get('category') ?? 'all',
        source: url.searchParams.get('source') ?? 'all',
        security: url.searchParams.get('security') ?? 'all',
        installed: url.searchParams.get('installed') ?? 'all',
      })
      return json({
        scope,
        items: filtered,
        total: filtered.length,
        categories: [],
        sources: result.sources,
        catalogGeneratedAt: catalog.generatedAt,
      })
    }

    const base = catalog.skills.map((entry) => annotate(entry, installed))
    const filtered = filterItems(base, {
      q: url.searchParams.get('q') ?? '',
      category: url.searchParams.get('category') ?? 'all',
      source: url.searchParams.get('source') ?? 'all',
      security: url.searchParams.get('security') ?? 'all',
      installed: url.searchParams.get('installed') ?? 'all',
    })
    const installedCount = base.filter((item) => item.installState === 'installed').length
    return json({
      scope,
      items: filtered,
      total: filtered.length,
      categories: await categoryList(catalog),
      sources: {},
      catalogGeneratedAt: catalog.generatedAt,
      installedCount,
    })
  }

  async function handleDetail(request) {
    const url = new URL(request.url)
    const parsed = parseSkillId(url.searchParams.get('id'))
    if (!parsed) throw new HttpError(422, 'SKILL_HUB_BAD_ID', 'A valid skill id is required')
    const owner = url.searchParams.get('owner') ?? ''
    const catalog = await getCatalog()
    const entry = catalog.skills.find((item) => item.id === parsed.id)
    if (entry) return json({ item: await catalogDetail(entry, owner) })

    const installed = await installedMapSnapshot()
    try {
      const detail = await cachedDetail(parsed.source, parsed.slug, owner)
      return json({ item: annotate({ ...detail, curated: false }, installed) })
    } catch (error) {
      const local = await localDetail(parsed.source, parsed.slug).catch(() => null)
      if (local) return json({ item: local })
      throw new HttpError(502, 'SKILL_HUB_UPSTREAM', error instanceof Error ? error.message : String(error))
    }
  }

  async function handleFile(request) {
    const url = new URL(request.url)
    const parsed = parseSkillId(url.searchParams.get('id'))
    const filePath = asString(url.searchParams.get('path'))
    if (!parsed || !isSafeRelativePath(filePath)) {
      throw new HttpError(422, 'SKILL_HUB_BAD_REQUEST', 'A valid skill id and relative file path are required')
    }
    const owner = url.searchParams.get('owner') ?? ''
    const installed = await installedMapSnapshot()
    const record = installed.get(parsed.id)
    let content
    if (record) {
      const full = path.join(record.path, ...filePath.split('/'))
      if (!full.startsWith(record.path + path.sep)) {
        throw new HttpError(422, 'SKILL_HUB_BAD_PATH', 'The requested file escapes the skill directory')
      }
      const stat = await fs.lstat(full).catch(() => null)
      if (!stat || !stat.isFile()) throw new HttpError(404, 'SKILL_HUB_FILE_NOT_FOUND', 'The file does not exist')
      if (stat.size > LIMITS.maxFileSize) throw new HttpError(413, 'SKILL_HUB_FILE_TOO_LARGE', 'The file is too large to preview')
      content = await fs.readFile(full, 'utf8')
    } else {
      const key = `${parsed.id}:${filePath}:${owner}`
      const hit = fileCache.get(key)
      if (hit && Date.now() - hit.at < FILE_TTL) {
        content = hit.content
      } else {
        const fetched = parsed.source === 'clawhub'
          ? await clawhubFile(parsed.slug, filePath, owner)
          : await skillhubFile(parsed.slug, filePath)
        content = fetched.content
        fileCache.set(key, { at: Date.now(), content })
      }
    }
    const binary = detectBinary(content)
    const preview = truncatePreview(content)
    return json({
      path: filePath,
      content: binary ? '' : preview.content,
      size: preview.size,
      truncated: preview.truncated,
      binary,
      language: languageOf(filePath),
    })
  }

  async function handleInstall(request) {
    const body = await readJson(request)
    const parsed = parseSkillId(body.id)
    if (!parsed) throw new HttpError(422, 'SKILL_HUB_BAD_ID', 'A valid skill id is required')
    if (installLocks.has(parsed.id)) throw new HttpError(409, 'SKILL_HUB_INSTALLING', 'This skill is already being installed')

    const dirName = sanitizeDirName(parsed.slug)
    if (!dirName) throw new HttpError(422, 'SKILL_HUB_BAD_SLUG', 'The skill slug cannot be used as a directory name')
    const target = path.join(skillsDir, dirName)
    const existing = await fs.lstat(target).catch(() => null)
    if (existing) {
      const meta = await readMeta(target)
      if (meta?.id === parsed.id) throw new HttpError(409, 'SKILL_HUB_ALREADY_INSTALLED', 'The skill is already installed')
      throw new HttpError(409, 'SKILL_HUB_NAME_CONFLICT', 'Another skill already uses this directory name')
    }

    installLocks.add(parsed.id)
    try {
      const owner = asString(body.owner)
      let detail
      try {
        detail = await liveDetail(parsed.source, parsed.slug, owner)
      } catch (error) {
        throw new HttpError(502, 'SKILL_HUB_UPSTREAM', error instanceof Error ? error.message : String(error))
      }
      if (!Array.isArray(detail.files) || detail.files.length === 0) {
        throw new HttpError(422, 'SKILL_HUB_NO_FILES', 'The skill has no installable files')
      }
      if (!detail.files.some((file) => file.path === 'SKILL.md')) {
        throw new HttpError(422, 'SKILL_HUB_NO_MANIFEST', 'The skill has no SKILL.md')
      }
      if (detail.files.length > LIMITS.maxFileCount) {
        throw new HttpError(422, 'SKILL_HUB_TOO_MANY_FILES', 'The skill has too many files')
      }
      const declaredTotal = detail.files.reduce((sum, file) => sum + file.size, 0)
      if (detail.files.some((file) => file.size > LIMITS.maxFileSize) || declaredTotal > LIMITS.maxTotalSize) {
        throw new HttpError(422, 'SKILL_HUB_TOO_LARGE', 'The skill exceeds the size limits')
      }

      await fs.mkdir(skillsDir, { recursive: true })
      const temp = await fs.mkdtemp(path.join(homedir(), '.dsh-skill-hub-'))
      let total = 0
      try {
        for (const file of detail.files) {
          if (!isSafeRelativePath(file.path)) {
            throw new HttpError(422, 'SKILL_HUB_BAD_PATH', `Unsafe file path: ${file.path}`)
          }
          let fetched
          try {
            fetched = parsed.source === 'clawhub'
              ? await clawhubFile(parsed.slug, file.path, owner)
              : await skillhubFile(parsed.slug, file.path)
          } catch (error) {
            throw new HttpError(502, 'SKILL_HUB_UPSTREAM', error instanceof Error ? error.message : String(error))
          }
          if (fetched.size > LIMITS.maxFileSize) {
            throw new HttpError(422, 'SKILL_HUB_TOO_LARGE', `File is too large: ${file.path}`)
          }
          total += fetched.size
          if (total > LIMITS.maxTotalSize) {
            throw new HttpError(422, 'SKILL_HUB_TOO_LARGE', 'The skill exceeds the total size limit')
          }
          if (file.sha256 && sha256(fetched.content) !== file.sha256.toLowerCase()) {
            throw new HttpError(502, 'SKILL_HUB_CHECKSUM', `Checksum mismatch for ${file.path}`)
          }
          const full = path.join(temp, ...file.path.split('/'))
          await fs.mkdir(path.dirname(full), { recursive: true })
          await fs.writeFile(full, fetched.content, 'utf8')
        }
        const meta = {
          id: parsed.id,
          source: parsed.source,
          slug: parsed.slug,
          version: detail.version,
          installedAt: new Date().toISOString(),
          fileCount: detail.files.length,
        }
        await fs.writeFile(path.join(temp, META_FILE), `${JSON.stringify(meta, null, 2)}\n`, 'utf8')
        try {
          await fs.rename(temp, target)
        } catch (error) {
          if (error?.code === 'EXDEV') {
            await fs.cp(temp, target, { recursive: true })
            await fs.rm(temp, { recursive: true, force: true })
          } else {
            throw error
          }
        }
      } finally {
        await fs.rm(temp, { recursive: true, force: true }).catch(() => {})
      }

      invalidateProvider?.()
      detailCache.delete(`${parsed.source}:${parsed.slug}:${owner}`)
      const installed = await scanInstalled()
      return json({ item: annotate({ ...detail, curated: false }, installed), installedPath: target })
    } finally {
      installLocks.delete(parsed.id)
    }
  }

  async function handleUninstall(request) {
    const body = await readJson(request)
    const parsed = parseSkillId(body.id)
    if (!parsed) throw new HttpError(422, 'SKILL_HUB_BAD_ID', 'A valid skill id is required')
    const installed = await scanInstalled()
    const record = installed.get(parsed.id)
    if (!record) throw new HttpError(404, 'SKILL_HUB_NOT_INSTALLED', 'The skill is not installed')
    const stat = await fs.lstat(record.path).catch(() => null)
    if (!stat || !stat.isDirectory() || stat.isSymbolicLink()) {
      throw new HttpError(409, 'SKILL_HUB_NOT_MANAGED', 'The skill directory is not a managed directory')
    }
    const meta = await readMeta(record.path)
    if (!meta || meta.id !== parsed.id) {
      throw new HttpError(409, 'SKILL_HUB_NOT_MANAGED', 'The skill was not installed by the market')
    }
    await fs.rm(record.path, { recursive: true, force: true })
    invalidateProvider?.()
    detailCache.delete(`${parsed.source}:${parsed.slug}:`)
    return json({ id: parsed.id, removedPath: record.path })
  }

  async function handleInstalled() {
    return json({ items: await installedEntries() })
  }

  async function handleMeta() {
    const catalog = await getCatalog()
    const installed = await scanInstalled()
    return json({
      total: catalog.skills.length,
      generatedAt: catalog.generatedAt,
      categories: await categoryList(catalog),
      installedCount: installed.size,
      skillsDir,
    })
  }

  async function readJson(request) {
    const text = await request.text()
    if (text.length > LIMITS.bodyBytes) throw new HttpError(413, 'SKILL_HUB_BODY_TOO_LARGE', 'The request body is too large')
    if (!text.trim()) return {}
    try {
      const value = JSON.parse(text)
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('not an object')
      return value
    } catch {
      throw new HttpError(400, 'SKILL_HUB_BAD_JSON', 'The request body is not a JSON object')
    }
  }

  // ── Skills provider ────────────────────────────────────────────────────────

  const provider = {
    name: 'skill-market',
    async list() {
      const installed = await scanInstalled()
      const candidates = []
      for (const record of installed.values()) {
        const file = path.join(record.path, 'SKILL.md')
        let text
        try {
          text = await fs.readFile(file, 'utf8')
        } catch {
          continue
        }
        const parsed = parseFrontmatter(text)
        const name = asString(parsed.frontmatter.name, record.dirName)
        const description = clampText(parsed.frontmatter.description, 400)
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || !description) continue
        const whenToUse = clampText(parsed.frontmatter.whenToUse, 300) || undefined
        candidates.push({
          name,
          description,
          whenToUse,
          invocation: invocationOf(parsed.frontmatter),
          source: 'user-dsh',
          provider: 'skill-market',
          rank: 350,
          path: file,
          resourceBase: { kind: 'directory', path: record.path },
          locator: { dir: record.path, name },
        })
      }
      return candidates
    },
    async get(candidate) {
      const dir = candidate?.locator?.dir
      if (typeof dir !== 'string') return undefined
      const file = path.join(dir, 'SKILL.md')
      let text
      try {
        text = await fs.readFile(file, 'utf8')
      } catch {
        return undefined
      }
      const parsed = parseFrontmatter(text)
      const name = candidate.name
      const description = clampText(parsed.frontmatter.description, 400) || candidate.description
      return {
        name,
        description,
        whenToUse: clampText(parsed.frontmatter.whenToUse, 300) || candidate.whenToUse,
        invocation: invocationOf(parsed.frontmatter),
        source: 'user-dsh',
        provider: 'skill-market',
        path: file,
        resourceBase: { kind: 'directory', path: dir },
        content: parsed.body,
        metadata: parsed.frontmatter,
      }
    },
  }

  // ── Route registration ─────────────────────────────────────────────────────

  const routes = [
    ['/api/skill-market/catalog', 'GET', handleCatalog],
    ['/api/skill-market/detail', 'GET', handleDetail],
    ['/api/skill-market/file', 'GET', handleFile],
    ['/api/skill-market/installed', 'GET', handleInstalled],
    ['/api/skill-market/meta', 'GET', handleMeta],
    ['/api/skill-market/install', 'POST', handleInstall],
    ['/api/skill-market/uninstall', 'POST', handleUninstall],
  ]

  function registerRoutes(connection) {
    return routes.map(([routePath, method, handler]) => {
      const dispose = connection.fetch.register({
        path: routePath,
        methods: [method],
        requestBody: 'buffered',
        fetch: async (request) => {
          try {
            return await handler(request)
          } catch (error) {
            if (error instanceof HttpError) {
              return json({ error: { code: error.code, message: error.message } }, error.status)
            }
            if (error instanceof UpstreamError) {
              return json({ error: { code: error.code, message: error.message } }, 502)
            }
            log('warn', `request failed: ${error instanceof Error ? error.stack ?? error.message : String(error)}`)
            return json({ error: { code: 'SKILL_HUB_ERROR', message: error instanceof Error ? error.message : String(error) } }, 500)
          }
        },
      })
      return dispose
    })
  }

  return {
    skillsDir,
    getCatalog,
    registerRoutes,
    provider,
    setInvalidate(fn) {
      invalidateProvider = fn
    },
    stop() {
      detailCache.clear()
      fileCache.clear()
    },
  }
}

export function apply(ctx, config = {}) {
  const market = createMarket(ctx, config)

  ctx.inject(['connection'], (connectionCtx) => {
    const disposers = market.registerRoutes(connectionCtx.connection)
    for (const dispose of disposers) {
      connectionCtx.effect(() => dispose)
    }
  })

  ctx.inject(['skills'], (skillsCtx) => {
    skillsCtx.effect(() => skillsCtx.skills.registerProvider((control) => {
      market.setInvalidate(() => control.invalidate())
      return market.provider
    }))
  })

  ctx.effect(() => () => market.stop())
  ctx.logger?.info?.(`skill-hub: market ready at ${market.skillsDir}`)
}