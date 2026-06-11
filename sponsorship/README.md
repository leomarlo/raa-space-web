# RAA Chess Week — Sponsorship Proposals

Generates per-partner PDF proposals (English + Latvian) from the LaTeX source files.

## Build

```bash
./build.sh
```

PDFs are written to `out/<Partner Name>/`.

## Adding partners

Add one partner name per line to `partners.txt`. Lines starting with `#` are ignored.

## Source files

- `src/raa-chess-week-v2-eng.tex` — English proposal
- `src/raa-chess-week-v2-lat.tex` — Latvian proposal
- `img/` — logos and images used in the PDFs
