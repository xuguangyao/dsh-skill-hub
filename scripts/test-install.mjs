import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { apply } from '../index.js'

const skillsDir = await mkdtemp(path.join(tmpdir(), 'dsh-skill-hub-install-'))
const routes = new Map()
const effects = []
let provider

const ctx = {
  logger: { info() {}, warn: (message) => console.warn('[warn]', message), error: (message) => console.error('[error]', message) },
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
              return () => {}
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

async function call(routePath, method, url, body) {
  const route = routes.get(`${routePath}:${method}`)
  if (!route) throw new Error(`missing route ${method} ${routePath}`)
  const response = await route.fetch(
    new Request(`http://localhost${url}`, {
      method,
      headers: body === undefined ? undefined : { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  )
  const payload = await response.json()
  if (!response.ok) throw new Error(`${method} ${url} -> ${response.status} ${JSON.stringify(payload)}`)
  return payload
}

const id = 'clawhub:self-improving-agent'
const owner = 'pskoett'

const before = await call('/api/skill-market/installed', 'GET', '/api/skill-market/installed')
console.log('before', before.items.length)

const install = await call('/api/skill-market/install', 'POST', '/api/skill-market/install', { id, owner })
const item = install.item
console.log('installed', {
  id: item.id,
  installState: item.installState,
  files: item.files.length,
  installedPath: install.installedPath,
})

const dirName = path.basename(install.installedPath)
const marker = JSON.parse(await readFile(path.join(install.installedPath, '.skill-market.json'), 'utf8'))
console.log('marker', marker)
console.log('skill.md bytes', (await stat(path.join(install.installedPath, 'SKILL.md'))).size)

const after = await call('/api/skill-market/installed', 'GET', '/api/skill-market/installed')
console.log('after list', after.items.length, after.items[0])

const catalog = await call('/api/skill-market/catalog', 'GET', '/api/skill-market/catalog?installed=installed')
console.log('catalog installed filter', catalog.total, catalog.items[0] && catalog.items[0].id)

const candidates = await provider.list({})
console.log('provider candidates', candidates.map((candidate) => candidate.name))

const loaded = await provider.get(candidates[0])
console.log('provider get', { name: loaded.name, provider: loaded.provider, content: loaded.content.slice(0, 24) })

const detail = await call('/api/skill-market/detail', 'GET', `/api/skill-market/detail?id=${encodeURIComponent(id)}&owner=${owner}`)
console.log('detail installed', detail.item.installState, detail.item.local)

const file = await call('/api/skill-market/file', 'GET', `/api/skill-market/file?id=${encodeURIComponent(id)}&path=SKILL.md`)
console.log('file installed', file.size, file.content.slice(0, 20))

const uninstall = await call('/api/skill-market/uninstall', 'POST', '/api/skill-market/uninstall', { id })
console.log('uninstalled', uninstall)

const empty = await call('/api/skill-market/installed', 'GET', '/api/skill-market/installed')
console.log('final list', empty.items.length)
const dirGone = await stat(path.join(skillsDir, dirName)).then(() => false, () => true)
console.log('directory removed', dirGone)

for (const dispose of effects.reverse()) await dispose()
await rm(skillsDir, { recursive: true, force: true })