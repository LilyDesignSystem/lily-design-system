# MotionPicker (Vue helper)

A reusable Vue 3 headless **motion (reduced-motion) picker** — an icon
button that opens a WAI-ARIA APG listbox of motion-preference slugs.
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
an arbitrary default.

## Usage

```vue
<script setup lang="ts">
import { ref } from "vue";
import MotionPicker from "lily-design-system-vue-motion-picker";

const motion = ref("");
</script>

<template>
  <MotionPicker
    label="Motion"
    :motions="['no-preference', 'reduce']"
    v-model:value="motion"
    storageKey="lily-motion"
  />
</template>
```

## Props

| Prop           | Type                     | Required | Description                                                |
| -------------- | ------------------------ | -------- | ------------------------------------------------------------ |
| `label`        | `string`                 | yes      | Accessible name (`aria-label`) for the button + listbox.      |
| `motions`      | `string[]`               | yes      | Available motion slugs.                                       |
| `value`        | `string`                 | no       | Selected slug. Two-way bindable via `v-model:value`.           |
| `defaultValue` | `string`                 | no       | Initial slug when nothing else is supplied.                    |
| `storageKey`   | `string`                 | no       | If set, persist the slug to `localStorage`.                    |
| `name`         | `string`                 | no       | `name` of the hidden input (default `"motion"`).               |
| `target`       | `HTMLElement \| null`    | no       | Element to receive `data-motion`. Default `<html>`.            |
| `motionLabels` | `Record<string,string>`  | no       | Pretty labels per slug.                                        |
| `class`        | `string`                 | no       | Extra CSS class on the root.                                   |

Emits `change` (the applied slug) and `update:value` (for
`v-model:value`).

## Behaviour

Initial value resolves from `value` > storage > `defaultValue` > the
platform's `(prefers-reduced-motion: reduce)` preference (mapped to
`"reduce"` / `"no-preference"` if either is in `motions`) > `motions[0]`.
All DOM writes happen inside `onMounted`/`watch`, so the component is
SSR-safe.

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
