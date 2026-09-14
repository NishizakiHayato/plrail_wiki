#!/usr/bin/env python3
#
# 通过 FTP / FTPS 把构建产物同步到远程主机
#
# 用法：
#   python3 scripts/deploy-ftp.py                       # 默认同步 build/ 到 FTP_REMOTE
#   python3 scripts/deploy-ftp.py --local build --remote /public_html
#   FTP_DRY_RUN=1 python3 scripts/deploy-ftp.py         # 只打印将要执行的动作
#
# 环境变量（命令行参数优先）：
#   FTP_HOST        主机名，必填
#   FTP_USER        用户名
#   FTP_PASSWORD    密码
#   FTP_PORT        端口，默认 21
#   FTP_REMOTE      远端目录，默认 /
#   FTP_TLS         1 = 显式 FTPS（默认），0 = 明文 FTP
#   FTP_PASSIVE     1 = 被动模式（默认）
#   FTP_DELETE      1 = 删除远端多余文件（默认），0 = 只增不改
#   FTP_EXCLUDE     删除时保留的远端条目，逗号分隔，默认 .well-known,.htaccess
#   FTP_FORCE       1 = 忽略大小比较，全部重传
#   FTP_DRY_RUN     1 = 演练，不做任何写操作
#
# 说明：
#   - 只使用标准库，CI 上无需额外安装依赖。
#   - 判断是否需要重传用「远端文件大小」比较，Docusaurus 的静态资源文件名带内容
#     哈希，同大小即视为同内容。需要强制全量重传时用 FTP_FORCE=1。
#
# 退出码：0 = 成功；1 = 失败

import argparse
import ftplib
import os
import posixpath
import sys

DEFAULT_EXCLUDES = (".well-known", ".htaccess")


def env_flag(name, default):
    raw = os.environ.get(name, "").strip().lower()
    if not raw:
        return default
    return raw in ("1", "true", "yes", "on")


def human(size):
    if size < 1024:
        return f"{size} B"
    if size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"
    return f"{size / 1024 / 1024:.1f} MB"


def connect(host, port, user, password, use_tls, passive, timeout=30):
    ftp = ftplib.FTP_TLS(timeout=timeout) if use_tls else ftplib.FTP(timeout=timeout)
    ftp.connect(host, port)
    ftp.login(user, password)
    if use_tls:
        ftp.prot_p()  # 保护数据通道
    ftp.set_pasv(passive)
    return ftp


class Syncer:
    """把本地目录递归同步到远端目录（镜像，可选删除多余文件）。"""

    def __init__(self, ftp, dry_run=False, delete=True, excludes=(), force=False):
        self.ftp = ftp
        self.dry_run = dry_run
        self.delete = delete
        self.excludes = set(excludes)
        self.force = force
        self.uploaded = 0
        self.skipped = 0
        self.deleted = 0

    # ---------------- 远端操作 ----------------

    def is_remote_dir(self, path):
        cwd = self.ftp.pwd()
        try:
            self.ftp.cwd(path)
            return True
        except ftplib.error_perm:
            return False
        finally:
            try:
                self.ftp.cwd(cwd)
            except ftplib.Error:
                pass

    def ensure_dir(self, path):
        path = path.rstrip("/") or "/"
        if path == "/":
            return
        if self.is_remote_dir(path):
            return
        self.ensure_dir(posixpath.dirname(path) or "/")
        print(f"+ mkdir {path}", flush=True)
        if not self.dry_run:
            try:
                self.ftp.mkd(path)
            except ftplib.error_perm:
                pass  # 已存在

    def list_remote(self, path):
        """返回 {名称: (类型, 大小)}，目录不存在时返回空字典。"""
        items = {}
        try:
            for name, facts in self.ftp.mlsd(path):
                if name in (".", ".."):
                    continue
                kind = "dir" if facts.get("type") == "dir" else "file"
                items[name] = (kind, int(facts.get("size") or 0))
            return items
        except (ftplib.error_perm, ftplib.error_proto, AttributeError, OSError):
            pass

        # 回退：NLST + 逐个试探类型
        try:
            names = self.ftp.nlst(path)
        except ftplib.error_perm:
            return items
        for raw in names:
            name = posixpath.basename(raw.rstrip("/"))
            if not name or name in (".", ".."):
                continue
            full = self.join(path, name)
            if self.is_remote_dir(full):
                items[name] = ("dir", 0)
            else:
                try:
                    size = self.ftp.size(full)
                except ftplib.Error:
                    size = -1
                items[name] = ("file", size if size is not None else -1)
        return items

    @staticmethod
    def join(path, name):
        return f"/{name}" if (path.rstrip("/") or "/") == "/" else f"{path.rstrip('/')}/{name}"

    # ---------------- 同步 ----------------

    def sync_dir(self, local_dir, remote_dir):
        self.ensure_dir(remote_dir)
        remote_items = self.list_remote(remote_dir)
        try:
            names = sorted(os.listdir(local_dir))
        except FileNotFoundError:
            print(f"! 本地目录不存在，跳过: {local_dir}", file=sys.stderr, flush=True)
            return

        local_names = set()
        for name in names:
            local_path = os.path.join(local_dir, name)
            remote_path = self.join(remote_dir, name)
            if os.path.isdir(local_path):
                local_names.add(name)
                self.sync_dir(local_path, remote_path)
            elif os.path.isfile(local_path):
                local_names.add(name)
                self.upload_file(local_path, remote_path, remote_items.get(name))

        if not self.delete:
            return
        for name, (kind, _size) in remote_items.items():
            if name in local_names or name in self.excludes:
                continue
            remote_path = self.join(remote_dir, name)
            if kind == "dir":
                self.remove_tree(remote_path)
            else:
                self.remove_file(remote_path)

    def upload_file(self, local_path, remote_path, remote_meta):
        size = os.path.getsize(local_path)
        if (
            not self.force
            and remote_meta is not None
            and remote_meta[0] == "file"
            and remote_meta[1] == size
        ):
            self.skipped += 1
            return
        print(f"+ {remote_path} ({human(size)})", flush=True)
        if self.dry_run:
            self.uploaded += 1
            return
        with open(local_path, "rb") as fh:
            self.ftp.storbinary(f"STOR {remote_path}", fh)
        self.uploaded += 1

    def remove_file(self, remote_path):
        print(f"- {remote_path}", flush=True)
        self.deleted += 1
        if self.dry_run:
            return
        try:
            self.ftp.delete(remote_path)
        except ftplib.error_perm as exc:
            print(f"! 删除失败: {remote_path}: {exc}", file=sys.stderr, flush=True)

    def remove_tree(self, remote_path):
        for name, (kind, _size) in self.list_remote(remote_path).items():
            child = self.join(remote_path, name)
            if kind == "dir":
                self.remove_tree(child)
            else:
                self.remove_file(child)
        print(f"- {remote_path}/ (空目录)", flush=True)
        self.deleted += 1
        if self.dry_run:
            return
        try:
            self.ftp.rmd(remote_path)
        except ftplib.error_perm as exc:
            print(f"! 删除目录失败: {remote_path}: {exc}", file=sys.stderr, flush=True)


