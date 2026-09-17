---
sidebar_position: 4
title: 纸质时刻表（路书）
description: 本文介绍 SimRail（模拟铁路）中纸质时刻表（路书）的车次编号规则与列车分类方法，涵盖调度辖区编号、始发终到同辖区的车次、四/五/六位数车次的分配规则，以及旅客、货物、单机、检修维保等列车类型及其牵引类型代号对照。
keywords: [SimRail, 路书, 时刻表, 车次编号, 列车类型, PKP PLK]
tags: [SimRail, 路书]
slug: /general/timetable
---
## 纸质时刻表（路书）

![纸质时刻表（路书）示例](/img/simrail/general/timetable/timetable.webp)

## 车次编号

国内旅客列车以4位或5位数字编号。  
国内货物列车、维修养护列车及非商业列车以6位数字编号。  
国内列车4位、5位或6位编号中，第一位数字表示列车始发站所在调度辖区编号。  
国内列车4位、5位或6位编号中，第二位数字表示列车终到站所在调度辖区编号。  
其余数字表示列车类型。建议在同一日内，针对特定类型和特定区间的列车按顺序编号。

### 调度辖区编号

华沙 — 1  
卢布林 — 2  
克拉科夫 — 3  
索斯诺维茨 — 4  
格但斯克 — 5  
弗罗茨瓦夫 — 6  
波兹南 — 7  
什切青 — 8  
预留 — 9

### 始发终到位于同一调度辖区的车次编号

10, 11, 19, 91, 93, 97, 99 — 华沙  
20, 22, 29 — 卢布林  
30, 33, 39 — 克拉科夫  
40, 44, 49, 94 — 索斯诺维茨  
50, 55, 59, 90, 95, 96 — 格但斯克  
66, 60, 69 — 弗罗茨瓦夫  
77, 70, 79 — 波兹南  
88, 80 — 什切青  
89, 92, 98 —预留

### 四位数车次

1.第3位和第4位数字在00–99范围内分配给国内快速旅客列车：  
a. 国内特快（含城际列车）— EI

### 五位数车次

1.第3、4、5位数字在001–049范围内分配给国际旅客列车：  
a.国际特快 EuroCity — EC  
b.国际夜间特快 EuroNight — EN  
c.国际快速列车 — MM  
2.第3、4、5位数字在050–169范围内分配给国内快速旅客列车：  
a.省际快速列车 — MP  
b.省内快速列车 — RP  
3.第3、4、5位数字在170–199范围内分配给国内夜间或酒店型快速旅客列车：  
a.省际夜间或酒店型快速列车 — MH  
4.第3、4、5位数字在200–999范围内分配给其他旅客列车。

### 六位数车次

#### 第三位数字

1.国际货物列车 — 0：  
a.用于联运运输单元 — TC  
2.国际货物列车 — 1：  
a.用于大宗运输 — TG  
b.用于非大宗运输 — TR  
3.国内货物列车 — 2：  
a.用于联运运输单元 — TD  
4.国内货物列车 — 3：  
a.用于非大宗运输 — TN  
b.用于车站及专用线作业 — TK  
5.国内货物列车 — 4：  
a.用于大宗运输 — TM  
6.货物列车 — 5：  
a.用于送修/修竣及试运转货车 — TS  
b.由3台以上机车组成的机车组 — TH  
c.前往/来自牵引货车的单机— LT  
7.非商业旅客列车 — 6：  
a.回送的旅客列车车组 — PW  
b.空旅客车组（试运转、停用牵引及辅助车辆、机车组）— PX  
c.前往/来自牵引客车的单机— LP  
8.旅客及货物列车 — 7、8：  
a.预留  
9.维修养护列车 — 9：  
a.检查及诊断列车 — ZN  
b.其他维修列车 — ZU  
c.前往/来自牵引维修养护列车的单机 — LZ  
d.其他单机、调车机车、特种铁路车辆、辅助车辆 — LS  
10.救援列车 — ZG 采用以11或12开头的两位数字编号。

#### 其他数字

六位数的第4、5、6位数字范围为000–899。  
六位数的第4、5、6位数字在900–999范围内时，用于因延误超过24小时而需要更改车次号的情况，以避免车次号重复。

## 列车类型

### 旅客列车

