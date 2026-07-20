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
    nextThemeSelectId,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
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
    nextThemeSelectId,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
    type ThemeSelectProps,
    type ThemeSelectChangeDetail,
} from "./lily-design-system-html-theme-select";
```

## Observed attributes

| Attribute       | Type            | Required | Default                                          |
| --------------- | --------------- | -------- | ------------------------------------------------ |
| `label`         | `string`        | yes      | —                                                |
| `themes-url`    | `string`        | yes      | —                                                |
| `themes`        | `string` (CSV)  | yes      | —                                                |
| `value`         | `string`        | no       | `""`                                             |
| `default-value` | `string`        | no       | resolves to `"light"` or `themes[0]`             |
| `storage-key`   | `string`        | no       | absent                                           |
| `name`          | `string`        | no       | `"theme"`                                        |
| `extension`     | `string`        | no       | `".css"`                                         |
| `theme-labels`  | `string` (JSON) | no       | `"{}"`                                           |
| `class`         | `string`        | no       | `""`                                             |

`label`, `themes-url`, and `themes` are required; the control
silently no-ops if any is missing at render time, but the spec only
guarantees behaviour when all three are set.

There is no `placeholder` attribute. It existed in 0.3.0 to pin the
displayed text of a native `<select>`; that `<select>` is gone.

## JS property mirrors

| Property          | Type                     | Notes                                              |
| ----------------- | ------------------------ | -------------------------------------------------- |
| `el.label`        | `string`                 | round-trips with `label` attribute                 |
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

## Listbox state and methods

| Member                      | Type      | Notes                                                     |
| --------------------------- | --------- | ---------------------------------------------------------- |
| `el.open`                   | `boolean` | Read-only. Whether the listbox is open.                    |
| `el.listId`                 | `string`  | Read-only. id of the rendered `<ul role="listbox">`.       |
| `el.optionId(index)`        | `string`  | id of the rendered option at `index`.                      |
| `el.openList(startIndex?)`  | `void`    | Open the list; `startIndex` overrides the active option (default: the selected one, else 0). Moves focus to the `<ul>`. No-op when `themes` is empty. |
| `el.closeList(refocus?)`    | `void`    | Close the list. Returns focus to the button unless `refocus` is `false`. |
| `el.labelFor(slug)`         | `string`  | Display label for a slug — `themeLabels[slug]`, else the title-cased slug. |
| `el.renderButtonContent()`  | `Node`    | Overridable hook building the button's content. See below.  |

ids come from `nextThemeSelectId()`, a module-level counter, so they
are unique per instance, stable across runs, and SSR-safe — no
`Math.random()`, no `Date.now()`.

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
snippets — `<slot>` is Shadow DOM only and these helpers commit to
light DOM. The customisation surface is subclassing, in two tiers.

**Tier 1 — override `renderButtonContent()`.** This is the direct
analogue of the `children` snippet / render prop / slot the other
frameworks pass, and the recommended path: the base class still
builds the button and the listbox, so all the aria wiring and the
whole keyboard contract keep working.

```ts
import { ThemeSelect } from "./theme-select";

class MyThemeSelect extends ThemeSelect {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.textContent = this.labelFor(this.value);  // ChildArgs.value + labelFor
        span.dataset.open = String(this.open);          // ChildArgs.open
        return span;
    }
}
customElements.define("my-theme-select", MyThemeSelect);
```

**Tier 2 — replace the rendering.** `#render()` is a private field
and genuinely cannot be overridden; a subclass wanting a different
structure post-processes after `super.connectedCallback()` and
takes over the entire accessibility contract in doing so.

See [`../docs/custom-rendering.md`](../docs/custom-rendering.md) for
both tiers and the invariants Tier 2 must preserve.

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
<div class="theme-select {class}">
    <input type="hidden" name="{name}" value="light" />
    <button type="button" class="theme-select-button"
            aria-label="{label}" aria-haspopup="listbox"
            aria-expanded="false" aria-controls="theme-select-1-list">
        <span class="theme-select-icon" aria-hidden="true">◑</span>
    </button>
    <ul class="theme-select-list" id="theme-select-1-list" role="listbox"
        aria-label="{label}" tabindex="-1" hidden>
        <li class="theme-select-option" id="theme-select-1-option-0"
            role="option" aria-selected="true" data-active>Light</li>
        <li class="theme-select-option" id="theme-select-1-option-1"
            role="option" aria-selected="false">Dark</li>
    </ul>
</div>
```

`aria-activedescendant` is present on the `<ul>` only while open and
points at the active option's id. `data-active` marks the
keyboard-highlighted option; `aria-selected` marks the chosen one —
they are different things. The glyph is `aria-hidden="true"` so the
accessible name comes from `aria-label` alone. Read the selection
from `el.value` or the `themechange` detail.

Only the markup-affecting attributes (`themes`, `theme-labels`,
`label`, `name`, `class`) trigger a rebuild. A `value` change syncs
`aria-expanded`, `hidden`, `aria-activedescendant`, per-option
`aria-selected` / `data-active`, and the hidden input's value in
place, so an open list keeps its focus and active descendant.

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
