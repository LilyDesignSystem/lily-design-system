# API — `<theme-select>` (HTML helper)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the custom-element-flavoured shape of the
contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export {
    ThemeSelect,
    normalizeThemesUrl,
    themeHref,
    type ThemeSelectProps,
    type ThemeSelectChangeDetail,
} from "./theme-select";
```

It additionally performs the side-effectful registration:

```ts
if (typeof customElements !== "undefined" && !customElements.get("theme-select")) {
    customElements.define("theme-select", ThemeSelect);
}
```

A consumer can import either form:

```ts
// Side-effect only — registers <theme-select> globally:
import "./lily-design-system-html-theme-select";

// Or grab the class + helpers + types:
import {
    ThemeSelect,
    normalizeThemesUrl,
    themeHref,
    type ThemeSelectProps,
    type ThemeSelectChangeDetail,
} from "./lily-design-system-html-theme-select";
```

## Observed attributes

| Attribute       | Type            | Required | Default                                          |
| --------------- | --------------- | -------- | ------------------------------------------------ |
| `label`         | `string`        | yes      | —                                                |
| `placeholder`   | `string`        | no       | value of `label`                                 |
| `themes-url`    | `string`        | yes      | —                                                |
| `themes`        | `string` (CSV)  | yes      | —                                                |
| `value`         | `string`        | no       | `""`                                             |
| `default-value` | `string`        | no       | resolves to `"light"` or `themes[0]`             |
| `storage-key`   | `string`        | no       | absent                                           |
| `name`          | `string`        | no       | `"theme"`                                        |
| `extension`     | `string`        | no       | `".css"`                                         |
| `theme-labels`  | `string` (JSON) | no       | `"{}"`                                           |
| `class`         | `string`        | no       | `""`                                             |

`label`, `themes-url`, and `themes` are required; the select silently
no-ops if any is missing at render time, but the spec only
guarantees behaviour when all three are set.

## JS property mirrors

| Property          | Type                     | Notes                                              |
| ----------------- | ------------------------ | -------------------------------------------------- |
| `el.label`        | `string`                 | round-trips with `label` attribute                 |
| `el.placeholder`  | `string`                 | round-trips with `placeholder`; falls back to `el.label` |
| `el.themesUrl`    | `string`                 | round-trips with `themes-url`                      |
| `el.themes`       | `string[]`               | CSV-encoded in the `themes` attribute              |
| `el.value`        | `string`                 | round-trips with `value`                           |
| `el.defaultValue` | `string`                 | round-trips with `default-value`                   |
| `el.storageKey`   | `string`                 | round-trips with `storage-key`                     |
| `el.name`         | `string`                 | round-trips with `name`                            |
| `el.extension`    | `string`                 | round-trips with `extension`                       |
| `el.themeLabels`  | `Record<string, string>` | JSON-encoded in `theme-labels`                     |
| `el.target`       | `HTMLElement \| null`    | no attribute form — JS-only                        |

Setting an array property writes back the CSV-encoded attribute,
which feeds back through `attributeChangedCallback`. Setting an
object property writes back the JSON-encoded attribute.

## Events

The element fires `themechange` after every successful apply:

```ts
el.addEventListener("themechange", (e) => {
    const { theme } = (e as CustomEvent<ThemeSelectChangeDetail>).detail;
});
```

| Property     | Value                                       |
| ------------ | ------------------------------------------- |
| `type`       | `"themechange"`                             |
| `detail`     | `{ theme: string }`                         |
| `bubbles`    | `true`                                      |
| `composed`   | `true`                                      |
| `cancelable` | `false`                                     |

`bubbles: true` enables event delegation; `composed: true` lets the
event cross shadow-DOM boundaries (for consumers who wrap the
select in their own shadow root).

## Custom rendering by subclassing

`<theme-select>` doesn't expose Vue-style scoped slots or Svelte
snippets. The customisation surface is subclassing:

```ts
import { ThemeSelect } from "./theme-select";

class SwatchPicker extends ThemeSelect {
    // Override how options render; the lifecycle (link swap,
    // data-theme write, themechange event) stays on the superclass.
    //
    // Implementation: override the private #render() via a protected
    // hook, OR override connectedCallback / attributeChangedCallback
    // to call super and then post-process the children.
}
customElements.define("swatch-picker", SwatchPicker);
```

See [`../docs/custom-rendering.md`](../docs/custom-rendering.md) for
the full pattern.

## Pure helpers

Two pure helpers exported from `theme-select.ts`:

```ts
export function normalizeThemesUrl(themesUrl: string): string;
export function themeHref(themesUrl: string, slug: string, extension: string): string;
```

`normalizeThemesUrl(s)` ensures `s` ends with exactly one `/`.
`themeHref(url, slug, ext)` concatenates the three to build the
final stylesheet href.

Both are pure and side-effect-free; consumers can call them from
tests, server code, or other components without instantiating the
select.

## DOM contract

Host element (lifecycle container):

```html
<theme-select
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark"
    value="light"
>
    <!-- rendered children below -->
</theme-select>
```

Rendered children (recreated on every `#render()`):

```html
<select class="theme-select {class}" aria-label="{label}" name="{name}">
    <option class="theme-select-option theme-select-placeholder" value="" selected>{placeholder ?? label}</option>
    <option class="theme-select-option" value="light">Light</option>
    <option class="theme-select-option" value="dark">Dark</option>
</select>
```

The leading placeholder is component-owned and is the only option
ever marked `selected`. The `<select>`'s own `value` is always `""`:
the `change` handler reads the chosen slug, resets `select.value` to
`""`, then assigns `this.value`. Read the selection from `el.value`
or the `themechange` detail, never from the rendered `<select>`.

Document mutations (only inside `connectedCallback` /
`attributeChangedCallback`):

```html
<link rel="stylesheet" data-lily-theme-select="{name}" href="{themesUrl}{slug}{extension}">
```

And on the resolved target:

```html
<html data-theme="{slug}">
```

## Type re-exports

`ThemeSelectProps` and `ThemeSelectChangeDetail` are re-exported
from `index.ts` so consumers can type their wrapping code:

```ts
import type {
    ThemeSelectProps,
    ThemeSelectChangeDetail,
} from "./lily-design-system-html-theme-select";

const config: Pick<ThemeSelectProps, "themesUrl" | "themes" | "storageKey"> = {
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"],
    storageKey: "my-app:theme",
};
```

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
(rename, removal, type narrowing of an existing attribute) bumps
the minor version while v0.x; once v1.0 ships, breaking changes
bump the major.
