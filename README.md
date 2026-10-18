# Fit+

A personal health companion for meals, sugar awareness, movement, water, wellbeing and progress. The existing Fit+ interface, calculations and three languages are retained.

**GitHub app:** https://lauyanshen.github.io/fitplus/

**Repository:** https://github.com/lauyanshen/fitplus

## AI connection

Food estimation and the assistant reuse the existing protected Fit+ service at https://fit-plus-health.eddielau.chatgpt.site. GitHub Pages serves the app; it cannot run the server API.

When you submit an AI request, a small Fit+ connection window opens. Sign in with the same authorized ChatGPT account used for the original Fit+ app if requested, and keep that window open while the answer is generated. If sign-in interrupts the first request, finish signing in and retry. Allow pop-ups for the app. Existing Sites access permissions still apply: making the GitHub frontend public does not grant anyone access to the protected AI service.

The API key remains in the original service's protected runtime settings. No API key, bypass token, session cookie or personal record is included in this repository. The connection checks both message origin and window identity and sends results only to the owner’s GitHub Pages origin.

## GitHub Pages deployment

In **Settings → Pages**, set **Source** to **GitHub Actions**. The workflow **Deploy Fit+ to GitHub Pages** builds and publishes `dist/github-pages` on pushes to `main`. You can also run it manually from **Actions**.

## Local preview

Requires Node.js 24 (or a compatible Node.js 22.13+ release).

```sh
npm ci
npm run build:pages
npm run preview:pages -- --host 127.0.0.1 --port 4180
```

Open the printed `/fitplus/` URL. The AI bridge intentionally accepts only the production GitHub origin, not arbitrary localhost pages. Local AI tests should use mocks; do not loosen the production origin check.

## Records and offline use

Profiles and records stay in browser storage. The new GitHub address has separate storage from the old Sites address, so existing records are not moved automatically. Fit+ retains its JSON backup download.

After a successful initial load, the public app shell and images are cached for offline tracking. AI needs internet and the existing sign-in. No AI replies, authenticated Sites pages or health records are placed in the service-worker cache.

## Source layout

- `app/page.tsx`: shared Fit+ interface and tracking logic.
- `app/api/ai/route.ts`: existing server-only OpenAI endpoint.
- `app/ai-connect`: authenticated connection page deployed on the original Sites service.
- `lib/fit-ai-client.ts`: same-origin API on Sites; authenticated connection from GitHub Pages.
- `pages-client`, `vite.pages.config.ts`, `scripts/prepare-pages.mjs`: static frontend build and scoped offline shell.
- `components`, `public`, `vendor`: retained UI components, images and styles.
- Original project overview: [docs/PROJECT.md](docs/PROJECT.md).

The original Sites build files are retained separately from the static build. Updating this GitHub repository deploys the frontend only; changing the protected AI endpoint or connection page also requires publishing the original Sites app.

