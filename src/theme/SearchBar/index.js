import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SearchBarOriginal from '@theme-original/SearchBar';
import MeiliSearchBar from '@site/src/components/MeiliSearchBar';
import styles from './styles.module.css';

/**
 * 搜索后端二选一：
 *   - 配置了 Meilisearch（endpoint 反代，或 host + searchKey 直连）→ 走 Meilisearch
 *   - 否则 → 回退到本地离线索引（@easyops-cn/docusaurus-search-local）
 *
 * 这里的启用条件必须与 docusaurus.config.js 的 MEILI_ENABLED、以及
 * MeiliSearchBar 内部的 enabled 完全一致：三者一旦漂移，就会出现
 * 「本地搜索插件被跳过 + Meilisearch 又没启用」→ 搜索框整体消失。
 *
 * 桌面端（> 996px）保持原样：直接内联搜索框。
 * 移动端（<= 996px，与 Infima 断点一致）：只留一个搜索图标，
 * 点击后弹出置顶搜索面板——窄屏上搜索框会挤掉站点名称，所以收进图标里。
 */
const MOBILE_MEDIA = '(max-width: 996px)';

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

export default function SearchBar(props) {
  const {siteConfig} = useDocusaurusContext();
  const meili = siteConfig.customFields?.meilisearch;

  // endpoint 模式下密钥由反向代理注入，前端只有 endpoint 一项，没有 host/searchKey
  const meiliEnabled = Boolean(
    meili?.endpoint || (meili?.host && meili?.searchKey),
  );

  // SSR 阶段没有 matchMedia，先按桌面端渲染，挂载后再校正（避免 hydration 不一致）
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const {pathname} = useLocation();

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA);
    const sync = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) setOpen(false);
    };
    setIsMobile(mq.matches);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // 跳转（点搜索结果、点侧边栏链接）后自动收起
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 展开后聚焦输入框，Esc 关闭
  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.querySelector('input')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const searchNode = meiliEnabled ? (
    // styles.inner：面板内让搜索框撑满宽度
    <MeiliSearchBar {...meili} className={isMobile ? styles.inner : undefined} />
  ) : isMobile ? (
    <div className={styles.inner}>
      <SearchBarOriginal {...props} />
    </div>
  ) : (
    <SearchBarOriginal {...props} />
  );

  if (!isMobile) {
    return searchNode;
  }

  return (
    <div className={styles.mobile}>
      <button
        type="button"
        className={styles.toggle}
        aria-label="搜索文档"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}>
        <SearchIcon />
      </button>

      {open && (
        <div className={styles.overlay}>
          <div
            className={styles.backdrop}
            onClick={() => setOpen(false)}
            role="presentation"
          />
          <div className={styles.panel} ref={panelRef}>
            {searchNode}
            <button
              type="button"
              className={styles.close}
              aria-label="关闭搜索"
              onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
