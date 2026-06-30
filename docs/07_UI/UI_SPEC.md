# UI_SPEC.md

Version: 1.0 MVP

Status: FINAL

Owner: Product

---

# 1. UI Design Principles

Version 1 所有页面统一遵循以下原则：

* 简洁
* 一屏优先
* 信息密度适中
* 暗色主题默认
* 不出现复杂图表
* 不出现动画干扰
* 不出现营销元素

整个产品风格参考：

* Notion（简洁）
* Linear（高信息密度）
* ChatGPT Desktop（留白合理）

---

# 2. Global Layout

应用采用固定布局。

```
+--------------------------------------------------------------+

 Sidebar      Main Content                    Right Panel

+--------------------------------------------------------------+
```

## Sidebar

固定宽度：

240px

包含：

* Home
* Watchlist
* Journal
* Settings

Sidebar 始终显示。

Sprint T003：

Sidebar

Version1

Home：Enabled

Watchlist：Enabled

Journal：Enabled（T007）

Settings：Disabled

---

## Main Content

自适应宽度。

展示当前页面内容。

---

## Right Panel

固定宽度：

360px

默认显示：

AI Summary

如果当前页面没有 AI 内容：

显示 Empty State。

Right Panel 始终存在。

Version1 不允许隐藏 Right Panel。

---

# 3. Color

## Background

```
#111827
```

---

## Card

```
#1F2937
```

---

## Border

```
#374151
```

---

## Primary Text

```
#F9FAFB
```

---

## Secondary Text

```
#9CA3AF
```

---

## Success

```
#22C55E
```

---

## Warning

```
#F59E0B
```

---

## Error

```
#EF4444
```

---

# 4. Typography

字体：

Inter

macOS 自动使用：

SF Pro Display

字号：

| 场景         | Size |
| ---------- | ---- |
| 页面标题       | 24px |
| Section 标题 | 18px |
| 正文         | 14px |
| 辅助信息       | 12px |

---

# 5. Home

布局：

```
Main Content

Today's Market

-----------------------

Today's Events

Right Panel

AI Daily Summary
```

### Today's Market

三张卡片：

* Nasdaq
* S&P500
* SOX

每张卡片显示：

指数名称

涨跌幅

更新时间

---

### Today's Events

最多显示：

3 条。

每条：

标题

一句摘要

点击：

Coming Soon

Version1

不进入 Company。

Company 页面将在 T005 完成。

---

---

# 6. Watchlist

顶部：

Search

中间：

Company List

底部：

Add Button

每个 Company Card：

```
NVDA

NVIDIA

$185.20

+2.13%
```

Version1（T005 起）

点击 Company Card

↓

进入 Company 页面。

---

# 7. Company

页面顺序固定：

```
Company Header

↓

Latest News

↓

AI Summary

↓

Decision Checklist

↓

Save Journal
```

Header：

显示：

Ticker

Company

Industry

Price

Today's Change

---

Latest News：

列表形式。

每条：

标题

时间

来源

---

AI Summary：

四个区域：

* Summary
* Bull Case
* Risks
* Watch Items

Version1

全部使用 Mock 数据。

---

Decision Checklist：

四个文本输入框。

一个 Decision 下拉框。

一个 Save 按钮。

---

# 8. Journal

左右布局。

左侧：

Journal List

右侧：

Journal Detail

默认显示最新记录。

---

# 9. Settings

包含：

OpenAI API Key

Model

Theme

About

Save Button

Version 1 不包含：

账号系统

同步

登录

---

# 10. Button

Primary

高度：

40px

圆角：

8px

宽度：

自动

Hover：

亮度增加。

---

# 11. Input

高度：

40px

圆角：

8px

Padding：

12px

Placeholder：

灰色。

---

# 12. Card

圆角：

12px

Padding：

16px

Margin：

16px

Border：

1px

---

# 13. Loading

统一 Skeleton。

禁止 Spinner 全屏等待。

---

# 14. Empty State

统一文案：

"No data available."

提供：

Refresh

按钮。

---

# 15. Error State

统一文案：

"Something went wrong."

提供：

Retry

按钮。

---

# 16. Responsive

Version 1 仅支持：

Desktop

最低宽度：

1280px

不支持：

手机

平板

---

# 17. Keyboard

支持：

Tab

Enter

Ctrl + Enter（保存当前表单）

ESC（关闭弹窗）

---

# 18. Animation

Version 1 不开发复杂动画。

仅保留：

Hover

Fade

Transition（200ms）

---

# 19. Accessibility

所有按钮支持：

Keyboard Focus

所有输入框支持：

Screen Reader

颜色满足基本对比度要求。

---

# 20. Acceptance Criteria

所有页面采用统一设计语言。

所有按钮、输入框、Card 样式一致。

Sidebar 全局一致。

暗色主题统一。

用户无需学习即可完成一次完整研究流程。

Version 1 UI 至此冻结。
