# Launch checklist

Do this when you buy the domain and the server. Nothing in this file is a live password.

## What is already in the app

- Staging and production are selected with `APP_ENV` (`development`, `staging`, or `production`).
- The public address is `NEXT_PUBLIC_APP_URL`. HTTPS starts when that value is `https://…` and `APP_ENV=production` (HSTS is sent only then).
- Product photos in `/uploads` are cached for a year. Next.js serves AVIF and WebP for `next/image`. Set `IMAGE_REMOTE_HOSTS` if a CDN hostname is added later.
- Responses are compressed. Product and order queries have indexes for active category listings and order history.
- `/robots.txt`, `/sitemap.xml`, canonical URLs, and Product JSON-LD are generated from the catalog.
- Checkout prices come from the database. A repeated `Idempotency-Key` returns the same order. Tracked stock (`stockQuantity` greater than 0) is reduced inside the same database transaction. Quantity `0` means the catalog does not track a count, so cash-on-delivery still completes.
- `POST /api/payments/webhook` accepts a JSON notice signed with `PAYMENT_WEBHOOK_SECRET` (header `x-payment-signature`, HMAC-SHA256 of the raw body). The same event id is ignored the second time. Cash on delivery stays the customer payment method until you connect bKash, SSLCommerz, or Stripe and point their webhook here.
- Order email is sent only when `RESEND_API_KEY` is set. Otherwise it is written to the server log.
- Checkout is rate-limited. Inputs are validated on the server.
- `GET /api/health` checks the database. Errors can be forwarded to Sentry when `SENTRY_DSN` is set.
- Database copies are already `npm run db:backup` and `npm run sync:push`.

## Secrets

Copy `.env.example` to `.env` on each machine. Never commit `.env`.

Use different `DATABASE_URL`, `PAYMENT_WEBHOOK_SECRET`, `RESEND_API_KEY`, and `SENTRY_DSN` for staging and production. Generate the webhook secret with a long random string. Leave every secret empty in git.

## Email DNS (after the domain exists)

On the domain DNS panel, for the address in `SMTP_FROM`:

- SPF: one TXT record, for example `v=spf1 include:amazonses.com ~all` (use the include your email host documents).
- DKIM: the CNAME records that host gives you. Do not invent the selector.
- DMARC: `v=DMARC1; p=none; rua=mailto:you@your-domain` while you watch reports, then `p=quarantine` later.

## Deploy

1. Put the same git commit on the server.
2. Set the production `.env` (domain URL, database, webhook secret, mail, Sentry).
3. `npx prisma db push` against that database, then restore the catalog with `npm run sync:pull` or `npm run db:restore` from the latest `backups/db-backup-*.sql`.
4. `npm run build` and `npm run start`.
5. Open `https://your-domain/api/health` and expect `"ok": true`.
6. Place one cash-on-delivery order and confirm it in Admin → Orders.

## Rollback

1. Keep the previous build folder or the previous git commit id.
2. Point the process back at that commit and restart.
3. If the new release changed the database, restore `backups/db-backup-YYYY-MM-DD.sql` taken before the release. Do not restore over a database that already has newer customer orders unless you mean to drop those orders.

## Staging order check

`npx tsx scripts/staging-test-order.ts` places one order against the local database, repeats the same idempotency key, and posts a signed payment notice twice. It restores the product quantity afterward. The order row remains so you can see it in Admin → Orders.
