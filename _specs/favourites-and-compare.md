# Favourites and Compare

| | |
|---|---|
| **Slug** | `favourites-and-compare` |
| **Branch** | `claude/feature/favourites-and-compare` |
| **Status** | Draft |
| **Created** | 2026-09-28 |

## 1. Summary

Visitors can save trails as favourites, see them together on a Favourites page, and pick two or three to compare side by side. The compare view shows each trail's key facts and its current weather. Each trail also gets an elevation-gain figure, because "how much climbing?" is the first question anyone asks when comparing walks.

## 2. Problem

Choosing a walk for a weekend usually means weighing two or three trails in different regions. Today that means opening each trail page in turn and remembering the numbers. There is no way to keep a shortlist, and nothing tells you how steep a trail is.

## 3. Goals and non-goals

**Goals**

- A visitor can save and unsave any trail from its page, and the choice survives a reload on the same browser.
- A visitor can see all saved trails on one page, whichever region they are in.
- A visitor can compare two or three saved trails side by side, including current weather at each trailhead.
- Every trail shows how much it climbs.

**Non-goals**

- Accounts, sign-in, or favourites that sync across devices or browsers.
- Sharing a favourites list with someone else. A compare link can be shared, but it is not a list.
- Comparing more than three trails.
- Weather forecasts. Only current conditions are shown, as on the trail page.

## 4. User stories

- As a visitor, I want to save a trail I like, so that I can find it again without searching.
- As a visitor, I want to see my saved trails in one place, so that I can build a shortlist across regions.
- As a visitor, I want to compare two or three trails side by side, including the weather right now, so that I can pick one for today.
- As a visitor, I want to see the elevation gain, so that I know how hard the climbing is.

## 5. User experience

**Entry point** — A "Save to favourites" button on every trail page, and a "Favourites" link in the site navigation.

**Main flow** —

1. On a trail page the visitor presses "Save to favourites". The button changes to "Saved — remove".
2. They open Favourites from the navigation and see every saved trail as a card, with its region.
3. They tick "Compare" on two or three cards. A fourth tick is refused, with a note that three is the maximum.
4. They press "Compare selected" and land on the compare page, which shows one column per trail.
5. The compare page address lists the chosen trails, so it can be bookmarked or shared.

**States**

| State | Behaviour |
|---|---|
| Loading | Favourites: "Loading your saved trails…" until saved trails have been read. Compare: "Loading the comparison…" until the comparison arrives. |
| Empty | Favourites: "You haven't saved any trails yet. Open a trail and press Save to favourites." with a link to the regions. Compare with fewer than two trails: "Pick two or three trails to compare." with a link to Favourites. |
| Error | Favourites, browser storage unavailable: "Your saved trails could not be read in this browser." plus Retry. Compare fails: what failed, plus Retry. Weather fails for one trail only: that column shows "Weather unavailable", and the rest of the comparison still shows. |
| Success | Favourites: the cards, the Compare ticks and the Compare button. Compare: a table with one column per trail. Its rows are Region, Distance, Elevation gain, Difficulty, Entry fee, Last surveyed and Weather now. |

**Interaction details** — Favourites are listed with the most recently saved first. Removing a favourite from its trail page takes it off the Favourites page and out of any selection. The Compare button stays disabled until two trails are ticked. Compare ticks are not remembered after leaving the page.

**Accessibility** — The save button's label says whether the trail is saved ("Save to favourites" / "Saved — remove"); it does not also use a pressed state, because the two together read as a contradiction. Each Compare tick is labelled with its trail's name, and the Compare button stays focusable below two ticks with a hint saying why it does nothing. The compare table has a caption and row headers. The note refusing a fourth pick is announced politely.

## 6. Interface contract

| Operation | Trigger | Purpose | Success result |
|---|---|---|---|
| Get comparison | Compare page loads | Facts and current weather for the chosen trails | A list of trails with their facts and weather |

**Inputs**

| Field | Type | Required | Rules |
|---|---|---|---|
| ids | list of trail ids | Yes | 2–3 ids, all existing, no duplicates |

**Outputs**

