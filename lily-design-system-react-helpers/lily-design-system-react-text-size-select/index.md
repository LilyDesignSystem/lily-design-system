# TextSizeSelect (React helper)

A reusable, headless React 19 **text-size select**. Renders an icon
button that opens a dropdown listbox of text-size slugs and, on every
change, sets `data-text-size="{slug}"` on a target element (default
`document.documentElement`), optionally persisting the choice to
`localStorage`. Ships no CSS — the consumer maps each size slug to
real typography via CSS, e.g.:

```css
:root[data-text-size="small"]   { font-size: 87.5%; }
:root[data-text-size="medium"]  { font-size: 100%; }
:root[data-text-size="large"]   { font-size: 112.5%; }
:root[data-text-size="x-large"] { font-size: 125%; }
```

This supports WCAG 2.2 — 1.4.4 (Resize Text) and 1.4.12 (Text
Spacing) — by letting users pick a comfortable reading size that the
app remembers.

The control is the same icon-button-plus-listbox shape as the sibling
[`theme-select`](../lily-design-system-react-theme-select/) and
[`locale-select`](../lily-design-system-react-locale-select/) helpers,
so a row of Lily™ preference controls in one banner is uniform. Its
glyph is `"A"` (U+0041).

For the full contract see [spec/index.md](./spec/index.md) — it is the single
source of truth for the API, behaviour, and tests. For the roles,
keyboard table, and the tradeoffs this pattern accepts, see
[docs/accessibility.md](./docs/accessibility.md).

## Install

This directory is published as a folder-style import; consumers either
copy it into their project or wire it as a workspace dependency. The
only runtime dependency is `react` ≥ 19.

```ts
import {
    TextSizeSelect,
    sizeName,
    LATIN_CAPITAL_LETTER_A,
    type Props,
    type ChildArgs,
} from "./lily-design-system-react-text-size-select";
```

## Quick start

```tsx
"use client";

import { useState } from "react";
import {
    TextSizeSelect,
    sizeName,
} from "./lily-design-system-react-text-size-select";

export function TextSizeChooser() {
    const [size, setSize] = useState("");
    return (
        <>
            <TextSizeSelect
                label="Text size"
                sizes={["small", "medium", "large", "x-large"]}
                value={size}
                onChange={setSize}
                storageKey="lily-text-size"
            />
            <p className="text-size-select-status" aria-live="polite">
                Text size: {sizeName(size)}
            </p>
        </>
    );
}

// Renders:
// <div class="text-size-select">
//   <input type="hidden" name="text-size" value="medium" />
//   <button type="button" class="text-size-select-button"
//           aria-label="Text size" aria-haspopup="listbox"
//           aria-expanded="false" aria-controls="…-list">
//     <span class="text-size-select-icon" aria-hidden="true">A</span>
//   </button>
//   <ul class="text-size-select-list" id="…-list" role="listbox"
//       aria-label="Text size" tabindex="-1" hidden>
//     <li class="text-size-select-option" role="option" aria-selected="false">Small</li>
//     <li class="text-size-select-option" role="option" aria-selected="true">Medium</li>
//     <li class="text-size-select-option" role="option" aria-selected="false">Large</li>
//     <li class="text-size-select-option" role="option" aria-selected="false">X Large</li>
//   </ul>
// </div>
```

The status line is part of the pattern, not decoration: the closed
button shows only a glyph, so nothing on screen or in the accessibility
tree reports the size currently in effect. See
[docs/accessibility.md](./docs/accessibility.md).

When the user picks `large`, the component:

- sets `data-text-size="large"` on `<html>`,
- writes `"large"` to `localStorage["lily-text-size"]`,
- fires `onChange("large")` if provided.

The helper does NOT style the text — the consumer's CSS keyed on
`[data-text-size="…"]` owns the actual typography scale. It also ships
no positioning, so give the root `position: relative` and the list
`position: absolute` in your own CSS.

## Props

| Prop          | Type                        | Required | Description                                            |
| ------------- | --------------------------- | -------- | ------------------------------------------------------ |
| `label`       | `string`                    | yes      | Accessible name (`aria-label`) for the button and listbox. |
| `sizes`       | `string[]`                  | yes      | Available size slugs.                                  |
| `value`       | `string`                    | no       | Selected slug. When supplied, the component is controlled. |
| `defaultValue`| `string`                    | no       | Initial slug when nothing else is supplied.            |
| `storageKey`  | `string`                    | no       | If set, persist the slug to `localStorage`.            |
| `name`        | `string`                    | no       | `name` of the hidden input (default `"text-size"`).    |
| `target`      | `HTMLElement \| null`       | no       | Element to receive `data-text-size`. Default `<html>`. |
| `sizeLabels`  | `Record<string,string>`     | no       | Pretty labels per slug.                                |
| `children`    | `(args) => ReactNode`       | no       | Render prop replacing the button glyph; receives `ChildArgs`. |
| `onChange`    | `(size: string) => void`    | no       | Called after a new size is applied.                    |
| `className`   | `string`                    | no       | Extra CSS class on the root `<div>`.                   |

