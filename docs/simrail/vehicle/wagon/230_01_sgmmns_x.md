---
sidebar_position: 1
title: 230-01 - Sgmmns-x
description: 本文介绍 SimRail（模拟铁路）中 230-01（Sgmmns-x）型集装箱平车的信息，涵盖该车的简介、技术数据（车长、车宽、整备质量、轴式、最高运行时速等）、变体及其 UIC 编号与 LUA 生成代码，以及各装载物对应的 LUA 代码。
keywords: [SimRail, 230-01, Sgmmns-x, 集装箱平车, 货运车辆, UIC编号, LUA生成代码]
tags: [SimRail, 货运车辆]
slug: /vehicle/wagon/230_01_sgmmns_x
---

## 简介

230-01 是一种四轴平板货车，专为运送集装箱而设计。该车在捷克共和国制造，属于 Sgmmns 系列。其最大载重量为 73.5 吨，相当于两到三个满载集装箱的重量。装载长度为 40 英尺，可装载两个 20 英尺集装箱或一个 40 英尺集装箱。车体设有用于不同集装箱尺寸的固定销槽位。运行速度方面：在 S 状态下（有载重）最大速度为 100 km/h；无载重时最大运行速度为 120 km/h。

该车配备 K 型制动蹄片（即所谓的“复合材料”），摩擦系数更高，与铸铁制动蹄片相比，制动效果更线性。

:::warning

**在低速进行制动时，请使用比正常情况下更强的制动档位！**

:::

:::info

此车辆包含在基础游戏中。

:::

## 技术数据

<table>
  <tbody>
    <tr><td><strong>车厂编号</strong></td><td>230-01</td></tr>
    <tr><td><strong>设计代号</strong></td><td>Sgmmns-x</td></tr>
    <tr><td><strong>用途</strong></td><td>货运</td></tr>
    <tr><td><strong>车辆种类</strong></td><td>货运车辆</td></tr>
    <tr><td><strong>制造商</strong></td><td>Tatravagónka Poprad</td></tr>
    <tr><td><strong>生产年份</strong></td><td>2022</td></tr>
    <tr><td><strong>整备质量</strong></td><td>16.5t</td></tr>
    <tr><td><strong>车长</strong></td><td>14m</td></tr>
    <tr><td><strong>车宽</strong></td><td>3m</td></tr>
    <tr><td><strong>轴式</strong></td><td>2'2'</td></tr>
    <tr><td><strong>最大功率</strong></td><td>-</td></tr>
    <tr><td><strong>最高运行时速</strong></td><td>120km/h</td></tr>
  </tbody>
</table>

## 变体

<details>
<summary>230-01 3151 4508 558-7</summary>

![230-01 3151 4508 558-7](pathname:///img/simrail/vehicle/wagon/230_01_sgmmns_x/230-01-3151-4508-558-7.webp)

UIC编号：31 51 4508 558-7 PL-PKPC

LUA生成代码：`"629Z/230-01_31514508558-7"` 或 `FreightWagonNames._230_01_31514508558_7`

</details>

## 装载

<table>
  <tbody>
    <tr><td><strong>装载物</strong></td><td><strong>LUA代码</strong></td></tr>
    <tr><td>随机20尺集装箱1个</td><td><code>"RandomContainer1x20"</code> 或 <code>FreightLoads_629Z.RandomContainer1x20</code></td></tr>
    <tr><td>随机20尺集装箱2个</td><td><code>"RandomContainer2x20"</code>或 <code>FreightLoads_629Z.RandomContainer2x20</code></td></tr>
    <tr><td>随机40尺集装箱1个</td><td><code>"RandomContainer1x40"</code> or <code>FreightLoads_629Z.RandomContainer1x40</code></td></tr>
  </tbody>
</table>
