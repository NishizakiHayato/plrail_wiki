import MDXComponents from '@theme-original/MDXComponents';
import Collapse from '@site/src/components/Collapse';

/**
 * 扩展 MDX 组件表：注册后即可在所有 .md / .mdx 文档里
 * 直接写 <Collapse>…</Collapse>，无需逐页 import。
 */
export default {
  ...MDXComponents,
  Collapse,
};
