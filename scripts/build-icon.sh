#!/bin/sh
set -eu

REPOSITORY_ROOT=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
SOURCE="$REPOSITORY_ROOT/frontend/build/AlphaMind.svg"
ICONSET="$REPOSITORY_ROOT/frontend/build/AlphaMind.iconset"
OUTPUT="$REPOSITORY_ROOT/frontend/build/AlphaMind.icns"
PREVIEW_DIRECTORY=$(mktemp -d)

cleanup() {
  rm -rf "$PREVIEW_DIRECTORY" "$ICONSET"
}
trap cleanup EXIT

qlmanage -t -s 1024 -o "$PREVIEW_DIRECTORY" "$SOURCE" >/dev/null 2>&1
SOURCE_PNG="$PREVIEW_DIRECTORY/AlphaMind.svg.png"

mkdir -p "$ICONSET"
for size in 16 32 128 256 512; do
  sips -z "$size" "$size" "$SOURCE_PNG" \
    --out "$ICONSET/icon_${size}x${size}.png" >/dev/null
  double=$((size * 2))
  sips -z "$double" "$double" "$SOURCE_PNG" \
    --out "$ICONSET/icon_${size}x${size}@2x.png" >/dev/null
done

iconutil -c icns "$ICONSET" -o "$OUTPUT"
