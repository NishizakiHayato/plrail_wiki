#!/usr/bin/env python3
#
# 通过 FTP / FTPS 把构建产物增量同步到远程主机
#
# 用法：
#   python3 scripts/deploy-ftp.py                       # 默认同步 build/ 到 FTP_REMOTE
#   python3 scripts/deploy-ftp.py --local build --remote /public_html
#   python3 scripts/deploy-ftp.py --concurrency 8       # 并发上传
#   FTP_DRY_RUN=1 python3 scripts/deploy-ftp.py         # 只打印将要执行的动作
#   python3 scripts/deploy-ftp.py --force               # 忽略清单，全量重传
#
# 环境变量（命令行参数优先）：
#   FTP_HOST          主机名，必填
#   FTP_USER          用户名
#   FTP_PASSWORD      密码
#   FTP_PORT          端口，默认 21
#   FTP_REMOTE        远端目录，默认 /
#   FTP_TLS           1 = 显式 FTPS（默认），0 = 明文 FTP
#   FTP_PASSIVE       1 = 被动模式（默认）
#   FTP_DELETE        1 = 删除远端多余文件（默认），0 = 只增不改
#   FTP_EXCLUDE       保留的远端条目名，逗号分隔，默认 .well-known,.htaccess,.deploy
#   FTP_MANIFEST      清单路径（相对 FTP_REMOTE），默认 .deploy/manifest.sqlite；
#                     设为空字符串则关闭清单，退化为「按远端大小比对」
#   FTP_CONCURRENCY   并发连接数，默认 5；1 = 串行
#   FTP_TRUST_SIZE    1 = 没有清单时，信任「远端同大小即同内容」（首次迁移用），默认 0
#   FTP_TIMEOUT       socket 超时秒数，默认 60
#   FTP_FORCE         1 = 忽略清单，全部重传
#   FTP_DRY_RUN       1 = 演练，不做任何写操作
#   FTP_HIDE_HOST     1 = 日志里隐藏主机名（CI 公开日志用）
#
# 增量原理（清单存在远端，每轮先拉回来比对）：
#   <FTP_REMOTE>/.deploy/manifest.sqlite 记录「上一次成功部署后的状态」：
#     path | size | blake2b-256 内容摘要 | 远端 size | 远端 mtime(UTC)
#   每轮流程：
#     1. RETR 清单到本地临时目录（拉不下来 / 校验不过 / 版本不符 / 目标根不一致
#        / 清单文件不存在，一律当作「没有清单」）
#     2. 并行算出本地每个文件的内容摘要（blake2b-256）
#     3. 递归 MLSD 扫一遍远端实际状态（拿 size + modify）
#     4. 比对出「要传」「要删」：
#          - 清单里没有，或本地摘要变了            -> 上传
#          - 摘要没变，但远端 size/mtime 与清单不符 -> 上传（远端被人工改过 / 丢过，自愈）
#          - 清单里有、本地没有                    -> 删除
#     5. 多连接并行 STOR；每个文件传完发 MFMT，把远端 mtime 打成本次部署的确定值
#     6. 新清单先传 .tmp，再 RNFR/RNTO 改名（接近原子的发布）
#   清单只在整轮成功后更新：中途失败就保留旧清单，下次自动重传缺失部分。
#
# 为什么不能只比 size：Docusaurus 的哈希资源「改名即换内容」，但 .html 是原地重写
#   的，size 撞车时旧页面会被永久漏传，所以必须用内容摘要。
# 为什么不用服务器上的 unique fact：Pure-FTPd 的 unique = dev + inode 拼接，覆盖
#   上传时 inode 不变，内容变了它也不变，只能标识「是同一个文件」。
#
# 退出码：0 = 成功；1 = 失败

import argparse
import ftplib
import hashlib
import os
import posixpath
import shutil
import sqlite3
import sys
import tempfile
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

