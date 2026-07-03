# API — ThemeSelect (Vue)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Vue-flavoured shape of the contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export { default, default as ThemeSelect } from "./ThemeSelect.vue";
export type { Props, SlotArgs } from "./ThemeSelect.vue";
export { normaliseThemesUrl, themeHref } from "./ThemeSelect.vue";
```

A consumer can import either the component or the helpers:

```ts
import ThemeSelect, {
    normaliseThemesUrl,
    themeHref,
    type Props,
    type SlotArgs,
} from "./lily-design-system-vue-theme-select";
```

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

The `value` prop is two-way bindable via `v-model:value`. Other
attributes (`id`, `data-*`, event handlers, ARIA overrides) fall
through to the root `<select>` via Vue's default `inheritAttrs`.

## Events

```ts
defineEmits<{
    (event: "update:value", value: string): void;
    (event: "change", value: string): void;
}>();
```

`update:value` is the half of `v-model:value` that flows from the
component back to the parent. It fires:

- after a `<select>` change,
- once on `onMounted` if the resolved initial value differs from
  the supplied `value` prop.

`change` fires every time the select successfully applies a theme.
Use it for analytics, server sync, or cookie writes.

## Default scoped slot

The default slot's `SlotArgs`:

```ts
export type SlotArgs = {
    themes: string[];
    value: string;
    setTheme: (theme: string) => void;
    name: string;
    labelFor: (theme: string) => string;
};
```

Consumers consume it via `<template #default="{ … }">`:

```vue
<ThemeSelect label="…" themes-url="/…" :themes="[…]">
    <template #default="{ themes, value, setTheme, name, labelFor }">
        <!-- custom markup -->
    </template>
</ThemeSelect>
```

When no slot is supplied, the select renders the default `<option>`
markup documented in `spec/index.md §4.4`.

## Pure helpers

Two pure helpers are exported from the SFC's first `<script>` block:

```ts
export function normaliseThemesUrl(themesUrl: string): string;
export function themeHref(themesUrl: string, slug: string, extension: string): string;
```

`normaliseThemesUrl(s)` ensures `s` ends with exactly one `/`.
`themeHref(url, slug, ext)` concatenates the three to build the
final stylesheet href.

Both are pure and side-effect-free; consumers can call them from
tests, server code, or other components without instantiating the
select.

## DOM contract

Root element:

```html
<select class="theme-select {class}" aria-label="{label}" name="{name}">
    <!-- default slot output -->
</select>
```

Default option markup (one per `themes` entry):

```html
<option class="theme-select-option" value="{slug}">{{ labelFor(slug) }}</option>
```

Document mutations (only inside `onMounted` / `watch`):

```html
<link rel="stylesheet" data-lily-theme-select="{name}" href="{themesUrl}{slug}{extension}" />
```

And on the resolved target:

```html
<html data-theme="{slug}">
```

## Type re-exports

`Props` and `SlotArgs` are re-exported from `index.ts` so consumers
can type their wrapping code:

```ts
import type { Props, SlotArgs } from "./lily-design-system-vue-theme-select";

const config: Pick<Props, "themesUrl" | "themes" | "storageKey"> = {
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"],
    storageKey: "my-app:theme",
};
```

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
(rename, removal, type narrowing of an existing prop) bumps the
minor version while v0.x; once v1.0 ships, breaking changes bump
the major.
