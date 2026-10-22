# 技能市场 · Skill Market

DeepSeek Harness 的社区技能市场插件。在 Harness 侧边栏打开「技能市场」，即可浏览精选技能、搜索 ClawHub 与 SkillHub、查看 `SKILL.md` 文件与安全信息，并一键安装到本机技能目录。

![icon](./icon.svg)

## 功能

- **精选清单**：内置 180 个技能元数据，覆盖智能体、搜索调研、开发、办公、数据、设计、写作、音视频、运维、安全、效率、教育等 13 个分类，按热度排序，标注精选技能。
- **全市场实时搜索**：切换到「全部市场」，输入关键词并回车，实时查询 ClawHub 与 SkillHub，并显示两个来源的可用状态。
- **详情预览**：概览、文件、安全报告、更新日志四个标签页；文件内容按需读取，支持复制与截断提示。
- **静态能力分析**：从 `SKILL.md` 与文件清单中提取命令、外部请求、密钥、Hook 与脚本，安装前提示需要关注的能力。
- **安全提示**：显示来源方的扫描状态；未经审计或被标记风险的技能需要勾选确认后才能安装。
- **安装与卸载**：写入 `$DSH_HOME/skills/<slug>`，附带 `.skill-market.json` 标记；卸载只删除市场安装的目录，不碰手动放置的本地技能。
- **我的技能**：分组展示市场安装与本地技能，显示版本、文件数、大小、安装时间与路径。
- **中英双语**：跟随 Harness 语言设置；所有界面文案都有中英文词条。
- **主题适配**：只使用 Harness 的 `--dsw-alias-*` 主题变量，自动适配明暗主题。

## 安装

本仓库是一个 DSH Cordis bundle。先把仓库克隆到本地，再把**仓库根目录**（包含 `package.json` 的目录）安装到 Harness：

```bash
git clone https://github.com/xuguangyao/dsh-skill-hub.git
cd dsh-skill-hub
```

然后在 Harness 的插件安装入口选择该目录，或使用插件管理工具把安装目标指向该目录。

安装后刷新页面，侧边栏会出现「技能市场」图标。插件通过 `dsh.bundle.patch` 插入 `skill-hub` 行，Host 与 Client 两半都会生效。

## 使用

1. 点击侧边栏「技能市场」。
2. 在「精选清单」中按分类、来源、安全状态或安装状态筛选；搜索框支持名称、用途、标签与作者。
3. 点击卡片查看详情；在「文件」标签页阅读 `SKILL.md`，在「安全报告」中查看来源方扫描结果。
4. 点击「安装」，确认安装位置与能力提示；未审计技能需要勾选确认。
5. 安装完成后，技能会在**下一个会话**的可用技能列表中出现；在「我的技能」中可查看或卸载。

## 安装位置与数据

- 技能目录：`$DSH_HOME/skills`，Windows 默认 `C:\Users\<user>\.dsh\skills`。
- 每个市场安装的技能目录包含 `.skill-market.json`，记录来源、slug、版本、安装时间、文件数与大小。
- 精选清单位于 `catalog/skills.json`，只包含元数据（名称、摘要、分类、标签、统计、版本、来源链接），不打包第三方技能正文。
- 详情、文件与安装包在需要时从来源方实时获取；网络不可用时详情会回退到精选快照，并禁用安装。

## 安全模型

- 安装**不会执行**技能中的脚本、Hook 或命令；只是把文件写入技能目录。
- 文件路径做目录穿越校验；单文件 5 MB、总计 20 MB、最多 200 个文件的限制。
- 下载内容按来源方声明的大小与 sha256（若提供）校验，先写临时目录再原子重命名。
- 卸载只允许删除带 `.skill-market.json` 且 id 匹配的目录，拒绝符号链接与非市场目录。
- 安全状态来自来源方扫描，不代表本插件的审计结论；请只安装你信任的来源。

## 开发

```bash
# 校验 Host 与 Client 语法
node --check index.js
node --check client.js

# 重新生成精选清单（需要网络）
node scripts/build-catalog.mjs

# 校验中英文词条覆盖
node scripts/check-locale.mjs

# Host 路由与安装/卸载回归（需要网络）
node scripts/test-host.mjs
node scripts/test-install.mjs
```

### 渲染测试

`scripts/test-client-render.mjs` 用 React 19 的 `renderToStaticMarkup` 做 SSR 冒烟测试。它不把 React 打包进插件，运行时从 `DSH_REACT_ROOT` 指向的项目里加载：

```powershell
$env:DSH_REACT_ROOT = "C:\path\to\web-app"
node scripts/test-client-render.mjs
```

```bash
DSH_REACT_ROOT=/path/to/web-app node scripts/test-client-render.mjs
```

### 结构

```text
dsh-skill-hub/
├─ index.js                 Host：目录、扫描、详情、文件、安装/卸载、技能 Provider
├─ client.js                Client：侧边栏入口、市场页、详情页、我的技能、对话框、样式
├─ cordis.patch.yml         Bundle 插入 skill-hub 行
├─ package.json             dsh.bundle / dsh.client 声明
├─ catalog/skills.json      精选技能元数据
├─ locale/{zh,en}.json      插件管理卡片文案
├─ icon.svg                 侧边栏与插件卡片图标
└─ scripts/                 目录构建与本地校验脚本
```

### Host 路由

所有路由都注册在 Harness 已认证的 `/api` 桥下：

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/skill-market/catalog` | 精选清单；`scope=live&q=` 时实时搜索 |
| GET | `/api/skill-market/detail` | 技能详情（`id`、可选 `owner`） |
| GET | `/api/skill-market/file` | 读取单个文件预览 |
| GET | `/api/skill-market/installed` | 已安装技能列表 |
| GET | `/api/skill-market/meta` | 总数、分类、安装数、技能目录 |
| POST | `/api/skill-market/install` | 安装（`{ id, owner? }`） |
| POST | `/api/skill-market/uninstall` | 卸载（`{ id }`） |

## 说明

- 精选清单来自 ClawHub 与 SkillHub 的公开列表数据，摘要与分类为生成时整理；来源与作者信息保留在条目中。
- 本插件为独立实现，UI 参考了社区技能市场的通用信息架构；不包含参考项目的源代码。
- 第三方技能的许可与内容由各自作者决定；安装前请阅读技能内的 `SKILL.md` 与 `LICENSE`（如有）。