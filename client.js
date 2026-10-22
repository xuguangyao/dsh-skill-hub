window.__ModuleLoader__.load({
  id: '@local/dsh-skill-hub',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'skill-market'
    let RUNTIME = null

    // ── Dictionaries ────────────────────────────────────────────────────────
    const zh = {
      'nav.label': '技能市场',
      'page.eyebrow': 'SKILL MARKET',
      'page.title': '技能市场',
      'page.subtitle': '发现、预览并安装社区技能。安装后写入本机技能目录，并在下一个会话中生效。',
      'page.installed': '我的技能',
      'page.refresh': '刷新',
      'stats.skills': '精选技能',
      'stats.categories': '分类',
      'stats.installed': '已安装',
      'stats.updated': '清单更新',
      'scope.curated': '精选清单',
      'scope.live': '全部市场',
      'scope.liveHint': '在 ClawHub 与 SkillHub 中实时搜索',
      'scope.curatedHint': '人工整理的高质量技能，按热度排序',
      'scope.liveActive': '实时搜索',
      'search.placeholder': '搜索技能、用途或作者…',
      'search.livePlaceholder': '输入关键词后按 Enter 搜索全部市场',
      'search.clear': '清除搜索',
      'filter.all': '全部',
      'filter.category': '分类',
      'filter.source': '来源',
      'filter.security': '安全',
      'filter.installed': '安装状态',
      'filter.installedOnly': '已安装',
      'filter.installable': '未安装',
      'filter.clear': '清除筛选',
      'filter.active': '已筛选',
      'category.all': '全部',
      'source.clawhub': 'ClawHub',
      'source.skillhub': 'SkillHub',
      'source.local': '本地',
      'security.verified': '已认证',
      'security.benign': '扫描无风险',
      'security.unknown': '未审计',
      'security.flagged': '存在风险',
      'card.featured': '精选',
      'card.downloads': '下载',
      'card.stars': '星标',
      'card.installs': '安装',
      'card.install': '安装',
      'card.installed': '已安装',
      'card.view': '查看',
      'result.count': '{n} 个技能',
      'result.filtered': '筛选结果',
      'result.curated': '精选清单',
      'result.live': '全部市场',
      'result.sort': '按热度排序',
      'disclaimer.tag': '安装前请阅读',
      'disclaimer.text': '社区技能由第三方发布，可能包含指令、脚本或外部请求。安装不会自动执行脚本；请在安装前查看 SKILL.md 与安全报告，并只安装你信任的来源。',
      'empty.title': '没有找到匹配的技能',
      'empty.body': '试试更短的关键词，或清除筛选条件。',
      'empty.liveTitle': '搜索全部市场',
      'empty.liveBody': '输入关键词并按下 Enter，实时查询 ClawHub 与 SkillHub。',
      'empty.installedTitle': '还没有安装技能',
      'empty.installedBody': '从技能市场挑选一个技能开始，安装后会出现在这里。',
      'error.title': '加载失败',
      'error.retry': '重试',
      'error.catalog': '无法加载精选清单。',
      'error.detail': '无法加载技能详情。',
      'error.installed': '无法读取已安装技能。',
      'error.network': '无法连接到技能市场服务。',
      'error.badId': '技能标识无效。',
      'detail.back': '返回市场',
      'detail.overview': '概览',
      'detail.files': '文件',
      'detail.security': '安全报告',
      'detail.changelog': '更新日志',
      'detail.install': '安装',
      'detail.installed': '已安装',
      'detail.uninstall': '卸载',
      'detail.installUnavailable': '来源暂不可用',
      'detail.stale': '当前显示的是精选快照，无法连接来源。安装已暂时停用。',
      'detail.about': '关于这个技能',
      'detail.capabilities': '安装前请了解',
      'detail.capabilitiesHint': '以下内容由 SKILL.md 与文件清单静态分析得出，不代表完整审计。',
      'detail.commands': '命令与可执行文件',
      'detail.network': '外部请求',
      'detail.secrets': '密钥与环境变量',
      'detail.hooks': 'Hook 与自动化',
      'detail.scripts': '脚本文件',
      'detail.noCapabilities': '未在 SKILL.md 中发现命令、Hook 或密钥声明。',
      'detail.triggers': '适用场景',
      'detail.noTriggers': '暂无推断的触发场景。',
      'detail.info': '技能信息',
      'detail.author': '作者',
      'detail.source': '来源',
      'detail.category': '分类',
      'detail.version': '版本',
      'detail.license': '许可证',
      'detail.updated': '更新时间',
      'detail.requiresApiKey': '需要 API Key',
      'detail.yes': '是',
      'detail.no': '否',
      'detail.installPath': '安装位置',
      'detail.installPathHint': '安装后写入本机技能目录，在下一个会话中生效。',
      'detail.sourcePage': '在来源网站查看',
      'detail.filesCount': '{n} 个文件',
      'detail.totalSize': '{size}',
      'detail.filePreview': '文件预览',
      'detail.selectFile': '从左侧选择文件',
      'detail.fileLoading': '正在读取文件…',
      'detail.fileError': '无法读取该文件。',
      'detail.fileTooLarge': '文件过大，无法预览。',
      'detail.binary': '二进制文件，无法预览。',
      'detail.truncated': '已截断显示',
      'detail.copy': '复制',
      'detail.copied': '已复制',
      'detail.securityNote': '安全状态来自来源方的扫描结果，仅代表其自身判断。',
      'detail.noReports': '来源方未提供安全审计详情。',
      'detail.noChangelog': '来源方未提供更新日志。',
      'detail.readingTime': '约 {n} 分钟阅读',
      'detail.curatedNote': '该技能由技能市场精选清单收录。',
      'detail.uncuratedNote': '该技能来自全市场实时搜索，未经精选审核。',
      'detail.installDialog.title': '安装技能',
      'detail.installDialog.location': '将安装到',
      'detail.installDialog.effect': '安装后，技能会出现在下一个会话的可用技能列表中。',
      'detail.installDialog.warning': '该技能未经安全审计或来源方标记了风险。请先阅读 SKILL.md 与安全报告，确认你信任它。',
      'detail.installDialog.flagged': '来源方将该技能标记为存在风险。除非你完全信任它，否则不建议安装。',
      'detail.installDialog.ack': '我已查看技能内容与安全信息，并确认安装',
      'detail.installDialog.cancel': '取消',
      'detail.installDialog.confirm': '确认安装',
      'detail.installDialog.installing': '正在安装…',
      'detail.installDialog.failed': '安装失败',
      'detail.uninstallDialog.title': '卸载技能',
      'detail.uninstallDialog.body': '将删除 {path} 及其中的全部文件。此操作不可撤销。',
      'detail.uninstallDialog.cancel': '取消',
      'detail.uninstallDialog.confirm': '卸载',
      'detail.uninstallDialog.removing': '正在卸载…',
      'detail.uninstallDialog.failed': '卸载失败',
      'installed.title': '我的技能',
      'installed.subtitle': '已安装到本机的技能。市场安装的技能可以在这里查看和卸载。',
      'installed.back': '返回市场',
      'installed.managed': '来自技能市场',
      'installed.local': '本地技能',
      'installed.managedHint': '由技能市场安装，记录版本与安装时间。',
      'installed.localHint': '在技能目录中手动放置，市场不会删除它们。',
      'installed.empty': '还没有安装技能',
      'installed.emptyBody': '去市场挑选一个技能，安装后会出现在这里。',
      'installed.view': '查看',
      'installed.remove': '卸载',
      'installed.path': '路径',
      'installed.installedAt': '安装于',
      'installed.size': '大小',
      'installed.files': '文件',
      'installed.count': '{n} 个已安装',
      'installed.browse': '去市场看看',
      'installed.skillsDir': '技能目录',
      'toast.installed': '已安装 {name}',
      'toast.uninstalled': '已卸载 {name}',
      'toast.copied': '已复制到剪贴板',
      'toast.copyFailed': '复制失败，请手动选择',
      'toast.refreshed': '精选清单已刷新',
      'loading.catalog': '正在加载精选清单…',
      'loading.live': '正在搜索全部市场…',
      'loading.detail': '正在加载技能详情…',
      'loading.installed': '正在读取已安装技能…',
      'sources.ok': '正常',
      'sources.failed': '不可用',
      'sources.live': '实时来源',
      'common.retry': '重试',
      'common.close': '关闭',
      'common.cancel': '取消',
    }

    const en = {
      'nav.label': 'Skill Market',
      'page.eyebrow': 'SKILL MARKET',
      'page.title': 'Skill Market',
      'page.subtitle': 'Discover, preview, and install community skills. Installed skills land in your local skill directory and become available in the next session.',
      'page.installed': 'My skills',
      'page.refresh': 'Refresh',
      'stats.skills': 'Curated skills',
      'stats.categories': 'Categories',
      'stats.installed': 'Installed',
      'stats.updated': 'Catalog updated',
      'scope.curated': 'Curated',
      'scope.live': 'All markets',
      'scope.liveHint': 'Search ClawHub and SkillHub live',
      'scope.curatedHint': 'Hand-picked quality skills, ranked by popularity',
      'scope.liveActive': 'Live search',
      'search.placeholder': 'Search skills, use cases, or authors…',
      'search.livePlaceholder': 'Type a keyword and press Enter to search all markets',
      'search.clear': 'Clear search',
      'filter.all': 'All',
      'filter.category': 'Category',
      'filter.source': 'Source',
      'filter.security': 'Security',
      'filter.installed': 'Install state',
      'filter.installedOnly': 'Installed',
      'filter.installable': 'Not installed',
      'filter.clear': 'Clear filters',
      'filter.active': 'Filtered',
      'category.all': 'All',
      'source.clawhub': 'ClawHub',
      'source.skillhub': 'SkillHub',
      'source.local': 'Local',
      'security.verified': 'Verified',
      'security.benign': 'Scan clean',
      'security.unknown': 'Unaudited',
      'security.flagged': 'Flagged',
      'card.featured': 'Featured',
      'card.downloads': 'downloads',
      'card.stars': 'stars',
      'card.installs': 'installs',
      'card.install': 'Install',
      'card.installed': 'Installed',
      'card.view': 'View',
      'result.count': '{n} skills',
      'result.filtered': 'Filtered',
      'result.curated': 'Curated',
      'result.live': 'All markets',
      'result.sort': 'Ranked by popularity',
      'disclaimer.tag': 'Before installing',
      'disclaimer.text': 'Community skills are published by third parties and may contain instructions, scripts, or external requests. Installing never runs scripts automatically. Review SKILL.md and the security report, and only install sources you trust.',
      'empty.title': 'No matching skills',
      'empty.body': 'Try a shorter keyword or clear the filters.',
      'empty.liveTitle': 'Search all markets',
      'empty.liveBody': 'Type a keyword and press Enter to query ClawHub and SkillHub live.',
      'empty.installedTitle': 'No skills installed yet',
      'empty.installedBody': 'Pick a skill from the market and it will show up here.',
      'error.title': 'Something went wrong',
      'error.retry': 'Retry',
      'error.catalog': 'Could not load the curated catalog.',
      'error.detail': 'Could not load skill details.',
      'error.installed': 'Could not read installed skills.',
      'error.network': 'Could not reach the skill market service.',
      'error.badId': 'The skill identifier is invalid.',
      'detail.back': 'Back to market',
      'detail.overview': 'Overview',
      'detail.files': 'Files',
      'detail.security': 'Security',
      'detail.changelog': 'Changelog',
      'detail.install': 'Install',
      'detail.installed': 'Installed',
      'detail.uninstall': 'Uninstall',
      'detail.installUnavailable': 'Source unavailable',
      'detail.stale': 'Showing the curated snapshot because the source is unreachable. Installation is disabled.',
      'detail.about': 'About this skill',
      'detail.capabilities': 'Know before you install',
      'detail.capabilitiesHint': 'Derived statically from SKILL.md and the file list. This is not a full audit.',
      'detail.commands': 'Commands & executables',
      'detail.network': 'External requests',
      'detail.secrets': 'Secrets & env vars',
      'detail.hooks': 'Hooks & automation',
      'detail.scripts': 'Script files',
      'detail.noCapabilities': 'No commands, hooks, or secrets declared in SKILL.md.',
      'detail.triggers': 'When to use it',
      'detail.noTriggers': 'No inferred triggers.',
      'detail.info': 'Skill info',
      'detail.author': 'Author',
      'detail.source': 'Source',
      'detail.category': 'Category',
      'detail.version': 'Version',
      'detail.license': 'License',
      'detail.updated': 'Updated',
      'detail.requiresApiKey': 'Requires API key',
      'detail.yes': 'Yes',
      'detail.no': 'No',
      'detail.installPath': 'Install location',
      'detail.installPathHint': 'Written to your local skill directory and available in the next session.',
      'detail.sourcePage': 'View on source site',
      'detail.filesCount': '{n} files',
      'detail.totalSize': '{size}',
      'detail.filePreview': 'File preview',
      'detail.selectFile': 'Select a file on the left',
      'detail.fileLoading': 'Reading file…',
      'detail.fileError': 'Could not read this file.',
      'detail.fileTooLarge': 'This file is too large to preview.',
      'detail.binary': 'Binary file, preview unavailable.',
      'detail.truncated': 'Preview truncated',
      'detail.copy': 'Copy',
      'detail.copied': 'Copied',
      'detail.securityNote': 'Security status comes from the source scanner and reflects its own judgement.',
      'detail.noReports': 'The source did not provide security details.',
      'detail.noChangelog': 'The source did not provide a changelog.',
      'detail.readingTime': 'About {n} min read',
      'detail.curatedNote': 'Included in the Skill Market curated catalog.',
      'detail.uncuratedNote': 'Found by live search, not curated by Skill Market.',
      'detail.installDialog.title': 'Install skill',
      'detail.installDialog.location': 'Will be installed to',
      'detail.installDialog.effect': 'The skill appears in the available skill list of your next session.',
      'detail.installDialog.warning': 'This skill is not audited, or the source flagged a risk. Review SKILL.md and the security report before trusting it.',
      'detail.installDialog.flagged': 'The source flagged this skill as risky. Installing is not recommended unless you fully trust it.',
      'detail.installDialog.ack': 'I have reviewed the skill and its security details and want to install it',
      'detail.installDialog.cancel': 'Cancel',
      'detail.installDialog.confirm': 'Install',
      'detail.installDialog.installing': 'Installing…',
      'detail.installDialog.failed': 'Install failed',
      'detail.uninstallDialog.title': 'Uninstall skill',
      'detail.uninstallDialog.body': 'This deletes {path} and everything inside it. This cannot be undone.',
      'detail.uninstallDialog.cancel': 'Cancel',
      'detail.uninstallDialog.confirm': 'Uninstall',
      'detail.uninstallDialog.removing': 'Uninstalling…',
      'detail.uninstallDialog.failed': 'Uninstall failed',
      'installed.title': 'My skills',
      'installed.subtitle': 'Skills installed on this machine. Market-installed skills can be inspected and removed here.',
      'installed.back': 'Back to market',
      'installed.managed': 'From Skill Market',
      'installed.local': 'Local skills',
      'installed.managedHint': 'Installed by Skill Market with version and install time.',
      'installed.localHint': 'Placed in the skill directory by hand; Skill Market will not delete them.',
      'installed.empty': 'No skills installed yet',
      'installed.emptyBody': 'Pick a skill from the market and it will show up here.',
      'installed.view': 'View',
      'installed.remove': 'Uninstall',
      'installed.path': 'Path',
      'installed.installedAt': 'Installed',
      'installed.size': 'Size',
      'installed.files': 'Files',
      'installed.count': '{n} installed',
      'installed.browse': 'Browse the market',
      'installed.skillsDir': 'Skill directory',
      'toast.installed': 'Installed {name}',
      'toast.uninstalled': 'Uninstalled {name}',
      'toast.copied': 'Copied to clipboard',
      'toast.copyFailed': 'Copy failed — select the text manually',
      'toast.refreshed': 'Curated catalog refreshed',
      'loading.catalog': 'Loading curated catalog…',
      'loading.live': 'Searching all markets…',
      'loading.detail': 'Loading skill details…',
      'loading.installed': 'Reading installed skills…',
      'sources.ok': 'Online',
      'sources.failed': 'Unavailable',
      'sources.live': 'Live sources',
      'common.retry': 'Retry',
      'common.close': 'Close',
      'common.cancel': 'Cancel',
    }

    // ── Helpers ─────────────────────────────────────────────────────────────
    function cx() {
      const out = []
      for (const value of arguments) if (value) out.push(value)
      return out.join(' ')
    }

    function formatCount(value) {
      const n = Number(value) || 0
      if (n >= 1000000) return `${(n / 1000000).toFixed(n >= 10000000 ? 0 : 1)}M`
      if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
      return String(n)
    }

    function formatBytes(value) {
      const n = Number(value) || 0
      if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`
      if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`
      return `${n} B`
    }

    function formatDate(value, locale) {
      const n = typeof value === 'number' ? value : Number(value)
      if (!Number.isFinite(n) || n <= 0) return '—'
      try {
        return new Date(n).toLocaleDateString(String(locale || '').startsWith('zh') ? 'zh-CN' : 'en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      } catch {
        return '—'
      }
    }

    function ownerOf(item) {
      if (!item) return ''
      if (typeof item.owner === 'string' && item.owner) return item.owner
      if (item.author && typeof item.author.handle === 'string') return item.author.handle
      return ''
    }

    function sourceLabel(source, t) {
      if (source === 'clawhub') return t('source.clawhub')
      if (source === 'skillhub') return t('source.skillhub')
      return t('source.local')
    }

    function categoryLabel(category, categories) {
      const found = (categories || []).find((entry) => entry.key === category)
      return found ? categoryName(found) : category
    }

    function localeNow() {
      if (RUNTIME && RUNTIME.locale && RUNTIME.locale.getSnapshot) {
        return RUNTIME.locale.getSnapshot().active
      }
      return 'zh'
    }

    function categoryName(category) {
      if (!category) return ''
      const zh = String(localeNow()).startsWith('zh')
      return (zh ? category.name : category.nameEn) || category.label || category.name || category.key
    }

    function hashText(text) {
      let hash = 0
      const value = String(text || '')
      for (let index = 0; index < value.length; index += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(index)
        hash |= 0
      }
      return Math.abs(hash)
    }

    function initialsOf(name) {
      const value = String(name || '?').trim()
      const ascii = value.split(/[^A-Za-z0-9]+/).filter(Boolean)
      if (ascii.length >= 2) return (ascii[0][0] + ascii[1][0]).toUpperCase()
      if (ascii.length === 1) return ascii[0].slice(0, 2).toUpperCase()
      return value.slice(0, 1)
    }

    function securityMeta(status) {
      if (status === 'verified') return { tone: 'success', icon: 'shieldCheck' }
      if (status === 'benign') return { tone: 'success', icon: 'shieldCheck' }
      if (status === 'flagged') return { tone: 'danger', icon: 'shieldAlert' }
      return { tone: 'muted', icon: 'shieldQuestion' }
    }

    function debounceDelay(value) {
      return value ? 260 : 0
    }

    function useDebounced(value, delay) {
      const [state, setState] = React.useState(value)
      React.useEffect(() => {
        if (!delay) {
          setState(value)
          return undefined
        }
        const timer = window.setTimeout(() => setState(value), delay)
        return () => window.clearTimeout(timer)
      }, [value, delay])
      return state
    }

    function apiPath(path) {
      return path
    }

    async function apiRequest(path, options) {
      const init = options || {}
      const response = await fetch(apiPath(path), {
        method: init.method || 'GET',
        headers: init.body === undefined ? undefined : { 'content-type': 'application/json' },
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        signal: init.signal,
      })
      let payload = null
      try {
        payload = await response.json()
      } catch {
        payload = null
      }
      if (!response.ok) {
        const detail = payload && payload.error ? payload.error : null
        const error = new Error(detail && detail.message ? detail.message : `HTTP ${response.status}`)
        error.code = detail && detail.code ? detail.code : 'HTTP_' + response.status
        error.status = response.status
        throw error
      }
      if (!payload || typeof payload !== 'object') {
        throw new Error('The response was not valid JSON')
      }
      return payload
    }

    function describeError(error, fallback) {
      if (!error) return fallback
      const code = error.code || ''
      if (code === 'SKILL_HUB_UPSTREAM') return '无法连接技能来源，请检查网络后重试。'
      if (code === 'SKILL_HUB_ALREADY_INSTALLED') return '该技能已经安装。'
      if (code === 'SKILL_HUB_NAME_CONFLICT') return '技能目录中已有同名目录，请先处理后再安装。'
      if (code === 'SKILL_HUB_TOO_LARGE' || code === 'SKILL_HUB_TOO_MANY_FILES') return '该技能超出大小或文件数量限制。'
      if (code === 'SKILL_HUB_NO_FILES' || code === 'SKILL_HUB_NO_MANIFEST') return '该技能没有可安装的 SKILL.md。'
      if (code === 'SKILL_HUB_NOT_MANAGED') return '该目录不是技能市场安装的，无法在此卸载。'
      if (code === 'SKILL_HUB_NOT_INSTALLED') return '该技能不在已安装列表中。'
      if (code === 'SKILL_HUB_INSTALLING') return '该技能正在安装，请稍候。'
      if (code === 'SKILL_HUB_BAD_ID' || code === 'SKILL_HUB_BAD_REQUEST') return '请求参数无效。'
      if (error.status === 401 || error.status === 403) return '没有权限访问技能市场服务。'
      if (error.message && !/^HTTP \d+$/.test(error.message)) return error.message
      return fallback
    }

    // ── Icons ───────────────────────────────────────────────────────────────
    const ICONS = {
      search: [
        ['circle', { cx: 11, cy: 11, r: 7 }],
        ['path', { d: 'm20 20-3.6-3.6' }],
      ],
      store: [
        ['path', { d: 'M4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9' }],
        ['path', { d: 'M3 10 5.2 4h13.6L21 10' }],
        ['path', { d: 'M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0' }],
      ],
      download: [
        ['path', { d: 'M12 3v11' }],
        ['path', { d: 'm7.5 10 4.5 4.5 4.5-4.5' }],
        ['path', { d: 'M4 19h16' }],
      ],
      star: [
        ['path', { d: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z' }],
      ],
      shield: [
        ['path', { d: 'M12 3 5 6v6c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6l-7-3Z' }],
      ],
      shieldCheck: [
        ['path', { d: 'M12 3 5 6v6c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6l-7-3Z' }],
        ['path', { d: 'm9 12 2 2 4-4' }],
      ],
      shieldAlert: [
        ['path', { d: 'M12 3 5 6v6c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6l-7-3Z' }],
        ['path', { d: 'M12 9v4' }],
        ['circle', { cx: 12, cy: 16.2, r: 0.7, fill: 'currentColor', stroke: 'none' }],
      ],
      shieldQuestion: [
        ['path', { d: 'M12 3 5 6v6c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6l-7-3Z' }],
        ['path', { d: 'M9.7 9.7a2.3 2.3 0 1 1 3.5 2c-.7.4-1.2 1-1.2 1.9' }],
        ['circle', { cx: 12, cy: 16.3, r: 0.7, fill: 'currentColor', stroke: 'none' }],
      ],
      check: [['path', { d: 'm5 12.5 4.5 4.5L19 7' }]],
      x: [['path', { d: 'M6 6l12 12M18 6 6 18' }]],
      arrowLeft: [
        ['path', { d: 'M19 12H5' }],
        ['path', { d: 'm11 18-6-6 6-6' }],
      ],
      arrowRight: [
        ['path', { d: 'M5 12h14' }],
        ['path', { d: 'm13 6 6 6-6 6' }],
      ],
      refresh: [
        ['path', { d: 'M20 11a8 8 0 1 0-2.4 6.7' }],
        ['path', { d: 'M20 5v6h-6' }],
      ],
      trash: [
        ['path', { d: 'M4 7h16' }],
        ['path', { d: 'M9 7V5h6v2' }],
        ['path', { d: 'M6 7l1 13h10l1-13' }],
        ['path', { d: 'M10 11v5M14 11v5' }],
      ],
      file: [
        ['path', { d: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z' }],
        ['path', { d: 'M14 3v5h5' }],
      ],
      folder: [
        ['path', { d: 'M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z' }],
      ],
      chevronDown: [['path', { d: 'm6 9 6 6 6-6' }]],
      external: [
        ['path', { d: 'M14 4h6v6' }],
        ['path', { d: 'M20 4 11 13' }],
        ['path', { d: 'M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5' }],
      ],
      terminal: [
        ['rect', { x: 3, y: 4, width: 18, height: 16, rx: 2 }],
        ['path', { d: 'm7 9 3 3-3 3' }],
        ['path', { d: 'M13 15h4' }],
      ],
      globe: [
        ['circle', { cx: 12, cy: 12, r: 9 }],
        ['path', { d: 'M3 12h18' }],
        ['path', { d: 'M12 3a15 15 0 0 1 0 18' }],
        ['path', { d: 'M12 3a15 15 0 0 0 0 18' }],
      ],
      key: [
        ['circle', { cx: 8, cy: 15, r: 4 }],
        ['path', { d: 'm11 12 9-9' }],
        ['path', { d: 'm17 6 2 2' }],
        ['path', { d: 'm14 9 2 2' }],
      ],
      clock: [
        ['circle', { cx: 12, cy: 12, r: 9 }],
        ['path', { d: 'M12 7v5l3 2' }],
      ],
      spark: [
        ['path', { d: 'M12 3c.6 4.5 3 6.9 7.5 7.5-4.5.6-6.9 3-7.5 7.5-.6-4.5-3-6.9-7.5-7.5C9 9.9 11.4 7.5 12 3Z' }],
      ],
      filter: [
        ['path', { d: 'M4 6h16' }],
        ['path', { d: 'M7 12h10' }],
        ['path', { d: 'M10 18h4' }],
      ],
      package: [
        ['path', { d: 'm12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z' }],
        ['path', { d: 'm4 7.5 8 4.5 8-4.5' }],
        ['path', { d: 'M12 12v9' }],
      ],
      layers: [
        ['path', { d: 'm12 3 9 5-9 5-9-5 9-5Z' }],
        ['path', { d: 'm3 13 9 5 9-5' }],
      ],
      copy: [
        ['rect', { x: 9, y: 9, width: 11, height: 11, rx: 2 }],
        ['path', { d: 'M5 15V5a1 1 0 0 1 1-1h9' }],
      ],
      info: [
        ['circle', { cx: 12, cy: 12, r: 9 }],
        ['path', { d: 'M12 11v5' }],
        ['circle', { cx: 12, cy: 8, r: 0.7, fill: 'currentColor', stroke: 'none' }],
      ],
      warning: [
        ['path', { d: 'M12 3 2.8 20h18.4L12 3Z' }],
        ['path', { d: 'M12 9v5' }],
        ['circle', { cx: 12, cy: 17, r: 0.7, fill: 'currentColor', stroke: 'none' }],
      ],
      lock: [
        ['rect', { x: 5, y: 10, width: 14, height: 10, rx: 2 }],
        ['path', { d: 'M8 10V7a4 4 0 0 1 8 0v3' }],
      ],
      book: [
        ['path', { d: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5Z' }],
        ['path', { d: 'M4 21.5A2.5 2.5 0 0 1 6.5 19H20' }],
      ],
    }

    function Icon(props) {
      const name = props.name
      const paths = ICONS[name] || ICONS.info
      const size = props.size || 16
      const strokeWidth = props.strokeWidth || 1.7
      return h(
        'svg',
        {
          className: props.className,
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
          focusable: 'false',
        },
        paths.map((entry, index) => h(entry[0], { key: index, ...entry[1] })),
      )
    }

    function Avatar(props) {
      const item = props.item || {}
      const name = item.name || item.slug || '?'
      const hue = hashText(item.id || name) % 360
      const size = props.size || 40
      const radius = props.radius || Math.round(size * 0.28)
      const style = {
        width: size,
        height: size,
        borderRadius: radius,
        fontSize: Math.max(11, Math.round(size * (props.small ? 0.3 : 0.34))),
        background: `linear-gradient(135deg, hsl(${hue} 58% 55%), hsl(${(hue + 46) % 360} 62% 43%))`,
      }
      return h(
        'span',
        { className: cx('smk-avatar', props.className), style, 'aria-hidden': 'true' },
        h('span', { className: 'smk-avatar-text' }, initialsOf(name)),
      )
    }

    function SecurityBadge(props) {
      const meta = securityMeta(props.status)
      const t = props.t
      return h(
        'span',
        { className: cx('smk-badge', 'smk-badge-' + meta.tone, props.className) },
        h(Icon, { name: meta.icon, size: 12 }),
        h('span', null, t('security.' + (props.status || 'unknown'))),
      )
    }

    function Spinner(props) {
      return h('span', { className: cx('smk-spinner', props.className), 'aria-hidden': 'true' })
    }

    function CopyButton(props) {
      const t = props.t
      const [copied, setCopied] = React.useState(false)
      const timer = React.useRef(undefined)
      React.useEffect(
        () => () => {
          if (timer.current) window.clearTimeout(timer.current)
        },
        [],
      )
      const copy = () => {
        const value = props.value || ''
        const done = () => {
          setCopied(true)
          if (timer.current) window.clearTimeout(timer.current)
          timer.current = window.setTimeout(() => setCopied(false), 1600)
          if (props.onCopied) props.onCopied()
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(done, () => {
            if (props.onError) props.onError()
          })
          return
        }
        try {
          const area = document.createElement('textarea')
          area.value = value
          area.style.position = 'fixed'
          area.style.opacity = '0'
          document.body.appendChild(area)
          area.select()
          document.execCommand('copy')
          document.body.removeChild(area)
          done()
        } catch {
          if (props.onError) props.onError()
        }
      }
      return h(
        'button',
        {
          type: 'button',
          className: cx('smk-icon-button', props.className),
          onClick: copy,
          title: copied ? t('detail.copied') : t('detail.copy'),
          'aria-label': copied ? t('detail.copied') : t('detail.copy'),
        },
        h(Icon, { name: copied ? 'check' : 'copy', size: 14 }),
      )
    }

    // ── Markdown ────────────────────────────────────────────────────────────
    function renderInline(text, keyPrefix) {
      const value = String(text || '')
      const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\(https?:\/\/[^)\s]+\))/g
      const parts = []
      let last = 0
      let match
      let index = 0
      while ((match = pattern.exec(value)) !== null) {
        if (match.index > last) parts.push(value.slice(last, match.index))
        const token = match[0]
        const key = `${keyPrefix}-i${index}`
        index += 1
        if (token.startsWith('`')) {
          parts.push(h('code', { key, className: 'smk-inline-code' }, token.slice(1, -1)))
        } else if (token.startsWith('**')) {
          parts.push(h('strong', { key }, renderInline(token.slice(2, -2), key)))
        } else if (token.startsWith('*')) {
          parts.push(h('em', { key }, renderInline(token.slice(1, -1), key)))
        } else {
          const close = token.indexOf('](')
          const label = token.slice(1, close)
          const href = token.slice(close + 2, -1)
          parts.push(
            h(
              'a',
              { key, href, target: '_blank', rel: 'noreferrer noopener', className: 'smk-link' },
              renderInline(label, key),
            ),
          )
        }
        last = match.index + token.length
      }
      if (last < value.length) parts.push(value.slice(last))
      return parts
    }

    function renderMarkdown(source, keyPrefix) {
      const lines = String(source || '').replace(/\r\n/g, '\n').split('\n')
      const blocks = []
      let index = 0
      let blockIndex = 0
      const nextKey = () => `${keyPrefix}-b${blockIndex++}`

      while (index < lines.length) {
        const line = lines[index]
        if (/^\s*$/.test(line)) {
          index += 1
          continue
        }
        const fence = line.match(/^```\s*([A-Za-z0-9_+-]*)\s*$/)
        if (fence) {
          const body = []
          index += 1
          while (index < lines.length && !/^```\s*$/.test(lines[index])) {
            body.push(lines[index])
            index += 1
          }
          index += 1
          blocks.push(h('pre', { key: nextKey(), className: 'smk-code' }, h('code', null, body.join('\n'))))
          continue
        }
        const heading = line.match(/^(#{1,4})\s+(.*)$/)
        if (heading) {
          const level = Math.min(4, heading[1].length)
          blocks.push(
            h(`h${level + 1}`, { key: nextKey(), className: 'smk-prose-heading' }, renderInline(heading[2], nextKey())),
          )
          index += 1
          continue
        }
        if (/^\s*(---+|\*\*\*+|___+)\s*$/.test(line)) {
          blocks.push(h('hr', { key: nextKey(), className: 'smk-prose-rule' }))
          index += 1
          continue
        }
        if (/^\s*>\s?/.test(line)) {
          const body = []
          while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
            body.push(lines[index].replace(/^\s*>\s?/, ''))
            index += 1
          }
          blocks.push(
            h('blockquote', { key: nextKey(), className: 'smk-quote' }, renderInline(body.join(' '), nextKey())),
          )
          continue
        }
        const unordered = /^\s*[-*+]\s+(.*)$/.exec(line)
        const ordered = /^\s*\d+[.)]\s+(.*)$/.exec(line)
        if (unordered || ordered) {
          const isOrdered = Boolean(ordered)
          const items = []
          while (index < lines.length) {
            const match = isOrdered ? /^\s*\d+[.)]\s+(.*)$/.exec(lines[index]) : /^\s*[-*+]\s+(.*)$/.exec(lines[index])
            if (!match) break
            items.push(h('li', { key: nextKey() }, renderInline(match[1], nextKey())))
            index += 1
          }
          blocks.push(h(isOrdered ? 'ol' : 'ul', { key: nextKey(), className: 'smk-list' }, items))
          continue
        }
        const paragraph = []
        while (index < lines.length) {
          const current = lines[index]
          if (
            /^\s*$/.test(current) ||
            /^```/.test(current) ||
            /^(#{1,4})\s+/.test(current) ||
            /^\s*>\s?/.test(current) ||
            /^\s*([-*+])\s+/.test(current) ||
            /^\s*\d+[.)]\s+/.test(current) ||
            /^\s*(---+|\*\*\*+|___+)\s*$/.test(current)
          ) {
            break
          }
          paragraph.push(current.trim())
          index += 1
        }
        blocks.push(h('p', { key: nextKey(), className: 'smk-prose-p' }, renderInline(paragraph.join(' '), nextKey())))
      }
      return blocks
    }

    // ── Shared UI ───────────────────────────────────────────────────────────
    function MenuSelect(props) {
      const t = props.t
      const [open, setOpen] = React.useState(false)
      const root = React.useRef(null)
      React.useEffect(() => {
        if (!open) return undefined
        const onPointer = (event) => {
          if (root.current && !root.current.contains(event.target)) setOpen(false)
        }
        const onKey = (event) => {
          if (event.key === 'Escape') setOpen(false)
        }
        document.addEventListener('pointerdown', onPointer)
        document.addEventListener('keydown', onKey)
        return () => {
          document.removeEventListener('pointerdown', onPointer)
          document.removeEventListener('keydown', onKey)
        }
      }, [open])
      const options = props.options || []
      const active = props.value !== 'all' && props.value !== undefined
      const selected = options.find((option) => option.value === props.value)
      return h(
        'div',
        { className: cx('smk-select', active && 'is-active'), ref: root },
        h(
          'button',
          {
            type: 'button',
            className: 'smk-select-button',
            onClick: () => setOpen((value) => !value),
            'aria-haspopup': 'listbox',
            'aria-expanded': open,
          },
          h(Icon, { name: props.icon || 'filter', size: 14 }),
          h('span', { className: 'smk-select-label' }, selected ? selected.label : props.label),
          h(Icon, { name: 'chevronDown', size: 13, className: cx('smk-chevron', open && 'is-open') }),
        ),
        open
          ? h(
              'div',
              { className: 'smk-menu', role: 'listbox', 'aria-label': props.label },
              options.map((option) =>
                h(
                  'button',
                  {
                    key: option.value,
                    type: 'button',
                    role: 'option',
                    'aria-selected': option.value === props.value,
                    className: cx('smk-menu-item', option.value === props.value && 'is-selected'),
                    onClick: () => {
                      props.onChange(option.value)
                      setOpen(false)
                    },
                  },
                  h('span', null, option.label),
                  option.count !== undefined ? h('span', { className: 'smk-menu-count' }, option.count) : null,
                  option.value === props.value ? h(Icon, { name: 'check', size: 14 }) : null,
                ),
              ),
            )
          : null,
      )
    }

    function Segment(props) {
      return h(
        'div',
        { className: 'smk-segment', role: 'tablist', 'aria-label': props.label },
        props.options.map((option) =>
          h(
            'button',
            {
              key: option.value,
              type: 'button',
              role: 'tab',
              'aria-selected': props.value === option.value,
              className: cx('smk-segment-item', props.value === option.value && 'is-active'),
              onClick: () => props.onChange(option.value),
            },
            option.icon ? h(Icon, { name: option.icon, size: 14 }) : null,
            h('span', null, option.label),
            option.badge !== undefined ? h('span', { className: 'smk-segment-badge' }, option.badge) : null,
          ),
        ),
      )
    }

    function EmptyState(props) {
      return h(
        'div',
        { className: 'smk-empty' },
        h('span', { className: 'smk-empty-icon' }, h(Icon, { name: props.icon || 'search', size: 22 })),
        h('h3', { className: 'smk-empty-title' }, props.title),
        props.body ? h('p', { className: 'smk-empty-body' }, props.body) : null,
        props.action ? h('div', { className: 'smk-empty-action' }, props.action) : null,
      )
    }

    function ErrorState(props) {
      return h(
        'div',
        { className: 'smk-error' },
        h('span', { className: 'smk-error-icon' }, h(Icon, { name: 'warning', size: 22 })),
        h('div', { className: 'smk-error-copy' },
          h('h3', { className: 'smk-error-title' }, props.title || props.t('error.title')),
          h('p', { className: 'smk-error-body' }, props.message),
        ),
        h(
          'button',
          { type: 'button', className: 'smk-button', onClick: props.onRetry },
          h(Icon, { name: 'refresh', size: 14 }),
          h('span', null, props.t('error.retry')),
        ),
      )
    }

    function SkeletonCard() {
      return h(
        'div',
        { className: 'smk-card smk-card-skeleton', 'aria-hidden': 'true' },
        h('div', { className: 'smk-skel-row' },
          h('span', { className: 'smk-skel smk-skel-avatar' }),
          h('div', { className: 'smk-skel-col' },
            h('span', { className: 'smk-skel smk-skel-line', style: { width: '55%' } }),
            h('span', { className: 'smk-skel smk-skel-line', style: { width: '32%' } }),
          ),
        ),
        h('span', { className: 'smk-skel smk-skel-line', style: { width: '100%' } }),
        h('span', { className: 'smk-skel smk-skel-line', style: { width: '78%' } }),
        h('div', { className: 'smk-skel-row' },
          h('span', { className: 'smk-skel smk-skel-chip' }),
          h('span', { className: 'smk-skel smk-skel-chip' }),
        ),
      )
    }

    function SkeletonGrid(props) {
      const count = props.count || 9
      const items = []
      for (let index = 0; index < count; index += 1) items.push(h(SkeletonCard, { key: index }))
      return h('div', { className: 'smk-grid' }, items)
    }

    // ── Cards ───────────────────────────────────────────────────────────────
    function SkillCard(props) {
      const item = props.item
      const t = props.t
      const categories = props.categories || []
      const installed = item.installState === 'installed'
      const unavailable = item.installState === 'unavailable'
      const downloads = item.stats && Number(item.stats.downloads) ? item.stats.downloads : 0
      const stars = item.stats && Number(item.stats.stars) ? item.stats.stars : 0
      const installs = item.stats && Number(item.stats.installs) ? item.stats.installs : 0
      return h(
        'article',
        {
          className: cx('smk-card', item.featured && 'is-featured', installed && 'is-installed'),
          'data-source': item.source,
        },
        h('button', {
          type: 'button',
          className: 'smk-card-hit',
          onClick: () => props.onOpen(item),
          'aria-label': `${item.name} — ${item.summary || ''}`,
        }),
        h(
          'div',
          { className: 'smk-card-content' },
          h(
            'div',
            { className: 'smk-card-head' },
            h(Avatar, { item, size: 42 }),
            h(
              'div',
              { className: 'smk-card-heading' },
              h(
                'div',
                { className: 'smk-card-title-row' },
                h('h3', { className: 'smk-card-title' }, item.name),
                item.version ? h('span', { className: 'smk-version' }, 'v' + item.version) : null,
              ),
              h(
                'div',
                { className: 'smk-card-byline' },
                h('span', { className: 'smk-source-dot', 'data-source': item.source }),
                sourceLabel(item.source, t),
                h('span', { className: 'smk-dot-sep' }),
                h(
                  'span',
                  { className: 'smk-byline-author' },
                  ownerOf(item) || categoryLabel(item.category, categories),
                ),
              ),
            ),
          ),
          h(
            'p',
            { className: 'smk-card-summary' },
            item.summary || item.summaryEn || item.description || item.slug,
          ),
          h(
            'div',
            { className: 'smk-card-badges' },
            item.featured
              ? h(
                  'span',
                  { className: 'smk-pill smk-pill-featured' },
                  h(Icon, { name: 'spark', size: 11 }),
                  t('card.featured'),
                )
              : null,
            h(SecurityBadge, { status: item.securityStatus, t }),
            (item.tags || []).slice(0, 2).map((tag) => h('span', { key: tag, className: 'smk-pill' }, tag)),
          ),
          h(
            'div',
            { className: 'smk-card-footer' },
            h(
              'div',
              { className: 'smk-card-stats' },
              h(
                'span',
                { className: 'smk-stat', title: t('card.downloads') },
                h(Icon, { name: 'download', size: 13 }),
                formatCount(downloads),
              ),
              stars
                ? h(
                    'span',
                    { className: 'smk-stat', title: t('card.stars') },
                    h(Icon, { name: 'star', size: 13 }),
                    formatCount(stars),
                  )
                : null,
              installs && !stars
                ? h(
                    'span',
                    { className: 'smk-stat', title: t('card.installs') },
                    h(Icon, { name: 'package', size: 13 }),
                    formatCount(installs),
                  )
                : null,
            ),
            h(
              'button',
              {
                type: 'button',
                className: cx(
                  'smk-install-mini',
                  installed && 'is-installed',
                  unavailable && 'is-unavailable',
                ),
                disabled: installed || unavailable,
                onClick: (event) => {
                  event.stopPropagation()
                  if (!installed && !unavailable) props.onInstall(item)
                },
              },
              h(Icon, { name: installed ? 'check' : unavailable ? 'warning' : 'download', size: 13 }),
              h(
                'span',
                null,
                installed ? t('card.installed') : unavailable ? t('detail.installUnavailable') : t('card.install'),
              ),
            ),
          ),
        ),
      )
    }

    // ── Home ────────────────────────────────────────────────────────────────
    function HomePage(props) {
      const t = props.t
      const meta = props.meta
      const catalog = props.catalog
      const items = props.items
      const loading = props.loading
      const error = props.error
      const scope = props.scope
      const filters = props.filters
      const categories = props.categories || []
      const live = props.live
      const data = props.data

      const categoryOptions = [{ value: 'all', label: t('filter.all') }].concat(
        categories.map((category) => ({ value: category.key, label: categoryName(category), count: category.count })),
      )
      const sourceOptions = [
        { value: 'all', label: t('filter.all') },
        { value: 'clawhub', label: t('source.clawhub') },
        { value: 'skillhub', label: t('source.skillhub') },
      ]
      const securityOptions = [
        { value: 'all', label: t('filter.all') },
        { value: 'verified', label: t('security.verified') },
        { value: 'benign', label: t('security.benign') },
        { value: 'unknown', label: t('security.unknown') },
        { value: 'flagged', label: t('security.flagged') },
      ]
      const installOptions = [
        { value: 'all', label: t('filter.all') },
        { value: 'installed', label: t('filter.installedOnly') },
        { value: 'installable', label: t('filter.installable') },
      ]
      const activeFilters = []
      if (filters.q) activeFilters.push({ key: 'q', label: `“${filters.q}”`, clear: () => props.setFilter('q', '') })
      if (filters.category !== 'all') {
        activeFilters.push({
          key: 'category',
          label: categoryLabel(filters.category, categories),
          clear: () => props.setFilter('category', 'all'),
        })
      }
      if (filters.source !== 'all') {
        activeFilters.push({
          key: 'source',
          label: sourceLabel(filters.source, t),
          clear: () => props.setFilter('source', 'all'),
        })
      }
      if (filters.security !== 'all') {
        activeFilters.push({
          key: 'security',
          label: t('security.' + filters.security),
          clear: () => props.setFilter('security', 'all'),
        })
      }
      if (filters.installed !== 'all') {
        activeFilters.push({
          key: 'installed',
          label: filters.installed === 'installed' ? t('filter.installedOnly') : t('filter.installable'),
          clear: () => props.setFilter('installed', 'all'),
        })
      }
      const hasFilters = activeFilters.length > 0
      const sources = live && live.sources ? live.sources : {}
      const showLivePrompt = scope === 'live' && !live.query && !live.loading
      const showSkeleton = loading && items.length === 0
      const updated = catalog.generatedAt || (meta && meta.generatedAt) || 0

      return h(
        'div',
        { className: 'smk-page' },
        h(
          'div',
          { className: 'smk-shell' },
          h(
            'header',
            { className: 'smk-hero' },
            h('span', { className: 'smk-hero-orb', 'aria-hidden': 'true' }),
            h(
              'div',
              { className: 'smk-hero-main' },
              h(
                'div',
                { className: 'smk-eyebrow' },
                h(Icon, { name: 'spark', size: 12 }),
                h('span', null, t('page.eyebrow')),
                h('span', { className: 'smk-eyebrow-sep' }),
                h('span', { className: 'smk-eyebrow-live' }, t('scope.curatedHint')),
              ),
              h('h1', { className: 'smk-title' }, t('page.title')),
              h('p', { className: 'smk-subtitle' }, t('page.subtitle')),
              h(
                'div',
                { className: 'smk-metrics' },
                h(
                  'div',
                  { className: 'smk-metric' },
                  h('span', { className: 'smk-metric-value' }, meta ? String(meta.total) : '—'),
                  h('span', { className: 'smk-metric-label' }, t('stats.skills')),
                ),
                h('span', { className: 'smk-metric-sep' }),
                h(
                  'div',
                  { className: 'smk-metric' },
                  h('span', { className: 'smk-metric-value' }, String(categories.length || 0)),
                  h('span', { className: 'smk-metric-label' }, t('stats.categories')),
                ),
                h('span', { className: 'smk-metric-sep' }),
                h(
                  'div',
                  { className: 'smk-metric' },
                  h('span', { className: 'smk-metric-value' }, meta ? String(meta.installedCount || 0) : '—'),
                  h('span', { className: 'smk-metric-label' }, t('stats.installed')),
                ),
                updated
                  ? h(
                      'span',
                      { className: 'smk-updated' },
                      h(Icon, { name: 'clock', size: 12 }),
                      t('stats.updated'),
                      ' ',
                      formatDate(updated, props.locale),
                    )
                  : null,
              ),
            ),
            h(
              'div',
              { className: 'smk-hero-side' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'smk-button smk-button-primary smk-button-lg',
                  onClick: props.onOpenInstalled,
                },
                h(Icon, { name: 'package', size: 15 }),
                h('span', null, t('page.installed')),
                meta && meta.installedCount
                  ? h('span', { className: 'smk-button-badge' }, String(meta.installedCount))
                  : null,
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'smk-button smk-button-ghost',
                  onClick: props.onRefresh,
                },
                h(Icon, { name: 'refresh', size: 14 }),
                h('span', null, t('page.refresh')),
              ),
            ),
          ),
          h(
            'div',
            { className: 'smk-notice' },
            h('span', { className: 'smk-notice-icon' }, h(Icon, { name: 'shield', size: 15 })),
            h(
              'div',
              { className: 'smk-notice-copy' },
              h('strong', null, t('disclaimer.tag')),
              h('span', null, t('disclaimer.text')),
            ),
          ),
          h(
            'div',
            { className: 'smk-toolbar' },
            h(
              'div',
              { className: 'smk-search' },
              h(Icon, { name: 'search', size: 16, className: 'smk-search-icon' }),
              h('input', {
                type: 'search',
                className: 'smk-search-input',
                value: filters.q,
                placeholder: scope === 'live' ? t('search.livePlaceholder') : t('search.placeholder'),
                onChange: (event) => props.setFilter('q', event.target.value),
                onKeyDown: (event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    props.onSearch()
                  }
                },
                'aria-label': t('search.placeholder'),
                spellCheck: false,
              }),
              filters.q
                ? h(
                    'button',
                    {
                      type: 'button',
                      className: 'smk-search-clear',
                      onClick: () => props.setFilter('q', ''),
                      'aria-label': t('search.clear'),
                    },
                    h(Icon, { name: 'x', size: 13 }),
                  )
                : null,
            ),
            h(MenuSelect, {
              t,
              icon: 'layers',
              label: t('filter.category'),
              value: filters.category,
              options: categoryOptions,
              onChange: (value) => props.setFilter('category', value),
            }),
            h(MenuSelect, {
              t,
              icon: 'store',
              label: t('filter.source'),
              value: filters.source,
              options: sourceOptions,
              onChange: (value) => props.setFilter('source', value),
            }),
            h(MenuSelect, {
              t,
              icon: 'shield',
              label: t('filter.security'),
              value: filters.security,
              options: securityOptions,
              onChange: (value) => props.setFilter('security', value),
            }),
            h(MenuSelect, {
              t,
              icon: 'package',
              label: t('filter.installed'),
              value: filters.installed,
              options: installOptions,
              onChange: (value) => props.setFilter('installed', value),
            }),
            h(Segment, {
              label: t('scope.curated'),
              value: scope,
              onChange: props.onScope,
              options: [
                { value: 'catalog', label: t('scope.curated'), icon: 'spark' },
                { value: 'live', label: t('scope.live'), icon: 'globe' },
              ],
            }),
          ),
          h(
            'div',
            { className: 'smk-scopebar' },
            h(
              'div',
              { className: 'smk-scope-note' },
              h(
                'span',
                { className: 'smk-scope-label' },
                scope === 'live' ? t('scope.liveActive') : t('scope.curated'),
              ),
              h('span', { className: 'smk-scope-text' }, scope === 'live'
                ? live.query
                  ? `“${live.query}” · ${t('scope.liveHint')}`
                  : t('scope.liveHint')
                : t('scope.curatedHint')),
            ),
            scope === 'live'
              ? h(
                  'div',
                  { className: 'smk-sources' },
                  h('span', { className: 'smk-sources-label' }, t('sources.live')),
                  ['clawhub', 'skillhub'].map((key) =>
                    h(
                      'span',
                      {
                        key,
                        className: cx(
                          'smk-source',
                          sources[key] && sources[key].status === 'failed' && 'is-failed',
                        ),
                        title: sources[key] && sources[key].error ? sources[key].error : undefined,
                      },
                      h('span', { className: 'smk-source-dot', 'data-source': key }),
                      sourceLabel(key, t),
                      h(
                        'span',
                        { className: 'smk-source-state' },
                        sources[key] && sources[key].status === 'failed'
                          ? t('sources.failed')
                          : sources[key]
                            ? t('sources.ok')
                            : '—',
                      ),
                    ),
                  ),
                )
              : null,
          ),
          scope === 'catalog'
            ? h(
                'div',
                { className: 'smk-categories' },
                h(
                  'button',
                  {
                    type: 'button',
                    className: cx('smk-chip', filters.category === 'all' && 'is-active'),
                    onClick: () => props.setFilter('category', 'all'),
                  },
                  t('category.all'),
                  h(
                    'span',
                    { className: 'smk-chip-count' },
                    categories.reduce((sum, category) => sum + (Number(category.count) || 0), 0),
                  ),
                ),
                categories.map((category) =>
                  h(
                    'button',
                    {
                      key: category.key,
                      type: 'button',
                      className: cx('smk-chip', filters.category === category.key && 'is-active'),
                      onClick: () => props.setFilter('category', category.key),
                    },
                    categoryName(category),
                    h('span', { className: 'smk-chip-count' }, String(category.count || 0)),
                  ),
                ),
              )
            : null,
          hasFilters
            ? h(
                'div',
                { className: 'smk-active' },
                h('span', { className: 'smk-active-label' }, t('filter.active')),
                activeFilters.map((filter) =>
                  h(
                    'button',
                    {
                      key: filter.key,
                      type: 'button',
                      className: 'smk-active-chip',
                      onClick: filter.clear,
                    },
                    h('span', null, filter.label),
                    h(Icon, { name: 'x', size: 11 }),
                  ),
                ),
                h(
                  'button',
                  { type: 'button', className: 'smk-active-clear', onClick: props.onClearFilters },
                  t('filter.clear'),
                ),
              )
            : null,
          h(
            'div',
            { className: 'smk-results-head' },
            h(
              'div',
              { className: 'smk-results-title-wrap' },
              h(
                'h2',
                { className: 'smk-results-title' },
                scope === 'live' ? t('result.live') : t('result.curated'),
              ),
              h(
                'span',
                { className: 'smk-results-count' },
                data.total === 1 ? t('result.count', { n: 1 }) : t('result.count', { n: data.total }),
              ),
            ),
            h('span', { className: 'smk-results-sort' }, h(Icon, { name: 'filter', size: 12 }), t('result.sort')),
          ),
          showLivePrompt
            ? h(EmptyState, {
                icon: 'globe',
                title: t('empty.liveTitle'),
                body: t('empty.liveBody'),
              })
            : error
              ? h(ErrorState, {
                  t,
                  message: error,
                  onRetry: props.onRetry,
                })
              : showSkeleton
                ? h(SkeletonGrid, { count: 9 })
                : items.length === 0
                  ? h(EmptyState, {
                      icon: scope === 'live' ? 'search' : 'package',
                      title: t('empty.title'),
                      body: t('empty.body'),
                      action: hasFilters
                        ? h(
                            'button',
                            { type: 'button', className: 'smk-button', onClick: props.onClearFilters },
                            t('filter.clear'),
                          )
                        : null,
                    })
                  : h(
                      'div',
                      { className: 'smk-grid' },
                      items.map((item) =>
                        h(SkillCard, {
                          key: item.id,
                          item,
                          t,
                          categories,
                          onOpen: props.onOpen,
                          onInstall: props.onInstall,
                        }),
                      ),
                    ),
          loading && items.length > 0
            ? h('div', { className: 'smk-inline-loading' }, h(Spinner), h('span', null, t('loading.catalog')))
            : null,
        ),
      )
    }

    // ── Detail ──────────────────────────────────────────────────────────────
    function joinPath(directory, name) {
      const base = String(directory || '').replace(/[\\/]+$/, '')
      if (!base) return name
      const separator = base.includes('\\') ? '\\' : '/'
      return `${base}${separator}${name}`
    }

    function reportTone(status) {
      const value = String(status || '').toLowerCase()
      if (value.includes('clean') || value.includes('pass') || value.includes('safe') || value.includes('ok')) {
        return 'success'
      }
      if (value.includes('warn')) return 'warn'
      if (value.includes('fail') || value.includes('malicious') || value.includes('danger')) return 'danger'
      return 'muted'
    }

    function CapabilityGroup(props) {
      const items = props.items || []
      if (items.length === 0) return null
      return h(
        'div',
        { className: cx('smk-cap', 'smk-cap-' + props.tone) },
        h('span', { className: 'smk-cap-icon' }, h(Icon, { name: props.icon, size: 15 })),
        h(
          'div',
          { className: 'smk-cap-copy' },
          h('div', { className: 'smk-cap-label' }, props.label),
          h('div', { className: 'smk-cap-items' }, items.slice(0, 4).map((value) => h('code', { key: value }, value))),
          items.length > 4
            ? h('div', { className: 'smk-cap-more' }, `+${items.length - 4}`)
            : null,
        ),
      )
    }

    function OverviewTab(props) {
      const item = props.item
      const t = props.t
      const capabilities = item.capabilities || {}
      const groups = [
        { key: 'commands', label: t('detail.commands'), icon: 'terminal', tone: 'accent', items: capabilities.commands },
        { key: 'network', label: t('detail.network'), icon: 'globe', tone: 'warn', items: capabilities.network },
        { key: 'secrets', label: t('detail.secrets'), icon: 'key', tone: 'warn', items: capabilities.secrets },
        { key: 'hooks', label: t('detail.hooks'), icon: 'layers', tone: 'accent', items: capabilities.hooks },
        { key: 'scripts', label: t('detail.scripts'), icon: 'file', tone: 'muted', items: capabilities.scripts },
      ].filter((group) => Array.isArray(group.items) && group.items.length > 0)
      const body = item.description || item.summary || ''
      const minutes = Math.max(1, Math.round(String(body).length / 420))
      return h(
        'div',
        { className: 'smk-tab-panel' },
        item.stale
          ? h(
              'div',
              { className: 'smk-alert smk-alert-warn' },
              h(Icon, { name: 'warning', size: 16 }),
              h('span', null, t('detail.stale')),
            )
          : null,
        groups.length
          ? h(
              'section',
              { className: 'smk-section' },
              h(
                'div',
                { className: 'smk-section-head' },
                h('h3', { className: 'smk-section-title' }, t('detail.capabilities')),
                h('span', { className: 'smk-section-hint' }, t('detail.capabilitiesHint')),
              ),
              h(
                'div',
                { className: 'smk-caps' },
                groups.map((group) =>
                  h(CapabilityGroup, {
                    key: group.key,
                    label: group.label,
                    icon: group.icon,
                    tone: group.tone,
                    items: group.items,
                  }),
                ),
              ),
            )
          : h(
              'div',
              { className: 'smk-cap-empty' },
              h(Icon, { name: 'shieldCheck', size: 15 }),
              h('span', null, t('detail.noCapabilities')),
            ),
        h(
          'section',
          { className: 'smk-section' },
          h('h3', { className: 'smk-section-title' }, t('detail.about')),
          body
            ? h('div', { className: 'smk-prose' }, renderMarkdown(body, 'md'))
            : h('p', { className: 'smk-muted-text' }, item.summary || '—'),
          h(
            'div',
            { className: 'smk-prose-foot' },
            h(Icon, { name: 'clock', size: 12 }),
            h('span', null, t('detail.readingTime', { n: minutes })),
            h('span', { className: 'smk-dot-sep' }),
            h('span', null, item.curated ? t('detail.curatedNote') : t('detail.uncuratedNote')),
          ),
        ),
      )
    }

    function FilesTab(props) {
      const item = props.item
      const t = props.t
      const detail = props.detail
      const files = item.files || []
      if (files.length === 0) {
        return h(
          'div',
          { className: 'smk-tab-panel' },
          h(EmptyState, { icon: 'file', title: t('detail.selectFile'), body: t('detail.fileError') }),
        )
      }
      const activePath = detail.filePath
      let content = null
      if (detail.fileLoading) {
        content = h('div', { className: 'smk-file-state' }, h(Spinner), h('span', null, t('detail.fileLoading')))
      } else if (detail.fileError) {
        content = h('div', { className: 'smk-file-state is-error' }, h(Icon, { name: 'warning', size: 18 }), h('span', null, detail.fileError))
      } else if (detail.file && detail.file.binary) {
        content = h('div', { className: 'smk-file-state' }, h(Icon, { name: 'file', size: 18 }), h('span', null, t('detail.binary')))
      } else if (detail.file) {
        content = h(
          'pre',
          { className: 'smk-file-code' },
          h('code', null, detail.file.content || ' '),
        )
      } else {
        content = h('div', { className: 'smk-file-state' }, h(Icon, { name: 'file', size: 18 }), h('span', null, t('detail.selectFile')))
      }
      const activeFile = files.find((file) => file.path === activePath)
      return h(
        'div',
        { className: 'smk-tab-panel smk-tab-files' },
        h(
          'div',
          { className: 'smk-file-list', role: 'listbox', 'aria-label': t('detail.files') },
          files.map((file) =>
            h(
              'button',
              {
                key: file.path,
                type: 'button',
                role: 'option',
                'aria-selected': file.path === activePath,
                className: cx('smk-file-item', file.path === activePath && 'is-active'),
                onClick: () => props.onFile(file.path),
                title: file.path,
              },
              h(Icon, { name: file.path.endsWith('.md') ? 'book' : 'file', size: 14 }),
              h('span', { className: 'smk-file-name' }, file.path),
              h('span', { className: 'smk-file-size' }, formatBytes(file.size)),
            ),
          ),
        ),
        h(
          'div',
          { className: 'smk-file-panel' },
          h(
            'div',
            { className: 'smk-file-head' },
            h(
              'div',
              { className: 'smk-file-head-copy' },
              h('span', { className: 'smk-file-path' }, activePath || t('detail.filePreview')),
              activeFile ? h('span', { className: 'smk-file-meta' }, formatBytes(activeFile.size)) : null,
              detail.file && detail.file.truncated
                ? h('span', { className: 'smk-pill smk-pill-warn' }, t('detail.truncated'))
                : null,
            ),
            detail.file && !detail.file.binary
              ? h(CopyButton, {
                  t,
                  value: detail.file.content || '',
                  onCopied: () => props.onCopied(),
                  onError: () => props.onCopyError(),
                })
              : null,
          ),
          h('div', { className: 'smk-file-body' }, content),
        ),
      )
    }

    function SecurityTab(props) {
      const item = props.item
      const t = props.t
      const reports = item.securityReports || []
      const meta = securityMeta(item.securityStatus)
      return h(
        'div',
        { className: 'smk-tab-panel' },
        h(
          'div',
          { className: cx('smk-security-banner', 'is-' + meta.tone) },
          h('span', { className: 'smk-security-icon' }, h(Icon, { name: meta.icon, size: 20 })),
          h(
            'div',
            { className: 'smk-security-copy' },
            h('div', { className: 'smk-security-title' }, t('security.' + (item.securityStatus || 'unknown'))),
            h(
              'div',
              { className: 'smk-security-sub' },
              item.securityNote ||
                (reports[0] && reports[0].statusText) ||
                t('detail.securityNote'),
            ),
          ),
        ),
        h(
          'section',
          { className: 'smk-section' },
          h('h3', { className: 'smk-section-title' }, t('detail.security')),
          reports.length
            ? h(
                'div',
                { className: 'smk-reports' },
                reports.map((report, index) =>
                  h(
                    'div',
                    { key: `${report.vendor}-${index}`, className: 'smk-report' },
                    h(
                      'div',
                      { className: 'smk-report-head' },
                      h('span', { className: 'smk-report-vendor' }, report.vendor || 'Scanner'),
                      h(
                        'span',
                        { className: cx('smk-pill', 'smk-pill-' + reportTone(report.status)) },
                        report.statusText || report.status || '—',
                      ),
                    ),
                    report.summary ? h('p', { className: 'smk-report-summary' }, report.summary) : null,
                    report.reportUrl
                      ? h(
                          'a',
                          {
                            className: 'smk-link smk-report-link',
                            href: report.reportUrl,
                            target: '_blank',
                            rel: 'noreferrer noopener',
                          },
                          t('detail.sourcePage'),
                          h(Icon, { name: 'external', size: 12 }),
                        )
                      : null,
                  ),
                ),
              )
            : h('p', { className: 'smk-muted-text' }, t('detail.noReports')),
          h('p', { className: 'smk-footnote' }, t('detail.securityNote')),
        ),
      )
    }

    function ChangelogTab(props) {
      const item = props.item
      const t = props.t
      const changelog = item.changelog
      if (!changelog) {
        return h('div', { className: 'smk-tab-panel' }, h(EmptyState, { icon: 'clock', title: t('detail.noChangelog') }))
      }
      return h(
        'div',
        { className: 'smk-tab-panel' },
        h(
          'div',
          { className: 'smk-changelog-head' },
          h('span', { className: 'smk-version' }, changelog.version ? 'v' + changelog.version : '—'),
          changelog.publishedAt
            ? h('span', { className: 'smk-muted-text' }, formatDate(changelog.publishedAt, props.locale))
            : null,
        ),
        h('pre', { className: 'smk-changelog' }, changelog.text || ''),
      )
    }

    function DetailPage(props) {
      const t = props.t
      const detail = props.detail
      const item = detail.item
      const meta = props.meta
      const categories = props.categories || []
      const locale = props.locale

      if (detail.loading && !item) {
        return h(
          'div',
          { className: 'smk-page' },
          h(
            'div',
            { className: 'smk-shell' },
            h(
              'div',
              { className: 'smk-detail-loading' },
              h('span', { className: 'smk-skel smk-skel-line', style: { width: '160px' } }),
              h(
                'div',
                { className: 'smk-detail-hero' },
                h('span', { className: 'smk-skel smk-skel-avatar', style: { width: 64, height: 64 } }),
                h(
                  'div',
                  { className: 'smk-skel-col', style: { flex: 1 } },
                  h('span', { className: 'smk-skel smk-skel-line', style: { width: '40%' } }),
                  h('span', { className: 'smk-skel smk-skel-line', style: { width: '72%' } }),
                  h('span', { className: 'smk-skel smk-skel-line', style: { width: '56%' } }),
                ),
              ),
              h('span', { className: 'smk-skel smk-skel-block' }),
              h('span', { className: 'smk-skel smk-skel-block' }),
            ),
          ),
        )
      }

      if (detail.error || !item) {
        return h(
          'div',
          { className: 'smk-page' },
          h(
            'div',
            { className: 'smk-shell' },
            h(
              'div',
              { className: 'smk-backbar' },
              h(
                'button',
                { type: 'button', className: 'smk-back', onClick: props.onBack },
                h(Icon, { name: 'arrowLeft', size: 15 }),
                t('detail.back'),
              ),
            ),
            h(ErrorState, {
              t,
              message: detail.error || t('error.detail'),
              onRetry: props.onRetry,
            }),
          ),
        )
      }

      const installed = item.installState === 'installed'
      const unavailable = item.installState === 'unavailable' || item.stale
      const stats = item.stats || {}
      const downloads = Number(stats.downloads) || 0
      const installs = Number(stats.installs) || 0
      const stars = Number(stats.stars) || 0
      const files = item.files || []
      const capabilities = item.capabilities || {}
      const triggers = item.triggers || []
      const hue = hashText(item.id || item.name) % 360
      const skillPath = meta && meta.skillsDir ? joinPath(meta.skillsDir, item.slug) : ''
      const tabs = [
        { key: 'overview', label: t('detail.overview'), icon: 'book' },
        { key: 'files', label: `${t('detail.files')}${files.length ? ` (${files.length})` : ''}`, icon: 'file' },
        { key: 'security', label: t('detail.security'), icon: 'shield' },
      ]
      if (item.changelog) tabs.push({ key: 'changelog', label: t('detail.changelog'), icon: 'clock' })

      return h(
        'div',
        { className: 'smk-page' },
        h(
          'div',
          { className: 'smk-shell' },
          h(
            'div',
            { className: 'smk-backbar' },
            h(
              'button',
              { type: 'button', className: 'smk-back', onClick: props.onBack },
              h(Icon, { name: 'arrowLeft', size: 15 }),
              t('detail.back'),
            ),
            h(
              'div',
              { className: 'smk-backbar-actions' },
              item.pageUrl
                ? h(
                    'a',
                    {
                      className: 'smk-button smk-button-ghost',
                      href: item.pageUrl,
                      target: '_blank',
                      rel: 'noreferrer noopener',
                    },
                    h(Icon, { name: 'external', size: 14 }),
                    t('detail.sourcePage'),
                  )
                : null,
              installed
                ? h(
                    'button',
                    {
                      type: 'button',
                      className: 'smk-button smk-button-danger',
                      onClick: () => props.onUninstall(item),
                    },
                    h(Icon, { name: 'trash', size: 14 }),
                    t('detail.uninstall'),
                  )
                : h(
                    'button',
                    {
                      type: 'button',
                      className: 'smk-button smk-button-primary',
                      disabled: unavailable,
                      onClick: () => props.onInstall(item),
                    },
                    h(Icon, { name: unavailable ? 'warning' : 'download', size: 14 }),
                    unavailable ? t('detail.installUnavailable') : t('detail.install'),
                  ),
            ),
          ),
          h(
            'header',
            { className: 'smk-detail-hero', style: { '--smk-hue': hue } },
            h('span', { className: 'smk-detail-orb', 'aria-hidden': 'true' }),
            h(Avatar, { item, size: 64, radius: 18 }),
            h(
              'div',
              { className: 'smk-detail-heading' },
              h(
                'div',
                { className: 'smk-detail-title-row' },
                h('h1', { className: 'smk-detail-title' }, item.name),
                item.version ? h('span', { className: 'smk-version' }, 'v' + item.version) : null,
                installed ? h('span', { className: 'smk-pill smk-pill-success' }, t('detail.installed')) : null,
              ),
              h('p', { className: 'smk-detail-summary' }, item.summary || item.description || ''),
              h(
                'div',
                { className: 'smk-detail-badges' },
                item.featured
                  ? h(
                      'span',
                      { className: 'smk-pill smk-pill-featured' },
                      h(Icon, { name: 'spark', size: 11 }),
                      t('card.featured'),
                    )
                  : null,
                h(SecurityBadge, { status: item.securityStatus, t }),
                h(
                  'span',
                  { className: 'smk-pill' },
                  h(Icon, { name: 'layers', size: 11 }),
                  categoryLabel(item.category, categories),
                ),
                h(
                  'span',
                  { className: 'smk-pill' },
                  h('span', { className: 'smk-source-dot', 'data-source': item.source }),
                  sourceLabel(item.source, t),
                ),
                ownerOf(item)
                  ? h(
                      'span',
                      { className: 'smk-pill' },
                      h(Icon, { name: 'info', size: 11 }),
                      ownerOf(item),
                    )
                  : null,
              ),
            ),
            h(
              'div',
              { className: 'smk-detail-stats' },
              h(
                'div',
                { className: 'smk-detail-stat' },
                h('span', { className: 'smk-detail-stat-value' }, formatCount(downloads)),
                h('span', { className: 'smk-detail-stat-label' }, t('card.downloads')),
              ),
              installs
                ? h(
                    'div',
                    { className: 'smk-detail-stat' },
                    h('span', { className: 'smk-detail-stat-value' }, formatCount(installs)),
                    h('span', { className: 'smk-detail-stat-label' }, t('card.installs')),
                  )
                : null,
              stars
                ? h(
                    'div',
                    { className: 'smk-detail-stat' },
                    h('span', { className: 'smk-detail-stat-value' }, formatCount(stars)),
                    h('span', { className: 'smk-detail-stat-label' }, t('card.stars')),
                  )
                : null,
              h(
                'div',
                { className: 'smk-detail-stat' },
                h('span', { className: 'smk-detail-stat-value' }, files.length ? String(files.length) : '—'),
                h('span', { className: 'smk-detail-stat-label' }, t('installed.files')),
              ),
            ),
          ),
          h(
            'div',
            { className: 'smk-detail-grid' },
            h(
              'div',
              { className: 'smk-detail-main' },
              h(
                'div',
                { className: 'smk-tabs', role: 'tablist' },
                tabs.map((tab) =>
                  h(
                    'button',
                    {
                      key: tab.key,
                      type: 'button',
                      role: 'tab',
                      'aria-selected': (detail.tab || 'overview') === tab.key,
                      className: cx('smk-tab', (detail.tab || 'overview') === tab.key && 'is-active'),
                      onClick: () => props.onTab(tab.key),
                    },
                    h(Icon, { name: tab.icon, size: 14 }),
                    h('span', null, tab.label),
                  ),
                ),
              ),
              (detail.tab || 'overview') === 'overview'
                ? h(OverviewTab, { item, t })
                : detail.tab === 'files'
                  ? h(FilesTab, {
                      item,
                      t,
                      detail,
                      onFile: props.onFile,
                      onCopied: props.onCopied,
                      onCopyError: props.onCopyError,
                    })
                  : detail.tab === 'security'
                    ? h(SecurityTab, { item, t })
                    : h(ChangelogTab, { item, t, locale }),
            ),
            h(
              'aside',
              { className: 'smk-detail-aside' },
              h(
                'section',
                { className: 'smk-aside-card' },
                h('h3', { className: 'smk-aside-title' }, t('detail.info')),
                h(
                  'dl',
                  { className: 'smk-info-list' },
                  h('div', { className: 'smk-info-row' },
                    h('dt', null, t('detail.author')),
                    h('dd', null, ownerOf(item) || '—'),
                  ),
                  h('div', { className: 'smk-info-row' },
                    h('dt', null, t('detail.source')),
                    h('dd', null, sourceLabel(item.source, t)),
                  ),
                  h('div', { className: 'smk-info-row' },
                    h('dt', null, t('detail.category')),
                    h('dd', null, categoryLabel(item.category, categories)),
                  ),
                  h('div', { className: 'smk-info-row' },
                    h('dt', null, t('detail.version')),
                    h('dd', null, item.version || '—'),
                  ),
                  h('div', { className: 'smk-info-row' },
                    h('dt', null, t('detail.license')),
                    h('dd', null, item.license || '—'),
                  ),
                  h('div', { className: 'smk-info-row' },
                    h('dt', null, t('detail.updated')),
                    h('dd', null, formatDate(item.updatedAt, locale)),
                  ),
                  h('div', { className: 'smk-info-row' },
                    h('dt', null, t('detail.requiresApiKey')),
                    h('dd', null, item.requiresApiKey ? t('detail.yes') : t('detail.no')),
                  ),
                ),
              ),
              triggers.length
                ? h(
                    'section',
                    { className: 'smk-aside-card' },
                    h('h3', { className: 'smk-aside-title' }, t('detail.triggers')),
                    h(
                      'ul',
                      { className: 'smk-triggers' },
                      triggers.map((trigger, index) => h('li', { key: index }, trigger)),
                    ),
                  )
                : null,
              h(
                'section',
                { className: 'smk-aside-card' },
                h('h3', { className: 'smk-aside-title' }, t('detail.installPath')),
                skillPath
                  ? h(
                      'div',
                      { className: 'smk-path-box' },
                      h('code', { className: 'smk-path' }, skillPath),
                      h(CopyButton, {
                        t,
                        value: skillPath,
                        className: 'smk-path-copy',
                        onCopied: props.onCopied,
                        onError: props.onCopyError,
                      }),
                    )
                  : null,
                h('p', { className: 'smk-aside-note' }, t('detail.installPathHint')),
              ),
              item.pageUrl
                ? h(
                    'a',
                    {
                      className: 'smk-aside-link',
                      href: item.pageUrl,
                      target: '_blank',
                      rel: 'noreferrer noopener',
                    },
                    h(Icon, { name: 'external', size: 13 }),
                    t('detail.sourcePage'),
                  )
                : null,
              capabilities.commands && capabilities.commands.length
                ? h(
                    'div',
                    { className: 'smk-aside-warning' },
                    h(Icon, { name: 'warning', size: 14 }),
                    h('span', null, t('detail.capabilitiesHint')),
                  )
                : null,
            ),
          ),
        ),
      )
    }

    // ── Installed ───────────────────────────────────────────────────────────
    function InstalledRow(props) {
      const t = props.t
      const item = props.item
      return h(
        'div',
        { className: 'smk-installed-row' },
        h(Avatar, { item, size: 38, radius: 11, small: true }),
        h(
          'div',
          { className: 'smk-installed-main' },
          h(
            'div',
            { className: 'smk-installed-title-row' },
            h('span', { className: 'smk-installed-name' }, item.name),
            item.version ? h('span', { className: 'smk-version' }, 'v' + item.version) : null,
            item.managed
              ? h('span', { className: 'smk-pill smk-pill-success' }, t('installed.managed'))
              : h('span', { className: 'smk-pill' }, t('installed.local')),
          ),
          h('p', { className: 'smk-installed-desc' }, item.description || '—'),
          h(
            'div',
            { className: 'smk-installed-meta' },
            item.managed ? sourceLabel(item.source, t) : t('installed.local'),
            h('span', { className: 'smk-dot-sep' }),
            h('span', null, `${item.fileCount || 0} ${t('installed.files')}`),
            h('span', { className: 'smk-dot-sep' }),
            h('span', null, formatBytes(item.size)),
            item.installedAt
              ? h(React.Fragment, null,
                  h('span', { className: 'smk-dot-sep' }),
                  h('span', null, `${t('installed.installedAt')} ${formatDate(item.installedAt, props.locale)}`),
                )
              : null,
          ),
          h('code', { className: 'smk-installed-path', title: item.path }, item.path),
        ),
        h(
          'div',
          { className: 'smk-installed-actions' },
          item.managed
            ? h(
                'button',
                {
                  type: 'button',
                  className: 'smk-button smk-button-ghost smk-button-sm',
                  onClick: () => props.onOpen(item),
                },
                h(Icon, { name: 'arrowRight', size: 13 }),
                t('installed.view'),
              )
            : null,
          item.managed
            ? h(
                'button',
                {
                  type: 'button',
                  className: 'smk-button smk-button-danger smk-button-sm',
                  onClick: () => props.onUninstall(item),
                },
                h(Icon, { name: 'trash', size: 13 }),
                t('installed.remove'),
              )
            : null,
        ),
      )
    }

    function InstalledPage(props) {
      const t = props.t
      const state = props.state
      const meta = props.meta
      const items = state.items || []
      const managed = items.filter((item) => item.managed)
      const local = items.filter((item) => !item.managed)
      return h(
        'div',
        { className: 'smk-page' },
        h(
          'div',
          { className: 'smk-shell' },
          h(
            'div',
            { className: 'smk-backbar' },
            h(
              'button',
              { type: 'button', className: 'smk-back', onClick: props.onBack },
              h(Icon, { name: 'arrowLeft', size: 15 }),
              t('installed.back'),
            ),
            h(
              'button',
              { type: 'button', className: 'smk-button smk-button-primary', onClick: props.onBrowse },
              h(Icon, { name: 'store', size: 14 }),
              t('installed.browse'),
            ),
          ),
          h(
            'header',
            { className: 'smk-installed-hero' },
            h(
              'div',
              null,
              h(
                'div',
                { className: 'smk-eyebrow' },
                h(Icon, { name: 'package', size: 12 }),
                h('span', null, t('page.eyebrow')),
              ),
              h('h1', { className: 'smk-title' }, t('installed.title')),
              h('p', { className: 'smk-subtitle' }, t('installed.subtitle')),
            ),
            h(
              'div',
              { className: 'smk-installed-count' },
              h('span', { className: 'smk-installed-count-value' }, String(items.length)),
              h('span', { className: 'smk-installed-count-label' }, t('installed.count', { n: items.length })),
            ),
          ),
          meta && meta.skillsDir
            ? h(
                'div',
                { className: 'smk-dir-card' },
                h('span', { className: 'smk-dir-icon' }, h(Icon, { name: 'folder', size: 17 })),
                h(
                  'div',
                  { className: 'smk-dir-copy' },
                  h('span', { className: 'smk-dir-label' }, t('installed.skillsDir')),
                  h('code', { className: 'smk-dir-path' }, meta.skillsDir),
                ),
                h(CopyButton, {
                  t,
                  value: meta.skillsDir,
                  onCopied: props.onCopied,
                  onError: props.onCopyError,
                }),
              )
            : null,
          state.error
            ? h(ErrorState, { t, message: state.error, onRetry: props.onRetry })
            : state.loading && items.length === 0
              ? h(
                  'div',
                  { className: 'smk-installed-list' },
                  [0, 1, 2].map((index) =>
                    h(
                      'div',
                      { key: index, className: 'smk-installed-row is-skeleton' },
                      h('span', { className: 'smk-skel smk-skel-avatar', style: { width: 38, height: 38 } }),
                      h(
                        'div',
                        { className: 'smk-skel-col', style: { flex: 1 } },
                        h('span', { className: 'smk-skel smk-skel-line', style: { width: '38%' } }),
                        h('span', { className: 'smk-skel smk-skel-line', style: { width: '68%' } }),
                      ),
                    ),
                  ),
                )
              : items.length === 0
                ? h(EmptyState, {
                    icon: 'package',
                    title: t('installed.empty'),
                    body: t('installed.emptyBody'),
                    action: h(
                      'button',
                      { type: 'button', className: 'smk-button smk-button-primary', onClick: props.onBrowse },
                      h(Icon, { name: 'store', size: 14 }),
                      t('installed.browse'),
                    ),
                  })
                : h(
                    React.Fragment,
                    null,
                    managed.length
                      ? h(
                          'section',
                          { className: 'smk-installed-group' },
                          h(
                            'div',
                            { className: 'smk-installed-group-head' },
                            h('h2', { className: 'smk-installed-group-title' }, t('installed.managed')),
                            h('span', { className: 'smk-installed-group-hint' }, t('installed.managedHint')),
                          ),
                          h(
                            'div',
                            { className: 'smk-installed-list' },
                            managed.map((item) =>
                              h(InstalledRow, {
                                key: item.id,
                                item,
                                t,
                                locale: props.locale,
                                onOpen: props.onOpen,
                                onUninstall: props.onUninstall,
                              }),
                            ),
                          ),
                        )
                      : null,
                    local.length
                      ? h(
                          'section',
                          { className: 'smk-installed-group' },
                          h(
                            'div',
                            { className: 'smk-installed-group-head' },
                            h('h2', { className: 'smk-installed-group-title' }, t('installed.local')),
                            h('span', { className: 'smk-installed-group-hint' }, t('installed.localHint')),
                          ),
                          h(
                            'div',
                            { className: 'smk-installed-list' },
                            local.map((item) =>
                              h(InstalledRow, {
                                key: item.id,
                                item,
                                t,
                                locale: props.locale,
                                onOpen: props.onOpen,
                                onUninstall: props.onUninstall,
                              }),
                            ),
                          ),
                        )
                      : null,
                  ),
        ),
      )
    }

    // ── Dialogs & toast ────────────────────────────────────────────────────
    function InstallDialog(props) {
      const t = props.t
      const dialog = props.dialog
      const item = dialog.item
      const meta = props.meta
      const busy = props.busy
      const needsAck = item.securityStatus === 'unknown' || item.securityStatus === 'flagged'
      const flagged = item.securityStatus === 'flagged'
      const capabilities = item.capabilities || {}
      const caps = [
        { key: 'commands', label: t('detail.commands'), items: capabilities.commands },
        { key: 'network', label: t('detail.network'), items: capabilities.network },
        { key: 'secrets', label: t('detail.secrets'), items: capabilities.secrets },
        { key: 'hooks', label: t('detail.hooks'), items: capabilities.hooks },
        { key: 'scripts', label: t('detail.scripts'), items: capabilities.scripts },
      ].filter((group) => Array.isArray(group.items) && group.items.length > 0)
      const installPath = meta && meta.skillsDir ? joinPath(meta.skillsDir, item.slug) : item.slug
      const canConfirm = !busy && (!needsAck || dialog.ack)
      React.useEffect(() => {
        const onKey = (event) => {
          if (event.key === 'Escape' && !busy) props.onClose()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
      }, [busy, props.onClose])
      return h(
        'div',
        {
          className: 'smk-overlay',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget && !busy) props.onClose()
          },
        },
        h(
          'div',
          { className: 'smk-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'smk-install-title' },
          h(
            'div',
            { className: 'smk-dialog-head' },
            h(Avatar, { item, size: 38, radius: 10, small: true }),
            h(
              'div',
              { className: 'smk-dialog-heading' },
              h('h2', { className: 'smk-dialog-title', id: 'smk-install-title' }, t('detail.installDialog.title')),
              h(
                'div',
                { className: 'smk-dialog-sub' },
                item.name,
                h('span', { className: 'smk-dot-sep' }),
                sourceLabel(item.source, t),
              ),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'smk-icon-button smk-dialog-close',
                onClick: props.onClose,
                disabled: busy,
                'aria-label': t('common.close'),
              },
              h(Icon, { name: 'x', size: 15 }),
            ),
          ),
          h(
            'div',
            { className: 'smk-dialog-body' },
            h(
              'div',
              { className: 'smk-field' },
              h('span', { className: 'smk-field-label' }, t('detail.installDialog.location')),
              h(
                'div',
                { className: 'smk-path-box' },
                h(Icon, { name: 'folder', size: 14 }),
                h('code', { className: 'smk-path' }, installPath),
              ),
            ),
            caps.length
              ? h(
                  'div',
                  { className: 'smk-field' },
                  h('span', { className: 'smk-field-label' }, t('detail.capabilities')),
                  h(
                    'div',
                    { className: 'smk-dialog-caps' },
                    caps.map((group) =>
                      h(
                        'div',
                        { key: group.key, className: 'smk-dialog-cap' },
                        h('span', null, group.label),
                        h('span', { className: 'smk-dialog-cap-count' }, String(group.items.length)),
                      ),
                    ),
                  ),
                )
              : null,
            flagged
              ? h(
                  'div',
                  { className: 'smk-alert smk-alert-danger' },
                  h(Icon, { name: 'shieldAlert', size: 16 }),
                  h('span', null, t('detail.installDialog.flagged')),
                )
              : needsAck
                ? h(
                    'div',
                    { className: 'smk-alert smk-alert-warn' },
                    h(Icon, { name: 'warning', size: 16 }),
                    h('span', null, t('detail.installDialog.warning')),
                  )
                : null,
            h('p', { className: 'smk-dialog-note' }, t('detail.installDialog.effect')),
            needsAck
              ? h(
                  'label',
                  { className: 'smk-check' },
                  h('input', {
                    type: 'checkbox',
                    checked: Boolean(dialog.ack),
                    onChange: (event) => props.onAck(event.target.checked),
                  }),
                  h('span', { className: 'smk-check-box' }, h(Icon, { name: 'check', size: 12 })),
                  h('span', { className: 'smk-check-label' }, t('detail.installDialog.ack')),
                )
              : null,
            dialog.error
              ? h(
                  'div',
                  { className: 'smk-alert smk-alert-danger' },
                  h(Icon, { name: 'warning', size: 16 }),
                  h('span', null, dialog.error),
                )
              : null,
          ),
          h(
            'div',
            { className: 'smk-dialog-foot' },
            h(
              'button',
              { type: 'button', className: 'smk-button smk-button-ghost', onClick: props.onClose, disabled: busy },
              t('detail.installDialog.cancel'),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'smk-button smk-button-primary',
                onClick: props.onConfirm,
                disabled: !canConfirm,
              },
              busy ? h(Spinner) : h(Icon, { name: 'download', size: 14 }),
              busy ? t('detail.installDialog.installing') : t('detail.installDialog.confirm'),
            ),
          ),
        ),
      )
    }

    function UninstallDialog(props) {
      const t = props.t
      const dialog = props.dialog
      const item = dialog.item
      const busy = props.busy
      const meta = props.meta
      const removePath =
        item.path || (meta && meta.skillsDir ? joinPath(meta.skillsDir, item.slug || item.name) : item.name)
      React.useEffect(() => {
        const onKey = (event) => {
          if (event.key === 'Escape' && !busy) props.onClose()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
      }, [busy, props.onClose])
      return h(
        'div',
        {
          className: 'smk-overlay',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget && !busy) props.onClose()
          },
        },
        h(
          'div',
          { className: 'smk-dialog smk-dialog-sm', role: 'dialog', 'aria-modal': 'true' },
          h(
            'div',
            { className: 'smk-dialog-head' },
            h('span', { className: 'smk-dialog-warn' }, h(Icon, { name: 'trash', size: 17 })),
            h(
              'div',
              { className: 'smk-dialog-heading' },
              h('h2', { className: 'smk-dialog-title' }, t('detail.uninstallDialog.title')),
              h('div', { className: 'smk-dialog-sub' }, item.name),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'smk-icon-button smk-dialog-close',
                onClick: props.onClose,
                disabled: busy,
                'aria-label': t('common.close'),
              },
              h(Icon, { name: 'x', size: 15 }),
            ),
          ),
          h(
            'div',
            { className: 'smk-dialog-body' },
            h(
              'p',
              { className: 'smk-dialog-note' },
              t('detail.uninstallDialog.body', { path: removePath }),
            ),
            dialog.error
              ? h(
                  'div',
                  { className: 'smk-alert smk-alert-danger' },
                  h(Icon, { name: 'warning', size: 16 }),
                  h('span', null, dialog.error),
                )
              : null,
          ),
          h(
            'div',
            { className: 'smk-dialog-foot' },
            h(
              'button',
              { type: 'button', className: 'smk-button smk-button-ghost', onClick: props.onClose, disabled: busy },
              t('detail.uninstallDialog.cancel'),
            ),
            h(
              'button',
              { type: 'button', className: 'smk-button smk-button-danger', onClick: props.onConfirm, disabled: busy },
              busy ? h(Spinner) : h(Icon, { name: 'trash', size: 14 }),
              busy ? t('detail.uninstallDialog.removing') : t('detail.uninstallDialog.confirm'),
            ),
          ),
        ),
      )
    }

    function Toast(props) {
      const toast = props.toast
      if (!toast) return null
      return h(
        'div',
        { className: cx('smk-toast', toast.tone === 'error' && 'is-error'), role: 'status', 'aria-live': 'polite' },
        h(Icon, { name: toast.tone === 'error' ? 'warning' : 'check', size: 15 }),
        h('span', null, toast.text),
      )
    }

    // ── Page ────────────────────────────────────────────────────────────────
    const EMPTY_FILTERS = {
      q: '',
      category: 'all',
      source: 'all',
      security: 'all',
      installed: 'all',
    }

    function filterLive(items, filters) {
      return (items || []).filter((item) => {
        if (filters.category !== 'all' && item.category !== filters.category) return false
        if (filters.source !== 'all' && item.source !== filters.source) return false
        if (filters.security !== 'all' && item.securityStatus !== filters.security) return false
        if (filters.installed === 'installed' && item.installState !== 'installed') return false
        if (filters.installed === 'installable' && item.installState !== 'installable') return false
        return true
      })
    }

    function MarketPage(props) {
      const t = RUNTIME ? RUNTIME.locale.bind(NS) : (key) => key
      const locale = RUNTIME && RUNTIME.locale.getSnapshot ? RUNTIME.locale.getSnapshot().active : 'zh'
      const [, forceTick] = React.useReducer((value) => value + 1, 0)
      React.useEffect(() => {
        if (!RUNTIME) return undefined
        return RUNTIME.locale.subscribe(() => forceTick())
      }, [])

      const [meta, setMeta] = React.useState(null)
      const [catalog, setCatalog] = React.useState({
        items: [],
        total: 0,
        categories: [],
        generatedAt: 0,
        installedCount: 0,
        loading: true,
        error: null,
      })
      const [scope, setScope] = React.useState('catalog')
      const [filters, setFilters] = React.useState(EMPTY_FILTERS)
      const [live, setLive] = React.useState({
        query: '',
        items: [],
        sources: {},
        loading: false,
        error: null,
      })
      const [view, setView] = React.useState('home')
      const [detail, setDetail] = React.useState(null)
      const [detailNonce, setDetailNonce] = React.useState(0)
      const [installed, setInstalled] = React.useState({ items: [], loading: false, error: null })
      const [dialog, setDialog] = React.useState(null)
      const [busy, setBusy] = React.useState(false)
      const [toast, setToast] = React.useState(null)
      const scrollRef = React.useRef(null)
      const catalogRequest = React.useRef(0)
      const liveRequest = React.useRef(0)

      const debouncedQuery = useDebounced(filters.q, debounceDelay(filters.q))

      const showToast = React.useCallback((text, tone) => {
        setToast({ id: Date.now(), text, tone: tone || 'default' })
      }, [])

      React.useEffect(() => {
        if (!toast) return undefined
        const timer = window.setTimeout(() => setToast(null), 3400)
        return () => window.clearTimeout(timer)
      }, [toast])

      React.useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0
      }, [view, detail ? detail.id : null])

      const loadMeta = React.useCallback(() => {
        apiRequest('/api/skill-market/meta')
          .then((data) => setMeta(data))
          .catch(() => {})
      }, [])

      const loadCatalog = React.useCallback(async (queryOverride) => {
        const requestId = ++catalogRequest.current
        const query = typeof queryOverride === 'string' ? queryOverride : debouncedQuery
        setCatalog((previous) => ({ ...previous, loading: true, error: null }))
        try {
          const params = new URLSearchParams({
            scope: 'catalog',
            q: query || '',
            category: filters.category,
            source: filters.source,
            security: filters.security,
            installed: filters.installed,
          })
          const data = await apiRequest(`/api/skill-market/catalog?${params.toString()}`)
          if (requestId !== catalogRequest.current) return
          setCatalog({
            items: Array.isArray(data.items) ? data.items : [],
            total: Number(data.total) || 0,
            categories: Array.isArray(data.categories) ? data.categories : [],
            generatedAt: Number(data.catalogGeneratedAt) || 0,
            installedCount: Number(data.installedCount) || 0,
            loading: false,
            error: null,
          })
        } catch (error) {
          if (requestId !== catalogRequest.current) return
          setCatalog((previous) => ({
            ...previous,
            loading: false,
            error: describeError(error, t('error.catalog')),
          }))
        }
      }, [debouncedQuery, filters.category, filters.source, filters.security, filters.installed, t])

      const runLive = React.useCallback(
        async (query) => {
          const q = String(query || '').trim()
          if (!q) {
            liveRequest.current += 1
            setLive({ query: '', items: [], sources: {}, loading: false, error: null })
            return
          }
          const requestId = ++liveRequest.current
          setLive((previous) => ({ ...previous, query: q, loading: true, error: null }))
          try {
            const data = await apiRequest(
              `/api/skill-market/catalog?scope=live&q=${encodeURIComponent(q)}`,
            )
            if (requestId !== liveRequest.current) return
            setLive({
              query: q,
              items: Array.isArray(data.items) ? data.items : [],
              sources: data.sources && typeof data.sources === 'object' ? data.sources : {},
              loading: false,
              error: null,
            })
          } catch (error) {
            if (requestId !== liveRequest.current) return
            setLive((previous) => ({
              ...previous,
              loading: false,
              error: describeError(error, t('error.catalog')),
            }))
          }
        },
        [t],
      )

      const loadInstalled = React.useCallback(async () => {
        setInstalled((previous) => ({ ...previous, loading: true, error: null }))
        try {
          const data = await apiRequest('/api/skill-market/installed')
          setInstalled({
            items: Array.isArray(data.items) ? data.items : [],
            loading: false,
            error: null,
          })
        } catch (error) {
          setInstalled({
            items: [],
            loading: false,
            error: describeError(error, t('error.installed')),
          })
        }
      }, [t])

      React.useEffect(() => {
        loadMeta()
      }, [loadMeta])

      React.useEffect(() => {
        if (scope === 'catalog') loadCatalog()
      }, [scope, loadCatalog])

      React.useEffect(() => {
        if (view !== 'detail' || !detail) return undefined
        let alive = true
        const id = detail.id
        const owner = detail.owner || ''
        setDetail((previous) =>
          previous && previous.id === id ? { ...previous, loading: true, error: null } : previous,
        )
        apiRequest(
          `/api/skill-market/detail?id=${encodeURIComponent(id)}&owner=${encodeURIComponent(owner)}`,
        )
          .then((data) => {
            if (!alive) return
            setDetail((previous) =>
              previous && previous.id === id
                ? { ...previous, loading: false, item: data.item, error: null }
                : previous,
            )
          })
          .catch((error) => {
            if (!alive) return
            setDetail((previous) =>
              previous && previous.id === id
                ? { ...previous, loading: false, error: describeError(error, t('error.detail')) }
                : previous,
            )
          })
        return () => {
          alive = false
        }
      }, [view, detail ? detail.id : null, detail ? detail.owner : null, detailNonce, t])

      const setFilter = (key, value) => {
        setFilters((previous) => ({ ...previous, [key]: value }))
      }

      const changeScope = (next) => {
        setScope(next)
        if (next === 'live' && filters.q.trim()) runLive(filters.q)
      }

      const clearFilters = () => {
        setFilters(EMPTY_FILTERS)
        if (scope === 'live') {
          setLive({ query: '', items: [], sources: {}, loading: false, error: null })
        }
      }

      const refresh = () => {
        loadMeta()
        if (scope === 'catalog') {
          loadCatalog()
          showToast(t('toast.refreshed'))
        } else if (live.query) {
          runLive(live.query)
        }
      }

      const search = () => {
        if (scope === 'live') runLive(filters.q)
        else loadCatalog(filters.q)
      }

      const openInstalled = () => {
        setView('installed')
        loadInstalled()
      }

      const openDetail = (item) => {
        setDetail({
          id: item.id,
          owner: ownerOf(item),
          loading: true,
          item: null,
          error: null,
          tab: 'overview',
          filePath: null,
          file: null,
          fileLoading: false,
          fileError: null,
        })
        setView('detail')
      }

      const loadFile = (path) => {
        const current = detail
        if (!current) return
        const id = current.id
        const owner = current.owner || ''
        setDetail((previous) =>
          previous && previous.id === id
            ? { ...previous, filePath: path, fileLoading: true, fileError: null, file: null }
            : previous,
        )
        apiRequest(
          `/api/skill-market/file?id=${encodeURIComponent(id)}&path=${encodeURIComponent(path)}&owner=${encodeURIComponent(owner)}`,
        )
          .then((data) => {
            setDetail((previous) =>
              previous && previous.id === id
                ? { ...previous, fileLoading: false, file: data, fileError: null }
                : previous,
            )
          })
          .catch((error) => {
            setDetail((previous) =>
              previous && previous.id === id
                ? {
                    ...previous,
                    fileLoading: false,
                    fileError: describeError(error, t('detail.fileError')),
                  }
                : previous,
            )
          })
      }

      const changeTab = (tab) => {
        const current = detail
        setDetail((previous) => (previous ? { ...previous, tab } : previous))
        if (tab === 'files' && current && current.item && !current.filePath) {
          const files = current.item.files || []
          const first = files.find((file) => file.path === 'SKILL.md') || files[0]
          if (first) loadFile(first.path)
        }
      }

      const openInstall = (item) => {
        setDialog({ kind: 'install', item, ack: false, error: null })
      }

      const openUninstall = (item) => {
        setDialog({ kind: 'uninstall', item, error: null })
      }

      const confirmInstall = async () => {
        if (!dialog || dialog.kind !== 'install') return
        const item = dialog.item
        setBusy(true)
        setDialog((previous) => (previous ? { ...previous, error: null } : previous))
        try {
          const data = await apiRequest('/api/skill-market/install', {
            method: 'POST',
            body: { id: item.id, owner: ownerOf(item) },
          })
          setDialog(null)
          showToast(t('toast.installed', { name: item.name }))
          setDetail((previous) =>
            previous && previous.id === item.id ? { ...previous, item: data.item } : previous,
          )
          setMeta((previous) =>
            previous ? { ...previous, installedCount: Math.max(0, (previous.installedCount || 0) + 1) } : previous,
          )
          loadCatalog()
          if (view === 'installed') loadInstalled()
        } catch (error) {
          setDialog((previous) =>
            previous
              ? { ...previous, error: describeError(error, t('detail.installDialog.failed')) }
              : previous,
          )
        } finally {
          setBusy(false)
        }
      }

      const confirmUninstall = async () => {
        if (!dialog || dialog.kind !== 'uninstall') return
        const item = dialog.item
        setBusy(true)
        setDialog((previous) => (previous ? { ...previous, error: null } : previous))
        try {
          await apiRequest('/api/skill-market/uninstall', {
            method: 'POST',
            body: { id: item.id },
          })
          setDialog(null)
          showToast(t('toast.uninstalled', { name: item.name }))
          setDetail((previous) =>
            previous && previous.id === item.id
              ? { ...previous, item: { ...previous.item, installState: 'installable', installedInfo: null } }
              : previous,
          )
          setMeta((previous) =>
            previous ? { ...previous, installedCount: Math.max(0, (previous.installedCount || 0) - 1) } : previous,
          )
          loadCatalog()
          if (view === 'installed') loadInstalled()
        } catch (error) {
          setDialog((previous) =>
            previous
              ? { ...previous, error: describeError(error, t('detail.uninstallDialog.failed')) }
              : previous,
          )
        } finally {
          setBusy(false)
        }
      }

      const categories = catalog.categories.length
        ? catalog.categories
        : meta && Array.isArray(meta.categories)
          ? meta.categories
          : []
      const liveItems = scope === 'live' ? filterLive(live.items, filters) : []
      const items = scope === 'live' ? liveItems : catalog.items
      const isLoading = scope === 'live' ? live.loading : catalog.loading
      const errorMessage = scope === 'live' ? live.error : catalog.error
      const total = items.length
      const homeFilters = {
        q: filters.q,
        category: filters.category,
        source: filters.source,
        security: filters.security,
        installed: filters.installed,
      }

      const content =
        view === 'installed'
          ? h(InstalledPage, {
              t,
              locale,
              meta,
              state: installed,
              onBack: () => setView('home'),
              onBrowse: () => setView('home'),
              onRetry: loadInstalled,
              onOpen: openDetail,
              onUninstall: openUninstall,
              onCopied: () => showToast(t('toast.copied')),
              onCopyError: () => showToast(t('toast.copyFailed'), 'error'),
            })
          : view === 'detail' && detail
            ? h(DetailPage, {
                t,
                locale,
                detail,
                meta,
                categories,
                onBack: () => {
                  setView('home')
                  loadCatalog()
                },
                onRetry: () => setDetailNonce((value) => value + 1),
                onInstall: openInstall,
                onUninstall: openUninstall,
                onTab: changeTab,
                onFile: loadFile,
                onCopied: () => showToast(t('toast.copied')),
                onCopyError: () => showToast(t('toast.copyFailed'), 'error'),
              })
            : h(HomePage, {
                t,
                locale,
                meta,
                catalog,
                live,
                categories,
                scope,
                filters: homeFilters,
                items,
                data: { total },
                loading: isLoading,
                error: errorMessage,
                onScope: changeScope,
                setFilter,
                onClearFilters: clearFilters,
                onSearch: search,
                onRefresh: refresh,
                onRetry: () => (scope === 'live' ? runLive(live.query) : loadCatalog()),
                onOpenInstalled: openInstalled,
                onOpen: openDetail,
                onInstall: openInstall,
              })

      return h(
        'div',
        { className: 'smk-root' },
        h('div', { className: 'smk-scroll', ref: scrollRef }, content),
        dialog && dialog.kind === 'install'
          ? h(InstallDialog, {
              t,
              dialog,
              meta,
              busy,
              onClose: () => {
                if (!busy) setDialog(null)
              },
              onAck: (ack) => setDialog((previous) => (previous ? { ...previous, ack } : previous)),
              onConfirm: confirmInstall,
            })
          : null,
        dialog && dialog.kind === 'uninstall'
          ? h(UninstallDialog, {
              t,
              dialog,
              meta,
              busy,
              onClose: () => {
                if (!busy) setDialog(null)
              },
              onConfirm: confirmUninstall,
            })
          : null,
        h(Toast, { toast }),
      )
    }

    // ── Plugin ──────────────────────────────────────────────────────────────
    function SidebarAnchor(props) {
      return h(
        'span',
        { className: 'smk-nav', 'data-active': props.active ? 'true' : 'false' },
        h(Icon, { name: 'store', size: props.size || 18 }),
      )
    }

    function apply(ctx) {
      RUNTIME = ctx
      const t = ctx.locale.bind(NS)
      const disposeLocale = ctx.locale.register(NS, { zh, en })
      ctx.effect(() => disposeLocale, 'skill-market: dictionaries')

      const existing = document.querySelector('style[data-dsh-skill-market]')
      if (existing) existing.remove()
      const style = document.createElement('style')
      style.setAttribute('data-dsh-skill-market', 'true')
      style.textContent = CSS
      document.head.appendChild(style)
      ctx.effect(
        () => () => {
          style.remove()
        },
        'skill-market: styles',
      )

      ctx.slots.inject('sidebar.panellist', () =>
        ctx.slots.register(
          {
            name: 'sidebar.panellist',
            id: 'skill-market',
            order: 6,
            label: () => t('nav.label'),
            locale: NS,
          },
          SidebarAnchor,
        ),
      )

      ctx.slots.inject('main', () =>
        ctx.slots.register(
          {
            name: 'main',
            key: 'skill-market',
            locale: NS,
          },
          MarketPage,
        ),
      )
    }

    const inject = ['slots', 'locale']

    const CSS = `
.smk-root {
  --smk-surface: var(--dsw-alias-bg-layer-1);
  --smk-surface-2: var(--dsw-alias-bg-layer-2);
  --smk-border: var(--dsw-alias-border-l1);
  --smk-border-strong: var(--dsw-alias-border-l2);
  --smk-text: var(--dsw-alias-label-primary);
  --smk-muted: var(--dsw-alias-label-secondary);
  --smk-accent: var(--dsw-alias-brand-primary);
  --smk-success: var(--dsw-alias-state-success-primary);
  --smk-warn: var(--dsw-alias-state-warn-primary);
  --smk-danger: var(--dsw-alias-state-error-primary);
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  color: var(--smk-text);
  background: var(--dsw-alias-bg-base);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.55;
  text-align: left;
}
.smk-root *, .smk-root *::before, .smk-root *::after { box-sizing: border-box; }
.smk-root button, .smk-root input { font-family: inherit; }
.smk-root button:focus-visible, .smk-root a:focus-visible, .smk-root input:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--smk-accent) 62%, transparent);
  outline-offset: 2px;
}
.smk-scroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden; scrollbar-gutter: stable; }
.smk-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
.smk-scroll::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--smk-muted) 22%, transparent);
  border: 3px solid transparent;
  border-radius: 10px;
  background-clip: content-box;
}
.smk-scroll::-webkit-scrollbar-thumb:hover { background-color: color-mix(in srgb, var(--smk-muted) 38%, transparent); }
.smk-scroll::-webkit-scrollbar-track { background: transparent; }
.smk-shell { width: 100%; max-width: 1180px; margin: 0 auto; padding: 26px 32px 64px; }

/* Hero */
.smk-hero {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 26px;
  padding: 26px 28px 24px;
  overflow: hidden;
  border: 1px solid var(--smk-border);
  border-radius: 20px;
  background:
    radial-gradient(120% 170% at 100% 0%, color-mix(in srgb, var(--smk-accent) 13%, transparent) 0%, transparent 56%),
    linear-gradient(158deg, color-mix(in srgb, var(--smk-surface-2) 62%, var(--smk-surface)) 0%, var(--smk-surface) 64%);
}
.smk-hero-orb {
  position: absolute;
  top: -120px;
  right: -70px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, color-mix(in srgb, var(--smk-accent) 20%, transparent) 0%, transparent 68%);
  filter: blur(4px);
}
.smk-hero-main { position: relative; min-width: 0; flex: 1 1 auto; }
.smk-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--smk-accent);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}
.smk-eyebrow-sep { width: 1px; height: 10px; background: color-mix(in srgb, var(--smk-accent) 32%, transparent); }
.smk-eyebrow-live {
  color: var(--smk-muted);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: none;
}
.smk-title { margin: 9px 0 0; font-size: 30px; line-height: 1.15; font-weight: 650; letter-spacing: -0.03em; }
.smk-subtitle { max-width: 660px; margin: 9px 0 0; color: var(--smk-muted); font-size: 13px; line-height: 1.65; }
.smk-metrics { display: flex; align-items: center; gap: 17px; margin-top: 20px; flex-wrap: wrap; }
.smk-metric { display: flex; flex-direction: column; gap: 1px; }
.smk-metric-value { font-size: 19px; font-weight: 620; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; line-height: 1.2; }
.smk-metric-label { color: var(--smk-muted); font-size: 10.5px; letter-spacing: 0.02em; }
.smk-metric-sep { width: 1px; height: 26px; background: var(--smk-border); }
.smk-updated {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  color: var(--smk-muted);
  font-size: 10.5px;
}
.smk-hero-side { position: relative; display: flex; flex-direction: column; align-items: stretch; gap: 8px; min-width: 150px; }

