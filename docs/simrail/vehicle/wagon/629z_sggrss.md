---
sidebar_position: 8
title: 629Z - Sggrss
description: 本文介绍 SimRail（模拟铁路）中 629Z（Sggrss）型集装箱平车的信息，涵盖该车的简介、技术数据（车长、车宽、整备质量、轴式、最高运行时速等）、变体及其 UIC 编号与 LUA 生成代码，以及各装载物对应的 LUA 代码与装载效果图。
keywords: [SimRail, 629Z, Sggrss, 集装箱平车, 货运车辆, UIC编号, LUA生成代码]
tags: [SimRail, 货运车辆]
slug: /vehicle/wagon/629z_sggrss
---

## 简介

629Z是一种六轴平板货车，专为运输集装箱而设计。它的最大载重量为106.5吨，相当于三个或四个满载集装箱的重量。由于增加了一个转向架，其有效装载能力比四轴货车有所提高，但这就需要在各个转向架之间使用额外的连接装置。车上配备有用于不同集装箱尺寸的固定销槽位。其装载长度为2x40英尺，每节可装载两个20英尺集装箱或一个40英尺集装箱。货车在波兰制造。该车属于Sggrss系列，可在SS状态下运行（最大120km/h，有载重）。

该车配备的是K型制动蹄片（即所谓的“复合材料“），摩擦系数更高，与铸铁制动蹄片相比，制动效果更线性。

:::warning

**注意：在低速进行制动时，请使用比正常情况下更强的制动档位!**

:::

:::info

此车辆需要[SimRail - The Railway Simulator: Cargo Pack](https://store.steampowered.com/app/2868050/SimRail__The_Railway_Simulator_Cargo_Pack/)才能使用。

:::

## 技术数据

<table>
  <tbody>
    <tr><td><strong>车厂编号</strong></td><td>629Z</td></tr>
    <tr><td><strong>设计代号</strong></td><td>Sggrss</td></tr>
    <tr><td><strong>用途</strong></td><td>货运</td></tr>
    <tr><td><strong>车辆种类</strong></td><td>货运车辆</td></tr>
    <tr><td><strong>制造商</strong></td><td>EKK Wagon</td></tr>
    <tr><td><strong>生产年份</strong></td><td>2013</td></tr>
    <tr><td><strong>整备质量</strong></td><td>27t</td></tr>
    <tr><td><strong>车长</strong></td><td>27m</td></tr>
    <tr><td><strong>车宽</strong></td><td>3m</td></tr>
    <tr><td><strong>轴式</strong></td><td>2'2'2'</td></tr>
    <tr><td><strong>最大功率</strong></td><td>-</td></tr>
    <tr><td><strong>最高运行时速</strong></td><td>120km/h</td></tr>
  </tbody>
</table>

## 变种

<details>
<summary>629Z 3151 4960 133-0</summary>

![629Z 3151 4960 133-0](pathname:///img/simrail/vehicle/wagon/629z_sggrss/629z-3151-4960-133-0.webp)

类型：629Z Sggrss

UIC编号：31 51 4960 133-0 PL-PKPC

LUA生成代码：

`"629Z/629Z_31514960133-0"` 或 `FreightWagonNames._629Z_21514960133_0`

</details>

## 装载

| 货物 | LUA代码 | 效果图 |
| --- | --- | --- |
| **随机集装箱2x20** | `"RandomContainer2x20"` 或`FreightLoads_629Z.RandomContainer2x20` | ![随机集装箱2x20 装载效果图](pathname:///img/simrail/vehicle/wagon/629z_sggrss/randomcontainer2x20.webp) |
| **随机集装箱3x20** | `"RandomContainer3x20"` 或`FreightLoads_629Z.RandomContainer3x20` | ![随机集装箱3x20 装载效果图](pathname:///img/simrail/vehicle/wagon/629z_sggrss/randomcontainer3x20.webp) |
| **随机集装箱4x20** | `"RandomContainer4x20"` 或`FreightLoads_629Z.RandomContainer4x20` | ![随机集装箱4x20 装载效果图](pathname:///img/simrail/vehicle/wagon/629z_sggrss/randomcontainer4x20.webp) |
| **随机集装箱2x40** | `"RandomContainer2x40"` 或`FreightLoads_629Z.RandomContainer2x40` | ![随机集装箱2x40 装载效果图](pathname:///img/simrail/vehicle/wagon/629z_sggrss/randomcontainer2x40.webp) |
| **随机集装箱202040** | `"RandomContainer202040"` 或`FreightLoads_629Z.RandomContainer202040` | ![随机集装箱202040 装载效果图](pathname:///img/simrail/vehicle/wagon/629z_sggrss/randomcontainer202040.webp) |
| **随机集装箱402020** | `"RandomContainer402020"` 或`FreightLoads_629Z.RandomContainer402020` | ![随机集装箱402020 装载效果图](pathname:///img/simrail/vehicle/wagon/629z_sggrss/randomcontainer402020.webp) |
| **气体罐箱2x20** | `"GasContainer2x20"` 或`FreightLoads_629Z.GasContainer2x20` | ![气体罐箱2x20 装载效果图](pathname:///img/simrail/vehicle/wagon/629z_sggrss/gascontainer2x20.webp) |
| **气体罐箱3x20** | `"GasContainer3x20"` 或`FreightLoads_629Z.GasContainer3x20` | ![气体罐箱3x20 装载效果图](pathname:///img/simrail/vehicle/wagon/629z_sggrss/gascontainer3x20.webp) |
| **GasContainer4x20** | `"GasContainer4x20"` 或`FreightLoads_629Z.GasContainer4x20` | ![GasContainer4x20 装载效果图](pathname:///img/simrail/vehicle/wagon/629z_sggrss/gascontainer4x20.webp) |
