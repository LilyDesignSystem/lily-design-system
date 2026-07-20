# API — LocaleSelect (Vue)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Vue-flavoured shape of the contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export { default, default as LocaleSelect } from "./LocaleSelect.vue";
export type { Props, SlotArgs, ChildArgs } from "./LocaleSelect.vue";
export {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    nextLocaleSelectId,
    GLOBE_WITH_MERIDIANS,
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

`label` names **both** the button and the listbox; the button is
icon-only, so it is the button's only accessible name. `name` is the
`name` of the hidden input that carries the value in a form. `class`
lands on the root `<div>`. There is no `placeholder` prop — it was
removed with the `<select>`.

`value` is two-way bindable via `v-model:value`. Other attributes
(`id`, `data-*`, event handlers, ARIA overrides) fall through to
the root `<div>` via Vue's default `inheritAttrs`.

## Events

```ts
defineEmits<{
    (event: "update:value", value: string): void;
    (event: "change", value: string): void;
}>();
```

`update:value` is the half of `v-model:value` that flows from the
component back to the parent. It fires:

- when an option is committed (clicked, or `Enter` / `Space` on the
  active option),
- once on `onMounted` if the resolved initial value differs from
  the supplied `value` prop.

`change` fires every time the select successfully applies a locale.
Use it for analytics, server cookie writes, or for telling your
i18n library to load message bundles.

## Default scoped slot

The default slot replaces the **button glyph** — not the options. The
listbox, its `<li role="option">` children, the keyboard contract, and
the apply lifecycle stay component-owned. Its `SlotArgs`:

```ts
export type SlotArgs = {
    value: string;
    open: boolean;
    labelFor: (locale: string) => string;
};

export type ChildArgs = SlotArgs; // alias matching the Svelte canonical
```

Consumers consume it via `<template #default="{ … }">`:

```vue
<LocaleSelect label="Language" :locales="['en', 'fr', 'ar']">
    <template #default="{ value, open, labelFor }">
        <span :title="labelFor(value)" aria-hidden="true">
            {{ value.toUpperCase() }}{{ open ? " ▴" : " ▾" }}
        </span>
    </template>
</LocaleSelect>
```

Slot content is decorative: the button's accessible name always comes
from `label` via `aria-label`, so slot markup should be
`aria-hidden="true"` or text-free.

When no slot is supplied, the button renders
`<span class="locale-select-icon" aria-hidden="true">🌐</span>` — the
markup documented in `spec/index.md §4.4`.

## Pure helpers

The pure helpers are exported from the SFC's first `<script>` block:

```ts
export function bcp47LocaleTag(locale: string): string;
export function isRtlLocale(locale: string): boolean;
export function localeName(locale: string): string;
export function matchNavigatorLanguage(
    navLangs: readonly string[],
    locales: readonly string[],
): string | "";
// per-instance id generator (module counter; SSR-safe):
export function nextLocaleSelectId(): string;
// + the constants:
export const GLOBE_WITH_MERIDIANS: string; // "\u{1F310}"
export const defaultLocaleLabels: Record<string, string>;
export const RTL_LANGUAGE_TAGS: ReadonlySet<string>;
export const RTL_SCRIPT_SUBTAGS: ReadonlySet<string>;
```

All pure functions are side-effect-free; consumers can call them
from tests, server code, or other components without instantiating
the select. `nextLocaleSelectId` is the one exception — it increments
a module-level counter, which is exactly what makes the element ids
stable and SSR-safe (never `Math.random()` or `Date.now()`).

## DOM contract

```html
<div class="locale-select {class}" ...$attrs>
    <input type="hidden" name="{name}" value="{value}" />
    <button type="button" class="locale-select-button"
            aria-label="{label}" aria-haspopup="listbox"
            aria-expanded="false" aria-controls="{listId}">
        <!-- default slot output, or: -->
        <span class="locale-select-icon" aria-hidden="true">🌐</span>
    </button>
    <ul class="locale-select-list" id="{listId}" role="listbox"
        aria-label="{label}" tabindex="-1" hidden aria-activedescendant>
        <li class="locale-select-option" id="{optionId}" role="option"
            aria-selected="true|false" data-active
            lang="{tagFor(locale)}">{{ labelFor(locale) }}</li>
    </ul>
</div>
```

Document mutations (only inside `onMounted` / `watch`):

```html
<html lang="{tagFor(locale)}" dir="rtl|ltr">
```

`dir` is only written when `applyDir` is `true` (the default).

## Type re-exports

`Props`, `SlotArgs`, and `ChildArgs` are re-exported from `index.ts`
so consumers can type their wrapping code:

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
