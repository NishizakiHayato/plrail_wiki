import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SearchBarOriginal from '@theme-original/SearchBar';
import MeiliSearchBar from '@site/src/components/MeiliSearchBar';

/**
 * 搜索后端二选一：
 *   - 配置了 Meilisearch（endpoint 反代，或 host + searchKey 直连）→ 走 Meilisearch
 *   - 否则 → 回退到本地离线索引（@easyops-cn/docusaurus-search-local）
 *
 * 这里的启用条件必须与 docusaurus.config.js 的 MEILI_ENABLED、以及
 * MeiliSearchBar 内部的 enabled 完全一致：三者一旦漂移，就会出现
 * 「本地搜索插件被跳过 + Meilisearch 又没启用」→ 搜索框整体消失。
 */
export default function SearchBar(props) {
  const {siteConfig} = useDocusaurusContext();
  const meili = siteConfig.customFields?.meilisearch;

  // endpoint 模式下密钥由反向代理注入，前端只有 endpoint 一项，没有 host/searchKey
  const meiliEnabled = Boolean(
    meili?.endpoint || (meili?.host && meili?.searchKey),
  );

  if (meiliEnabled) {
    return <MeiliSearchBar {...meili} />;
  }
  return <SearchBarOriginal {...props} />;
}
