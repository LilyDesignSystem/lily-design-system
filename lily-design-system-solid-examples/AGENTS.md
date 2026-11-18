# AGENTS — Lily Design System™ Solid examples

Read [spec/index.md](spec/index.md) first, then the modular rules in [AGENTS/](AGENTS/) (copied from the repository root
by `bin/sync`; edit the root, never the copy).

- A Solid 2.0 single-page app: `src/router.ts` (Solid Router 2.0 `createRouter`), `src/App.tsx` (the root layout),
  `src/pages/` (one component per route). Links are plain `<a href>` elements; the router intercepts them.
- The three required routes from [AGENTS/examples.md](AGENTS/examples.md): `/`, `/components`, `/components/{slug}`.
- `src/data/` is generated (`bin/generate-registries`, `bin/generate-examples`); `public/themes/` is copied
  (`bin/sync`). Edit the sources, then regenerate.
- The demos are the catalog's HTML strings, rendered with `innerHTML`, the same as every example app.
- Styling: `assets/css/app-shell.css` for the app's own chrome; components are styled by the runtime theme stylesheet.
- Verify: `pnpm exec tsc --noEmit`, `pnpm build`, `pnpm test:e2e`, and `bin/test` from the repository root.

---

Lily™ and Lily Design System™ are trademarks.
