# Hosting controls (not done inside the app)

The application cannot stop a volumetric DDoS. These steps are done in the hosting dashboard after the domain and server exist.

## CDN and WAF

- Put the domain behind Cloudflare, or the host’s CDN, with the orange-cloud / proxy enabled.
- Set the origin to accept traffic only from the CDN IP ranges (origin lock). Do not leave port 443 open to the whole internet on the app server.
- Turn on the provider’s managed WAF ruleset for OWASP and known bots.
- Turn on bot fight mode or an equivalent challenge for `/admin/login` and `/api/auth`.
- Cache `/uploads/*` and `/_next/static/*` at the edge. Do not cache `/api/*`, `/admin`, or `/checkout`.

## CDN and WAF for multi-IP floods

Application rate limits slow one shopper, one account, or one IP. They do not stop a flood from many addresses. Do not put a daily cap of two or three requests on an IP. A normal customer loads the home page, several product pages, the cart, and checkout in one visit.

In the hosting dashboard:

1. Turn on the provider’s HTTP DDoS managed rules (Cloudflare: Security → DDoS → HTTP DDoS attack protection). Leave sensitivity at the managed default.
2. Turn on Bot Fight Mode, or an equivalent challenge, for `/admin/login` and `/api/auth`.
3. Turn on the managed OWASP WAF ruleset.
4. Add an edge rate rule that is much higher than human browsing, for example more than 1,000 requests in 10 seconds from one IP to the whole site, and set the action to Managed Challenge. Do not set that rule to a few requests per day.
5. Cache `/uploads/*` and `/_next/static/*` at the edge. Do not cache `/api/*`, `/admin`, or `/checkout`.
6. Lock the origin so only the CDN can reach port 443. The app trusts `x-forwarded-for` only after that lock exists.

The app’s own windows, enforced in `src/lib/rateLimit/limit.ts` when `REDIS_URL` is set:

| Action | Window | Key |
|---|---|---|
| Cached catalog reads | 600 per minute | IP |
| Search | 40 per minute | IP |
| Cart writes | 24 per minute | user id, and a separate IP cap |
| Login, signup, password reset | 8 per 15 minutes | IP and account |
| Order placement | 8 per hour | user id. The shared IP cap is 60 per hour so several customers on one network can each check out |

A 429 applies only to the action that exceeded its window and sends `Retry-After`. The first exceed clears when that window passes. A second exceed within two hours is blocked for five minutes. Another one is blocked for one hour. Nothing here bans an IP forever. If Redis is down, cart and checkout continue and the app logs `rate_limit_store_down`.

There is no signup or password-reset route yet. Those two actions use the same limiter the moment a route calls `limitAuthAction`.

## App config those services expect

- `NEXT_PUBLIC_APP_URL=https://your-domain`
- `APP_ENV=production` (sends HSTS)
- `NEXTAUTH_URL` equal to that same origin
- `NEXTAUTH_SECRET` a long random value, different from staging
- `PAYMENT_WEBHOOK_SECRET` the value the payment provider uses to sign webhooks
- `IMAGE_REMOTE_HOSTS` the CDN hostname if images are rewritten to it
- Trust the CDN’s `x-forwarded-for` only at the proxy. The app rate limiter uses that header and can be spoofed if the origin is reachable directly. Origin lock is what makes the header trustworthy.
- `REDIS_URL` so every app server shares the same sliding window. Without it, each process keeps its own counts.

## Admin MFA

- Turn on MFA for the hosting account, the GitHub account, and the database host.
- The app checks the admin role in the database on every admin request and rotates the session version on login. It does not enroll a TOTP device. Add an authenticator app in the host dashboard. Do not treat the login form as MFA.

## Backups

- Keep `npm run db:backup` on a daily schedule on the server, and copy `backups/db-backup-*.sql` off the machine.
- The in-app `npm run sync:push` path is for the two development PCs. It is not the production backup.

## What the app already enforces

See the control list in the security review notes. Payment webhooks still require `PAYMENT_WEBHOOK_SECRET` in the server environment or they return 503.
