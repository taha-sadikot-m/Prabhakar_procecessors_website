# Prabhakar Processors website

Vite + React frontend with an Express API (same `/api` handlers used in local `dev:api`).

## Local development

```bash
npm install
npm run dev
```

Runs Vite on `:5173` and the API on `:8787` (proxied as `/api`).

## Production (single host — Hostinger Express)

```bash
npm run build   # builds dist/ + server.run.mjs
npm start       # node server.js → server.cjs (same process listens on PORT)
```

### Hostinger panel

| Field | Value |
|---|---|
| Framework | **Express** |
| **Build script** | **`build`** (script name — do **not** leave blank) |
| Entry file | **`server.js`** (`server.cjs` is the CommonJS bootstrap it loads) |
| Output directory | **leave blank** (Express serves `dist/` itself; do not set `dist`) |
| Node | `24.x` |
| Package manager | `npm` |

Set the same env vars as local `.env` (database, admin secrets, etc.). Hostinger sets `PORT`.

### Verify after deploy

- Homepage: `https://YOUR_HOST/`
- API: `https://YOUR_HOST/api/health` → `{"ok":true}`
- SPA: `https://YOUR_HOST/careers` (refresh should work)

Do **not** use `/heath` — that path does not exist.
