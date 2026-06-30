# Feature

Settings

Status

FINAL

Priority

P1

Owner

Product

Estimated

0.5 Day

---

# Goal

Settings 用于保存 AlphaMind Version1 的本地配置。

Version1 只管理：

- OpenAI API Key
- OpenAI Model
- Theme

---

# Entry

Sidebar

↓

Settings

T009 起：

Settings 可点击。

---

# Layout

页面包含：

OpenAI API Key

OpenAI Model

Theme

Save Button

About

---

# OpenAI API Key

用户输入：

OpenAI API Key

保存后写入：

settings

key：

OPENAI_API_KEY

---

# OpenAI Model

用户输入或选择：

模型名称

保存后写入：

settings

key：

OPENAI_MODEL

默认：

gpt-5.5

---

# Theme

Version1

仅支持：

dark

保存后写入：

settings

key：

THEME

---

# Mapping

Frontend 字段与 settings 表 key 映射：

| Frontend | Settings Key |
|---------|--------------|
| openaiApiKey | OPENAI_API_KEY |
| model | OPENAI_MODEL |
| theme | THEME |

---

# AIService Rule

T009 起：

AIService 获取 API Key 的优先级：

1. settings 表中的 OPENAI_API_KEY
2. .env 中的 OPENAI_API_KEY

如果两者都为空：

Analyze 返回配置错误。

AIService 获取 Model 的优先级：

1. settings 表中的 OPENAI_MODEL
2. .env 中的 OPENAI_MODEL
3. 默认 gpt-5.5

---

# API

GET

/api/v1/settings

PUT

/api/v1/settings

---

# State

Loading

Editing

Saving

Success

Error

---

# Acceptance

Settings 页面可打开。

API Key 可保存。

Model 可保存。

Theme 可保存。

刷新后配置仍存在。

AIService 优先读取 settings 表配置。

Settings 不修改数据库结构。

---

# Out Of Scope

Version1 不支持：

账号系统

云同步

多主题

Prompt Editor

模型列表自动拉取

OpenAI Key 校验

全部延期。

---

# Developer Notes

不要把 API Key 输出到日志。

不要把 API Key 提交到 Git。

不要在前端控制台打印 API Key。