<table className="table table-bordered">
  <thead>
    <tr>
      <th rowSpan="3">列车类型</th>
      <th colSpan="5">牵引类型</th>
    </tr>
    <tr>
      <th rowSpan="2">蒸汽</th>
      <th colSpan="2">电力</th>
      <th colSpan="2">内燃</th>
    </tr>
    <tr>
      <th>机车</th>
      <th>动车组</th>
      <th>机车</th>
      <th>动车组</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>EuroCity - 国际特快</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>ECE</td><td style={{ textAlign: 'center' }}>ECJ</td><td style={{ textAlign: 'center' }}>ECS</td><td style={{ textAlign: 'center' }}>ECM</td></tr>
    <tr><td>EuroNight – 国际夜间特快</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>ENE</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>ENS</td><td style={{ textAlign: 'center' }}>-</td></tr>
    <tr><td>国内特快（含城际列车）</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>EIE</td><td style={{ textAlign: 'center' }}>EIJ</td><td style={{ textAlign: 'center' }}>EIS</td><td style={{ textAlign: 'center' }}>EIM</td></tr>
    <tr><td>国际快速列车</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>MME</td><td style={{ textAlign: 'center' }}>MMJ</td><td style={{ textAlign: 'center' }}>MMS</td><td style={{ textAlign: 'center' }}>MMM</td></tr>
    <tr><td>省际快速列车</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>MPE</td><td style={{ textAlign: 'center' }}>MPJ</td><td style={{ textAlign: 'center' }}>MPS</td><td style={{ textAlign: 'center' }}>MPM</td></tr>
    <tr><td>省际夜间或酒店型快速列车</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>MHE</td><td style={{ textAlign: 'center' }}>MHJ</td><td style={{ textAlign: 'center' }}>MHS</td><td style={{ textAlign: 'center' }}>-</td></tr>
    <tr><td>省级普通列车</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>MOE</td><td style={{ textAlign: 'center' }}>MOJ</td><td style={{ textAlign: 'center' }}>MOS</td><td style={{ textAlign: 'center' }}>MOM</td></tr>
    <tr><td>区域普通列车（国际）</td><td style={{ textAlign: 'center' }}>RMP</td><td style={{ textAlign: 'center' }}>RME</td><td style={{ textAlign: 'center' }}>RMJ</td><td style={{ textAlign: 'center' }}>RMS</td><td style={{ textAlign: 'center' }}>RMM</td></tr>
    <tr><td>区域快速列车</td><td style={{ textAlign: 'center' }}>RPP</td><td style={{ textAlign: 'center' }}>RPE</td><td style={{ textAlign: 'center' }}>RPJ</td><td style={{ textAlign: 'center' }}>RPS</td><td style={{ textAlign: 'center' }}>RPM</td></tr>
    <tr><td>区域普通列车</td><td style={{ textAlign: 'center' }}>ROP</td><td style={{ textAlign: 'center' }}>ROE</td><td style={{ textAlign: 'center' }}>ROJ</td><td style={{ textAlign: 'center' }}>ROS</td><td style={{ textAlign: 'center' }}>ROM</td></tr>
    <tr><td>区域普通列车（城市通勤）</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>RAE</td><td style={{ textAlign: 'center' }}>RAJ</td><td style={{ textAlign: 'center' }}>RAS</td><td style={{ textAlign: 'center' }}>RAM</td></tr>
    <tr><td>回送的旅客列车车底</td><td style={{ textAlign: 'center' }}>PWP</td><td style={{ textAlign: 'center' }}>PWE</td><td style={{ textAlign: 'center' }}>PWJ</td><td style={{ textAlign: 'center' }}>PWS</td><td style={{ textAlign: 'center' }}>PWM</td></tr>
    <tr><td>空旅客车组（试运转、停用牵引及辅助车辆、机车组）</td><td style={{ textAlign: 'center' }}>PXP</td><td style={{ textAlign: 'center' }}>PXE</td><td style={{ textAlign: 'center' }}>PXJ</td><td style={{ textAlign: 'center' }}>PXS</td><td style={{ textAlign: 'center' }}>PXM</td></tr>
  </tbody>
</table>



### 货物列车

