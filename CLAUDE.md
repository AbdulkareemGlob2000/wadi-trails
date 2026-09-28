# Wadi Trails

A catalogue of hiking trails in Jordan. Regions (categories) contain trails (items). Next.js 15 App Router, TypeScript strict, no database.

## Commands
```
npm install          # once
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit — must be clean before any commit
npm test             # vitest run
npm run build        # must pass before merging to main
```

## Where things live
- `data/catalogue.ts` — the only data source. `regions: Region[]` and `trails: Trail[]`.
- `lib/catalogue.ts` — read helpers. Pages import from here, not from `data/` directly (exception: `generateStaticParams`).
- `lib/format.ts` — `formatDate`, `formatTime`, `formatMoney`. The only way dates and money reach the UI.
- `components/PageHeader.tsx` — the header block every page starts with.
- `app/api/*/route.ts` — the only place external services are called.

## Data shape
- Region: `slug` (kebab-case, unique), `name`, `blurb` (one sentence).
- Trail: `id` (kebab-case, unique, prefixed with a place name), `regionSlug` (must exist), `name`, `summary` (one sentence),
  `distanceKm` (> 0), `difficulty` (`easy` | `moderate` | `hard`), `entryFee` (`{ amount, currency: "JOD" }`),
  `lastSurveyed` (ISO date), `lat`, `lon` (trailhead), `image` (`{ src, alt, width, height }`, local file under `public/images/`).
- `tests/catalogue.test.ts` enforces this. If you add a field, add it to the test in the same change.

## Secrets
- Variables: `OPENWEATHER_API_KEY` (read by `app/api/weather/route.ts`), `CONTEXT7_API_KEY` (read by Claude Code via `.mcp.json`).
- Real values live in `.env` only (git-ignored). `.env.example` is the committed list — add every new variable there, empty.
- In production the site's keys live in Vercel → Settings → Environment Variables.
- External calls are server-side only. Never prefix a secret with `NEXT_PUBLIC_`. Never log a key or put it in an error message.
- Never paste a key into a prompt, a spec, a plan or a commit message.

## Rules
- House style (page header, four states, date/money format, error envelope, images) is in the `house-style` skill — follow it, don't restate it here.
- Keep trail images local SVG/PNG with explicit `width`/`height`; no hot-linked external images.
- Weather is fetched client-side from our own `/api/weather`, never from openweathermap.org directly.
- Don't add dependencies without saying why in the commit message.

## Workflow
- Features go through `/create-feature-spec` or `/create-feature-branch` → plan → implement. Specs in `_specs/`, plans in `_plans/`.
- New regions go through `/add-category <Name>`; commit its diff as `content: add category <Name>`.
- Branches merge to `main` with `git merge --no-ff`.

## Definition of done
1. `npm run typecheck`, `npm test` and `npm run build` pass.
2. The `site-reviewer` subagent has run on the branch diff and reports no BLOCKING findings.
3. The changed pages have been opened through the Playwright MCP and each list state that can be reached has been seen.
4. The plan file (if any) has its Progress table and Session log updated.
