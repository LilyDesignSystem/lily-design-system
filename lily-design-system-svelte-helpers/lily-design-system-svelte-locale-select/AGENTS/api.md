# API — LocaleSelect (Svelte)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Svelte 5-flavoured shape of the contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export {
    default,
    default as LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./LocaleSelect.svelte";
export type { Props, ChildArgs } from "./LocaleSelect.svelte";
```

A consumer can import either the component or the pure helpers:

```ts
import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    type Props,
    type ChildArgs,
} from "lily-design-system-svelte-locale-select";
```

## Props

| Prop                  | Type                     | Required | Default                                              |
| --------------------- | ------------------------ | -------- | ---------------------------------------------------- |
| `label`               | `string`                 | yes      | —                                                    |
| `locales`             | `string[]`               | yes      | —                                                    |
| `value`               | `string` (bindable)      | no       | `""`                                                 |
| `defaultValue`        | `string`                 | no       | `undefined` (resolves to `"en"` or `locales[0]`)     |
| `storageKey`          | `string`                 | no       | `undefined`                                          |
| `detectFromNavigator` | `boolean`                | no       | `false`                                              |
| `name`                | `string`                 | no       | `"locale"`                                           |
| `target`              | `HTMLElement \| null`    | no       | `undefined` (resolves to `document.documentElement`) |
| `applyDir`            | `boolean`                | no       | `true`                                               |
| `localeLabels`        | `Record<string, string>` | no       | `{}`                                                 |
| `children`            | `Snippet<[ChildArgs]>`   | no       | the globe glyph                                      |
| `onChange`            | `(locale: string) => void` | no     | `undefined`                                          |
| `class`               | `string`                 | no       | `""`                                                 |

**There is no `placeholder` prop.** It was removed with the native
`<select>`; do not reintroduce it.

`value` is two-way bindable via `bind:value`. Other attributes
(`id`, `data-*`, event handlers) fall through to the root `<div>` via
the `{...restProps}` spread — note they land on the root, **not** on
the button, so `aria-labelledby` and friends need deliberate handling.

## Callbacks

The select uses a callback prop, not an event dispatcher:

```ts
onChange?: (locale: string) => void;
```

`onChange` fires every time the select successfully applies a
locale:

- after a listbox selection (click, or `Enter` / `Space` on the active
  option), with the new code,
- once when `$effect` resolves the initial value, with the resolved
  code.

Use it for analytics, server cookie writes, or for telling your
i18n library to load message bundles.

The argument is the **consumer-form** code (the literal string from
the `locales` array — `en_US` if you put `en_US` in the array). The
DOM `lang` attribute is BCP 47-normalised (`en-US`), but the
callback payload and the bindable `value` preserve the consumer
form so round-trips are lossless.

## Children snippet

The `children` prop is typed as `Snippet<[ChildArgs]>` and **replaces
the glyph inside the trigger button**. It does not render options —
the listbox and its `<li role="option">` children are component-owned.

```ts
export type ChildArgs = {
    /** Currently selected locale code (consumer form, not BCP 47-normalised). */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a locale code to its display label. */
    labelFor: (locale: string) => string;
};
```

The pre-listbox shape — `{ locales, value, setLocale, name, labelFor,
tagFor, isRtl }` — is gone. `tagFor` and `isRtl` live on as the
exported pure helpers `bcp47LocaleTag` and `isRtlLocale`; to change
the locale programmatically, write to the bindable `value`.

Consumers consume it via a `{#snippet}` block:

```svelte
<LocaleSelect
    label="Language"
    locales={["en", "fr", "ar"]}
    localeLabels={{ en: "English", fr: "Français", ar: "العربية" }}
>
    {#snippet children({ value, open, labelFor })}
        <span aria-hidden="true">🌐︎</span>
        <span class="locale-select-text" lang={bcp47LocaleTag(value)}>
            {labelFor(value)}
        </span>
        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
    {/snippet}
</LocaleSelect>
```

When no snippet is supplied, the button renders
`<span class="locale-select-icon" aria-hidden="true">🌐︎</span>`. When
one is supplied, that span is not emitted.

The snippet's output lives inside a `<button>`, so it must not contain
interactive elements.

## Pure helpers

Exported from the `<script lang="ts" module>` block:

```ts
export function bcp47LocaleTag(locale: string): string;
export function isRtlLocale(locale: string): boolean;
export function localeName(locale: string): string;
export function matchNavigatorLanguage(
    navLangs: readonly string[],
    locales: readonly string[],
): string | "";
export function nextLocaleSelectId(): string;
// + the constants:
export const GLOBE_WITH_MERIDIANS: string;  // "\u{1F310}︎"
export const defaultLocaleLabels: Record<string, string>;
export const RTL_LANGUAGE_TAGS: ReadonlySet<string>;
export const RTL_SCRIPT_SUBTAGS: ReadonlySet<string>;
```

`GLOBE_WITH_MERIDIANS` and `nextLocaleSelectId` are **not** in the
`index.ts` barrel; import them from `../LocaleSelect.svelte` directly.

`nextLocaleSelectId()` increments a module counter to produce stable,
unique, SSR-safe id prefixes. Never replace it with `Math.random()` or
`Date.now()`.

`GLOBE_WITH_MERIDIANS` is U+1F310 **plus U+FE0E VARIATION
SELECTOR-15**. VS15 forces text presentation; without it browsers pick
the colour-emoji font and the globe renders blue, mismatching
`theme-select`'s monochrome `◑`. Do not drop it. Note it is three code
units (a surrogate pair plus the selector), so anything measuring or
truncating it by `.length` will get it wrong.

| Helper                  | Purpose                                                              |
| ----------------------- | -------------------------------------------------------------------- |
| `bcp47LocaleTag`        | `"en_US"` → `"en-US"`. RFC 5646 hyphen normalisation.                |
| `isRtlLocale`           | Detect RTL by language subtag or script subtag (case-insensitive).   |
| `localeName`            | Look up the English name from the built-in 436-row table.            |
| `matchNavigatorLanguage`| Two-step exact-then-prefix match against a supported-locales list.   |
| `defaultLocaleLabels`   | The 436-row built-in label table itself.                             |
| `RTL_LANGUAGE_TAGS`     | Set of language subtags treated as RTL (`ar`, `he`, `fa`, etc.).     |
| `RTL_SCRIPT_SUBTAGS`    | Set of script subtags treated as RTL (`arab`, `hebr`, `nkoo`, etc.). |

All pure functions are side-effect-free; consumers can call them
from tests, server code (`hooks.server.ts`), or other components
without instantiating the select.

## DOM contract

```html
<div class="locale-select {class}" ...restProps>
    <input type="hidden" name="{name}" value="{value}" />
    <button type="button" class="locale-select-button" aria-label="{label}"
            aria-haspopup="listbox" aria-expanded="false" aria-controls="{listId}">
        <span class="locale-select-icon" aria-hidden="true">🌐︎</span>
        <!-- or the children snippet output -->
    </button>
    <ul class="locale-select-list" id="{listId}" role="listbox" aria-label="{label}"
        tabindex="-1" hidden aria-activedescendant="{active optionId while open}">
        <li class="locale-select-option" id="{optionId}" role="option"
            aria-selected="true|false" data-active lang="{bcp47LocaleTag(code)}">
            {labelFor(code)}
        </li>
    </ul>
</div>
```

The hidden input carries the **consumer-form** code for form
submission. Only the `lang` attributes are BCP 47-normalised.

Document mutations (only inside `$effect`):

```html
<html lang="{tagFor(locale)}" dir="rtl|ltr">
```

`dir` is only written when `applyDir` is `true` (the default).

## Type re-exports

`Props` and `ChildArgs` are re-exported from `index.ts` so consumers
can type their wrapping code:

```ts
import type { Props, ChildArgs } from "lily-design-system-svelte-locale-select";

const config: Pick<Props, "locales" | "storageKey" | "detectFromNavigator"> = {
    locales: ["en", "fr", "ar"],
    storageKey: "my-app:locale",
    detectFromNavigator: true,
};
```

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
(rename, removal, type narrowing of an existing prop) bumps the
minor version while v0.x; once v1.0 ships, breaking changes bump
the major.
