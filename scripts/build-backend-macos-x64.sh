#!/bin/sh
set -eu

REPOSITORY_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
PYTHON_TARGET=cpython-3.12.12-macos-x86_64-none

cd "$REPOSITORY_ROOT/backend"
uv python install "$PYTHON_TARGET"
UV_PROJECT_ENVIRONMENT=.venv-packaging-x64 uv run \
  --python "$PYTHON_TARGET" \
  --with pyinstaller==6.21.0 \
  pyinstaller \
  --clean \
  --noconfirm \
  alphamind-backend.spec

file dist/alphamind-backend/alphamind-backend | grep -q "x86_64"
