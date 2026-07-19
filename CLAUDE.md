# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

Despite the single repo, this is a **grab-bag of three unrelated static sites/apps** that are all deployed together from the repo root via Netlify. There is **no build step, no framework, and no test suite** — everything is hand-written HTML/CSS/vanilla JS that is served as-is. The one exception is the Stripe backend (Netlify Functions, Node). Most work here means editing a single self-contained `.html` file.

The three projects sharing this repo:

1. **Cris** — a PWA (Progressive Web App) that is the deployed root (`index.html`). A daily-companion app for ADHD/TDAH in Spanish ("thinks for you" to reduce micro-decisions). This is the primary/active project.
2. **What Maria Paints** — an art shop backend: Stripe checkout (`netlify/functions/`), catalog data (`obras.json`), a browser-only catalog editor (`editar.html`), and the post-payment page (`success.html`). `package.json` is named for this project.
3. **Un poema al día** — a standalone single-file page (`poema-del-dia.html`, ~370KB) about Canon Asins poems. Self-contained, unrelated to the other two.

Language note: the entire codebase, UI copy, comments, and docs are in **Spanish**. Match that when editing user-facing strings.

## Commands

There is no build/lint/test tooling. `package.json` only declares the `stripe` dependency for the Netlify Functions.

```bash
# Serve locally — required because of Service Worker, fetch, and relative-path
# iframes. Do NOT open index.html via file:// — the app breaks.
python3 -m http.server 8080
# then open http://localhost:8080

# Netlify Functions (Stripe) run under Netlify Dev if you need to test checkout:
npm install          # installs stripe
npx netlify dev      # serves site + functions at /api/* -> /.netlify/functions/*
```

Deployment is automatic: pushing to the deployed branch triggers a Netlify build (`netlify.toml`, `publish = "."`). GitHub Pages is also referenced in older docs (`INSTRUCCIONES.md`), but Netlify is the current host because the Stripe functions require it.

## Architecture — Cris PWA

`index.html` is the **launcher/dashboard**: it renders a grid of module cards (the `modules` array near the top of the file — icon, title, subtitle, and the module's HTML file). Tapping a card loads that module **inside a full-screen iframe** (`#moduleFrame`), with a floating 🏠 button to return to the dashboard.

**Why iframes:** each module in `modules/` is a fully self-contained HTML file (its own CSS, JS, and `localStorage`). The iframe boundary means module styles/globals never collide, and existing modules were dropped in unchanged. **To add a module: create `modules/<name>.html` and add one entry to the `modules` array in `index.html`.** Also add the file path to the `ASSETS` list in `service-worker.js` so it's cached offline.

**State lives entirely in `localStorage`**, one namespaced key per concern:
- Global settings: `cris_cfg` (voice/sound/vibration/reduce-stimuli), `cris_notif`, `cris_eco_day`.
- Per-module state: prefix `cris_<module>_v1` (e.g. `cris_rutina_diaria_v1`). The dashboard's "Hoy" panel reads these keys directly to show each module's real progress.

**PWA offline support** (`service-worker.js`, cache `cris-app-vN`):
- HTML requests → **network-first** (always latest), fall back to cache when offline.
- Everything else (fonts, icons) → **cache-first**.
- **Bump `CACHE_NAME`** (the `-vN` suffix) whenever you change cached assets, or clients keep the stale version. Old caches are purged on `activate`.

**`referencia_react/`** holds the original React `.tsx` prototypes. They are **reference only, not built or shipped** — source material for porting remaining modules to vanilla HTML/JS. Some modules (`rescate-emocional.html`, `juegos.html`) may still be placeholders whose full content lives in these `.tsx` files.

### Conventions for Cris modules (respect these when adding/porting)

- **One self-contained HTML file per module** — HTML + CSS + JS inline, no build, no external framework. Replace any `lucide-react`/library icons with emoji or inline SVG.
- **Palette:** turquoise `#26a69a` / `#4dd0e1`, lavender `#e8e6fb` / `#f3f1ff`, background `#f0f9ff`, text `#2d3748`. Accents: work `#ff6b6b`, long-rest `#ffd54f`.
- **Feedback is mandatory** on every timer: beep via Web Audio API, `navigator.vibrate`, and (where relevant) Spanish speech via Web Speech API (`lang = 'es-ES'`).
- **No open-ended decisions:** prefer preselected options, automatic progression, short encouraging messages from the quokka 🦘 mascot.
- **Mobile-first:** design/test at ~375px width, large one-handed buttons, portrait.

## Architecture — What Maria Paints shop

- **`netlify/functions/create-checkout.js`** — `POST /api/create-checkout` (redirected via `netlify.toml`). Takes `{ items: [{name, variant, price, qty}] }`, builds a Stripe Checkout Session in EUR, applies free shipping over €120 (else €8.50), and returns `{ url }` to redirect to. Prices are euros in the request, converted to cents (`* 100`).
- **`netlify/functions/webhook.js`** — Stripe webhook. On `checkout.session.completed` it emails an order notification via the Resend API. Signature is verified with `STRIPE_WEBHOOK_SECRET`; email is best-effort (skipped if `RESEND_API_KEY`/`ORDER_EMAIL` are unset).
- **`obras.json`** — the catalog (artwork records: id, name, technique, size, price, photo, description, spec table). This is the data source for the shop.
- **`editar.html`** — a **100% client-side** catalog editor: it `fetch`es `obras.json`, lets the owner edit entries and resize/embed photos in-browser, then **downloads a new `obras.json`** that the owner manually re-uploads to GitHub. There is no server-side write path.
- **`success.html`** — post-payment confirmation page (Stripe redirects here with `session_id`).

**Environment variables** (see `.env.example`; set them in Netlify, never commit `.env`): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `ORDER_EMAIL`, `FROM_EMAIL` (optional), `URL` (Netlify-provided).

## Netlify config (`netlify.toml`)

- `publish = "."` (repo root is the site), functions in `netlify/functions`, Node 18.
- `/api/*` → `/.netlify/functions/:splat`.
- HTML is served `no-cache` (so updates land immediately); security headers (`X-Frame-Options: DENY`, etc.) are applied site-wide; functions get permissive CORS.
- Note: `X-Frame-Options: DENY` applies to all pages, but Cris embeds modules **same-origin**, which `DENY`'d framing still allows — keep modules same-origin.

## Reference docs in this repo

- `docs/README_INTEGRACION.md` — the fullest explanation of the Cris integration approach, module status, and pending work.
- `docs/CRIS_APP_-_Página_de_Presentación_y_Contexto.md` — product/context dossier for Cris.
- `INSTRUCCIONES.md` — older end-user install guide (GitHub Pages era); still useful for the PWA install flow, but the host is now Netlify.
