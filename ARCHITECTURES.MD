# Architecture

This document describes the implementation inspected on October 4, 2026. Recommendations are marked separately from existing behavior.

## System boundary

Donezo Dashboard is a browser-only dashboard template. Vite bundles React/TypeScript and Tailwind styles into static assets. There is no application server, database, API client, router library, or server-enforced authentication in this project.

The browser owns all runtime state. Only the demo user marker and theme preference survive reloads. Team avatars are requested from an external image service; dashboard business data is hardcoded locally.

## Stack

Installed versions at inspection, not permanent version constraints:

| Layer | Implementation |
| --- | --- |
| UI runtime | React and React DOM 19.3.0, function components, StrictMode |
| Language | TypeScript 6.0.3, strict checking, ES2022 application target |
| Build | Vite 8.3.2, `@vitejs/plugin-react` 6.1.1 |
| Styling | Tailwind CSS 4.3.3 through `@tailwindcss/postcss` 4.3.3 |
| Components | Custom Button, Card, Input in `src/components/ui.tsx` |
| Icons | `lucide-react` |
| Quality checks | ESLint flat configuration, TypeScript project build |

`package-lock.json` records resolved dependencies. Most `package.json` dependency ranges are `latest`, so an intentional lockfile refresh may change the stack substantially.

## Source map

```text
index.html                    HTML shell, #root, early theme script
src/
  main.tsx                    React mount and global CSS import
   App.tsx                     Path selection, Dashboard state, fixtures
  dashboard.css               Reference dashboard layout and light/dark tokens
  AuthPage.tsx                Login/registration forms and feedback
   components/ui.tsx           Auth UI wrappers
   components/DashboardButton.tsx   Dashboard variants and async states
   components/DashboardSidebar.tsx  Configurable navigation groups
   components/StatCard.tsx          Statistic presentation and detail action
   components/DashboardChart.tsx    Configurable bar and semicircular charts
  lib/auth.ts                 Demo localStorage marker
  lib/theme.ts                Theme preference and root class
  lib/utils.ts                cn string concatenation
  index.css                   Tailwind entry and global/custom styles
vite.config.ts                React build plugin
postcss.config.js             Tailwind PostCSS plugin and autoprefixer
tailwind.config.js            Legacy-style config, currently not loaded by CSS
tsconfig.json                 Application checks; references node config
tsconfig.node.json            Composite Vite configuration project
eslint.config.js              JavaScript/TypeScript/React lint rules
```

`dist/` is build output. Root `vite.config.js`, `vite.config.d.ts`, and TypeScript build-info files already exist alongside the TypeScript configuration; the node TypeScript project permits emitted configuration artifacts. Treat `vite.config.ts` as the authoring source and inspect emitted artifacts/config resolution when changing the toolchain. Do not maintain divergent handwritten configurations.

The tutorial HTML and `graphify-out/` are supporting artifacts, not application entry points. The graph is a navigation aid; source is the authority for runtime behavior.

## Startup and rendering flow

```text
Static host serves index.html
  -> early script reads donezo-theme / OS preference and sets .dark
  -> src/main.tsx imports index.css
  -> createRoot(#root) renders StrictMode -> App
  -> App reads window.location.pathname and getUser()
     -> /login: AuthPage(login)
     -> /register: AuthPage(register)
     -> all other paths: Dashboard if marker exists, otherwise AuthPage(login)
```

Path checks are synchronous render-time selection, not a routing system. An unauthenticated `/` displays the login form without rewriting the URL. Unknown paths have the same fallback logic; there is no dedicated not-found page. Explicit auth paths display their form even when the demo marker exists.

Auth links, successful form submissions, and logout use full-document navigation. The static host must return `index.html` for direct `/login` and `/register` requests.

## State and data ownership

| State/data | Owner | Lifetime |
| --- | --- | --- |
| Projects, members, statistics, chart values | Constants in `App.tsx` | Static demo fixtures |
| Search query and filtered results | Dashboard state and `useMemo` | Until reload/unmount |
| Active nav label, mobile sidebar, modal visibility | Dashboard state | Until reload/unmount |
| Notices, import indicator, meeting state | Dashboard state | Until reload/unmount |
| Timer running flag and elapsed seconds | Dashboard state and interval | Until reload/unmount |
| Password visibility and form feedback | AuthPage state | Until reload/unmount |
| Demo user email | `auth.ts`, `donezo-user` | localStorage until logout/clear |
| Light/dark preference | `theme.ts`, `donezo-theme` | localStorage until clear/change |

Search derives results from the fixtures instead of duplicating lists in state. The running timer uses an interval with cleanup; notices use a timeout with cleanup. Future asynchronous operations should maintain the same cleanup discipline under StrictMode.

### Authentication demonstration

```text
Native form validation
  -> AuthPage.submit reads FormData email
  -> login(email) writes donezo-user
  -> success notice and delayed navigation to /
  -> App sees truthy marker and displays Dashboard

Logout -> remove donezo-user -> navigate to /login
```

Registration has additional name and terms fields, but creates no account. Passwords are required by the form and are not verified or persisted. Any truthy stored marker can unlock the demo screen. This boundary must be replaced with a server-validated identity/session model before handling protected business data.

