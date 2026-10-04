# Agent Guide

## Project facts

Donezo Dashboard is a client-rendered React/TypeScript dashboard template built with Vite and Tailwind CSS 4. The current UI uses custom shadcn-style wrappers, not an initialized shadcn component library. Authentication, data, and several actions are demonstrations.

Read [ARCHITECTURES.MD](./ARCHITECTURES.MD) for module boundaries and [SYSTEM.MD](./SYSTEM.MD) for setup, behavior, deployment, and known limitations. Source and configuration take precedence when documentation drifts.

## Commands

Use npm and the existing `package-lock.json`. Prefer Node.js 22.13+ within the 22.x line; the inspected environment uses 22.23.1. Check dependency engine requirements before changing Node versions.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npx vite preview
```

`preview` serves an existing build locally. There is no test runner, `test` script, or `preview` script configured. Do not claim tests passed when only lint or type checking ran.

## Where to work

| Concern | Source |
| --- | --- |
| Startup and early theme initialization | `index.html`, `src/main.tsx` |
| Path selection, dashboard, fixtures, local interactions | `src/App.tsx` |
| Login and registration demonstration | `src/AuthPage.tsx` |
| Shared Button, Card, Input | `src/components/ui.tsx` |
| Browser storage helpers | `src/lib/auth.ts`, `src/lib/theme.ts` |
| Class string helper | `src/lib/utils.ts` |
| Tailwind entry, dark variant, global styles | `src/index.css` |
| Build, CSS, lint, TypeScript configuration | `vite.config.ts`, `postcss.config.js`, `eslint.config.js`, `tsconfig*.json` |

## Implementation rules

- Make focused changes using existing TypeScript, React function components, and native platform features. Extract components or feature modules when a concrete responsibility warrants it; do not create an unused framework of services or providers.
- Preserve strict TypeScript checking. Give component props and external data explicit types; validate untrusted data at its boundary. Do not suppress checks to conceal errors.
- Follow existing relative imports. No `@/` alias is configured. If an alias is introduced, configure both TypeScript and Vite together.
- Keep render functions pure. Clean up effects, intervals, listeners, and asynchronous work on unmount. `StrictMode` is enabled, so effects must tolerate setup/cleanup cycles.
- Keep durable data separate from transient UI state. Fixtures in `App.tsx` are demo data; do not present them as live metrics or silently turn them into a production data model.
- `donezo-user` in localStorage is a demo email marker, not a session credential. Production authentication requires server-side session validation and authorization; client path checks cannot protect data.
- Never put secrets in frontend code, localStorage, or `VITE_*` variables. No environment variables are currently required.
- Specify `type="button"` for non-submit buttons inside forms. Use labels, accessible names for icon controls, visible focus, and native validation where appropriate. Real dialogs need Escape handling, focus trapping, and focus restoration.
- Verify changed interfaces in light and dark themes, keyboard-only use, and narrow/desktop layouts. Preserve reduced-motion behavior and prevent horizontal overflow.
- Avoid new dependencies without a concrete need. Update `package.json` and `package-lock.json` together when dependencies change. Most manifest versions are currently `latest`; do not regenerate the lockfile for an unrelated task.

## Tailwind and shadcn rules

- This is Tailwind 4: retain `@import "tailwindcss"` and the current `@tailwindcss/postcss` integration unless migration is explicitly in scope. Do not paste Tailwind 3 setup instructions.
- `tailwind.config.js` is not automatically loaded by Tailwind 4, and the stylesheet has no `@config` directive. Use CSS-first `@theme` for new theme configuration, or explicitly load the legacy config as an intentional compatibility change.
- Dark mode uses the root `.dark` class and a custom variant in `src/index.css`. Keep the early initialization in `index.html` consistent with `src/lib/theme.ts` to prevent a theme flash.
- `cn()` currently joins truthy strings only. It does not resolve Tailwind conflicts. Installed `clsx`, `tailwind-merge`, and `class-variance-authority` are not evidence that they are wired into the UI.
- Treat `src/components/ui.tsx` as project-owned code. There is no `components.json` or generated `src/components/ui/` directory. Full shadcn adoption must be an explicit task using the official Vite instructions, with reviewed imports, dependencies, tokens, and existing styles.
- When semantic tokens are introduced, define paired foreground/background values in both themes. Prefer accessible primitives for dialogs and menus rather than extending incomplete ad hoc implementations.

## Knowledge graph and documentation

- Before architecture/codebase questions, read `graphify-out/GRAPH_REPORT.md`. If `graphify-out/wiki/index.md` exists, navigate it first. Verify graph claims against source; inferred edges are not implementation guarantees.
- For cross-module relationships, prefer `graphify query`, `graphify path`, or `graphify explain` when available.
- After code changes, run `graphify update .` as required by the parent project instructions. If unavailable, report the blocker. Documentation-only changes do not require a code graph refresh.
- Update the relevant documents when behavior, commands, storage keys, or module boundaries change. Record expensive-to-reverse decisions with context, alternatives, and consequences; never invent historical rationale.

## Definition of done

1. Requested behavior is implemented and the changed paths are inspected for regressions.
2. `npm run typecheck`, `npm run lint`, and `npm run build` pass for code/config changes. For documentation-only work, verify paths, scripts, and claims against source.
3. Browser changes are exercised at runtime, including affected interactions, validation, loading/empty/error states, and console errors. Add focused regression tests when meaningful; establish a runner explicitly if automated tests are needed.
4. Related documentation and the code graph are updated where applicable.
5. Report changed files, actual checks run, and any remaining blockers. Do not describe simulated actions as completed integrations.

## Official references

- [Tailwind 4 with PostCSS](https://tailwindcss.com/docs/installation/using-postcss)
- [Tailwind 4 migration and configuration](https://tailwindcss.com/docs/upgrade-guide)
- [shadcn with Vite](https://ui.shadcn.com/docs/installation/vite)
- [shadcn theming](https://ui.shadcn.com/docs/theming)
- [Vite deployment](https://vite.dev/guide/static-deploy) and [environment variables](https://vite.dev/guide/env-and-mode)
