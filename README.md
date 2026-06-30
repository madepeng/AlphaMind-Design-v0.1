# AlphaMind OS

> AI-Powered Investment Research Workspace

AlphaMind is an AI-native desktop application that helps individual investors perform structured investment research.

It is **not** a stock recommendation tool.

It is **not** an automated trading system.

Its purpose is simple:

> Build a repeatable investment research process and help investors make better decisions.

---

# Vision

Most investors spend time reading news.

AlphaMind helps investors build knowledge.

Instead of asking:

> "Which stock should I buy today?"

AlphaMind encourages users to ask:

> "Has anything changed that affects my investment thesis?"

---

# MVP Goal

Complete one high-quality investment research session every day.

Typical workflow:

```

Home

↓

Watchlist

↓

Company

↓

Decision Checklist

↓

Journal

```

Target time:

**10–15 minutes**

---

# Features

## Home

Daily market summary.

Three key market events.

AI daily summary.

---

## Watchlist

Maintain a focused list of companies.

Maximum:

20 companies.

---

## Company

Research a single company.

Includes:

- Company Information
- Latest News
- Earnings Summary
- AI Analysis

---

## Decision Checklist

Five mandatory questions before making an investment decision.

Designed to reduce emotional trading.

---

## Journal

Save every research session.

Build long-term investment knowledge.

---

# Tech Stack

## Desktop

- Electron

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Backend

- FastAPI
- SQLModel
- SQLite

## AI

- OpenAI Responses API

---

# Repository Structure

```

AlphaMind-OS/

├── frontend/
├── backend/
├── docs/
├── tests/
├── scripts/

├── README.md
├── CODEX.md
├── .env.example

```

---

# Documentation

All specifications are located in the `docs` directory.

```

docs/

├── 00_Project/

├── 01_Product/

│ └── MVP_PRD.md

├── 02_Architecture/

├── 03_Database/

│ └── DATABASE.md

├── 04_API/

│ └── API_SPEC.md

├── 05_Data/

│ └── DATA_PROVIDER_SPEC.md

├── 06_UI/

│ └── UI_SPEC.md

├── 07_Features/

│ ├── Home.md

│ ├── Watchlist.md

│ ├── Company.md

│ ├── Decision.md

│ └── Journal.md

├── 08_Sprints/

│ └── SPRINT_01.md

├── 09_Engineering/

│ ├── FRONTEND_SPEC.md

│ ├── BACKEND_SPEC.md

│ └── ENVIRONMENT_SETUP.md

```

---

# Quick Start

## Clone

```bash
git clone https://github.com/madepeng/AlphaMind-OS.git

cd AlphaMind-OS
```

---

## Frontend

```bash
cd frontend

pnpm install

pnpm dev
```

---

## Backend

```bash
cd backend

uv sync

uv run uvicorn app.main:app --reload
```

---

# Environment Variables

Create a `.env` file.

Example:

```text
OPENAI_API_KEY=

OPENAI_MODEL=gpt-5.5

FINNHUB_API_KEY=

APP_ENV=development

LOG_LEVEL=INFO
```

---

# Development Principles

Version 1 follows a single rule:

> **Ship the smallest working product first.**

Do not over engineer.

Do not redesign.

Do not add undocumented features.

Documentation is the single source of truth.

---

# Coding Standards

See:

```
CODEX.md
```

Frontend:

```
docs/09_Engineering/FRONTEND_SPEC.md
```

Backend:

```
docs/09_Engineering/BACKEND_SPEC.md
```

---

# Sprint

Current Sprint

```
Sprint 1
```

Goal

Deliver AlphaMind MVP.

---

# Version 1 Scope

Included

- Home
- Watchlist
- Company
- Decision Checklist
- Journal

Excluded

- Portfolio Management
- Broker Integration
- Automatic Trading
- Price Prediction
- Multi-Agent System
- Cloud Sync

---

# Definition of Done

A feature is complete only when:

- UI completed
- Backend completed
- API connected
- Error handling completed
- Loading state completed
- Empty state completed
- Tests passed
- Documentation updated

---

# Roadmap

```
Version 1

Desktop MVP

↓

Version 2

Portfolio

↓

Version 3

Research Workspace

↓

Version 4

AI Investment Operating System
```

---

# Contributing

Every feature follows the same workflow:

```
Todo

↓

Development

↓

Review

↓

Testing

↓

Merge

↓

Done
```

One Feature

=

One Pull Request

---

# License

MIT License

---

# Philosophy

AlphaMind is designed around one belief:

> Better decisions come from better research, not better predictions.