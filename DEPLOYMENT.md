# 部署与运维

给**维护者 / 有仓库权限的人**看的。日常改文档只需要看 [README.md](./README.md)，
站点结构看 [ARCHITECTURE.md](./ARCHITECTURE.md)。

## 发布链路

```
PR ──► pr-check.yml（只读：check-slug）
          │ 合并进 main
          ▼
      docs.yml ──► slug-check（兜底）──► npm run build ──► FTP 上传 ──► https://wiki.plrail.com/
                                                                          │
                                                        index-search（可选）刷新搜索索引
```

| 工作流 | 触发 | 作用 |
| --- | --- | --- |
| `.forgejo/workflows/pr-check.yml` | PR 到 `main`（opened / synchronize / reopened） | 跑 `check-slug`，失败则 PR 不能合并 |
| `.forgejo/workflows/docs.yml` | push 到 `main` / 手动 dispatch | slug 检查 → 构建 → FTP 部署 → 可选的搜索索引刷新 |

- 只在合并进 `main` 之后构建：PR 阶段不构建，既避免外部 PR 的代码在 Runner 上执行，也省构建资源。
- 同一分支的新推送会自动取消上一次运行（`concurrency` + `cancel-in-progress`）。

## 需要配置的 Secrets 与 variables

仓库 **Settings → Actions → Secrets and variables**：

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `FTP_USER` | secret | FTP 用户名 |
| `FTP_PASSWORD` | secret | FTP 密码 |
| `FTP_HOST` | secret | FTP 主机。**按机密处理**（可能含 IP / 内网地址）；日志中由 `FTP_HIDE_HOST=1` 隐藏 |
| `FTP_PORT` | variable | 可选，默认 21 |
| `FTP_REMOTE` | variable | 可选，远端目录，默认站点根目录 `/` |
| `FTP_TLS` | variable | 可选，`0` = 明文 FTP；默认 `1`（显式 FTPS） |
| `FTP_CONCURRENCY` | variable | 可选，并发连接数，默认 `5`；留空即用默认值 |

搜索相关的**可选**配置（不配则使用本地离线索引，流水线照常全绿）：

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `MEILI_ENDPOINT` | variable | 前端搜索端点：`https://wiki.plrail.com/api/search`（站点 Nginx 反代）。**会写进前端产物，只能填域名** |
| `MEILI_ENABLED` | variable | 填 `1` 才运行索引 job；未接入 Meilisearch 时留空，流水线照常全绿 |
| `MEILI_HOST` | secret | Meilisearch 地址（含端口）。**可能含内网 IP，按机密处理** |
| `MEILI_ADMIN_KEY` | secret | 灌索引用的 master key 或 admin key |
| `MEILI_INDEX` | variable | 可选，索引名，默认 `wiki_docs` |

> 防泄露约定
>
> 1. `FTP_HOST` / `MEILI_HOST` / `MEILI_ADMIN_KEY` 一律走 secret，不得写成 variable、不得硬编码进仓库。
> 2. 工作流里禁止 `echo` 这些变量、禁止 `set -x`、禁止整体打印 env。
> 3. `scripts/deploy-ftp.py` 在 `FTP_HIDE_HOST=1` 时隐藏 FTP 主机；`scripts/search/meili-index.mjs`
>    不回显地址且错误信息打码。

## FTP 部署

上传逻辑在 `scripts/deploy-ftp.py`（只用 Python 标准库，CI 无需装依赖），本地也能直接跑：

```bash
npm run build
FTP_DRY_RUN=1 FTP_HOST=ftp.example.com FTP_USER=user FTP_PASSWORD=pass \
  python3 scripts/deploy-ftp.py --local build --remote /
```

- `FTP_DRY_RUN=1` 只打印将要执行的动作，不做任何写操作；确认无误后去掉再跑。
- 同步是**镜像**模式：本地没有的远端文件会被删除，避免旧页面和过期 hash 资源残留。
  远端 FTP 根目录里如果有非构建产物的东西，先加进 `FTP_EXCLUDE`。
- `.well-known/`、`.htaccess`、`.deploy/` 默认保留（证书校验 / 服务器配置 / 部署清单），
  可用 `FTP_EXCLUDE`（逗号分隔、按文件名匹配）调整。
- 脚本只 `RETR` 那份远端清单、再用 `MLSD` 读远端文件列表来比对，**不会把站点的文件拉回本地**。

### 增量部署：远端清单 + 内容摘要

服务器是 **Pure-FTPd**，它的 `FEAT` 里**没有** `XMD5` / `XSHA1` / `XCRC`（服务端算不了摘要），
所以判断「哪些文件变了、哪些该删」靠一份放在**远端**的 sqlite 清单：
`<FTP_REMOTE>/.deploy/manifest.sqlite`（`FTP_MANIFEST` 可改；设为空字符串就关闭清单）。

清单里记的是**上一次成功部署后的状态**：`path | size | blake2b-256 摘要 | 远端 size | 远端 mtime(UTC)`。
每轮部署的流程：

