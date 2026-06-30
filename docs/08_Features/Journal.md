# Feature

Journal

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

Journal 用于保存用户每天的研究记录。

帮助用户形成长期投资日志。

Version 1 不分析历史数据。

只负责：

保存。

浏览。

搜索。

删除。

---

# User Story

作为投资者。

我希望：

每天完成一次研究以后。

能够自动保存。

以后能够查看：

我为什么当时这样判断。

最终验证：

我的分析是否正确。

---

# Entry

Journal 数据来源：

Decision Checklist。

字段映射遵循：

Decision.md。

来源：

Decision 页面。

点击：

Save Journal。

保存成功后。

进入：

Journal。

---

# Exit

返回：

Home。

或者：

Company。

---

# Layout

页面分为：

---

Toolbar

---

Journal List

---

Journal Detail

---

采用左右布局。

左侧：

历史列表。

右侧：

详情。

---

# Toolbar

包含：

Search

Version1

Sort：Coming Soon

Refresh：Coming Soon

---

# Search

Version1

支持：

Ticker

Date

模糊搜索。

Company Name 不保存到数据库。

Company Name 通过 Ticker 动态映射显示。

实时过滤。

---

# Journal List

每条记录显示：

Date

Ticker

Decision

Summary

Version1

summary 允许为空。

如果为空：

显示：

No AI Summary Yet.

例如：

2026-06-30

MU

Hold

No AI Summary Yet.

---

# Detail

点击：

Journal。

右侧显示：

---

Ticker

Date

---

AI Summary

Version1

允许为空。

如果为空：

显示：

No AI Summary Yet.

T008 接入 OpenAI 后再写入真实 AI Summary。

---

Question 1

---

Question 2

---

Question 3

---

Question 4

---

Decision

---

Note

---

完整展示保存内容。

---

# Delete

点击：

Delete。

弹出确认：

Delete this journal?

Options

Cancel

Delete

删除后：

列表自动刷新。

---

# Empty

第一次启动。

没有记录。

显示：

No Journal Yet.

Start your first research.

---

# Loading

Skeleton。

---

# Error

Retry。

---

# API

GET

/api/v1/journal

GET

/api/v1/journal/{id}

POST

/api/v1/journal

DELETE

/api/v1/journal/{id}

---

# Components

JournalPage

Toolbar

SearchBox

SortButton

JournalList

JournalCard

JournalDetail

DeleteDialog

EmptyView

LoadingView

ErrorView

---

# State

Idle

Loading

Loaded

Empty

Error

---

# Performance

1000 条记录以内。

打开时间：

小于 1 秒。

搜索：

即时。

删除：

即时。

---

# Acceptance Criteria

能够：

查看 Journal。

搜索 Journal。

排序 Journal。

删除 Journal。

查看 Detail。

重启后数据仍存在。

Version 1 即视为完成。

summary 为空时页面正常显示。

---

# Out Of Scope

Version 1 不开发：

导出 PDF

导出 Excel

AI 复盘

统计图

收益分析

标签

收藏

分享

同步

云备份

全部延期。

---

# Developer Notes

Journal 永远保存原始内容。

禁止 AI 自动修改历史记录。

历史记录一经保存。

除 Note 外。

其它字段不可编辑。

保证研究记录真实性。
