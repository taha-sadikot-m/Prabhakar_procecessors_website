# Prabhakar Processors website

Vite + React frontend with an Express API (same `/api` handlers used in local `dev:api`).

## Local development

```bash
npm install
npm run dev
```

Runs Vite on `:5173` and the API on `:8787` (proxied as `/api`). Images stay in `public/`.

## Production (single host — Hostinger Express)

Hostinger runtime cannot run Vite/esbuild. **Build locally**, then deploy a **slim** `dist/` (JS/CSS/HTML only). Images are served from `public/` (already in the repo) — they are **not** copied into `dist/`.

```bash
npm run build   # slim dist/ + server.run.mjs
npm start       # node server.js → server.cjs → server.run.mjs
```

Before every deploy that changes the UI or API server code:

```bash
npm run build
git add dist server.run.mjs
git commit -m "chore: refresh production build"
git push
```

### Hostinger panel

| Field | Value |
|---|---|
| Framework | **Express** |
| **Build script** | **leave blank** |
| Entry file | **`server.js`** |
| Output directory | **leave blank** |
| Node | `24.x` |
| Package manager | `npm` |

Set the same env vars as local `.env` (database, admin secrets, etc.). Hostinger sets `PORT`.

### Verify after deploy

- Homepage: `https://YOUR_HOST/`
- API: `https://YOUR_HOST/api/health` → `{"ok":true}`
- SPA: `https://YOUR_HOST/careers` (refresh should work)
