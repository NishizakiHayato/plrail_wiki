---
sidebar_position: 1
title: 110Ac - Bc
description: 本文介绍 SimRail（模拟铁路）中 110Ac（Bc）型卧铺客车的信息，涵盖该车的简介、技术数据（车长、车宽、整备质量、轴式、最高运行时速等），Bcdu、Bc9ou、Bcwxz 等变体及其铁路运输主体、UIC 编号与 LUA 生成代码，以及制动模式与制动重量。
keywords: [SimRail, 110Ac, Bc, 卧铺客车, 客运车辆, UIC编号, LUA生成代码, 制动重量]
tags: [SimRail, 客运车辆]
slug: /vehicle/carriage/110ac_bc
---

## 简介

110a是波兰的一个卧铺客车系列。每辆车包含9个包厢，54个铺位，并可转换成72个座位的布局。它们由HCP波兹南公司独家生产，从1971年到1977年共生产了三批。110Aa型只有蒸汽和电加热。110Ab型有燃煤炉和可变轨距转向架，用于通往苏联的线路。110Ac型没有这些功能，但按照UICY型标准进行了标准化，可用于西部铁路网。

::::::info

此车辆包含在基础游戏中。

::::::

## 技术数据

<table>
  <tbody>
    <tr><td><strong>车厂编号</strong></td><td>110Ac</td></tr>
    <tr><td><strong>设计代号</strong></td><td>Bc</td></tr>
    <tr><td><strong>用途</strong></td><td>客运</td></tr>
    <tr><td><strong>车辆种类</strong></td><td>客运车辆</td></tr>
    <tr><td><strong>制造商</strong></td><td>HCP</td></tr>
    <tr><td><strong>生产年份</strong></td><td>1976-1977</td></tr>
    <tr><td><strong>整备质量</strong></td><td>38t</td></tr>
    <tr><td><strong>车长</strong></td><td>25m</td></tr>
    <tr><td><strong>车宽</strong></td><td>3m</td></tr>
    <tr><td><strong>轴式</strong></td><td>2'2'</td></tr>
    <tr><td><strong>最大功率</strong></td><td>-</td></tr>
    <tr><td><strong>最高运行时速</strong></td><td>160km/h</td></tr>
  </tbody>
</table>

## 变体

<details>
<summary>Bcdu 5051 5978 003-8 （80年代）</summary>

![Bcdu 5051 5978 003-8 （80年代）](pathname:///img/simrail/vehicle/carriage/110ac_bc/bcdu-5051-5978-003-8-80s.webp)

铁路运输主体：PKP

UIC编号：50 51 59-78 003-8 PL-PKP

最大运营速度：160km/h

LUA生成代码：`"11xa/80s/110Ac_50 51 59-78 003-8 Variant 80s"` 或 `PassengerWagonNames.Bcdu_5051_5978_003_8_The80s`

</details>

<details>
<summary>Bc9ou 5051 5978 003-8</summary>

![Bc9ou 5051 5978 003-8](pathname:///img/simrail/vehicle/carriage/110ac_bc/bc9ou-5051-5978-003-8.webp)

铁路运输主体：PKP Intercity

UIC编号：50 51 59-78 003-8 PL-PKPIC

最大运营速度：160km/h.

LUA生成代码：`"11xa/80s/110Ac_50 51 59-78 003-8 Variant"`或`PassengerWagonNames.Bc9ou_5051_5978_003_8`

</details>

<details>
<summary>Bcdu 5051 5970 048-0 （80年代）</summary>

![Bcdu 5051 5970 048-0 （80年代）](pathname:///img/simrail/vehicle/carriage/110ac_bc/bcdu-5051-5970-048-0-80s.webp)

铁路运输主体：PKP

UIC编号：51 51 59-70 048-0 PL-PKP

最大运营速度：160km/h.

LUA生成代码：`"11xa/80s/110Ac_51 51 59-70 048-0 Variant 80s"` 或 `PassengerWagonNames.Bcdu_5051_5970_048_0_The80s`

</details>

<details>
<summary>Bcwxz 5151 5980 271-6（80年代）</summary>

![Bcwxz 5151 5980 271-6（80年代）](pathname:///img/simrail/vehicle/carriage/110ac_bc/bcwxz-5151-5980-271-6-80s.webp)

铁路运输主体：PKP

UIC编号：51 51 59-80 271-6 PL-PKP

最大运营速度：160km/h.

LUA生成代码：`"11xa/80s/110Ac_51 51 59-80 271-6 Variant 80s"` 或 `PassengerWagonNames.Bcwxz_5151_5980_271_6_The80s`

</details>

## 提示与技巧

| 制动模式 | 制动重量 |
| --- | --- |
| R | 60吨 |
