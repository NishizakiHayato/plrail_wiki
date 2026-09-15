import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

/**
 * 直接调用 Meilisearch 的 HTTP 搜索 API（无需自建后端）。
 * 使用的必须是「只读的 Search Key」，绝不能用 master key。
 */
export default function MeiliSearchBar(props) {
  const {siteConfig} = useDocusaurusContext();
  const cfg = props?.host ? props : siteConfig.customFields?.meilisearch || {};
  const host = (cfg.host || '').replace(/\/$/, '');
  const searchKey = cfg.searchKey || '';
  const indexUid = cfg.indexUid || 'wiki_docs';
  // 完整搜索端点（如 https://wiki.plrail.com/api/search）。
  // 由反向代理转发到 Meilisearch 并注入 Search Key 时只配这一项，
  // 浏览器里不会出现任何密钥。
  const endpoint = (cfg.endpoint || '').replace(/\/$/, '');

  const history = useHistory();
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState([]);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const boxRef = useRef(null);
  // 快捷键提示按平台显示：macOS 用 ⌘K，其它用 Ctrl+K
  const [isMac, setIsMac] = useState(false);

  // 两种模式任选其一：直接连 Meilisearch（host + key），或走同域反代（endpoint）
  const enabled = Boolean(endpoint || (host && searchKey));

  // 平台检测只能在浏览器端做（SSR 阶段没有 navigator）
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent || ''));
  }, []);

  // ⌘K / Ctrl+K 聚焦
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 点击外部关闭
  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (!enabled || !query.trim()) {
      setHits([]);
      setError('');
      return undefined;
    }
    const ac = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const url = endpoint || `${host}/indexes/${encodeURIComponent(indexUid)}/search`;
        const headers = {'Content-Type': 'application/json'};
        // endpoint 模式下密钥由反向代理注入，浏览器侧不发送
        if (searchKey) headers.Authorization = `Bearer ${searchKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers,
          signal: ac.signal,
          body: JSON.stringify({
            q: query,
            limit: 8,
            attributesToHighlight: ['title', 'section', 'content'],
            highlightPreTag: '<mark class="meili-hl">',
            highlightPostTag: '</mark>',
            attributesToCrop: ['content'],
            cropLength: 45,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setHits(data.hits || []);
        setActive(0);
        setError('');
      } catch (err) {
        if (err.name !== 'AbortError') setError('搜索服务不可用');
      } finally {
        setLoading(false);
      }
    }, 200); // debounce：避免每敲一个字打一次服务
    return () => {
      clearTimeout(timer);
      ac.abort();
    };
  }, [query, enabled, host, searchKey, indexUid, endpoint]);

  const go = useCallback(
    (url) => {
      if (!url) return;
      setOpen(false);
      setQuery('');
      history.push(url);
    },
    [history],
  );

  const onKeyDown = (e) => {
    if (e.key === 'Escape') return setOpen(false);
    if (!hits.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % hits.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + hits.length) % hits.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(hits[active]?.url);
    }
  };

  const placeholder = useMemo(
    () => (enabled ? '搜索文档…' : '搜索未配置'),
    [enabled],
  );

  if (!enabled) return null;

  return (
    <div className={styles.box} ref={boxRef}>
      <input
        ref={inputRef}
        type="search"
        className={styles.input}
        placeholder={placeholder}
        value={query}
        disabled={!enabled}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        aria-label="搜索文档"
      />
      <span className={styles.hint}>{isMac ? '⌘K' : 'Ctrl+K'}</span>

      {open && query.trim() && (
        <div className={styles.dropdown}>
          {error && <div className={styles.empty}>{error}</div>}
          {!error && !loading && hits.length === 0 && (
            <div className={styles.empty}>没有找到相关文档</div>
          )}
          {hits.map((hit, i) => (
            <button
              type="button"
              key={hit.id}
              className={`${styles.hit} ${i === active ? styles.hitActive : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(hit.url)}>
              <div className={styles.hitTitle}
                   /* _formatted 由 Meilisearch 服务端生成，内容来自本站索引 */
                   dangerouslySetInnerHTML={{__html: hit._formatted?.title || hit.title}} />
              {hit._formatted?.content && (
                <div className={styles.hitContent}
                     dangerouslySetInnerHTML={{__html: hit._formatted.content}} />
              )}
              <div className={styles.hitPath}>{hit.breadcrumb || hit.url}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
