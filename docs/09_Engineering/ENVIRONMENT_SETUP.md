# ENVIRONMENT_SETUP.md

Version: 1.0

Status: FINAL

Owner: Engineering

---

# Goal

建立统一的 AlphaMind V1 开发环境。

所有开发者、Codex、AI Coding Agent 必须使用相同的软件版本。

避免因为环境差异导致开发问题。

---

# Supported Platform

Version 1 官方支持：

* macOS（Intel / Apple Silicon）
* Windows 11

Linux 不作为 Version 1 官方开发平台。

---

# Required Software

## Git

Version

2.45+

检查：

```bash
git --version
```

---

## Node.js

Version

22 LTS

检查：

```bash
node -v
```

---

## pnpm

Version

10+

安装：

```bash
npm install -g pnpm
```

检查：

```bash
pnpm -v
```

---

## Python

Version

3.12+

检查：

```bash
python3 --version
```

---

## uv

Python 包管理工具。

安装：

macOS

```bash
brew install uv
```

Windows

```bash
winget install astral-sh.uv
```

检查：

```bash
uv --version
```

---

## SQLite

Version

3.45+

检查：

```bash
sqlite3 --version
```

---

## VS Code

推荐最新版。

建议安装：

* Python
* Pylance
* ESLint
* Prettier
* Tailwind CSS IntelliSense

---

# Clone Repository

```bash
git clone https://github.com/madepeng/AlphaMind-OS.git

cd AlphaMind-OS
```

---

# Frontend Setup

进入：

```bash
cd frontend
```

安装依赖：

```bash
pnpm install
```

启动：

```bash
pnpm dev
```

---

# Backend Setup

进入：

```bash
cd backend
```

创建虚拟环境：

```bash
uv venv
```

激活：

macOS

```bash
source .venv/bin/activate
```

Windows

```bash
.venv\Scripts\activate
```

安装依赖：

```bash
uv sync
```

启动：

```bash
uv run uvicorn app.main:app --reload
```

---

# Environment Variables

根目录创建：

```
.env
```

内容：

```text
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-5.5
FINNHUB_API_KEY=your_finnhub_key
APP_ENV=development
LOG_LEVEL=INFO
```

禁止提交 `.env` 到 Git。

---

# Project Startup

推荐使用两个终端。

终端一：

```bash
cd backend

uv run uvicorn app.main:app --reload
```

终端二：

```bash
cd frontend

pnpm dev
```

Electron 自动连接本地 Backend。

---

# Build

Frontend

```bash
pnpm build
```

Backend

```bash
uv run pytest
```

Desktop Package

```bash
pnpm package
```

---

# Verify Installation

满足以下条件：

* Frontend 启动成功
* Backend 启动成功
* Electron 正常打开
* SQLite 自动创建 `alphamind.db`
* `/api/v1/home` 返回 200
* 能成功保存一条 Journal

全部通过表示环境搭建成功。

---

# Common Problems

## Port Occupied

默认：

* Frontend：5173
* Backend：8000

如端口冲突，先关闭占用程序。

---

## API Key Invalid

检查：

* `.env` 是否存在
* API Key 是否有效
* Backend 是否已重启

---

## Database Missing

首次启动会自动创建数据库。

如未创建：

删除旧数据库后重新启动 Backend。

---

# Development Rules

开发过程中必须遵守：

* 使用 pnpm 管理前端依赖
* 使用 uv 管理 Python 依赖
* 不直接修改锁文件
* 每次提交前执行测试
* 保持主分支可运行

---

# Definition of Ready

开发者满足以下条件即可开始开发：

* 环境安装完成
* 仓库拉取成功
* 前后端均可启动
* API 连通正常
* 数据库创建成功
* OpenAI API 可调用
