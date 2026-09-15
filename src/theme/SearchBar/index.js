import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SearchBarOriginal from '@theme-original/SearchBar';
import MeiliSearchBar from '@site/src/components/MeiliSearchBar';

/**
 * 搜索后端二选一：
 *   - 设置了 MEILI_HOST（+ MEILI_SEARCH_KEY）→ 走 Meilisearch
 *   - 否则 → 回退到本地离线索引（@easyops-cn/docusaurus-search-local）
 */
export default function SearchBar(props) {
  const {siteConfig} = useDocusaurusContext();
  const meili = siteConfig.customFields?.meilisearch;

  if (meili?.host && meili?.searchKey) {
    return <MeiliSearchBar {...meili} />;
  }
  return <SearchBarOriginal {...props} />;
}