DEFAULT_EXCLUDES = (".well-known", ".htaccess", ".deploy")
DEFAULT_MANIFEST = ".deploy/manifest.sqlite"
MANIFEST_VERSION = 1
HASH_BUF = 1024 * 1024
HASH_WORKERS = 8
RETRY_TIMES = 3


def env_flag(name, default):
    raw = os.environ.get(name, "").strip().lower()
    if not raw:
        return default
    return raw in ("1", "true", "yes", "on")


def env_int(name, default):
    raw = os.environ.get(name, "").strip()
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError:
        print(f"! {name} 不是数字，改用默认值 {default}", file=sys.stderr, flush=True)
        return default


def human(size):
    if size < 1024:
        return f"{size} B"
    if size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"
    return f"{size / 1024 / 1024:.1f} MB"


def gmt_stamp(timestamp):
    """把 Unix 时间戳格式化成 FTP 的 UTC 时间串（MLSD / MDTM / MFMT 同格式）。"""
    return time.strftime("%Y%m%d%H%M%S", time.gmtime(timestamp))


def digest_file(path):
    """内容摘要；用 blake2b-256，比 sha256 快且摘要更短。"""
    digest = hashlib.blake2b(digest_size=32)
    with open(path, "rb") as fh:
        while True:
            chunk = fh.read(HASH_BUF)
            if not chunk:
                break
            digest.update(chunk)
    return digest.digest()


def join_remote(root, rel):
    base = root.rstrip("/")
    if not rel:
        return base or "/"
    return f"{base}/{rel}" if base else f"/{rel}"


def rel_join(rel_dir, name):
    return name if not rel_dir else f"{rel_dir}/{name}"


def dirs_of(rels):
    """从文件相对路径推出所有父目录，用于「该不该删这个远端目录」的判断。"""
    dirs = set()
    for rel in rels:
        parent = posixpath.dirname(rel)
        while parent:
            dirs.add(parent)
            parent = posixpath.dirname(parent)
    return dirs


# ---------------------------------------------------------------------------
# 本地扫描
# ---------------------------------------------------------------------------

def scan_local(root, excludes):
    """返回 {相对路径: {size, digest, path}}；相对路径统一用 / 分隔。"""
    found = {}
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = sorted(d for d in dirnames if d not in excludes)
        rel_dir = os.path.relpath(dirpath, root)
        rel_dir = "" if rel_dir == "." else rel_dir.replace(os.sep, "/")
        for name in filenames:
            found[rel_join(rel_dir, name)] = os.path.join(dirpath, name)

    def work(item):
        rel, path = item
        return rel, {"size": os.path.getsize(path), "digest": digest_file(path), "path": path}

    results = {}
    if found:
        with ThreadPoolExecutor(max_workers=min(HASH_WORKERS, len(found))) as pool:
            for rel, info in pool.map(work, found.items()):
                results[rel] = info
    return results


# ---------------------------------------------------------------------------
# 远端清单：远端才是权威状态，每轮部署先拉回来比对
# ---------------------------------------------------------------------------

