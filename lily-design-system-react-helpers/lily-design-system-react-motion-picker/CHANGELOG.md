# Changelog — MotionPicker (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## Unreleased

**Internal refactor: now depends on `@lilydesignsystem/react-headless`'s
`IconButton` and `Listbox` (new `navigation="active-descendant"` mode)
instead of hand-rolling their equivalents.** No change to the public
API, rendered markup (class names, ids, ARIA attributes), or keyboard
contract — the full existing test suite (43 tests) passes unchanged, run against
the refactored component with no test edits. See
`@lilydesignsystem/react-theme-picker`'s changelog (the pilot for this
catalog's migration) and the headless catalog's own CHANGELOG for the
full extension `Listbox`/`IconButton` gained to make it possible.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-react-motion-picker` → `@lilydesignsystem/react-motion-picker`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-react-motion-picker`'s last published version (`0.1.0`).
This is this package's first dedicated `CHANGELOG.md`; its prior
history (as `lily-design-system-react-motion-picker`) is recorded in the root
[CHANGELOG.md](../../CHANGELOG.md), not duplicated here. The old
unscoped name is deprecated on the registry (never unpublished),
pointing consumers here.

---

Lily™ and Lily Design System™ are trademarks.
