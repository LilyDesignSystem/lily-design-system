# API — ThemeSelect (Nunjucks)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Nunjucks-flavoured shape of the contract,
split between the macro (server-side) and the client.js (browser).

## Macro

Import and invoke:

```njk
{% from "./theme-select.njk" import themeSelect %}
{{ themeSelect({
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: ["light", "dark", "abyss"]
}) }}
```

### `opts` keys

| Key            | Type                     | Required | Default                                          |
| -------------- | ------------------------ | -------- | ------------------------------------------------ |
| `label`        | `string`                 | yes      | —                                                |
| `placeholder`  | `string`                 | no       | value of `label`                                 |
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

The macro emits a `<select>` carrying the `name` attribute and the
`data-lily-theme-select-*` configuration attributes the client.js
reads on init. `opts.attributes` is spread onto the root after those
so consumers can override `id`, `data-testid`, etc.

## Client.js exports

`theme-select.client.js` is an ES module:

```js
export function normaliseThemesUrl(themesUrl: string): string;
export function themeHref(
    themesUrl: string,
    slug: string,
    extension: string,
): string;
export function initThemeSelect(
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

`autoInit()` is the common entry point; `initThemeSelect(root)` is
useful when the consumer already has a reference to a single
`<select>` (e.g. inside another component's lifecycle).

### Pure helpers

```js
normaliseThemesUrl("/x");      // "/x/"
normaliseThemesUrl("/x/");     // "/x/"
themeHref("/x/", "dark", ".css"); // "/x/dark.css"
themeHref("/x",  "dark", ".css"); // "/x/dark.css"  (normaliseThemesUrl applied internally)
```

Both are side-effect-free; consumers can call them from tests,
server code, or other modules without instantiating the select.

### Controller

`initThemeSelect(root)` returns:

| Property    | Type                       | Notes                                              |
| ----------- | -------------------------- | -------------------------------------------------- |
| `setTheme`  | `(slug: string) => void`   | Apply a theme imperatively; same code path as a select change (and likewise leaves `select.value` at `""`). |
| `destroy`   | `() => void`               | Remove the `change` listener; keeps applied DOM.   |

`destroy()` does **not** restore the previous theme or remove the
managed `<link>`. The intent is that a select can be unmounted
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
<select
    class="theme-select {classes}"
    aria-label="{label}"
    name="{name}"
    data-lily-theme-select-root
    data-lily-theme-select-name="{name}"
    data-lily-theme-select-themes-url="{themesUrl}"
    data-lily-theme-select-extension="{extension}"
    data-lily-theme-select-storage-key="{storageKey}"
    data-lily-theme-select-default-value="{defaultValue}"
    data-lily-theme-select-value="{value}"   <!-- only when opts.value is set -->
>
    <!-- placeholder option, then per-slug option markup -->
</select>
```

The FIRST child is always the component-owned placeholder option, and
it is the **only** option ever rendered `selected`:

```html
<option class="theme-select-option theme-select-placeholder" value="" selected>{placeholder ?? label}</option>
```

Then the default option markup (one per `themes` entry) — never
`selected`, whatever `opts.value` is:

```html
<option class="theme-select-option" value="{slug}">{labelFor(slug)}</option>
```

`opts.value` reaches the client through the
`data-lily-theme-select-value` attribute instead. Rendering `selected`
on the matching option would make the browser (which honours the
*last* `selected` option) paint the theme name until the client snapped
it back — a visible flash on every load.

The `<select>`'s own `value` is always `""`: the client snaps it back
to the placeholder after every apply, so the closed control reads the
placeholder word rather than the active theme name. Read the active
theme from `data-theme` or from the `onChange(slug)` argument.

Document mutations (only inside `initThemeSelect` and subsequent
events):

```html
<!-- in document.head -->
<link rel="stylesheet" data-lily-theme-select="{name}" href="{themesUrl}{slug}{extension}" />
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
