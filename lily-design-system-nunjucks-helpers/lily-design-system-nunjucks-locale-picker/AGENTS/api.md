# API — LocalePicker (Nunjucks)

Authoritative API surface lives in [`../spec.md`](../spec.md) §4.
This file documents the Nunjucks-flavoured shape of the contract,
split between the macro (server-side) and the client.js (browser).

## Macro

Import and invoke:

```njk
{% from "./locale-picker.njk" import localePicker %}
{{ localePicker({
    label: "Language",
    locales: ["en", "fr", "ar"]
}) }}
```

### `opts` keys

| Key                  | Type                     | Required | Default                                          |
| -------------------- | ------------------------ | -------- | ------------------------------------------------ |
| `label`              | `string`                 | yes      | —                                                |
| `locales`            | `string[]`               | yes      | —                                                |
| `value`              | `string`                 | no       | `""`                                             |
| `defaultValue`       | `string`                 | no       | `""`                                             |
| `storageKey`         | `string`                 | no       | `""`                                             |
| `detectFromNavigator`| `boolean`                | no       | `false`                                          |
| `name`               | `string`                 | no       | `"locale"`                                       |
| `applyDir`           | `boolean`                | no       | `true`                                           |
| `localeLabels`       | `Record<string,string>`  | no       | `{}`                                             |
| `classes`            | `string`                 | no       | `""`                                             |
| `attributes`         | `Record<string,string>`  | no       | `{}`                                             |

The macro emits the `data-lily-locale-picker-*` configuration
attributes the client.js reads on init. `opts.attributes` is
spread onto the root after those so consumers can override `id`,
`data-testid`, etc.

## Client.js exports

`locale-picker.client.js` is an ES module:

```js
// Pure helpers
export function bcp47LocaleTag(locale: string): string;
export function isRtlLocale(locale: string): boolean;
export function localeName(locale: string): string;
export function matchNavigatorLanguage(
    navLangs: readonly string[],
    locales: readonly string[],
): string;

// Built-in data
export const defaultLocaleLabels: Record<string, string>;
export const RTL_LANGUAGE_TAGS: ReadonlySet<string>;
export const RTL_SCRIPT_SUBTAGS: ReadonlySet<string>;

// Init / wiring
export function initLocalePicker(
    root: HTMLElement,
    opts?: {
        onChange?: (code: string) => void;
        target?: HTMLElement | null;
    },
): { setLocale: (code: string) => void; destroy: () => void };

export function autoInit(
    opts?: {
        onChange?: (code: string) => void;
        target?: HTMLElement | null;
    },
): Array<{ setLocale: (code: string) => void; destroy: () => void }>;
```

`autoInit()` is the common entry point; `initLocalePicker(root)`
is useful when the consumer already has a reference to a single
fieldset.

### Pure helpers

```js
bcp47LocaleTag("en_US");      // "en-US"
bcp47LocaleTag("zh_Hant_TW"); // "zh-Hant-TW"
bcp47LocaleTag("en");         // "en"

isRtlLocale("ar");            // true
isRtlLocale("uz_Arab_AF");    // true (Arab script subtag)
isRtlLocale("en");            // false

localeName("en_US");          // "English (United States)"
localeName("xx");             // "xx" (fallback when not in table)

matchNavigatorLanguage(["fr-FR", "en"], ["en", "fr_FR", "ar"]); // "fr_FR"
matchNavigatorLanguage(["pt-BR"], ["en", "pt"]);                 // "pt"
matchNavigatorLanguage(["es"], ["en", "fr"]);                    // ""
```

All pure functions are side-effect-free; consumers can call them
from tests, server code, or other modules without instantiating
the picker.

### Controller

`initLocalePicker(root)` returns:

| Property    | Type                       | Notes                                              |
| ----------- | -------------------------- | -------------------------------------------------- |
| `setLocale` | `(code: string) => void`   | Apply a locale imperatively; mirrors a radio click. |
| `destroy`   | `() => void`               | Remove the `change` listener; keeps applied DOM.   |

`destroy()` does **not** restore the previous `lang` / `dir` or
remove the `localStorage` entry.

### Optional client opts

```ts
type ClientOpts = {
    onChange?: (code: string) => void;
    target?: HTMLElement | null;
};
```

- `onChange(code)` — fired after every successful apply. Receives
  the **consumer-form** code (not the BCP 47-normalised tag).
- `target` — element receiving `lang` and `dir`. Defaults to
  `document.documentElement`. Pass a sub-tree root for per-region
  language switching.

## DOM contract

Root element (macro output):

```html
<fieldset
    class="locale-picker {classes}"
    role="radiogroup"
    aria-label="{label}"
    data-lily-locale-picker-root
    data-lily-locale-picker-name="{name}"
    data-lily-locale-picker-storage-key="{storageKey}"
    data-lily-locale-picker-default-value="{defaultValue}"
    data-lily-locale-picker-detect-from-navigator="{true|false}"
    data-lily-locale-picker-apply-dir="{true|false}"
>
    <!-- per-locale option markup -->
</fieldset>
```

Default option markup (one per `locales` entry):

```html
<label class="locale-picker-option" lang="{tagFor(locale)}">
    <input type="radio" name="{name}" value="{locale}" {checked when value===locale} />
    <span class="locale-picker-option-label">{labelFor(locale)}</span>
</label>
```

Document mutations (only inside `initLocalePicker` and
subsequent events):

```html
<!-- on the resolved target (default <html>) -->
<html lang="{tagFor(code)}" dir="rtl|ltr">
```

`dir` is only written when `applyDir` is `true` (the default).

## Versioning

The API surface above is the v0.1.0 contract. Any breaking
change (rename, removal, type narrowing of an existing opt or
export) bumps the minor version while v0.x; once v1.0 ships,
breaking changes bump the major.
