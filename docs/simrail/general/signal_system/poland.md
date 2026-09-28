---
sidebar_position: 1
title: 波兰信号系统
description: 本文系统介绍 SimRail（模拟铁路）中波兰铁路的信号系统，涵盖信号机灯杆识别方法、臂板信号机（Sr1–Sr3）、色灯信号机（S、Sz、Os、Sp、Osp 系列）的显示含义与限速关系、主信号机整体记忆表格，以及 W 系列线路标志、We 系列接触网标志、D 系列施工标志等各类线路标志的图例与含义。
keywords: [SimRail, 信号系统, 波兰, 信号机, 臂板信号机, 色灯信号机, 铁路标志, W标志]
tags: [SimRail, 信号系统]
slug: /general/signal_system/poland
---

# 波兰信号系统

:::danger

本文存在大量NNN时代遗留的简化和错误，我们正在紧急修订之中，如果您在wiki.plrail.com上看到他，这代表我们不小心将他推送到了生产环境，请勿参考本文章！

:::

:::warning

本文内容仅适用于 SimRail 游戏。**请勿将其用于现实中的铁路作业、司机培训或任何真实的铁路信号系统操作**，否则可能导致法律责任、财产损失、人身伤害甚至死亡！

:::

波兰铁路的信号分为**臂板信号机**与**色灯信号机**两大类，此外线路旁还有大量用于标示限速、道口、接触网分相等信息的**线路标志**。本文按用途分类整理。

## 臂板信号机

臂板信号机以臂板的位置表示行车许可，方括号内为对应的德国 Hp 编号。

