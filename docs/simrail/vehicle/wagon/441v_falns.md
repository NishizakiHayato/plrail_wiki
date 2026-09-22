---
sidebar_position: 6
title: 441V - Falns
description: 本文介绍 SimRail（模拟铁路）中 441V（Falns）型漏斗车的信息，涵盖该车的简介、技术数据（车长、车宽、整备质量、轴式、最高运行时速等）、Falns 变体及其铁路运输主体、UIC 编号与 LUA 生成代码，以及各装载物对应的 LUA 代码。
keywords: [SimRail, 441V, Falns, 漏斗车, 货运车辆, UIC编号, LUA生成代码]
tags: [SimRail, 货运车辆]
slug: /vehicle/wagon/441v_falns
---

## 简介

441v是一款四轴料斗车，专为煤炭和砾石等高颗粒散装货物而设计。它的两个独立货厢可装载多达64吨的货物，总容积为86立方米。货物使用传送带或铲斗从顶部装载，通过气动挡板借助重力从两侧卸载。

:::info

此车辆需要[SimRail - The Railway Simulator: Cargo Pack](https://store.steampowered.com/app/2868050/SimRail__The_Railway_Simulator_Cargo_Pack/)才能使用。

:::

## 技术数据

<table>
  <tbody>
    <tr><td><strong>车厂编号</strong></td><td>441V</td></tr>
    <tr><td><strong>设计代号</strong></td><td>Falns</td></tr>
    <tr><td><strong>用途</strong></td><td>货运</td></tr>
    <tr><td><strong>车辆种类</strong></td><td>货运车辆</td></tr>
    <tr><td><strong>制造商</strong></td><td>Zastal</td></tr>
    <tr><td><strong>生产年份</strong></td><td>2005-2007</td></tr>
    <tr><td><strong>整备质量</strong></td><td>26t</td></tr>
    <tr><td><strong>车长</strong></td><td>14m</td></tr>
    <tr><td><strong>车宽</strong></td><td>3m</td></tr>
    <tr><td><strong>轴式</strong></td><td>2'2'</td></tr>
    <tr><td><strong>最大功率</strong></td><td>-</td></tr>
    <tr><td><strong>最高运行时速</strong></td><td>120km/h</td></tr>
  </tbody>
</table>

## 变种

<details>
<summary>Falns 3151 6635 283-3</summary>

![Falns 3151 6635 283-3](pathname:///img/simrail/vehicle/wagon/441v_falns/falns-3151-6635-283-3.webp)

类型：441V

铁路运输主体：PKP Cargo

UIC编号：31 51 6635 283-3 PL-PKPC

LUA生成代码：

`"441V/441V_31516635283-3"` 或 `FreightWagonNames._441V_31516635283_3`

</details>

<details>
<summary>Falns 3151 6635 512-5</summary>

![Falns 3151 6635 512-5](pathname:///img/simrail/vehicle/wagon/441v_falns/falns-3151-6635-512-5.webp)

类型：441V

铁路运输主体：PKP Cargo

UIC编号：31 51 6635 512-5 PL-PKPC

LUA生成代码：

`"441V/441V_31516635512-5"` 或 `FreightWagonNames._441V_31516635512_5`

</details>

## 装载

| 货物 | LUA代码 |
| --- | --- |
| **煤炭** | `"Coal"` 或`FreightLoads_412W_v4.Coal` |
| **沙子** | `"Sand"` 或`FreightLoads_412W_v4.Sand` |
| **道砟** | `"Ballast"` 或`FreightLoads_412W_v4.Ballast` |
