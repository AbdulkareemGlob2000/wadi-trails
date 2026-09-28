# Implementation Plan: Favourites and Compare

| | |
|---|---|
| **Slug** | `favourites-and-compare` |
| **Spec** | `_specs/favourites-and-compare.md` |
| **Branch** | `claude/feature/favourites-and-compare` |
| **Status** | Done |
| **Created** | 2026-09-28 |
| **Updated** | 2026-09-28 |

## How to resume this plan

1. Read the spec linked above for the *why*. This plan covers only the *how*.
2. Find the first phase in **Progress** below that is not `Done`.
3. Read that phase in full — its goal, prerequisites, tasks, technical details, and its
   "Done when" criteria — before changing any code.
4. Check **Decisions** before choosing an approach. Anything already settled there is not
   open for reconsideration without saying so.
5. As you work: tick each task, keep **Progress** current, and add a line to the
   **Session log**. A plan that is not updated as it goes is worse than no plan.
6. If reality contradicts the plan, correct the plan in place and record it under
   **Deviations**. Do not silently diverge.

## Overview

When this is done, every trail has an elevation gain and a Save button. A `/favourites` page lists saved trails from browser storage and lets the visitor tick two or three of them. A `/compare?ids=…` page shows the ticked trails side by side, fed by a new `/api/compare` route handler that adds live weather for each trailhead. The weather call is shared with the existing `/api/weather`.

## Context

See spec.

## Progress

| Phase | Name | Status |
|---|---|---|
| 1 | Elevation data and the favourites store | Done |
| 2 | Favourites page | Done |
| 3 | Compare route handler and page | Done |

**Current state of the working tree** — All three phases committed on the branch; merged to main after the final review.

## Action required

| When | Action | Why it is needed |
|---|---|---|
| After | Put a real `OPENWEATHER_API_KEY` in `.env` and in Vercel, then open `/compare` with two trails | Only a person with the key can confirm live weather in the comparison. Without a key, only the "Weather unavailable" path can be checked |

## Phase 1: Elevation data and the favourites store

**Goal** — Every trail has `elevationGainM` shown on its page, and a working Save / Saved — remove button backed by browser storage.

**Prerequisites** — None.

### Tasks

- [x] Add `elevationGainM: number` to `Trail` in `data/catalogue.ts` and give all 11 trails a value.
- [x] Require `elevationGainM >= 0` (a whole number) in `tests/catalogue.test.ts`, and add the field to CLAUDE.md's Data shape and to `/add-category` step 4.
- [x] Show "Elevation gain" in the facts list on `app/trails/[id]/page.tsx`.
- [x] Create `lib/favourites.ts` with read, save, remove and toggle functions (depends on nothing).
- [x] Create `tests/favourites.test.ts`.
- [x] Create the `components/FavouriteButton.tsx` client component and add it to the trail page (depends on the store).

### Technical details

- Elevation values in metres:
  - soap-house 350, roe-deer 80, castle-ridge 520
  - mujib-siq 60, mujib-ibex 420, main-hot-springs 180, numeira-canyon 90
  - umm-ad-dami 480, burdah-bridge 300, khazali-canyon 10, petra-monastery-back 430
- Store key: `wadi-trails:favourites`. Value: a JSON array of trail ids, newest first.
- `lib/favourites.ts` exports:
  - `type FavouritesResult = { ok: true; ids: string[] } | { ok: false }`
  - `readFavourites(storage?: Storage): FavouritesResult`. Any throw or invalid JSON returns `{ ok: false }`; entries that are not strings are dropped.
  - `isFavourite(id)`, `saveFavourite(id)`, `removeFavourite(id)`, `toggleFavourite(id): boolean`, which returns the new state.
  - Save moves the id to the front and caps the list at 50 (`MAX_FAVOURITES`).
  - After every write, dispatch `window.dispatchEvent(new Event("favourites-changed"))` so other components can refresh.
  - Every function takes an optional `storage` argument, so tests can pass a fake without jsdom.
- `FavouriteButton`: `aria-pressed={saved}`. The label is "Save to favourites" or "Saved — remove". It reads on mount (no SSR access to storage).
- Vitest runs in the node environment, so tests use a small in-memory `Storage` fake.

