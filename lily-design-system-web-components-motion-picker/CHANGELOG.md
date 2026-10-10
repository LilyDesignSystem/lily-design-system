# Changelog — `<lily-motion-picker>` (Web Components helper)

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-10-04

**Tooltip (additive, minor).** New `.motion-picker-tooltip` element
(`role="tooltip"`, a sibling right after the icon button, `hidden` at rest,
holding the button's `label`) and class hook, shown on pointer hover
(hoverable), on keyboard focus (`:focus-visible`), dismissed by `Escape`,
never shown while the listbox is open. Not linked by `aria-describedby`
(it duplicates `aria-label`). 8 new tests, spec §7.19–§7.24.

**Tooltip Escape works wherever focus is.** While the tooltip is visible a `document` `keydown` listener dismisses it on `Escape` (hover-only tooltips now dismiss, WCAG 1.4.13); removed on hide/disconnect. 2 new tests, spec clause 25.

## 0.1.1 — 2026-09-21

**Internal refactor: the trigger button now composes
`@lilydesignsystem/web-components-headless`'s `<lily-icon-button>`
instead of hand-rolling a `<button>`.** No change to the public API,
rendered markup, or keyboard contract — the full existing test suite
passes unchanged. The listbox stays self-built: this catalog's
`Listbox` custom element is a native-tag-fixed `<lily-listbox>` (no
customized built-ins, by this catalog's own prior architecture
decision — WebKit never implemented them), so it cannot stand in for
the documented `<ul>` the way Svelte's could via `<svelte:element
as="ul">`; composing it would silently change the picker's markup tag,
not just add a class token.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-web-components-motion-picker` → `@lilydesignsystem/web-components-motion-picker`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-web-components-motion-picker`'s last published version (`0.1.0`);
its full changelog continues below, now read as history prior to the
rescope. The old unscoped name is deprecated on the registry (never
unpublished), pointing consumers here.

---

## 0.1.0 — 2026-09-03

First release under this name. This package is a maintainer-directed
independent copy of the HTML helper of the same picker
(`@lilydesignsystem/html-motion-picker`), differing only in the tag it
registers (`<lily-motion-picker>` rather than `<motion-picker>`) and its package name.
Any entries below are that package's history, inherited so the
reasoning behind the code is not lost; none of them was released under
this name, and a first release is numbered 0.1.0 whatever the tree
carried (see `docs/releasing.md`).
