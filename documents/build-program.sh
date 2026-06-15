#!/usr/bin/env bash
# Compiles the RAA Chess Week program document.
# Output: out/Program/raa-chess-week-program.pdf

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$SCRIPT_DIR/src"
IMG_DIR="$SCRIPT_DIR/img"
OUT_DIR="$SCRIPT_DIR/out/Program"

mkdir -p "$OUT_DIR"

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

cp -r "$IMG_DIR" "$TMP/img"
cp "$SRC_DIR/raa-chess-week-program.tex" "$TMP/raa-chess-week-program.tex"

(cd "$TMP" && pdflatex -interaction=nonstopmode "raa-chess-week-program.tex" > /dev/null 2>&1)
(cd "$TMP" && pdflatex -interaction=nonstopmode "raa-chess-week-program.tex" > /dev/null 2>&1)

cp "$TMP/raa-chess-week-program.pdf" "$OUT_DIR/raa-chess-week-program.pdf"

echo "✓ out/Program/raa-chess-week-program.pdf"
