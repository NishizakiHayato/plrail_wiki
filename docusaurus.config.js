import {themes as prismThemes} from 'prism-react-renderer';

/**
 * 波兰铁路游戏知识库
 *
 * 内容按「游戏」拆成 5 个互相独立的 docs 实例：
 *   SimRail / Maszyna / TD2 / ISDR / TPF2
 * 每个实例有自己的源目录、路由前缀、侧边栏与 i18n 目录，互不影响。
 */

/**
 * 游戏实例清单：增删游戏只需改这里。
 *   id    —— 插件实例 id，同时用作源目录名、路由前缀、侧边栏 id
 *   label —— 导航栏 / 页脚显示名
 */
const games = [
  {id: 'simrail', label: 'SimRail'},
  {id: 'maszyna', label: 'Maszyna'},
  {id: 'td2', label: 'TD2'},
  {id: 'isdr', label: 'ISDR'},
  {id: 'tpf2', label: 'TPF2'},
];

// 「编辑此页」指向 Forgejo/Gitea 的 Web 编辑器：<仓库>/_edit/<分支>/<文件相对路径>
const EDIT_URL = 'https://code.shinetsurailway.net/PLRail/wiki/_edit/main/';

// 搜索后端开关：
//   设置 MEILI_HOST（+ MEILI_SEARCH_KEY）→ 浏览器直连 Meilisearch
//   或设置 MEILI_ENDPOINT（如 https://wiki.plrail.com/api/search）
//     → 走同域反向代理，密钥由 Nginx 注入，浏览器不接触密钥（推荐）
//   两者都未设置 → 使用本地离线索引（构建期生成 lunr 索引）
const MEILI_HOST = process.env.MEILI_HOST || '';
const MEILI_SEARCH_KEY = process.env.MEILI_SEARCH_KEY || '';
const MEILI_INDEX = process.env.MEILI_INDEX || 'wiki_docs';
const MEILI_ENDPOINT = process.env.MEILI_ENDPOINT || '';
// 启用条件必须与 src/theme/SearchBar/index.js 的判断保持一致：
// 三者不同步会导致「本地搜索插件被跳过，Meilisearch 又没启用」，搜索框直接消失。
const MEILI_ENABLED = Boolean(MEILI_ENDPOINT || (MEILI_HOST && MEILI_SEARCH_KEY));

