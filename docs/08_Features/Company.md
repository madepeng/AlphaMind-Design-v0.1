# Feature

Company

Status

FINAL

Priority

P0

Owner

Product

Estimated

2 Days

---

# Goal

Company 页面是 AlphaMind 的核心页面。

用户在这里完成一家公司的一次完整研究。

Version 1 不提供交易建议。

只提供研究信息。

---

# User Story

作为投资者。

我希望快速了解一家公司：

* 它是谁
* 今天发生了什么
* AI 如何分析
* 有哪些风险
* 是否值得继续关注

然后完成自己的判断。

---

# Entry

来源：

Watchlist

点击任意股票。

进入 Company 页面。

---

# Exit

返回 Watchlist。

或者：

进入 Journal。

T007 起：

Journal 入口可用。

---

# Layout

页面分为五个区域。

---

Company Header

---

Latest News

---

AI Summary

---

Decision Checklist

---

Journal Shortcut

---

页面采用垂直布局。

支持滚动。

---

# Section 1

Company Header

显示：

Version1

Ticker

Company Name

Current Price（Mock）

Today's Change（Mock）

Industry（Mock）

Market Cap（Mock）

---

# Section 2

Latest News

最多显示：

10 条新闻。

Version1

使用 Mock News。

不要接入真实新闻 Provider。

每条显示：

标题

发布时间

来源

点击：

浏览器打开原文。

Version 1 不支持：

新闻搜索。

新闻分类。

新闻收藏。

---

# Section 3

AI Summary

AI 返回四部分内容。

## Summary

100~200 字。

总结今天最重要的信息。

---

## Bull Case

最多三条。

说明：

积极因素。

---

## Risk

最多三条。

说明：

主要风险。

---

## Watch Items

最多三条。

说明：

未来需要继续关注的事件。

例如：

* 下一次财报
* 产品发布
* HBM 出货
* AI CapEx

---

# Section 4

Decision Checklist

固定四个输入项 + 一个 Decision 选择。

Question 1

为什么今天研究？

Question 2

最大的利好是什么？

Question 3

最大的风险是什么？

Question 4

如果判断错误怎么办？

Decision

今天是否执行？

允许值：

Buy

Hold

Sell

Watch

---

# Section 5

## Journal Shortcut

T007 起：

显示：

Save Journal

按钮。

点击：

调用：

POST /api/v1/journal

保存当前 Decision Checklist 内容。

保存成功后：

进入 Journal 页面。

保存字段映射遵循：

docs/08_Features/Decision.md

Version1

不保存 Company Name。

不保存 News。

不保存 Market Data。

summary 允许为空。
---

# Loading

Company Header

Skeleton

News

Skeleton

AI Summary

Loading

Checklist

Disabled

直到 AI 返回。

---

# Empty

如果没有新闻：

显示：

No recent news.

如果 AI 返回为空：

显示：

AI analysis unavailable.

用户仍可填写 Checklist。

---

# Error

任何模块失败：

只影响当前模块。

其它模块继续工作。

例如：

News 获取失败。

AI Summary 正常。

Checklist 仍然可填写。

---

# API

GET

/company/{ticker}

返回：

CompanyDTO

## Version1 API Scope

T008

使用：

GET /api/v1/company/{ticker}

POST /api/v1/analyze

POST /api/v1/journal

Company 页面：

点击 Analyze：

调用：

POST /api/v1/analyze

获取真实 AI Summary。

点击 Save Journal：

调用：

POST /api/v1/journal

保存当前研究记录。

Version1：

不支持 Streaming。

不支持 Chat。

不支持多轮对话。

---

# Components

CompanyPage

HeaderCard

NewsList

SummaryCard

ChecklistCard

JournalButton

LoadingView

ErrorView

---

# State

Idle

Loading

Loaded

Error

---

# Performance

首次打开：

小于 3 秒。

AI 分析：

小于 15 秒。

新闻：

小于 5 秒。

---

# Acceptance Criteria

满足以下条件：

可以正常进入页面。

Header 正常显示。

News 正常显示。

AI Summary 正常显示。

Checklist 可填写。

Journal Shortcut：

显示按钮。

点击：

调用 POST /api/v1/journal。

保存成功后进入 Journal 页面。

任何模块失败不会影响其它模块。

Version 1 即视为完成。

---

# Out Of Scope

Version 1 不开发：

K线

MACD

RSI

Level2

估值模型

资金流

财务图表

盈利预测

目标价

Portfolio

全部延期。

---

# Developer Notes

Company 页面禁止出现：

Buy Rating

Target Price

Strong Buy

Strong Sell

任何形式的自动投资建议。

AI 仅分析事实。

所有投资决策由用户自行完成。
