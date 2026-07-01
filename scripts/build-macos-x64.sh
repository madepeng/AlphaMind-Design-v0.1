#!/bin/sh
set -eu

REPOSITORY_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
RELEASE_DIRECTORY="$REPOSITORY_ROOT/Release"
BUILDER_OUTPUT="$REPOSITORY_ROOT/frontend/release-build"

"$REPOSITORY_ROOT/scripts/build-icon.sh"
"$REPOSITORY_ROOT/scripts/build-backend-macos-x64.sh"
pnpm --dir "$REPOSITORY_ROOT/frontend" build

rm -rf "$BUILDER_OUTPUT" "$RELEASE_DIRECTORY"
pnpm --dir "$REPOSITORY_ROOT/frontend" exec electron-builder --mac dir --x64

APP_SOURCE=$(find "$BUILDER_OUTPUT" -maxdepth 2 -type d -name "AlphaMind.app" -print -quit)
test -n "$APP_SOURCE"

mkdir -p "$RELEASE_DIRECTORY"
ditto "$APP_SOURCE" "$RELEASE_DIRECTORY/AlphaMind.app"
cp "$REPOSITORY_ROOT/scripts/release/README.txt" "$RELEASE_DIRECTORY/README.txt"
cp "$REPOSITORY_ROOT/LICENSE" "$RELEASE_DIRECTORY/LICENSE"
cp "$REPOSITORY_ROOT/CHANGELOG.md" "$RELEASE_DIRECTORY/CHANGELOG.md"
find "$RELEASE_DIRECTORY" -maxdepth 1 -type f \
  ! -name "README.txt" \
  ! -name "LICENSE" \
  ! -name "CHANGELOG.md" \
  -delete

file "$RELEASE_DIRECTORY/AlphaMind.app/Contents/MacOS/AlphaMind" | grep -q "x86_64"
file \
  "$RELEASE_DIRECTORY/AlphaMind.app/Contents/Resources/backend/alphamind-backend" \
  | grep -q "x86_64"
