---
sidebar_position: 55
title: LCS Starzyny（斯塔日内）
description: 本文介绍 SimRail（模拟铁路）中 Starzyny（斯塔日内）与 Sprowa（斯布罗瓦）车站的信息，涵盖两站的位置、调度面板、CCTV 摄像头及其所控道口、无线电频道，以及解锁本站所需的调度时长与车站难度（3 星）。
keywords: [SimRail, Starzyny, 斯塔日内, Sprowa, 斯布罗瓦, 车站, 调度面板, CCTV, 无线电频道]
tags: [SimRail, 车站]
slug: /station/station_info/starzyny
---

#### Starzyny

| 站名 | 中文名 | 电报码 | 游戏内部编号 |
| --- | --- | --- | --- |
| Starzyny | 斯塔日内 | St | Str |

#### Sprowa

| 站名 | 中文名 | 电报码 | 游戏内部编号 |
| --- | --- | --- | --- |
| Sprowa | 斯布罗瓦 | Sp | Sp |

## 位置

![斯塔日内站位置示意一](/img/simrail/station/station_info/starzyny/location-1.webp)

![斯塔日内站位置示意二](/img/simrail/station/station_info/starzyny/location-2.webp)

LCS斯塔日内线路所（Starzyny）是从中央铁路干线前往科兹武夫（Kozłów）时的第一站。列车可以从这里转线到CMK前往华沙，或者向西经由科涅茨波尔（Koniecpol）前往琴斯托霍瓦（Częstochowa）。在此可远程控制临近的斯布罗瓦线路所（Sprowa）。

## 描述

::::::info

你需要**12小时**调度时长来解锁本站

::::::

::::::info

**LCS斯塔日内**的难度为:★★★☆☆(3星)

::::::

### 调度面板

<details>
<summary>基本</summary>

![斯塔日内站调度面板（基本视图一）](/img/simrail/station/station_info/starzyny/panel-basic-1.webp)

![斯塔日内站调度面板（基本视图二）](/img/simrail/station/station_info/starzyny/panel-basic-2.webp)

</details>

<details>
<summary>道岔限速</summary>

![斯塔日内站道岔限速一](/img/simrail/station/station_info/starzyny/switch-speed-limit-1.webp)

![斯塔日内站道岔限速二](/img/simrail/station/station_info/starzyny/switch-speed-limit-2.webp)

</details>

### CCTV

LCS斯塔日内配备了两台CCTV设备，两台都在斯布罗瓦。

<details>
<summary>SP_17.988</summary>

![斯塔日内站 CCTV SP_17.988](/img/simrail/station/station_info/starzyny/cctv-sp-17-988.webp)

CCTV名称：SP_17.988

控制道口：否

</details>

<details>
<summary>SP_A-B</summary>

![斯塔日内站 CCTV SP_A-B](/img/simrail/station/station_info/starzyny/cctv-sp-a-b.webp)

CCTV名称：SP_A-B

控制道口：否

</details>

### 无线电频道

| 频道 | 线路 |
| --- | --- |
| R2 | LK 1 LK 570（往普萨雷方向） |
| R5 | LK 64 LK 570（往斯塔日内方向） |

### 特别提示

::::::warning

LK64线自斯塔日内（Starzyny）往科兹武夫（Kozłów）方向是全SimRail中最长的站间闭塞区域之一，其中科兹武夫（Kozłów）和斯布罗瓦（Sprowa）间为***17km675m***，而斯布罗瓦（Sprowa）和斯塔日内（Starzyny）间则为***14km895m***，其中**没有任何自动闭塞信号机**划分闭塞区间。这可以在[SimRail中文地图](https://map.simrail.cn/)中更加直观的看到。

<span style={{ color: 'red' }}>**因此如果计划进行非常用方向行车（左道行车）必须认真查看EDR，确保不会阻碍反向的列车运行，尤其是当计划进行非常用方向行车的列车具有较低的Vmax速度时。**</span>

::::::

::::::danger

**危险！请留意死锁的可能性。**

![斯塔日内站img](/img/simrail/station/station_info/starzyny/img.webp)

如上图所示，此时各列车互相阻碍，谁也无法继续运行，因此请特别留意，不要随意同意闭塞和左道行车请求，同意前必须检查EDR上的运行方向，确保不会因此发生死锁。

::::::

::::::info

本文在[LCS Starzyny的官方Wiki](https://wiki.simrail.eu/en/Stations/Poland/Relay-interlocking/LCS-Starzyny)的基础上，翻译和修改而成。

::::::
