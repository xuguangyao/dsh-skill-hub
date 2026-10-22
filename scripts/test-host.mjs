import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { apply } from '../index.js'

const skillsDir = await mkdtemp(path.join(tmpdir(), 'dsh-skill-hub-test-'))
const routes = new Map()
const effects = []
let provider

const ctx = {
  logger: {
    info: (message) => console.log('[info]', message),
    warn: (message) => console.warn('[warn]', message),
    error: (message) => console.error('[error]', message),
  },
  effect(fn) {
    const dispose = fn()
    if (typeof dispose === 'function') effects.push(dispose)
    return dispose
  },
  inject(deps, callback) {
    if (deps.includes('connection')) {
      callback({
        connection: {
          fetch: {
            register(route) {
              routes.set(`${route.path}:${route.methods.join('|')}`, route)
              return () => routes.delete(`${route.path}:${route.methods.join('|')}`)
            },
          },
        },
        effect: ctx.effect,
      })
    }
    if (deps.includes('skills')) {
      callback({
        skills: {
          registerProvider(create) {
            provider = create({ invalidate() {} })
            return () => {}
          },
        },
        effect: ctx.effect,
      })
    }
  },
}

apply(ctx, { skillsDir })

async function call(routePath, method, url) {
  const route = routes.get(`${routePath}:${method}`)
  if (!route) throw new Error(`missing route ${method} ${routePath}`)
  const response = await route.fetch(new Request(`http://localhost${url}`, { method }))
  const payload = await response.json()
  return { status: response.status, payload }
}

const meta = await call('/api/skill-market/meta', 'GET', '/api/skill-market/meta')
console.log('meta', meta.status, {
  total: meta.payload.total,
  categories: meta.payload.categories.length,
  installedCount: meta.payload.installedCount,
  skillsDir: meta.payload.skillsDir,
})

const catalog = await call('/api/skill-market/catalog', 'GET', '/api/skill-market/catalog?q=pdf')
console.log('catalog q=pdf', catalog.status, catalog.payload.total, catalog.payload.items[0] && catalog.payload.items[0].id)

const full = await call('/api/skill-market/catalog', 'GET', '/api/skill-market/catalog')
const first = full.payload.items.find((item) => item.id === 'clawhub:self-improving-agent') || full.payload.items[0]
console.log('catalog total', full.payload.total, 'first', first.id)

const detail = await call('/api/skill-market/detail', 'GET', `/api/skill-market/detail?id=${encodeURIComponent(first.id)}&owner=${encodeURIComponent(first.owner || '')}`)
console.log('detail', detail.status, {
  id: detail.payload.item && detail.payload.item.id,
  files: detail.payload.item && detail.payload.item.files.length,
  security: detail.payload.item && detail.payload.item.securityStatus,
  installState: detail.payload.item && detail.payload.item.installState,
  capabilities: detail.payload.item && detail.payload.item.capabilities,
})

const file = await call('/api/skill-market/file', 'GET', `/api/skill-market/file?id=${encodeURIComponent(first.id)}&path=SKILL.md&owner=${encodeURIComponent(first.owner || '')}`)
console.log('file', file.status, {
  path: file.payload.path,
  size: file.payload.size,
  binary: file.payload.binary,
  preview: String(file.payload.content || '').slice(0, 60),
})

const installed = await call('/api/skill-market/installed', 'GET', '/api/skill-market/installed')
console.log('installed', installed.status, installed.payload.items.length)

const providerList = await provider.list({})
console.log('provider', provider.name, 'candidates', providerList.length)

for (const dispose of effects.reverse()) await dispose()
await rm(skillsDir, { recursive: true, force: true })