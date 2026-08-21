# Prabhakar Processors website

Vite + React frontend with an Express API (same `/api` handlers used in local `dev:api`).

## Local development

```bash
npm install
npm run dev
```

Runs Vite on `:5173` and the API on `:8787` (proxied as `/api`).

## Production (single host — e.g. Hostinger Node)

Build the static site, then start one Node process that serves **both** `dist/` and `/api`:

```bash
npm run build
npm start
```

On Hostinger, use framework **Express** (not Vite):

| Field | Value |
|---|---|
| Build command | `npm run build` |
| Package manager | `npm` |
| Output directory | `dist` |
| Entry file | `server.mjs` |

Or run locally / via start script: `npm start` → `node server.mjs`.

- Listens on `PORT` (default `3000`)
- Same-origin `/api/*` — no separate API host

Set the same env vars as local `.env` (database, admin secrets, etc.) in the host panel.
