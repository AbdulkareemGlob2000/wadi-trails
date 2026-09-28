# Search Within a Region

| | |
|---|---|
| **Slug** | `search-within-a-region` |
| **Branch** | `claude/feature/search-within-a-region` |
| **Status** | Draft |
| **Created** | 2026-09-28 |

## 1. Summary

Add a search box to each region page that narrows the trail list as the visitor types. It matches the trail name and summary, so a visitor can find "canyon" or "castle" trails without reading every card.

## 2. Problem

Each region now lists four or more trails, and the list will grow with every `/add-category` run. Right now a visitor looking for a particular kind of walk has to read every card. There is no way to narrow the list or share a narrowed view.

## 3. Goals and non-goals

**Goals**

- A visitor can narrow a region's trail list by typing part of a word.
- A narrowed list can be shared or bookmarked, and reopens with the same search.
- Having no matches is a clear state with a way out.

**Non-goals**

- Searching across all regions (site-wide search).
- Filtering by difficulty, distance or fee.
- Fuzzy matching, typo tolerance or ranking.
- A server-side search endpoint.

## 4. User stories

- As a visitor, I want to type "canyon" on the Dead Sea and Rift page and see only canyon trails, so that I can pick one quickly.
- As a visitor, I want to send a friend a link to my search, so that they see the same short list.

## 5. User experience

**Entry point** — The region page, above the trail list.

**Main flow** —

1. The visitor opens a region page. All trails are listed and the search box is empty.
2. The visitor types into the search box. The list narrows with every keystroke.
3. The page address updates to include the search, without adding a history entry per keystroke.
4. The visitor clears the box and the full list returns.

**States**

| State | Behaviour |
|---|---|
| Loading | The existing region loading state. The search adds none of its own. |
| Empty | The region has no trails: the existing empty message is shown, with no search box. No match: "No trails in <Region> match "<query>"." plus a "Clear search" button. |
| Error | The existing region error state with Retry. The search adds none of its own. |
| Success | The matching trails, with a line saying "<n> of <total> trails". |

**Interaction details** — Matching is case-insensitive and ignores leading and trailing spaces. The query matches if it appears anywhere in the trail name or summary. Result order stays the same as the unfiltered list. Pressing Escape in the box clears it. The search does not carry over when the visitor switches to another region.

**Accessibility** — The box has a visible label, "Search trails in <Region>". The result count is in a polite live region, so screen-reader users hear the list change.

## 6. Interface contract

None. The region's trails are already on the page, and filtering happens there.

**URL** — `/regions/<slug>?q=<query>`. When `q` is present on load it fills the box and filters the list. When the box is empty, `q` is removed from the address.

## 7. Data model

None. No data changes.

## 8. Validation rules

| Rule | Message | Enforced |
|---|---|---|
| The query is trimmed, and an empty query shows every trail | — | Client |
| The query is capped at 60 characters | — (the input stops accepting more) | Client |

## 9. Background and scheduled work

None.

## 10. Security and access

Open to anyone who can reach the site. The query is shown back to the user as plain text only and is never interpreted as markup. It is never sent to a server or an external service.

## 11. Performance and scale

Each region has tens of trails, so filtering them on every keystroke is fine. If a region ever grows into the hundreds, this should be revisited.

## 12. Testing

**Unit** —

- The filter matches on name, matches on summary, ignores case, trims spaces, returns every trail for an empty query, returns none for a non-matching query, and keeps the original order.

**Manual** —

- In the browser, type into the box on Dead Sea and Rift, check the count and the address, try a no-match query and clear it, reload with `?q=` in the address.

## 13. Acceptance criteria

- [ ] On `/regions/dead-sea-and-rift`, typing `canyon` shows exactly the trails whose name or summary contains "canyon" (any case).
- [ ] The line above the list reads "<n> of <total> trails" and updates as you type.
- [ ] Opening `/regions/dead-sea-and-rift?q=canyon` directly shows the same filtered list, with "canyon" in the box.
- [ ] A query that matches nothing shows the no-match message and a working "Clear search" button.
- [ ] Emptying the box removes `q` from the address and shows all trails.
- [ ] A region page still starts with the house header block, and the loading and error states are unchanged.
- [ ] `npm run typecheck`, `npm test` and `npm run build` pass, and the region pages are still statically generated.

## 14. Open questions

| Question | Options | Owner |
|---|---|---|
| Should the result count show while the box is empty? | Always / only while searching | Decided: always, so the total is visible |

## 15. Out of scope and follow-ups

- Site-wide search from the home page.
- Difficulty and distance filters.
