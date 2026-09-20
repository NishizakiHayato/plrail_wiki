# 架构与内部实现

给**维护者**看的：站点是怎么组织的、改哪儿会影响什么。

只改文档内容的贡献者不需要读这里，看 [README.md](./README.md) 就够了。

## 总览

- 纯静态站：Docusaurus 3，无服务端渲染、无后端接口。
- 发布地址 `https://wiki.plrail.com`（`url`），部署在域名根路径（`baseUrl: '/'`）。
- 内容按**游戏**拆成 5 个互相独立的 docs 实例，**默认 docs 实例已关闭**（`docs: false`），
  blog 也关闭（`blog: false`）。
- 语言只有 `zh-Hans`：见「多语言」。
- `trailingSlash: true`：产物是 `<route>/index.html` 的**目录式**结构，而不是扁平的 `<route>.html`。
  多数 Web 服务器（Nginx 目录索引 / 虚拟主机面板）只认目录里的 `index.html`，
  扁平文件无法被无扩展名 URL 命中，会兜底到首页 `index.html`。
- 搜索后端二选一（Meilisearch / 构建期生成的本地离线索引）：见「搜索」。

## 游戏实例

实例 id 一处定义、四处使用：插件实例 id、源目录 `docs/<id>`、路由前缀 `routeBasePath: <id>`、
侧边栏文件 `sidebars/<id>.js`。批量生成写在 `docusaurus.config.js` 的 `plugins` 里：

```js
...games.map((game) => [
  '@docusaurus/plugin-content-docs',
  {id: game.id, path: `docs/${game.id}`, routeBasePath: game.id, sidebarPath: `./sidebars/${game.id}.js`},
]),
```

导航栏每个游戏一个 `docSidebar` 入口，**必须显式写 `docsPluginId: game.id`**：
本站没有默认 docs 实例，不写会指向一个不存在的实例。

### ⚠️ 游戏清单有两份

| 位置 | 被谁使用 |
| --- | --- |
| `docusaurus.config.js` 顶部的 `games` 数组 | 生成插件实例、导航栏、页脚 |
| `src/games.js` | 首页 `GameGrid` 卡片（`import {games} from '@site/src/games'`） |

两份不一致时的表现：首页卡片多一个 / 少一个，或者卡片点进去 404（有卡片但没有对应实例）。

### 新增一个游戏

1. 建 `docs/<id>/`，放一个 `intro.md`。
2. 建 `sidebars/<id>.js`（照抄现有实例，改 id）。
3. 在 `docusaurus.config.js` 的 `games` 和 `src/games.js` **两处**各加一行 `{id: '<id>', label: '<显示名>'}`。

## 前端代码

| 文件 | 作用 |
| --- | --- |
| `src/pages/index.js` | 首页：Hero 横幅 + 游戏入口卡片 |
| `src/components/GameGrid/` | 首页入口卡片，数据来自 `src/games.js` |
| `src/components/Collapse/` | 自建的折叠面板组件，**目前 0 处引用**（文档统一写原生 `<details>`），见「折叠面板」 |
| `src/theme/MDXComponents.js` | 把 `Collapse` 注册进 MDX 组件表；`<details>` 用的是主题自带映射，与它无关 |
| `src/theme/SearchBar/` | 覆写导航栏搜索框：后端二选一 + 移动端收成图标 |
| `src/components/MeiliSearchBar/` | 直接调用 Meilisearch 的 HTTP 搜索 API，下拉出前几条结果 |
| `src/components/SearchPage/` | 独立结果页 `/search/?q=…&page=2`（仅 Meilisearch 模式注册） |
| `src/theme/Admonition/` | 提示块（`:::note` 等）的图标与样式覆写 |
| `src/css/custom.css` | 站点样式变量与覆写 |

## 搜索

三种状态，由构建期环境变量决定，从上到下优先级递减：

| 配置 | 行为 |
| --- | --- |
| `MEILI_ENDPOINT`（如 `https://wiki.plrail.com/api/search`） | 走同域反向代理，**密钥由服务器侧注入，浏览器不接触密钥**（推荐） |
| `MEILI_HOST` + `MEILI_SEARCH_KEY` | 浏览器直连 Meilisearch，密钥会进前端产物（因此只能用**只读 Search Key**，绝不能用 master key） |
| 都不配 | 构建期生成 lunr 本地离线索引（`@easyops-cn/docusaurus-search-local`），随静态站一起部署 |

### 启用条件必须三处一致

`docusaurus.config.js` 的 `MEILI_ENABLED`、`src/theme/SearchBar/index.js` 的 `meiliEnabled`、
`MeiliSearchBar` 内部的 `enabled`，判断条件必须完全一致。三者一旦漂移，就会出现
「本地搜索插件被跳过 + Meilisearch 又没启用」→ **搜索框整体消失**。

### `/search/` 路由二选一

