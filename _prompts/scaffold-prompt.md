> Written with: Claude Code (Opus 5.5) in this repo — NOT a web model. Replace this note if you re-run it through ChatGPT/Claude web.
> Rounds: 1 draft + 1 revision (versions checked against `npm view` on 28 Sep 2026).

# Scaffold prompt — Wadi Trails (a catalogue of Jordan hiking trails)

You are working in an empty folder. Build a small, running vertical slice of a website and stop. Do not add anything beyond what is listed here.

## 0. Git first
1. Run `git init -b main` (skip if `.git` already exists on `main`).
2. Do **not** commit anything until step 7 is green. Then make exactly one commit: `chore: scaffold Wadi Trails vertical slice`.

## 1. Stack — exact versions, no ranges
| Package | Version |
|---|---|
| next | 15.5.26 |
| react / react-dom | 19.3.0 |
| typescript | 5.9.3 |
| @types/react / @types/react-dom | 19.3.0 |
| @types/node | 20.19.43 |
| vitest | 3.2.7 |

Node 20. Next.js App Router, TypeScript strict. No CSS framework — one `app/globals.css`. No database.

## 2. Folder layout
```
app/
  layout.tsx            site shell, nav link to "/"
  globals.css
  page.tsx              list of categories (regions)
  not-found.tsx
  regions/[slug]/page.tsx   list of trails in a region
  regions/[slug]/loading.tsx
  regions/[slug]/error.tsx
  trails/[id]/page.tsx      trail detail + weather panel
  api/weather/route.ts      the ONLY place the external API is called
components/
  PageHeader.tsx        eyebrow + h1 + one muted sentence
  WeatherPanel.tsx      client component, calls /api/weather
lib/
  catalogue.ts          read helpers over data/catalogue.ts
  format.ts             formatDate, formatMoney
data/
  catalogue.ts          categories and items (typed)
public/images/          local SVG placeholders
tests/                  vitest unit tests
.env.example
```

## 3. Data shape (`data/catalogue.ts`)
```ts
export type Region = { slug: string; name: string; blurb: string };
export type Trail = {
  id: string;            // kebab-case, unique
  regionSlug: string;    // must match a Region.slug
  name: string;
  summary: string;       // one sentence
  distanceKm: number;
  difficulty: "easy" | "moderate" | "hard";
  entryFee: { amount: number; currency: "JOD" };
  lastSurveyed: string;  // ISO date, e.g. "2026-03-14"
  lat: number; lon: number;   // trailhead
  image: { src: string; alt: string; width: number; height: number };
};
```
Seed exactly **one** region — `northern-highlands` (Ajloun area) — with **three** trails.

## 4. The one external call
`GET /api/weather?lat=..&lon=..` in `app/api/weather/route.ts`:
- Calls `https://api.openweathermap.org/data/2.5/weather?lat=..&lon=..&units=metric&appid=$OPENWEATHER_API_KEY` **server-side only**.
- 5-second timeout (`AbortSignal.timeout(5000)`).
- Success: `{ "tempC": number, "description": string, "windKph": number, "observedAt": string }`.
- Every failure returns `{ "error": { "code": "...", "message": "..." } }` with a suitable status (400 bad input, 503 key missing, 504 timeout, 502 upstream error).
- The key is read from `process.env.OPENWEATHER_API_KEY`. Never use a `NEXT_PUBLIC_` variable. Never log the key.
- `.env.example` lists `OPENWEATHER_API_KEY=` and `CONTEXT7_API_KEY=` with a comment on where each comes from. Add `.env` to `.gitignore`.

## 5. Formatting rules
- `formatDate("2026-09-15")` → `15 Sep 2026`. 24-hour times (`14:05`).
- `formatMoney(3.5, "JOD")` → `3.50 JOD`. Never a symbol, never `toLocaleString`.

## 6. Pages
- Every page (including not-found and error) starts with `<PageHeader eyebrow title subtitle />`.
- Region list and trail list: loading (`loading.tsx`), empty (message + link to what to do next), error (`error.tsx` with what failed + Retry button), success.
- Weather panel: loading, empty (no data), error (message + Retry), success.
- Every `<img>` has `alt`, `width` and `height`.

## 7. Definition of done
- `npm install` succeeds.
- `npm run typecheck` (`tsc --noEmit`) passes.
- `npm test` (`vitest run`) passes — tests for `formatDate`, `formatMoney`, data validity (unique ids, every trail's region exists, every field present), and the route handler returning the error envelope when the key is missing.
- `npm run build` passes.
- `npm run dev` serves `/`, `/regions/northern-highlands` and one trail page; the weather panel shows the error state without a key and live weather with one.
- Then — and only then — the single commit from step 0.
