# SPRINT_01.md

Sprint

Sprint 1

Version

1.0 MVP

Duration

14 Days

Status

READY

Goal

完成 AlphaMind V1 MVP。

交付：

一个可以正常运行的桌面软件。

---

# Sprint Objective

Sprint 1 不追求完整功能。

只完成：

能够每天完成一次完整投资研究。

用户流程：

Home

↓

Watchlist

↓

Company

↓

Decision

↓

Journal

结束。

---

# Definition of Success

Sprint 结束后。

用户可以：

启动软件。

↓

建立自己的股票池。

↓

查看公司。

↓

获得 AI 分析。

↓

填写 Checklist。

↓

保存 Journal。

↓

关闭软件。

整个流程成功。

即视为 Sprint 完成。

---

# Task List

---

Task 001

---

Title

Initialize Project

Priority

P0

Estimated

4 Hours

Description

创建：

Electron

React

FastAPI

SQLite

项目。

Acceptance

项目启动成功。

Electron 正常打开。

前后端通信正常。

---

---

Task 002

---

Title

Implement Database

Priority

P0

Estimated

4 Hours

Description

创建：

watchlist

journal

settings

三张表。

Acceptance

应用启动自动建库。

自动建表。

---

---

Task 003

---

Title

Implement Home

Priority

P0

Estimated

1 Day

Acceptance

显示：

Today's Market

Today's Events

AI Summary

Loading

Error

Empty

全部完成。

---

---

Task 004

---

Title

Implement Watchlist

Priority

P0

Estimated

1 Day

Acceptance

支持：

新增

删除

搜索

保存

进入 Company

---

---

Task 005

---

Title

Implement Company

Priority

P0

Estimated

2 Days

Acceptance

Header

News

AI Summary

Decision

Save

全部完成。

---

---

Task 006

---

Title

Implement Decision Checklist

Priority

P0

Estimated

1 Day

Acceptance

五个问题。

保存。

校验。

完成。

---

---

Task 007

---

Title

Implement Journal

Priority

P0

Estimated

1 Day

Acceptance

查看。

搜索。

删除。

详情。

完成。

---

---

Task 008

---

Title

Integrate OpenAI

Priority

P0

Estimated

1 Day

Acceptance

Company Analysis

正常返回。

异常处理完成。

---

---

Task 009

---

Title

Implement Settings

Priority

P1

Estimated

4 Hours

Acceptance

保存：

API Key

Model

Theme

完成。

---

---

Task 010

---

Title

Packaging

Priority

P0

Estimated

4 Hours

Acceptance

生成：

macOS App

Windows App

正常启动。

---

# Git Commit Rules

一个 Task。

一个 Commit。

例如：

```text id="cyr8h8"
feat(init): bootstrap project

feat(home): implement dashboard

feat(company): add company page

feat(journal): implement journal
```

禁止：

一个 Commit 完成多个 Task。

---

# Pull Request Rules

每个 Task：

一个 PR。

PR 模板：

Description

Screenshot

Checklist

Acceptance

Review

---

# Acceptance Checklist

Task 完成前。

必须检查：

* 编译成功
* TypeScript 无错误
* Python 无错误
* API 可调用
* Loading 完成
* Error 完成
* Empty 完成
* UI 与 UI_SPEC 一致

否则：

不得 Merge。

---

# Daily Target

Day 1

Project

Database

Day 2

Home

Day 3

Watchlist

Day 4

Company

Day 5

Decision

Day 6

Journal

Day 7

AI

Day 8

Settings

Day 9

Bug Fix

Day 10

Refactor

Day 11

Testing

Day 12

UI Polish

Day 13

Packaging

Day 14

Release

---

# Out of Scope

Sprint 1

禁止新增：

Feature

页面

Provider

数据库

API

全部进入：

Backlog。

---

# Release Criteria

满足以下条件。

允许发布：

应用可启动。

主流程可完成。

AI 正常分析。

Journal 正常保存。

无阻塞 Bug。

Build 成功。

生成安装包。

即：

Release AlphaMind V1.

---

# Sprint Review

Sprint 完成后。

统一 Review：

功能。

Bug。

体验。

所有新增需求。

禁止插入 Sprint1。

统一进入：

Sprint2 Backlog。

---

# Final Principle

Sprint 1 的目标：

不是做最好。

而是：

做出来。

Version 1 发布以后。

所有优化。

进入：

Version 2。
