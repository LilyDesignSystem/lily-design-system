# Changelog — @lilydesignsystem/html-headless

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).
The canonical monorepo history is in the root
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).

## 0.4.0 — 2026-10-05

**16 new components (catalog 539 → 555) and a breaking chart change.**
New: `one-time-password-input`, `multi-select`, `multi-select-with-extras`,
`empty-state`, `show-more`, `kbd-shortcut`, `calendar-year-table`,
`calendar-month-table`, `calendar-week-table`, `calendar-day-table`,
`thinking`, `gauge-chart`, `heatmap-chart`, `radar-chart`, `sankey-chart`,
`file-tree`.

**Breaking:** `area-chart`, `bar-chart`, `column-chart`, `line-chart` and
`scatter-chart` (and the four new charts) now render `<figure
class="{chart}">` holding a `<div class="{chart}-graphic" role="img"
aria-label>` plus an optional sibling `<div class="{chart}-data-table">`.
`role="img"` is no longer on the `<figure>`: a table inside a `role="img"`
element is presentational and was unreachable to assistive technology.
Consumer CSS or tests that targeted `figure[role=img]` must target
`.{chart}-graphic`. `aria-describedby` passed as a rest prop still lands on
the `<figure>`. See the monorepo CHANGELOG for the full record.

## 0.3.0 — 2026-10-01

**Fix: `ListboxController` is importable at last.** 0.2.0 shipped it
broken two ways (fixed in-tree 2026-09-25, `61931772d`, released here):
the `exports` map used the legacy trailing-slash folder mapping
(`"./components/": "./components/"`), which Node's strict ESM resolver
rejects with `ERR_PACKAGE_PATH_NOT_EXPORTED`, so the wildcard
`"./components/*"` replaces it; and `files` listed only
`components/*.html`, so `components/listbox-controller.js` was never in
the tarball at all. Every `@lilydesignsystem/html-*-picker` and
`html-kanban-board` imports it, so every one of them was unusable from a
real npm install.

**New: 48 national personal identifier components** (24 types ×
`-input` + `-view`, P8-T13 and P8-T15), matching the other catalogs.
Additive, hence the minor bump rather than a patch.

## 0.2.0 — 2026-09-21

**New: `ListboxController` (`components/listbox-controller.js` +
`.js.d.ts`), a real, reusable WAI-ARIA APG listbox keyboard-behaviour
module.** This catalog's own `listbox.html`/`icon-button.html` are
markup-only fragments with no working behaviour to extend (confirmed:
`listbox.html`'s behaviour script was a literal empty stub) — unlike
every other framework catalog's `Listbox`/`IconButton` components, so
there was nothing to port the other catalogs' additive-extension
pattern onto. Instead, this module extracts the ~150-line APG listbox
keyboard implementation that `lily-design-system-html-helpers`' six
`*-picker` custom elements each hand-rolled a near-identical copy of
(clamp/wrap arrow movement, Home/End, typeahead, PageUp/PageDown,
Enter/Escape/Tab-out callbacks, `aria-activedescendant` mirroring) into
one place. `theme-picker`, `locale-picker`, `text-size-picker`, and
`motion-picker` now depend on it as a real npm dependency; `share-picker`
(a disclosure of real links, not a listbox) and `date-time-picker`
(dialog/calendar grid) had no such duplication to extract and are
unaffected. Zero-consumer check: confirmed nothing else in this catalog
referenced `listbox.html`/`icon-button.html` as real components before
this change. Real-browser (wdio) test coverage was written
(`components/listbox-controller.test.js` + `.fixture.html`) but could
not be executed in the authoring sandbox (chromedriver download blocked
— confirmed pre-existing by reproducing the identical failure against
an untouched existing wdio spec); the four migrated pickers' own
existing vitest suites (368 tests, jsdom-based, no real browser needed)
all pass unchanged against the new module and are the primary
verification for this change.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-html-headless` → `@lilydesignsystem/html-headless`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-html-headless`'s last published version (`0.1.0`);
its full changelog continues below, now read as history prior to the
rescope. The old unscoped name is deprecated on the registry (never
unpublished), pointing consumers here.

---

## 0.1.0 — 2026-08-26

First published release: the annotated semantic-HTML snippet library,
covering all 491 catalog components with per-component tests.

Numbered 0.1.0 deliberately. In-tree version numbers existed before
this release, but nothing was ever published under this name, and a
first release numbered higher would imply registry history that never
existed — the same reasoning the helper packages recorded at their
July 2026 reset. Sibling packages (svelte, react, vue) are on their
own version lines.
