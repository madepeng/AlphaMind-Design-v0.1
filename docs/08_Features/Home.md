# Feature 001

Name

Home Dashboard

Status

FINAL

Priority

P0

Estimated

1 Day

---

# Goal

Home 页面负责帮助用户在 30 秒内了解：

今天是否有值得重新研究的市场变化。

不是展示所有信息。

只展示真正重要的信息。

---

# User Story

作为一名投资者。

每天打开 AlphaMind。

我希望：

快速知道：

今天是否发生了重要事件。

是否需要重新研究我的股票。

而不是浏览大量新闻。

---

# Entry

应用启动后。

默认进入 Home 页面。

---

# Exit

用户点击：

Watchlist

进入股票池。

或者：

点击某条事件。

Version1：

仅保留点击交互。

显示：

Coming Soon

真正进入 Company 页面将在 T005 实现。

---

# Layout

页面采用：

Sidebar

+

Main Content

+

Right Panel

Main Content：

Today's Market

↓

Today's Key Events

Right Panel：

AI Daily Summary

Version1

AI Daily Summary 不在 Main Content 中重复显示。

---

页面不展示：

K线。

排行榜。

技术指标。

---

# Section 1

Today's Market

显示：

Nasdaq

S&P500

SOX

三个指数。

每项包括：

指数名称

涨跌幅

更新时间

---

# Section 2

Today's Key Events

最多展示：

3 条。

每条包括：

标题

一句摘要

Version1

不要显示：

- 影响股票数量
- Impact Count
- Severity

点击：

仅保留点击交互。

显示：

Coming Soon

真正进入 Company 页面将在 T005 实现。

---

# Right Panel

AI Daily Summary

Version1

AI Daily Summary 显示在 Right Panel。

Home Main Content 不再重复显示。

如果暂无数据：

显示 Empty State。
---

# Loading

进入页面：

先显示 Skeleton。

数据返回后：

渲染。

---

# Empty State

如果没有数据。

显示：

Today has no major market events.

---

# Error State

如果接口失败。

显示：

Retry

按钮。

允许重新加载。

---

# API

GET

/api/v1/home

返回：

```json
{
  "market":{
      "nasdaq":1.2,
      "sp500":0.8,
      "sox":2.1
  },
  "events":[
      ...
  ],
  "summary":"..."
}
```

---

# Component

HomePage

MarketCard

EventCard

SummaryCard

LoadingView

ErrorView

---

# Navigation

Home

↓

点击 Event

↓

Company

---

# Acceptance Criteria

完成以下功能：

首页正常显示。

Market 正常刷新。

Events 正常展示。

Summary 正常展示。

Loading 正常。

Error 正常。

Empty 正常。

全部通过即完成。

---

# Out Of Scope

Version1

不开发：

市场热力图

资金流

新闻分类

可配置首页

行情图

全部延期。

---

# Developer Notes

不要增加动画。

不要增加复杂图表。

页面保持：

干净。

快速。

易读。

整个 Home 页面控制在：

一屏以内。