| 名称 | Sr1 | Sr2 | Sr3 | Sr3 变体（类似于 Sr6） |
| --- | :-: | :-: | :-: | :-: |
| 德国对应编号 | Hp0 | Hp1 | Hp2 | — |
| 图示 | ![Sr1 臂板信号机：停车](pathname:///img/simrail/general/signal_system/poland/sr1.webp) | ![Sr2 臂板信号机：通过](pathname:///img/simrail/general/signal_system/poland/sr2.webp) | ![Sr3 臂板信号机：限速 40 通过](pathname:///img/simrail/general/signal_system/poland/sr3.webp) | ![Sr3 变体臂板信号机：限速降低到 W21 标志数值](pathname:///img/simrail/general/signal_system/poland/sr3-variant.webp) |
| 含义 | 停车 | 通过 | 限速 40 通过，下一信号机通过 | 表示限速降低到下方 W21 标志的数值（图中一例为 100） |

## 色灯信号机

### 信号机灯杆类型

波兰的信号机可以按灯杆样式区分用途，灯杆是判断信号机种类的第一依据。

| 名称 | 机械/电路控制信号机 | 自动闭塞信号机 | 复示信号机 | 道口信号机 |
| --- | :-: | :-: | :-: | :-: |
| 灯杆样式 | ![机械/电路控制信号机灯杆](pathname:///img/simrail/general/signal_system/poland/post-relay.webp) | ![自动闭塞信号机灯杆](pathname:///img/simrail/general/signal_system/poland/post-abs.webp) | ![复示信号机灯杆](pathname:///img/simrail/general/signal_system/poland/post-repeater.webp) | ![道口信号机灯杆](pathname:///img/simrail/general/signal_system/poland/post-crossing.webp) |

### 主信号机

主信号机共有 5 个灯位，**以红灯为界**：红灯上方显示本信号机所要求的限速，红灯下方显示下一架信号机所要求的限速。由于技规更新，编号可能与旧资料有异。

| 名称 | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | S9 |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 图示 | ![S1：停车](pathname:///img/simrail/general/signal_system/poland/s1.webp) | ![S2：通过](pathname:///img/simrail/general/signal_system/poland/s2.webp) | ![S3：下一信号机限速 100](pathname:///img/simrail/general/signal_system/poland/s3.webp) | ![S4：下一信号机限速 40/60](pathname:///img/simrail/general/signal_system/poland/s4.webp) | ![S5：下一信号机停车](pathname:///img/simrail/general/signal_system/poland/s5.webp) | ![S6：限速 100，下一信号机通过](pathname:///img/simrail/general/signal_system/poland/s6.webp) | ![S7：限速 100，下一信号机限速 100](pathname:///img/simrail/general/signal_system/poland/s7.webp) | ![S8：限速 100，下一信号机限速 40/60](pathname:///img/simrail/general/signal_system/poland/s8.webp) | ![S9：限速 100，下一信号机停车](pathname:///img/simrail/general/signal_system/poland/s9.webp) |
| 本信号机限速（km/h） | 停车 | Vmax | Vmax | Vmax | Vmax | 100 | 100 | 100 | 100 |
| 下一信号机限速（km/h） | — | Vmax | 100 | 40 / 60 | 停车 | Vmax | 100 | 40 / 60 | 停车 |

| 名称 | S10 | S10a | S11 | S11a | S12 | S12a | S13 | S13a |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| 图示 | ![S10：限速 40，下一信号机通过](pathname:///img/simrail/general/signal_system/poland/s10.webp) | ![S10a：限速 60，下一信号机通过](pathname:///img/simrail/general/signal_system/poland/s10a.webp) | ![S11：限速 40，下一信号机限速 100](pathname:///img/simrail/general/signal_system/poland/s11.webp) | ![S11a：限速 60，下一信号机限速 100](pathname:///img/simrail/general/signal_system/poland/s11a.webp) | ![S12：限速 40，下一信号机限速 40/60](pathname:///img/simrail/general/signal_system/poland/s12.webp) | ![S12a：限速 60，下一信号机限速 40/60](pathname:///img/simrail/general/signal_system/poland/s12a.webp) | ![S13：限速 40，下一信号机停车](pathname:///img/simrail/general/signal_system/poland/s13.webp) | ![S13a：限速 60，下一信号机停车](pathname:///img/simrail/general/signal_system/poland/s13a.webp) |
| 本信号机限速（km/h） | 40 | 60 | 40 | 60 | 40 | 60 | 40 | 60 |
| 下一信号机限速（km/h） | Vmax | Vmax | 100 | 100 | 40 / 60 | 40 / 60 | 停车 | 停车 |

:::info

闪烁显示：**S3 绿闪、S4 黄闪**；S7、S8、S11、S11a、S12、S12a 均为**上灯闪烁**。

:::

### 整体记忆表格

「当前信号机限速」与「下一信号机限速」两个维度交叉，即可确定当前看到的是哪一个编号。方括号内为对应的德国 Hl 编号。

| 当前信号机限速 ＼ 下一信号机限速 | 线路允许最高速 | 100 | 40 / 60 | 停车 |
| --- | :-: | :-: | :-: | :-: |
| 线路允许最高速 | S2 [Hl1] | S3 [Hl4] | S4 [Hl7] | S5 [Hl10] |
| 100 | S6 [Hl2] | S7 [Hl5] | S8 [Hl8] | S9 [Hl11] |
| 60 | S10a [Hl3b] | S11a [Hl6b] | S12a [Hl9b] | S13a [Hl12b] |
| 40 | S10 [Hl3a] | S11 [Hl6a] | S12 [Hl9a] | S13 [Hl12a] |
| 停车 | S1 [Hp0] | — | — | — |

### 替代信号

![替代信号（Sz）：显示红灯与白灯，可限速越过](pathname:///img/simrail/general/signal_system/poland/sz.webp)

替代信号用于信号故障时，允许列车越过信号机。限速 **40 km/h** ，大多数需要行车至下一信号机处解除。

### 预告信号机

预告信号机（Os）预告的是下一架主信号机的显示。

| 名称 | Os1 | Os2 | Os3 | Os4 |
| --- | :-: | :-: | :-: | :-: |
| 图示 | ![Os1：前方停车](pathname:///img/simrail/general/signal_system/poland/os1.webp) | ![Os2：前方通过](pathname:///img/simrail/general/signal_system/poland/os2.webp) | ![Os3：前方限速 100](pathname:///img/simrail/general/signal_system/poland/os3.webp) | ![Os4：前方限速 40/60](pathname:///img/simrail/general/signal_system/poland/os4.webp) |
| 含义 | 前方停车 | 前方通过 | 前方限速 100（绿闪） | 前方限速 40 / 60（黄闪） |

:::info

预告信号机存在**单灯式**：只显示 Os1 与 Os4，应当表示 Os2 与 Os3 时则熄灭。

:::

### 复示信号机

复示信号机（Sp）复示的是本信号机前方的信号显示，用于通视条件不良的地点。

| 名称 | Sp1 | Sp2 | Sp3 | Sp4 |
| --- | :-: | :-: | :-: | :-: |
| 图示 | ![Sp1：预告前方停车](pathname:///img/simrail/general/signal_system/poland/sp1.webp) | ![Sp2：预告通过](pathname:///img/simrail/general/signal_system/poland/sp2.webp) | ![Sp3：预告限速 100](pathname:///img/simrail/general/signal_system/poland/sp3.webp) | ![Sp4：预告限速 40/60](pathname:///img/simrail/general/signal_system/poland/sp4.webp) |
| 含义 | 预告前方停车 | 预告通过 | 预告限速 100（上绿灯闪烁） | 预告限速 40 / 60（上黄灯闪烁） |

### 复示信号机距离标

![复示信号机距离标：I、II、III 三道竖线](pathname:///img/simrail/general/signal_system/poland/repeater-distance.webp)

用于复示信号机，表示与主信号机之间的距离：**III 最远，I 最近**。

### 道口信号

| 名称 | Osp1 | Osp2 |
| --- | :-: | :-: |
| 图示 | ![Osp1：道口栏杆故障，限速 20](pathname:///img/simrail/general/signal_system/poland/osp1.webp) | ![Osp2：道口正常，无限速](pathname:///img/simrail/general/signal_system/poland/osp2.webp) |
| 含义 | 道口栏杆故障，限速 20 | 道口正常，无限速 |

## 线路标志

### 信号相关标志

| 图示 | 编号 | 含义 |
| :-: | :-: | --- |
| ![W1 标志：白色底上的黑色交叉](pathname:///img/simrail/general/signal_system/poland/w1.webp) | **W1** | **预告信号标** <br />W1标志表示预告信号机或道口信号的设置位置；而在设有四显示线路自动闭塞的区间上，则表示进站信号机之前区间自动闭塞倒数第二个通过信号机的设置位置。|
| ![W11 信号接近标：三道斜线由多到少](pathname:///img/simrail/general/signal_system/poland/w11.webp) | **W11** | **信号接近标**<br />从左至右依次表示 300m、200m、100m |
| ![另一种 W11 信号接近标](pathname:///img/simrail/general/signal_system/poland/w11-alt.webp) | **另一种 W11** | 含义同上 |
| ![W3 标志：反向信号机标志与其相邻的信号机](pathname:///img/simrail/general/signal_system/poland/w3.webp) | **W3** | **非本线路信号机标**<br />W3标志设在线路右侧，紧邻设于该处的信号机或阻挡信号机，表明该信号机或阻挡信号机不适用于设有该W3标志的线路。 |
| ![W15 标志：两个方向相反的三角形](pathname:///img/simrail/general/signal_system/poland/w15.webp) | **W15** | **信号机移位标**<br />W15标志代表信号机、复示信号机或预告信号机未设置在其通常设置的位置，但其显示的信号仍然适用于该标志所在的轨道。W15标志本身设置在原本的信号应设置的位置，而黑色三角则指向信号机的实际位置。 |
| ![W2 标志：黑底白字 G](pathname:///img/simrail/general/signal_system/poland/w2.webp) | **W2** | **运行方向表示器**<br />指示发车方向，取终端站/最近枢纽站首字母（本例为 G） |
| ![W26a 标志：黑底白字 P](pathname:///img/simrail/general/signal_system/poland/w26a.webp) | **W26a** | **运行方向表示器**<br />表示列车去往近郊线路（P = Podmiejskie，近郊） |
| ![W26b 标志：黑底白字 D](pathname:///img/simrail/general/signal_system/poland/w26b.webp) | **W26b** | **运行方向表示器**<br />表示列车去往远距线路（D = Dalekobieżne，远距） |
| ![W24 标志：黑底白色斜杠](pathname:///img/simrail/general/signal_system/poland/w24.webp) | **W24** | **反向行车表示器**<br />W24表示在双线或多线区间向与基本行车方向相反的方向发车（反方向行车），并与准许列车运行的信号同时显示。在用替代信号“Sz”进行反方向行车时，W24指示器上的显示与替代信号的显示同时出现。在特殊情况下，W 24指示器可在昼间采用不发光便携式标牌的形式。 |
| ![W21 标志：黑底白字 8](pathname:///img/simrail/general/signal_system/poland/w21.webp) | **W21** | **提高限速表示器**<br />W21标志安装在信号机柱上，代表通过此信号机后的最高限速，速度为数字×10 km/h（图中为 80 km/h） |
| ![W18 标志：方框内的同心圆](pathname:///img/simrail/general/signal_system/poland/w18.webp) | **W18** | **自动闭塞最后一架信号机标**<br />W18标志表示该信号机是SBL（ABS，自动闭塞）区间的最后一架通过信号机。当这架信号机熄灭或无效时，W18标志要求列车司机控制车速，以便列车能够在前方的潜在障碍物前、显示停车信号的进站信号机前安全停下，或能根据进站信号机的显示相应降低车速。 |
| ![W22 标志：菱形内的白字 T](pathname:///img/simrail/general/signal_system/poland/w22.webp) | **W22** | **容许信号机标**<br />W22标志仅适用于停车后启动困难的重载货运列车，该标志允许列车不停车越过显示“停车”信号的自动闭塞区间信号机，速度不得超过 20 km/h。此时司机应控制速度，做好遇到障碍物随时停车的准备。W22标志通常设在坡度超过 6‰ 且坡长达到或超过公认制动距离的上坡道上的自动闭塞信号机处。 |
| ![W19 标志：黑底白色单箭头向下](pathname:///img/simrail/general/signal_system/poland/w19.webp) | **W19** | **制动距离不足区间预告标** <br /> W19标志表示在下一架信号机或者预告信号机处，列车将进入一个短于该铁路线标准制动距离的分区，并要求司机在控制速度时特别谨慎。W19标志通常和信号机、预告信号机上的信号一起显示，这些信号要求列车在接下来的两个信号机处停车或减速。如果该信号机的每一种“通行”显示都需要显示W19标志，那么W19可以使用反光材料制作的固定标志牌表示。设置在四显示多分区自动闭塞线路的倒数第二个通过信号机上的 W19标志代表该闭塞的最后一个分区短于标准制动距离。 |
| ![W20 标志：黑底白色双箭头向下](pathname:///img/simrail/general/signal_system/poland/w20.webp) | **W20** | **制动距离不足区间标** <br /> W20标志表示在标志后将进入一个短于该铁路线标准制动距离的分区，并要求司机在控制速度时特别谨慎。W20标志通常和信号机、预告信号机上的允许信号一起显示，并且其前方应设有W19标志。如果该信号机的每一种“通行”显示都需要显示W20标志，或者设置在四显示多分区自动闭塞信号机上，那么W20可以使用反光材料制作的固定标志牌表示。|
| ![W31 标志：两道交叉的斜线](pathname:///img/simrail/general/signal_system/poland/w31.webp) | **W31** | **信号机无效标** <br /> W31标志表示所在的信号机处于停用状态、尚未投入使用或已失效，因此其上发出（显示）的信号均无效。 |

### 线路相关标志

| 图示 | 编号 | 含义 |
| :-: | :-: | --- |
| ![W5 标志：半圆形](pathname:///img/simrail/general/signal_system/poland/w5.webp) | **W5** | **调车边界标** <br /> W5表示调车边界。在需要固定标示允许调车作业边界的车站和线路上，均使用该标志，且其设置与调车信号机无关。该标志设在进站信号机内方，距进站信号机不少于 100 m 处。在双线铁路车站，W5设在进站线路旁、进站信号机一侧；在单线铁路车站，该标志设在正线右侧。越过该标志进行调车作业，只有经车站值班员许可后方可进行。 |
| ![W16 标志：黑白斜条纹横板](pathname:///img/simrail/general/signal_system/poland/w16.webp) | **W16** | **乘降所预告标** <br /> W16标志设置于无绝对信号机的区间乘降所之前，设在其所对应轨道的右侧，从设在该乘降所的W4标志（站台末端标）起算，距离为该区间的标准制动距离。 |
| ![W4 标志：黑底白十字](pathname:///img/simrail/general/signal_system/poland/w4.webp) | **W4** | **站台末端标** <br /> W4标志为黑色矩形背景上的白色十字，表明需停车的列车在车站或乘降所内停车时车头所能允许到达的最远地点。停靠的列车应当在不超出W4标志且列尾能够进入站台的情况下，选择更适合旅客乘降的地点停靠，例如靠近雨棚、天桥、地下通道等。<br />W4标志通常设置在站台末端或者警冲标前方，位于对应轨道的右侧。设置在站台末端、但不同时为列车进路终点的标志仅适用于在该站台停车的列车。在某些特殊情况下，例如没有足够的限界，也可能设置在对应轨道的左侧。<br />如果站台末端距离信号机不足25m，则不会设置W4标志。<br /> *<u>**注意**：和中国、日本等不同，波兰铁路的站台末端标不是列车停车位置标，应该在合适的地点停车而非追求“对标”。相反，一旦列车头部越过该标识，在游戏中将遭到扣分。</u>*|
| ![W28 标志：黑底圆牌上的黄字 R8](pathname:///img/simrail/general/signal_system/poland/w28.webp) | **W28** | **无线电频道标**<br />W28标志代表无线电频道的变更位置以及自该位置起生效的无线电频道号（图中为8）。越过指示牌后，司机应将无线电台切换至指定的频道，并尽快与在该频道工作的最近线路所/车站建立通信（在游戏中，通过按压*ZEW3*的方式）。该标志所指定的无线电频道一直有效，直到下一个W28标志为止。<br /> **小知识**：R并非单纯Radio的缩写，而是与UTK主席商定的基础设施管理者识别码，对于PKP Polskich Linii Kolejowych S.A.(PKP PLK S.A.)而言，该编号为R，而对于PKP SKM w Trójmieście Sp. z o.o.而言，该字母为S。|
| ![W29 标志：橙色底的交叉横板](pathname:///img/simrail/general/signal_system/poland/w29.webp) | **W29** | **无线呼叫标**<br />W29标志位于无人值守会让站之前的轨道右侧，距离自动进站信号机不少于1600m。该标志表示应与区间行车调度员建立无线电联系。 |
| ![W33/W34 标志：写有 GSM-R PL 的两块牌](pathname:///img/simrail/general/signal_system/poland/w33.webp) ![W34 标志：带有红色斜杠的 GSM-R PL](pathname:///img/simrail/general/signal_system/poland/w34.webp) | **W33 / W34** | **ERTMS/GSM-R起点标 \| ERTMS/GSM-R终点标** <br />进入/离开 ERTMS/GSM-R 区段 |
| ![W6 标志：白色三角形](pathname:///img/simrail/general/signal_system/poland/w6.webp) | **W6** | **鸣笛标**<br />W6标志表示列车**在此应当鸣响Rp 1“注意”音响信号** 。|
| ![W6a 标志：三角形带有汽车图案](pathname:///img/simrail/general/signal_system/poland/w6a.webp) | **W6a** | **平交道口标**<br /> W6a标志表明标志后方设有具备平交道口系统的平交道口或者行人过道。<br/>W6a标志设置在具备以下条件的平交道口或行人过道之前：<br />1.配有与车站设备联动或受其控制的半自动或自动平交道口系统；<br />2.配有平交道口预告信号机，且其半自动平交道口系统由基础设施管理者或铁路承运人的授权工作人员进行操作；<br />3.配有或未配有平交道口预告信号机，且道路交通由自动平交道口系统进行控制（该系统配有道路交通警报信号灯，以及用于拦截驶入道口方向，或同时拦截驶入与驶出道口方向的栏杆）；<br />4.道路交通由仅配有道路交通警报信号灯的自动平交道口系统来控制； |
| ![W6b 标志：两个三角形带有汽车图案](pathname:///img/simrail/general/signal_system/poland/w6b.webp) | **W6b** | **无防护平交道口预警标**<br />W6b标志表示列车**在此应当鸣响Rp 1“注意”音响信号**。<br />W6b标志设置在具备以下条件的平交道口或行人过道之前：<br />1.未配备半自动或自动平交道口系统；<br />2.配有半自动平交道口系统，但该系统未与车站设备联动或受其控制，或未配备平交道口预告信号机<br />3.道路交通由基础设施管理者或铁路承运人的授权工作人员进行人工指挥；<br />4.配有常闭式栏杆，需要时由使用者自行打开。 |
| ![W7 标志：三角形内的白字 R](pathname:///img/simrail/general/signal_system/poland/w7.webp) | **W7** | **作业标**<br />W7标志表示由于前方正在进行作业，列车**在此应当鸣响Rp 1“注意”音响信号**。<br />该标志是一个移动标志，应设置在作业地点两端 300 至 500 米处。 |
| ![W27 标志：黑底白字 14](pathname:///img/simrail/general/signal_system/poland/w27a-1.webp) ![W27a标志](pathname:///img/simrail/general/signal_system/poland/w27a-2.webp) | **W27a** | **限速变更标**<br />W27a标志表示速度变更的位置，以及从该位置起适用于该铁路线路的线路允许速度。标志上给出的数值对应线路允许速度（单位：km/h）的 0.1 倍，线路允许速度以 5 km/h 为递增步长进行设定。<br />例子：左上图的“11”代表该标志后的线路允许速度为110km/h，而左下图的“4,5”则代表该标志后的线路允许速度为45km/h。 |
| ![W9标志其一其二](pathname:///img/simrail/general/signal_system/poland/w9-1.webp)![W9标志其三其四](pathname:///img/simrail/general/signal_system/poland/w9-2.webp) | **W9** | **限速路段标**<br />W9标志表示限速路段的起点和终点，其中黑色角向下的为限速起点，而黑色角朝上的则为限速终点。限速起点标识上的数字为限速值（单位：km/h）的0.1倍，步长5km/h。例如左上图的“3”代表该标志后的限速为30km/h，而右上图的“3,5”则代表该标志后的线路允许速度为35km/h。限速终点标识上的C代表列车头部到达此标即解除限速，而没有C的则代表列车尾部通过后才解除限速。如果该限速地点存在与固定警告列表（WOS,Wykaz ostrzeżeń stałych）中，W9标志前需有W8标志。 |
| ![W14标志其一其二](pathname:///img/simrail/general/signal_system/poland/w14-1.webp) ![W14标志其三其四](pathname:///img/simrail/general/signal_system/poland/w14-2.webp) | **W14** | **限速路段标（临时）**<br />W14标志表示临时限速路段的起点和终点，其中黑色角向下的为限速起点，而黑色角朝上的则为限速终点。限速起点标识上的数字为限速值（单位：km/h）的0.1倍，步长5km/h。例如左上图的“3”代表该标志后的限速为30km/h，而右上图的“3,5”则代表该标志后的线路允许速度为35km/h。限速终点标识上的C代表列车头部到达此标即解除限速，而没有C的则代表列车尾部通过后才解除限速。W14标志前需有D6标志。 |
| ![W13 标志：单个障碍物的标记样式](pathname:///img/simrail/general/signal_system/poland/w13-single.webp) ![W13 标志：两个相邻障碍物的标记样式](pathname:///img/simrail/general/signal_system/poland/w13-double.webp) | **W13** | **除雪及大机作业阻碍标**<br />W13标志表示表示前面有道口、道岔、桥梁等建（构）筑物或轴温检测装置等轨旁设备，妨碍除雪机在工作状态下通过。除雪机必须在通过前及时收回除雪翼板并抬起除雪铲刀，防止损毁设备。此外，捣固机、清筛机及其他轨道机械在此区域作业时须特别小心。W13设置于被保护地点两侧各50m处。如果两个障碍物之间的距离小于150m，则视为同一个障碍物，使用双格栅标识牌。 |
| ![W8 标志：线路上样式](pathname:///img/simrail/general/signal_system/poland/w8-1.webp) ![W8 标志：杆上样式](pathname:///img/simrail/general/signal_system/poland/w8-2.webp) | **W8** | **限速预告标**<br />W8预告前方即将出现低于当前限速的限速，其中的数字为前方限速牌上的限速值（单位：km/h）的0.1倍，步长5km/h。例如上图的“6”代表该标志后的限速牌上的限速为60km/h，而下图的“4,5”则代表该标志后的限速牌上的限速为45km/h。<br />在固定警告列表(Wykaz ostrzeżeń stałych, WOS)上的W9标志前必须有W8标志，也可用于线路允许速度降低的地点前，作为W27a的预告标志。 |

### 施工标志

| 图示 | 编号 | 含义 |
| :-: | :-: | --- |
| ![DO 日间标志：黄色圆盘](pathname:///img/simrail/general/signal_system/poland/DO-day.webp) ![DO 夜间标志：柱上橙色灯光](pathname:///img/simrail/general/signal_system/poland/DO-night.webp) | **DO** | **停车牌预告标**<br />DO标志表示在标准制动距离增加200米处设有显示D1信号的停车牌。 |
| ![D1 日间标志：红色矩形牌](pathname:///img/simrail/general/signal_system/poland/D1-day.webp) ![D1 夜间标志：矩形板上方中央位置的红色灯光](pathname:///img/simrail/general/signal_system/poland/D1-night.webp)| **D1** | **停车牌**<br />D1标志用于标示因任何原因必须使列车或调车编组停车的地点，而该地点没有信号机或阻挡信号机，或者设置在该处的信号装置无法显示禁止的信号。 |
| ![D6 标志：橙色倒三角形牌](pathname:///img/simrail/general/signal_system/poland/d6.webp) | **D6** | **临时限速预告标**<br />D6预告前方即将出现低于图定限速的限速，其中的数字为前方W14临时限速牌上的限速值（单位：km/h）的0.1倍，步长5km/h。例如图的“3”代表该标志后的临时限速牌上的临时限速为30km/h，而“2,5”则代表该标志后的临时限速牌上的临时限速为25km/h。 |

### 接触网（分相）标志
<table>
  <colgroup>
    <col style={{width: '28%'}} />
    <col style={{width: '18%'}} />
  </colgroup>
  <thead>
    <tr>
      <th align="center">图示</th>
      <th align="center">编号</th>
      <th>含义</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="/img/simrail/general/signal_system/poland/We1.webp" alt="We1 标志：蓝色菱形内断开与相连的横线" loading="lazy" />
      </td>
      <td align="center">
        <strong>We1a/We1b/We1c</strong>
      </td>
      <td>
        <strong>准备降弓标</strong>
        <br />
        We1a、We1b、We1c标志表示列车必须在到达接下来的降弓标（We2a、We2b、We2c）前降下受电弓。<br />
        其中We1a适用于所有前进方向，We1b适用于开往右方线路时，而We1c适用于开往左方线路时。<br />
        准备降弓标设置在降弓标前方，在最高允许速度不大于60km/h的线路上，两者间距不得小于400m；在最高允许速度大于60km/h但小于等于100km/h的线路上，两者间距不得小于600m；在最高允许速度大于100km/h的线路上，两者间距不得小于800m。
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="/img/simrail/general/signal_system/poland/We2.webp" alt="We2a/We2b/We2c 标志：三块蓝色菱形牌" loading="lazy" />
      </td>
      <td align="center">
        <strong>We2a/We2b/We2c</strong>
      </td>
      <td>
        <strong>降弓标</strong>
        <br />
        We2a、We2b、We2c标志表示列车由标志开始必须降弓运行。<br />
        其中We2a适用于所有前进方向，We2b适用于开往右方线路时，而We2c适用于开往左方线路时。<br />
        降弓标应设置在必须降弓运行的地点前方不少于50m且不大于150m处。
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="/img/simrail/general/signal_system/poland/We3.webp" alt="We3a/We3b/We3c 标志：三块蓝色菱形牌" loading="lazy" />
      </td>
      <td align="center">
        <strong>We3a/We3b/We3c</strong>
      </td>
      <td>
        <strong>升弓标</strong>
        <br />
        We3a、We3b、We3c标志表示列车应当升起受电弓。<br />
        We3a标志适用于动车组或受电弓距离列车头部超过30m不超过200m的其他列车，设置在允许升弓位置后不少于200m且不超过250m处。We3b标志适用于电力机车，设置在允许升弓位置后不少于30m且不超过100m。We3c标志适用于长度超过200m的动车组或者受电弓距离列车头部超过200m的其他列车（例如机车位于尾部的推挽式列车），设置在允许升弓位置后不少于400m且不超过450m。
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="/img/simrail/general/signal_system/poland/We4.webp" alt="We4a/We4b/We4c 标志：三块蓝色菱形牌" loading="lazy" />
      </td>
      <td align="center">
        <strong>We4a/We4b/We4c</strong>
      </td>
      <td>
        <strong>电力机车禁入标</strong>
        <br />
        We4a、We4b、We4c标志用于表明电力机车、电力动车组等电力牵引车辆禁止越过的地点，主要用于接触网受损、接触网施工或接触网终点等区域。<br />
        其中We4a适用于所有前进方向，We4b适用于开往右方线路时，而We4c适用于开往左方线路时。<br />
         We4a、We4b、We4c标志应当设置在距离电力机车禁入区域前方15m-65m内。
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="/img/simrail/general/signal_system/poland/We8.webp" alt="We8a/We8b/We8c 标志：三块蓝色菱形牌" loading="lazy" />
      </td>
      <td align="center">
        <strong>We8a/We8b/We8c</strong>
      </td>
      <td>
        <strong>无电区标</strong>
        <br />
        We8a、We8b和We8c标志表示电力机车或电力动车组在通过该位置时，应停止从接触网获取牵引电流（惰行）；在交流电系统下，还须切断主断路器。<br />
        其中We8a适用于所有前进方向，We8b适用于开往右方线路时，而We8c适用于开往左方线路时。<br />
        We8a、We8b、We8c标志应当设置在距离接触网无电区元件不小于30m且不大于80m处。
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="/img/simrail/general/signal_system/poland/we9ab.webp" alt="We9a/We9b 标志：两块蓝色菱形牌" loading="lazy" />
      </td>
      <td align="center">
        <strong>We9a / We9b</strong>
      </td>
      <td>离开无电区间，区别参考 We3a / We3b</td>
    </tr>
  </tbody>
</table>

### 其他标志

| 图示 | 名称 | 含义 |
| :-: | :-: | --- |
| ![坡度指示器](pathname:///img/simrail/general/signal_system/poland/gradient-indicator.webp) | **坡度指示器** | 横线上为坡度（单位：‰），下为长度 |
| ![无人值守道口标志：两道交叉的斜杠，a 为单线、b 为复线](pathname:///img/simrail/general/signal_system/poland/crossing-unattended.webp) | **无人值守道口** | A——单线铁路道口；B——复线及多线铁路道口 |

## 关于波兰信号的说明

请将波兰的闭塞区间理解为：**始于该信号机，终于「另行通知」的一段低速区**。由道岔（群）造成的限速区总是依附于信号机而存在，且信号机不会是限速的终点。因此，在明确下一个限速之前，信号机要求的限速应当持续生效。

:::info

本文在 [SimRail 官方 Wiki 的波兰信号页面](https://wiki.simrail.eu/en/Tips_and_Tricks/Signal_Systems/Poland) 的排版基础上，依据《SimRail 司机手册（新第四版）》第二章「波兰铁路信号标识」整理而成。

:::
