# Feature

Watchlist

Status

FINAL

Priority

P0

Owner

Product

Estimated

1 Day

---

# Goal

帮助用户建立自己的长期研究股票池。

Watchlist 是整个 AlphaMind 的核心入口。

Version1：

只允许维护：

20只股票。

---

# Why

普通投资者每天面对：

5000+

股票。

无法深入研究。

AlphaMind：

帮助用户：

长期关注：

20家公司。

建立：

长期认知。

而不是：

天天看排行榜。

---

# User Story

作为投资者。

我希望：

维护自己的股票池。

每天：

只研究这些公司。

而不是：

浏览整个市场。

---

# Entry

Home

↓

Watchlist

---

# Exit

Version1

点击：

某一家公司。

显示：

Coming Soon。

Company 页面将在 T005 实现。

本阶段不跳转。

---

# Layout

顶部：

Search

中间：

Watchlist

底部：

Add Button

页面保持：

一屏。

无需滚动。

---

# Search

支持：

Ticker

例如：

NVDA

META

MSFT

AAPL

MU

搜索：

公司名称。

例如：

Micron

Apple

Microsoft

Meta

Version1：

搜索：

实时。

---

# List Item

每个股票显示：

Ticker

Company Name

Current Price

Today's Change

点击 Company Card：

进入 Company 页面。

---

# Add

点击：

Add。

弹出：

Search Dialog。

搜索。

选择。

加入。

---

# Remove

鼠标悬停。

显示：

Delete。

点击：

删除。

无需确认。

---

# Limit

最多：

20家公司。

超过：

提示：

Watchlist is full.

---

# Empty

第一次启动。

默认：

空。

显示：

Add your first company.

---

# Loading

Skeleton。

---

# Error

Retry。

---

# API

GET

/watchlist

POST

/watchlist

DELETE

/watchlist/{ticker}

---

# Components

WatchlistPage

SearchBox

CompanyCard

AddDialog

EmptyView

LoadingView

ErrorView

---

# State

Idle

Loading

Loaded

Error

Empty

---

# Acceptance

能够：

新增。

删除。

搜索。

点击股票后进入 Company。


数据保存。

重启恢复。

全部通过。

即完成。

---

# Out Of Scope

Version1

不支持：

分类。

标签。

置顶。

颜色。

分组。

导入。

导出。

同步。

全部延期。

---

# Developer Notes

Version1。

不要：

复杂动画。

不要：

分页。

不要：

Infinite Scroll。

最多20条。

全部加载。

# Developer Notes

Version1

Company Name 使用 Mock。

例如：

NVDA → NVIDIA

AAPL → Apple

TSM → TSMC

其它未知 Ticker：

Company Name = Ticker。

后续版本由 Market Provider 提供真实公司名称。
