# AGENTS — Lily Design System Themes

Single source of truth: [spec/index.md](./spec/index.md). Read it first;
everything below is a fast index.

## What this package is

An npm package, `@lilydesignsystem/themes`, that packages the canonical
[`themes/`](../themes/) directory (45 reference theme stylesheets) at
the monorepo root for `npm install` consumption. No source code of its
own — `build.js` copies `../themes/*.css` into `dist/` unmodified.

## Files

| File | Purpose |
| ---- | ------- |
| `spec/index.md` | Specification-driven contract (canonical). |
| `build.js` | Copies `../themes/*.css` into `dist/`. Run via `npm run build` / `prepublishOnly`. |
| `package.json` | `@lilydesignsystem/themes`, `./*.css` subpath exports. |
| `index.md` | User guide: install, usage, the 45 theme slugs. |

## Public surface

No JavaScript export. Each theme is a CSS file at
`@lilydesignsystem/themes/{slug}.css`, where `{slug}` matches the
`data-theme="{slug}"` value `theme-picker` sets. The canonical slug
list lives in `themes/` at the monorepo root — do not hardcode a count
here; read the directory.

## Editing rule

**Never edit a `.css` file inside this package.** Themes are authored
once, at the monorepo root `themes/{slug}.css`; this package only
copies them at build time (`build.js`). A change made here is silently
overwritten on the next `npm run build` and never reaches the canonical
source other consumers (the 7 example apps, via `bin/sync`) rely on.

## Conventions this package follows

- No bundled CSS of its own beyond the packaged theme files — there is
  no additional layer, wrapper, or override added here.
- `AGENTS/theme.md` is the binding design-principle reference for what
  a theme stylesheet may and may not contain.
- `bin/check-theme` verifies the canonical source this package packages;
  this package adds no separate conformance check, since its `dist/`
  content is byte-identical to what already passed.
- Publishing follows `docs/releasing.md`: dry-run, consumer-smoke
  (`npm pack` + install into a scratch project), then real publish.
