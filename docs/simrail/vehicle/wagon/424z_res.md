---
sidebar_position: 2
title: 424Z - Res
description: 本文介绍 SimRail（模拟铁路）中 424Z（Res / SGS）型平车的信息，涵盖该车的简介、技术数据（车长、车宽、整备质量、轴式、最高运行时速等）、SGS 变体及其铁路运输主体、UIC 编号与 LUA 生成代码，以及各装载物对应的 LUA 代码。
keywords: [SimRail, 424Z, Res, SGS, 平车, 货运车辆, UIC编号, LUA生成代码]
tags: [SimRail, 货运车辆]
slug: /vehicle/wagon/424z_res
---

## 简介

424z是波兰的一种符合欧洲法规的设计用于运输ISO标准集装箱的平板货车，可以装载10英尺、20英尺、30英尺和40英尺的集装箱，平板空间长60英尺，载重量为58吨。

:::info

此车辆包含在基础游戏中。

:::

## 技术数据

<table>
  <tbody>
    <tr><td><strong>车厂编号</strong></td><td>424Z</td></tr>
    <tr><td><strong>设计代号</strong></td><td>SGS</td></tr>
    <tr><td><strong>用途</strong></td><td>货运</td></tr>
    <tr><td><strong>车辆种类</strong></td><td>货运车辆</td></tr>
    <tr><td><strong>制造商</strong></td><td>Fabryka Wagonów Świdnica</td></tr>
    <tr><td><strong>生产年份</strong></td><td>1971-1976</td></tr>
    <tr><td><strong>整备质量</strong></td><td>22t</td></tr>
    <tr><td><strong>车长</strong></td><td>20m</td></tr>
    <tr><td><strong>车宽</strong></td><td>3m</td></tr>
    <tr><td><strong>轴式</strong></td><td>2'2'</td></tr>
    <tr><td><strong>最大功率</strong></td><td>-</td></tr>
    <tr><td><strong>最高运行时速</strong></td><td>120km/h</td></tr>
  </tbody>
</table>

## 变体

<details>
<summary>SGS 3151 3944 773-6</summary>

![SGS 3151 3944 773-6](pathname:///img/simrail/vehicle/wagon/424z_res/sgs-3151-3944-773-6.webp)

铁路运输主体：PKP Cargo

UIC编号：31 51 3944 773-6 PL-PKPC

LUA生成代码：`"424Z/424Z"` 或 `FreightWagonNames.SGS_3151_3944_773_6`

</details>

<details>
<summary>SGS 3151 3947 512-5</summary>

![SGS 3151 3947 512-5](pathname:///img/simrail/vehicle/wagon/424z_res/sgs-3151-3947-512-5.webp)

铁路运输主体：PKP Cargo

UIC编号：31 51 3947 512-5 PL-PKPC

LUA生成代码：`"424Z/424Z_brazowy"` 或 `FreightWagonNames.SGS_3151_3947_512_5`

</details>

## 装载

<table>
  <tbody>
    <tr><td><strong>装载物</strong></td><td><strong>LUA代码</strong></td></tr>
    <tr><td>混凝土板</td><td><code>"Concrete_slab"</code> 或<code>FreightLoads_412W.Concrete_slab</code></td></tr>
    <tr><td>天然气管道</td><td><code>"Gas_pipeline"</code>或 <code>FreightLoads_412W.Gas_pipeline</code></td></tr>
    <tr><td>管道</td><td><code>"Pipeline"</code>或 <code>FreightLoads_412W.Pipeline</code></td></tr>
    <tr><td>金属板</td><td><code>"Sheet_metal"</code>或<code>reightLoads_412W.Sheet_metal</code></td></tr>
    <tr><td>圆钢</td><td><code>"Steel_circle"</code> 或者 <code>FreightLoads_412W.Steel_circle</code></td></tr>
    <tr><td>T型梁</td><td><code>"T-beam"</code> 或 <code>FreightLoads_412W.T_beam</code></td></tr>
    <tr><td>枕木</td><td><code>"Tie"</code> 或 <code>FreightLoads_412W.Tie</code></td></tr>
    <tr><td>原木</td><td><code>"Tree_trunk"</code>或 <code>FreightLoads_412W.Tree_trunk</code></td></tr>
    <tr><td>木梁</td><td><code>"Wooden_beam"</code> 或 <code>FreightLoads_412W.Wooden_beam</code></td></tr>
  </tbody>
</table>
