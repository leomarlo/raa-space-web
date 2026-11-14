# RAA Documents

PDF generation for RAA events — sponsorship proposals, programmes, and participant letters.

## Scripts

| Script | Output |
|---|---|
| `./build.sh` | Per-partner sponsorship proposals (EN + LV) → `out/<Partner>/` |
| `./build-program.sh` | Chess Week programme (LV) → `out/Program/` |
| `./build-item-letters.sh` | ITEM acceptance letters → `out/ITEM/<Name>/` |
| `./build-doulande.sh` | John Dowland letter study edition → `out/doulande/` |

## Chess Week Sponsorship Proposals

Partners are listed one per line in `partners.txt`. Lines starting with `#` are ignored.

```bash
./build.sh
```

Source files:
- `src/raa-chess-week-v2-eng.tex` — English proposal
- `src/raa-chess-week-v2-lat.tex` — Latvian proposal
- `src/raa-chess-week-signet.tex` — Signet Bank variant

## Chess Week Programme

```bash
./build-program.sh
```

Source: `src/raa-chess-week-program.tex`

## ITEM — Shuffled Time Acceptance Letters

Applicants are listed in `item-applicants.txt`, one per line:

```
Name | none/baltic/non-baltic
```

The third column controls the travel reimbursement paragraph: `none` omits it, `baltic` shows up to €100, `non-baltic` shows up to €300.

```bash
./build-item-letters.sh
```

Source: `src/item-acceptance.tex`

## John Dowland Letter (study edition)

Dowland's 1595 letter to Robert Cecil: the full letter (original | modern English) with the seven performance passages highlighted, the explanatory notes, then one page per passage with pronunciations and meanings. Needs LuaLaTeX.

```bash
./build-doulande.sh
```

Source: `src/dowland-letter.tex`, which imports `src/doulande/` (`text.tex` letter and translation, `notes.tex` + `notelist.tex` notes, `glossary.tex` pronunciation lists).

## Images

Logos and images used by all documents live in `img/`.
