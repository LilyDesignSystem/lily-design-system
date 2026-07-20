# API — `<locale-select>` (HTML helper)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the custom-element-flavoured shape of the
contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export {
    LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
    type LocaleSelectProps,
    type LocaleSelectChangeDetail,
} from "./locale-select";
```

It additionally performs the side-effectful registration:

```ts
if (typeof customElements !== "undefined" && !customElements.get("locale-select")) {
    customElements.define("locale-select", LocaleSelect);
}
```

A consumer can import either form:

```ts
// Side-effect only — registers <locale-select> globally:
import "./lily-design-system-html-locale-select";

// Or grab the class + helpers + types:
import {
    LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    type LocaleSelectProps,
    type LocaleSelectChangeDetail,
} from "./lily-design-system-html-locale-select";
```

## Observed attributes

| Attribute               | Type            | Required | Default                                  |
| ----------------------- | --------------- | -------- | ---------------------------------------- |
| `label`                 | `string`        | yes      | —                                        |
| `placeholder`           | `string`        | no       | value of `label`                         |
| `locales`               | `string` (CSV)  | yes      | —                                        |
| `value`                 | `string`        | no       | `""`                                     |
| `default-value`         | `string`        | no       | resolves to `"en"` or `locales[0]`       |
| `storage-key`           | `string`        | no       | absent                                   |
| `detect-from-navigator` | boolean attr    | no       | absent (`false`)                         |
| `name`                  | `string`        | no       | `"locale"`                               |
| `apply-dir`             | boolean attr    | no       | absent (`true`); `"false"` opts out      |
| `locale-labels`         | `string` (JSON) | no       | `"{}"`                                   |
| `class`                 | `string`        | no       | `""`                                     |

`label` and `locales` are required. The boolean-attribute convention
follows HTML: presence is truthy unless the literal value is
`"false"`; absence is the default (which is `false` for
`detect-from-navigator` and `true` for `apply-dir`).

## JS property mirrors

| Property                  | Type                     | Notes                                              |
| ------------------------- | ------------------------ | -------------------------------------------------- |
| `el.label`                | `string`                 | round-trips with `label`                           |
| `el.placeholder`          | `string`                 | round-trips with `placeholder`; falls back to `el.label` |
| `el.locales`              | `string[]`               | CSV-encoded in `locales`                           |
| `el.value`                | `string`                 | round-trips with `value` (consumer-form code)      |
| `el.defaultValue`         | `string`                 | round-trips with `default-value`                   |
| `el.storageKey`           | `string`                 | round-trips with `storage-key`                     |
| `el.detectFromNavigator`  | `boolean`                | mirrors boolean attribute                          |
| `el.name`                 | `string`                 | round-trips with `name`                            |
| `el.applyDir`             | `boolean`                | mirrors boolean attribute                          |
| `el.localeLabels`         | `Record<string, string>` | JSON-encoded in `locale-labels`                    |
| `el.target`               | `HTMLElement \| null`    | no attribute form — JS-only                        |

## Events

The element fires `localechange` after every successful apply:

```ts
el.addEventListener("localechange", (e) => {
    const { locale } = (e as CustomEvent<LocaleSelectChangeDetail>).detail;
});
```

| Property     | Value                                       |
| ------------ | ------------------------------------------- |
| `type`       | `"localechange"`                            |
| `detail`     | `{ locale: string }` (consumer-form code)   |
| `bubbles`    | `true`                                      |
| `composed`   | `true`                                      |
| `cancelable` | `false`                                     |

The detail carries the **consumer-form** code (`en_US` if the
consumer put `en_US` in `locales`). The DOM mutation uses the
BCP 47 hyphen form (`en-US`).

## Pure helpers

```ts
export function bcp47LocaleTag(locale: string): string;
export function isRtlLocale(locale: string): boolean;
export function localeName(locale: string): string;
export function matchNavigatorLanguage(
    navLangs: readonly string[],
    locales: readonly string[],
): string | "";
export const defaultLocaleLabels: Record<string, string>;
export const RTL_LANGUAGE_TAGS: ReadonlySet<string>;
export const RTL_SCRIPT_SUBTAGS: ReadonlySet<string>;
```

All pure functions are side-effect-free; consumers can call them
from tests, server code, or other components without instantiating
the select.

## Custom rendering by subclassing

`<locale-select>` doesn't expose Vue-style scoped slots or Svelte
snippets. The customisation surface is subclassing:

```ts
import { LocaleSelect } from "./locale-select";

class ButtonLocaleSelect extends LocaleSelect {
    connectedCallback(): void {
        super.connectedCallback();
        // Replace the rendered <select> with a row of buttons.
    }
}
customElements.define("button-locale-select", ButtonLocaleSelect);
```

See [`../docs/concepts.md`](../docs/concepts.md) and the
`examples/03-buttons.html` example.

## DOM contract

Host element:

```html
<locale-select
    label="Language"
    locales="en,fr,ar"
    value="fr"
></locale-select>
```

Rendered children (recreated on every `#render()`):

```html
<select class="locale-select {class}" aria-label="{label}" name="{name}">
    <option class="locale-select-option locale-select-placeholder" value="" selected>{placeholder ?? label}</option>
    <option class="locale-select-option" value="en" lang="en">English</option>
    <option class="locale-select-option" value="fr" lang="fr">French</option>
    <option class="locale-select-option" value="ar" lang="ar">Arabic</option>
</select>
```

Each locale `<option>` carries `lang="{tagFor(locale)}"` (BCP 47
hyphen form) so assistive technology pronounces the option name in
its own language (WCAG 3.1.2, Language of Parts). The placeholder
carries no `lang`: it is UI copy in the page language.

The leading placeholder is component-owned and is the only option
ever marked `selected`. The `<select>`'s own `value` is always `""`:
the `change` handler reads the chosen code, resets `select.value` to
`""`, then assigns `this.value`. Read the selection from `el.value`
or the `localechange` detail, never from the rendered `<select>`.

Document mutations (only inside `connectedCallback` /
`attributeChangedCallback`):

```html
<html lang="{tagFor(locale)}" dir="rtl|ltr">
```

`dir` is only written when `applyDir` is `true` (the default).

## Type re-exports

`LocaleSelectProps` and `LocaleSelectChangeDetail` are re-exported
from `index.ts`:

```ts
import type {
    LocaleSelectProps,
    LocaleSelectChangeDetail,
} from "./lily-design-system-html-locale-select";

const config: Pick<LocaleSelectProps, "locales" | "storageKey" | "detectFromNavigator"> = {
    locales: ["en", "fr", "ar"],
    storageKey: "my-app:locale",
    detectFromNavigator: true,
};
```

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
bumps the minor version while v0.x; once v1.0 ships, breaking
changes bump the major.
