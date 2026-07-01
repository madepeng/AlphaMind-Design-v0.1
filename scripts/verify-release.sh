#!/bin/sh
set -eu

REPOSITORY_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
RELEASE_DIRECTORY="$REPOSITORY_ROOT/Release"
APP="$RELEASE_DIRECTORY/AlphaMind.app"

test -d "$APP"
test -f "$RELEASE_DIRECTORY/README.txt"
test -f "$RELEASE_DIRECTORY/LICENSE"
test -f "$RELEASE_DIRECTORY/CHANGELOG.md"
test -f "$APP/Contents/Resources/backend/alphamind-backend"
test -d "$APP/Contents/Resources/frontend"
test -d "$APP/Contents/Resources/database"
test -d "$APP/Contents/Resources/logs"
test -f "$APP/Contents/Resources/icon.icns"

file "$APP/Contents/MacOS/AlphaMind" | grep -q "x86_64"
file "$APP/Contents/Resources/backend/alphamind-backend" | grep -q "x86_64"
plutil -extract CFBundleShortVersionString raw "$APP/Contents/Info.plist" \
  | grep -q "1.0.0"

echo "Release verification passed."
