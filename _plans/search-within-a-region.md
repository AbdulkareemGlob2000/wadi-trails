# Plan: Search Within a Region

Spec: `_specs/search-within-a-region.md`

## Approach
Keep `app/regions/[slug]/page.tsx` a statically generated server component. It passes the region's trails to a new client component, which owns the query, filters the list and keeps the URL in sync. Reading `searchParams` in the server page would make every region page dynamic, which acceptance criterion 7 rules out.

## Steps
1. **`lib/search.ts`**: add a pure `filterTrails(trails, query)`. It trims the query, lower-cases it, and keeps a trail if its name or summary contains it. An empty query returns the input unchanged, in the same order.
2. **`tests/search.test.ts`**: unit tests for the seven cases listed in spec §12.
3. **`components/TrailSearch.tsx`** (`"use client"`):
   - props: `regionName` and `trails`;
   - on mount, read `q` from `window.location.search`;
   - a labelled `<input type="search" maxLength={60}>`, where Escape clears it;
   - `history.replaceState` updates `?q=` without adding history entries, and drops it when empty;
   - a `<p aria-live="polite">` shows "n of total trails";
   - renders the card grid, which moves here from the page unchanged, with `formatMoney` and image dimensions kept;
   - no-match state: a message quoting the query, plus a "Clear search" button.
4. **`app/regions/[slug]/page.tsx`**: replace the inline grid with `<TrailSearch>`. Keep PageHeader, the region-has-no-trails empty branch and `generateStaticParams`.
5. **`app/globals.css`**: styles for `.search` (label, input, count).
6. Verify: typecheck, test, build (check `/regions/[slug]` still shows ● SSG), then a browser pass on Dead Sea and Rift.
7. Run the `site-reviewer` and fix any BLOCKING findings.

## Risks
- `useSearchParams` in a client component on a static page needs a Suspense boundary, or the build complains. Reading `window.location` in an effect avoids that.
- Until the effect runs, a first paint of a `?q=` URL shows the full list. That's acceptable for a static page.