class Manifest:
    """<remote>/.deploy/manifest.sqlite 的读写封装。"""

    def __init__(self, conn, path=None):
        self.conn = conn
        self.path = path
        self.rows = {}

    @classmethod
    def open(cls, path, remote_root):
        """打开拉回来的清单；任何不可用的情况都返回 None（当作首次部署）。"""
        if not path or not os.path.isfile(path) or os.path.getsize(path) == 0:
            return None
        conn = None
        try:
            conn = sqlite3.connect(path)
            conn.row_factory = sqlite3.Row
            if conn.execute("PRAGMA quick_check").fetchone()[0] != "ok":
                raise sqlite3.DatabaseError("quick_check 未通过")
            meta = dict(conn.execute("SELECT key, value FROM meta"))
            if int(meta.get("schema_version", 0)) != MANIFEST_VERSION:
                raise ValueError(f"版本不符（{meta.get('schema_version')} != {MANIFEST_VERSION}）")
            if meta.get("remote_root") != remote_root:
                raise ValueError(f"目标根不一致（{meta.get('remote_root')}）")
            manifest = cls(conn)
            for row in conn.execute("SELECT path, size, digest, remote_size, remote_mtime FROM files"):
                manifest.rows[row["path"]] = {
                    "size": row["size"],
                    "digest": row["digest"],
                    "remote_size": row["remote_size"],
                    "remote_mtime": row["remote_mtime"],
                }
            return manifest
        except (sqlite3.Error, OSError, ValueError) as exc:
            if conn is not None:
                conn.close()
            print(f"! 清单不可用（{exc}），按首次部署处理", flush=True)
            return None

    @classmethod
    def create(cls, path, remote_root):
        if os.path.exists(path):
            os.remove(path)  # 防御：绝不在已有文件上建表
        conn = sqlite3.connect(path)
        conn.execute("PRAGMA journal_mode=DELETE")
        conn.executescript(
            """
            CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
            CREATE TABLE files (
                path         TEXT PRIMARY KEY,
                size         INTEGER NOT NULL,
                digest       BLOB    NOT NULL,
                remote_size  INTEGER,
                remote_mtime TEXT
            ) WITHOUT ROWID;
            """
        )
        conn.executemany(
            "INSERT INTO meta (key, value) VALUES (?, ?)",
            [
                ("schema_version", str(MANIFEST_VERSION)),
                ("remote_root", remote_root),
                ("updated_at", time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())),
            ],
        )
        return cls(conn, path)

    def put(self, rel, size, digest, remote_size, remote_mtime):
        self.rows[rel] = {
            "size": size,
            "digest": digest,
            "remote_size": remote_size,
            "remote_mtime": remote_mtime,
        }

    def save(self):
        """落盘并关闭，之后整个文件会被原样上传，不留 -journal / -wal 残留。"""
        self.conn.execute("DELETE FROM files")
        self.conn.executemany(
            "INSERT INTO files (path, size, digest, remote_size, remote_mtime) VALUES (?, ?, ?, ?, ?)",
            [(rel, row["size"], row["digest"], row["remote_size"], row["remote_mtime"])
             for rel, row in sorted(self.rows.items())],
        )
        self.conn.commit()
        self.conn.close()
        self.conn = None


# ---------------------------------------------------------------------------
# 远端连接与操作
# ---------------------------------------------------------------------------

def connect(host, port, user, password, use_tls, passive, timeout):
    ftp = ftplib.FTP_TLS(timeout=timeout) if use_tls else ftplib.FTP(timeout=timeout)
    ftp.connect(host, port)
    ftp.login(user, password)
    if use_tls:
        ftp.prot_p()  # 保护数据通道
    ftp.set_pasv(passive)
    return ftp


class ConnPool:
    """FTP 控制连接不能跨线程共享：每个工作线程懒加载并复用自己的连接。"""

    def __init__(self, factory):
        self._factory = factory
        self._local = threading.local()
        self._lock = threading.Lock()
        self._created = []

    def get(self):
        conn = getattr(self._local, "conn", None)
        if conn is None:
            conn = self._factory()
            self._local.conn = conn
            with self._lock:
                self._created.append(conn)
        return conn

    def drop(self):
        conn = getattr(self._local, "conn", None)
        if conn is not None:
            try:
                conn.close()
            except Exception:
                pass
        self._local.conn = None

    def close_all(self):
        with self._lock:
            conns, self._created = self._created, []
        for conn in conns:
            try:
                conn.quit()
            except Exception:
                try:
                    conn.close()
                except Exception:
                    pass


