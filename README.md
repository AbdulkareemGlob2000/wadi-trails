# Wadi Trails

A small catalogue of hiking trails in Jordan, grouped by region, with live trailhead weather from OpenWeather.

## Run it locally
```bash
git clone <this repo>
cd wadi-trails
npm install
cp .env.example .env
```
Fill in `.env`:
- `OPENWEATHER_API_KEY` — free key from https://home.openweathermap.org/api_keys (new keys can take up to 2 hours to activate). Used by the site.
- `CONTEXT7_API_KEY` — free key from https://context7.com/dashboard. Used only by Claude Code (`.mcp.json`), not by the site.
  Claude Code reads it from the shell environment, not from `.env`. On Windows PowerShell, load `.env` before running `claude`:
  ```powershell
  Get-Content .env | ForEach-Object { if ($_ -match '^\s*([A-Z0-9_]+)\s*=\s*(.*)$') { Set-Item "env:$($matches[1])" $matches[2].Trim() } }
  claude mcp list   # context7 and playwright should both show "Connected"
  ```

```bash
npm run dev
```
Open http://localhost:3000.

## Checks
```bash
npm run typecheck
npm test
npm run build
```

## Deploy
Import the repo into Vercel and add `OPENWEATHER_API_KEY` under Settings → Environment Variables (Production and Preview), then redeploy.
