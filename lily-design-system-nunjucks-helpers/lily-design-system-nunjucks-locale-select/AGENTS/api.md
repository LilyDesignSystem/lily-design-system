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
| `locales`            | `string[]`               | yes      | —                                                |
| `value`              | `string`                 | no       | `""`                                             |
| `defaultValue`       | `string`                 | no       | `""`                                             |
| `storageKey`         | `string`                 | no       | `""`                                             |
| `detectFromNavigator`| `boolean`                | no       | `false`                                          |
| `name`               | `string`                 | no       | `"locale"`                                       |
| `applyDir`           | `boolean`                | no       | `true`                                           |
| `localeLabels`       | `Record<string,string>`  | no       | `{}`                                             |
| `id`                 | `string`                 | no       | `"locale-select-{name}"`                         |
| `classes`            | `string`                 | no       | `""`                                             |
| `attributes`         | `Record<string,string>`  | no       | `{}`                                             |

`label` becomes the `aria-label` on both the trigger button and the
listbox; the button is icon-only, so it is the only accessible name
the button has. `name` is the hidden input's `name`, not a `<select>`
attribute.

`id` prefixes the listbox id (`{id}-list`) and every option id
(`{id}-option-{index}`). A Nunjucks macro cannot hold a module-level
counter, so this parameter is the framework's stable-id mechanism:
two instances that share a `name` and take the default `id` will
collide, so pass an explicit `id` to at least one of them.

The macro emits the `data-lily-locale-select-*` configuration
attributes the client.js reads on init. `opts.attributes` is
spread onto the root after those so consumers can override `id`,
`data-testid`, etc.

### Caller block

Invoking the macro with `{% call %}` replaces the default glyph
**inside the button** with the block body — this is the Nunjucks
equivalent of "children":

```njk
{% call localeSelect({label: "Language", locales: ["en", "fr"]}) %}
    <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16">…</svg>
{% endcall %}
```

The block body does not render options; the listbox always comes
from `opts.locales`.

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
export const GLOBE_WITH_MERIDIANS: string; // "\u{1F310}", the default glyph

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
root `<div>`. Both bail out to an inert `{setLocale, destroy}` pair
when the root is missing its button or its listbox.

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
| `setLocale` | `(code: string) => void`   | Apply a locale imperatively; same code path as choosing an option. |
| `destroy`   | `() => void`               | Remove every listener (button, listbox, root `focusout`, document `click`) and clear the typeahead timer; keeps applied DOM. |

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
<div
    class="locale-select {classes}"
    data-lily-locale-select-root
    data-lily-locale-select-name="{name}"
    data-lily-locale-select-storage-key="{storageKey}"
    data-lily-locale-select-default-value="{defaultValue}"
    data-lily-locale-select-detect-from-navigator="{true|false}"
    data-lily-locale-select-apply-dir="{true|false}"
    data-lily-locale-select-value="{value}"   <!-- only when opts.value is set -->
>
    <!-- hidden input, trigger button, listbox -->
</div>
```

Its three children, in source order:

```html
<input type="hidden" name="{name}" value="{selected}" data-lily-locale-select-input>

<button type="button" class="locale-select-button" aria-label="{label}"
        aria-haspopup="listbox" aria-expanded="false" aria-controls="{id}-list"
        data-lily-locale-select-button>
    <span class="locale-select-icon" aria-hidden="true">&#127760;&#65038;</span>
</button>

<ul class="locale-select-list" id="{id}-list" role="listbox" aria-label="{label}"
    tabindex="-1" hidden data-lily-locale-select-list>
    <li class="locale-select-option" id="{id}-option-{index}" role="option"
        aria-selected="{true|false}" data-value="{locale}" lang="{tagFor(locale)}">{labelFor(locale)}</li>
</ul>
```

- The button glyph is U+1F310 GLOBE WITH MERIDIANS, wrapped in
  `aria-hidden="true"`. A `{% call %}` block replaces the whole
  `<span class="locale-select-icon">` with the block body.
- Each option carries `lang` (BCP 47 hyphen form) for WCAG 3.1.2.
  The button and the `<ul>` do not: they are chrome, not content.
- `{selected}` is resolved server-side as
  `value or defaultValue or ("en" if listed else locales[0])`, and
  exactly one `<li>` gets `aria-selected="true"`. The client may
  correct that after hydration, since storage and `navigator` are
  client-only.
- `opts.value` still reaches the client **only** through the
  `data-lily-locale-select-value` attribute, which the macro omits
  entirely when `opts.value` is empty.

Read the active locale from `lang` on the target, from the hidden
input's value, or from the `onChange(code)` argument.

Client-side mutations inside the root:

| Attribute                       | Where             | Meaning                              |
| ------------------------------- | ----------------- | ------------------------------------ |
| `aria-expanded`                 | button            | Listbox open state.                  |
| `hidden`                        | `<ul>`            | Removed while open.                  |
| `aria-activedescendant`         | `<ul>`            | Id of the active option while open.  |
| `data-active`                   | `<li>`            | Active (roved-to) option.            |
| `aria-selected`                 | `<li>`            | The applied locale.                  |
| `value`                         | hidden input      | The applied locale, consumer form.   |

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
