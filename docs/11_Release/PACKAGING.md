# AlphaMind Packaging

Status

FINAL

Version

1.0

Owner

Architecture

---

# Goal

生成一个用户可以直接运行的：

macOS Desktop Application。

用户无需：

安装 Python

启动 Backend

配置数据库

即可直接运行。

---

# Platform

Version1

仅支持：

macOS Intel

后续：

支持：

Apple Silicon。

Windows。

---

# Technology

Frontend

Electron

Backend

FastAPI

Database

SQLite

AI

OpenAI Responses API

---

# Package Structure

AlphaMind.app

Contents/

MacOS/

Resources/

backend/

database/

logs/

frontend/

---

# Startup Flow

用户：

双击：

AlphaMind.app

↓

Electron

启动

↓

自动启动：

FastAPI Backend

↓

Backend：

检查：

SQLite

↓

不存在：

自动创建数据库

↓

Frontend：

连接：

http://127.0.0.1

↓

进入：

Home

---

# Backend

Backend：

禁止：

要求用户：

手动启动。

Backend：

必须：

自动启动。

关闭应用：

自动关闭 Backend。

---

# Database

SQLite

默认：

~/Library/Application Support/AlphaMind/

数据库：

alphamind.db

首次启动：

自动创建。

禁止：

写入：

Application Bundle。

---

# Settings

Settings

保存：

Application Support

继续使用：

SQLite。

不要新增配置系统。

---

# Logs

日志：

Application Support

logs/

保留：

最近：

30

天。

禁止：

输出：

OpenAI API Key。

---

# OpenAI

API Key

读取：

Settings

↓

.env

优先级：

Settings

>

.env

---

# Release Folder

Release/

AlphaMind.app

README.txt

LICENSE

CHANGELOG.md

---

# App Icon

Version1

使用：

AlphaMind.icns

Electron：

统一使用：

同一图标。

---

# Build

Release Build：

成功。

TypeScript：

0 Error。

ESLint：

Pass。

Ruff：

Pass。

MyPy：

Pass。

Backend：

启动成功。

Frontend：

启动成功。

SQLite：

初始化成功。

---

# Acceptance

能够：

双击启动。

无需 Terminal。

无需 Python。

无需创建数据库。

Home

正常。

Watchlist

正常。

Company

正常。

Journal

正常。

Analyze

正常。

Settings

正常。

关闭：

自动结束 Backend。

---

# Out Of Scope

Version1

不支持：

Auto Update

Crash Report

Cloud Sync

Login

License

Installer Wizard

Windows

Apple Silicon

全部：

Version2

考虑。

---

# Developer Notes

Packaging

不得修改：

业务逻辑。

不得新增：

API。

不得修改：

DATABASE。

仅允许：

Packaging

相关配置。