def resolve_local_dir(local):
    """兼容 artifact 下载后多一层同名目录的情况（build/build/）。"""
    if os.path.isdir(local):
        return local
    nested = os.path.join(local, os.path.basename(local.rstrip("/")))
    if os.path.isdir(nested):
        print(f"! 未找到 {local}/，改用 {nested}/", flush=True)
        return nested
    return local


def main(argv=None):
    parser = argparse.ArgumentParser(description="通过 FTP/FTPS 部署静态站点产物")
    parser.add_argument("--local", default=os.environ.get("FTP_LOCAL", "build"),
                        help="本地待上传目录，默认 build")
    parser.add_argument("--host", default=os.environ.get("FTP_HOST"), help="FTP 主机")
    parser.add_argument("--port", type=int, default=int(os.environ.get("FTP_PORT") or 21))
    parser.add_argument("--user", default=os.environ.get("FTP_USER", ""))
    parser.add_argument("--password", default=os.environ.get("FTP_PASSWORD", ""))
    parser.add_argument("--remote", default=os.environ.get("FTP_REMOTE", "/"),
                        help="远端目录，默认 /")
    parser.add_argument("--no-tls", action="store_true", help="使用明文 FTP（默认 FTPS）")
    parser.add_argument("--active", action="store_true", help="主动模式（默认被动）")
    parser.add_argument("--no-delete", action="store_true", help="不删除远端多余文件")
    parser.add_argument("--force", action="store_true", help="忽略大小比较，全部重传")
    parser.add_argument("--dry-run", action="store_true", help="只打印动作，不上传")
    args = parser.parse_args(argv)

    use_tls = not args.no_tls and env_flag("FTP_TLS", True)
    delete = not args.no_delete and env_flag("FTP_DELETE", True)
    force = args.force or env_flag("FTP_FORCE", False)
    dry_run = args.dry_run or env_flag("FTP_DRY_RUN", False)
    excludes = [item.strip() for item in
                os.environ.get("FTP_EXCLUDE", ",".join(DEFAULT_EXCLUDES)).split(",") if item.strip()]

    if not args.host:
        print("! 缺少 FTP_HOST", file=sys.stderr)
        return 1

    local = resolve_local_dir(args.local)
    if not os.path.isdir(local):
        print(f"! 本地目录不存在: {local}", file=sys.stderr)
        return 1

    remote = args.remote.strip() or "/"
    if not remote.startswith("/"):
        remote = f"/{remote}"

    print(f"==> 目标: {args.host}:{args.port}{remote} | TLS: {use_tls} | 被动: {not args.active}")
    print(f"==> 本地: {os.path.abspath(local)} | 删除多余文件: {delete} | 演练: {dry_run}")

    ftp = connect(args.host, args.port, args.user, args.password,
                  use_tls, not args.active)
    try:
        syncer = Syncer(ftp, dry_run=dry_run, delete=delete, excludes=excludes, force=force)
        syncer.sync_dir(local, remote)
        print(f"✅ 部署完成：上传 {syncer.uploaded} 个，跳过 {syncer.skipped} 个，删除 {syncer.deleted} 个")
    finally:
        try:
            ftp.quit()
        except ftplib.Error:
            ftp.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
