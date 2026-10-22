import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(join(root, 'client.js'), 'utf8')
const zhStart = source.indexOf('const zh = {')
const enStart = source.indexOf('const en = {')
const helpers = source.indexOf('// ── Helpers')
const zhBlock = source.slice(zhStart, enStart)
const enBlock = source.slice(enStart, helpers)

function keys(block) {
  const list = []
  for (const match of block.matchAll(/^\s*'([^']+)':/gm)) list.push(match[1])
  return list
}
const zhKeys = keys(zhBlock)
const enKeys = keys(enBlock)
const used = new Set()
for (const match of source.matchAll(/\bt\('([^']+)'/g)) used.add(match[1])

// `t('security.' + status)` is a dynamic prefix, not a literal dictionary key.
const dynamic = new Set(['security.verified', 'security.benign', 'security.unknown', 'security.flagged'])
for (const key of dynamic) used.delete(key)
used.delete('security.')

const zhSet = new Set(zhKeys)
const enSet = new Set(enKeys)
console.log('zh keys', zhKeys.length, 'unique', zhSet.size)
console.log('en keys', enKeys.length, 'unique', enSet.size)
console.log('used literal keys', used.size)
console.log('dynamic security keys present:', [...dynamic].every((key) => zhSet.has(key) && enSet.has(key)))
console.log('missing in zh:', [...used].filter((key) => !zhSet.has(key)))
console.log('missing in en:', [...used].filter((key) => !enSet.has(key)))
console.log('zh only:', zhKeys.filter((key) => !enSet.has(key)))
console.log('en only:', enKeys.filter((key) => !zhSet.has(key)))
const dupZh = zhKeys.filter((key, index) => zhKeys.indexOf(key) !== index)
const dupEn = enKeys.filter((key, index) => enKeys.indexOf(key) !== index)
console.log('duplicate zh:', [...new Set(dupZh)])
console.log('duplicate en:', [...new Set(dupEn)])