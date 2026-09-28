# Submission

- Site: https://wadi-trails.vercel.app/
- Preview deployment from a feature branch: https://wadi-trails-git-claude-featurefavou-bc99d1-abdulkareem-glob2000.vercel.app (branch `claude/feature/favourites-and-compare`)
- Stack: Next.js 15.5.26 (App Router), React 19.3.0, TypeScript 5.9.3, Vitest 3.2.7, Node 20
- External service and the variable that holds its key: OpenWeather current weather / `OPENWEATHER_API_KEY`. It is read only in `lib/weather.ts`, which is called by the route handlers `/api/weather` and `/api/compare`.

## The artifacts
- **Scaffold prompt:** `_prompts/scaffold-prompt.md`. Written with Claude Code (Opus 5.5) in the repo, not a web model, and the note at the top says so. It took 2 rounds: a draft, then versions pinned against `npm view`. Scaffold commit `f9b860f`: one commit, made after typecheck, tests and build were green.
- **Rule file:** `CLAUDE.md`, 52 lines. The three rules that earned their place:
  - "`tests/catalogue.test.ts` enforces this. If you add a field, add it to the test in the same change." Feature B added `elevationGainM` to the type, the data, the test, CLAUDE.md and `/add-category` in one commit (`850cabd`).
  - "`lib/weather.ts` — the one OpenWeather call … shared by `/api/weather` and `/api/compare`. Server-only." This was added when the second route handler arrived, so the timeout and error codes can't drift apart.
  - The Definition of done names the `site-reviewer` and the Playwright check. The reviewer ran 5 times in total; every run is recorded below.
- **MCP:** `.mcp.json` has Context7 over HTTP with `Authorization: Bearer ${CONTEXT7_API_KEY}` and Playwright over stdio. `claude mcp list` output, run in this folder on 28 Sep 2026. The `claude.ai …` lines are connectors on my Claude account, not project scope; the last two lines come from `.mcp.json`.
  ```
  claude.ai Claude Docs: https://api.anthropic.com/v1/pages/mcp - ✔ Connected
  claude.ai Notion: https://mcp.notion.com/mcp - ! Needs authentication
  claude.ai Atlassian Rovo: https://mcp.atlassian.com/v1/mcp/authv2 - ✔ Connected
  claude.ai Google Drive: https://drivemcp.googleapis.com/mcp/v1 - ✔ Connected
  claude.ai Consensus: https://mcp.consensus.app/mcp - ! Needs authentication
  claude.ai Lovable: https://mcp.lovable.dev - ! Needs authentication
  claude.ai Figma: https://mcp.figma.com/mcp - ! Needs authentication
  claude.ai Microsoft 365: https://microsoft365.mcp.claude.com/mcp - ! Needs authentication
  context7: https://mcp.context7.com/mcp (HTTP) - ✔ Connected
  playwright: npx -y @playwright/mcp@latest - ✔ Connected
  ```
  Note: Claude Code takes `${CONTEXT7_API_KEY}` from the shell environment, not from `.env`. I had to load `.env` into the PowerShell session before `claude mcp list` saw the key (see What went wrong).
- **Skill:** `.claude/skills/house-style/`, containing SKILL.md, references/rules.md and assets/page-header.tsx. It was **not observed firing on its own** during Feature B. The work ran in a Claude Code session opened in another folder, so the project skill was never loaded. It was applied by reading it. I have no transcript line to point to.
- **Reviewer:** `.claude/agents/site-reviewer.md` has 8 rules added after the starter, each annotated with its incident:
  1. The home region list had no `loading.tsx`/`error.tsx`. Rule added: every list segment has its own loading and error files.
  2. `WeatherPanel` parsed the body before checking `res.ok`. Rule added: check `res.ok` first, and a body that won't parse is an error state.
  3. `/api/weather` returned 200 with `tempC: null` on a malformed upstream body. Rule added: validate the upstream shape, and return a 502 envelope when it's wrong.
  4. Only 3 of the weather route's paths were tested. Rule added: every error code has a test, and each test asserts the key is not in the response.
  5. Search read `?q=` without the 60-character cap. Rule added: values read from the URL get the same validation as the input they mirror.
  6. Every Compare checkbox was named "Compare". Rule added: repeated controls include the item's name.
  7. `CompareTable` imported its types from a route module. Rule added: client components never import from `app/api/**` or from env-reading modules.
  8. The reviewer's own `requestAnimationFrame` suggestion never fired in a tab that wasn't painting. Rule added: say how a timing fix was checked before suggesting it.
