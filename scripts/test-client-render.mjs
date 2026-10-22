import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const reactRoot = process.env.DSH_REACT_ROOT
const requireFrom = createRequire(reactRoot ? join(reactRoot, 'package.json') : join(root, 'package.json'))

let React
let renderToStaticMarkup
try {
  React = requireFrom('react')
  ;({ renderToStaticMarkup } = requireFrom('react-dom/server'))
} catch {
  console.error(
    'Cannot load react / react-dom/server. Run `npm install` in this repo, or set DSH_REACT_ROOT to a project that has them installed.',
  )
  process.exit(1)
}

let source = readFileSync(join(root, 'client.js'), 'utf8')
source = source.replace(
  'return { apply, inject }',
  `return { apply, inject, __components: { HomePage, DetailPage, InstalledPage, InstallDialog, UninstallDialog, MarketPage, Toast, SidebarAnchor, renderMarkdown } }`,
)

let record
const fakeWindow = {
  __ModuleLoader__: {
    load(value) {
      record = value
    },
  },
}
const fakeDocument = {
  querySelector: () => null,
  createElement: () => ({ setAttribute() {}, textContent: '', remove() {} }),
  head: { appendChild() {} },
}
new Function('window', 'document', source)(fakeWindow, fakeDocument)
const moduleExports = record.factory((id) => {
  if (id === 'react') return React
  throw new Error(`unexpected require ${id}`)
})
const c = moduleExports.__components
const t = (key, params) => {
  if (!params) return key
  return key.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match))
}
const noop = () => {}

const meta = {
  total: 180,
  categories: [
    { key: 'agent', name: '智能体增强', nameEn: 'Agent Boost', count: 25 },
    { key: 'dev', name: '开发编程', nameEn: 'Development', count: 25 },
  ],
  installedCount: 2,
  generatedAt: 1792594683820,
  skillsDir: 'C:\\Users\\tester\\.dsh\\skills',
}
const categories = meta.categories
const items = [
  {
    id: 'clawhub:self-improving-agent',
    source: 'clawhub',
    slug: 'self-improving-agent',
    owner: 'pskoett',
    name: 'self-improving agent',
    summary: 'Captures and maintains learnings, errors, and corrections. Use when a command fails.',
    summaryEn: 'Captures and maintains learnings, errors, and corrections.',
    category: 'agent',
    tags: ['self-improvement', 'context'],
    featured: true,
    stats: { downloads: 487162, installs: 18496, stars: 4004 },
    version: '4.0.3',
    updatedAt: 1791098661833,
    securityStatus: 'unknown',
    installState: 'installable',
  },
  {
    id: 'skillhub:dev-god',
    source: 'skillhub',
    slug: 'dev-god',
    owner: 'u_42bbb65f',
    name: '编程大神.Skill',
    summary: '面向复杂真实项目的高阶全栈编程助手，覆盖 Web、后端、脚本与多端开发。',
    category: 'dev',
    tags: ['代码生成', 'Bug 修复'],
    stats: { downloads: 6003893, installs: 0, stars: 35 },
    version: '1.2.4',
    securityStatus: 'flagged',
    installState: 'installed',
    installedInfo: { version: '1.2.4', installedAt: '2026-10-20T10:00:00.000Z', dirName: 'dev-god' },
  },
]
const catalog = {
  items,
  total: 2,
  categories,
  generatedAt: 1792594683820,
  installedCount: 1,
  loading: false,
  error: null,
}
const filters = { q: '', category: 'agent', source: 'clawhub', security: 'unknown', installed: 'installable' }
const live = { query: 'pdf', items, sources: { clawhub: { status: 'ok' }, skillhub: { status: 'failed', error: 'timeout' } }, loading: false, error: null }

function render(label, element) {
  try {
    const html = renderToStaticMarkup(element)
    console.log(`ok ${label} (${html.length} chars)`)
    return html
  } catch (error) {
    console.error(`FAIL ${label}:`, error)
    throw error
  }
}

render('SidebarAnchor', React.createElement(c.SidebarAnchor, { size: 18, active: true }))
render(
  'HomePage catalog',
  React.createElement(c.HomePage, {
    t,
    locale: 'zh',
    meta,
    catalog,
    live,
    categories,
    scope: 'catalog',
    filters,
    items,
    data: { total: items.length },
    loading: false,
    error: null,
    onScope: noop,
    setFilter: noop,
    onClearFilters: noop,
    onSearch: noop,
    onRefresh: noop,
    onRetry: noop,
    onOpenInstalled: noop,
    onOpen: noop,
    onInstall: noop,
  }),
)
render(
  'HomePage live',
  React.createElement(c.HomePage, {
    t,
    locale: 'zh',
    meta,
    catalog,
    live,
    categories,
    scope: 'live',
    filters: { q: 'pdf', category: 'all', source: 'all', security: 'all', installed: 'all' },
    items,
    data: { total: 2 },
    loading: false,
    error: null,
    onScope: noop,
    setFilter: noop,
    onClearFilters: noop,
    onSearch: noop,
    onRefresh: noop,
    onRetry: noop,
    onOpenInstalled: noop,
    onOpen: noop,
    onInstall: noop,
  }),
)

