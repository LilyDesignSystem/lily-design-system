# Changelog — MotionPicker (Vue)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.1 — 2026-09-21

**Internal refactor: now depends on `@lilydesignsystem/vue-headless`'s
`IconButton` and `Listbox` (new `navigation="active-descendant"` mode)
instead of hand-rolling equivalent markup/keyboard logic — porting the
same refactor already made to `@lilydesignsystem/svelte-*`.** No
change to the public API, rendered markup (class names, ids, ARIA
attributes), or keyboard contract — the full existing test suite
passes unchanged, run against the refactored component with no test
edits. `Listbox`/`IconButton` gained `clamp`/`typeahead`/`pageSize`/
`activate`/`escape`/`tab-out` emits/`baseClass`/`as`/`defineExpose({ el
})` specifically to make this migration possible without any
behaviour regression — see `@lilydesignsystem/vue-headless`'s own
CHANGELOG.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-vue-motion-picker` → `@lilydesignsystem/vue-motion-picker`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-vue-motion-picker`'s last published version (`0.1.0`).
This is this package's first dedicated `CHANGELOG.md`; its prior
history (as `lily-design-system-vue-motion-picker`) is recorded in the root
[CHANGELOG.md](../../CHANGELOG.md), not duplicated here. The old
unscoped name is deprecated on the registry (never unpublished),
pointing consumers here.

---

Lily™ and Lily Design System™ are trademarks.
