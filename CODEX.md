# CODEX.md

# AlphaMind OS Development Guide

Version: 1.0

Status: FINAL

---

# Mission

Your goal is NOT to build the most advanced investment software.

Your goal is to build the smallest working MVP that strictly follows the specification.

Always prefer shipping over perfection.

---

# Primary Rule

The documentation inside `/docs` is the Single Source of Truth.

If implementation conflicts with documentation:

**Documentation always wins.**

Never invent new features.

Never redesign the product.

---

# Development Principles

## Rule 1

Finish one feature before starting the next.

Never work on multiple unfinished features.

---

## Rule 2

Keep implementation simple.

Always choose the simplest architecture that satisfies the requirement.

Avoid unnecessary abstractions.

---

## Rule 3

Do not over engineer.

Version 1 is intentionally small.

Examples of things that are NOT allowed:

* Microservices
* Event Bus
* CQRS
* DDD
* Plugin Systems
* Dependency Injection Frameworks
* Complex Design Patterns

Keep everything understandable.

---

## Rule 4

If a requirement is missing:

Do NOT guess.

Create a TODO.

Continue implementation.

---

## Rule 5

Every feature must compile independently.

Broken code must never be committed.

---

# Repository Structure

```text
frontend/
backend/
docs/
tests/
scripts/
```

Do not create additional top-level directories without approval.

---

# Frontend Rules

Framework:

* React
* TypeScript
* Electron

State Management:

* React Context
* React Hooks

Do NOT use:

* Redux
* MobX
* Zustand

Version 1 should remain simple.

---

# Backend Rules

Framework:

FastAPI

Database:

SQLite

ORM:

SQLModel

Do not introduce:

* PostgreSQL
* Redis
* Docker
* Kubernetes

These belong to future versions.

---

# Database Rules

Tables:

* watchlist
* journal
* settings

Do not create new tables unless documentation explicitly requires them.

---

# API Rules

All APIs must return JSON.

Success Response

```json
{
  "success": true,
  "data": {}
}
```

Error Response

```json
{
  "success": false,
  "message": ""
}
```

Never return raw exceptions.

---

# Logging

Use structured logging.

Log:

* Request
* Error
* External API latency

Never log:

* OpenAI API Key
* Personal secrets
* Sensitive configuration

---

# Error Handling

Never crash the application because an external service fails.

Example:

If OpenAI is unavailable:

* Company page must still open.
* News should still display.
* Checklist should still work.

Graceful degradation is required.

---

# UI Rules

Always follow UI_SPEC.md.

Never redesign the layout.

Never introduce new pages.

Never introduce new navigation.

---

# Performance Targets

Application startup:

< 3 seconds

Home page:

< 1 second

Company page:

< 3 seconds (without AI)

AI analysis:

< 15 seconds

---

# Code Style

Functions should be short.

Prefer readable code over clever code.

Avoid deep nesting.

Avoid duplicated code.

Use meaningful names.

Example:

Good:

getCompanyNews()

Bad:

doNews()

---

# Git Rules

One Feature = One Commit

Example:

```
feat(home): implement market summary cards

feat(company): add AI summary section

fix(journal): resolve save validation
```

Do not mix unrelated changes.

---

# Testing

Every completed feature should include:

* Basic unit tests for business logic
* API endpoint tests where practical

Version 1 does not require exhaustive test coverage.

---

# Out of Scope

Version 1 must NOT include:

* AI Agents
* Multi-user accounts
* Cloud synchronization
* Portfolio management
* Broker integration
* Automatic trading
* Price prediction
* Multi-language support

These belong to future versions.

---

# Feature Completion Checklist

A feature is complete only when:

* UI implemented
* Backend implemented
* API connected
* Error handling completed
* Loading state completed
* Empty state completed
* Basic tests passed
* Documentation updated

---

# Final Principle

Always ask:

"Does this change help ship Version 1 faster?"

If the answer is "No",

do not implement it.

# Documentation Priority

Priority：

1. MVP_PRD.md

2. API_SPEC.md

3. Feature Specification

4. UI_SPEC.md

5. README.md

When documents conflict：

Stop implementation.

Do not guess.

Wait for clarification.