/* Buttons */
.smk-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 34px;
  padding: 0 13px;
  border: 1px solid var(--smk-border);
  border-radius: 9px;
  background: var(--smk-surface);
  color: var(--smk-text);
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}
.smk-button:hover:not(:disabled) { background: var(--smk-surface-2); border-color: var(--smk-border-strong); }
.smk-button:disabled { opacity: 0.5; cursor: not-allowed; }
.smk-button-sm { height: 29px; padding: 0 10px; font-size: 11.5px; border-radius: 7px; }
.smk-button-lg { height: 38px; padding: 0 15px; border-radius: 10px; font-size: 13px; }
.smk-button-primary { border-color: var(--smk-text); background: var(--smk-text); color: var(--dsw-alias-bg-base); }
.smk-button-primary:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--smk-text) 86%, var(--smk-accent));
  background: color-mix(in srgb, var(--smk-text) 86%, var(--smk-accent));
}
.smk-button-ghost { border-color: transparent; background: transparent; color: var(--smk-muted); }
.smk-button-ghost:hover:not(:disabled) { color: var(--smk-text); background: var(--smk-surface-2); border-color: transparent; }
.smk-button-danger {
  border-color: color-mix(in srgb, var(--smk-danger) 28%, var(--smk-border));
  background: color-mix(in srgb, var(--smk-danger) 8%, var(--smk-surface));
  color: var(--smk-danger);
}
.smk-button-danger:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--smk-danger) 48%, var(--smk-border));
  background: color-mix(in srgb, var(--smk-danger) 13%, var(--smk-surface));
}
.smk-button-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 20%, transparent);
  color: inherit;
  font-size: 10.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.smk-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--smk-muted);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.smk-icon-button:hover:not(:disabled) { background: var(--smk-surface-2); color: var(--smk-text); }