const detailItem = {
  ...items[0],
  installState: 'installable',
  description: `# Self-Improvement Skill

Use this skill when a command fails.

## What it does

- Captures learnings
- Reviews guidance

\`\`\`bash
mkdir -p .learnings
openclaw skills install @pskoett/self-improving-agent
\`\`\`

> Review the saved guidance first.

See [the repo](https://github.com/pskoett/self-improving-agent).
`,
  files: [
    { path: 'SKILL.md', size: 25671, language: 'markdown' },
    { path: 'scripts/extract-skill.sh', size: 1200, language: 'bash' },
  ],
  totalSize: 26871,
  capabilities: {
    commands: ['mkdir -p .learnings', 'openclaw skills install @pskoett/self-improving-agent'],
    network: ['https://github.com/pskoett/self-improving-agent'],
    secrets: ['OPENAI_API_KEY'],
    hooks: ['on-session-start'],
    scripts: ['scripts/extract-skill.sh'],
  },
  triggers: ['命令失败时', '用户纠正假设时', '发现更好的做法时'],
  securityStatus: 'unknown',
  securityNote: '来源方尚未完成扫描。',
  securityReports: [
    { vendor: 'clawhub-scan', status: 'pending', statusText: 'Pending', summary: 'Queued for review.' },
    { vendor: 'VirusTotal', status: 'clean', statusText: 'Clean', reportUrl: 'https://virustotal.com/example' },
  ],
  changelog: { version: '4.0.3', publishedAt: 1791098661833, text: '- Added review step\n- Fixed context loading' },
  license: 'MIT',
  requiresApiKey: true,
  pageUrl: 'https://clawhub.ai/pskoett/self-improving-agent',
  curated: true,
}

for (const tab of ['overview', 'files', 'security', 'changelog']) {
  render(
    `DetailPage ${tab}`,
    React.createElement(c.DetailPage, {
      t,
      locale: 'zh',
      meta,
      categories,
      detail: {
        id: detailItem.id,
        owner: detailItem.owner,
        loading: false,
        item: detailItem,
        error: null,
        tab,
        filePath: tab === 'files' ? 'SKILL.md' : null,
        file: tab === 'files' ? { path: 'SKILL.md', content: '# Hello\n\nWorld', size: 13, truncated: false, binary: false } : null,
        fileLoading: false,
        fileError: null,
      },
      onBack: noop,
      onRetry: noop,
      onInstall: noop,
      onUninstall: noop,
      onTab: noop,
      onFile: noop,
      onCopied: noop,
      onCopyError: noop,
    }),
  )
}

render(
  'InstalledPage',
  React.createElement(c.InstalledPage, {
    t,
    locale: 'zh',
    meta,
    state: {
      loading: false,
      error: null,
      items: [
        {
          id: 'skillhub:dev-god',
          name: '编程大神.Skill',
          slug: 'dev-god',
          source: 'skillhub',
          version: '1.2.4',
          description: '全栈编程助手',
          installedAt: '2026-10-20T10:00:00.000Z',
          managed: true,
          path: 'C:\\Users\\tester\\.dsh\\skills\\dev-god',
          fileCount: 12,
          size: 134152,
        },
        {
          id: 'local:my-skill',
          name: 'my-skill',
          slug: 'my-skill',
          source: 'local',
          description: '手动放置的技能',
          managed: false,
          path: 'C:\\Users\\tester\\.dsh\\skills\\my-skill',
          fileCount: 2,
          size: 900,
        },
      ],
    },
    onBack: noop,
    onBrowse: noop,
    onRetry: noop,
    onOpen: noop,
    onUninstall: noop,
    onCopied: noop,
    onCopyError: noop,
  }),
)

render(
  'InstallDialog',
  React.createElement(c.InstallDialog, {
    t,
    meta,
    busy: false,
    dialog: { kind: 'install', item: detailItem, ack: false, error: null },
    onClose: noop,
    onAck: noop,
    onConfirm: noop,
  }),
)
render(
  'InstallDialog error',
  React.createElement(c.InstallDialog, {
    t,
    meta,
    busy: true,
    dialog: { kind: 'install', item: { ...detailItem, securityStatus: 'flagged' }, ack: true, error: '网络错误' },
    onClose: noop,
    onAck: noop,
    onConfirm: noop,
  }),
)
render(
  'UninstallDialog',
  React.createElement(c.UninstallDialog, {
    t,
    meta,
    busy: false,
    dialog: { kind: 'uninstall', item: { ...items[1], path: 'C:\\Users\\tester\\.dsh\\skills\\dev-god' }, error: null },
    onClose: noop,
    onConfirm: noop,
  }),
)
render('Toast', React.createElement(c.Toast, { toast: { id: 1, text: '已安装 dev-god', tone: 'default' } }))
render('Toast error', React.createElement(c.Toast, { toast: { id: 1, text: '安装失败', tone: 'error' } }))
render('Markdown', React.createElement('div', null, c.renderMarkdown(detailItem.description, 'md')))
render('MarketPage initial', React.createElement(c.MarketPage, {}))
console.log('client render smoke test passed')