def probe_concurrency(factory, want, already_open=1):
    """预探测服务器允许几条并发连接（Pure-FTPd 默认 MaxClientsPerIP 8）。

    多开一条试探连接，能开出来的数量就是本轮的实际上限；开不出来就降级。
    """
    if want <= 1:
        return 1
    opened = []
    try:
        for _ in range(want - already_open):
            try:
                opened.append(factory())
            except (ftplib.Error, OSError):
                break
        return max(1, min(want, already_open + len(opened)))
    finally:
        for conn in opened:
            try:
                conn.close()
            except Exception:
                pass


class Remote:
    """远端目录操作。"""

    def __init__(self, main, pool, root, dry_run=False, excludes=()):
        self.main = main
        self.pool = pool
        self.root = root
        self.dry_run = dry_run
        self.excludes = set(excludes)
        self._dir_lock = threading.Lock()
        self._dirs = set()
        self.mkdirs = 0

    # ---------------- 列目录 ----------------

    def list_dir(self, path):
        """返回 {名称: (类型, 大小, mtime UTC)}；目录不存在时返回空字典。"""
        items = {}
        try:
            for name, facts in self.main.mlsd(path):
                if name in (".", ".."):
                    continue
                kind = "dir" if facts.get("type") == "dir" else "file"
                items[name] = (kind, int(facts.get("size") or 0), facts.get("modify"))
            return items
        except (ftplib.error_perm, ftplib.error_proto, AttributeError, OSError):
            pass

        # 回退：NLST + 逐个试探类型（拿不到 mtime，漂移检测只比 size）
        try:
            names = self.main.nlst(path)
        except ftplib.error_perm:
            return items
        for raw in names:
            name = posixpath.basename(raw.rstrip("/"))
            if not name or name in (".", ".."):
                continue
            full = join_remote(path, name)
            if self.is_dir(full):
                items[name] = ("dir", 0, None)
            else:
                try:
                    size = self.main.size(full)
                except ftplib.Error:
                    size = -1
                items[name] = ("file", size if size is not None else -1, None)
        return items

    def is_dir(self, path):
        cwd = self.main.pwd()
        try:
            self.main.cwd(path)
            return True
        except ftplib.error_perm:
            return False
        finally:
            try:
                self.main.cwd(cwd)
            except ftplib.Error:
                pass

    def scan_tree(self):
        """递归扫远端；返回 {相对路径: (类型, 大小, mtime)}。"""
        result = {}
        stack = [("", self.root)]
        while stack:
            rel_dir, abs_dir = stack.pop()
            for name, (kind, size, modify) in self.list_dir(abs_dir).items():
                rel = rel_join(rel_dir, name)
                if posixpath.basename(rel) in self.excludes:
                    continue  # 保留项：不参与比对，也不会被删
                result[rel] = (kind, size, modify)
                if kind == "dir":
                    stack.append((rel, join_remote(self.root, rel)))
        return result

    # ---------------- 建目录 ----------------

    def ensure_dir(self, rel_dir):
        """幂等建目录；结果缓存起来，避免并发阶段反复 cwd 探测。"""
        rel_dir = rel_dir.strip("/")
        if not rel_dir:
            return
        parts = rel_dir.split("/")
        for idx in range(1, len(parts) + 1):
            current = "/".join(parts[:idx])
            with self._dir_lock:
                if current in self._dirs:
                    continue
            full = join_remote(self.root, current)
            if self.dry_run:
                print(f"+ mkdir {full}", flush=True)
            else:
                try:
                    self.main.mkd(full)
                    self.mkdirs += 1
                    print(f"+ mkdir {full}", flush=True)
                except ftplib.error_perm:
                    pass  # 已存在
            with self._dir_lock:
                self._dirs.add(current)

    def prepare_dirs(self, rels):
        """上传前串行把目录建好，避免并发阶段互相踩 mkdir。"""
        parents = {posixpath.dirname(rel) for rel in rels if posixpath.dirname(rel)}
        for rel_dir in sorted(parents, key=lambda p: (p.count("/"), p)):
            self.ensure_dir(rel_dir)

    # ---------------- 写操作 ----------------

    def put_file(self, rel, local_path, stamp):
        """上传单个文件，返回 (远端 size, 远端 mtime)。"""
        ftp = self.pool.get()
        remote_path = join_remote(self.root, rel)
        with open(local_path, "rb") as fh:
            ftp.storbinary(f"STOR {remote_path}", fh)
        return os.path.getsize(local_path), self.set_mtime(ftp, remote_path, stamp)

    def set_mtime(self, ftp, remote_path, stamp):
        """MFMT 是 RFC 3659 扩展，Pure-FTPd 的 FEAT 里声明支持。

        用本地的文件 mtime 打标，下一轮 MLSD 拿到的 modify 就是可预期的确定值，
        不必回读；失败时返回 None，漂移检测自动退化为只比 size。
        """
        if not stamp:
            return None
        try:
            ftp.sendcmd(f"MFMT {stamp} {remote_path}")
            return stamp
        except ftplib.Error:
            return None

    def delete_file(self, rel):
        self.pool.get().delete(join_remote(self.root, rel))

    def rmdir(self, rel):
        try:
            self.main.rmd(join_remote(self.root, rel))
            return True
        except ftplib.error_perm:
            return False  # 非空或不允许


