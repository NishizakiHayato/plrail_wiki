---
sidebar_position: 1
title: ETCS DMI 安卓中国改进版
description: 本文提供 SimRail ETCS DMI 安卓中国改进版（基于 cesarBLG/ETCS 修改）的下载地址与使用教程，包括添加中文界面与 ETCS EVC 选择功能，以及 settings.conf 中 DMI_Listen 配置、防火墙端口放通、局域网连接与更换 EVC 的完整步骤。
keywords: [SimRail, ETCS, DMI, 安卓, Android, EVC, 中国改进版, 教程]
tags: [SimRail, ETCS, 实用工具]
slug: /tools/etcs-dmi-android
---

## 简介

SimRail 中的 ETCS 来源于 [cesarBLG/ETCS](https://github.com/cesarBLG/ETCS)，该仓库中同时包含一个安卓端的 ETCS DMI。原版与 SimRail 配合使用时体验不佳，因此在其基础上做了两点改动：

- 添加中文支持
- 增加 ETCS EVC 的选择功能

修改后的源码放在 [PLRail/ETCS（信越铁道）](https://code.shinetsurailway.net/PLRail/ETCS)，欢迎自行审查与编译。

## 下载

- 信越铁道 FTP：[ETCS-1.0.0.zip](https://ftp.shinetsurailway.net/public/Game/SimRail/ETCS-1.0.0.zip)
- Netlab 网盘：[下载地址](https://pan.netlab.ac.cn/disk/s/4qLtqoj7Aqj?pwd=118711&domainId=bj26223)，密码 `118711`
- 原始发布页（含本站附件）：[SIMRAIL ETCS DMI 安卓中国改进版发布（附教程）](https://www.plrail.com/post/39.html)

## 教程

### 1. 修改 SimRail 配置

打开文件资源管理器，进入 `%AppData%\..\LocalLow\SimKol\SimRail`，找到 `settings.conf`，用记事本打开。

搜索 `DMI_Listen`，在其后方添加 `0.0.0.0:5070`，即让 DMI 监听本机的 5070 端口，供局域网内的手机连接。

![在 settings.conf 中将 DMI_Listen 设为 0.0.0.0:5070](pathname:///img/simrail/tools/etcs-dmi/dmi-listen.webp)

### 2. 防火墙放通端口

在「高级安全 Windows Defender 防火墙」中，右键「入站规则」→「新建规则」。

![在入站规则上右键新建规则](pathname:///img/simrail/tools/etcs-dmi/firewall-inbound-rule.webp)

规则类型选择「端口」。

![规则类型选择端口](pathname:///img/simrail/tools/etcs-dmi/firewall-rule-type.webp)

协议选择「TCP」，端口选择「特定本地端口」并填入 `5070`。

![协议选 TCP、本地端口填 5070](pathname:///img/simrail/tools/etcs-dmi/firewall-port.webp)

之后一路「下一步」，最后给规则起一个容易记住的名字（例如 `ETCS EVC`）。

### 3. 连接测试

在 SimRail 中进入带 ETCS 的单人或联机场景，打开安卓 APP。

选择「连接远程 EVC」：

- 手机与电脑在同一网段时，可点击「扫描局域网」自动获取 IP 地址
- 不在同一网段时，手动输入电脑的 IP 与端口（不填端口时默认使用 5070）

![APP 的 EVC 连接方式窗口](pathname:///img/simrail/tools/etcs-dmi/app-connect.webp)

### 4. 更换 EVC 设置

长按屏幕左上角，即可重新弹出 EVC 配置窗口，设置完成后重启 APP 生效。

![长按屏幕左上角唤起 EVC 配置窗口](pathname:///img/simrail/tools/etcs-dmi/app-hold-corner.webp)
