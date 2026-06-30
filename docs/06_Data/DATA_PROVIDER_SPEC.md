# DATA_PROVIDER_SPEC.md

Version

1.0

Status

FINAL

Owner

Architecture

---

# Goal

统一 AlphaMind V1 的所有数据来源。

任何页面不得自行选择数据源。

任何新增数据源必须修改本文件。

Version 1 数据源冻结。

---

# Design Principles

Version 1 只使用免费数据。

优先保证：

* 稳定
* 简单
* 快速开发

不追求数据最全面。

---

# Data Provider Overview

| Data   | Provider         | Version |
| ------ | ---------------- | ------- |
| 股票基础信息 | Yahoo Finance    | V1      |
| 股票行情   | Yahoo Finance    | V1      |
| 公司简介   | Yahoo Finance    | V1      |
| 财报摘要   | Yahoo Finance    | V1      |
| 新闻     | Finnhub Free API | V1      |
| AI分析   | OpenAI API       | V1      |

Version 1 不接：

Polygon

IEX Cloud

Alpha Vantage

Financial Modeling Prep

全部延期。

---

# Provider 1

Yahoo Finance

用途：

提供：

* 公司名称
* 股票代码
* 行业
* 市值
* 当前价格
* 当日涨跌

Backend：

统一封装：

MarketDataService

所有页面禁止直接调用。

---

# Provider 2

Finnhub

用途：

最近新闻。

限制：

最多返回：

10 条。

统一格式：

title

publishedAt

url

summary

Backend：

NewsService

统一封装。

---

# Provider 3

OpenAI

用途：

AI 分析。

Prompt：

Company Prompt。

Version 1：

只有一个 Prompt。

所有分析统一调用：

AIService。

禁止多个 Prompt。

---

# Backend Layer

Backend 统一采用：

Repository Pattern

结构：

MarketDataService

↓

NewsService

↓

AIService

↓

API

Frontend 永远不知道数据来自哪里。

---

# DTO

CompanyDTO

包含：

ticker

companyName

industry

marketCap

price

changePercent

news

earningsSummary

aiSummary

Frontend 永远只接收 CompanyDTO。

---

# Cache

Version 1

内存缓存：

5 分钟。

应用关闭：

缓存清空。

Version 1 不引入：

Redis。

---

# Error Handling

如果数据源失败：

显示：

Data unavailable.

允许继续进入页面。

AI 分析不可用时：

Company 页面仍然可打开。

---

# Timeout

外部请求：

10 秒。

超过：

返回失败。

不重试。

---

# Retry

Version 1：

用户手动 Retry。

不自动重试。

---

# Logging

记录：

请求时间

Provider

耗时

状态

仅输出到本地日志。

---

# Security

API Key

统一保存在：

settings

表。

禁止硬编码。

禁止提交 Git。

---

# Mock Strategy

开发阶段：

允许 Mock。

上线前：

必须替换真实 Provider。

---

# Acceptance Criteria

完成以下内容：

* 所有数据统一来自 Data Provider。
* 前端不直接访问第三方接口。
* Provider 可独立替换。
* 所有 Provider 均通过统一 Service 暴露。
* Company 页面只依赖 CompanyDTO。