### Theme flow

`index.html` initializes the root class before React mounts. `getTheme()` reads a valid stored choice or falls back to the initial OS preference. `applyTheme()` toggles `.dark` and persists the choice. CSS uses a class-based custom dark variant and sets `color-scheme` for native controls.

Keep both initialization paths aligned. There is no live subscription to OS theme changes. Runtime storage access is not guarded against browser storage exceptions, although the early HTML script has a try/catch.

## Styling and component boundaries

The dashboard uses scoped semantic light/dark variables and responsive layout rules in `src/dashboard.css`. Native sections, buttons, and dialogs avoid conflicting shared-wrapper background utilities. Authentication retains the Tailwind-based shared wrappers. `src/index.css` owns global focus styling and reduced-motion handling. Inter is named in the font stack, but no bundled font asset or font import supplies it. The reference image drives the forest-green palette, compact typography, unequal panel widths, capsule bars, and semicircular gauge; CSS texture links the timer and mobile promotion visually.

Dashboard presentation components live in `src/components/`; `Dashboard` retains navigation, dialog, meeting, import, search, timer, and theme behavior. The same sidebar configuration renders inside the desktop aside and mobile dialog. Chart data, labels, colors, and legend entries are props rather than index-specific styles. Gauge SVG pattern IDs are unique per mounted chart. See `SYSTEM.MD` for the customization contracts and examples.

Tailwind 4 is loaded through PostCSS and `@import "tailwindcss"`. The JavaScript `tailwind.config.js` has no matching `@config` directive, so its theme overrides/content settings are not activated by that stylesheet. New configuration should use CSS-first `@theme`, or deliberately load the legacy file. Autoprefixer is present even though Tailwind 4 handles vendor prefixing itself.

The shared wrappers are project-owned shadcn-style components. They are not generated shadcn primitives: no `components.json`, import alias, component directory, or primitive base is configured. The installed class utility libraries are not used by the current `cn()` helper, which only joins truthy strings and cannot merge conflicting utilities.

## Current interaction boundaries

- Navigation selects and scrolls to existing dashboard panels; it does not load distinct feature pages.
- Project/member forms close with feedback; they do not mutate the fixture arrays or persist records.
- Import reports simulated completion; no file parsing, upload, or API request occurs.
- Download feedback explicitly reports that the mobile app is a demo preview.
- Meeting, messages, notifications, help, settings, and password recovery use local state or feedback rather than integrations.
- Statistic detail controls display fixture-summary notices.
- Native modal dialogs provide Escape dismissal, focus containment, and focus restoration for forms and mobile navigation.

These are implementation limitations, not guarantees of future features.

## Recommended evolution, when requested

### 1. Formalize the component system

Follow the [official shadcn Vite setup](https://ui.shadcn.com/docs/installation/vite) for an existing project. Configure aliases in this project's actual `tsconfig.json` and `vite.config.ts`; do not assume a `tsconfig.app.json` exists. Review initialization output before adopting it, then add only needed components.

Use generated, source-owned components under `src/components/ui/`, keeping feature behavior outside primitives. Avoid an ambiguous coexistence with `src/components/ui.tsx`: migrate callers and define one public import surface deliberately. Choose a supported primitive base consistently. Prefer its Dialog implementation for accessible focus and dismissal behavior.

Adopt [semantic theme tokens](https://ui.shadcn.com/docs/theming), including foreground/background pairs for surfaces, buttons, and states. Define light/dark CSS variables and their Tailwind 4 `@theme inline` mappings. Preserve the existing visual direction and early theme initialization during migration.

### 2. Introduce feature boundaries as behavior grows

Extract dashboard sections from `App.tsx` when they acquire independent state or tests. Add feature modules for real project/team behavior and move demo fixtures to a clearly named fixture module. Add routing when distinct pages actually exist. Keep shared UI, business behavior, and data access separate without introducing unused layers.

### 3. Add durable data and real authentication together

Choose a backend and session strategy explicitly. Put persistence and access control on the trusted server boundary, validate inputs there, and expose typed client contracts. Replace optimistic demo feedback with actual results and loading/empty/error states. Record backend/session decisions with context and trade-offs once agreed; no such decision is currently recorded here.

### 4. Establish repeatable quality checks

Add a test runner when meaningful behavioral coverage is introduced. Cover route/session behavior, form mutations, theme persistence, and accessible dialogs. CI should run reproducible installation, type checking, linting, tests when configured, and the production build. Pin intentional version ranges and move build-only dependencies to `devDependencies` as a separate maintenance change.

## Reference basis

- [Tailwind PostCSS integration](https://tailwindcss.com/docs/installation/using-postcss)
- [Tailwind 4 configuration and browser requirements](https://tailwindcss.com/docs/upgrade-guide)
- [shadcn Vite installation](https://ui.shadcn.com/docs/installation/vite)
- [shadcn semantic theming](https://ui.shadcn.com/docs/theming)
- [Vite static deployment](https://vite.dev/guide/static-deploy)
- [Vite environment variables and modes](https://vite.dev/guide/env-and-mode)
