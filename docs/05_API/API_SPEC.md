# API_SPEC.md

Version: 1.0 MVP

Status: FINAL

Owner: Backend

---

# Goal

定义 AlphaMind Version 1 全部 Backend API。

Version1 API 保持最小化。

禁止增加非 PRD 中定义的接口。

---

# API Principles

Version1 所有 API 必须遵循：

- RESTful
- JSON Response
- 无 Session
- 无 Cookie
- 无 Login
- 无 Auth

所有 API 前缀：

/api/v1

---

# Response Format

所有接口统一返回：

Success

```json
{
  "success": true,
  "data": {}
}
```

Failure

```json
{
  "success": false,
  "message": "Error Message"
}
```

禁止：

直接返回字符串。

禁止：

直接返回数据库对象。

---

# Home

## GET

/api/v1/home

Description

首页数据。

包含：

Today's Market

Today's Events

AI Daily Summary

Response

```json
{
  "success": true,
  "data": {
    "market": {
      "nasdaq": 1.25,
      "sp500": 0.82,
      "sox": 2.41
    },
    "events": [
      {
        "title": "Micron Earnings",
        "summary": "Revenue beat expectations."
      }
    ],
    "summary": "No major change to today's market outlook."
  }
}
```

---

# Watchlist

## GET

/api/v1/watchlist

Description

获取股票池。

Response

```json
{
  "success": true,
  "data": [
    {
      "ticker": "NVDA",
      "companyName": "NVIDIA",
      "price": 185.2,
      "change": 2.13
    }
  ]
}
```

---

## POST

/api/v1/watchlist

Request

```json
{
  "ticker": "NVDA"
}
```

Response

```json
{
  "success": true
}
```

Rules

Ticker 唯一。

最多：

20 条。

---

## DELETE

/api/v1/watchlist/{ticker}

Description

删除股票。

---

Response

```json
{
  "success": true
}
```

# Company

## GET

/api/v1/company/{ticker}

Description

获取 Company 页面全部数据。

Version1

统一返回：

基础信息

新闻

财报摘要

Response

```json
{
  "success": true,
  "data": {
    "header": {
      "ticker": "NVDA",
      "companyName": "NVIDIA",
      "industry": "Semiconductor",
      "marketCap": "3.8T",
      "price": 185.23,
      "changePercent": 1.82
    },
    "news": [
      {
        "title": "...",
        "publishedAt": "2026-06-30",
        "source": "Mock News"
      }
    ],
    "aiSummary": {
      "summary": "...",
      "bullCase": ["..."],
      "risk": ["..."],
      "watchItems": ["..."]
    }
  }
}
```

---

# AI

## POST

/api/v1/analyze

Description

调用 OpenAI。

生成 AI Summary。

Request

```json
{
  "ticker": "NVDA"
}
```

Response

```json
{
  "success": true,
  "data": {
    "summary": "NVIDIA remains the AI infrastructure leader.",
    "bullCase": [
      "Strong AI demand",
      "High gross margin",
      "Large software ecosystem"
    ],
    "risk": [
      "Valuation",
      "Competition",
      "Export restrictions"
    ],
    "watchItems": [
      "Next earnings",
      "Blackwell shipments",
      "Cloud CapEx"
    ]
  }
}
```

---

# Journal

## GET

/api/v1/journal

Description

获取全部 Journal。

默认：

按 created_at 倒序。

---

## POST

/api/v1/journal

Request

```json
{
  "ticker": "NVDA",
  "summary": "...",
  "reason": "...",
  "bullCase": "...",
  "risk": "...",
  "exitPlan": "...",
  "decision": "Hold",
  "note": "..."
}
```

Response

```json
{
  "success": true
}
```

---

## DELETE

/api/v1/journal/{id}

Description

删除 Journal。

---

# Settings

## GET

/api/v1/settings

Description

获取配置。

---

## PUT

/api/v1/settings

Description

更新配置。

Request

```json
{
  "openaiApiKey": "sk-xxxx",
  "model": "gpt-5.5",
  "theme": "dark"
}
```

Response

```json
{
  "success": true
}
```

---

# HTTP Status

200

Success

400

Validation Error

404

Not Found

500

Internal Error

---

# Validation

Ticker

- 必须大写
- 长度 1~10

Decision

允许：

- Buy
- Hold
- Sell
- Watch

---

# Timeout

第三方接口：

10 秒。

超过：

返回失败。

---

# Error Handling

统一：

BusinessException

ValidationException

ExternalAPIException

所有异常统一返回：

```json
{
  "success": false,
  "message": "..."
}
```

---

# Version1 Out Of Scope

禁止新增：

Portfolio API

Trade API

Broker API

Account API

Webhook

Streaming

WebSocket

SSE

GraphQL

全部延期。

---

# Acceptance Criteria

Version1 API 完成标准：

✓ Home API

✓ Watchlist CRUD

✓ Company Query

✓ AI Analysis

✓ Journal CRUD

✓ Settings

全部通过。

Version1 API 即完成。