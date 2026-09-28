# Lily Design System Themes — Specification

Single source of truth for the `@lilydesignsystem/themes` npm package.
This subproject has no source code of its own: it packages the
canonical [`themes/`](../../themes/) directory at the monorepo root for
npm consumption. Anything not in this spec is out of scope.

## 1. Goal

Let a consumer install Lily's 45 reference theme stylesheets with
`npm install @lilydesignsystem/themes` instead of cloning the monorepo
or hand-copying files, matching how the headless and helper packages
are already npm-installable.

## 2. Non-goals

- **Authoring themes.** This package never edits a theme; `themes/` at
  the monorepo root is the single canonical source (`AGENTS/theme.md`).
  A theme change always lands there first.
- **A build step for consumers.** No bundler, no CSS preprocessor, no
  JavaScript. Plain `.css` files, referenced by URL, `<link>`, or a
  bundler's native CSS import.
- **Runtime theme switching.** That is `theme-picker`'s job
  (`AGENTS/helpers.md`); this package only ships the stylesheets
  `theme-picker` swaps between.

## 3. Architectural decisions

- **Packaging, not authoring.** `build.js` copies `../themes/*.css`
  into `dist/` unmodified — the npm-publish equivalent of `bin/sync`'s
  rsync into each example app's static assets. It never edits a byte.
- **Flat, slug-named files.** `dist/{slug}.css`, one per theme, matching
  the `data-theme="{slug}"` value `theme-picker` sets and the filename
  every other consumer (example apps, `theme-picker` packages) already
  expects.
- **No `main`/`exports "."`.** There is no single default stylesheet to
  import blindly; a consumer always picks a named theme via the `./*.css`
  export pattern (`@lilydesignsystem/themes/light.css`).
- **First release is 0.1.0** — `docs/releasing.md`'s numbering rule.

## 4. Contract

- `dist/` contains exactly the `.css` files present in the canonical
  `themes/` directory at build time — same count, same names, byte-
  identical content (verified by the sync check in §6).
- Every published version's `dist/*.css` passes the same `bin/check-theme`
  conformance rules the canonical files already pass (zero-specificity
  cascade, real class hooks, the shared token contract) — because it is
  the exact same content, not a re-implementation.

## 5. Required files

Same bar as every Lily subproject (`AGENTS/lily.md` § "For each
subproject"): `index.md`, `README.md` (symlink), `AGENTS.md`,
`spec/index.md`, plus the special files `bin/sync-special-files`
propagates and `.git-subtree-push`.

## 6. Acceptance criteria

- [x] `package.json` declares `@lilydesignsystem/themes`, version
      `0.1.0`, the shared SPDX license expression, and a `./*.css`
      subpath export.
- [x] `build.js` copies every `.css` file from the canonical root
      `themes/` into `dist/`, erroring if none are found.
- [x] `dist/` file count matches the canonical `themes/` directory's
      `.css` count (45 at time of writing).
- [x] No file in `dist/` differs from its canonical counterpart
      (`diff` clean, file by file).
- [x] Packed tarball (`npm pack`) installs into a scratch project and
      the CSS resolves via a subpath import, mirroring
      `bin/smoke-packages`'s existing consumer-smoke pattern for the
      headless libraries.

## 7. Related topics

- [spec/theme/](../../spec/theme/index.md) — the token shape, cascade
  rules, and reference-theme contract this package packages.
- [spec/helpers/index.md](../../spec/helpers/index.md) — `theme-picker`,
  the runtime consumer of these stylesheets.

## 8. Sources

- [`themes/`](../../themes/) — the canonical stylesheets.
- [`AGENTS/theme.md`](../../AGENTS/theme.md) — the binding design rules.
- [`bin/check-theme`](../../bin/check-theme) — the conformance checks
  the canonical files already pass.

---

Lily™ and Lily Design System™ are trademarks.
