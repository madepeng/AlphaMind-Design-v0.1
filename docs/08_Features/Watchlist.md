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

点击：

某一家公司。

进入：

Company 页面。

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

点击：

进入 Company。

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

点击。

进入Company。

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
