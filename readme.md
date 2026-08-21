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

- **Build command:** `npm run build`
- **Start command:** `npm start` (required — do not use static-only Vite deploy)
- Listens on `PORT` (default `3000`)
- Same-origin `/api/*` — no separate API host

Set the same env vars as local `.env` (database, admin secrets, etc.) in the host panel.
