# `<lily-motion-picker>` (HTML helper)

A reusable vanilla HTML/JS headless **motion (reduced-motion) picker**,
packaged as the `<lily-motion-picker>` custom element — an icon button that
opens a dropdown listbox (WAI-ARIA APG listbox pattern) of
motion-preference slugs. On every change it sets `data-motion="{slug}"`
on a target element (default `document.documentElement`), optionally
persisting the choice to `localStorage`. Ships no CSS — the consumer
decides what `data-motion="reduce"` actually suppresses, e.g.:

```css
:root[data-motion="reduce"] * {
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
  scroll-behavior: auto !important;
}
```

Unlike its `theme-picker` and `text-size-picker` siblings, its initial
value defers to the platform's own `(prefers-reduced-motion: reduce)`
media query before falling back to an arbitrary default.

## Usage

```html
<script type="module" src="./motion-picker/index.js"></script>

<lily-motion-picker
  label="Motion"
  motions="no-preference,reduce"
  storage-key="lily-motion"
></lily-motion-picker>
```

```js
import "lily-design-system-web-components-motion-picker";

const picker = document.querySelector("motion-picker");
picker.addEventListener("motionchange", (e) => {
  console.log(e.detail.motion);
});
```

## Attributes / Properties

| Attribute        | Property       | Type                     | Required | Description                                                |
| ---------------- | -------------- | ------------------------ | -------- | ------------------------------------------------------------ |
| `label`          | `label`        | `string`                 | yes      | Accessible name for the button + listbox.                    |
| `motions`        | `motions`      | CSV / `string[]`         | yes      | Available motion slugs.                                       |
| `value`          | `value`        | `string`                 | no       | Selected slug.                                                 |
| `default-value`  | `defaultValue` | `string`                 | no       | Initial slug when nothing else is supplied.                    |
| `storage-key`    | `storageKey`   | `string`                 | no       | If set, persist the slug to `localStorage`.                    |
| `name`           | `name`         | `string`                 | no       | `name` of the hidden input (default `"motion"`).               |
| —                | `target`       | `HTMLElement \| null`    | no       | Element to receive `data-motion`. Default `<html>`.            |
| `motion-labels`  | `motionLabels` | JSON / `Record<string,string>` | no | Pretty labels per slug.                                        |
| `class`          | —              | `string`                 | no       | Extra CSS class on the root.                                   |

Dispatches `motionchange` (`CustomEvent<{ motion: string }>`, bubbles,
composed) after every applied change.

## Behaviour

Initial value resolves from `value` > storage > `default-value` > the
platform's `(prefers-reduced-motion: reduce)` preference (mapped to
`"reduce"` / `"no-preference"` if either is in `motions`) > `motions[0]`.
All DOM writes happen inside the custom-element lifecycle callbacks, so
the element is SSR-safe.

## Accessibility

- WCAG 2.2 AAA target; directly supports 2.3.3 (Animation from
  Interactions).
- APG listbox keyboard contract: arrows (clamped), `Home` / `End`,
  `PageUp` / `PageDown` (by ten), typeahead with same-character
  cycling, `Escape` discards, and `Tab` closes via the button so the
  default Tab proceeds from the picker's position.
- `aria-label` carries the consumer-supplied accessible name.
- Default labels title-case the slug.

---

Lily™ and Lily Design System™ are trademarks.