.smk-icon-button:disabled { opacity: 0.45; cursor: not-allowed; }

/* Notice */
.smk-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 13px;
  padding: 10px 14px;
  border: 1px solid color-mix(in srgb, var(--smk-warn) 26%, var(--smk-border));
  border-radius: 11px;
  background: color-mix(in srgb, var(--smk-warn) 6%, var(--smk-surface));
  color: var(--smk-muted);
  font-size: 11.5px;
  line-height: 1.6;
}
.smk-notice-icon { display: inline-flex; margin-top: 1px; color: var(--smk-warn); flex: 0 0 auto; }
.smk-notice-copy strong { margin-right: 6px; color: var(--smk-text); font-weight: 600; }

/* Toolbar */
.smk-toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 17px; }
.smk-search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 320px;
  min-width: 210px;
  height: 38px;
  padding: 0 9px 0 34px;
  border: 1px solid var(--smk-border);
  border-radius: 10px;
  background: var(--smk-surface);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.smk-search:focus-within {
  border-color: color-mix(in srgb, var(--smk-accent) 52%, var(--smk-border));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--smk-accent) 11%, transparent);
}
.smk-search-icon { position: absolute; left: 11px; color: var(--smk-muted); pointer-events: none; }
.smk-search-input {
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--smk-text);
  font-size: 12.5px;
}
.smk-search-input::placeholder { color: var(--smk-muted); opacity: 0.85; }
.smk-search-input::-webkit-search-cancel-button { display: none; }
.smk-search-clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 21px;
  height: 21px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--smk-surface-2);
  color: var(--smk-muted);
  cursor: pointer;
  flex: 0 0 auto;
}
.smk-search-clear:hover { color: var(--smk-text); }