本地搜索插件自带一个 `/search/` 路由；Meilisearch 模式下才由 `meiliSearchPagePlugin`
再注册一个指向 `SearchPage` 的 `/search/`。两者同时存在会触发 Docusaurus 的
「Duplicate routes」警告，且最终命中哪个页面不确定 —— 所以按后端二选一注册，
不要把这个页面放进 `src/pages/search.js`。

### 索引脚本

`scripts/search/meili-index.mjs`（零依赖，只用 Node 内置 `fetch`）在部署完成后再灌索引，
避免索引领先于页面内容。它不回显 Meilisearch 地址，错误信息也做了打码。
具体配置项见 [DEPLOYMENT.md](./DEPLOYMENT.md)。

## 多语言：为什么只剩 `zh-Hans`

`i18n.locales` 现在只有 `zh-Hans`，站点不生成 `/en/` 路由。

原因：Docusaurus 会为 `locales` 里的每种语言各跑一遍全部插件（含 5 个 docs 实例）。
即使英文没有任何实际译文，MDX 里引用的图片也会随各语言产物重复处理、重复输出，
构建耗时和产物体积接近翻倍。英文当时只是占位、没有维护价值，于是先摘掉。

残留说明：

- `i18n/en/`（`code.json` + `docusaurus-theme-classic/`）**保留但不再参与构建**，
  里面是主题词条的英文译文，恢复英文时可以直接复用。确认不需要可以整个删掉。
- `npm run check-i18n`（`scripts/check-i18n.sh`）是给多语言用的，单语言下跑出来的是满屏
  「缺失译文」提示，没有参考价值；CI 里对应的 `i18n-check` job 已一并下线。
- 本地搜索插件的 `language: ['en', 'zh']` 与语言无关，是**分词器**配置
  （正文含大量英文专有名词），不要跟着改。

将来要恢复英文：

1. `docusaurus.config.js`：`locales` 改回 `['zh-Hans', 'en']`，补回 `localeConfigs.en`；
   如需语言切换入口，再解除 navbar 里 `localeDropdown` 的注释。
2. 按 `i18n/en/<插件实例名>/current/` 补译文，例如
   `i18n/en/docusaurus-plugin-content-docs-simrail/current/` 对应 `docs/simrail/`。
3. `.forgejo/workflows/docs.yml`：把 `i18n-check` job 加回 `build` 的 `needs`。

## slug 检查脚本

`scripts/check-slug.mjs`（零依赖，只用 Node 内置模块）按 Docusaurus 的规则复算每篇文档的路由：

- `docs/<游戏>/` 下每个顶层目录算一个实例；
- 考虑 frontmatter 的 `slug`（`/` 开头为相对实例根，否则相对所在目录）、`id`、文件名数字前缀
  （`02-faq.md` 与 `faq.md` 撞车）、`index` / `README` / 与目录同名的首页文件；
- `_` 开头的文件与目录、`__tests__/`、`*.test.*` 按 partial 跳过。

两条相同的路由会让后加载的文档覆盖先加载的，而 `docusaurus build` 只打
`Duplicate routes found!` 警告、不会失败，所以必须在构建之外显式检查。

**覆盖不到的地方**：`_category_.json` 里 `link.type: generated-index` 生成的目录索引页
（如 `docs/simrail/general/_category_.json` 的 `/general`）也会占一条路由，但脚本只看
`docs/**/*.md`，不解析这些 json —— 改目录索引页的 `slug` 时要自己确认没和文档 slug 撞车。

## 折叠面板

文档统一使用 HTML 原生的 `<details>` / `<summary>`，用法见 [README.md](./README.md)。
背后是主题自带的一层映射，没有自建代码：

```
<details>  ──►  @theme/MDXComponents 的 details 映射
           ──►  @theme/MDXComponents/Details   （从 children 里摘出 <summary> 当标题栏）
           ──►  @theme/Details                 （套 Infima 的 alert alert--info + styles.module.css）
           ──►  @docusaurus/theme-common/Details
```

`src/components/Collapse/` 是自建的替代组件，**目前 76 篇文档里 0 处引用**（全站都用 `<details>`），
属于历史遗留的死代码：要么连同 `src/theme/MDXComponents.js` 里的注册一起删掉，
要么明确留作备用。下面是它的实现要点，留着以免将来真要用时重新推一遍：

- **高度过渡**：内容容器固定 `overflow: hidden`，内联 `height` 在「实测内容高度」与 `0` 之间切换，
  配 `transition: height 0.24s ease`。首次渲染即展开时用 `height: auto`，避免挂载瞬间播放一次动画。
- **跟随内容变化**：`ResizeObserver` 观察不受高度约束的内层元素，字体加载、图片渲染、窗口缩放后重新测量。
- **无障碍**：标题栏是真正的 `button`（`aria-expanded` / `aria-controls`），内容区是 `role="region"`
  并用 `aria-labelledby` 关联标题；收起时加 `inert` 移出 Tab 顺序（不能用 `hidden`，会打断过渡）。
  `Enter` / `Space` 可切换。
- **动效降级**：命中 `prefers-reduced-motion: reduce` 时关闭动画。
