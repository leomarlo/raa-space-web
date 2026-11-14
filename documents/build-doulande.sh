#!/usr/bin/env bash
# Compiles the John Dowland letter study edition (needs LuaLaTeX for the
# coloured passage highlights).
# Output: out/doulande/dowland-letter.pdf

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$SCRIPT_DIR/src"
OUT_DIR="$SCRIPT_DIR/out/doulande"

mkdir -p "$OUT_DIR"

TMP=$(mktemp -d "${TMPDIR:-/tmp}/doulande.XXXXXX")
trap 'rm -rf "$TMP"' EXIT

cp "$SRC_DIR/dowland-letter.tex" "$TMP/"
cp -r "$SRC_DIR/doulande" "$TMP/doulande"

for pass in 1 2; do
  if ! (cd "$TMP" && lualatex -interaction=nonstopmode -halt-on-error dowland-letter.tex > build.log 2>&1); then
    echo "✗ LuaLaTeX failed (pass $pass). Last lines of the log:" >&2
    tail -30 "$TMP/build.log" >&2
    exit 1
  fi
done

cp "$TMP/dowland-letter.pdf" "$OUT_DIR/dowland-letter.pdf"

echo "✓ out/doulande/dowland-letter.pdf"