/* Select */
.smk-select { position: relative; flex: 0 0 auto; }
.smk-select-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 9px;
  border: 1px solid var(--smk-border);
  border-radius: 10px;
  background: var(--smk-surface);
  color: var(--smk-muted);
  font-size: 12px;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}
.smk-select-button:hover { color: var(--smk-text); border-color: var(--smk-border-strong); }
.smk-select.is-active .smk-select-button {
  color: var(--smk-text);
  border-color: color-mix(in srgb, var(--smk-accent) 34%, var(--smk-border));
  background: color-mix(in srgb, var(--smk-accent) 5%, var(--smk-surface));
}
.smk-select-label { max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.smk-chevron { transition: transform 0.16s ease; opacity: 0.75; }
.smk-chevron.is-open { transform: rotate(180deg); }
.smk-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 24;
  min-width: 186px;
  max-height: 310px;
  overflow-y: auto;
  padding: 5px;
  border: 1px solid var(--smk-border-strong);
  border-radius: 11px;
  background: var(--dsw-alias-bg-overlay);
  box-shadow: 0 18px 44px color-mix(in srgb, #000 18%, transparent);
}
.smk-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 31px;
  padding: 0 8px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--smk-text);
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}
.smk-menu-item:hover { background: var(--smk-surface-2); }
.smk-menu-item.is-selected { color: var(--smk-accent); }
.smk-menu-item > span:first-child { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.smk-menu-count { color: var(--smk-muted); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.smk-menu-item.is-selected .smk-menu-count { color: inherit; opacity: 0.8; }

/* Segment */
.smk-segment {
  display: inline-flex;
  flex: 0 0 auto;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--smk-border);
  border-radius: 10px;
  background: var(--smk-surface);
}
.smk-segment-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--smk-muted);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.smk-segment-item:hover { color: var(--smk-text); }
.smk-segment-item.is-active { background: var(--smk-surface-2); color: var(--smk-text); box-shadow: 0 1px 2px color-mix(in srgb, #000 8%, transparent); }
.smk-segment-badge { font-size: 10px; opacity: 0.7; }

/* Scope bar */
.smk-scopebar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 14px; min-height: 20px; }
.smk-scope-note { display: flex; align-items: baseline; gap: 8px; min-width: 0; }
.smk-scope-label { color: var(--smk-accent); font-size: 10.5px; font-weight: 600; letter-spacing: 0.09em; text-transform: uppercase; white-space: nowrap; }
.smk-scope-text { color: var(--smk-muted); font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.smk-sources { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.smk-sources-label { color: var(--smk-muted); font-size: 10.5px; }
.smk-source {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 22px;
  padding: 0 8px;
  border: 1px solid var(--smk-border);
  border-radius: 999px;
  background: var(--smk-surface);
  color: var(--smk-muted);
  font-size: 10.5px;
}
.smk-source.is-failed { color: var(--smk-danger); border-color: color-mix(in srgb, var(--smk-danger) 32%, var(--smk-border)); }
.smk-source-state { opacity: 0.75; }
.smk-source-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--smk-muted); flex: 0 0 auto; }
.smk-source-dot[data-source="clawhub"] { background: #d97706; }
.smk-source-dot[data-source="skillhub"] { background: #0ea5e9; }
.smk-source-dot[data-source="local"] { background: var(--smk-muted); }

/* Category chips */
.smk-categories { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 16px; }
.smk-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 11px;
  border: 1px solid var(--smk-border);
  border-radius: 999px;
  background: var(--smk-surface);
  color: var(--smk-muted);
  font-size: 11.5px;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.smk-chip:hover { color: var(--smk-text); border-color: var(--smk-border-strong); }
.smk-chip.is-active { border-color: var(--smk-text); background: var(--smk-text); color: var(--dsw-alias-bg-base); }
.smk-chip-count { font-size: 10px; opacity: 0.65; font-variant-numeric: tabular-nums; }

/* Active filters */
.smk-active { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 12px; }
.smk-active-label { color: var(--smk-muted); font-size: 10.5px; }
.smk-active-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 23px;
  padding: 0 8px;
  border: 1px solid color-mix(in srgb, var(--smk-accent) 24%, var(--smk-border));
  border-radius: 6px;
  background: color-mix(in srgb, var(--smk-accent) 7%, var(--smk-surface));
  color: var(--smk-text);
  font-size: 10.5px;
  cursor: pointer;
}
.smk-active-chip:hover { border-color: color-mix(in srgb, var(--smk-accent) 46%, var(--smk-border)); }
.smk-active-clear { margin-left: 2px; padding: 0; border: 0; background: transparent; color: var(--smk-muted); font-size: 10.5px; text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
.smk-active-clear:hover { color: var(--smk-text); }

/* Results */
.smk-results-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin: 26px 0 12px; }
.smk-results-title-wrap { display: flex; align-items: baseline; gap: 9px; min-width: 0; }
.smk-results-title { margin: 0; font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.smk-results-count { color: var(--smk-muted); font-size: 11.5px; font-variant-numeric: tabular-nums; }
.smk-results-sort { display: inline-flex; align-items: center; gap: 5px; color: var(--smk-muted); font-size: 10.5px; white-space: nowrap; }
.smk-inline-loading { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 26px 0 4px; color: var(--smk-muted); font-size: 11.5px; }

/* Grid & cards */
.smk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(296px, 1fr)); gap: 12px; }
.smk-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 192px;
  overflow: hidden;
  border: 1px solid var(--smk-border);
  border-radius: 14px;
  background: var(--smk-surface);
  transition: border-color 0.16s ease, background 0.16s ease;
}
.smk-card:hover { border-color: var(--smk-border-strong); background: color-mix(in srgb, var(--smk-surface-2) 46%, var(--smk-surface)); }
.smk-card.is-featured::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 2px;
  background: linear-gradient(180deg, var(--smk-accent), transparent 88%);
  opacity: 0.85;
}
.smk-card-hit {
  position: absolute;
  inset: 0;
  z-index: 1;
  padding: 0;
  border: 0;
  border-radius: inherit;
  background: transparent;
  cursor: pointer;
}
.smk-card-hit:focus-visible { outline: 2px solid var(--smk-accent); outline-offset: -2px; }
.smk-card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 10px;
  padding: 16px 16px 13px;
  pointer-events: none;
}
.smk-card-head { display: flex; align-items: flex-start; gap: 10px; min-width: 0; }
.smk-card-heading { min-width: 0; flex: 1 1 auto; }
.smk-card-title-row { display: flex; align-items: center; gap: 7px; min-width: 0; }
.smk-card-title { margin: 0; font-size: 13.5px; font-weight: 600; letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.smk-card-byline { display: flex; align-items: center; gap: 5px; margin-top: 2px; color: var(--smk-muted); font-size: 10.5px; min-width: 0; }
.smk-byline-author { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.smk-dot-sep { width: 2px; height: 2px; border-radius: 50%; background: currentColor; opacity: 0.45; display: inline-block; flex: 0 0 auto; }
.smk-version {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 5px;
  border-radius: 4px;
  background: var(--smk-surface-2);
  color: var(--smk-muted);
  font-size: 9.5px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.smk-card-summary {
  display: -webkit-box;
  min-height: 39px;
  margin: 0;
  overflow: hidden;
  color: var(--smk-muted);
  font-size: 12px;
  line-height: 1.58;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.smk-card-badges { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; min-height: 20px; }
.smk-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: auto; padding-top: 2px; }
.smk-card-stats { display: flex; align-items: center; gap: 10px; min-width: 0; }
.smk-stat { display: inline-flex; align-items: center; gap: 4px; color: var(--smk-muted); font-size: 10.5px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.smk-install-mini {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 27px;
  padding: 0 9px;
  border: 1px solid var(--smk-border);
  border-radius: 7px;
  background: var(--smk-surface);
  color: var(--smk-text);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  pointer-events: auto;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}
.smk-install-mini:hover:not(:disabled) { border-color: color-mix(in srgb, var(--smk-accent) 50%, var(--smk-border)); color: var(--smk-accent); }
.smk-install-mini:disabled { cursor: default; }
.smk-install-mini.is-installed { border-color: color-mix(in srgb, var(--smk-success) 30%, var(--smk-border)); background: color-mix(in srgb, var(--smk-success) 8%, var(--smk-surface)); color: var(--smk-success); }
.smk-install-mini.is-unavailable { color: var(--smk-muted); opacity: 0.75; }

/* Pills & badges */
.smk-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  height: 20px;
  padding: 0 7px;
  overflow: hidden;
  border-radius: 5px;
  background: var(--smk-surface-2);
  color: var(--smk-muted);
  font-size: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.smk-pill-featured { background: color-mix(in srgb, var(--smk-accent) 10%, transparent); color: var(--smk-accent); }
.smk-pill-success { background: color-mix(in srgb, var(--smk-success) 10%, transparent); color: var(--smk-success); }
.smk-pill-warn { background: color-mix(in srgb, var(--smk-warn) 12%, transparent); color: var(--smk-warn); }
.smk-pill-danger { background: color-mix(in srgb, var(--smk-danger) 10%, transparent); color: var(--smk-danger); }
.smk-badge { display: inline-flex; align-items: center; gap: 4px; height: 20px; padding: 0 7px; border-radius: 5px; font-size: 10px; font-weight: 500; white-space: nowrap; }
.smk-badge-success { background: color-mix(in srgb, var(--smk-success) 10%, transparent); color: var(--smk-success); }
.smk-badge-muted { background: var(--smk-surface-2); color: var(--smk-muted); }
.smk-badge-danger { background: color-mix(in srgb, var(--smk-danger) 10%, transparent); color: var(--smk-danger); }
.smk-badge-warn { background: color-mix(in srgb, var(--smk-warn) 12%, transparent); color: var(--smk-warn); }

/* Avatar */
.smk-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: #fff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18), 0 1px 2px rgba(0, 0, 0, 0.12);
}
.smk-avatar-text { font-weight: 600; letter-spacing: 0.02em; line-height: 1; text-shadow: 0 1px 1px rgba(0, 0, 0, 0.16); }

/* Empty / error */
.smk-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 62px 24px;
  border: 1px dashed var(--smk-border-strong);
  border-radius: 16px;
  background: color-mix(in srgb, var(--smk-surface) 58%, transparent);
  text-align: center;
}
.smk-empty-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin-bottom: 12px;
  border-radius: 14px;
  background: var(--smk-surface-2);
  color: var(--smk-muted);
}
.smk-empty-title { margin: 0; font-size: 14px; font-weight: 600; }
.smk-empty-body { max-width: 380px; margin: 6px 0 0; color: var(--smk-muted); font-size: 12px; line-height: 1.65; }
.smk-empty-action { margin-top: 16px; }
.smk-error {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 17px 18px;
  border: 1px solid color-mix(in srgb, var(--smk-danger) 26%, var(--smk-border));
  border-radius: 13px;
  background: color-mix(in srgb, var(--smk-danger) 6%, var(--smk-surface));
}
.smk-error-icon { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 11px; background: color-mix(in srgb, var(--smk-danger) 10%, transparent); color: var(--smk-danger); flex: 0 0 auto; }
.smk-error-copy { flex: 1 1 auto; min-width: 0; }
.smk-error-title { margin: 0; font-size: 13px; font-weight: 600; }
.smk-error-body { margin: 2px 0 0; color: var(--smk-muted); font-size: 11.5px; }

/* Skeletons */
.smk-skel {
  display: block;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--smk-surface-2) 24%, color-mix(in srgb, var(--smk-surface-2) 45%, var(--smk-border)) 38%, var(--smk-surface-2) 62%);
  background-size: 400% 100%;
  animation: smk-shimmer 1.5s ease infinite;
}
.smk-card-skeleton { display: flex; flex-direction: column; gap: 11px; min-height: 192px; padding: 16px; }
.smk-skel-row { display: flex; align-items: center; gap: 10px; }
.smk-skel-col { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
.smk-skel-avatar { width: 42px; height: 42px; border-radius: 12px; flex: 0 0 auto; }
.smk-skel-line { height: 10px; }
.smk-skel-chip { width: 58px; height: 18px; border-radius: 5px; }
.smk-skel-block { height: 150px; border-radius: 12px; }
@keyframes smk-shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }

