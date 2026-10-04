# Donezo Dashboard

A client-rendered React and TypeScript dashboard template built with Vite and Tailwind CSS 4. It demonstrates dashboard layout, authentication screens, light/dark themes, search, dialogs, and other local interactions.

Authentication, data, and several actions are demonstrations. There is no backend, database, real registration, or production authentication.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4 (via `@tailwindcss/postcss`)
- lucide-react icons

## Requirements

- Node.js 22.13+ within the 22.x line (checked with Node 22.23.1)
- npm with the existing `package-lock.json`
- A modern browser (Tailwind 4 targets Safari 16.4+, Chrome 111+, Firefox 128+)

## Getting started

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, normally <http://localhost:5173>. No environment variables or database setup are required.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Run the Vite development server |
| `npm run typecheck` | Run `tsc -b --pretty false` |
| `npm run lint` | Run `eslint .` |
| `npm run build` | Type-check and build to `dist/` |
| `npx vite preview` | Serve an existing `dist/` build locally |

There is no test runner configured.

## Pages

| Path | Result |
| --- | --- |
| `/login` | Login form |
| `/register` | Registration form |
| `/` | Dashboard when a demo marker exists, otherwise the login form |
| Any other path | Same marker-dependent fallback as `/` |

Routes are selected from `window.location.pathname`. Sidebar entries update local state rather than navigating.

## Project structure

| Concern | Location |
| --- | --- |
| Entry point and app routing | `src/App.tsx`, `src/main.tsx` |
| Authentication demonstration | `src/AuthPage.tsx` |
| Shared Button, Card, Input | `src/components/ui.tsx` |
| Browser storage helpers | `src/lib/auth.ts`, `src/lib/theme.ts` |
| Class string helper | `src/lib/utils.ts` |
| Tailwind entry and global styles | `src/index.css` |
| Build and tooling config | `vite.config.ts`, `postcss.config.js`, `eslint.config.js`, `tsconfig*.json` |

## Storage

| Key | Value | Purpose |
| --- | --- | --- |
| `donezo-user` | Submitted email string | Demo marker that shows the dashboard |
| `donezo-theme` | `light` or `dark` | Theme preference |

`donezo-user` is a demo marker, not a session credential. Client path checks cannot protect data.

## Documentation

- [ARCHITECTURES.MD](./ARCHITECTURES.MD) — module boundaries and architecture
- [SYSTEM.MD](./SYSTEM.MD) — setup, behavior, deployment, and known limitations
- [AGENTS.md](./AGENTS.md) — contributor and agent instructions

## Deployment

Build the site and deploy `dist/` to any static host.

```sh
npm run build
```

Serve over HTTPS, configure history fallback so `/login`, `/register`, and other application routes return `index.html`, and verify direct deep links and reloads. The app assumes deployment at the origin root; a subdirectory needs Vite `base` configuration plus changes to the absolute `/login`, `/register`, and `/` navigation targets.

Static hosting cannot make the demo authentication secure. Add server-validated sessions and authorization before deploying protected functionality.
