# API — ThemeChooser (Nunjucks)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Nunjucks-flavoured shape of the contract,
split between the macro (server-side) and the client.js (browser).

## Macro

Import and invoke:

```njk
{% from "./theme-chooser.njk" import themeChooser %}
{{ themeChooser({
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
| `id`           | `string`                 | no       | `"theme-chooser-{name}"`                          |
| `classes`      | `string`                 | no       | `""`                                             |
| `attributes`   | `Record<string,string>`  | no       | `{}`                                             |

The macro emits a `<div>` root carrying the
`data-lily-theme-chooser-*` configuration attributes the client.js
reads on init; the `name` rides on the hidden input inside it.
`opts.attributes` is spread onto the root after those so consumers
can override `id`, `data-testid`, etc.

`id` is the id prefix for the listbox (`{id}-list`) and its options
(`{id}-option-{index}`). Nunjucks macros cannot hold a module-level
counter, so an explicit `id` is this framework's stable-id
mechanism: two instances that share a `name` MUST be given distinct
`id`s or their listbox and option ids collide.

### Caller block

A `{% call %}` block body replaces the default glyph **inside the
button**. It does not render options.

```njk
{% call themeChooser({label: "Theme", themesUrl: "/t/", themes: ["light", "dark"]}) %}
    <svg aria-hidden="true" focusable="false">…</svg>
{% endcall %}
```

## Client.js exports

`theme-chooser.client.js` is an ES module:

```js
export const CIRCLE_WITH_RIGHT_HALF_BLACK: string; // "◑" (U+25D1)
export function normaliseThemesUrl(themesUrl: string): string;
export function themeHref(
    themesUrl: string,
    slug: string,
    extension: string,
): string;
export function initThemeChooser(
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

`autoInit()` is the common entry point; `initThemeChooser(root)` is
useful when the consumer already has a reference to a single root
`<div>` (e.g. inside another component's lifecycle).

`CIRCLE_WITH_RIGHT_HALF_BLACK` is the code point the macro renders
as the default button glyph, exported so tests and custom
renderings can reference it without re-typing it.

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

`initThemeChooser(root)` returns:

| Property    | Type                       | Notes                                              |
| ----------- | -------------------------- | -------------------------------------------------- |
| `setTheme`  | `(slug: string) => void`   | Apply a theme imperatively; same code path as choosing an option (link swap, `data-theme`, storage, hidden input, `aria-selected`, `onChange`). |
| `destroy`   | `() => void`               | Remove every listener (button, listbox, root `focusout`, document `click`) and clear the typeahead timer; keeps applied DOM. |

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

Macro output:

```html
<div
    class="theme-chooser {classes}"
    data-lily-theme-chooser-root
    data-lily-theme-chooser-name="{name}"
    data-lily-theme-chooser-themes-url="{themesUrl}"
    data-lily-theme-chooser-extension="{extension}"
    data-lily-theme-chooser-storage-key="{storageKey}"
    data-lily-theme-chooser-default-value="{defaultValue}"
    data-lily-theme-chooser-value="{value}"   <!-- only when opts.value is set -->
>
    <input type="hidden" name="{name}" value="{selected}" data-lily-theme-chooser-input>
    <button type="button" class="theme-chooser-button" aria-label="{label}"
            aria-haspopup="listbox" aria-expanded="false" aria-controls="{id}-list"
            data-lily-theme-chooser-button>
        <span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>
    </button>
    <ul class="theme-chooser-list" id="{id}-list" role="listbox" aria-label="{label}"
        tabindex="-1" hidden data-lily-theme-chooser-list>
        <li class="theme-chooser-option" id="{id}-option-{index}" role="option"
            aria-selected="true|false" data-value="{slug}">{labelFor(slug)}</li>
        <!-- one <li> per themes entry -->
    </ul>
</div>
```

The glyph is U+25D1 CIRCLE WITH RIGHT HALF BLACK, wrapped in
`aria-hidden="true"`. The button is icon-only, so `aria-label` is its
**only** accessible name. A `{% call %}` block body replaces the
`<span class="theme-chooser-icon">` and nothing else.

`{selected}` is the server-side resolution
`value or defaultValue or ("light" if present else themes[0])`.
Exactly one `<li>` carries `aria-selected="true"`; every other one
carries `"false"` explicitly. The hidden input is pre-filled with the
same slug, so a no-JS form submit still carries a theme.

`opts.value` reaches the client through the
`data-lily-theme-chooser-value` attribute, and that remains the only
channel for it. The attribute is omitted entirely when `opts.value`
is empty.

The client may correct the server's choice after hydration:
`localStorage` and `matchMedia` are both client-only, so a stored
theme or a detected system preference can resolve to something the
macro could not know about. `value` itself is never corrected away —
it is the FIRST input in the client's resolution order, ahead of
storage. (It used to sit behind storage; that was the outlier this
catalog carried, and it is fixed. See `AGENTS/lifecycle.md`.)

**No-JS caveat.** The button does not open the listbox until the
client.js has run — open / close, focus movement, and the keyboard
contract are all client-side. Nothing in the server markup
substitutes for them. State this plainly wherever progressive
enhancement comes up; it is a real regression from the native
`<select>` the macro used to render.

Client mutations on the root (only inside `initThemeChooser` and
subsequent events):

- `button[aria-expanded]` toggles `"true"` / `"false"`.
- `ul[hidden]` is removed on open, restored on close.
- `ul[aria-activedescendant]` points at the active option's id while
  open, and is removed on close.
- `li[data-active]` marks the active option (a consumer CSS hook;
  `aria-activedescendant` is the assistive-technology channel).
- `li[aria-selected]` tracks the **applied** theme, not the active
  option.
- `input[value]` mirrors the applied slug.

Document mutations (likewise client-only):

```html
<!-- in document.head -->
<link rel="stylesheet" data-lily-theme-chooser="{name}" href="{themesUrl}{slug}{extension}" />
```

```html
<!-- on the resolved target (default <html>) -->
<html data-theme="{slug}">
```

## Versioning

The API surface above is the current unreleased contract, which
breaks 0.3.0: the root element changed from `<select>` to `<div>`,
the `placeholder` opt was removed, and `id` was added. See
[CHANGELOG.md](../CHANGELOG.md). Any breaking change (rename,
removal, type narrowing of an existing opt or export) bumps the minor
version while v0.x; once v1.0 ships, breaking changes bump the major.
