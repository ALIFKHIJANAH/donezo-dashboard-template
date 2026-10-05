# System Guide

## Purpose and status

Donezo Dashboard is a React/TypeScript dashboard template for demonstrating layout, authentication screens, light/dark themes, and local interactions. It runs as static frontend assets. It currently has no backend, database, real account registration, or production authentication.

Use [ARCHITECTURES.MD](./ARCHITECTURES.MD) for implementation structure and [AGENTS.md](./AGENTS.md) for contributor/agent instructions. This guide reflects source inspection on October 4, 2026.

## Local setup

### Prerequisites

- Node.js and npm. Prefer Node 22.13+ within the 22.x line; inspection used Node 22.23.1. Installed Vite requires `^20.19.0 || >=22.12.0`; installed ESLint requires `^20.19.0 || ^22.13.0 || >=24`. Verify these constraints after dependency upgrades.
- A modern browser. Tailwind 4 targets Safari 16.4+, Chrome 111+, and Firefox 128+ according to its migration guide.
- The project directory and existing `package-lock.json`.

From the project root:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. Vite may choose another port if it is occupied. No `.env` file, credentials, or database provisioning is needed for the current demo.

`npm ci` installs the locked dependency tree and replaces the existing `node_modules` installation. Use `npm install` intentionally when changing dependencies, then retain the corresponding lockfile update.

### Available commands

| Command | Actual behavior |
| --- | --- |
| `npm run dev` | Runs Vite's development server |
| `npm run typecheck` | Runs `tsc -b --pretty false` |
| `npm run lint` | Runs `eslint .` |
| `npm run build` | Runs `tsc -b && vite build`, writes `dist/` |
| `npx vite preview` | Locally serves an already-built `dist/`, normally on port 4173 |

There is no configured automated test runner or `npm test` script. There is no `npm run preview` script. ESLint disables unused-variable checking, so a passing lint result is not proof that imports/state are used. No formatter or CI pipeline is configured.

## Pages and navigation

| Requested path | Result |
| --- | --- |
| `/login` | Login form, regardless of stored demo marker |
| `/register` | Registration form, regardless of stored demo marker |
| `/` | Dashboard with a marker; login form without one |
| Any other path | Same marker-dependent fallback as `/`; no not-found screen |

Routes are selected using `window.location.pathname`. Links between authentication screens and login/logout transitions reload the document. Dashboard sidebar entries select and scroll to their corresponding dashboard panels rather than navigating to separate pages.

## Runtime capabilities

| Capability | What works now | Boundary |
| --- | --- | --- |
| Login/registration | Native form validation, password visibility, notice, demo sign-in | No password verification, account creation, or server request |
| Logout | Clears user marker and navigates to login | Local browser demo only |
| Theme | Root `.dark` toggle with persisted choice | No live OS-theme subscription |
| Search | Case-insensitive project/member filtering, empty results, and Cmd/Ctrl+F focus shortcut | Fixture data; available at every viewport size |
| Mobile sidebar | Native modal navigation with Escape dismissal and focus management | Entries scroll to dashboard panels, not separate pages |
| Timer | Local running/paused state | State resets after reload; no saved time entries |
| Project/member dialogs | Native modal dialogs, required-field validation, Escape dismissal, focus containment/restoration, demo feedback | No list mutation or persistence |
| Import | Temporary busy indicator and completion notice | Simulation, no parsing/upload |
| Meeting | Changes local meeting state | No conferencing integration |
| Download/messages/notifications/help/settings | Demo feedback notices and theme guidance | No corresponding integration; download explicitly reports its preview status |
| Password recovery | Feedback notice | No reset email or recovery flow |
| Statistics/charts | Predefined values, detail notices, capsule activity bars, semicircular progress gauge | Demo data, not real analytics |

Team avatars use external `pravatar` URLs. Their availability depends on network access and the third-party service; the rest of the demo data is local.

## Storage and reset

| Key | Value | Purpose |
| --- | --- | --- |
| `donezo-user` | Submitted email string | Truthy marker used to display the dashboard |
| `donezo-theme` | `light` or `dark` | Theme preference |

Storage is scoped to the browser origin. Ports and domains have different storage. Logout removes only `donezo-user`; it preserves the theme preference. Clearing these two keys in browser developer tools resets the demo without deleting unrelated origin data.

Projects, members, notices, modal data, navigation selection, meeting state, and timer progress are not persisted. A reload reconstructs them from source fixtures/defaults.