- **/add-category:** `0bf7031` content: add category Dead Sea and Rift, and `2758fa5` content: add category Southern Desert. Each added 4 trails on top of the scaffold's Northern Highlands.

## The lifecycle
- **Feature A (search within a region, Path A):**
  - spec `_specs/search-within-a-region.md` (`b7c511b`)
  - plan `_plans/search-within-a-region.md` (`d5d1980`)
  - branch `claude/feature/search-within-a-region`
  - implementation `f213920`
  - merge `f184c02`
  - Reviewer result: no BLOCKING, 2 ADVISORY, both fixed.
  - The plan was written in the session, not in plan mode.
- **Feature B (favourites and compare, Path B):**
  - spec `_specs/favourites-and-compare.md`, picked up untracked by `/create-feature-branch`
  - plan `_plans/favourites-and-compare.md`, committed with the spec before any code (`e317cd7`)
  - 3 phases: `850cabd`, `6fb99f3`, `7a21e6c`
  - merge `55e49e3`
  - Reviewer run 1: 4 BLOCKING and 9 ADVISORY. Run 2: no BLOCKING and 2 ADVISORY, both fixed.
  - **Sessions: 1.** All three phases ran in one Claude Code session with no `/clear` between them. The plan file was still updated after each phase, with Progress and the Session log. The spec was written in Claude Code, not a web model.
- **One deviation from the plan and why:** CompareTable was meant to import its types from `app/api/compare/route.ts`. The reviewer pointed out that one careless edit would bundle the key-reading `lib/weather.ts` into the browser, so the types and the id parser moved to `lib/compare.ts`, which has no server imports. The plan's Deviations section lists four more, including the one-session run.

## What went wrong
- **The home page shipped without loading and error states.** The house-style skill requires them, and I assumed the root had them because the region page did. The reviewer caught it. Fixed with `app/loading.tsx` and `app/error.tsx`, plus reviewer rule 1 (`6c3461d`). The same rule then caught the same gap in `app/favourites` and `app/compare` on Feature B, so the ratchet paid off.
- **A reviewer suggestion that didn't work.** I applied the reviewer's `requestAnimationFrame` fix for re-announcing "You can compare up to three trails." A browser check showed the note never appeared, because rAF doesn't fire in a tab that isn't painting. Switched to `setTimeout` and added reviewer rule 8 (`7a21e6c`).
- **A wrong test on Feature A.** One expectation was wrong: "waterfall" is in an image's alt text, not the summary. The test was fixed, not the code.
- **New OpenWeather key not yet active at first deploy.** On 28 Sep the live `/api/weather` returned `WEATHER_UPSTREAM` ("The weather service answered 401."). The key reached Vercel (a missing key gives `WEATHER_NOT_CONFIGURED`), but OpenWeather had not activated it yet. The house error state with Retry showed as designed. By 16:17 UTC the same day the key was active and `/api/weather` returned live data with no redeploy. The key was also pasted into a chat once, so it will be rotated after marking.
- **A key typed into the committed file.** While setting up, I first pasted the OpenWeather key into `.env.example`, the committed list, instead of `.env`. It was caught before any commit: `git status` showed the file modified, `git log --all -p` had no trace of the key, and `git restore .env.example` put it back. The key then went into `.env`, which is ignored.
- **Previews were behind a Vercel login.** Vercel Deployment Protection is on by default, so the branch preview redirected to a Vercel sign-in page. I turned off Vercel Authentication under Settings → Deployment Protection so the marker can open it.
- **`.mcp.json` doesn't read `.env`.** Claude Code fills `${CONTEXT7_API_KEY}` from the process environment, so the key has to be loaded into the shell first. The README now says so.
- **Office network.** The first `npm install` failed with `ECONNRESET`. A retry with `--fetch-retries=5` worked; no config was changed.
- **Browser checks.** They were done in the Claude desktop app's built-in browser, not the Playwright MCP, because the session wasn't opened in this folder.

## Secrets check
- `git check-ignore -v .env .env.example`:
  ```
  .gitignore:9:.env	.env
  ```
  It is silent on `.env.example`, which is committed. `git ls-files` lists no other env file.
- The history was scanned on 28 Sep 2026 with `git log --all -p | grep -inE "(api_key|apikey|appid|bearer|token)[^a-z_]*[=:][ \"']*[A-Za-z0-9]{12,}"`: 0 matches. A second pass for any 32-character hex string (the shape of an OpenWeather key) matched only commit hashes. The test suite also asserts that `test-key` never appears in any API response.
- No key was ever committed, so nothing needed rotating.
