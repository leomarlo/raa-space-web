#!/usr/bin/env bash
# Generates ITEM acceptance letter PDFs for every applicant in item-applicants.txt.
# Each row: <Name> | <reimbursement: true/false>
# Output: out/ITEM/<Name>/item-acceptance.pdf

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APPLICANTS_FILE="$SCRIPT_DIR/item-applicants.txt"
SRC_DIR="$SCRIPT_DIR/src"
IMG_DIR="$SCRIPT_DIR/img"
OUT_DIR="$SCRIPT_DIR/out/ITEM"

if [[ ! -f "$APPLICANTS_FILE" ]]; then
  echo "Error: item-applicants.txt not found." >&2; exit 1
fi

while IFS='|' read -r name reimbursement || [[ -n "$name" ]]; do
  # Trim whitespace
  name="$(echo "$name" | xargs)"
  reimbursement="$(echo "$reimbursement" | xargs)"

  [[ -z "$name" || "$name" == \#* ]] && continue

  # Validate reimbursement value
  if [[ "$reimbursement" != "none" && "$reimbursement" != "baltic" && "$reimbursement" != "non-baltic" ]]; then
    echo "Warning: unknown reimbursement value '$reimbursement' for '$name', defaulting to 'none'." >&2
    reimbursement="none"
  fi

  echo "► $name (reimbursement: $reimbursement)"
  APPLICANT_OUT="$OUT_DIR/$name"
  mkdir -p "$APPLICANT_OUT"

  TMP=$(mktemp -d)
  trap 'rm -rf "$TMP"' EXIT

  cp -r "$IMG_DIR" "$TMP/img"

  # Substitute applicant name and reimbursement type
  ESCAPED_NAME="$(printf '%s' "$name" | sed 's/[&/\]/\\&/g')"
  ESCAPED_TYPE="$(printf '%s' "$reimbursement" | sed 's/[&/\]/\\&/g')"
  sed \
    -e "s/\\\\newcommand{\\\\applicantname}{[^}]*}/\\\\newcommand{\\\\applicantname}{${ESCAPED_NAME}}/" \
    -e "s/\\\\newcommand{\\\\reimbursementtype}{[^}]*}/\\\\newcommand{\\\\reimbursementtype}{${ESCAPED_TYPE}}/" \
    "$SRC_DIR/item-acceptance.tex" > "$TMP/item-acceptance.tex"

  (cd "$TMP" && pdflatex -interaction=nonstopmode "item-acceptance.tex" > /dev/null 2>&1)
  (cd "$TMP" && pdflatex -interaction=nonstopmode "item-acceptance.tex" > /dev/null 2>&1)

  cp "$TMP/item-acceptance.pdf" "$APPLICANT_OUT/item-acceptance.pdf"
  echo "   ✓ out/ITEM/$name/item-acceptance.pdf"

  rm -rf "$TMP"
  trap - EXIT

done < "$APPLICANTS_FILE"

echo ""
echo "Done. PDFs in: $OUT_DIR"
