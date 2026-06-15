#!/usr/bin/env bash
# Generates sponsorship proposal PDFs for every partner listed in partners.txt.
# Output: out/<Partner Name>/raa-chess-week-sponsorship-proposal-engl.pdf
#         out/<Partner Name>/raa-chess-week-sponsorship-proposal-lv.pdf

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARTNERS_FILE="$SCRIPT_DIR/partners.txt"
SRC_DIR="$SCRIPT_DIR/src"
IMG_DIR="$SCRIPT_DIR/img"
OUT_DIR="$SCRIPT_DIR/out"

if [[ ! -f "$PARTNERS_FILE" ]]; then
  echo "Error: partners.txt not found." >&2; exit 1
fi

while IFS= read -r partner || [[ -n "$partner" ]]; do
  [[ -z "$partner" || "$partner" == \#* ]] && continue

  echo "► $partner"
  PARTNER_OUT="$OUT_DIR/$partner"
  mkdir -p "$PARTNER_OUT"

  TMP=$(mktemp -d)
  trap 'rm -rf "$TMP"' EXIT

  # Copy images into the temp compilation directory
  cp -r "$IMG_DIR" "$TMP/img"

  for lang in eng lat; do
    # Escape any special sed characters in the partner name
    ESCAPED=$(printf '%s' "$partner" | sed 's/[&/\]/\\&/g')

    # Substitute the \sponsor value and write to temp dir
    sed "s/\\\\newcommand{\\\\sponsor}{[^}]*}/\\\\newcommand{\\\\sponsor}{${ESCAPED}}/" \
      "$SRC_DIR/raa-chess-week-v2-${lang}.tex" > "$TMP/proposal-${lang}.tex"

    # Two pdflatex passes for stable cross-references
    (cd "$TMP" && pdflatex -interaction=nonstopmode "proposal-${lang}.tex" > /dev/null 2>&1)
    (cd "$TMP" && pdflatex -interaction=nonstopmode "proposal-${lang}.tex" > /dev/null 2>&1)

    if [[ "$lang" == "lat" ]]; then
      OUTFILE="$PARTNER_OUT/raa-chess-week-sponsorship-proposal-lv.pdf"
    else
      OUTFILE="$PARTNER_OUT/raa-chess-week-sponsorship-proposal-engl.pdf"
    fi

    cp "$TMP/proposal-${lang}.pdf" "$OUTFILE"
    echo "   ✓ $(basename "$OUTFILE")"
  done

  rm -rf "$TMP"
  trap - EXIT

done < "$PARTNERS_FILE"

echo ""

# ── Program document (language-neutral, no sponsor) ──────
echo "► Program"
PROGRAM_OUT="$OUT_DIR/Program"
mkdir -p "$PROGRAM_OUT"

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
cp -r "$IMG_DIR" "$TMP/img"
cp "$SRC_DIR/raa-chess-week-program.tex" "$TMP/raa-chess-week-program.tex"
(cd "$TMP" && pdflatex -interaction=nonstopmode "raa-chess-week-program.tex" > /dev/null 2>&1)
(cd "$TMP" && pdflatex -interaction=nonstopmode "raa-chess-week-program.tex" > /dev/null 2>&1)
cp "$TMP/raa-chess-week-program.pdf" "$PROGRAM_OUT/raa-chess-week-program.pdf"
echo "   ✓ raa-chess-week-program.pdf"
rm -rf "$TMP"
trap - EXIT

echo ""
echo "Done. PDFs in: $OUT_DIR"
