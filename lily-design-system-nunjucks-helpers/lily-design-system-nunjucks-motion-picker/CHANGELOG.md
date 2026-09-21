# Changelog — MotionPicker (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.1 — 2026-09-21

**Internal refactor: keyboard/typeahead logic now comes from the new
`@lilydesignsystem/nunjucks-listbox-behavior` shared module instead of
being hand-rolled here.** No change to the public API, rendered
markup, or keyboard contract — the existing test suite passes
unchanged. Porting the same headless-composition refactor already
done for the other seven catalogs; the real duplication problem in
this one was six `*.client.js` files each hand-rolling the same
~150-line APG listbox implementation with no shared module to point
them at.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-nunjucks-motion-picker` → `@lilydesignsystem/nunjucks-motion-picker`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-nunjucks-motion-picker`'s last published version (`0.1.0`).
This is this package's first dedicated `CHANGELOG.md`; its prior
history (as `lily-design-system-nunjucks-motion-picker`) is recorded in the root
[CHANGELOG.md](../../CHANGELOG.md), not duplicated here. The old
unscoped name is deprecated on the registry (never unpublished),
pointing consumers here.

---

Lily™ and Lily Design System™ are trademarks.
