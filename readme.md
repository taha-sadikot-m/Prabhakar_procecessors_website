# Prabhakar Processors

Vite + React site with Express/Vercel-compatible API and Neon CMS.

## Local development

```bash
npm install
npm run dev
```

Requires a `.env` with at least:

- `DATABASE_URL` — Neon Postgres connection string
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — admin login
- `JWT_SECRET` — admin session signing

## Production build

```bash
npm run build
npm start
```

`npm start` runs [`server.js`](server.js), which serves `dist/` and the same `/api/*` routes used in development (Neon, admin, gallery, etc.).

## Hostinger Web App

In Hostinger build/output settings:

| Setting | Value |
| --- | --- |
| Package manager | `npm` |
| Entry file | `server.js` |
| Build command | `npm run build` (if the panel has a separate build step) |
| Start | Prefer `npm start`, or entry `server.js` (bootstraps tsx itself) |

Set these environment variables in the Hostinger panel (same values as local `.env`):

- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `JWT_SECRET`

The database stays on **Neon**; Hostinger only runs the Node app. Admin (`/admin`) and public CMS APIs work the same as locally once those env vars are set.

Node **20+** is required (`engines` in `package.json`).
