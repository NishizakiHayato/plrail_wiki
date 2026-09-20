---
sidebar_position: 3
title: 412W - Eaos
description: 本文介绍 SimRail（模拟铁路）中 412W（Eaos）型敞车的信息，涵盖该车的简介、技术数据（车长、车宽、整备质量、轴式、最高运行时速等）、EAOS 变体及其铁路运输主体、UIC 编号与 LUA 生成代码，以及各装载物对应的 LUA 代码。
keywords: [SimRail, 412W, Eaos, EAOS, 敞车, 货运车辆, UIC编号, LUA生成代码]
tags: [SimRail, 货运车辆]
slug: /vehicle/wagon/412w_eaos
---

## 简介

412w是一款四轴货车，设计用于运载散装货物，如煤、沙、矿石和土方。它可以在72立方米的车身内装载60吨的货物。可以使用车厢翻转器进行卸货。

:::info

此车辆包含在基础游戏中。

:::

## 技术数据

<table>
  <tbody>
    <tr><td><strong>车厂编号</strong></td><td>412W</td></tr>
    <tr><td><strong>设计代号</strong></td><td>EAOS</td></tr>
    <tr><td><strong>用途</strong></td><td>货运</td></tr>
    <tr><td><strong>车辆种类</strong></td><td>货运车辆</td></tr>
    <tr><td><strong>制造商</strong></td><td>Zastal</td></tr>
    <tr><td><strong>生产年份</strong></td><td>1983-1986</td></tr>
    <tr><td><strong>整备质量</strong></td><td>20t</td></tr>
    <tr><td><strong>车长</strong></td><td>14m</td></tr>
    <tr><td><strong>车宽</strong></td><td>3m</td></tr>
    <tr><td><strong>轴式</strong></td><td>2'2'</td></tr>
    <tr><td><strong>最大功率</strong></td><td>-</td></tr>
    <tr><td><strong>最高运行时速</strong></td><td>100km/h</td></tr>
  </tbody>
</table>

## 变体

<details>
<summary>EAOS 3151 5349 475-9</summary>

![EAOS 3151 5349 475-9](pathname:///img/simrail/vehicle/wagon/412w_eaos/eaos-3151-5349-475-9.webp)

铁路运输主体：PKP Cargo

UIC编号：31 51 5349 475-9 PL-PKPC

LUA生成代码：`"412W/412W_v4_364-9 Variant"` 或 `FreightWagonNames.EAOS_3151_5349_475_9`

</details>

<details>
<summary>EAOS 3151 5351 989-9</summary>

![EAOS 3151 5351 989-9](pathname:///img/simrail/vehicle/wagon/412w_eaos/eaos-3151-5351-989-9.webp)

铁路运输主体：PKP Cargo

UIC编号：31 51 5351 989-9 PL-PKPC

LUA生成代码：`"412W/412W_v4_364-9_b Variant"` 或 `FreightWagonNames.EAOS_3151_5351_989_9`

</details>

<details>
<summary>EAOS 3351 5356 394-5</summary>

![EAOS 3351 5356 394-5](pathname:///img/simrail/vehicle/wagon/412w_eaos/eaos-3351-5356-394-5.webp)

铁路运输主体：PROTOR/DB Cargo Polska

UIC编号：33 51 5356 394-5 PL-PROT

LUA生成代码：`"412W/412W_33515356394-5"` 或`FreightWagonNames.EAOS_3351_5356_394_5`

</details>

<details>
<summary>EAOS 3356 5300 118-0</summary>

![EAOS 3356 5300 118-0](pathname:///img/simrail/vehicle/wagon/412w_eaos/eaos-3356-5300-118-0.webp)

铁路运输主体：ZOS ZVOLEN

UIC编号：33 56 5300 118-0 SK-ZOS

LUA生成代码：`"412W/412W_33565300118-0"` 或 `FreightWagonNames.EAOS_3356_5300_118_0`

</details>

<details>
<summary>EAOS 3356 5300 177-6</summary>

![EAOS 3356 5300 177-6](pathname:///img/simrail/vehicle/wagon/412w_eaos/eaos-3356-5300-177-6.webp)

铁路运输主体：ZOS ZVOLEN

UIC编号：33 56 5300 177-6 SK-ZOS

LUA生成代码：`"412W/412W_33565300177-6"` 或 `FreightWagonNames.EAOS_3356_5300_177_6`

</details>

## 装载

<table>
  <tbody>
    <tr><td><strong>装载物</strong></td><td><strong>LUA代码</strong></td></tr>
    <tr><td>煤炭</td><td><code>"Coal"</code> 或<code>FreightLoads_412W_v4.Coal</code></td></tr>
    <tr><td>沙子</td><td><code>"Sand"</code> 或<code>FreightLoads_412W_v4.Sand</code></td></tr>
    <tr><td>道砟</td><td><code>"Ballast"</code> 或<code>FreightLoads_412W_v4.Ballast</code></td></tr>
    <tr><td>原木</td><td><code>"WoodLogs"</code> 或<code>FreightLoads_412W_v4.WoodLogs</code></td></tr>
  </tbody>
</table>
