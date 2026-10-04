# Changelog — MotionPicker (React)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-10-04

**Added (minor, additive): a picker tooltip.** A new `.motion-picker-tooltip` element (`role="tooltip"`, `hidden` at rest) follows the icon button and shows the button's existing `label` on pointer hover, on the tooltip itself (hoverable), and on keyboard focus (`:focus-visible`); `Escape` dismisses it without moving focus, and it is never shown while the listbox is open. No new props and no new text; deliberately not linked by `aria-describedby`, since it duplicates the button's `aria-label`. Position and appearance are theme CSS keyed on `hidden`.

**Fix: tooltip `Escape` now works wherever focus is.** While the tooltip is visible, a `document` `keydown` listener (added only while visible, removed on hide/unmount) dismisses it, so a pointer-hover-only tooltip is dismissable without moving pointer or focus (WCAG 1.4.13). Does not prevent default, stop propagation, or move focus.

## 0.1.2 — 2026-10-01

**Fix: dependency range on `@lilydesignsystem/react-headless` widened
from `^0.1.0` to `^0.2.0`.** This package composes the headless `IconButton` (plus, for the listbox pickers and
kanban-board, `Listbox`) with props (`baseClass`, the active-descendant
`navigation` mode, …) that only exist in
react-headless 0.2.0, but `^0.1.0` never resolves to a 0.2.x release,
so a fresh install got 0.1.0 and those props were dropped: Escape left
`aria-expanded="true"` and option selection never applied. Found when
the react example app's picker e2e tests failed against the published
packages, and confirmed by forcing react-headless 0.2.0, which made every
one pass. The same defect and fix as the Svelte catalog's 0.1.2. No
source change.

## 0.1.1 — 2026-09-21

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
