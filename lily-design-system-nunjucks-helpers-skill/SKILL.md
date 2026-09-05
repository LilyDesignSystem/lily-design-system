---
name: lily-design-system-nunjucks-helpers-skill
description: Explains how to consume Lily Design System's Nunjucks *-picker helpers catalog (theme-picker, locale-picker, text-size-picker, motion-picker, share-picker, date-time-picker) — the macro-plus-client.js split unique to the Nunjucks port, the icon-button-opens-listbox contract shared by the four preference helpers versus share-picker's disclosure-of-links and date-time-picker's field-plus-dialog shape, and motion-picker's one documented server/client deviation (no matchMedia at render time). Use when someone asks how to add a Lily picker helper to a Nunjucks/Eleventy page, wants the data-lily-* hook contract, needs to know what still works without JavaScript, or asks why motion-picker's server-rendered markup differs from its client-corrected value.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Nunjucks `*-picker` helpers

`lily-design-system-nunjucks-helpers` is Lily's Nunjucks port of the
six-helper `*-picker` catalog: `theme-picker`, `locale-picker`,
`text-size-picker`, `motion-picker`, `share-picker`, `date-time-picker`.
Each helper owns one complete interaction end to end rather than being a
pure markup primitive — most own a **user preference** (selection + DOM
application + optional persistence); `share-picker` owns an **action**;
`date-time-picker` owns a **form value**. Full canonical contracts:
`AGENTS/helpers.md` at the repo root.

Each helper is its own npm package,
`lily-design-system-nunjucks-{helper-name}` (e.g.
`lily-design-system-nunjucks-motion-picker`), living as a sibling
directory inside the `lily-design-system-nunjucks-helpers` catalog.

## The one-line contract per helper

| Helper              | Applies                                                                 | Persists                          |
| -------------------- | ------------------------------------------------------------------------ | ----------------------------------- |
| `theme-picker`      | Swaps a managed `<link>` href and sets `data-theme` on the document root. | Optional `localStorage`.          |
| `locale-picker`     | Sets `lang` and `dir` on the document root. No translation.              | Optional `localStorage` / `navigator.language` fallback. |
| `text-size-picker`  | Sets `data-text-size` on the document root.                              | Optional `localStorage`.          |
| `motion-picker`     | Sets `data-motion` on the document root; defers to `(prefers-reduced-motion: reduce)` unconditionally as one step of initial-value resolution. | Optional `localStorage`.          |
| `share-picker`      | Nothing — opens the native share sheet, or a disclosure of consumer-supplied destinations plus copy-to-clipboard. | None.                              |
| `date-time-picker`  | Nothing — it holds a form value (a text field + trigger opening an APG date-picker dialog). | None.                              |

## The Nunjucks-specific split: macro + client.js

Nunjucks renders server-side (or at build time, e.g. Eleventy). It
cannot read `localStorage`, mutate `document.head`, or attach event
listeners — those only exist in the browser. So, unlike the single-file
component every other framework catalog ships, **each Nunjucks helper is
a macro-plus-client.js pair**:

| File                     | Runs where                | Owns                                                  |
| ------------------------ | -------------------------- | ------------------------------------------------------- |
| `{kebab-name}.njk`       | Nunjucks render time       | Markup, ARIA, class hooks, `data-lily-*` hooks.        |
| `{kebab-name}.client.js` | Browser, after page load   | Storage, attribute application, dynamic CSS loading, the entire listbox/dialog interaction. |

The macro emits static markup carrying `data-lily-*` attributes
describing the control's configuration. The companion ES module finds
those roots in the DOM at runtime and wires up the apply lifecycle.
Consumers load the client.js once per page (typically
`<script type="module">`) and call `autoInit()` to bind every matching
control on the page — or `initThemePicker(root, opts)` (etc.) for one
root explicitly.

```njk
{% from "./motion-picker.njk" import motionPicker %}
{{ motionPicker({ label: "Motion", motions: ["no-preference", "reduce"] }) }}
```

```js
import { autoInit } from "./motion-picker.client.js";
autoInit();
```

