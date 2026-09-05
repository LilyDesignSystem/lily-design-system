---
name: lily-design-system-web-components-helpers-skill
description: Explains Lily Design System's Web Components `*-picker` helpers catalog — six vanilla custom elements (`<lily-theme-picker>`, `<lily-locale-picker>`, `<lily-text-size-picker>`, `<lily-motion-picker>`, `<lily-share-picker>`, `<lily-date-time-picker>`) that each own one whole interaction end to end. Use when someone asks how to use Lily's `<lily-*-picker>` web-component pickers, what a picker's markup or keyboard contract is, how the icon-button-plus-listbox shape differs from share-picker's disclosure or date-time-picker's field+dialog, or how this catalog relates to the HTML helpers catalog it was copied from.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Web Components helpers usage

`lily-design-system-web-components-helpers` is a catalog of six
opinionated, reusable **web components (custom elements)** — under the
`<lily-*-picker>` tag prefix — that sit alongside the Web Components
headless catalog. Where a headless component is a pure markup primitive, a
helper owns one complete interaction end to end: selection, optional
persistence, and DOM application for the four preference pickers; a single
action for `share-picker`; a form value for `date-time-picker`.

**Provenance, stated precisely.** This catalog is a maintainer-directed
(2026-09-03) **independent copy** of
[`lily-design-system-html-helpers`](../lily-design-system-html-helpers/) —
which is itself already six vanilla custom elements. It differs only in
tag prefix (`<lily-theme-picker>` rather than bare `<theme-picker>`,
matching the Web Components headless catalog's `lily-{slug}` convention)
and in package naming. **Nothing ports between the two catalogs
automatically** — a change to one must be applied to the other
deliberately, by hand, as its own commit. Neither catalog is generated
from, or a thin wrapper around, the other; they are two independently
maintained, independently tested code bases that happen to share a
behavioural contract. The Svelte catalog
(`lily-design-system-svelte-helpers`) remains canonical for that contract;
when catalogs disagree, Svelte wins.

Root of the ecosystem: [../spec/index.md](../spec/index.md). The catalog's
own shared rules: [../AGENTS/helpers.md](../AGENTS/helpers.md). The
sibling headless-library skill:
[`lily-design-system-web-components-headless-skill`](../lily-design-system-web-components-headless-skill/).

## The six helpers

| Helper | Custom element | Owns |
| --- | --- | --- |
| `theme-picker` | `<lily-theme-picker>` | A visual-theme preference: dynamic theme CSS load + `data-theme` swap. |
| `locale-picker` | `<lily-locale-picker>` | A BCP 47 locale preference: sets `lang` + `dir` on the document root. No translation. |
| `text-size-picker` | `<lily-text-size-picker>` | A text-size preference: sets `data-text-size` on the document root. |
| `motion-picker` | `<lily-motion-picker>` | A reduced-motion preference: sets `data-motion` on the document root, defaulting to the OS's own `(prefers-reduced-motion: reduce)` signal — the one helper whose default is not a fixed slug. |
| `share-picker` | `<lily-share-picker>` | An **action**, not a preference: opens the native share sheet where available, else a disclosure of consumer-supplied destinations plus copy-to-clipboard. Applies nothing, persists nothing, ships no bundled endpoints. |
| `date-time-picker` | `<lily-date-time-picker>` | A **form value**: a typeable text field plus a trigger opening a WAI-ARIA APG date-picker dialog. Applies nothing, persists nothing. |

All six are custom elements registered via `customElements.define(...)` as
a side effect of importing each helper's module (the class itself is also
exported, for consumers who want to control registration themselves).
**Light DOM only** — no Shadow DOM — so the consumer's CSS reaches the
rendered children directly through stable kebab-case class hooks
(`theme-picker-button`, `theme-picker-list`, `theme-picker-option`, and so
on — the class hooks themselves keep the bare, unprefixed helper name even
though the custom-element tag carries the `lily-` prefix).

## Three markup shapes, not one

- **The four preference pickers** (`theme-picker`, `locale-picker`,
  `text-size-picker`, `motion-picker`) share one rendering shape: a root
  `<div class="{helper} {class}">` containing a hidden `<input>` for form
  participation, a `<button type="button" class="{helper}-button"
  aria-label aria-haspopup="listbox" aria-expanded aria-controls>` whose
  only content is an `aria-hidden` glyph span, and a `<ul role="listbox"
  tabindex="-1" hidden>` of `<li role="option" aria-selected>`. Keyboard
  follows the WAI-ARIA APG listbox pattern (Arrow keys to move, Home/End to
  jump, typeahead, Enter/Space/pointer-click select **and close**, Escape
  reverts, Tab closes and moves on) — implemented in JavaScript, not
  inherited from a native `<select>`; none of the four ever renders one.
- **`share-picker`** is a deliberate exception: it is a **disclosure**, not
  a listbox. Its destinations are real `<a>` elements (never
  `role="menuitem"`, which would strip middle-click and open-in-new-tab),
  copy is a real `<button>`, and focus moves to the item rather than
  staying on the list with `aria-activedescendant`.
- **`date-time-picker`** is a second, different exception: a **form
  control**. Its trigger opens a `role="dialog"` month grid (WAI-ARIA APG
  Date Picker Dialog), not a listbox — and unlike the other five, its field
  is typeable, because a date field a keyboard user can't type into is
  hostile to anyone who already knows the date.

Full contract for every rule above: [../AGENTS/helpers.md](../AGENTS/helpers.md)
and each helper's own `spec/index.md` — don't restate them here, point at
them.

## Attributes, properties, events

Attributes are kebab-case strings; observed attributes trigger
`attributeChangedCallback`. Array-valued attributes are comma-separated
strings with a matching JS property that accepts a native `Array<string>`;
object-valued attributes are JSON-encoded with a matching property that
accepts a native `Record<string, string>` (`date-time-picker`'s `labels`
and `shortcuts` are property-only, documented as its own exception, as is
`share-picker`'s `targets` and its three callbacks — anything carrying a
function is a JS property, not an attribute). Change notifications fire as
`CustomEvent`s with `bubbles: true, composed: true` — consumers listen for
the event rather than polling a value.

## Install and consumption

Each helper is its own npm package (e.g.
`lily-design-system-web-components-theme-picker`), built from a
`<kebab>.ts` custom element class plus an `index.ts` barrel that both
re-exports the class and registers it. A consumer imports the package (or
its built `dist/` module) for the side-effecting registration, then drops
the `<lily-*-picker>` tag into markup with its required attributes — no
framework runtime, no Shadow DOM styling to work around, and (per each
helper's own `spec/index.md`) no hardcoded CSS or user-facing strings
shipped with it.

## When this isn't the right skill

- **The headless component catalog these helpers sit alongside** (the
  partial, 33-of-491 Web Components headless catalog) — use
  [`lily-design-system-web-components-headless-skill`](../lily-design-system-web-components-headless-skill/).
- **The bare-tag HTML helpers catalog this one was copied from**
  (`<theme-picker>` rather than `<lily-theme-picker>`, a separately
  maintained subproject) — use
  [`lily-design-system-html-helpers-skill`](../lily-design-system-html-helpers-skill/).
- **General Lily concepts** not specific to the Web Components helpers
  idiom — use [`lily-design-system-skill`](../lily-design-system-skill/).
