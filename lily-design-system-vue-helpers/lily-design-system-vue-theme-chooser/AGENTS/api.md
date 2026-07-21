# API — ThemeChooser (Vue)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Vue-flavoured shape of the contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export {
    default,
    default as ThemeChooser,
    normaliseThemesUrl,
    themeHref,
    nextThemeChooserId,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
} from "./ThemeChooser.vue";
export type { Props, SlotArgs, ChildArgs } from "./ThemeChooser.vue";
```

A consumer can import either the component or the helpers:

```ts
import ThemeChooser, {
    normaliseThemesUrl,
    themeHref,
    nextThemeChooserId,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
    type Props,
    type SlotArgs,
    type ChildArgs,
} from "./lily-design-system-vue-theme-chooser";
```

`CIRCLE_WITH_RIGHT_HALF_BLACK` is the default button glyph — `"◑"`,
U+25D1. `ChildArgs` is an alias of `SlotArgs`, matching the canonical
Svelte helper's type name.

## Props

| Prop           | Type                     | Required | Default                                          |
| -------------- | ------------------------ | -------- | ------------------------------------------------ |
| `label`        | `string`                 | yes      | —                                                |
| `themesUrl`    | `string`                 | yes      | —                                                |
| `themes`       | `string[]`               | yes      | —                                                |
| `value`        | `string`                 | no       | `""`                                             |
| `defaultValue` | `string`                 | no       | `undefined` (resolves to `"light"` or `themes[0]`) |
| `storageKey`   | `string`                 | no       | `undefined`                                      |
| `name`         | `string`                 | no       | `"theme"`                                        |
| `extension`    | `string`                 | no       | `".css"`                                         |
| `target`       | `HTMLElement \| null`    | no       | `undefined` (resolves to `document.documentElement`) |
| `themeLabels`  | `Record<string, string>` | no       | `{}`                                             |
| `class`        | `string`                 | no       | `""`                                             |

There is no `placeholder` prop — it was removed with the `<select>`.

The `value` prop is two-way bindable via `v-model:value`. Other
attributes (`id`, `data-*`, event handlers) fall through to the root
`<div>` via Vue's default `inheritAttrs` — note that this reaches the
wrapper, not the button or the listbox, so `aria-label` must go through
the `label` prop.

## Events

```ts
defineEmits<{
    (event: "update:value", value: string): void;
    (event: "change", value: string): void;
}>();
```

`update:value` is the half of `v-model:value` that flows from the
component back to the parent. It fires:

- when the user commits an option (click, or `Enter` / `Space` on the
  listbox),
- once on `onMounted` if the resolved initial value differs from
  the supplied `value` prop.

`change` fires every time the chooser successfully applies a theme.
Use it for analytics, server sync, or cookie writes.

## Default scoped slot

The default slot replaces the **button glyph** — not the options. The
listbox, its `<li role="option">` children, the keyboard contract, and
the apply lifecycle are all component-owned.

```ts
export type SlotArgs = {
    value: string;                       // the active slug
    open: boolean;                       // is the listbox open?
    labelFor: (theme: string) => string; // resolved display label
};
export type ChildArgs = SlotArgs;
```

Consumers consume it via `<template #default="{ … }">`:

```vue
<ThemeChooser label="…" themes-url="/…" :themes="[…]">
    <template #default="{ value, open, labelFor }">
        <!-- decorative markup only; keep it aria-hidden or text-free -->
    </template>
</ThemeChooser>
```

Slot content sits inside the `<button>`, so it must not contain
interactive elements, and it must not introduce a competing accessible
name — `aria-label` from `label` is the button's name.

When no slot is supplied, the button renders
`<span class="theme-chooser-icon" aria-hidden="true">◑</span>`, as
documented in `spec/index.md §4.4`.

## Pure helpers

Exported from the SFC's first `<script>` block:

```ts
export function normaliseThemesUrl(themesUrl: string): string;
export function themeHref(themesUrl: string, slug: string, extension: string): string;
export function nextThemeChooserId(): string;
export const CIRCLE_WITH_RIGHT_HALF_BLACK: string;
```

`normaliseThemesUrl(s)` ensures `s` ends with exactly one `/`.
`themeHref(url, slug, ext)` concatenates the three to build the
final stylesheet href. Both are pure and side-effect-free; consumers
can call them from tests, server code, or other components without
instantiating the chooser.

`nextThemeChooserId()` increments a module-level counter and returns
`"theme-chooser-{n}"`. It is impure by design (each call returns a new
id) but SSR-safe: no `Math.random()`, no `Date.now()`, so server and
client agree. The component calls it once per instance to build the
listbox and option ids.

## DOM contract

```html
<div class="theme-chooser {class}" ...$attrs>
    <input type="hidden" name="{name}" value="{value}" />
    <button type="button" class="theme-chooser-button"
            aria-label="{label}" aria-haspopup="listbox"
            aria-expanded="false" aria-controls="{listId}">
        <!-- default slot output, or: -->
        <span class="theme-chooser-icon" aria-hidden="true">◑</span>
    </button>
    <ul class="theme-chooser-list" id="{listId}" role="listbox"
        aria-label="{label}" tabindex="-1" hidden
        aria-activedescendant="{optionId, only while open}">
        <li class="theme-chooser-option" id="{optionId}" role="option"
            aria-selected="true|false" data-active>{labelFor(slug)}</li>
    </ul>
</div>
```

Document mutations (only inside `onMounted` / `watch`):

```html
<link rel="stylesheet" data-lily-theme-chooser="{name}" href="{themesUrl}{slug}{extension}" />
```

And on the resolved target:

```html
<html data-theme="{slug}">
```

## Type re-exports

`Props`, `SlotArgs`, and `ChildArgs` are re-exported from `index.ts`
so consumers can type their wrapping code:

```ts
import type { Props, SlotArgs } from "./lily-design-system-vue-theme-chooser";

const config: Pick<Props, "themesUrl" | "themes" | "storageKey"> = {
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"],
    storageKey: "my-app:theme",
};
```

## Versioning

The API surface above is the unreleased icon-button contract, which
breaks 0.3.0: the root is a `<div>` rather than a `<select>`, the
`placeholder` prop is gone, and the default slot's `SlotArgs` changed
shape. Any breaking change
(rename, removal, type narrowing of an existing prop) bumps the
minor version while v0.x; once v1.0 ships, breaking changes bump
the major.