### Done when

- The catalogue test fails if any trail lacks `elevationGainM`, and passes with the data.
- The trail page shows "Elevation gain  350 m" for the Soap House Trail.
- Pressing the button toggles its label, and the state survives a reload (checked in the browser).
- typecheck and test are green.

## Phase 2: Favourites page

**Goal** — `/favourites` lists saved trails, newest first, with all four states and Compare ticks that feed `/compare`.

**Prerequisites** — Phase 1.

### Tasks

- [x] Add a "Favourites" link to the nav in `app/layout.tsx`.
- [x] Create `app/favourites/page.tsx` as a server wrapper with a PageHeader. It passes a slim list of `{id, name, regionName, summary, image}` for all trails to a client component.
- [x] Create the `components/FavouritesList.tsx` client component with loading, empty, error (Retry calls read again) and success states, the Compare ticks with a max of 3 and a polite note, and a "Compare selected" link that is disabled below 2.
- [x] Listen for `favourites-changed` and `storage` events to refresh.

### Technical details

- Keep the state as a discriminated union: `{kind:"loading"} | {kind:"empty"} | {kind:"error"} | {kind:"success", trails}`.
- Unknown ids in storage are dropped silently when mapped against the catalogue.
- Compare link: `/compare?ids=a,b,c`. When disabled, render a `<button disabled>` rather than a link with no href.
- The note refusing a fourth tick sits in `<p aria-live="polite">`.

### Done when

- With empty storage, the empty message and the link to regions show.
- After saving 3 trails in different regions, they show newest first with their region names. A fourth tick shows the note. Compare opens `/compare?ids=…` in tick order.

## Phase 3: Compare route handler and page

**Goal** — `/compare?ids=…` shows 2–3 trails side by side with weather, backed by `GET /api/compare`.

**Prerequisites** — Phase 1 (`elevationGainM`), Phase 2 (the link into it).

### Tasks

- [x] Extract the OpenWeather call from `app/api/weather/route.ts` into `lib/weather.ts`, returning `{ ok: true, weather } | { ok: false, status, code, message }`. `/api/weather` then maps that to its response, and its existing tests must stay green unchanged.
- [x] Create `app/api/compare/route.ts` as `GET ?ids=a,b[,c]`.
- [x] Create `tests/compare-route.test.ts`.
- [x] Create `app/compare/page.tsx` (server wrapper with PageHeader) and the `components/CompareTable.tsx` client component with four states.
- [x] Update CLAUDE.md's "Where things live" to mention `lib/weather.ts`.

### Technical details

- Validation: split on `,`, trim, drop empties. Require 2 ≤ n ≤ 3, no duplicates, and every id known. Otherwise return 400 `{ error: { code: "COMPARE_BAD_IDS", message: "Pick two or three trails to compare." } }`.
- Weather: `Promise.all(trails.map(t => fetchWeather(t.lat, t.lon)))`. Each call keeps the 5 s timeout from `lib/weather.ts`.
- Response 200:
  ```json
  { "trails": [ { "id", "name", "regionName", "distanceKm", "elevationGainM", "difficulty",
                  "entryFee": { "amount", "currency" }, "lastSurveyed",
                  "weather": { "tempC", "description", "windKph", "observedAt" } | null,
                  "weatherError": "WEATHER_TIMEOUT" | … | null } ] }
  ```
- The page reads `ids` from `window.location.search` on mount (same pattern as TrailSearch) and fetches `/api/compare`. A 400 is the empty state ("Pick two or three trails to compare." plus a link to Favourites). Any other failure is the error state with Retry.
- Table: `<table>` with `<caption>`, a `<th scope="row">` per row, and one column per trail. Money and dates go through `formatMoney` and `formatDate`.

### Done when

- The compare-route tests cover the cases listed in spec §12 Integration and pass, including "the key is not in the body".
- `/compare?ids=ajloun-soap-house,mujib-siq` renders both columns. Without a key, the weather row reads "Weather unavailable".
- `/compare?ids=nope` shows the empty state.
- The `site-reviewer` reports no BLOCKING findings on the full branch diff.

