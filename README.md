# data-science--co-working-

Interchange co-working website. App code lives in `co-working/`.

## Local

```bash
cd co-working
npm install
npm run dev
```

## DigitalOcean App Platform

This is a **Vite static site**, not a Node server. Do **not** set the build command to `npm run dev` — that starts a local dev server, never finishes a production build, and on a Static Site resource Node/npm is often missing (`npm: command not found`).

### Settings (fix the failed deploy)

1. Open the app in [DigitalOcean App Platform](https://cloud.digitalocean.com/apps).
2. **Settings → App-Level Settings / Components** for this site, then **Edit**.
3. Use:

| Field | Value |
| --- | --- |
| Resource type | **Static Site** (not Web Service) |
| Branch | `main` (latest commit, not an old empty README-only SHA) |
| Source Directory | `co-working` |
| Environment / buildpack | **Node.js** (`node-js`), not Static Assets / HTML |
| Build Command | `npm ci && npm run build` |
| Output Directory | `dist` |
| Custom run / start command | **leave empty** (delete `npm run dev`) |
| Catchall document | `index.html` (for React Router paths) |

4. Save, then **Create Deployment** / **Deploy**.

You can also replace the app spec with `.do/app.yaml` in this repo (Settings → App Spec).