/* Detail */
.smk-backbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 15px; }
.smk-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 29px;
  padding: 0 8px 0 4px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--smk-muted);
  font-size: 11.5px;
  cursor: pointer;
}
.smk-back:hover { background: var(--smk-surface-2); color: var(--smk-text); }
.smk-backbar-actions { display: flex; align-items: center; gap: 7px; }
.smk-detail-hero {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 17px;
  padding: 24px;
  overflow: hidden;
  border: 1px solid var(--smk-border);
  border-radius: 18px;
  background:
    radial-gradient(120% 180% at 0% 0%, hsl(var(--smk-hue) 68% 55% / 0.1) 0%, transparent 58%),
    var(--smk-surface);
}
.smk-detail-orb {
  position: absolute;
  top: -90px;
  right: -40px;
  width: 230px;
  height: 230px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, hsl(var(--smk-hue) 68% 55% / 0.14) 0%, transparent 68%);
}
.smk-detail-heading { position: relative; flex: 1 1 auto; min-width: 0; }
.smk-detail-title-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.smk-detail-title { margin: 0; font-size: 25px; font-weight: 650; line-height: 1.2; letter-spacing: -0.025em; word-break: break-word; }
.smk-detail-summary { max-width: 660px; margin: 7px 0 0; color: var(--smk-muted); font-size: 12.5px; line-height: 1.6; }
.smk-detail-badges { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; margin-top: 12px; }
.smk-detail-stats { position: relative; display: grid; grid-template-columns: repeat(2, minmax(74px, auto)); gap: 10px 18px; flex: 0 0 auto; padding-left: 12px; border-left: 1px solid var(--smk-border); }
.smk-detail-stat { display: flex; flex-direction: column; gap: 1px; }
.smk-detail-stat-value { font-size: 16px; font-weight: 620; line-height: 1.25; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.smk-detail-stat-label { color: var(--smk-muted); font-size: 10px; }
.smk-detail-grid { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 14px; margin-top: 14px; align-items: start; }
.smk-detail-main { min-width: 0; overflow: hidden; border: 1px solid var(--smk-border); border-radius: 14px; background: var(--smk-surface); }
.smk-tabs { display: flex; align-items: center; gap: 2px; padding: 0 10px; border-bottom: 1px solid var(--smk-border); overflow-x: auto; }
.smk-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 44px;
  padding: 0 10px;
  border: 0;
  background: transparent;
  color: var(--smk-muted);
  font-size: 11.5px;
  white-space: nowrap;
  cursor: pointer;
}
.smk-tab:hover { color: var(--smk-text); }
.smk-tab.is-active { color: var(--smk-text); font-weight: 500; }
.smk-tab.is-active::after { content: ""; position: absolute; inset: auto 10px -1px; height: 2px; border-radius: 2px 2px 0 0; background: var(--smk-accent); }
.smk-tab-panel { padding: 20px; }
.smk-section + .smk-section { margin-top: 24px; padding-top: 22px; border-top: 1px solid var(--smk-border); }
.smk-section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.smk-section-title { margin: 0 0 10px; font-size: 13px; font-weight: 600; letter-spacing: -0.01em; }
.smk-section-hint { margin-bottom: 10px; color: var(--smk-muted); font-size: 10.5px; }
.smk-caps { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
.smk-cap {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 10px 11px;
  border: 1px solid var(--smk-border);
  border-radius: 9px;
  background: color-mix(in srgb, var(--smk-surface-2) 38%, var(--smk-surface));
}
.smk-cap-icon { display: inline-flex; margin-top: 1px; color: var(--smk-muted); }
.smk-cap-accent .smk-cap-icon { color: var(--smk-accent); }
.smk-cap-warn .smk-cap-icon { color: var(--smk-warn); }
.smk-cap-copy { min-width: 0; }
.smk-cap-label { color: var(--smk-muted); font-size: 10.5px; }
.smk-cap-items { display: flex; flex-direction: column; gap: 3px; margin-top: 4px; }
.smk-cap-items code {
  overflow: hidden;
  color: var(--smk-text);
  font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 10.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.smk-cap-more { margin-top: 3px; color: var(--smk-muted); font-size: 10px; }
.smk-cap-empty { display: flex; align-items: center; gap: 7px; padding: 9px 11px; border: 1px solid var(--smk-border); border-radius: 9px; background: var(--smk-surface); color: var(--smk-muted); font-size: 11px; }
.smk-muted-text { color: var(--smk-muted); font-size: 11.5px; }
.smk-footnote { margin: 13px 0 0; color: var(--smk-muted); font-size: 10.5px; line-height: 1.6; }
.smk-alert { display: flex; align-items: flex-start; gap: 8px; padding: 10px 12px; border: 1px solid var(--smk-border); border-radius: 9px; font-size: 11.5px; line-height: 1.6; }
.smk-alert-warn { border-color: color-mix(in srgb, var(--smk-warn) 30%, var(--smk-border)); background: color-mix(in srgb, var(--smk-warn) 7%, var(--smk-surface)); color: var(--smk-warn); }
.smk-alert-danger { border-color: color-mix(in srgb, var(--smk-danger) 30%, var(--smk-border)); background: color-mix(in srgb, var(--smk-danger) 7%, var(--smk-surface)); color: var(--smk-danger); }
.smk-tab-panel > .smk-alert { margin-bottom: 16px; }

/* Prose */
.smk-prose { color: var(--smk-text); font-size: 12.5px; line-height: 1.72; overflow-wrap: anywhere; }
.smk-prose > :first-child { margin-top: 0; }
.smk-prose-heading { margin: 20px 0 7px; font-size: 13.5px; font-weight: 600; line-height: 1.35; letter-spacing: -0.01em; }
.smk-prose h2.smk-prose-heading { font-size: 15px; }
.smk-prose-p { margin: 8px 0; color: var(--smk-muted); }
.smk-prose-p strong { color: var(--smk-text); font-weight: 600; }
.smk-list { margin: 8px 0; padding-left: 19px; color: var(--smk-muted); }
.smk-list li { margin: 3px 0; padding-left: 2px; }
.smk-list li::marker { color: var(--smk-accent); }
.smk-quote { margin: 10px 0; padding: 7px 12px; border-left: 2px solid color-mix(in srgb, var(--smk-accent) 55%, transparent); background: var(--smk-surface-2); color: var(--smk-muted); border-radius: 0 6px 6px 0; }
.smk-prose-rule { margin: 16px 0; border: 0; border-top: 1px solid var(--smk-border); }
.smk-link { color: var(--smk-accent); text-decoration: none; }
.smk-link:hover { text-decoration: underline; text-underline-offset: 2px; }
.smk-inline-code { padding: 1px 4px; border-radius: 4px; background: var(--smk-surface-2); font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: 0.92em; }
.smk-code { margin: 10px 0; padding: 11px 12px; overflow-x: auto; border: 1px solid var(--smk-border); border-radius: 8px; background: color-mix(in srgb, var(--smk-surface-2) 55%, var(--smk-surface)); font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: 11px; line-height: 1.6; }
.smk-prose-foot { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--smk-border); color: var(--smk-muted); font-size: 10.5px; }

/* Files */
.smk-tab-files { display: grid; grid-template-columns: 225px minmax(0, 1fr); padding: 0; min-height: 360px; }
.smk-file-list { max-height: 520px; overflow-y: auto; padding: 7px; border-right: 1px solid var(--smk-border); background: color-mix(in srgb, var(--smk-surface-2) 22%, var(--smk-surface)); }
.smk-file-item {
  display: grid;
  grid-template-columns: 15px minmax(0, 1fr) auto;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 29px;
  padding: 5px 7px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--smk-muted);
  font-size: 10.5px;
  text-align: left;
  cursor: pointer;
}
.smk-file-item:hover { color: var(--smk-text); background: var(--smk-surface); }
.smk-file-item.is-active { color: var(--smk-text); border-color: var(--smk-border); background: var(--smk-surface); }
.smk-file-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); }
.smk-file-size { color: var(--smk-muted); font-size: 9.5px; font-variant-numeric: tabular-nums; }
.smk-file-panel { display: flex; flex-direction: column; min-width: 0; }
.smk-file-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 42px; padding: 0 10px 0 13px; border-bottom: 1px solid var(--smk-border); }
.smk-file-head-copy { display: flex; align-items: center; gap: 8px; min-width: 0; }
.smk-file-path { overflow: hidden; color: var(--smk-muted); font-size: 10.5px; font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); text-overflow: ellipsis; white-space: nowrap; }
.smk-file-meta { color: var(--smk-muted); font-size: 9.5px; white-space: nowrap; }
.smk-file-body { flex: 1 1 auto; min-height: 320px; overflow: auto; }
.smk-file-code { margin: 0; padding: 14px; color: var(--smk-text); font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: 11px; line-height: 1.65; tab-size: 2; white-space: pre; }
.smk-file-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 300px; padding: 24px; color: var(--smk-muted); font-size: 11.5px; text-align: center; }
.smk-file-state.is-error { color: var(--smk-danger); }