## Decisions

| Decision | Reasoning | Alternatives rejected |
|---|---|---|
| Favourites live in `localStorage` | The spec rules out accounts, and the free tier has no database | Vercel KV/Postgres: too much setup for the brief, and it needs identity |
| The compare page gets its data from a route handler, not straight from the catalogue in the browser | The weather must be fetched server-side (house rule 5), so the facts and weather arrive together in one call | Separate `/api/weather` calls per column: 3 round trips, and 3 loading states in one table |
| Share the weather call in `lib/weather.ts` | Two route handlers must behave the same (timeout, envelope codes) | Copy-pasting the fetch into `/api/compare`: the two would drift apart |
| Ids are read from `window.location` on mount | Keeps pages static, same pattern as Feature A | `useSearchParams`: needs a Suspense boundary on a static page |

## Open questions

| Question | Blocking? | Owner |
|---|---|---|
| Should favourites be exportable? | No | Deferred to a follow-up (spec §14) |

## Deviations

- **Phase 3 — types moved out of the route module.** The plan had CompareTable import `ComparedTrail` from `app/api/compare/route.ts`. The reviewer pointed out that a client component importing a route module is one keystroke from pulling `lib/weather.ts` (and the key read) into the bundle. Types and the id parser now live in `lib/compare.ts`, which has no server imports.
- **Phase 3 — id validation shared, and run on the client too.** The plan put the 2–3 distinct ids check only in the route handler; spec §8 says "Both". `parseCompareIds` in `lib/compare.ts` is used by the route and by CompareTable, which goes straight to the empty state without a fetch.
- **Phases 2–3 — save button and compare button accessibility changed from the spec.** Spec §5 said screen readers "hear its pressed state"; with a label that also changes, `aria-pressed` read as "Saved — remove, pressed". Dropped `aria-pressed`, kept the changing label, and amended spec §5. The disabled Compare button became `aria-disabled` with a hint, so keyboard users can reach it and learn why it does nothing.
- **Phases 1–3 — one session, no `/clear`.** The plan assumes a fresh session per phase. All three phases were executed in one Claude Code session; the plan file was still updated after every phase as if a new session would pick it up.
- **Open, not done:** `import "server-only"` in `lib/weather.ts` (reviewer advisory 5). Needs a new dependency and a Vitest alias; left for a follow-up.

## Session log

| Date | Phases touched | Notes |
|---|---|---|
| 2026-09-28 | 1 | Session 1. Added elevationGainM to all 11 trails (type, data, test, CLAUDE.md, /add-category) and the favourites store + button. 26 tests green, build green. Browser: Save → "Saved — remove", aria-pressed=true, survives reload; Soap House shows 350 m. |
| 2026-09-28 | 2 | Same Claude Code session as phase 1 (no /clear — see Deviations). Nav link, /favourites with loading/empty/error/success, compare ticks. Browser: empty message; 4 saved → newest first with region names; button disabled at 1 pick; 4th pick refused with note; link /compare?ids=a,b,c in tick order; corrupt storage → error + Retry. |
| 2026-09-28 | 3 | Same session. Extracted lib/weather.ts (existing /api/weather tests unchanged and green), /api/compare + 8 tests, /compare page. Browser: 3 trails side by side, 7 rows in house format, "Weather unavailable" without a key, ?ids=nope → empty state; no client chunk mentions OPENWEATHER_API_KEY or api.openweathermap.org. **site-reviewer run 1: 4 BLOCKING** — no loading/error in app/favourites and app/compare; compare tests missing key-absence checks and two weatherError paths; ?ids= not validated on the client; any 400 treated as empty — plus 9 ADVISORY. All BLOCKING and 8 of 9 advisories fixed (see Deviations). Browser re-check found the reviewer's suggested requestAnimationFrame re-announce never fired in a tab that isn't painting → setTimeout. 37 tests green, build green. **site-reviewer run 2: no BLOCKING**, 2 ADVISORY (favourites page imported data/ directly; /api/weather 400/503 tests lacked key-absence checks) — both fixed. 3 reviewer lines added (accessible names on repeated controls; no client imports from app/api; timing-fix suggestions). |
