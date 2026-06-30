# Feature

Decision Checklist

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

Decision Checklist 是 AlphaMind 的核心功能。

目的不是帮助用户预测股价。

而是帮助用户建立固定、可重复执行的投资决策流程。

所有交易都应先完成 Checklist。

---

# User Story

作为投资者。

我希望：

在买入、卖出或继续持有之前，

系统能够提醒我完成固定的思考流程。

避免情绪化交易。

避免 FOMO。

避免冲动决策。

---

# Entry

来源：

Company 页面。

AI Summary 加载完成后。

Checklist 自动解锁。

---

# Exit

用户点击：

Save Journal。

完成研究流程。

---

# Layout

页面包含：

---

Research Question

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

Save Journal

---

所有问题采用垂直排列。

---

# Question 1

Title

Why today?

Label

为什么今天值得研究？

Input

多行文本。

最大长度：

300 字。

Required：

Yes

---

# Question 2

Title

Bull Case

Label

最大的利好是什么？

Input

多行文本。

最大长度：

300 字。

Required：

Yes

---

# Question 3

Title

Risk

Label

最大的风险是什么？

Input

多行文本。

最大长度：

300 字。

Required：

Yes

---

# Question 4

Title

Exit Plan

Label

如果判断错误怎么办？

Input

多行文本。

最大长度：

300 字。

Required：

Yes

---

# Decision

Title

Decision

Options

Buy

Hold

Sell

Watch

Required：

Yes

Default：

Watch

---

# Validation

所有问题不能为空。

Decision 必须选择。

否则：

Save 按钮保持 Disabled。

---

# Save

点击：

Save Journal

系统执行：

POST /journal

保存：

Ticker

Summary

Reason

Bull Case

Risk

Exit Plan

Decision

Note

Created Time

---

# Success

保存成功。

显示：

Journal Saved.

按钮：

View Journal

允许进入 Journal 页面。

---

# Loading

提交时：

按钮进入 Loading。

禁止重复点击。

---

# Error

保存失败：

Toast：

Failed to save.

允许再次提交。

---

# Keyboard

Tab

依次跳转：

Question1

↓

Question2

↓

Question3

↓

Question4

↓

Decision

↓

Save

支持：

Ctrl + Enter

直接保存。

---

# Accessibility

所有输入框支持：

Keyboard Navigation

Screen Reader

Focus State

---

# API

POST

/api/v1/journal

Request

Ticker

Summary

Reason

Bull Case

Risk

Exit Plan

Decision

Note

Response

Success

Boolean

---

# Components

DecisionCard

QuestionInput

DecisionSelector

SaveButton

LoadingView

Toast

---

# State

Locked

Loading

Editing

Saving

Success

Error

---

# Acceptance Criteria

满足以下条件：

Question 可填写。

Decision 可选择。

Save 正常。

Journal 正常保存。

Loading 正常。

Error 正常。

键盘操作正常。

Version 1 即视为完成。

---

# Out Of Scope

Version 1 不开发：

AI 自动填写 Checklist。

自动生成 Decision。

投资评分。

买入建议。

仓位建议。

止盈止损建议。

全部延期。

---

# Developer Notes

Decision Checklist 必须保持简单。

整个填写过程控制在：

2~5 分钟。

不要增加任何额外问题。

Version 1 永远保持固定五步。

任何新增问题统一进入 Backlog。
