# data-science--co-working-

Data Science Co-Working — AI & data builder co-working website. Vite + React single-page app.
`package.json` is at the **repository root** so DigitalOcean App Platform detects Node.js.

## Local

```bash
npm ci
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

Node 22 (see `.nvmrc`; Vite 8 needs Node ^20.19 or >=22.12).

## DigitalOcean App Platform

Deployed as a **Static Site built with the Node.js buildpack** — Node/npm are available
during the build, and only the built `dist/` is served. The spec is in `.do/app.yaml`:

| Field | Value |
| --- | --- |
| Resource type | Static Site |
| Source directory | `/` (repo root — where `package.json` is) |
| Environment | `node-js` |
| Build command | `npm run build` (the Node.js buildpack runs `npm ci` itself first) |
| Output directory | `dist` |
| Run command | none (static site) |
| Catch-all document | `index.html` (client-side routes like `/community/openai`) |

`npm: command not found` means the component was built without the Node.js buildpack —
usually because the source directory didn't contain `package.json`, or the component was
set to plain static assets. Don't use `npm run dev` as a build or run command.

Apply the spec to the live app (the file in the repo is not applied automatically):

```bash
doctl auth init                                   # if the CLI token has expired
doctl apps list                                   # find the app ID
doctl apps update <APP_ID> --spec .do/app.yaml
doctl apps create-deployment <APP_ID> --wait
```

Or: Control Panel → the app → Settings → App Spec → paste `.do/app.yaml` → Save.
