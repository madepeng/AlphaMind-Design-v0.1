# TASK_BOARD.md

Version: 1.0 MVP

Status: READY

Owner: Product / Engineering

Sprint: Sprint 1

---

# Sprint Goal

完成 AlphaMind V1 MVP。

交付一个可以正常运行的桌面应用。

完整用户流程：

Home

↓

Watchlist

↓

Company

↓

Decision

↓

Journal

---

# Workflow

每个 Task 必须经过以下状态：

```text
Todo

↓

In Progress

↓

Code Complete

↓

Review

↓

Test Passed

↓

Merged

↓

Done
```

禁止跳过任何状态。

---

# Task T001

Title

Initialize Project

Priority

P0

Owner

Codex

Status

Todo

Dependencies

None

Description

初始化项目：

* Electron
* React
* TypeScript
* FastAPI
* SQLModel
* SQLite
* Tailwind CSS

Deliverables

* frontend/
* backend/
* docs/
* tests/

Acceptance

* 项目可以启动
* Electron 可以打开窗口
* Frontend 与 Backend 可以通信

Commit

```text
feat(init): bootstrap AlphaMind project
```

---

# Task T002

Title

Database Initialization

Priority

P0

Owner

Codex

Status

Todo

Dependencies

T001

Description

创建：

* watchlist
* journal
* settings

实现数据库自动初始化。

Acceptance

首次启动自动创建：

alphamind.db

Commit

```text
feat(database): initialize sqlite schema
```

---

# Task T003

Title

Home Page

Priority

P0

Owner

Codex

Status

Todo

Dependencies

T001

Reference

Home.md

Acceptance

完成：

* Today's Market
* Today's Events
* AI Daily Summary
* Loading
* Empty
* Error

Commit

```text
feat(home): implement home dashboard
```

---

# Task T004

Title

Watchlist

Priority

P0

Owner

Codex

Status

Todo

Dependencies

T002

Reference

Watchlist.md

Acceptance

支持：

* Add
* Delete
* Search
* Save
* Open Company

Commit

```text
feat(watchlist): implement watchlist feature
```

---

# Task T005

Title

Company

Priority

P0

Owner

Codex

Status

Todo

Dependencies

T003

T004

Reference

Company.md

Acceptance

完成：

* Header
* News
* AI Summary
* Decision Checklist
* Save Journal

Commit

```text
feat(company): implement company page
```

---

# Task T006

Title

Decision Checklist

Priority

P0

Owner

Codex

Status

Todo

Dependencies

T005

Reference

Decision.md

Acceptance

完成：

* 四个文本输入
* Decision 下拉框
* Save
* Validation

Commit

```text
feat(decision): implement checklist
```

---

# Task T007

Title

Journal

Priority

P0

Owner

Codex

Status

Todo

Dependencies

T006

Reference

Journal.md

Acceptance

完成：

* List
* Detail
* Search
* Delete

Commit

```text
feat(journal): implement journal
```

---

# Task T008

Title

OpenAI Integration

Priority

P0

Owner

Codex

Status

Todo

Dependencies

T005

Description

调用 OpenAI Responses API。

实现：

Company Analysis。

Acceptance

输入股票代码。

返回：

* Summary
* Bull Case
* Risks
* Watch Items

Commit

```text
feat(ai): integrate OpenAI analysis
```

---

# Task T009

Title

Settings

Priority

P1

Owner

Codex

Status

Todo

Dependencies

T002

Acceptance

支持：

* 保存 API Key
* 保存模型
* 保存主题

Commit

```text
feat(settings): implement settings page
```

---

# Task T010

Title

Packaging

Priority

P0

Owner

Codex

Status

Todo

Dependencies

全部完成

Acceptance

生成：

* macOS 安装包
* Windows 安装包

应用可以正常安装。

Commit

```text
build(release): package AlphaMind MVP
```

---

# Sprint Rules

1. 一次只开发一个 Task。
2. 一个 Task 对应一个 Commit。
3. 一个 Commit 对应一个 Pull Request。
4. Review 未通过不得进入下一个 Task。
5. Sprint 期间禁止新增功能。

---

# Code Review Checklist

每个 Task 必须检查：

* Build 成功
* TypeScript 无错误
* Python 无错误
* API 正常
* Loading 正常
* Error 正常
* Empty 正常
* UI 与 UI_SPEC 一致

全部通过后才能 Merge。

---

# Sprint Completion Criteria

Sprint 1 完成标准：

* 所有 P0 Task 完成
* 无阻塞级 Bug
* 主流程可完整执行
* 安装包可运行
* 文档与实现一致

满足以上条件即可发布：

**AlphaMind OS v1.0 MVP**
