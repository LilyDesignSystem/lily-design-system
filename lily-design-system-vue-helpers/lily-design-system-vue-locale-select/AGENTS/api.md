# API — LocaleSelect (Vue)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Vue-flavoured shape of the contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export { default, default as LocaleSelect } from "./LocaleSelect.vue";
export type { Props, SlotArgs } from "./LocaleSelect.vue";
export {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./LocaleSelect.vue";
```

A consumer can import either the component or the pure helpers:

```ts
import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
    matchNavigatorLanguage,
    type Props,
    type SlotArgs,
} from "./lily-design-system-vue-locale-select";
```

## Props

| Prop                  | Type                     | Required | Default                                            |
| --------------------- | ------------------------ | -------- | -------------------------------------------------- |
| `label`               | `string`                 | yes      | —                                                  |
| `locales`             | `string[]`               | yes      | —                                                  |
| `value`               | `string`                 | no       | `""`                                               |
| `defaultValue`        | `string`                 | no       | `undefined` (resolves to `"en"` or `locales[0]`)   |
| `storageKey`          | `string`                 | no       | `undefined`                                        |
| `detectFromNavigator` | `boolean`                | no       | `false`                                            |
| `name`                | `string`                 | no       | `"locale"`                                         |
| `target`              | `HTMLElement \| null`    | no       | `undefined` (resolves to `document.documentElement`) |
| `applyDir`            | `boolean`                | no       | `true`                                             |
| `localeLabels`        | `Record<string, string>` | no       | `{}`                                               |
| `class`               | `string`                 | no       | `""`                                               |

`value` is two-way bindable via `v-model:value`. Other attributes
(`id`, `data-*`, event handlers, ARIA overrides) fall through to
the root `<select>` via Vue's default `inheritAttrs`.

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

`change` fires every time the select successfully applies a locale.
Use it for analytics, server cookie writes, or for telling your
i18n library to load message bundles.

## Default scoped slot

The default slot's `SlotArgs`:

```ts
export type SlotArgs = {
    locales: string[];
    value: string;
    setLocale: (locale: string) => void;
    name: string;
    labelFor: (locale: string) => string;
    tagFor: (locale: string) => string;
    isRtl: (locale: string) => boolean;
};
```

Consumers consume it via `<template #default="{ … }">`:

```vue
<LocaleSelect label="…" :locales="[…]">
    <template #default="{ locales, value, setLocale, name, labelFor, tagFor, isRtl }">
        <!-- custom markup -->
    </template>
</LocaleSelect>
```

When no slot is supplied, the select renders the default `<select>`
markup documented in `spec/index.md §4.4`.

## Pure helpers

Five pure helpers are exported from the SFC's first `<script>`
block:

```ts
export function bcp47LocaleTag(locale: string): string;
export function isRtlLocale(locale: string): boolean;
export function localeName(locale: string): string;
export function matchNavigatorLanguage(
    navLangs: readonly string[],
    locales: readonly string[],
): string | "";
// + the constants:
export const defaultLocaleLabels: Record<string, string>;
export const RTL_LANGUAGE_TAGS: ReadonlySet<string>;
export const RTL_SCRIPT_SUBTAGS: ReadonlySet<string>;
```

All pure functions are side-effect-free; consumers can call them
from tests, server code, or other components without instantiating
the select.

## DOM contract

Root element:

```html
<select class="locale-select {class}" aria-label="{label}" name="{name}">
    <!-- default slot output -->
</select>
```

Default option markup (one per `locales` entry):

```html
<option class="locale-select-option" value="{locale}" lang="{tagFor(locale)}">{{ labelFor(locale) }}</option>
```

Document mutations (only inside `onMounted` / `watch`):

```html
<html lang="{tagFor(locale)}" dir="rtl|ltr">
```

`dir` is only written when `applyDir` is `true` (the default).

## Type re-exports

`Props` and `SlotArgs` are re-exported from `index.ts` so consumers
can type their wrapping code:

```ts
import type { Props, SlotArgs } from "./lily-design-system-vue-locale-select";

const config: Pick<Props, "locales" | "storageKey" | "detectFromNavigator"> = {
    locales: ["en", "fr", "ar"],
    storageKey: "my-app:locale",
    detectFromNavigator: true,
};
```

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
(rename, removal, type narrowing of an existing prop) bumps the
minor version while v0.x; once v1.0 ships, breaking changes bump
the major.
