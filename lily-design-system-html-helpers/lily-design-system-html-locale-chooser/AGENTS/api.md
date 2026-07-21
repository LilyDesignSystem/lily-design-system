# API — `<locale-chooser>` (HTML helper)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the custom-element-flavoured shape of the
contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export {
    LocaleChooser,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
    nextLocaleChooserId,
    GLOBE_WITH_MERIDIANS,
    type LocaleChooserProps,
    type LocaleChooserChangeDetail,
} from "./locale-chooser";
```

`GLOBE_WITH_MERIDIANS` is the default button glyph (U+1F310 followed
by U+FE0E VARIATION SELECTOR-15 — two codepoints; VS15 forces the
monochrome text presentation).
`nextLocaleChooserId()` is the module-level id counter that produces
the `listId` / `optionId` prefixes — deterministic and SSR-safe, no
`Math.random()` or `Date.now()`.

It additionally performs the side-effectful registration:

```ts
if (typeof customElements !== "undefined" && !customElements.get("locale-chooser")) {
    customElements.define("locale-chooser", LocaleChooser);
}
```

A consumer can import either form:

```ts
// Side-effect only — registers <locale-chooser> globally:
import "./lily-design-system-html-locale-chooser";

// Or grab the class + helpers + types:
import {
    LocaleChooser,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    GLOBE_WITH_MERIDIANS,
    type LocaleChooserProps,
    type LocaleChooserChangeDetail,
} from "./lily-design-system-html-locale-chooser";
```

## Observed attributes

| Attribute               | Type            | Required | Default                                  |
| ----------------------- | --------------- | -------- | ---------------------------------------- |
| `label`                 | `string`        | yes      | —                                        |
| `locales`               | `string` (CSV)  | yes      | —                                        |
| `value`                 | `string`        | no       | `""`                                     |
| `default-value`         | `string`        | no       | resolves to `"en"` or `locales[0]`       |
| `storage-key`           | `string`        | no       | absent                                   |
| `detect-from-navigator` | boolean attr    | no       | absent (`false`)                         |
| `name`                  | `string`        | no       | `"locale"`                               |
| `apply-dir`             | boolean attr    | no       | absent (`true`); `"false"` opts out      |
| `locale-labels`         | `string` (JSON) | no       | `"{}"`                                   |
| `class`                 | `string`        | no       | `""`                                     |

`label` and `locales` are required. `label` is applied as
`aria-label` to **both** the button and the listbox; because the
control is icon-only it is the only accessible name that exists.

There is **no `placeholder` attribute**. It was a 0.3.0 mechanism for
pinning a native `<select>`'s displayed text; there is no `<select>`
left to pin.

The boolean-attribute convention follows HTML: presence is truthy
unless the literal value is `"false"`; absence is the default (which
is `false` for `detect-from-navigator` and `true` for `apply-dir`).

## JS property mirrors

| Property                  | Type                     | Notes                                              |
| ------------------------- | ------------------------ | -------------------------------------------------- |
| `el.label`                | `string`                 | round-trips with `label`                           |
| `el.locales`              | `string[]`               | CSV-encoded in `locales`                           |
| `el.value`                | `string`                 | round-trips with `value` (consumer-form code)      |
| `el.defaultValue`         | `string`                 | round-trips with `default-value`                   |
| `el.storageKey`           | `string`                 | round-trips with `storage-key`                     |
| `el.detectFromNavigator`  | `boolean`                | mirrors boolean attribute                          |
| `el.name`                 | `string`                 | round-trips with `name`; lands on the hidden input |
| `el.applyDir`             | `boolean`                | mirrors boolean attribute                          |
| `el.localeLabels`         | `Record<string, string>` | JSON-encoded in `locale-labels`                    |
| `el.target`               | `HTMLElement \| null`    | no attribute form — JS-only                        |

## Listbox surface

Public members with no attribute form, added with the icon-button +
listbox rendering:

| Member                         | Kind            | Notes                                                                 |
| ------------------------------ | --------------- | --------------------------------------------------------------------- |
| `el.open`                      | getter          | Is the listbox open? Read-only; drive it with `openList` / `closeList`.|
| `el.listId`                    | getter          | `id` of the `<ul role="listbox">`, e.g. `"locale-chooser-1-list"`.      |
| `el.optionId(index)`           | method          | `id` of the option at `index`, e.g. `"locale-chooser-1-option-2"`.      |
| `el.openList(startIndex?)`     | method          | Open; `startIndex` overrides the active option (default: the selected one, else 0). Moves focus to the `<ul>`. |
| `el.closeList(refocus = true)` | method          | Close; refocuses the button unless `refocus` is `false`.               |
| `el.labelFor(code)`            | method          | `localeLabels[code] ?? defaultLocaleLabels[code] ?? Intl.DisplayNames ?? code`. |
| `el.tagFor(locale)`            | method          | Instance wrapper around `bcp47LocaleTag`.                             |
| `el.renderButtonContent()`     | **overridable** | Builds the button's content. See below.                               |

## Events

The element fires `localechange` after every successful apply:

```ts
el.addEventListener("localechange", (e) => {
    const { locale } = (e as CustomEvent<LocaleChooserChangeDetail>).detail;
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
export function nextLocaleChooserId(): string;
export const GLOBE_WITH_MERIDIANS: string;
export const defaultLocaleLabels: Record<string, string>;
export const RTL_LANGUAGE_TAGS: ReadonlySet<string>;
export const RTL_SCRIPT_SUBTAGS: ReadonlySet<string>;
```

All of these except `nextLocaleChooserId` are side-effect-free;
consumers can call them from tests, server code, or other components
without instantiating the select. `nextLocaleChooserId` advances a
module-level counter, so call it only when you actually need an id.

## Custom rendering by subclassing

Light DOM has no `<slot>`, so subclassing is the customisation
surface. Two tiers — full guide in
[`../docs/custom-rendering.md`](../docs/custom-rendering.md).

**Tier 1**, the direct analogue of the other frameworks' `children`
snippet / render prop, and the path to recommend:

```ts
import { LocaleChooser } from "./locale-chooser";

class FlagLocaleChooser extends LocaleChooser {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.textContent = this.labelFor(this.value);  // ChildArgs.value + labelFor
        span.dataset.open = String(this.open);          // ChildArgs.open
        return span;
    }
}
customElements.define("flag-locale-chooser", FlagLocaleChooser);
```

Whatever `Node` it returns replaces the default
`<span class="locale-chooser-icon">` inside the button. The base class
still builds the button and the listbox, so all the aria wiring and
the entire keyboard contract keep working. The hook re-runs on
structural rebuilds (`locales`, `locale-labels`, `label`, `name`,
`class`) **and** on every state sync (a `value` change, each open and
close), so content derived from `this.value` or `this.open` stays
current with no listener needed — matching the reactive `children`
snippet in the other frameworks.

**Tier 2**, post-processing after `super.connectedCallback()`,
replaces the rendering entirely and takes over the whole
accessibility *and* keyboard contract. The invariants it must
preserve are enumerated in
[`../docs/custom-rendering.md`](../docs/custom-rendering.md#invariants-a-tier-2-subclass-must-preserve).

## DOM contract

Host element:

```html
<locale-chooser
    label="Language"
    locales="en,fr,ar"
    value="fr"
></locale-chooser>
```

Rendered children (recreated on every structural `#render()`):

```html
<div class="locale-chooser {class}">
    <input type="hidden" name="{name}" value="fr" />
    <button type="button" class="locale-chooser-button"
            aria-label="{label}" aria-haspopup="listbox"
            aria-expanded="false" aria-controls="locale-chooser-1-list">
        <span class="locale-chooser-icon" aria-hidden="true">&#127760;&#65038;</span>
    </button>
    <ul class="locale-chooser-list" id="locale-chooser-1-list" role="listbox"
        aria-label="{label}" tabindex="-1" hidden>
        <li class="locale-chooser-option" id="locale-chooser-1-option-0"
            role="option" aria-selected="false" lang="en">English</li>
        <li class="locale-chooser-option" id="locale-chooser-1-option-1"
            role="option" aria-selected="true" data-active lang="fr">French</li>
        <li class="locale-chooser-option" id="locale-chooser-1-option-2"
            role="option" aria-selected="false" lang="ar">Arabic</li>
    </ul>
</div>
```

Contract notes:

- Each `<li>` carries `lang="{tagFor(locale)}"` (BCP 47 hyphen form)
  so assistive technology pronounces the option name in its own
  language (WCAG 3.1.2, Language of Parts). **The button and the
  `<ul>` carry no `lang`** — they are not locale-specific.
- The glyph span is `aria-hidden="true"`; the accessible name comes
  from the button's `aria-label` alone.
- `aria-activedescendant` appears on the `<ul>` **only while open**.
- `data-active` (keyboard-highlighted) and `aria-selected` (applied)
  are different things.
- The hidden `<input>` preserves form participation and the `name`.
- Ids come from `nextLocaleChooserId()`, so instances never collide.

Read the selection from `el.value` or the `localechange` detail.

Document mutations (only inside `connectedCallback` /
`attributeChangedCallback`):

```html
<html lang="{tagFor(locale)}" dir="rtl|ltr">
```

`dir` is only written when `applyDir` is `true` (the default).

## Type re-exports

`LocaleChooserProps` and `LocaleChooserChangeDetail` are re-exported
from `index.ts`:

```ts
import type {
    LocaleChooserProps,
    LocaleChooserChangeDetail,
} from "./lily-design-system-html-locale-chooser";

const config: Pick<LocaleChooserProps, "locales" | "storageKey" | "detectFromNavigator"> = {
    locales: ["en", "fr", "ar"],
    storageKey: "my-app:locale",
    detectFromNavigator: true,
};
```

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
bumps the minor version while v0.x; once v1.0 ships, breaking
changes bump the major.