| Field | Type | Notes |
|---|---|---|
| trails | list | Same order as the ids asked for |
| trails[].facts | trail facts | Name, region name, distance, elevation gain, difficulty, entry fee, last surveyed |
| trails[].weather | weather or empty | Same fields as the trail page's weather. Empty when that trail's weather failed |
| trails[].weatherError | error code or empty | Why the weather is missing |

**Errors**

| Condition | Status / code | What the user sees |
|---|---|---|
| Fewer than 2 or more than 3 ids, duplicates, or an unknown id | 400 `COMPARE_BAD_IDS` | "Pick two or three trails to compare." with a link to Favourites |
| Weather key not configured | 200; each trail's weather is empty with `WEATHER_NOT_CONFIGURED` | Facts shown; each weather cell reads "Weather unavailable" |
| Weather times out or fails for one trail | 200; that trail's weather is empty with the code | That column reads "Weather unavailable" |

## 7. Data model

**New or changed records**

| Field | Type | Required | Constraints / default |
|---|---|---|---|
| Trail.elevationGainM | whole number of metres | Yes | 0 or more; every existing trail gets a value |
| Favourites (browser only) | ordered list of trail ids | — | Most recent first; at most 50; unknown ids are ignored when read |

**Access patterns** — "Which trails has this browser saved, newest first?" and "Is this trail saved?"

**Migration impact** — Every trail in the catalogue gains a field, and the data test must require it. There is no stored server data to migrate.

**Retention and growth** — Favourites are capped at 50 per browser. When the cap is hit, the oldest is dropped.

## 8. Validation rules

| Rule | Message | Enforced |
|---|---|---|
| Compare needs 2–3 distinct, known trail ids | "Pick two or three trails to compare." | Both |
| At most three trails can be ticked for compare | "You can compare up to three trails." | Client |
| Every trail has an elevation gain of 0 or more | — (data test fails) | Tests |

## 9. Background and scheduled work

None.

## 10. Security and access

Open to anyone who can reach the site. Favourites never leave the browser. The compare operation receives only trail ids and must reject anything that is not a known id, so arbitrary input never reaches the weather call. The weather key stays server-side and must never appear in the comparison response, including in error codes and messages.

## 11. Performance and scale

At most three weather calls per comparison. They run in parallel, each with the house five-second timeout, so a comparison never takes much more than five seconds.

## 12. Testing

**Integration** —

- Comparison with 2 valid ids returns both trails in order. With 1 id, 4 ids, a duplicate or an unknown id it returns `COMPARE_BAD_IDS`. With no key, each trail's weather is empty and the code is set. When one trail's weather fails, the others still have weather. No response contains the key.

**Unit** —

- Favourites store: save, remove, toggle, newest first, 50 cap, unreadable storage reported as an error rather than thrown.
- Data: every trail has an `elevationGainM` of 0 or more.

**Manual** —

- Save three trails in different regions, tick them, try a fourth tick, compare, reload the compare page, remove one favourite from its trail page and check that Favourites updates.

## 13. Acceptance criteria

- [ ] Every trail page has a Save / Saved — remove button, and the state survives a reload.
- [ ] The navigation has a Favourites link, and the page lists saved trails newest first, with each trail's region.
- [ ] With nothing saved, Favourites shows the empty message and a link to the regions.
- [ ] A fourth Compare tick is refused with "You can compare up to three trails."
- [ ] "Compare selected" is disabled below two ticks, and opens a compare page whose address names the chosen trails.
- [ ] The compare page shows Region, Distance, Elevation gain, Difficulty, Entry fee, Last surveyed and Weather now for each trail, with money and dates in house format.
- [ ] Opening the compare page with a bad selection shows "Pick two or three trails to compare."
- [ ] Without a weather key, the compare page still shows every trail's facts, with "Weather unavailable" in the weather row.
- [ ] Every trail shows its elevation gain on its own page.
- [ ] All new pages open with the house header block and have all four states.
- [ ] `npm run typecheck`, `npm test` and `npm run build` pass, and the `site-reviewer` reports no BLOCKING findings.

## 14. Open questions

| Question | Options | Owner |
|---|---|---|
| Should favourites be exportable as a list? | No / copy-as-text | Deferred — follow-up |

## 15. Out of scope and follow-ups

- Syncing favourites across devices, which needs accounts.
- Forecasts on the compare page.
