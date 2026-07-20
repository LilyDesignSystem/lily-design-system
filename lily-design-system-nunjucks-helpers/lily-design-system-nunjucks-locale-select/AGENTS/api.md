# API — LocaleSelect (Nunjucks)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Nunjucks-flavoured shape of the contract,
split between the macro (server-side) and the client.js (browser).

## Macro

Import and invoke:

```njk
{% from "./locale-select.njk" import localeSelect %}
{{ localeSelect({
    label: "Language",
    locales: ["en", "fr", "ar"]
}) }}
```

### `opts` keys

| Key                  | Type                     | Required | Default                                          |
| -------------------- | ------------------------ | -------- | ------------------------------------------------ |
| `label`              | `string`                 | yes      | —                                                |
| `placeholder`        | `string`                 | no       | value of `label`                                 |
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

The macro emits the `data-lily-locale-select-*` configuration
attributes the client.js reads on init. `opts.attributes` is
spread onto the root after those so consumers can override `id`,
`data-testid`, etc.

## Client.js exports

`locale-select.client.js` is an ES module:

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
export function initLocaleSelect(
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

`autoInit()` is the common entry point; `initLocaleSelect(root)`
is useful when the consumer already has a reference to a single
`<select>`.

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
the select.

### Controller

`initLocaleSelect(root)` returns:

| Property    | Type                       | Notes                                              |
| ----------- | -------------------------- | -------------------------------------------------- |
| `setLocale` | `(code: string) => void`   | Apply a locale imperatively; same code path as a select change (and likewise leaves `select.value` at `""`). |
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
<select
    class="locale-select {classes}"
    aria-label="{label}"
    name="{name}"
    data-lily-locale-select-root
    data-lily-locale-select-name="{name}"
    data-lily-locale-select-storage-key="{storageKey}"
    data-lily-locale-select-default-value="{defaultValue}"
    data-lily-locale-select-detect-from-navigator="{true|false}"
    data-lily-locale-select-apply-dir="{true|false}"
    data-lily-locale-select-value="{value}"   <!-- only when opts.value is set -->
>
    <!-- placeholder option, then per-locale option markup -->
</select>
```

The FIRST child is always the component-owned placeholder option. It
carries no `lang` — it is not a locale — and it is the **only** option
ever rendered `selected`:

```html
<option class="locale-select-option locale-select-placeholder" value="" selected>{placeholder ?? label}</option>
```

Then the default option markup (one per `locales` entry) — never
`selected`, whatever `opts.value` is:

```html
<option class="locale-select-option" value="{locale}" lang="{tagFor(locale)}">{labelFor(locale)}</option>
```

`opts.value` reaches the client through the
`data-lily-locale-select-value` attribute instead. Rendering `selected`
on the matching option would make the browser (which honours the
*last* `selected` option) paint the locale name until the client
snapped it back — a visible flash on every load.

The `<select>`'s own `value` is always `""`: the client snaps it back
to the placeholder after every apply, so the closed control reads the
placeholder word rather than the active locale name. Read the active
locale from `lang` on the target or from the `onChange(code)`
argument.

Document mutations (only inside `initLocaleSelect` and
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
