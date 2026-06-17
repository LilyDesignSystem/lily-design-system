# TextSizeSelect (React helper)

A reusable, headless React 19 **text-size select**. Renders a native
`<select>` of text-size slugs and, on every change, sets
`data-text-size="{slug}"` on a target element (default
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

For the full contract see [spec.md](./spec.md) — it is the single
source of truth for the API, behaviour, and tests.

## Install

This directory is published as a folder-style import; consumers either
copy it into their project or wire it as a workspace dependency. The
only runtime dependency is `react` ≥ 19.

```ts
import {
    TextSizeSelect,
    titleCaseSize,
    type Props,
    type ChildArgs,
} from "./lily-design-system-react-text-size-select";
```

## Quick start

```tsx
"use client";

import { useState } from "react";
import { TextSizeSelect } from "./lily-design-system-react-text-size-select";

export function TextSizeChooser() {
    const [size, setSize] = useState("");
    return (
        <TextSizeSelect
            label="Text size"
            sizes={["small", "medium", "large", "x-large"]}
            value={size}
            onChange={setSize}
            storageKey="lily-text-size"
        />
    );
}

// Renders:
// <select class="text-size-select" aria-label="Text size" name="text-size">
//     <option class="text-size-select-option" value="small">Small</option>
//     <option class="text-size-select-option" value="medium">Medium</option>
//     <option class="text-size-select-option" value="large">Large</option>
//     <option class="text-size-select-option" value="x-large">X Large</option>
// </select>
```

When the user picks `large`, the component:

- sets `data-text-size="large"` on `<html>`,
- writes `"large"` to `localStorage["lily-text-size"]`,
- fires `onChange("large")` if provided.

The helper does NOT style the text — the consumer's CSS keyed on
`[data-text-size="…"]` owns the actual typography scale.

## Props

| Prop          | Type                        | Required | Description                                            |
| ------------- | --------------------------- | -------- | ------------------------------------------------------ |
| `label`       | `string`                    | yes      | Accessible name (`aria-label`) for the `<select>`.     |
| `sizes`       | `string[]`                  | yes      | Available size slugs.                                  |
| `value`       | `string`                    | no       | Selected slug. When supplied, the component is controlled. |
| `defaultValue`| `string`                    | no       | Initial slug when nothing else is supplied.            |
| `storageKey`  | `string`                    | no       | If set, persist the slug to `localStorage`.            |
| `name`        | `string`                    | no       | `name` of the `<select>` (default `"text-size"`).      |
| `target`      | `HTMLElement \| null`       | no       | Element to receive `data-text-size`. Default `<html>`. |
| `sizeLabels`  | `Record<string,string>`     | no       | Pretty labels per slug.                                |
| `children`    | `(args) => ReactNode`       | no       | Render prop for custom markup; receives `ChildArgs`.   |
| `onChange`    | `(size: string) => void`    | no       | Called after a new size is applied.                    |
| `className`   | `string`                    | no       | Extra CSS class on the root `<select>`.                |

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

The pure helper is exported for reuse:

```ts
titleCaseSize("x-large"); // "X Large"
```

## Driving custom markup

Use the `children` render prop for full markup control. The select
still owns the apply lifecycle:

```tsx
<TextSizeSelect
    label="Text size"
    sizes={["small", "medium", "large", "x-large"]}
    value={size}
    onChange={setSize}
    storageKey="lily-text-size"
>
    {({ sizes, value, setSize, labelFor }) => (
        <ul className="text-size-select-list">
            {sizes.map((s) => (
                <li key={s}>
                    <button
                        type="button"
                        aria-pressed={value === s}
                        onClick={() => setSize(s)}
                    >
                        {labelFor(s)}
                    </button>
                </li>
            ))}
        </ul>
    )}
</TextSizeSelect>
```

## Behaviour

Initial value resolves from `value` > storage > `defaultValue` >
`"medium"` (if present) > `sizes[0]`. All DOM writes happen inside
`useEffect`, so the component is SSR-safe.

## Accessibility

- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text).
- Native `<select>` provides Arrow / Home / End / typeahead semantics.
- `aria-label` carries the consumer-supplied accessible name on the
  `<select>` (implicit `combobox` role).
- No colour-only meaning; the active state is visible in the resolved
  `data-text-size` attribute and the native selected `<option>`.

## Files in this directory

| File                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `spec.md`                     | Single source of truth — API, behaviour, tests.  |
| `TextSizeSelect.tsx`          | The component implementation.                    |
| `TextSizeSelect.test.tsx`     | vitest suite covering every spec §7 item.        |
| `index.ts`                    | Re-export barrel.                                |
| `index.md`                    | This file — quick start + worked examples.       |
| `AGENTS.md`                   | AI-agent metadata pointer.                       |
| `CLAUDE.md`                   | Loads `AGENTS.md`.                               |
| `README.md`                   | Symlink to `index.md`.                           |
