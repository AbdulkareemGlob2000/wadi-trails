# House style — detail

## 1. Page header
```tsx
<PageHeader eyebrow="Region" title={region.name} subtitle={region.blurb} />
```
- `eyebrow`: the section name (Regions, Region, Trail's region name, Favourites, Not found…). Rendered uppercase and letter-spaced by `.eyebrow` — pass it in normal case.
- `title`: the `h1`. One per page.
- `subtitle`: one sentence, muted. Not two.
- Loading and error route files have a header too.

## 2. Four states
| State | Must show |
|---|---|
| loading | a sentence saying what is loading ("Checking the current weather at the trailhead…") |
| empty | why it is empty + the next action (a link or instruction) |
| error | what failed + `<button>Retry</button>` wired to reload |
| success | the data |

For server-rendered lists: `loading.tsx` + `error.tsx` next to the page, and an explicit `length === 0` branch in the page.
For client panels: a discriminated union `{ kind: "loading" | "empty" | "error" | "success" }`.

## 3. Dates and times
- `formatDate("2026-09-15")` → `15 Sep 2026`
- `formatTime("2026-09-15T14:05:00Z")` → `14:05`
- Wrong: `Sept 15th`, `15/09/2026`, `September 15, 2026`, `2:05 PM`, `date.toLocaleDateString()`.

## 4. Money
- `formatMoney(3.5, "JOD")` → `3.50 JOD`; free entry is `0.00 JOD`, not "Free" in the price slot.
- Wrong: `JD 3.5`, `3.5 JOD`, `$3.50`, `Intl.NumberFormat(..., { style: "currency" })`.

## 5. External calls
```ts
const res = await fetch(url, { signal: AbortSignal.timeout(5000), cache: "no-store" });
return NextResponse.json({ error: { code: "WEATHER_TIMEOUT", message: "…" } }, { status: 504 });
```
- Codes are SCREAMING_SNAKE. Messages are for humans and never contain the key or the upstream URL.
- Status: 400 bad input · 503 not configured · 504 timeout · 502 upstream failure.

## 6. Images
- `<img src alt width height />` — width/height are the intrinsic size; CSS may scale.
- Placeholder images live in `public/images/`. No raw external URLs.

## Self-check before finishing
```
grep -rn "toLocale" app components lib        # must be empty
grep -rn "[$€£]" app components               # must be empty
grep -rn "<img" app components | grep -v "width="   # must be empty
```