/* Security */
.smk-security-banner { display: flex; align-items: flex-start; gap: 10px; padding: 12px 13px; border: 1px solid var(--smk-border); border-radius: 10px; background: var(--smk-surface-2); }
.smk-security-banner.is-success { border-color: color-mix(in srgb, var(--smk-success) 28%, var(--smk-border)); background: color-mix(in srgb, var(--smk-success) 6%, var(--smk-surface)); }
.smk-security-banner.is-danger { border-color: color-mix(in srgb, var(--smk-danger) 30%, var(--smk-border)); background: color-mix(in srgb, var(--smk-danger) 7%, var(--smk-surface)); }
.smk-security-banner.is-warn { border-color: color-mix(in srgb, var(--smk-warn) 30%, var(--smk-border)); background: color-mix(in srgb, var(--smk-warn) 7%, var(--smk-surface)); }
.smk-security-icon { display: inline-flex; margin-top: 1px; color: var(--smk-muted); }
.smk-security-banner.is-success .smk-security-icon { color: var(--smk-success); }
.smk-security-banner.is-danger .smk-security-icon { color: var(--smk-danger); }
.smk-security-banner.is-warn .smk-security-icon { color: var(--smk-warn); }
.smk-security-title { color: var(--smk-text); font-size: 12px; font-weight: 600; }
.smk-security-sub { margin-top: 1px; color: var(--smk-muted); font-size: 11px; line-height: 1.55; }
.smk-reports { display: flex; flex-direction: column; gap: 8px; }
.smk-report { padding: 10px 11px; border: 1px solid var(--smk-border); border-radius: 9px; }
.smk-report-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.smk-report-vendor { font-size: 11.5px; font-weight: 500; }
.smk-report-summary { margin: 5px 0 0; color: var(--smk-muted); font-size: 11px; line-height: 1.55; }
.smk-report-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; font-size: 10.5px; }

