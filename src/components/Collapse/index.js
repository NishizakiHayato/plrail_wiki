import React, {useEffect, useId, useRef, useState} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * 正文内可折叠面板（类似 Ant Design Collapse 的单个 Panel）。
 *
 * 在任意 MDX 文档里全局可用，无需 import：
 *
 * <Collapse title="点击展开">正文内容（支持 Markdown）</Collapse>
 *
 * 高度过渡的实现要点：
 *   1. 容器固定 overflow:hidden，用内联 height 在「实测内容高度」与 0 之间切换；
 *   2. 首次渲染若为展开态，height 用 auto，避免挂载瞬间播放一次展开动画；
 *   3. 用 ResizeObserver 观察不受高度约束的内层元素，内容变化/字体加载/窗口缩放时重新测量。
 *
 * @param {object} props
 * @param {React.ReactNode} props.title 标题栏内容，必填
 * @param {React.ReactNode} [props.children] 面板内容，支持 Markdown
 * @param {boolean} [props.defaultOpen=false] 初始是否展开（非受控）
 * @param {boolean} [props.open] 受控展开状态
 * @param {(open: boolean) => void} [props.onChange] 展开状态变化回调
 * @param {React.ReactNode} [props.icon] 标题前的图标
 * @param {string} [props.className] 附加到面板根元素的类名
 * @param {string} [props.contentClassName] 附加到内容容器的类名
 */
export default function Collapse({
  title,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onChange,
  icon,
  className,
  contentClassName,
}) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  // useId 保证 SSR / 客户端水合一致，用于关联标题与内容
  const uniqueId = useId();
  const headerId = `${uniqueId}-header`;
  const contentId = `${uniqueId}-content`;

  const contentRef = useRef(null);
  const innerRef = useRef(null);
  // null 表示尚未测量，此时展开态用 auto
  const [contentHeight, setContentHeight] = useState(null);

  useEffect(() => {
    const measure = () => {
      const el = contentRef.current;
      if (el) setContentHeight(el.scrollHeight);
    };

    measure();

    if (typeof ResizeObserver === 'undefined' || !innerRef.current) {
      return undefined;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) {
      return;
    }
    // 收起时把内容移出 Tab 顺序与无障碍树。
    // 这里不能用 hidden / display:none，否则会打断高度过渡。
    if (open) {
      el.removeAttribute('inert');
    } else {
      el.setAttribute('inert', '');
    }
  }, [open]);

  const handleToggle = () => {
    const next = !open;
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onChange?.(next);
  };

  const height = open ? contentHeight ?? 'auto' : 0;

  return (
    <div className={clsx(styles.panel, open && styles.panelOpen, className)}>
      <button
        type="button"
        id={headerId}
        className={styles.header}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={handleToggle}>
        {icon ? (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className={styles.title}>{title}</span>
        <svg
          className={styles.chevron}
          viewBox="0 0 24 24"
          width="16"
          height="16"
          aria-hidden="true"
          focusable="false">
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        id={contentId}
        ref={contentRef}
        role="region"
        aria-labelledby={headerId}
        className={clsx(styles.content, contentClassName)}
        style={{height}}>
        <div ref={innerRef} className={styles.contentInner}>
          {children}
        </div>
      </div>
    </div>
  );
}
