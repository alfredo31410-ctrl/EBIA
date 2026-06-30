# Railway Backend Setup - EBIA

## What Railway should run

Deploy the full Next.js app because the backend lives inside `app/api/[[...path]]/route.js`. Do not deploy only `app/api`.

## Railway service

- Service type: Node.js / Next.js
- Root Directory: repository root (`EBIA`)
- Install command: `yarn install --frozen-lockfile`
- Build command: `yarn build`
- Start command: `yarn start`

`next start` reads `process.env.PORT`, so Railway can inject its runtime port without code changes.

## Healthcheck

- Path: `/api/health`
- Expected response: JSON with `ok: true` and `service: "ebia-api"`

## Required environment variables

Configure these manually in Railway. Do not commit real values.

- `MONGO_URL`
- `DB_NAME`
- `MONGO_DNS_SERVERS`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- `JWT_SECRET`
- `CORS_ORIGINS`
- `APP_NAME`

Optional/public variables used by the current frontend:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_WHATSAPP_MESSAGE`

## Vercel frontend

Keep the existing Vercel domain as the public site. EBIA uses admin cookies, so the safest production setup is to keep browser calls on `/api/*` and configure Vercel to rewrite `/api/:path*` to the Railway service URL after Railway is validated.