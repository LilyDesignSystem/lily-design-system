# API — ThemePicker (Nunjucks)

Authoritative API surface lives in [`../spec.md`](../spec.md) §4.
This file documents the Nunjucks-flavoured shape of the contract,
split between the macro (server-side) and the client.js (browser).

## Macro

Import and invoke:

```njk
{% from "./theme-picker.njk" import themePicker %}
{{ themePicker({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark", "abyss"]
}) }}
```

### `opts` keys

| Key            | Type                     | Required | Default                                          |
| -------------- | ------------------------ | -------- | ------------------------------------------------ |
| `label`        | `string`                 | yes      | —                                                |
| `themesUrl`    | `string`                 | yes      | —                                                |
| `themes`       | `string[]`               | yes      | —                                                |
| `value`        | `string`                 | no       | `""`                                             |
| `defaultValue` | `string`                 | no       | `""`                                             |
| `storageKey`   | `string`                 | no       | `""`                                             |
| `name`         | `string`                 | no       | `"theme"`                                        |
| `extension`    | `string`                 | no       | `".css"`                                         |
| `themeLabels`  | `Record<string,string>`  | no       | `{}`                                             |
| `classes`      | `string`                 | no       | `""`                                             |
| `attributes`   | `Record<string,string>`  | no       | `{}`                                             |

The macro emits the `data-lily-theme-picker-*` configuration
attributes the client.js reads on init. `opts.attributes` is spread
onto the root after those so consumers can override `id`,
`data-testid`, etc.

## Client.js exports

`theme-picker.client.js` is an ES module:

```js
export function normaliseThemesUrl(themesUrl: string): string;
export function themeHref(
    themesUrl: string,
    slug: string,
    extension: string,
): string;
export function initThemePicker(
    root: HTMLElement,
    opts?: {
        onChange?: (slug: string) => void;
        target?: HTMLElement | null;
    },
): { setTheme: (slug: string) => void; destroy: () => void };
export function autoInit(
    opts?: {
        onChange?: (slug: string) => void;
        target?: HTMLElement | null;
    },
): Array<{ setTheme: (slug: string) => void; destroy: () => void }>;
```

`autoInit()` is the common entry point; `initThemePicker(root)` is
useful when the consumer already has a reference to a single
fieldset (e.g. inside another component's lifecycle).

### Pure helpers

```js
normaliseThemesUrl("/x");      // "/x/"
normaliseThemesUrl("/x/");     // "/x/"
themeHref("/x/", "dark", ".css"); // "/x/dark.css"
themeHref("/x",  "dark", ".css"); // "/x/dark.css"  (normaliseThemesUrl applied internally)
```

Both are side-effect-free; consumers can call them from tests,
server code, or other modules without instantiating the picker.

### Controller

`initThemePicker(root)` returns:

| Property    | Type                       | Notes                                              |
| ----------- | -------------------------- | -------------------------------------------------- |
| `setTheme`  | `(slug: string) => void`   | Apply a theme imperatively; mirrors a radio click. |
| `destroy`   | `() => void`               | Remove the `change` listener; keeps applied DOM.   |

`destroy()` does **not** restore the previous theme or remove the
managed `<link>`. The intent is that a picker can be unmounted
(e.g. when navigating away from a settings page) without
visually reverting the theme.

## Optional client opts

```ts
type ClientOpts = {
    onChange?: (slug: string) => void;
    target?: HTMLElement | null;
};
```

- `onChange(slug)` — fired after every successful apply. Use it for
  analytics, server sync, cookie writes.
- `target` — element receiving `data-theme`. Defaults to
  `document.documentElement`. Pass a sub-tree root when you want
  per-region themes.

These are runtime-only and have no macro counterpart; the macro
emits the same markup regardless.

## DOM contract

Root element (macro output):

```html
<fieldset
    class="theme-picker {classes}"
    role="radiogroup"
    aria-label="{label}"
    data-lily-theme-picker-root
    data-lily-theme-picker-name="{name}"
    data-lily-theme-picker-themes-url="{themesUrl}"
    data-lily-theme-picker-extension="{extension}"
    data-lily-theme-picker-storage-key="{storageKey}"
    data-lily-theme-picker-default-value="{defaultValue}"
>
    <!-- per-slug option markup -->
</fieldset>
```

Default option markup (one per `themes` entry):

```html
<label class="theme-picker-option">
    <input type="radio" name="{name}" value="{slug}" {checked when value===slug} />
    <span class="theme-picker-option-label">{labelFor(slug)}</span>
</label>
```

Document mutations (only inside `initThemePicker` and subsequent
events):

```html
<!-- in document.head -->
<link rel="stylesheet" data-lily-theme-picker="{name}" href="{themesUrl}{slug}{extension}" />
```

```html
<!-- on the resolved target (default <html>) -->
<html data-theme="{slug}">
```

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
(rename, removal, type narrowing of an existing opt or export)
bumps the minor version while v0.x; once v1.0 ships, breaking
changes bump the major.