1. `RETR` 把清单拉回本地临时目录（拉不到 / 校验不过 / 版本不符 / 目标根不一致 → 当作首次部署）
2. 并行算出本地每个文件的内容摘要（blake2b-256）
3. 递归 `MLSD` 扫一遍远端实际状态（只读元数据）
4. 比对：清单里没有或摘要变了 → 上传；摘要没变但远端 `size`/`mtime` 与清单不符 → 上传
   （远端被人工改过 / 丢过也自愈）；清单里有、本地没有 → 删除
5. 多连接并行 `STOR`，每个文件传完发 `MFMT`，把远端 mtime 打成本次部署的确定值（供下一轮比对）
6. 新清单先传 `manifest.sqlite.tmp`，再 `RNFR`/`RNTO` 改名，避免半截文件被下一轮当成有效清单

**清单只在整轮成功后更新**：中途失败就保留旧清单，下次自动重传缺失部分（幂等，不会漏文件）。

为什么不能只比 size：Docusaurus 的哈希资源「改名即换内容」，但 `.html` 是原地重写的，
size 撞车时旧页面会被**永久漏传**。为什么不用服务器上的 `unique` fact：
Pure-FTPd 的 `unique = dev + inode`，覆盖上传时 inode 不变，内容变了它也不变。

实测收益：单语言产物 1415 个文件 / 533 MB，其中 1113 个 `.webp` 占 497 MB
（内容哈希命名，不变就整体跳过），`.html` 只有 85 个 / 3.0 MB ——
只改文案的一次部署，上传量从 533 MB 降到几 MB 量级。

其它开关：

- `FTP_CONCURRENCY`（默认 `5`）：并发连接数。启动时会先探测服务器允许几条
  （Pure-FTPd 默认 `MaxClientsPerIP 8`），超了就自动降级；`1` = 串行。
- `FTP_FORCE=1` / `--force`：忽略清单全量重传（换服务器、或怀疑清单失真时用）。
- `FTP_TRUST_SIZE=1` / `--trust-size`：**没有清单时**信任「远端同大小即同内容」。
  仅在「远端就是当前这次构建部署的」时用，能免掉首次的全量重传；判断错会漏传同大小文件。
- 想强制重建清单：在服务器上删掉 `.deploy/` 目录，下一轮会自动全量重传并重建。
- 远端还没建立清单的**第一次**跑这个版本仍是全量上传，属正常现象。

## 搜索索引

`scripts/search/meili-index.mjs`（零依赖）在部署完成后刷新索引，避免搜到尚未上线的页面。
它只在 `vars.MEILI_ENABLED == '1'` 时运行；未接入 Meilisearch 时站点使用构建期生成的
本地离线索引，流水线照常全绿。搜索架构与三态切换见 [ARCHITECTURE.md](./ARCHITECTURE.md)。

## Git LFS 运维

图片等二进制走 LFS，规则在 `.gitattributes`（`*.png` `*.jpg` `*.gif` `*.webp` `*.mp4` `*.pdf` 等），
目的是避免仓库随截图素材无限膨胀。

- **提交前确认本机跑过 `git lfs install`**，否则 filter 不生效、原文件会被直接塞进 Git，
  事后得用 `git lfs migrate` 重写历史。
- SVG / ICO 不纳入 LFS：体积小或是纯文本，留给 Git 管更划算，改了还能看 diff。
- CI 的 `build` job 刻意不用 `actions/checkout` 的 `lfs` 开关，而是清除认证头后匿名 `git lfs pull`：
  任务令牌会被实例的 LFS 端点以 401 拒绝，而 git-lfs 收到 401 不会退回匿名访问、直接失败。
- `Verify LFS objects are materialized` 这一步不能删：**漏拉 LFS 时产物里的图片是坏的空壳，
  而流水线照样是绿的**，属于不冒烟就发现不了的故障。
- Forgejo 侧需要在仓库 Settings 里允许 Git LFS（取决于实例管理员是否开放、配额多少）。

## 故障排查

| 现象 | 原因与处理 |
| --- | --- |
| 工作流报 `job 'build' depends on unknown job` | `needs` 里写了已被删除的 job。`i18n-check` 已随多语言下线，不要再加回 `needs` |
| 搜索框整体消失 | 三处 Meilisearch 启用条件漂移，见 [ARCHITECTURE.md](./ARCHITECTURE.md) 的「搜索」 |
| 构建出的图片全是坏的，但流水线是绿的 | LFS 没实体化，检查 `Verify LFS objects are materialized` 那一步 |
| 文档页报 `Cannot read properties of undefined (reading 'id')` | 同时跑了 dev 与 build，删掉 `.docusaurus/` 重启 |
| 页面丢失 / 导航跳错 | 同实例内 slug 重复，`npm run check-slug` 定位后改 slug |
| 部署上传量远大于预期 | 清单丢失或被删（会被当作首次部署全量重传）；确认 `FTP_MANIFEST` 指向的 `.deploy/` 还在 |
| 部署删掉了服务器上不该删的文件 | 镜像模式的预期行为，把该条目加进 `FTP_EXCLUDE` |
