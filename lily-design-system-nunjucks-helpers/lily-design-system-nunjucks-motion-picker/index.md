# MotionPicker (Nunjucks helper)

A reusable Nunjucks 3 + vanilla-JS headless **motion (reduced-motion)
picker** — a macro + client.js pair rendering an icon button that
opens a listbox of motion-preference slugs. On every change the client
sets `data-motion="{slug}"` on a target element (default
`document.documentElement`), optionally persisting the choice to
`localStorage`. Ships no CSS — the consumer decides what
`data-motion="reduce"` actually suppresses, e.g.:

```css
:root[data-motion="reduce"] * {
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
  scroll-behavior: auto !important;
}
```

Unlike `text-size-picker` (no OS signal exists) and `theme-picker`
(whose `prefers-color-scheme` detection is opt-in via
`detectFromSystem`), this picker checks
`(prefers-reduced-motion: reduce)` **unconditionally** on the client —
motion has a real OS accessibility signal, and the canonical contract
treats deferring to it as the default.

## Usage

```njk
{% from "./motion-picker.njk" import motionPicker %}
{{ motionPicker({
  label: "Motion",
  motions: ["no-preference", "reduce"],
  storageKey: "lily-motion"
}) }}
```

```js
import { autoInit } from "lily-design-system-nunjucks-motion-picker";
autoInit();
```

The button does nothing until the client module runs — load it once
per page.

## Macro parameters

| Param          | Type                    | Required | Description                                            |
| -------------- | ----------------------- | -------- | -------------------------------------------------------- |
| `label`        | `string`                | yes      | Accessible name (`aria-label`) for the button + listbox.  |
| `motions`      | `array<string>`         | yes      | Available motion slugs.                                   |
| `value`        | `string`                | no       | Initial slug, emitted for the client to read.              |
| `defaultValue` | `string`                | no       | Initial slug when nothing else is supplied.                |
| `storageKey`   | `string`                | no       | If set, client.js persists to `localStorage`.              |
| `name`         | `string`                | no       | Hidden-input `name` (default `"motion"`).                  |
| `motionLabels` | `object<string,string>` | no       | Pretty label per slug.                                     |
| `id`           | `string`                | no       | Id prefix for the listbox and its options.                 |
| `classes`      | `string`                | no       | Extra CSS classes on the root `<div>`.                     |
| `attributes`   | `object`                | no       | Extra HTML attributes spread onto the root.                |

## Client.js exports

| Export | Description |
| --- | --- |
| `initMotionPicker(root, opts?)` | Wires one rendered root. `opts.onChange`, `opts.target`. |
| `autoInit(opts?)` | Wires every `[data-lily-motion-picker-root]` on the page. |
| `motionName(slug)` | Title-cases a hyphenated slug. |
| `prefersReducedMotion()` | Reads `(prefers-reduced-motion: reduce)`; `false` on the server. |
| `PAUSE_SIGN` | The default glyph (U+23F8 + U+FE0E). |

## Behaviour

Initial value resolves from `value` > storage > `defaultValue` > the
platform's `(prefers-reduced-motion: reduce)` preference (mapped to
`"reduce"` / `"no-preference"` if either is in `motions`) > first
option. The server-rendered `aria-selected` uses `motions[0]` as its
fallback (no OS signal exists at render time); the client corrects it
on init.

## Accessibility

- WCAG 2.2 AAA target; directly supports 2.3.3 (Animation from
  Interactions).
- APG listbox keyboard contract: arrows (clamped), `Home` / `End`,
  `PageUp` / `PageDown` (by ten), typeahead with same-character
  cycling, `Escape` discards, and `Tab` closes via the button so the
  default Tab proceeds from the picker's position.
- `aria-label` carries the consumer-supplied accessible name.
- Default labels title-case the slug.
- The button is inert until the client module runs — a real no-JS
  regression, same as the sibling pickers.

---

Lily™ and Lily Design System™ are trademarks.
