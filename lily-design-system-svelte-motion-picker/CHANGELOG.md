# Changelog — MotionPicker (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-10-04

**Added: a hover/keyboard-focus tooltip on the icon button (minor, additive).**
A new `<div class="motion-picker-tooltip" role="tooltip" id="{baseId}-tooltip" hidden>`
sits right after the button, always in the DOM, holding the button's
existing `label` text (no new props, no new English text). It is shown
while the pointer is over the button or the tooltip, or while the button
has keyboard focus (`:focus-visible`); `Escape` dismisses it without
moving focus; it is never shown while the listbox is open. It is
deliberately not linked with `aria-describedby` (it duplicates the
`aria-label`). New class hook `.motion-picker-tooltip`; the 45 reference
themes already style it. Mirrors `search-picker`'s tooltip (§7.25–§7.30
there); this picker's clauses are §7.20–§7.25.

**Fix: the tooltip's `Escape` dismissal now works wherever focus is (WCAG 1.4.13).** It was bound to the button's keydown only, so a tooltip shown by pointer hover alone could not be dismissed. While the tooltip is visible a document `keydown` listener (added once, removed on hide/unmount; no `preventDefault`, no focus move) sets it dismissed. New clauses §7.26–§7.27.


## 0.1.2 — 2026-09-25

**Fix: dependency range on `@lilydesignsystem/svelte-headless` widened
from `^0.1.0` to `^0.2.0`.** 0.1.1 (below) started passing `baseClass`,
`as`, and `navigation="active-descendant"` to `Listbox`, and `IconButton`
similarly — props that only exist in `svelte-headless` 0.2.0. Because
`^0.1.0` never resolves to a 0.2.x release, every consumer installing
this package fresh got 0.1.x's `Listbox`, which does not recognise those
props and spreads them onto the rendered element as inert HTML
attributes (`baseclass="..."`, `as="ul"`, `navigation="..."`, ...)
instead of applying them. The practical symptom: the popup's intended
`class` (e.g. `motion-picker-list`) was never actually set, so a
consumer's positioning CSS (`position: absolute`, ...) never matched
anything, and the listbox rendered in normal document flow — pushing
the whole page down and sideways the instant it opened. No code change
here; the component's own implementation was already correct — only
the manifest was wrong.

## 0.1.1 — 2026-09-21

**Internal refactor: now depends on `@lilydesignsystem/svelte-headless`'s
`IconButton` and `Listbox` (new `navigation="active-descendant"` mode)
instead of hand-rolling their equivalents.** No change to the public
API, rendered markup (class names, ids, ARIA attributes), or keyboard
contract — the full existing test suite passes unchanged, run against
the refactored component with no test edits. `Listbox` gained
`clamp`/`typeahead`/`pageSize`/`onActivate`/`onEscape`/`onTabOut`/
`baseClass`/`as`/bindable `ref` specifically to make this migration
possible without any behaviour regression; `IconButton` gained
`baseClass` and a bindable `ref`. See the headless catalog's own
CHANGELOG for the full extension.

## 0.1.0 — 2026-09-16

**Package renamed: `lily-design-system-svelte-motion-picker` → `@lilydesignsystem/svelte-motion-picker`.** npm scoped packages
are registry-distinct from their unscoped counterparts, so this is a
new package with no publish history of its own — version reset to
`0.1.0` per this project's established rename precedent (the July
2026 `*-select` → `*-picker` rename). No code or behaviour change
relative to `lily-design-system-svelte-motion-picker`'s last published version (`0.1.0`).
This is this package's first dedicated `CHANGELOG.md`; its prior
history (as `lily-design-system-svelte-motion-picker`) is recorded in the root
[CHANGELOG.md](../CHANGELOG.md), not duplicated here. The old
unscoped name is deprecated on the registry (never unpublished),
pointing consumers here.

---

Lily™ and Lily Design System™ are trademarks.
