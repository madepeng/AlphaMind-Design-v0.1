# BACKEND_SPEC.md

Version: 1.0

Status: FINAL

Owner: Engineering

---

# Goal

统一 AlphaMind V1 后端开发规范。

所有 Backend 代码必须遵循本规范。

---

# Technology Stack

Language

Python 3.12+

Framework

FastAPI

ORM

SQLModel

Database

SQLite

Validation

Pydantic v2

HTTP Client

httpx

AI

OpenAI Responses API

Logging

structlog

Testing

pytest

---

# Project Structure

```text
backend/

app/

    main.py

    api/

    models/

    schemas/

    services/

    repositories/

    providers/

    ai/

    database/

    config/

    core/

    utils/

tests/

```

禁止新增顶层目录。

---

# Layer Rules

请求流程固定：

```text
Router

↓

Service

↓

Repository

↓

Database
```

禁止：

Router 直接访问数据库。

禁止：

Router 调 OpenAI。

禁止：

Router 写业务逻辑。

---

# Router

职责：

* 参数校验
* 调用 Service
* 返回 Response

Router 必须保持轻量。

---

# Service

负责：

业务逻辑。

例如：

CompanyService

负责：

* 获取公司信息
* 获取新闻
* 调用 AI
* 组装 CompanyDTO

Service 可以组合多个 Repository。

---

# Repository

职责：

数据库访问。

一个 Repository 对应一张表。

例如：

WatchlistRepository

JournalRepository

SettingsRepository

Repository 不允许：

业务逻辑。

AI 调用。

HTTP 请求。

---

# Provider

负责：

第三方数据源。

例如：

YahooFinanceProvider

FinnhubProvider

以后替换数据源：

只修改 Provider。

Service 不需要改。

---

# AI Layer

统一：

AIService

Version1：

只有：

CompanyAnalysis()

禁止：

多个 Prompt。

禁止：

多个 Agent。

---

# Database

Version1

仅三张表：

watchlist

journal

settings

禁止新增。

---

# DTO

所有 Response 使用 DTO。

禁止：

返回 ORM Model。

例如：

Good

CompanyDTO

Bad

CompanyModel

---

# Error Handling

统一异常：

BusinessException

NotFoundException

ValidationException

ExternalAPIException

统一返回：

```json
{
  "success": false,
  "message": "..."
}
```

禁止直接抛出 Python Traceback。

---

# Logging

记录：

Request

Duration

Provider

Exception

AI 调用耗时

禁止记录：

API Key

Prompt 内容

用户隐私

---

# Configuration

统一：

.env

包含：

OPENAI_API_KEY

OPENAI_MODEL

FINNHUB_API_KEY

APP_ENV

LOG_LEVEL

Version1：

禁止写死配置。

---

# HTTP Client

统一：

httpx.AsyncClient

禁止：

requests

保证异步。

---

# Dependency Injection

使用：

FastAPI Depends

禁止：

第三方 DI 框架。

---

# Async Rules

所有外部 IO：

必须 async。

数据库：

async。

HTTP：

async。

AI：

async。

禁止同步阻塞。

---

# Testing

Repository：

单元测试。

Service：

Mock 测试。

API：

集成测试。

Version1：

覆盖核心路径即可。

---

# API Version

统一：

/api/v1/

Version2：

再增加：

/api/v2/

---

# Security

所有 API：

本地运行。

Version1：

无登录。

无权限。

无 Token。

---

# Performance

Home API：

< 500ms（不含第三方接口）

Company API：

< 2s（不含 AI）

AI：

< 15s

SQLite 查询：

< 50ms

---

# Code Style

函数：

< 50 行。

类：

职责单一。

禁止：

God Class。

禁止：

超过三层嵌套。

优先：

Early Return。

---

# Definition of Done

Backend Feature 完成标准：

* API 实现
* DTO 完整
* Repository 完整
* Service 完整
* Provider 完整
* 单元测试通过
* 无 MyPy 类型错误
* 无 Ruff 检查错误
* 文档同步更新

否则不得合并。