// ------------------------------------------------------------------
// 独立搜索结果页路由：/search/?q=…&page=2
//
// 为什么不放在 src/pages/search.js：
//   本地搜索插件（@easyops-cn/docusaurus-search-local）自带一个 /search/ 路由，
//   两者同时存在会触发 Docusaurus 的「Duplicate routes」警告，且最终命中哪个
//   页面不确定。所以按后端二选一注册：
//     Meilisearch 模式 → 本插件注册 /search/，指向 SearchPage 组件；
//     本地索引模式   → 不注册，继续用本地搜索插件自带的结果页。
// ------------------------------------------------------------------
function meiliSearchPagePlugin() {
  return {
    name: 'meili-search-page',
    contentLoaded({actions: {addRoute}}) {
      addRoute({
        path: '/search/', // 与 baseUrl 一致；本站部署在根路径
        component: require.resolve('./src/components/SearchPage/index.js'),
        exact: true,
      });
    },
  };
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '波兰铁路游戏知识库',
  tagline: '波兰铁路模拟游戏中文知识库',
  // 生产域名；Docusaurus 的 url 不带尾斜杠，路径部分写在 baseUrl
  url: 'https://wiki.plrail.com',
  baseUrl: '/', // 部署在域名根路径
  favicon: 'img/favicon.ico',
  // 生成「目录式」产物：<route>/index.html（而非 <route>.html 扁平文件）。
  // 多数 Web 服务器（Nginx 目录索引 / 虚拟主机面板）只认目录里的 index.html，
  // 扁平的 xxx.html 无法被无扩展名 URL 命中，直链会兜底到首页 index.html。
  trailingSlash: true,

  // ------------------------------------------------------------------
  // 多语言：仅保留简体中文
  //
  // 为什么这里只留一种语言：
  //   Docusaurus 会为 locales 里的每种语言各跑一遍所有插件（含 5 个 docs 实例），
  //   MDX 里引用的图片会随各语言产物被重复处理 / 重复输出，构建耗时与体积翻倍。
  //   英文目前只是占位、没有实际译文，故移除。
  //
  // 将来要恢复英文：把 'en' 加回 locales（并补回 localeConfigs.en）。
  // ------------------------------------------------------------------
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
    localeConfigs: {
      'zh-Hans': {label: '简体中文', htmlLang: 'zh-CN'},
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // 默认 docs 实例已关闭：内容全部由下方 5 个游戏实例承载
        docs: false,
        blog: false, // 知识库不需要博客
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  // 每个游戏一个 docs 插件实例；已启用 Meilisearch 时再追加独立结果页路由
  plugins: [
    ...games.map((game) => [
      '@docusaurus/plugin-content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      ({
        id: game.id,
        path: `docs/${game.id}`,
        routeBasePath: game.id,
        sidebarPath: `./sidebars/${game.id}.js`,
        editUrl: EDIT_URL,
        editLocalizedFiles: true, // 「编辑此页」指向 i18n 译文，方便译者提 PR
      }),
    ]),
    ...(MEILI_ENABLED ? [meiliSearchPagePlugin] : []),
  ],

  // ------------------------------------------------------------------
  // 全文搜索
  //   默认：本地离线索引（构建期生成 lunr 索引，随静态站部署）
  //   设置 MEILI_HOST / MEILI_ENDPOINT 后：改用 Meilisearch，这里不再注册本地搜索主题
  // ------------------------------------------------------------------
  themes: MEILI_ENABLED
    ? []
    : [
        [
          require.resolve('@easyops-cn/docusaurus-search-local'),
          /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
          ({
            hashed: true, // 索引文件带内容哈希，便于长期缓存
            indexBlog: false, // 本站无博客
            indexPages: false,
            // 每个游戏实例一个路由前缀，全部纳入索引
            docsRouteBasePath: games.map((game) => game.id),
            docsDir: games.map((game) => `docs/${game.id}`),
            // 多实例且没有 default 实例时，必须指定一个实例用于版本/上下文判断
            docsPluginIdForPreferredVersion: games[0].id,
            language: ['en', 'zh'], // 中英混排内容
            removeDefaultStopWordFilter: true, // 中文不要丢停用词
            highlightSearchTermsOnTargetPage: true, // 跳转后高亮关键词
            searchResultLimits: 10,
            searchResultContextMaxLength: 60,
          }),
        ],
      ],

  customFields: {
    // 前端搜索框据此决定走 Meilisearch 还是本地索引
    meilisearch: MEILI_ENABLED
      ? {
          host: MEILI_HOST,
          searchKey: MEILI_SEARCH_KEY,
          indexUid: MEILI_INDEX,
          endpoint: MEILI_ENDPOINT,
        }
      : null,
  },

  themeConfig:
    /** @type {import('@docusaurus/theme-classic').ThemeConfig} */
    ({
      navbar: {
        title: '波兰铁路游戏知识库',
        logo: {
          alt: 'PLR 波兰铁路游戏知识库',
          src: 'img/logo.png', // 839×400 横版双色图，高度由 Infima 限制为 2rem
        },
        items: [
          // 每个游戏一个入口
          ...games.map((game) => ({
            type: 'docSidebar',
            sidebarId: game.id,
            docsPluginId: game.id, // 关键：指定所属实例
            position: 'left',
            label: game.label,
          })),
          // 语言切换：英文已从 i18n.locales 移除，站点不再有 /en/ 路由，
          //   这里自然也没有可切换的语言，故不放 localeDropdown。
          //   将来恢复英文时，再把这段和 i18n.locales 里的 'en' 一起加回来。
          // {
          //   type: 'localeDropdown',
          //   position: 'right',
          // },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '知识库',
            items: games.map((game) => ({
              label: game.label,
              to: `/${game.id}/`,
            })),
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} 波兰铁路游戏知识库`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
