# Changelog — @lilydesignsystem/html-headless

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the package follows [Semantic Versioning](https://semver.org/).
The canonical monorepo history is in the root
[CHANGELOG.md](https://github.com/LilyDesignSystem/lily-design-system/blob/main/CHANGELOG.md).

## Unreleased

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