def with_retry(action, pool, label):
    """网络类错误（4xx / 断连）换连接重试；5xx 是永久错误，直接抛。"""
    last = None
    for attempt in range(RETRY_TIMES):
        try:
            return action()
        except (ftplib.error_temp, EOFError, OSError) as exc:
            last = exc
            pool.drop()
            if attempt < RETRY_TIMES - 1:
                delay = 1.5 * (attempt + 1)
                print(f"! {label} 失败（{exc}），{delay:.1f}s 后重试", file=sys.stderr, flush=True)
                time.sleep(delay)
    raise last


# ---------------------------------------------------------------------------
# 比对
# ---------------------------------------------------------------------------

def diff(local, manifest, remote, delete=True, force=False, trust_size=False, excludes=(),
         local_dirs=()):
    """返回 (要上传, 未变化, 要删除)。"""
    old = manifest.rows if manifest else {}
    known_dirs = set(local_dirs)
    upload, unchanged = [], []
    for rel, info in local.items():
        if force:
            upload.append(rel)
            continue
        row = old.get(rel)
        if row is None:
            # 没有清单时的迁移路径：远端同大小就信任（哈希资源改名即换内容）
            meta = remote.get(rel)
            if trust_size and meta and meta[0] == "file" and meta[1] == info["size"]:
                unchanged.append(rel)
            else:
                upload.append(rel)
            continue
        if row["size"] != info["size"] or row["digest"] != info["digest"]:
            upload.append(rel)
            continue
        meta = remote.get(rel)
        if meta is None or meta[0] != "file":
            upload.append(rel)  # 远端丢了 / 变成了目录
            continue
        if meta[1] != row["remote_size"]:
            upload.append(rel)  # 远端大小对不上
            continue
        if row["remote_mtime"] and meta[2] != row["remote_mtime"]:
            upload.append(rel)  # 远端 mtime 对不上：被人工改过或丢过
            continue
        unchanged.append(rel)

    to_delete = []
    if delete:
        for rel, (kind, _size, _modify) in remote.items():
            if rel in local or posixpath.basename(rel) in excludes:
                continue
            if kind == "dir" and rel in known_dirs:
                continue  # 本地还有文件在这个目录下，目录本身要留着
            to_delete.append(rel)
    return upload, unchanged, to_delete


# ---------------------------------------------------------------------------
# 主流程
# ---------------------------------------------------------------------------

def resolve_local_dir(local):
    """兼容 artifact 下载后多一层同名目录的情况（build/build/）。"""
    if os.path.isdir(local):
        return local
    nested = os.path.join(local, os.path.basename(local.rstrip("/")))
    if os.path.isdir(nested):
        print(f"! 未找到 {local}/，改用 {nested}/", flush=True)
        return nested
    return local