## Shared markup contract (the four preference helpers)

`theme-picker`, `locale-picker`, `text-size-picker`, and `motion-picker`
all render the same shape: root
`<div class="{helper} {class}" data-lily-{helper}-root>` containing a
hidden input (form participation, carries `name`), a
`<button class="{helper}-button" type="button" aria-label
aria-haspopup="listbox" aria-expanded aria-controls>` whose only content
is an `aria-hidden` glyph span, and a
`<ul class="{helper}-list" role="listbox" tabindex="-1" hidden>` of
`<li class="{helper}-option" role="option" aria-selected>`. **None of
the four is operable without JavaScript** — the button has no handler
and the listbox stays `hidden` until the client module runs. The macro
does still emit a server-filled hidden `<input>`, so a plain form submit
carries a value even with no client script; only the *choosing* needs
the client.

`share-picker` breaks that shape deliberately: its destinations are real
`<a href>` navigation, not `role="option"` items, so with no JavaScript
they still navigate, middle-click, and open in a new tab — what's lost
is the disclosure itself (it can't be opened) and copy-to-clipboard
(inert). `date-time-picker` degrades worst of the six: its calendar
grid, weekday headers, and time-select options are all a function of
`Intl.DateTimeFormat` and the current date, computations a Nunjucks
template genuinely cannot perform, so the macro renders only the fixed
chrome (trigger, header nav buttons, footer) and
`date-time-picker.client.js` builds the interactive interior itself —
with no client script only the hidden input's server-resolved value
survives a form post.

## `motion-picker`'s server/client deviation

This is the one documented deviation from the canonical (Svelte)
contract anywhere in this catalog. Every other preference helper's
initial value can be fully resolved server-side. `motion-picker`'s
can't: its canonical contract defers to the platform's own
`(prefers-reduced-motion: reduce)` media query — unconditionally, not
behind an opt-in flag, because motion has a real accessibility signal
(WCAG 2.3.3) worth deferring to by default — but `matchMedia` does not
exist on the server. So the macro marks `motions[0]` selected
server-side as an honest placeholder, and
`motion-picker.client.js` checks the real OS preference on init and
corrects the selection — the same "server marks something honestly,
client refines it" pattern this catalog's `theme-picker` already uses
for its own (opt-in) `prefers-color-scheme` detection. No other helper
in the Nunjucks catalog has this gap, because no other helper's initial
value depends on a live platform signal absent at render time.

## Conventions this catalog follows

- Nunjucks 3 macro, camelCase macro name, kebab-case file path and CSS
  class hook — matching the upstream convention in
  `lily-design-system-nunjucks-headless/AGENTS/nunjucks.md`.
- A single `opts` options object on the macro.
- `data-lily-*` attributes are the wiring contract between the macro's
  output and the client.js — no inline `<script>` in macro output.
- Headless: no bundled CSS, fonts, icons, or images; the consumer styles
  every `{helper}`/`{helper}-button`/`{helper}-list`/`{helper}-option`
  class hook.
- SSR-safe: the client.js guards every DOM read/write behind a
  `typeof document !== "undefined"` check.
- i18n-clean: every user-facing string arrives through `opts`.

## Where the rest of the detail lives

- `AGENTS/helpers.md` at the repo root — the full shared contract across
  all seven catalogs: the icon-button-opens-listbox keyboard pattern,
  the idempotent-apply rule, the glyph conventions, and per-helper
  behaviour this file summarises rather than restates.
- Each helper's own `spec/index.md` inside
  `lily-design-system-nunjucks-helpers/lily-design-system-nunjucks-{helper}/` —
  the numbered, testable contract for that one package, including its
  exact `opts` shape and HTML output.

## When NOT this skill

- Questions about the 491-component headless macro catalog itself
  (`Button`, `BreadcrumbNav`, `DataTable`, …) — use
  `lily-design-system-nunjucks-headless-skill`.
- General Lily concepts, terminology, or the headless-vs-example split
  that apply across all seven frameworks — use `lily-design-system-skill`.
