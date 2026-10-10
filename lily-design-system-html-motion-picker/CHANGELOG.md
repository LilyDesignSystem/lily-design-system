# Changelog — MotionPicker (HTML)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-10-04

**Added: picker tooltip (minor, additive).** The button now has a purely visual `<div class="motion-picker-tooltip" role="tooltip" hidden>` sibling holding its `label` text, shown on pointer hover (hoverable, WCAG 1.4.13) or keyboard focus, dismissible with `Escape`, never shown while the listbox is open, and deliberately not linked with `aria-describedby`. New `.motion-picker-tooltip` class hook; no new attributes or text. Spec clauses 19-24.

**Fixed: tooltip `Escape` now works wherever focus is (WCAG 1.4.13).** The `Escape` handler was on the button only, so a tooltip shown by pointer hover alone could not be dismissed. While visible, the tooltip now listens for `Escape` on the document (no `preventDefault`, no focus move); the listener is added only while visible and removed on hide, re-render and disconnect. Spec clause 25.

## 0.1.2 — 2026-10-01

**Dependency: `@lilydesignsystem/html-headless` widened to `^0.3.0`.**
This package imports `@lilydesignsystem/html-headless/components/listbox-controller.js`,
which no html-headless release before 0.3.0 actually delivered (0.1.x
lacks the module; 0.2.0 omitted it from the tarball and blocked it in
`exports`), so every earlier version of this package failed to import
from a real npm install with `ERR_PACKAGE_PATH_NOT_EXPORTED`. No source
change.

## 0.1.1 — 2026-09-21

**Internal refactor: now depends on `@lilydesignsystem/html-headless`'s
new `ListboxController` (`components/listbox-controller.js`) instead of
hand-rolling its own keyboard logic.** No change to the public API,
rendered markup, or keyboard contract — the full existing test suite
passes unchanged. See `@lilydesignsystem/html-headless`'s own
CHANGELOG for the module this depends on and why it had to be built
from scratch rather than extended (this catalog's headless `listbox`
was a markup-only stub with no working behaviour).

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-html-motion-picker` → `@lilydesignsystem/html-motion-picker`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-html-motion-picker`'s last published version (`0.1.0`).
This is this package's first dedicated `CHANGELOG.md`; its prior
history (as `lily-design-system-html-motion-picker`) is recorded in the root
[CHANGELOG.md](../CHANGELOG.md), not duplicated here. The old
unscoped name is deprecated on the registry (never unpublished),
pointing consumers here.

---

Lily™ and Lily Design System™ are trademarks.
