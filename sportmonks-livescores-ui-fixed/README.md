# Sportmonks Livescores UI (Next.js + Serverless Proxy)

A minimal, production-ready Next.js App Router project that:
- Polls the Sportmonks livescores API every 3 seconds via a serverless proxy (avoids CORS).
- Displays data in a sticky-header table with good spacing.
- Lets you search by team names.
- Lets you hide/show columns individually and remembers your choices (localStorage).
- Splits multi-word headers onto multiple lines automatically.

## One-time Setup

1. **Create a new GitHub repo** and upload this folder.
2. **Vercel** → New Project → Import your GitHub repo.
3. In Vercel → Project Settings → **Environment Variables**:
   - `SPORTMONKS_URL` (optional): Full API URL. If not set, a sensible default with your token is baked in.
   - `CORS_ALLOW_ORIGIN` (optional): Set to your production domain if you’d like to restrict CORS. Defaults to `*`.

## Local Development

```bash
npm i
npm run dev
```

Open http://localhost:3000

## Production Build

```bash
npm run build
npm start
```

## Notes

- Data refreshes every **3000 ms** using SWR with `refreshInterval`.
- The serverless proxy is at `/api/livescores` and sets CORS headers.
- The proxy uses Next.js **Route Handlers** with `fetch` to the upstream API.