def pull_manifest(remote, manifest_rel, tmp_dir):
    """把远端清单拉到本地临时目录；拉不到返回 None。"""
    if not manifest_rel:
        return None
    target = join_remote(remote.root, manifest_rel)
    local_copy = os.path.join(tmp_dir, "manifest.pulled.sqlite")
    try:
        with open(local_copy, "wb") as fh:
            remote.main.retrbinary(f"RETR {target}", fh.write)
    except (ftplib.Error, OSError) as exc:
        print(f"==> 远端没有清单（{exc}）", flush=True)
        return None
    return Manifest.open(local_copy, remote.root)


def push_manifest(remote, manifest_rel, manifest):
    """新清单先传 .tmp，再 RNFR/RNTO 改名，避免半截文件被下一轮当成有效清单。"""
    manifest.save()
    staged = manifest.path

    remote_dir = posixpath.dirname(manifest_rel)
    if remote_dir:
        remote.ensure_dir(remote_dir)
    final = join_remote(remote.root, manifest_rel)
    tmp_name = f"{final}.tmp"
    with open(staged, "rb") as fh:
        remote.main.storbinary(f"STOR {tmp_name}", fh)
    try:
        remote.main.rename(tmp_name, final)
    except ftplib.Error:
        # 少数服务器不允许覆盖式改名：先删旧的再改名
        try:
            remote.main.delete(final)
        except ftplib.Error:
            pass
        remote.main.rename(tmp_name, final)
    return os.path.getsize(staged)


