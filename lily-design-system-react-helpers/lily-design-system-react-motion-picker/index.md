# MotionPicker (React helper)

A reusable React 19 headless **motion (reduced-motion) picker** — an
icon button that opens a dropdown listbox of motion-preference slugs.
On every change it sets `data-motion="{slug}"` on a target element
(default `document.documentElement`), optionally persisting the choice
to `localStorage`. Ships no CSS — the consumer decides what
`data-motion="reduce"` actually suppresses, e.g.:

```css
:root[data-motion="reduce"] * {
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
  scroll-behavior: auto !important;
}
```

Unlike its `theme-picker` and `text-size-picker` siblings, MotionPicker's
initial value defers to the platform's own
`(prefers-reduced-motion: reduce)` media query before falling back to
an arbitrary default — motion has a real OS-reported accessibility
preference to honour (WCAG 2.3.3, Animation from Interactions); font
size and colour scheme don't.

## Usage

```tsx
import { useState } from "react";
import MotionPicker from "lily-design-system-react-motion-picker";

function Example() {
  const [motion, setMotion] = useState("");
  return (
    <MotionPicker
      label="Motion"
      motions={["no-preference", "reduce"]}
      value={motion}
      onChange={setMotion}
      storageKey="lily-motion"
    />
  );
}
```

Uncontrolled usage (omit `value`/`onChange`) works too — the component
manages its own state and still applies to the DOM.

## Props

| Prop           | Type                       | Required | Description                                              |
| -------------- | -------------------------- | -------- | --------------------------------------------------------- |
| `label`        | `string`                   | yes      | Accessible name (`aria-label`) for the button + listbox.   |
| `motions`      | `string[]`                 | yes      | Available motion slugs.                                    |
| `value`        | `string`                   | no       | Selected slug. Supplying it makes the component controlled. |
| `defaultValue` | `string`                   | no       | Initial slug when nothing else is supplied.                 |
| `storageKey`   | `string`                   | no       | If set, persist the slug to `localStorage`.                 |
| `name`         | `string`                   | no       | `name` of the hidden input (default `"motion"`).            |
| `target`       | `HTMLElement \| null`      | no       | Element to receive `data-motion`. Default `<html>`.         |
| `motionLabels` | `Record<string,string>`    | no       | Pretty labels per slug.                                     |
| `onChange`     | `(motion: string) => void` | no       | Called after a new motion preference is applied.            |
| `className`    | `string`                   | no       | Extra CSS class on the root.                                |

## Behaviour

Initial value resolves from `value` > storage > `defaultValue` > the
platform's `(prefers-reduced-motion: reduce)` preference (mapped to
`"reduce"` / `"no-preference"` if either is in `motions`) > `motions[0]`.
All DOM writes happen inside `useEffect`, so the component is SSR-safe.

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
