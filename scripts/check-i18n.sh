#!/usr/bin/env bash
#
# 多实例 × 多语言 的译文完整性校验
#
# 用法：
#   bash scripts/check-i18n.sh
#   LOCALES="en ja" bash scripts/check-i18n.sh
#   STRICT_I18N=1 bash scripts/check-i18n.sh   # 缺失译文视为失败
#
# 说明：
#   英文目前只是「占位 / 预留」，无法保证每篇文档都有对应译文，
#   因此默认只列出缺失清单作为提示，不计入失败（退出码仍为 0）。
#   将来英文转正、需要真正把住质量关时，用 STRICT_I18N=1 恢复门禁。
#
# 退出码：0 = 通过；1 = 存在缺失（仅 STRICT_I18N=1 时）

set -uo pipefail

# 是否严格模式：0 = 缺失只告警；1 = 缺失即失败
STRICT_I18N="${STRICT_I18N:-0}"
LOCALES="${LOCALES:-en}"
fail=0
missing_count=0

# 实例定义：插件目录名|源目录（每个游戏一个独立实例）
instances=(
  "docusaurus-plugin-content-docs-simrail|docs/simrail"
  "docusaurus-plugin-content-docs-maszyna|docs/maszyna"
  "docusaurus-plugin-content-docs-td2|docs/td2"
  "docusaurus-plugin-content-docs-isdr|docs/isdr"
  "docusaurus-plugin-content-docs-tpf2|docs/tpf2"
)

# 列出某个目录下所有 md/mdx 的相对路径
list_docs() {
  local dir="$1"
  [ -d "$dir" ] || return 0
  (cd "$dir" && find . -type f \( -name '*.md' -o -name '*.mdx' \) | sed 's|^\./||' | sort)
}

# 对比 src 与 translated，报告缺失
compare_dir() {
  local src="$1" translated="$2" label="$3"
  [ -d "$src" ] || return 0

  while IFS= read -r rel; do
    [ -z "$rel" ] && continue
    if [ ! -f "$translated/$rel" ]; then
      if [ "$STRICT_I18N" = "1" ]; then
        echo "  ✗ [${label}] 缺失译文: $translated/$rel"
      else
        echo "  ⚠ [${label}] 缺失译文（英文仅占位，不计入失败）: $translated/$rel"
      fi
      missing_count=$((missing_count + 1))
    fi
  done < <(list_docs "$src")
}

echo "==> 实例数: ${#instances[@]} | 语言: ${LOCALES} | 严格模式: ${STRICT_I18N}"
echo

for entry in "${instances[@]}"; do
  IFS='|' read -r plugin src_dir <<< "$entry"

  echo "--- 实例: ${plugin}"
  echo "    源目录: ${src_dir}"

  for loc in $LOCALES; do
    base="i18n/${loc}/${plugin}"

    # 逐个实例 × 语言比对译文
    compare_dir "$src_dir" "${base}/current" "${loc}/current"
  done

  echo
done

# 3) 未翻译占位符残留检查（write-translations --messagePrefix '(en) ' 产生）
echo "--- 占位符残留检查 (messagePrefix: '(en) ')"
placeholder_count=0
if [ -d i18n ]; then
  hits=$(grep -rl --include='*.md' --include='*.mdx' --include='*.json' -- "(en) " i18n 2>/dev/null || true)
  if [ -n "$hits" ]; then
    placeholder_count=$(printf '%s\n' "$hits" | wc -l | tr -d ' ')
    echo "$hits" | sed 's/^/  ⚠ 未翻译: /'
    if [ "$STRICT_I18N" = "1" ]; then
      fail=1
    fi
  fi
fi
echo

if [ "$STRICT_I18N" = "1" ] && [ "$missing_count" -gt 0 ]; then
  fail=1
fi

if [ "$fail" -eq 0 ]; then
  echo "✅ 译文完整性检查通过"
  if [ "$missing_count" -gt 0 ] || [ "$placeholder_count" -gt 0 ]; then
    echo "   （缺失译文 ${missing_count} 个 / 未翻译占位 ${placeholder_count} 处：按当前策略仅提示）"
  fi
else
  echo "❌ 译文完整性检查失败：缺失译文 ${missing_count} 个，未翻译占位 ${placeholder_count} 处"
fi

exit "$fail"