There is no detection prop. Unlike `prefers-color-scheme` or
`navigator.languages`, no platform signal exposes a preferred text size,
so first-visit resolution falls through to `defaultValue` / `"medium"`.

## Default labels

By default each option's text is the slug title-cased per hyphen-word,
so `x-large` renders as `X Large`. Override per-slug with `sizeLabels`:

```tsx
<TextSizeSelect
    label="Text size"
    sizes={["small", "medium", "large", "x-large"]}
    sizeLabels={{ small: "Compact", "x-large": "Huge" }}
/>
```

The pure helper is exported for reuse — use it rather than re-deriving
labels, so your status line and the options always agree:

```ts
sizeName("x-large"); // "X Large"
```

It mirrors `themeName` in theme-select and `localeName` in
locale-select.

## Replacing the glyph

`children` is a render prop that replaces the `"A"` **inside the
button**. It does not render the options — the component owns those.
It receives `{ value, open, labelFor }`:

```tsx
<TextSizeSelect
    label="Text size"
    sizes={["small", "medium", "large", "x-large"]}
    value={size}
    onChange={setSize}
    storageKey="lily-text-size"
>
    {({ value, open, labelFor }) => (
        <>
            <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
                <path d="M2 14 L8 2 L14 14" fill="none" stroke="currentColor" />
            </svg>
            <span aria-hidden="true">{labelFor(value)}</span>
        </>
    )}
</TextSizeSelect>
```

Keep custom glyph content `aria-hidden="true"` — the button's
accessible name comes solely from `label`. If you do render visible
text, make `label` begin with that text (WCAG 2.5.3, Label in Name).

## Keyboard

The component implements the WAI-ARIA APG listbox contract itself;
nothing is inherited from a native `<select>`.

| Key                             | Where    | Action                                            |
| ------------------------------- | -------- | ------------------------------------------------- |
| `ArrowDown` / `Enter` / `Space` | button   | Open on the selected option; focus moves to the list. |
| `ArrowUp`                       | button   | Open on the **last** option.                      |
| `ArrowDown` / `ArrowUp`         | listbox  | Move the active option; clamps, does not wrap.    |
| `Home` / `End`                  | listbox  | Jump to the first / last option.                  |
| `Enter` / `Space`               | listbox  | Select, apply, close, refocus the button.         |
| `Escape`                        | listbox  | Close and refocus the button; value unchanged.    |
| `Tab`                           | listbox  | Close and let focus move on.                      |
| Printable character             | listbox  | Typeahead over labels; buffer resets after 500 ms. |

Clicking an option selects it; clicking the button again, clicking
outside, or moving focus out all close without changing the value.

## Behaviour

Initial value resolves from `value` > storage > `defaultValue` >
`"medium"` (if present) > `sizes[0]`. All DOM writes happen inside
`useEffect`, so the component is SSR-safe. Option and list ids come
from React's `useId`, so they survive hydration.

## Accessibility

- WCAG 2.2 AAA target; this helper most directly serves 1.4.4 (Resize
  Text) and 1.4.12 (Text Spacing).
- WAI-ARIA APG listbox pattern; the active option is tracked with
  `aria-activedescendant` and mirrored to `data-active` for CSS.
- `aria-label` carries the accessible name on both the button and the
  listbox. The glyph is `aria-hidden`, so `label` is the only name the
  control has.
- No colour-only meaning; the active state is exposed via
  `aria-selected`, `data-active`, and the resolved `data-text-size`.
- Full detail, including the three tradeoffs this pattern accepts:
  [docs/accessibility.md](./docs/accessibility.md).

## Files in this directory

| File                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `spec/index.md`               | Single source of truth — API, behaviour, tests.  |
| `TextSizeSelect.tsx`          | The component implementation.                    |
| `TextSizeSelect.test.tsx`     | vitest suite covering every spec §7 item.        |
| `index.ts`                    | Re-export barrel.                                |
| `index.md`                    | This file — quick start + worked examples.       |
| `docs/accessibility.md`       | Roles, keyboard contract, tradeoffs, smoke test. |
| `AGENTS.md`                   | AI-agent metadata pointer.                       |
| `CLAUDE.md`                   | Loads `AGENTS.md`.                               |
| `README.md`                   | Symlink to `index.md`.                           |

---

Lily™ and Lily Design System™ are trademarks.
