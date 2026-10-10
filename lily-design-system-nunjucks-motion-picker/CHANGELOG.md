# Changelog — MotionPicker (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.2.0 — 2026-10-04

**Added: picker tooltip (minor, additive).** The macro now renders `<div class="motion-picker-tooltip" role="tooltip" id="{id}-tooltip" hidden>{label}</div>` as a sibling right after the icon button — the button's existing `label`, no new macro argument, no new English text, deliberately not linked with `aria-describedby`. The client wires it: shown on pointer hover (over the button or the tooltip itself) or keyboard focus (`:focus-visible`); `Escape` on the button dismisses it without moving focus; never shown while the popup is open; idempotent across repeated init. New class hook `.motion-picker-tooltip`; theme CSS for it already ships in `themes/`. Ports the canonical Svelte change.

**Fixed: tooltip Escape now works wherever focus is.** While the tooltip is visible, `client.js` listens for `Escape` on the document (added only while visible, removed on hide, `destroy()` and re-init), so a tooltip shown by pointer hover alone with focus elsewhere can be dismissed (WCAG 1.4.13). It never calls `preventDefault`/`stopPropagation` and never moves focus.

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
[CHANGELOG.md](../CHANGELOG.md), not duplicated here. The old
unscoped name is deprecated on the registry (never unpublished),
pointing consumers here.

---

Lily™ and Lily Design System™ are trademarks.
