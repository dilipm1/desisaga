# Desi Saga

Indian Hindu festival & ritual gift hampers — desisaga.com.

Ruby on Rails 8.1 · Hotwire (Turbo + Stimulus) · Importmap (no Node build) · Tailwind CSS v4 · SQLite · Solid Cache/Queue/Cable

## Quick start

```sh
bin/setup          # install gems, prepare DB
bin/rails db:seed  # 8 festival hampers + admin user
bin/dev            # run the app at http://localhost:3000
```

## What's inside

- `/` — festival hero with live countdown, year calendar, featured hampers
- `/products` — catalog with category filters + search; `/products/:slug` detail pages
- `/cart` — server-side session cart (quantity +/-, remove, clear)
- `/checkout` — Stripe test-mode placeholder → demo order success page
- `/login` — bcrypt session auth (Rails `authentication` generator)
- `/admin/products` — inventory CRUD (admin role required)

Admin credentials come from `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`), defaults `admin@desisaga.com` / `desisaga-admin-2026`.

## Tests

```sh
bin/rails test
```

## Deployment

Kamal is preconfigured (`config/deploy.yml`) for a VPS with SQLite. See AGENTS.md for the full plan.
