# Submission

> DRAFT — every `TODO` must be replaced with a real value from your own run before you hand this in.

- Site: TODO <production URL, e.g. https://wadi-trails.vercel.app>
- Preview deployment from a feature branch: TODO <URL>
- Stack: Next.js 15.5.26 (App Router), React 19.3.0, TypeScript 5.9.3, Vitest 3.2.7
- External service and the variable that holds its key: OpenWeather current weather / `OPENWEATHER_API_KEY` (called only from `app/api/weather/route.ts`)

## The artifacts
- Scaffold prompt: `_prompts/scaffold-prompt.md`, written with Claude Code (Opus 5.5), not a web model. 2 rounds (a draft, then pinned versions checked with `npm view`). Scaffold commit `f9b860f`.
- Rule file: `CLAUDE.md`, 50 lines. The three rules that earned their place:
  - "`tests/catalogue.test.ts` enforces this. If you add a field, add it to the test in the same change."
  - "Weather is fetched client-side from our own `/api/weather`, never from openweathermap.org directly."
  - Definition of done: the `site-reviewer` must report no BLOCKING findings, and the changed pages must be opened through Playwright.
- MCP: `claude mcp list` output:
  ```
  TODO paste output (both context7 and playwright connected, no missing-variable warning)
  ```
- Skill: `.claude/skills/house-style/` (SKILL.md, references/rules.md, assets/page-header.tsx). Transcript line where it fired on its own during Feature B: TODO.
- Reviewer: `.claude/agents/site-reviewer.md`. Four rules were added after its first real run on 28 Sep, and all four were fixed in `6c3461d`:
  1. The root region list had no `loading.tsx`/`error.tsx` (BLOCKING). Rule added: every list segment has its own loading and error files.
  2. `WeatherPanel` called `res.json()` before checking `res.ok`, so a non-JSON 500 showed "check your connection". Rule added: check `res.ok` first, and treat a body that won't parse as an error state.
  3. `/api/weather` returned 200 with `tempC: null` when the upstream body was malformed. Rule added: validate the upstream shape, and return a 502 envelope when it's wrong.
  4. Only the 400, 503 and 200 paths had tests. Rule added: every error code has a test, and every test asserts the key is not in the response.
- /add-category: TODO the two commits (`content: add category Dead Sea and Rift`, `content: add category Southern Desert`)

## The lifecycle
- Feature A (search within a region): spec TODO `_specs/…`, plan TODO `_plans/…`, branch TODO `claude/feature/…`, merge commit TODO
- Feature B (favourites + compare page): spec TODO, plan TODO, phases TODO, sessions TODO, merge commit TODO
- One deviation from the plan and why: TODO

## What went wrong
- The home page's region list shipped without loading or error states, even though the house-style skill requires them. The region page had both, and I assumed the root did too. The reviewer caught it. The fix was `app/loading.tsx` and `app/error.tsx`, plus a new checklist line in `site-reviewer.md` (`6c3461d`).
- The first `npm install` failed with `ECONNRESET` on the office network. A retry with `--fetch-retries=5` worked. No config was changed.
- TODO anything from Features A and B.

## Secrets check
- `git check-ignore -v .env .env.example`:
  ```
  .gitignore:9:.env	.env
  ```
  (silent on `.env.example`, so it is committed)
- History scanned with `git log -p | grep -iE "key\s*=\s*[A-Za-z0-9]{8,}|bearer [a-z0-9]{8,}"`: no matches. TODO re-run it after the last merge.
- No key was ever committed.