def deploy(args):
    use_tls = not args.no_tls and env_flag("FTP_TLS", True)
    delete = not args.no_delete and env_flag("FTP_DELETE", True)
    force = args.force or env_flag("FTP_FORCE", False)
    trust_size = args.trust_size or env_flag("FTP_TRUST_SIZE", False)
    dry_run = args.dry_run or env_flag("FTP_DRY_RUN", False)
    timeout = env_int("FTP_TIMEOUT", 60)
    excludes = [item.strip() for item in
                os.environ.get("FTP_EXCLUDE", ",".join(DEFAULT_EXCLUDES)).split(",") if item.strip()]

    if not args.host:
        print("! 缺少 FTP_HOST", file=sys.stderr)
        return 1

    local = resolve_local_dir(args.local)
    if not os.path.isdir(local):
        print(f"! 本地目录不存在: {local}", file=sys.stderr)
        return 1

    remote_root = args.remote.strip() or "/"
    if not remote_root.startswith("/"):
        remote_root = f"/{remote_root}"
    manifest_rel = (args.manifest or "").strip().lstrip("/")
    concurrency = max(1, args.concurrency)
    if manifest_rel:
        excludes.append(posixpath.basename(manifest_rel))

    shown_host = "<已隐藏>" if os.environ.get("FTP_HIDE_HOST") == "1" else args.host
    print(f"==> 目标: {shown_host}:{args.port}{remote_root} | TLS: {use_tls} | 被动: {not args.active}")
    print(f"==> 本地: {os.path.abspath(local)} | 删除多余: {delete} | 演练: {dry_run}")
    print(f"==> 清单: {manifest_rel or '（已关闭，按大小比对）'} | 并发: {concurrency} | 强制: {force}")

    factory = lambda: connect(args.host, args.port, args.user, args.password,
                              use_tls, not args.active, timeout)
    ftp = factory()
    pool = ConnPool(factory)
    tmp_dir = tempfile.mkdtemp(prefix="deploy-ftp-")
    try:
        remote = Remote(ftp, pool, remote_root, dry_run=dry_run, excludes=excludes)

        # 1) 本地扫描（内容摘要） + 2) 拉回远端清单 + 3) 远端实况
        local_files = scan_local(local, excludes)
        total_bytes = sum(info["size"] for info in local_files.values())
        print(f"==> 本地 {len(local_files)} 个文件，{human(total_bytes)}")

        manifest = pull_manifest(remote, manifest_rel, tmp_dir)
        if manifest is None and manifest_rel and not force:
            note = "，本次信任远端同大小（FTP_TRUST_SIZE）" if trust_size else "，本次将全量上传"
            print(f"==> 无可用清单{note}", flush=True)

        remote_files = remote.scan_tree()
        print(f"==> 远端 {len(remote_files)} 个条目")

        # 4) 比对
        upload, unchanged, to_delete = diff(
            local_files, manifest, remote_files,
            delete=delete, force=force, trust_size=trust_size, excludes=excludes,
            local_dirs=dirs_of(local_files))
        upload_bytes = sum(local_files[rel]["size"] for rel in upload)
        print(f"==> 比对：上传 {len(upload)} 个（{human(upload_bytes)}），"
              f"未变化 {len(unchanged)} 个，删除 {len(to_delete)} 个")

        if dry_run:
            for rel in upload:
                print(f"+ {join_remote(remote_root, rel)} ({human(local_files[rel]['size'])})")
            for rel in to_delete:
                suffix = "/" if remote_files[rel][0] == "dir" else ""
                print(f"- {join_remote(remote_root, rel)}{suffix}")
            print("==> 演练结束，未做任何写操作")
            return 0

        # 5) 并行上传
        remote.prepare_dirs(upload)
        uploaded_facts = {}
        uploaded_bytes = 0
        if upload:
            effective = probe_concurrency(factory, concurrency)
            if effective < concurrency:
                print(f"! 服务器只接受 {effective} 条并发连接，本轮降级使用", flush=True)

            def do_one(rel):
                info = local_files[rel]
                stamp = gmt_stamp(os.path.getmtime(info["path"]))
                remote_size, remote_mtime = with_retry(
                    lambda: remote.put_file(rel, info["path"], stamp), pool, f"上传 {rel}")
                return rel, remote_size, remote_mtime

            done = 0
            with ThreadPoolExecutor(max_workers=effective) as workers:
                futures = [workers.submit(do_one, rel) for rel in upload]
                for future in as_completed(futures):
                    rel, remote_size, remote_mtime = future.result()  # 失败直接抛，不再写清单
                    uploaded_facts[rel] = (remote_size, remote_mtime)
                    uploaded_bytes += local_files[rel]["size"]
                    done += 1
                    # 逐文件打印（在提交线程里输出，行不会互相穿插），便于事后审计
                    print(f"+ {join_remote(remote_root, rel)} "
                          f"({human(local_files[rel]['size'])})", flush=True)
                    if done % 100 == 0 or done == len(upload):
                        print(f"    ... {done}/{len(upload)}", flush=True)

        # 6) 删除多余（文件并行、目录自底向上）
        if delete and to_delete:
            dead_files = [rel for rel in to_delete if remote_files[rel][0] != "dir"]
            dead_dirs = [rel for rel in to_delete if remote_files[rel][0] == "dir"]
            def remove_one(rel):
                with_retry(lambda: remote.delete_file(rel), pool, f"删除 {rel}")
                return rel

            if dead_files:
                with ThreadPoolExecutor(max_workers=min(concurrency, len(dead_files))) as workers:
                    futures = [workers.submit(remove_one, rel) for rel in dead_files]
                    for future in as_completed(futures):
                        print(f"- {join_remote(remote_root, future.result())}", flush=True)
            removed_dirs = 0
            for rel in sorted(dead_dirs, key=lambda p: p.count("/"), reverse=True):
                if remote.rmdir(rel):
                    removed_dirs += 1
                    print(f"- {join_remote(remote_root, rel)}/ (空目录)", flush=True)
            print(f"==> 已删除 {len(dead_files) + removed_dirs} 个条目"
                  f"（文件 {len(dead_files)}，目录 {removed_dirs}）")

        # 7) 发布新清单（整轮成功才更新，失败保留旧清单供下次重传）
        if manifest_rel:
            new_manifest = Manifest.create(os.path.join(tmp_dir, "manifest.new.sqlite"), remote_root)
            for rel, info in local_files.items():
                if rel in uploaded_facts:
                    # 本轮刚传的：直接记录我们 MFMT 打上去的确定值
                    remote_size, remote_mtime = uploaded_facts[rel]
                else:
                    # 未上传的：沿用清单里的远端事实，没有则用本轮扫描所见
                    row = (manifest.rows.get(rel) if manifest else None) or {}
                    meta = remote_files.get(rel)
                    remote_size = row.get("remote_size", meta[1] if meta else None)
                    remote_mtime = row.get("remote_mtime", meta[2] if meta else None)
                new_manifest.put(rel, info["size"], info["digest"], remote_size, remote_mtime)
            size = push_manifest(remote, manifest_rel, new_manifest)
            print(f"==> 清单已更新（{human(size)}，{len(new_manifest.rows)} 条记录）")

        print(f"✅ 部署完成：上传 {len(upload)} 个（{human(uploaded_bytes)}），"
              f"跳过 {len(unchanged)} 个，删除 {len(to_delete)} 个")
        return 0
    finally:
        pool.close_all()
        shutil.rmtree(tmp_dir, ignore_errors=True)
        try:
            ftp.quit()
        except ftplib.Error:
            try:
                ftp.close()
            except Exception:
                pass


