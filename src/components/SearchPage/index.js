import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import {useHistory, useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * 独立搜索结果页：/search/?q=关键词&page=2
 *
 * 与导航栏下拉搜索的分工：
 *   - 下拉框：敲字即出前 8 条，用于「快速跳转」；
 *   - 本页：URL 可分享/可收藏、带翻页、单页结果更多，用于「翻找」。
 *
 * 只对接 Meilisearch（复用 siteConfig.customFields.meilisearch）。
 * 本地离线索引（@easyops-cn/docusaurus-search-local）不暴露结果页 API，
 * 因此未配置 Meilisearch 时本页只给出提示，不做降级查询。
 *
 * 路由不是放在 src/pages/ 下的：本地搜索插件自带一个 /search/ 路由，
 * 两者并存会撞车。这里由 docusaurus.config.js 的 meiliSearchPagePlugin
 * 在「已启用 Meilisearch」时才注册，未启用时继续用插件自带的结果页。
 */

// 每页条数；必须与下方 fetch 的 limit / offset 计算保持一致
const HITS_PER_PAGE = 10;

/** 生成翻页按钮序列，例如：1 … 4 5 6 … 20 */
function pageList(current, total) {
  const out = [];
  const push = (v) => {
    if (out[out.length - 1] !== v) out.push(v);
  };
  for (let i = 1; i <= total; i += 1) {
    if (i === 1 || i === total || Math.abs(i - current) <= 1) push(i);
    else push('…');
  }
  return out;
}

function SearchHit({hit}) {
  return (
    <Link className={styles.result} to={hit.url}>
      {/* _formatted 由 Meilisearch 服务端生成，内容来自本站索引 */}
      <div
        className={styles.title}
        dangerouslySetInnerHTML={{__html: hit._formatted?.title || hit.title}}
      />
      <div className={styles.crumb}>{hit.breadcrumb || hit.url}</div>
      {hit._formatted?.content && (
        <div
          className={styles.snippet}
          dangerouslySetInnerHTML={{__html: hit._formatted.content}}
        />
      )}
    </Link>
  );
}

export default function SearchPage() {
  const {siteConfig} = useDocusaurusContext();

  // endpoint 模式下密钥由反向代理注入，前端只有 endpoint 一项
  const cfg = siteConfig.customFields?.meilisearch || {};
  const host = (cfg.host || '').replace(/\/$/, '');
  const searchKey = cfg.searchKey || '';
  const indexUid = cfg.indexUid || 'wiki_docs';
  const endpoint = (cfg.endpoint || '').replace(/\/$/, '');
  const enabled = Boolean(endpoint || (host && searchKey));

  const history = useHistory();
  const location = useLocation();
  const searchPagePath = useBaseUrl('/search/');

  // URL 是唯一事实来源：q / page 都从查询串解析，便于分享与前进后退
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const q = (params.get('q') || '').trim();
  const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);

  const [input, setInput] = useState(q);
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [hits, setHits] = useState([]);
  const [total, setTotal] = useState(0);

  // 地址栏参数变化（含前进/后退、点「查看全部结果」进来）时同步输入框
  useEffect(() => {
    setInput(q);
  }, [q]);

  useEffect(() => {
    if (!enabled || !q) {
      setStatus('idle');
      setHits([]);
      setTotal(0);
      return undefined;
    }

    const ac = new AbortController();
    setStatus('loading');

    (async () => {
      try {
        const url = endpoint || `${host}/indexes/${encodeURIComponent(indexUid)}/search`;
        const headers = {'Content-Type': 'application/json'};
        if (searchKey) headers.Authorization = `Bearer ${searchKey}`;

        const res = await fetch(url, {
          method: 'POST',
          headers,
          signal: ac.signal,
          body: JSON.stringify({
            q,
            limit: HITS_PER_PAGE,
            offset: (page - 1) * HITS_PER_PAGE,
            attributesToHighlight: ['title', 'section', 'content'],
            highlightPreTag: '<mark class="meili-hl">',
            highlightPostTag: '</mark>',
            attributesToCrop: ['content'],
            cropLength: 60,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = data.hits || [];
        setHits(list);
        // offset/limit 模式下 Meilisearch 返回 estimatedTotalHits
        setTotal(data.estimatedTotalHits ?? data.totalHits ?? list.length);
        setStatus('done');
      } catch (err) {
        if (err.name === 'AbortError') return;
        setHits([]);
        setTotal(0);
        setStatus('error');
      }
    })();

    return () => ac.abort();
  }, [enabled, q, page, host, searchKey, indexUid, endpoint]);

  /** 把新的 q / page 写回 URL（URL 变了上面的 effect 自然会重新查询） */
  const go = useCallback(
    (nextQ, nextPage = 1) => {
      const sp = new URLSearchParams();
      if (nextQ) sp.set('q', nextQ);
      if (nextPage > 1) sp.set('page', String(nextPage));
      const search = sp.toString();
      history.push(`${location.pathname}${search ? `?${search}` : ''}`);
      window.scrollTo({top: 0, behavior: 'smooth'});
    },
    [history, location.pathname],
  );

  const onSubmit = (e) => {
    e.preventDefault();
    go(input.trim(), 1);
  };

  const totalPages = total > 0 ? Math.ceil(total / HITS_PER_PAGE) : 0;

  const renderBody = () => {
    if (!enabled) {
      return (
        <div className={styles.state}>
          站内搜索尚未配置
          <div className={styles.stateHint}>
            本页需要 Meilisearch（MEILI_ENDPOINT 或 MEILI_HOST + MEILI_SEARCH_KEY）
          </div>
        </div>
      );
    }

    if (!q) {
      return (
        <div className={styles.state}>
          输入关键词开始搜索
          <div className={styles.stateHint}>
            支持中文与英文，可搜索全部游戏知识库的正文与标题
          </div>
        </div>
      );
    }

    if (status === 'loading') {
      return <div className={styles.state}>搜索中…</div>;
    }

    if (status === 'error') {
      return <div className={styles.state}>搜索服务不可用，请稍后重试</div>;
    }

    if (status === 'done' && hits.length === 0) {
      // 有总数却取不到内容，说明页码越界（例如索引变小后旧链接仍在）
      if (total > 0 && page > 1) {
        return (
          <div className={styles.state}>
            这一页已经没有结果了
            <div className={styles.stateHint}>
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => go(q, 1)}>
                回到第 1 页
              </button>
            </div>
          </div>
        );
      }
      return (
        <div className={styles.state}>
          没有找到与「{q}」相关的文档
          <div className={styles.stateHint}>换个关键词试试，或减少关键词数量</div>
        </div>
      );
    }

    return (
      <>
        <div className={styles.meta}>
          找到约 <strong>{total}</strong> 条与「{q}」相关的结果
          {totalPages > 1 && (
            <>
              ，第 {page} / {totalPages} 页
            </>
          )}
        </div>

        <div className={styles.list}>
          {hits.map((hit) => (
            <SearchHit key={hit.id} hit={hit} />
          ))}
        </div>

        {totalPages > 1 && (
          <nav className={styles.pager} aria-label="搜索结果翻页">
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page <= 1}
              onClick={() => go(q, page - 1)}>
              上一页
            </button>

            {pageList(page, totalPages).map((item, i) =>
              item === '…' ? (
                <span key={`gap-${i}`} className={styles.pageGap}>
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  aria-current={item === page ? 'page' : undefined}
                  className={clsx(styles.pageBtn, item === page && styles.pageBtnActive)}
                  onClick={() => go(q, item)}>
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              className={styles.pageBtn}
              disabled={page >= totalPages}
              onClick={() => go(q, page + 1)}>
              下一页
            </button>
          </nav>
        )}
      </>
    );
  };

  return (
    <Layout title="搜索" description={`${siteConfig.title} 站内搜索`}>
      <div className={styles.page}>
        <div className="container">
          <Heading as="h1" className={styles.heading}>
            站内搜索
          </Heading>

          <form className={styles.form} onSubmit={onSubmit} role="search">
            <input
              type="search"
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="搜索文档…"
              aria-label="搜索文档"
              // 从下拉框跳进来时直接落焦，省去再点一次
              autoFocus
            />
            <button type="submit" className={styles.submit}>
              搜索
            </button>
          </form>

          {renderBody()}
        </div>
      </div>
    </Layout>
  );
}
