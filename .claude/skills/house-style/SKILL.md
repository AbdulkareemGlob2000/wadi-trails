---
name: house-style
description: Wadi Trails house style for pages, lists, dates, money, external calls and images. Use whenever you create or change anything under app/ or components/, add a page, render a list, show a date or a price, call an external service, or render an image.
---

# Wadi Trails house style

Six rules. They are deliberately not the framework defaults — apply them without being asked.

1. **Page header** — every page (including `not-found.tsx` and every `error.tsx`) opens with `<PageHeader eyebrow title subtitle />`. Copy `assets/page-header.tsx` if the component is missing; never hand-roll the markup.
2. **Four states** — every list and every async panel has loading, empty, error and success. Empty says what to do next. Error says what failed and has a Retry button. A spinner alone is a defect.
3. **Dates** — `15 Sep 2026` via `formatDate`; times `14:05` via `formatTime`. No ordinals, slashes, full month names or `toLocaleString`.
4. **Money** — `12.50 JOD` via `formatMoney`. Never a currency symbol.
5. **External calls** — only in `app/api/**/route.ts`, with `AbortSignal.timeout(5000)`, and every failure returns `{ "error": { "code": "...", "message": "..." } }`.
6. **Images** — always `alt` (decorative: `alt=""`) and explicit `width` and `height`.

Detail, examples and the checks to run are in `references/rules.md`.