def main(argv=None):
    parser = argparse.ArgumentParser(description="通过 FTP/FTPS 增量部署静态站点产物")
    parser.add_argument("--local", default=os.environ.get("FTP_LOCAL", "build"),
                        help="本地待上传目录，默认 build")
    parser.add_argument("--host", default=os.environ.get("FTP_HOST"), help="FTP 主机")
    parser.add_argument("--port", type=int, default=int(os.environ.get("FTP_PORT") or 21))
    parser.add_argument("--user", default=os.environ.get("FTP_USER", ""))
    parser.add_argument("--password", default=os.environ.get("FTP_PASSWORD", ""))
    parser.add_argument("--remote", default=os.environ.get("FTP_REMOTE", "/"),
                        help="远端目录，默认 /")
    parser.add_argument("--manifest", default=os.environ.get("FTP_MANIFEST", DEFAULT_MANIFEST),
                        help=f"远端清单路径，默认 {DEFAULT_MANIFEST}；空字符串 = 关闭清单")
    parser.add_argument("--concurrency", type=int, default=env_int("FTP_CONCURRENCY", 5),
                        help="并发连接数，默认 5")
    parser.add_argument("--no-tls", action="store_true", help="使用明文 FTP（默认 FTPS）")
    parser.add_argument("--active", action="store_true", help="主动模式（默认被动）")
    parser.add_argument("--no-delete", action="store_true", help="不删除远端多余文件")
    parser.add_argument("--trust-size", action="store_true",
                        help="没有清单时，信任远端同大小即同内容（首次迁移用）")
    parser.add_argument("--force", action="store_true", help="忽略清单，全部重传")
    parser.add_argument("--dry-run", action="store_true", help="只打印动作，不写任何东西")
    args = parser.parse_args(argv)

    try:
        return deploy(args)
    except ftplib.error_perm as exc:
        print(f"! 部署失败（服务器拒绝，未更新清单，下次会重传）: {exc}", file=sys.stderr, flush=True)
        return 1
    except (ftplib.Error, OSError, sqlite3.Error) as exc:
        print(f"! 部署失败（未更新清单，下次会重传）: {exc}", file=sys.stderr, flush=True)
        return 1
    except KeyboardInterrupt:
        print("! 已中断（未更新清单）", file=sys.stderr, flush=True)
        return 1


if __name__ == "__main__":
    sys.exit(main())
