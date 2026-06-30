# FRONTEND_SPEC.md

Version: 1.0

Status: FINAL

Owner: Engineering

---

# Goal

统一 AlphaMind V1 前端开发规范。

所有前端代码必须遵循本规范。

禁止开发者自由发挥。

---

# Technology Stack

Framework

* React 19
* TypeScript
* Electron

Build Tool

* Vite

Package Manager

* pnpm

Routing

* React Router

HTTP Client

* Axios

Icons

* Lucide React

Styling

* Tailwind CSS

---

# Project Structure

```text
frontend/

src/

    app/

    pages/

        Home/

        Watchlist/

        Company/

        Journal/

        Settings/

    components/

        common/

        layout/

        cards/

        forms/

    hooks/

    services/

    api/

    types/

    utils/

    assets/

    styles/

```

不得新增顶层目录。

---

# Naming Convention

Page

HomePage.tsx

CompanyPage.tsx

Component

MarketCard.tsx

SummaryCard.tsx

Service

companyService.ts

Hook

useCompany.ts

Type

CompanyDTO

JournalDTO

---

# Page Rules

每个页面必须包含：

```text
Page

↓

Layout

↓

Business Components

↓

Common Components
```

页面不得直接请求第三方接口。

页面不得包含复杂业务逻辑。

---

# Component Rules

组件职责保持单一。

一个组件完成一件事情。

例如：

Good

* MarketCard
* NewsList
* DecisionCard

Bad

* CompanyEverything.tsx

禁止超大组件。

---

# State Management

Version 1 使用：

React Context

React Hooks

不使用：

Redux

MobX

Zustand

Recoil

Version 2 再评估。

---

# API Layer

所有 HTTP 请求统一放入：

```text
src/api/
```

例如：

```text
companyApi.ts

journalApi.ts

watchlistApi.ts
```

页面禁止直接写 Axios 请求。

---

# Service Layer

复杂业务逻辑统一放入：

```text
src/services/
```

例如：

```text
companyService.ts

journalService.ts
```

Service 可以组合多个 API。

Page 不允许组合多个 API。

---

# Custom Hooks

统一放入：

```text
src/hooks/
```

例如：

```text
useCompany()

useJournal()

useWatchlist()
```

Hook 负责：

* Loading
* Error
* Data

页面负责渲染。

---

# DTO

所有 DTO 放入：

```text
src/types/
```

例如：

```typescript
export interface CompanyDTO {
    ticker: string;
    companyName: string;
    industry: string;
    marketCap: string;
    price: number;
    changePercent: number;
}
```

页面禁止使用 any。

---

# Styling Rules

全部使用：

Tailwind CSS

禁止：

Inline Style

禁止：

CSS Modules

禁止：

Emotion

禁止：

Styled Components

统一使用 Tailwind。

---

# Loading

统一使用 Skeleton。

禁止全屏 Loading。

Skeleton 高度与真实组件一致。

---

# Error

统一使用 ErrorCard。

内容：

Title

Message

Retry Button

所有页面保持一致。

---

# Empty State

统一组件：

EmptyView

文案统一：

"No data available."

支持：

Refresh

按钮。

---

# Button

统一组件：

PrimaryButton

SecondaryButton

DangerButton

页面不得自行定义按钮样式。

---

# Card

统一组件：

BaseCard

所有 Card：

* Border Radius: 12px
* Padding: 16px
* Shadow: Small

禁止页面自定义 Card。

---

# Form

统一组件：

TextArea

Input

Select

Button

不允许直接使用原生 HTML 样式。

---

# Network Error

统一处理：

* Toast 提示
* 页面保持可操作
* Retry 按钮

禁止白屏。

禁止浏览器默认错误。

---

# Performance

避免重复渲染。

使用：

React.memo

仅在必要时使用：

useMemo

useCallback

不要过度优化。

---

# Accessibility

所有按钮支持：

Keyboard

所有输入框支持：

Focus

所有图片必须包含：

alt

---

# Theme

Version 1：

仅支持 Dark Mode。

Light Mode 延期。

---

# Testing

每个页面至少包含：

* Render Test
* API Mock Test

业务逻辑优先测试。

样式无需测试。

---

# Acceptance Criteria

完成一个页面必须满足：

* UI 与 UI_SPEC 一致
* API 正常调用
* Loading 正常
* Empty 正常
* Error 正常
* 无 TypeScript Error
* ESLint 无错误
* Build 成功

否则不得提交。

---

# Definition of Done

一个前端功能完成的标准：

* 页面完成
* 组件复用
* 无控制台错误
* 支持键盘操作
* 满足 UI_SPEC
* 满足 Feature Spec
* 可以独立运行
* 已通过基础测试
