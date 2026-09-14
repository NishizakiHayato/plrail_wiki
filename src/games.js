/**
 * 游戏实例清单（单一数据源）
 *
 * - docusaurus.config.js 用它生成 5 个 docs 插件实例（源目录 / 路由前缀 / 侧边栏）
 * - src/components/GameGrid 用它渲染首页入口卡片
 *
 * 增删游戏只改这个数组：
 *   1. 在 docs/ 下建同名目录，并放一个 intro.md
 *   2. 在 sidebars/ 下建同名侧边栏文件
 *   3. 在这里加一行
 */
export const games = [
  {id: 'simrail', label: 'SimRail'},
  {id: 'maszyna', label: 'Maszyna'},
  {id: 'td2', label: 'TD2'},
  {id: 'isdr', label: 'ISDR'},
  {id: 'tpf2', label: 'TPF2'},
];

export default games;
