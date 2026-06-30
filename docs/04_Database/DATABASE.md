# DATABASE.md

Version: 1.0 MVP

Status: FINAL

Owner: Engineering

---

# Goal

定义 AlphaMind V1 数据模型。

Version 1 采用 SQLite 本地数据库。

数据库仅保存用户数据。

公司信息、新闻、AI分析均来自外部 Provider，不做持久化。

---

# Database

Engine

SQLite

Database File

alphamind.db

ORM

SQLModel

Migration

None

Version1 应用启动自动建表。

---

# Design Principles

Version1 数据原则：

- 只存用户数据
- 不缓存市场数据
- 不缓存新闻
- Company 页面实时获取 AI 分析
- Journal 保存用户确认后的 AI Summary
- 数据模型保持简单

---

# Tables Overview

Version1 共三张业务表：

| Table | Description |
|--------|-------------|
| watchlist | 股票池 |
| journal | 投资研究日志 |
| settings | 软件配置 |

除此之外禁止新增业务表。

---

# Table

watchlist

Description

保存用户关注股票。

SQLModel

WatchlistModel

Columns

| Column | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | INTEGER | No | Primary Key |
| ticker | TEXT | No | 股票代码 |
| created_at | DATETIME | No | 创建时间 |

Constraints

ticker UNIQUE

Business Rules

最多允许：

20 条记录。

Repository

WatchlistRepository

---

# Table

journal

Description

保存一次完整投资研究。

SQLModel

JournalModel

Columns

| Column | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | INTEGER | No | Primary Key |
| ticker | TEXT | No | 股票代码 |
| summary | TEXT | Yes | AI Summary，T008 接入 OpenAI 前允许为空 |
| reason | TEXT | No | 为什么今天研究 |
| bull_case | TEXT | No | 最大利好 |
| risk | TEXT | No | 最大风险 |
| exit_plan | TEXT | No | 判断错误怎么办 |
| decision | TEXT | No | Buy / Hold / Sell / Watch |
| note | TEXT | Yes | 用户备注 |
| created_at | DATETIME | No | 创建时间 |
| updated_at | DATETIME | No | 更新时间 |

### Version1

Journal 不保存 Company Name。

Company Name 根据 ticker 在展示时动态获取。

这样可以避免公司改名导致历史数据不一致。

数据库仅保存 ticker。

Business Rules

decision 允许值：

- Buy
- Hold
- Sell
- Watch

Repository

JournalRepository

---

# Table

settings

Description

保存软件配置。

SQLModel

SettingsModel

Columns

| Column | Type | Nullable | Description |
|---------|------|----------|-------------|
| id | INTEGER | No | Primary Key |
| key | TEXT | No | 配置项 |
| value | TEXT | Yes | 配置值 |
| updated_at | DATETIME | No | 更新时间 |

Repository

SettingsRepository

Default Keys

OPENAI_API_KEY

OPENAI_MODEL

THEME

---

# Index

watchlist

UNIQUE

ticker

journal

INDEX

ticker

created_at

settings

UNIQUE

key

---

# Relationships

Version1

三张表之间没有外键。

保持简单。

以后 Version2 再增加：

Portfolio

Trade

Position

---

# Initialization

应用启动：

检查：

alphamind.db

不存在：

自动创建。

随后：

自动执行：

create_all()

Version1 不使用 Alembic。

---

# Backup

Version1

数据库即：

alphamind.db

位于：

Application Data Directory

Version1 不提供导入导出。

---

# Repository Mapping

WatchlistModel

↓

WatchlistRepository

JournalModel

↓

JournalRepository

SettingsModel

↓

SettingsRepository

---

# Future

Version2

新增：

portfolio

company_cache

news_cache

analysis_cache

macro_event

trade

position

Version1 不提前设计。

---

# Acceptance Criteria

满足以下条件：

✓ 自动创建数据库

✓ 自动创建三张表

✓ Watchlist CRUD 正常

✓ Journal CRUD 正常

✓ Settings CRUD 正常

✓ 重启后数据保留

✓ SQLModel 正常运行

Version1 数据库即完成。