The initial HTML theme script catches storage exceptions. Runtime authentication/theme helpers access localStorage directly and may fail when storage is blocked.

## Styling operations

- Global styling and the Tailwind 4 import live in `src/index.css`.
- Dashboard layout and paired light/dark color variables live in `src/dashboard.css`, imported by `App.tsx`. The workspace fills the available width and at least the viewport height, with normal scrolling when content is taller. Desktop uses wider analytics/team panels and a stacked project/timer column; smaller screens reflow the panels and expose modal navigation. The progress label scales with its gauge width, and active navigation icons use the theme's green with filled dashboard tiles and heavier strokes.
- Dark mode is class-based through `@custom-variant dark`; keep the HTML bootstrap and theme helper aligned.
- The existing `tailwind.config.js` is not automatically consumed by Tailwind 4. Its overrides require an explicit `@config` reference or a deliberate CSS-first migration.
- Shared UI is currently `src/components/ui.tsx`. Full shadcn installation requires explicit configuration; adding shadcn packages alone does not migrate the wrappers.
- Dashboard-specific reusable components are `DashboardSidebar`, `StatCard`, `DashboardButton`, and `DashboardChart` under `src/components/`. They use `src/dashboard.css` and inherit its variables inside `.donezo-workspace`.
- `cn()` concatenates classes without merging conflicts. Do not assume later class arguments always override existing Tailwind utilities.
- Inter is a font-stack preference, not a downloaded asset. System fallback fonts are used if Inter is unavailable.

For full shadcn adoption, configure TypeScript/Vite aliases, review `npx shadcn@latest init` output, then add needed components with `npx shadcn@latest add <component>`. These are migration steps, not prerequisites for running the existing project. Review CSS and token changes to preserve both themes.

### Dashboard component customization

- **DashboardSidebar:** supply `groups` with stable group/item IDs, labels, Lucide icons, optional counts/disabled flags, and `onSelect` callbacks. Set `activeId` from parent state. `brand` and `footer` accept React content; `contentOnly` reuses the content inside an existing mobile dialog. Parent code owns routing and dialog behavior.
- **StatCard:** accepts `title`, any renderable `value` and `caption`, `featured`, optional `trend` and `trendDirection`, and optional `onDetails`/`detailsLabel`. Omit `onDetails` to hide the detail control. Native section attributes and `className` are forwarded.
- **DashboardButton:** variants are `primary`, `secondary`, `outline`, `ghost`, and `icon`; sizes are `default` and `small`. Native hover/focus/pressed/disabled styles are automatic. Set `state` to `default`, `loading`, `success`, or `error`; use `stateLabels` to customize displayed text. Loading disables activation and sets `aria-busy`; success/error remain actionable for end/retry flows. Supply `icon` for a leading icon and an accessible `aria-label` for icon-only buttons. Native button attributes are forwarded, and the default type is `button` (use `type="submit"` for forms). The caller owns state transitions.
- **DashboardChart:** the `type` discriminator selects `bar` or `gauge`. `data` entries contain stable `id`, `label`, numeric `value`, optional CSS `color`, `pattern` (`solid` or `striped`), and optional bar `tooltip` content. `ariaLabel` is required; data values are included in the accessible description. `legend` supplies custom entries with IDs/labels/colors/patterns; `legend={[]}` hides it. Gauges default to a legend from their data; bars default to none. `showLabels` hides axis/center labels, while `formatValue` formats accessible values and the gauge center. `max` defaults to the largest bar value or 100 for a gauge. Bar `height` overrides responsive CSS. Gauges also accept a center `value`, `label`, and `strokeWidth`; data values are sequential segment amounts, clipped to `max`. Negative/nonfinite values are treated as zero for geometry. `className`/`style` customize the wrapper and inherited theme variables. Empty data and `state="loading"`/`state="error"` render accessible messages customizable with `emptyLabel`, `loadingLabel`, and `errorLabel`.

```tsx
<DashboardButton variant="outline" state={saving ? 'loading' : 'default'}
  stateLabels={{ loading: 'Saving...' }} onClick={save}>Save</DashboardButton>

<DashboardChart type="bar" ariaLabel="Project counts" max={20} height={200}
  formatValue={value => `${value} projects`}
  data={[{ id: 'week-1', label: 'Week 1', value: 12, color: 'var(--chart-green)', tooltip: '12 projects' }]}
  legend={[{ id: 'projects', label: 'Projects', color: 'var(--chart-green)' }]} />

<DashboardChart type="gauge" ariaLabel="Completion" value={60} label="Completed"
  data={[
    { id: 'done', label: 'Done', value: 60, color: 'var(--gauge-completed)' },
    { id: 'pending', label: 'Pending', value: 40, pattern: 'striped' },
  ]} />
```

