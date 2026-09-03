# AGENTS — MotionPicker (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Nunjucks 3 + vanilla-JS headless motion (reduced-motion)
picker that applies the chosen slug to the document root via
`data-motion`, with optional `localStorage` persistence. Ships no
CSS; consumer styles the `motion-picker` class hooks and decides what
`[data-motion="reduce"]` actually suppresses.

The helper is a **macro + client.js pair**:

- The macro renders the markup server-side / at build time. It cannot
  know the platform's `(prefers-reduced-motion: reduce)` preference —
  there is no `matchMedia` on the server — so it marks `motions[0]`
  selected as an honest placeholder.
- The companion ES module picks up the markup in the browser, checks
  the real OS preference (unconditionally — see below), and owns the
  lifecycle (storage, `data-motion` application, change events) and
  the whole listbox interaction.

## Files

| File                       | Purpose                                                        |
| -------------------------- | --------------------------------------------------------------- |
| `spec/index.md`            | Specification-driven contract (canonical, Svelte-sourced).       |
| `motion-picker.njk`        | Nunjucks macro (`motionPicker(opts)`).                          |
| `motion-picker.client.js`  | ES module — `initMotionPicker`, `autoInit`, `motionName`, `prefersReducedMotion`, glyph. |
| `motion-picker.test.ts`    | Vitest spec, one assertion per §7 acceptance.                    |
| `index.md`                 | Concise user guide.                                              |

## Public surface

### Macro

- Import: `{% from "./motion-picker.njk" import motionPicker %}`
- Call: `{{ motionPicker({label, motions, …}) }}`
- Required `opts` keys: `label`, `motions`.

### Client.js

- `import { initMotionPicker, autoInit, motionName, prefersReducedMotion, PAUSE_SIGN } from "./motion-picker.client.js"`
- `motionName(slug)` mirrors text-size-picker's `sizeName` and
  theme-picker's `themeName`: `"no-preference"` → `"No Preference"`.
- `prefersReducedMotion()` reads `(prefers-reduced-motion: reduce)`;
  `false` when `matchMedia` is unavailable (SSR).
- Required call: `initMotionPicker(rootElement, opts?)` or
  `autoInit(opts?)` to wire every `[data-lily-motion-picker-root]` on
  the page.

## Behaviour contract (one paragraph)

The macro emits a `<div class="motion-picker">` carrying
`data-lily-motion-picker-*` hooks describing the control's name,
storage key, default value, and — when `opts.value` is set — the
consumer's initial value. Inside it are a hidden input, an icon
`<button>`, and a `<ul role="listbox" hidden>`. On
`initMotionPicker(root)`, the client (1) resolves the initial slug
from value attribute > storage > default-value > the platform's
`(prefers-reduced-motion: reduce)` preference (checked
**unconditionally**, not behind an opt-in flag — unlike theme-picker's
`detectFromSystem`, motion has a real accessibility signal the
canonical Svelte contract treats as the default to defer to) >
first-option, (2) sets `data-motion="{slug}"` on the resolved target
(defaults to `document.documentElement`), (3) optionally writes to
`localStorage`, (4) mirrors the slug into the hidden input and
re-derives every option's `aria-selected`, (5) calls `onChange(slug)`.
The client ALSO owns the entire listbox interaction: open/close, focus
movement, the APG keyboard contract, and typeahead.

## HTML

```html
<div class="motion-picker {classes}" data-lily-motion-picker-root …>
  <input
    type="hidden"
    name="{name}"
    value="{selected}"
    data-lily-motion-picker-input
  />
  <button
    type="button"
    class="motion-picker-button"
    aria-label="{label}"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="{id}-list"
    data-lily-motion-picker-button
  >
    <span class="motion-picker-icon" aria-hidden="true">&#9208;&#65038;</span>
  </button>
  <ul
    class="motion-picker-list"
    id="{id}-list"
    role="listbox"
    aria-label="{label}"
    tabindex="-1"
    hidden
    data-lily-motion-picker-list
  >
    <li
      class="motion-picker-option"
      id="{id}-option-{i}"
      role="option"
      aria-selected="true|false"
      data-value="{slug}"
    >
      {labelFor(slug)}
    </li>
  </ul>
</div>
```

The glyph is U+23F8 PAUSE SIGN + U+FE0E, `aria-hidden`, exported as
`PAUSE_SIGN` from the client module and written as the HTML entity
`&#9208;&#65038;` in the macro (per the glyph-escaping rule — no bare
character in source). A `{% call %}` block body replaces the glyph
inside the button; it does not render options.

Server markup marks exactly ONE option `aria-selected="true"`,
resolved as `value or defaultValue or motions[0]` — no OS check
server-side — and pre-fills the hidden input with it.

Ids are `{id}-list` / `{id}-option-{i}` where `id` defaults to
`motion-picker-{name}`.

## Accessibility

- WCAG 2.2 AAA target; WAI-ARIA APG listbox pattern.
- Directly supports WCAG 2.3.3 (Animation from Interactions) — this
  helper's specific concern.
- The client provides Arrow / Home / End / PageUp / PageDown / Enter /
  Space / Escape / Tab / typeahead semantics; none of it works before
  the client runs (same no-JS regression documented for the sibling
  pickers).
- `aria-label` is the ONLY accessible name the button has.
- `aria-selected` tracks the applied motion; `data-active` tracks the
  keyboard cursor.
- Option labels default to title-cased slugs.

## Conventions this package follows

- Nunjucks 3 macro, camelCase name, kebab-case file path and CSS class.
- Single `opts` parameter on the macro.
- No runtime dependency on the client side beyond standard DOM APIs.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from `opts`.
- No inline `<script>` in the macro output; the client.js is loaded
  separately by the consumer.
- Glyph escaped in source: HTML entity in the macro, Unicode escape
  (`PAUSE_SIGN`, U+23F8 + U+FE0E) in the client module, per
  `AGENTS/helpers.md`'s glyph-escaping rule.
