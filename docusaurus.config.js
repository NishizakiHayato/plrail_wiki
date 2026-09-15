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
const MEILI_ENABLED = Boolean(MEILI_HOST || MEILI_ENDPOINT);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '波兰铁路游戏知识库',
  tagline: '波兰铁路模拟游戏中文知识库',
  // 生产域名；Docusaurus 的 url 不带尾斜杠，路径部分写在 baseUrl
  url: 'https://wiki.plrail.com',
  baseUrl: '/', // 部署在域名根路径
  favicon: 'img/favicon.ico',
  // 显式声明，避免不同托管商对尾斜杠处理不一致（参考 slorber/trailing-slash-guide）
  trailingSlash: false,

  // ------------------------------------------------------------------
  // 多语言：默认中文；英文目前仅占位 / 预留
  // ------------------------------------------------------------------
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      'zh-Hans': {label: '简体中文', htmlLang: 'zh-CN'},
      en: {label: 'English', htmlLang: 'en'},
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

  // 每个游戏一个 docs 插件实例
  plugins: games.map((game) => [
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
          // 语言切换
          {
            type: 'localeDropdown',
            position: 'right',
          },
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
