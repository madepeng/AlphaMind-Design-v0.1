# AlphaMind V1 Software Specification

Version: 1.0 MVP (FINAL)

---

# Chapter 1 - Product Definition

## 1.1 Product Name

AlphaMind OS

---

## 1.2 Product Position

AlphaMind 是一款 AI 驱动的美股投资研究软件。

它不是：

* 荐股软件
* 自动交易软件
* 量化交易平台
* 技术指标分析软件

它的定位只有一个：

**帮助投资者建立标准化、可持续执行的投资研究流程。**

---

## 1.3 Product Mission

帮助用户每天完成一次高质量投资研究。

帮助用户减少错误交易。

帮助用户建立长期投资决策体系。

---

## 1.4 Product Vision

成为个人投资者每天都会打开的一款投资研究工具。

当用户准备买入一只股票时，第一个打开的是 AlphaMind，而不是股票软件。

---

## 1.5 Version Goal

Version 1 的目标不是盈利。

Version 1 的目标是：

让用户每天坚持使用。

每天完成一次完整研究。

形成自己的研究记录。

---

# Chapter 2 - Product Scope

Version 1 只开发下面五个模块。

## Module 1

Home

作用：

展示今天市场真正重要的信息。

包含：

* 今日市场摘要
* 三条重要事件
* AI一句话总结

---

## Module 2

Watchlist

作用：

维护自己的股票池。

功能：

* 添加股票
* 删除股票
* 排序
* 搜索

默认最多：

20 只股票。

---

## Module 3

Company

作用：

展示单家公司研究信息。

包含：

### Basic Information

公司名称

Ticker

所属行业

市值

### Latest News

最近新闻

### Latest Earnings

最近财报摘要

### AI Summary

AI 自动总结：

* 核心观点
* 风险
* 后续观察项

---

## Module 4

Decision Checklist

固定五个问题：

1. 为什么今天研究？
2. 最大利好是什么？
3. 最大风险是什么？
4. 如果判断错误怎么办？
5. 今天是否执行？

所有回答都保存。

---

## Module 5

Journal

保存每天研究记录。

支持：

* 查看历史
* 搜索
* 编辑备注

---

# Chapter 3 - User Workflow

软件启动

↓

Home

↓

选择 Watchlist 中一家公司

↓

进入 Company 页面

↓

阅读 AI Summary

↓

填写 Decision Checklist

↓

保存 Journal

↓

退出软件

整个流程控制在 15 分钟以内。

---

# Chapter 4 - Product Principles

所有功能必须遵守以下原则：

## Principle 1

Simple First

先做简单版本。

不追求功能全面。

---

## Principle 2

Research First

帮助用户研究。

不是帮助用户频繁交易。

---

## Principle 3

Explainable AI

AI 必须解释原因。

不能只输出结论。

---

## Principle 4

Evidence First

所有分析必须基于公开信息。

不得伪造数据。

不得暗示内幕消息。

---

## Principle 5

No Prediction

Version 1 不预测未来股价。

不输出：

"一定会上涨"

"可以买"

"目标价"

AI 只负责：

分析事实。

解释逻辑。

提示风险。

最终决策由用户完成。

---

# Chapter 5 - Version Freeze

Version 1 在发布之前禁止新增功能。

所有新需求统一进入：

BACKLOG.md

Version 1 完成以后再进入 Version 2 规划。

---

# Chapter 6 - Success Metrics

Version 1 成功标准：

* 用户每天打开一次软件。
* 单次使用时间控制在 10~20 分钟。
* 每次研究至少生成一条 Journal。
* Watchlist 持续维护。
* 用户能够连续使用超过 30 天。

Version 1 不以收益率作为产品成功标准。

---

# Chapter 7 - Non Goals

Version 1 明确不开发：

* 自动交易
* AI 荐股
* 自动建仓
* 技术指标（MACD、KDJ、RSI 等）
* Level2 数据
* 资金流评分
* 估值模型
* 多 Agent 协作
* 多市场（港股、A 股、Crypto）
* 社区功能
* 云同步

这些内容统一延期至 Version 2 之后。