## Environment configuration

No environment variables are used or required today. If a backend integration is added:

1. Document public settings in an `.env.example` and type their `import.meta.env` usage.
2. Add local environment files such as `.env.local` and `.env.*.local` to `.gitignore` before storing machine-specific configuration. The present ignore file does not include them.
3. Use `VITE_*` only for public client configuration. Values are exposed in the bundle, are generally strings, and are replaced at build time.
4. Keep private keys and credentials on the server. Restart Vite after changing environment files and rebuild for deployment configuration changes.

Vite defaults to development mode for the dev server and production mode for builds. Deployment-time changes to an environment variable do not rewrite an existing static bundle.

## Build and deployment

```sh
npm run typecheck
npm run lint
npm run build
npx vite preview
```

Deploy the generated `dist/` directory to a static host. `vite preview` is a local smoke-test server, not a production hosting service.

Hosting requirements:

- Serve the HTML and built assets over HTTPS.
- Configure history fallback so `/login`, `/register`, and other application requests return `index.html`, while asset requests resolve to their real files.
- Verify direct deep links and reloads, not only navigation from `/`.
- The present application assumes deployment at the origin root. A subdirectory deployment needs Vite `base` configuration **and** changes to absolute `/login`, `/register`, and `/` navigation targets.
- If applying a Content Security Policy, account for the inline early theme script and external avatar images. Do not disable protections broadly to accommodate them.
- Retain a previous build for rollback and verify the newly deployed assets before retiring it.

Static hosting cannot make this demo authentication secure. Before deploying protected business functionality, implement server-validated sessions, authorization on every protected data operation, input validation, and real persistence.

## Verification checklist

For application changes, record actual results:

- [ ] Type checking, linting, and production build pass.
- [ ] Direct `/`, `/login`, and `/register` loads work on the target host.
- [ ] Empty/invalid auth forms show native validation; valid demo submission navigates to the dashboard; logout clears the marker.
- [ ] Theme choice persists after reload without a flash of the opposite theme.
- [ ] Search handles matches and no matches; mobile sidebar opens and closes.
- [ ] Timer controls and dialog close/cancel/submit interactions match intended behavior.
- [ ] Both themes and narrow/desktop layouts are checked, including keyboard navigation and console errors.
- [ ] Newly implemented async features have loading, empty, error, and retry behavior where relevant.

Existing demo limitations, including simulated submissions and imports, must not be reported as completed integrations. This checklist is for future verification, not a claim that browser checks have already been performed.

## Troubleshooting

| Symptom | Check/action |
| --- | --- |
| Install/build engine error | Compare Node version with installed Vite/ESLint engines; use a compatible supported Node release |
| `npm ci` reports manifest/lock mismatch | Investigate the intended dependency change and update both files deliberately; do not discard the lockfile |
| Direct `/login` or `/register` returns 404 | Add the host's `index.html` fallback and verify built asset URLs |
| Login accepts arbitrary valid email/password | Expected demo behavior; there is no credential verification |
| Login disappears on another port/domain | localStorage is origin-scoped; authenticate separately on that origin |
| Stored theme or sign-in crashes in restricted browser mode | Inspect storage access errors; runtime helpers currently lack exception handling |
| Tailwind config changes have no effect | Check the missing `@config` directive; prefer CSS-first Tailwind 4 theme configuration |
| `@/` import fails | No alias exists; use relative imports or configure both TypeScript and Vite |
| Missing avatar image | Inspect external image requests, network access, and host CSP |
| Added project/member vanishes or never appears | Current forms only show feedback; fixture lists are not mutated/persisted |
| Build creates root config/build-info files | `tsc -b` includes the composite node configuration project, which can emit artifacts |

## Official documentation

- [Tailwind CSS with PostCSS](https://tailwindcss.com/docs/installation/using-postcss)
- [Tailwind 4 upgrade/configuration guide](https://tailwindcss.com/docs/upgrade-guide)
- [shadcn installation for Vite](https://ui.shadcn.com/docs/installation/vite)
- [shadcn theming](https://ui.shadcn.com/docs/theming)
- [Vite static deployment](https://vite.dev/guide/static-deploy)
- [Vite environment variables and modes](https://vite.dev/guide/env-and-mode)
