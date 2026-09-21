# Changelog — MotionPicker (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.1 — 2026-09-21

**Internal refactor: now depends on `@lilydesignsystem/angular-headless`'s
`IconButton` and `Listbox` (new `navigation="active-descendant"` mode)
instead of hand-rolling their equivalents.** No change to the public
API, rendered markup, or keyboard contract — the full existing test
suite passes unchanged. See `@lilydesignsystem/angular-theme-picker`'s
changelog (the reference migration) and the headless catalog's own
changelog for the full extension this depends on, including the
`resolve.dedupe` fix this catalog's `vitest.config.ts` needed for a
real cross-catalog `@angular/core` DI issue.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-angular-motion-picker` → `@lilydesignsystem/angular-motion-picker`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-angular-motion-picker`'s last published version (`0.1.0`).
This is this package's first dedicated `CHANGELOG.md`; its prior
history (as `lily-design-system-angular-motion-picker`) is recorded in the root
[CHANGELOG.md](../../CHANGELOG.md), not duplicated here. The old
unscoped name is deprecated on the registry (never unpublished),
pointing consumers here.

---

Lily™ and Lily Design System™ are trademarks.
