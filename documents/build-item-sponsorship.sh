#!/usr/bin/env bash
# Generates ITEM sponsorship proposal PDFs (English + Latvian) for every partner
# listed in partners.txt.
# Output: out/<Partner>/item-sponsorship-eng.pdf
#         out/<Partner>/item-sponsorship-lat.pdf

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARTNERS_FILE="$SCRIPT_DIR/partners.txt"
SRC_DIR="$SCRIPT_DIR/src"
IMG_DIR="$SCRIPT_DIR/img"
ASSETS_DIR="$SCRIPT_DIR/../frontend/public/assets/item"
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

  # Copy base img assets (raa logo etc.)
  cp -r "$IMG_DIR" "$TMP/img"

  # ── Compress and copy ITEM images ────────────────────────
  # Poster: max 1200px long side, JPEG quality 80 (~150KB)
  sips -Z 1200 -s format jpeg -s formatOptions 80 \
    "$ASSETS_DIR/poster.png" --out "$TMP/img/item-poster.jpg" > /dev/null 2>&1

  # Performance card images: max 700px long side, JPEG quality 82 (~80KB)
  sips -Z 700 -s format jpeg -s formatOptions 82 \
    "$ASSETS_DIR/05_7_words_to_change_the_world/performance.jpeg" --out "$TMP/img/item-aulmane.jpg" > /dev/null 2>&1
  sips -Z 700 -s format jpeg -s formatOptions 82 \
    "$ASSETS_DIR/06_7_now/impression.png" --out "$TMP/img/item-now.jpg" > /dev/null 2>&1
  sips -Z 700 -s format jpeg -s formatOptions 82 \
    "$ASSETS_DIR/07_7_N.3/rope.jpeg" --out "$TMP/img/item-n3.jpg" > /dev/null 2>&1
  sips -Z 700 -s format jpeg -s formatOptions 82 \
    "$ASSETS_DIR/08_7_gluttony/15.jpg.jpeg" --out "$TMP/img/item-gluttony.jpg" > /dev/null 2>&1
  sips -Z 700 -s format jpeg -s formatOptions 82 \
    "$ASSETS_DIR/09_7_presenceinabsencepiece3/presenceInAbsence1.jpeg" --out "$TMP/img/item-presence.jpg" > /dev/null 2>&1
  sips -Z 700 -s format jpeg -s formatOptions 82 \
    "$ASSETS_DIR/10_7_timescores/vanessa.jpg" --out "$TMP/img/item-timescores.jpg" > /dev/null 2>&1
  sips -Z 700 -s format jpeg -s formatOptions 82 \
    "$ASSETS_DIR/11_7_laikstelpa/ilze_bw_dip_portreti_9.jpg" --out "$TMP/img/item-laikstelpa.jpg" > /dev/null 2>&1

  # Substitute sponsor name and compile both language versions
  ESCAPED=$(printf '%s' "$partner" | sed 's/[&/\]/\\&/g')

  for lang in eng lat; do
    sed "s/\\\\newcommand{\\\\sponsor}{[^}]*}/\\\\newcommand{\\\\sponsor}{${ESCAPED}}/" \
      "$SRC_DIR/item-sponsorship-${lang}.tex" > "$TMP/item-sponsorship-${lang}.tex"

    (cd "$TMP" && pdflatex -interaction=nonstopmode "item-sponsorship-${lang}.tex" > /dev/null 2>&1)
    (cd "$TMP" && pdflatex -interaction=nonstopmode "item-sponsorship-${lang}.tex" > /dev/null 2>&1)

    cp "$TMP/item-sponsorship-${lang}.pdf" "$PARTNER_OUT/item-sponsorship-${lang}.pdf"
    echo "   ✓ out/$partner/item-sponsorship-${lang}.pdf"
  done

  rm -rf "$TMP"
  trap - EXIT

done < "$PARTNERS_FILE"

echo ""
echo "Done. PDFs in: $OUT_DIR"