/* Changelog */
.smk-changelog-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.smk-changelog { margin: 0; padding: 13px; overflow: auto; border: 1px solid var(--smk-border); border-radius: 9px; background: color-mix(in srgb, var(--smk-surface-2) 50%, var(--smk-surface)); color: var(--smk-text); font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: 11px; line-height: 1.65; white-space: pre-wrap; }

/* Aside */
.smk-detail-aside { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.smk-aside-card { padding: 14px; border: 1px solid var(--smk-border); border-radius: 12px; background: var(--smk-surface); }
.smk-aside-title { margin: 0 0 9px; font-size: 11.5px; font-weight: 600; }
.smk-info-list { display: flex; flex-direction: column; gap: 7px; margin: 0; }
.smk-info-row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.smk-info-row dt { color: var(--smk-muted); font-size: 10.5px; flex: 0 0 auto; }
.smk-info-row dd { margin: 0; overflow: hidden; color: var(--smk-text); font-size: 10.5px; text-align: right; text-overflow: ellipsis; white-space: nowrap; }
.smk-triggers { display: flex; flex-direction: column; gap: 5px; margin: 0; padding: 0; list-style: none; }
.smk-triggers li { position: relative; padding-left: 11px; color: var(--smk-muted); font-size: 10.5px; line-height: 1.55; }
.smk-triggers li::before { content: ""; position: absolute; left: 0; top: 6px; width: 4px; height: 4px; border-radius: 50%; background: var(--smk-accent); opacity: 0.7; }
.smk-path-box { display: flex; align-items: center; gap: 6px; min-width: 0; padding: 7px 7px 7px 9px; border: 1px solid var(--smk-border); border-radius: 7px; background: color-mix(in srgb, var(--smk-surface-2) 55%, var(--smk-surface)); }
.smk-path { flex: 1 1 auto; min-width: 0; overflow: hidden; color: var(--smk-muted); font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: 9.5px; line-height: 1.5; text-overflow: ellipsis; white-space: nowrap; }
.smk-path-copy { flex: 0 0 auto; width: 22px; height: 22px; }
.smk-aside-note { margin: 8px 0 0; color: var(--smk-muted); font-size: 10px; line-height: 1.55; }
.smk-aside-link { display: inline-flex; align-items: center; gap: 5px; padding: 3px 2px; color: var(--smk-accent); font-size: 10.5px; text-decoration: none; }
.smk-aside-link:hover { text-decoration: underline; text-underline-offset: 2px; }
.smk-aside-warning { display: flex; align-items: flex-start; gap: 7px; padding: 9px 10px; border: 1px solid color-mix(in srgb, var(--smk-warn) 24%, var(--smk-border)); border-radius: 9px; background: color-mix(in srgb, var(--smk-warn) 6%, var(--smk-surface)); color: var(--smk-warn); font-size: 10px; line-height: 1.55; }
.smk-detail-loading { display: flex; flex-direction: column; gap: 14px; }
.smk-detail-loading .smk-detail-hero { padding: 24px; border-style: dashed; background: var(--smk-surface); }

/* Installed */
.smk-installed-hero { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 16px; }
.smk-installed-count { display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
.smk-installed-count-value { font-size: 30px; font-weight: 650; line-height: 1; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.smk-installed-count-label { color: var(--smk-muted); font-size: 10.5px; }
.smk-dir-card { display: flex; align-items: center; gap: 10px; padding: 11px 13px; border: 1px solid var(--smk-border); border-radius: 11px; background: var(--smk-surface); }
.smk-dir-icon { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8px; background: var(--smk-surface-2); color: var(--smk-muted); flex: 0 0 auto; }
.smk-dir-copy { display: flex; flex-direction: column; gap: 1px; flex: 1 1 auto; min-width: 0; }
.smk-dir-label { color: var(--smk-muted); font-size: 9.5px; letter-spacing: 0.03em; text-transform: uppercase; }
.smk-dir-path { overflow: hidden; color: var(--smk-text); font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: 10.5px; text-overflow: ellipsis; white-space: nowrap; }
.smk-installed-group { margin-top: 24px; }
.smk-installed-group-head { display: flex; align-items: baseline; gap: 9px; margin-bottom: 9px; }
.smk-installed-group-title { margin: 0; font-size: 13px; font-weight: 600; }
.smk-installed-group-hint { color: var(--smk-muted); font-size: 10.5px; }
.smk-installed-list { display: flex; flex-direction: column; gap: 7px; }
.smk-installed-row { display: flex; align-items: flex-start; gap: 11px; padding: 13px; border: 1px solid var(--smk-border); border-radius: 11px; background: var(--smk-surface); transition: border-color 0.15s ease, background 0.15s ease; }
.smk-installed-row:hover { border-color: var(--smk-border-strong); background: color-mix(in srgb, var(--smk-surface-2) 35%, var(--smk-surface)); }
.smk-installed-row.is-skeleton { align-items: center; }
.smk-installed-main { flex: 1 1 auto; min-width: 0; }
.smk-installed-title-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.smk-installed-name { font-size: 12.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
.smk-installed-desc { display: -webkit-box; margin: 3px 0 0; overflow: hidden; color: var(--smk-muted); font-size: 11px; line-height: 1.55; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.smk-installed-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 5px; color: var(--smk-muted); font-size: 10px; }
.smk-installed-path { display: block; margin-top: 5px; overflow: hidden; color: var(--smk-muted); font-family: var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: 9.5px; text-overflow: ellipsis; white-space: nowrap; }
.smk-installed-actions { display: flex; align-items: center; gap: 5px; flex: 0 0 auto; padding-top: 2px; }

/* Dialogs */
.smk-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 24px;
  background: color-mix(in srgb, #000 42%, transparent);
  backdrop-filter: blur(3px);
  animation: smk-fade 0.14s ease;
}
.smk-dialog {
  width: min(520px, 100%);
  max-height: min(86vh, 760px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--smk-border-strong);
  border-radius: 16px;
  background: var(--dsw-alias-bg-overlay);
  box-shadow: 0 28px 80px color-mix(in srgb, #000 30%, transparent);
  animation: smk-rise 0.18s ease;
}
.smk-dialog-sm { width: min(420px, 100%); }
.smk-dialog-head { display: flex; align-items: center; gap: 10px; padding: 16px 16px 12px; }
.smk-dialog-heading { flex: 1 1 auto; min-width: 0; }
.smk-dialog-title { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }
.smk-dialog-sub { display: flex; align-items: center; gap: 5px; margin-top: 2px; color: var(--smk-muted); font-size: 11px; min-width: 0; }
.smk-dialog-sub:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.smk-dialog-close { flex: 0 0 auto; }
.smk-dialog-warn { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 10px; background: color-mix(in srgb, var(--smk-danger) 10%, var(--smk-surface)); color: var(--smk-danger); flex: 0 0 auto; }
.smk-dialog-body { display: flex; flex-direction: column; gap: 13px; padding: 2px 16px 16px; overflow-y: auto; }
.smk-dialog-foot { display: flex; align-items: center; justify-content: flex-end; gap: 7px; padding: 12px 16px; border-top: 1px solid var(--smk-border); background: color-mix(in srgb, var(--smk-surface) 55%, transparent); }
.smk-field { display: flex; flex-direction: column; gap: 6px; }
.smk-field-label { color: var(--smk-muted); font-size: 10.5px; font-weight: 500; }
.smk-dialog-caps { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.smk-dialog-cap { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px; border: 1px solid var(--smk-border); border-radius: 7px; background: var(--smk-surface); color: var(--smk-muted); font-size: 10.5px; }
.smk-dialog-cap-count { display: inline-flex; align-items: center; justify-content: center; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 5px; background: var(--smk-surface-2); color: var(--smk-text); font-size: 9.5px; font-weight: 600; }
.smk-dialog-note { margin: 0; color: var(--smk-muted); font-size: 11px; line-height: 1.6; }
.smk-check { display: flex; align-items: flex-start; gap: 8px; padding: 9px 10px; border: 1px solid var(--smk-border); border-radius: 8px; background: var(--smk-surface); cursor: pointer; }
.smk-check input { position: absolute; opacity: 0; width: 0; height: 0; }
.smk-check-box { display: grid; place-items: center; width: 15px; height: 15px; margin-top: 1px; border: 1px solid var(--smk-border-strong); border-radius: 4px; background: var(--smk-surface); color: transparent; flex: 0 0 auto; transition: background 0.13s ease, border-color 0.13s ease, color 0.13s ease; }
.smk-check input:checked + .smk-check-box { border-color: var(--smk-accent); background: var(--smk-accent); color: var(--dsw-alias-bg-base); }
.smk-check input:focus-visible + .smk-check-box { outline: 2px solid color-mix(in srgb, var(--smk-accent) 60%, transparent); outline-offset: 2px; }
.smk-check-label { color: var(--smk-muted); font-size: 10.5px; line-height: 1.55; }

/* Toast */
.smk-toast {
  position: fixed;
  bottom: 26px;
  left: 50%;
  z-index: 90;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  max-width: min(460px, calc(100vw - 40px));
  padding: 9px 14px;
  border-radius: 9px;
  background: var(--smk-text);
  color: var(--dsw-alias-bg-base);
  font-size: 11.5px;
  font-weight: 500;
  box-shadow: 0 14px 36px color-mix(in srgb, #000 24%, transparent);
  transform: translateX(-50%);
  animation: smk-toast-in 0.18s ease;
}
.smk-toast.is-error { background: var(--smk-danger); color: #fff; }
@keyframes smk-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes smk-rise { from { opacity: 0; transform: translateY(7px) scale(0.99); } to { opacity: 1; transform: none; } }
@keyframes smk-toast-in { from { opacity: 0; transform: translate(-50%, 5px); } to { opacity: 1; transform: translate(-50%, 0); } }
@keyframes smk-spin { to { transform: rotate(360deg); } }
.smk-spinner { display: inline-block; width: 13px; height: 13px; border: 1.7px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: smk-spin 0.7s linear infinite; flex: 0 0 auto; }

/* Nav */
.smk-nav { display: inline-flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: inherit; }
.smk-nav[data-active="true"] { color: var(--dsw-alias-brand-primary); }

/* Responsive */
@media (max-width: 1040px) {
  .smk-detail-grid { grid-template-columns: minmax(0, 1fr) 276px; }
}
@media (max-width: 960px) {
  .smk-detail-grid { grid-template-columns: minmax(0, 1fr); }
  .smk-detail-aside { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
  .smk-aside-warning { grid-column: 1 / -1; }
}
@media (max-width: 820px) {
  .smk-shell { padding: 20px 20px 52px; }
  .smk-hero { flex-direction: column; gap: 18px; padding: 22px; }
  .smk-hero-side { flex-direction: row; flex-wrap: wrap; min-width: 0; width: 100%; }
  .smk-hero-side .smk-button { flex: 1 1 auto; }
  .smk-updated { margin-left: 0; width: 100%; }
  .smk-detail-hero { flex-wrap: wrap; }
  .smk-detail-stats { width: 100%; padding: 12px 0 0; border-left: 0; border-top: 1px solid var(--smk-border); grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .smk-detail-title { font-size: 22px; }
  .smk-results-head { margin-top: 22px; }
}
@media (max-width: 720px) {
  .smk-scopebar { align-items: flex-start; flex-direction: column; gap: 6px; }
  .smk-scope-text { white-space: normal; }
  .smk-tab-files { grid-template-columns: minmax(0, 1fr); }
  .smk-file-list { display: flex; max-height: none; overflow-x: auto; border-right: 0; border-bottom: 1px solid var(--smk-border); }
  .smk-file-item { width: auto; min-width: 132px; grid-template-columns: 14px minmax(0, 1fr); }
  .smk-file-size { display: none; }
  .smk-file-head { padding: 0 8px 0 11px; }
  .smk-installed-row { flex-wrap: wrap; }
  .smk-installed-actions { width: 100%; justify-content: flex-end; padding-left: 49px; }
  .smk-installed-hero { align-items: flex-start; }
}
@media (max-width: 560px) {
  .smk-shell { padding: 16px 14px 46px; }
  .smk-hero { padding: 19px; border-radius: 16px; }
  .smk-title { font-size: 26px; }
  .smk-subtitle { font-size: 12px; }
  .smk-toolbar { gap: 6px; }
  .smk-search { flex-basis: 100%; }
  .smk-select { flex: 1 1 auto; }
  .smk-select-button { width: 100%; justify-content: space-between; }
  .smk-segment { flex: 1 1 100%; justify-content: stretch; }
  .smk-segment-item { flex: 1 1 50%; justify-content: center; }
  .smk-grid { grid-template-columns: minmax(0, 1fr); }
  .smk-detail-hero { padding: 18px; }
  .smk-detail-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .smk-tab-panel { padding: 16px; }
  .smk-detail-aside { grid-template-columns: minmax(0, 1fr); }
  .smk-caps { grid-template-columns: minmax(0, 1fr); }
  .smk-dialog-caps { grid-template-columns: minmax(0, 1fr); }
  .smk-overlay { padding: 12px; }
  .smk-backbar { align-items: flex-start; }
  .smk-backbar-actions .smk-button span { display: none; }
  .smk-installed-hero { flex-direction: column; gap: 10px; }
  .smk-installed-count { align-items: flex-start; }
  .smk-installed-actions { padding-left: 0; }
  .smk-dir-card { align-items: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .smk-root *, .smk-root *::before, .smk-root *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`

    return { apply, inject }
  },
})