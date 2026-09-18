import React from 'react';
import Translate from '@docusaurus/Translate';
import AdmonitionTypeNote from '@theme/Admonition/Type/Note';
import AdmonitionTypeTip from '@theme/Admonition/Type/Tip';
import AdmonitionTypeInfo from '@theme/Admonition/Type/Info';
import AdmonitionTypeWarning from '@theme/Admonition/Type/Warning';
import AdmonitionTypeDanger from '@theme/Admonition/Type/Danger';
import AdmonitionTypeCaution from '@theme/Admonition/Type/Caution';

/**
 * swizzle: @theme/Admonition/Types
 *
 * 背景：Docusaurus 把 secondary / important / success 当作「遗留别名」，
 * 在主题源码里把标题硬编码成英文小写（如 <AdmonitionTypeTip title="success" />），
 * 这些字符串不经过 i18n，所以在默认语言为中文的站点里 :::success 会直接
 * 渲染成英文标签 "success"。
 *
 * 这里保留官方的类型映射，只把三个别名的默认标题改为 <Translate> 词条：
 *   - 默认语言 zh-Hans 直接展示中文；
 *   - 将来启用英文时，在 i18n/en/code.json 补上对应译文即可；
 *   - 文档里显式写了标题的（:::success 我的标题）仍以文档标题为准。
 */
const admonitionTypes = {
  note: AdmonitionTypeNote,
  tip: AdmonitionTypeTip,
  info: AdmonitionTypeInfo,
  warning: AdmonitionTypeWarning,
  danger: AdmonitionTypeDanger,
};

const admonitionAliases = {
  secondary: (props) => (
    <AdmonitionTypeNote
      {...props}
      title={
        props.title ?? (
          <Translate
            id="theme.admonition.secondary"
            description="The default label used for the Secondary admonition (:::secondary)">
            次要
          </Translate>
        )
      }
    />
  ),
  important: (props) => (
    <AdmonitionTypeInfo
      {...props}
      title={
        props.title ?? (
          <Translate
            id="theme.admonition.important"
            description="The default label used for the Important admonition (:::important)">
            重要
          </Translate>
        )
      }
    />
  ),
  success: (props) => (
    <AdmonitionTypeTip
      {...props}
      title={
        props.title ?? (
          <Translate
            id="theme.admonition.success"
            description="The default label used for the Success admonition (:::success)">
            成功
          </Translate>
        )
      }
    />
  ),
  caution: AdmonitionTypeCaution,
};

export default {
  ...admonitionTypes,
  ...admonitionAliases,
};
