# RAA Space Repository Summary

Last reviewed: 2026-07-12

## Purpose

This repository contains the public web presence and supporting publishing tools for **RAA SPACE**, a venue for performances, exhibitions, and workshops in Riga. It is not a single application: the main product is a bilingual, statically exported Next.js site, accompanied by LaTeX document-generation workflows and a small experimental CalDAV script.

## Repository map

| Path | Role |
|---|---|
| `frontend/` | Main public website (Next.js, React, TypeScript, Tailwind CSS) |
| `frontend/src/app/` | App Router pages; most event and campaign URLs are explicit route folders |
| `frontend/src/components/` | Shared navigation, program/calendar, event, registration, and visual components |
| `frontend/src/locales/` | English and Latvian content, including most event/program records |
| `frontend/public/assets/` | Posters, photographs, PDFs, logos, and other public files |
| `documents/` | LaTeX sources, shell build scripts, input lists, shared images, and generated PDFs |
| `telpa-cv/` | Standalone Latvian/English RAA venue CV LaTeX sources and PDFs |
| `backend/` | One standalone Python script that writes a test event to a mailbox.org CalDAV calendar |

## Frontend architecture

- Stack: Next.js 15.3.3, React 19, TypeScript in strict mode, Tailwind CSS 4, ESLint 9.
- The site uses the Next.js App Router and the `@/*` alias for `frontend/src/*`.
- `next.config.ts` sets `output: "export"` and disables image optimization. The intended artifact is therefore a static site in `frontend/out/`; server-only Next.js features are unavailable.
- `src/app/layout.tsx` supplies global metadata, Geist fonts, global CSS, and the language provider. The HTML language is fixed to Latvian (`lv`).
- The root `/` currently renders the `ComingSoon` template. Main content remains available through routes such as `/program`, `/telpa`, `/times`, `/calls`, `/team`, `/contact`, and numerous `/events/...` pages.
- The visual identity centers on black, dark red (`#8B0000`), and cream (`#f5f5dc`), with a custom hieroglyph grid used as a recurring animated/static background and menu surface.

### Content and localization

- `src/context/LanguageContext.tsx` provides client-side Latvian/English switching. Latvian is the initial locale; selection is component state and is not persisted or encoded in the URL.
- `src/locales/lat.json` and `eng.json` are both translation catalogs and the primary content database. They contain navigation labels, venue information, team copy, calls, and a large `program.items` object.
- Program entries conform to `ProgramItem` in `src/types/program.ts`. Routes commonly read one entry directly, for example `t.program.items.tp054k01xg`.
- When adding or changing content, keep both locale files structurally compatible. Type inference uses the English catalog as the translation shape, although the Latvian catalog currently has at least one additional field (`telpa.paragraph3`).
- Dates are stored as strings and parsed in the browser. Program entries are sorted newest-first; calls are sorted by deadline and visually dimmed after their deadline.

### Page and component conventions

- Pages that need metadata typically remain server components and render a corresponding `*Client` component for stateful UI.
- `Entrance`, `Menu`, and `generateMenuItems.tsx` implement the grid-based navigation. `Menu.tsx` exposes only the keys listed in its `VISIBLE_KEYS` constant.
- `ProgramPageClient` switches between `ProgramListView` and `CalendarView`. Its displayed calendar range is currently hard-coded from July 2025 through October 2026.
- Event pages are explicit files under `src/app/events/<slug>/page.tsx`; many use `EventPageContent`, while specialized pages add their own galleries or layout.
- `EventPageContent` supports a deliberately small Markdown-like subset in descriptions: `**bold**` and `[label](URL)`.
- Registration forms submit email addresses directly with ordinary HTTP `POST` requests to a supplied external endpoint; there is no site-owned form API in this repository.
- Public images and downloadable documents are referenced with root-relative paths under `/assets/...`.

## Common frontend commands

Run these from `frontend/`:

```bash
npm install
npm run dev       # development server (Turbopack)
npm run build     # production build/static export
npm run start     # Next.js production server command
npm run check     # TypeScript plus configured lint command
```

There is no automated test suite in the repository. Verification should at minimum include a TypeScript/build check and manual inspection of affected routes in both languages and at mobile/desktop sizes.

## Document generation

The `documents/` area generates personalized PDFs with shell scripts, `sed` substitutions, temporary build directories, and two `pdflatex` passes.

Run from `documents/`:

```bash
./build.sh                   # Chess Week proposals for partners, plus program
./build-program.sh           # Chess Week program only
./build-item-letters.sh      # ITEM acceptance letters per applicant
./build-item-sponsorship.sh  # ITEM sponsor proposals in English and Latvian
```

- Partner names come from `partners.txt`; applicant names and reimbursement categories come from `item-applicants.txt`.
- Shared document images live in `documents/img/`, sources in `documents/src/`, and results in `documents/out/`.
- The ITEM sponsorship script additionally consumes frontend assets and uses macOS `sips` for image conversion, so it is not portable to a typical Linux environment without adjustment.
- Generated LaTeX auxiliary files and many generated PDFs are currently present in the repository; take care not to overwrite or commit unrelated generated artifacts.
- The `telpa-cv/` directory is separate from these scripts and contains direct LaTeX/PDF versions of the venue CV; copies are also published under `frontend/public/assets/telpa/`.

## Backend utility

`backend/mailbox-calendar-api.py` is a standalone script, not an API server despite its filename. It:

1. loads `.env` from the parent of the current working directory,
2. reads `MAILBOX_PASSWORD` and `MAILBOX_CAL_DAV_CREDENTIAL`,
3. connects to the first mailbox.org calendar for `enter@raa.space`, and
4. creates one hard-coded ICS event.

It requires the third-party Python packages `caldav` and `python-dotenv`, but no Python dependency manifest is checked in. Running it mutates the real remote calendar, so treat it as an operational script rather than a harmless local check. Secrets are expected in `.env`, which is gitignored.

## Important maintenance notes

- Most editorial updates require coordinated changes to both locale JSON files, related public assets, and sometimes a dedicated route page.
- Because the frontend is a static export, confirm any new dependency or Next.js feature works without a runtime server.
- The large binary asset collection dominates the repo. Reuse the established `poster`, `poster-mid`, and `poster-thumb` naming convention where applicable.
- Several dates, labels, URLs, and form endpoints are embedded directly in components or locale content; there is no CMS or database.
- Root and frontend README files are minimal/template documentation. This file is the best high-level starting point; inspect the relevant implementation before relying on details that may have changed after the review date.

## Quick guide for future work

- Site-wide UI or navigation: start in `frontend/src/components/Entrance.tsx`, `Menu.tsx`, and `generateMenuItems.tsx`.
- Program/event copy: start in both files under `frontend/src/locales/`, then check the matching `frontend/src/app/events/` route.
- Program display: inspect `ProgramPageClient.tsx`, `ProgramListView.tsx`, and `CalendarView.tsx`.
- Venue/team/contact pages: inspect the matching route plus locale sections.
- Static assets: use `frontend/public/assets/<event-or-feature>/` and root-relative URLs.
- Sponsorship/program/letter PDFs: use the scripts and sources under `documents/`.
- Calendar automation: inspect the backend script carefully and avoid executing it against production credentials during routine validation.