<table className="table table-bordered">
  <thead>
    <tr>
      <th rowSpan="3">列车类型</th>
      <th colSpan="5">牵引类型</th>
    </tr>
    <tr>
      <th rowSpan="2">蒸汽</th>
      <th colSpan="2">电力</th>
      <th colSpan="2">内燃</th>
    </tr>
    <tr>
      <th>机车</th>
      <th>动车组</th>
      <th>机车</th>
      <th>动车组</th>
    </tr>
  </thead>
  <tbody>
    <tr><td colSpan="6" style={{ textAlign: 'center', fontWeight: 'bold' }}>1. 国际运输货物列车</td></tr>
    <tr><td>国际多式联运</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TCE</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TCS</td><td style={{ textAlign: 'center' }}>-</td></tr>
    <tr><td>国际大宗运输</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TGE</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TGS</td><td style={{ textAlign: 'center' }}>-</td></tr>
    <tr><td>国际零散运输</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TRE</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TRS</td><td style={{ textAlign: 'center' }}>-</td></tr>
    <tr><td colSpan="6" style={{ textAlign: 'center', fontWeight: 'bold' }}>2.国内运输货物列车</td></tr>
    <tr><td>用于多式联运单元的国内运输，以及用于运输或前往运输多式联运单元的空平板车</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TDE</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TDS</td><td style={{ textAlign: 'center' }}>-</td></tr>
    <tr><td>大宗运输</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TME</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TMS</td><td style={{ textAlign: 'center' }}>-</td></tr>
    <tr><td>非大宗运输</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TNE</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TNS</td><td style={{ textAlign: 'center' }}>-</td></tr>
    <tr><td>车站和专用线作业</td><td style={{ textAlign: 'center' }}>TKP</td><td style={{ textAlign: 'center' }}>TKE</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TKS</td><td style={{ textAlign: 'center' }}>-</td></tr>
    <tr><td>送修/修竣、试运转货车及其他列车</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>TSE</td><td style={{ textAlign: 'center' }}>TSJ</td><td style={{ textAlign: 'center' }}>TSS</td><td style={{ textAlign: 'center' }}>TSM</td></tr>
    <tr><td>机车组——3台以上机车</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>THE</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>THS</td><td style={{ textAlign: 'center' }}>-</td></tr>
  </tbody>
</table>



### 单机

<table className="table table-bordered">
  <thead>
    <tr>
      <th rowSpan="3">列车类型</th>
      <th colSpan="5">牵引类型</th>
    </tr>
    <tr>
      <th rowSpan="2">蒸汽</th>
      <th colSpan="2">电力</th>
      <th colSpan="2">内燃</th>
    </tr>
    <tr>
      <th>机车</th>
      <th>动车组</th>
      <th>机车</th>
      <th>动车组</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>来自/前往旅客列车的单机</td><td style={{ textAlign: 'center' }}>LPP</td><td style={{ textAlign: 'center' }}>LPE</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>LPS</td><td style={{ textAlign: 'center' }}>-</td></tr>
    <tr><td>来自/前往货物列车的单机</td><td style={{ textAlign: 'center' }}>LTP</td><td style={{ textAlign: 'center' }}>LTE</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>LTS</td><td style={{ textAlign: 'center' }}>-</td></tr>
    <tr><td>来自/前往，检修/维保列车的单机、分类为特种滚动轴承/专用施工车辆的铁路车辆、辅助车辆</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>LZE</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>LZS</td><td style={{ textAlign: 'center' }}>-</td></tr>
    <tr><td>来自/前往调车作业的机车、其他单机、分类为特种车辆/专用施工车辆的铁路车辆、辅助车辆</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>LSE</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>LSS</td><td style={{ textAlign: 'center' }}>-</td></tr>
  </tbody>
</table>



### 检修维保列车

<table className="table table-bordered">
  <thead>
    <tr>
      <th rowSpan="3">列车类型</th>
      <th colSpan="5">牵引类型</th>
    </tr>
    <tr>
      <th rowSpan="2">蒸汽</th>
      <th colSpan="2">电力</th>
      <th colSpan="2">内燃</th>
    </tr>
    <tr>
      <th>机车</th>
      <th>动车组</th>
      <th>机车</th>
      <th>动车组</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>救援列车</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>ZGE</td><td style={{ textAlign: 'center' }}>ZGJ</td><td style={{ textAlign: 'center' }}>ZGS</td><td style={{ textAlign: 'center' }}>ZGM</td></tr>
    <tr><td>检查与诊断列车</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>ZNE</td><td style={{ textAlign: 'center' }}>ZNJ</td><td style={{ textAlign: 'center' }}>ZNS</td><td style={{ textAlign: 'center' }}>ZNM</td></tr>
    <tr><td>其他维保列车</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>ZUE</td><td style={{ textAlign: 'center' }}>-</td><td style={{ textAlign: 'center' }}>ZUS</td><td style={{ textAlign: 'center' }}>ZUM</td></tr>
  </tbody>
</table>



## 参考
- PKP PLK Instrukcja Ir-11：[Instrukcja Ir-11 o rozkładzie jazdy (12.10.2021)](https://wiki.plrail.com/file/simrail/general/timetable/Instrukcja_Ir-11_o_rozkladzie_jazdy_12_10__2021.pdf)