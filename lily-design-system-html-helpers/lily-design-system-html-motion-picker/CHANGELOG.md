# Changelog — MotionPicker (HTML)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

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
[CHANGELOG.md](../../CHANGELOG.md), not duplicated here. The old
unscoped name is deprecated on the registry (never unpublished),
pointing consumers here.

---

Lily™ and Lily Design System™ are trademarks.
