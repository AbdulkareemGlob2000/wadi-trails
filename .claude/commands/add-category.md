---
description: Add a new region (category) with at least four trails to data/catalogue.ts, then typecheck. Does not commit.
argument-hint: <Region name, e.g. Southern Desert>
allowed-tools: Read, Edit(data/catalogue.ts), Bash(git status:*), Bash(git diff:*), Bash(npm run typecheck), Bash(npm test)
---

Add the region **$ARGUMENTS** to Wadi Trails.

1. Run `git status --porcelain`. If it prints anything, stop and reply: "Working tree is dirty — commit or stash first." Do nothing else.
2. Read `CLAUDE.md` (Data shape) and `data/catalogue.ts`. If a region with the same name or slug exists, stop and say so.
3. Append one `Region` to `regions`: `slug` = kebab-case of "$ARGUMENTS", a one-sentence `blurb`.
4. Append at least four `Trail`s for that region: real, plausible trails in that part of Jordan, with every required field,
   realistic trailhead `lat`/`lon`, `entryFee.currency: "JOD"`, and `lastSurveyed` within the last 12 months.
   Use an existing file in `public/images/` for `image.src`, with a specific `alt` and `width: 640, height: 360` (house-style rule 6).
5. Run `npm run typecheck` and `npm test`. If either fails, fix `data/catalogue.ts` and re-run.
6. Stop. Show `git diff --stat` and a one-line summary per trail. Do **not** run `git add` or `git commit` —
   the human reviews the diff and commits it as `content: add category $ARGUMENTS`.
