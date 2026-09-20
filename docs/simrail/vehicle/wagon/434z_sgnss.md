---
sidebar_position: 7
title: 434Z - Sgns(s)
description: 本文介绍 SimRail（模拟铁路）中 434Z（Sgns）型集装箱平车的信息，涵盖该车的简介、技术数据（车长、车宽、整备质量、轴式、最高运行时速等）、变体及其 UIC 编号与 LUA 生成代码，以及各装载物对应的 LUA 代码与装载效果图。
keywords: [SimRail, 434Z, Sgns, 集装箱平车, 货运车辆, UIC编号, LUA生成代码]
tags: [SimRail, 货运车辆]
slug: /vehicle/wagon/434z_sgnss
---

## 简介

434Z是一种四轴平板货车，专为运送集装箱而设计。它的最大载重量为70吨，相当于两到三个满载集装箱的重量。它有用于不同尺寸集装箱的固定销槽位。它的装载长度为60英尺，可装载三个20英尺集装箱或一个40英尺和一个20英尺集装箱。该车属于Sgns系列，运行时速可达120km/h。该车在波兰制造。

与SimRail中的其它集装箱货车不同，该车配备的是铸铁制动蹄片，因此使用了大型制动缸，装载货物时耗气量非常大，而空载时制动灵敏度较低。

:::warning

**注意:在对空车进行制动时，请使用比正常情况下更强的制动档位!**

:::

:::info

此车辆需要[SimRail - The Railway Simulator: Cargo Pack](https://store.steampowered.com/app/2868050/SimRail__The_Railway_Simulator_Cargo_Pack/)才能使用。

:::

## 技术数据

<table>
  <tbody>
    <tr><td><strong>车厂编号</strong></td><td>434V</td></tr>
    <tr><td><strong>设计代号</strong></td><td>Sgns</td></tr>
    <tr><td><strong>用途</strong></td><td>货运</td></tr>
    <tr><td><strong>车辆种类</strong></td><td>货运车辆</td></tr>
    <tr><td><strong>制造商</strong></td><td>EKK Wagon</td></tr>
    <tr><td><strong>生产年份</strong></td><td>2013</td></tr>
    <tr><td><strong>整备质量</strong></td><td>18.9t</td></tr>
    <tr><td><strong>车长</strong></td><td>20m</td></tr>
    <tr><td><strong>车宽</strong></td><td>3m</td></tr>
    <tr><td><strong>轴式</strong></td><td>2'2'</td></tr>
    <tr><td><strong>最大功率</strong></td><td>-</td></tr>
    <tr><td><strong>最高运行时速</strong></td><td>120km/h</td></tr>
  </tbody>
</table>

## 变种

<details>
<summary>434Z 3151 4553 133-5</summary>

![434Z 3151 4553 133-5](pathname:///img/simrail/vehicle/wagon/434z_sgnss/434z-3151-4553-133-5.webp)

类型：434Z

UIC编号：31 51 4553 133-5 PL-PKPC

LUA生成代码：

`"629Z/434Z_31514553133-5"` 或 `FreightWagonNames._434Z_31514553133_5`

</details>

<details>
<summary>434Z 3151 4553 133-5</summary>

![434Z 3151 4553 133-5](pathname:///img/simrail/vehicle/wagon/434z_sgnss/434z-3151-4553-133-5-2.webp)

类型：434Z

UIC编号：33 51 4565 217-8 PL-PCCC

LUA生成代码：

`"629Z/434Z_33514565217-8"` 或`FreightWagonNames._434Z_33514565217_8`

:::info

**此车辆尚未加入游戏，请勿使用相关的LUA代码！**

:::

</details>

## 装载

| 货物 | LUA代码 | 效果图 |
| --- | --- | --- |
| **随机集装箱1x20** | `"RandomContainer1x20"` 或`FreightLoads_629Z.RandomContainer1x20` | ![随机集装箱1x20 装载效果图](pathname:///img/simrail/vehicle/wagon/434z_sgnss/randomcontainer1x20.webp) |
| **随机集装箱2x20** | `"RandomContainer2x20"` 或`FreightLoads_629Z.RandomContainer2x20` | ![随机集装箱2x20 装载效果图](pathname:///img/simrail/vehicle/wagon/434z_sgnss/randomcontainer2x20.webp) |
| **随机集装箱3x20** | `"RandomContainer3x20"` 或`FreightLoads_629Z.RandomContainer3x20` | ![随机集装箱3x20 装载效果图](pathname:///img/simrail/vehicle/wagon/434z_sgnss/randomcontainer3x20.webp) |
| **随机集装箱1x40** | `"RandomContainer1x40"` 或`FreightLoads_629Z.RandomContainer1x40` | ![随机集装箱1x40 装载效果图](pathname:///img/simrail/vehicle/wagon/434z_sgnss/randomcontainer1x40.webp) |
| **随机集装箱2040** | `"RandomContainer2040"` 或`FreightLoads_629Z.RandomContainer2040` | ![随机集装箱2040 装载效果图](pathname:///img/simrail/vehicle/wagon/434z_sgnss/randomcontainer2040.webp) |
| **气体罐箱2x20** | `"GasContainer2x20"` 或`FreightLoads_629Z.GasContainer2x20` | ![气体罐箱2x20 装载效果图](pathname:///img/simrail/vehicle/wagon/434z_sgnss/gascontainer2x20.webp) |
| **气体罐箱3x20** | `"GasContainer3x20"`或`FreightLoads_629Z.GasContainer3x20` | ![气体罐箱3x20 装载效果图](pathname:///img/simrail/vehicle/wagon/434z_sgnss/gascontainer3x20.webp) |
